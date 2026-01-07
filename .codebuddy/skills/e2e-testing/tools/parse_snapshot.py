#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
页面快照解析工具

解析 Playwright/Chrome DevTools 生成的页面快照，提取可交互元素信息。
辅助 POM 生成，提取元素 ID、选择器、类型等信息。

用法:
    # 解析快照文件
    python3 parse_snapshot.py snapshot.txt
    
    # 输出为 YAML 格式
    python3 parse_snapshot.py snapshot.txt -o elements.yaml
    
    # 输出为 JSON 格式
    python3 parse_snapshot.py snapshot.txt -o elements.json
    
    # 仅提取指定类型的元素
    python3 parse_snapshot.py snapshot.txt --types button,input,link

依赖:
    pip install pyyaml (可选，用于 YAML 输出)
"""

import sys
from pathlib import Path

# 统一使用 encoding_utils 进行编码处理
sys.path.insert(0, str(Path(__file__).parent))
from encoding_utils import setup_encoding
setup_encoding()

import os
import re
import json
import argparse
import logging
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Set, Tuple

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


@dataclass
class ElementInfo:
    """元素信息"""
    uid: str                    # 快照中的 uid
    role: str                   # 角色类型
    name: str                   # 元素名称/文本
    selector: str               # 推荐的选择器
    locator_type: str           # 定位类型
    element_type: str           # 元素类型
    attributes: Dict[str, str]  # 属性
    
    def to_dict(self) -> Dict:
        return asdict(self)


class SnapshotParser:
    """快照解析器"""
    
    # 角色到元素类型的映射
    ROLE_TO_TYPE = {
        "button": "button",
        "link": "link",
        "textbox": "input",
        "checkbox": "checkbox",
        "radio": "radio",
        "combobox": "select",
        "listbox": "select",
        "option": "option",
        "menuitem": "menuitem",
        "tab": "tab",
        "tabpanel": "tabpanel",
        "dialog": "dialog",
        "alert": "alert",
        "alertdialog": "dialog",
        "img": "image",
        "image": "image",
        "heading": "heading",
        "table": "table",
        "row": "row",
        "cell": "cell",
        "columnheader": "columnheader",
        "rowheader": "rowheader",
        "navigation": "navigation",
        "main": "main",
        "form": "form",
        "search": "search",
        "searchbox": "input",
        "generic": "generic",
        "text": "text",
        "paragraph": "text",
        "list": "list",
        "listitem": "listitem",
        "banner": "banner",
        "contentinfo": "contentinfo",
        "complementary": "complementary",
        "region": "region",
        "article": "article",
        "spinbutton": "input",
        "slider": "input",
        "switch": "checkbox",
        "progressbar": "progressbar",
        "status": "status",
        "tooltip": "tooltip",
        "menu": "menu",
        "menubar": "menubar",
        "toolbar": "toolbar",
        "tree": "tree",
        "treeitem": "treeitem",
        "grid": "table",
        "gridcell": "cell",
        "separator": "separator",
        "page": "page",  # 顶层页面元素
    }
    
    # 可交互元素类型
    INTERACTIVE_ROLES = {
        "button", "link", "textbox", "checkbox", "radio",
        "combobox", "listbox", "option", "menuitem", "tab",
        "searchbox", "slider", "spinbutton", "switch",
        "treeitem", "gridcell",
    }
    
    # Element UI 稳定类名映射（用于 Vue SPA 项目）
    # 参考: vue-spa-locator-spec.md
    ELEMENT_UI_CLASS_MAP = {
        "tab": ".el-tabs__item",
        "textbox": ".el-input__inner",
        "button": ".el-button",
        "dialog": ".el-dialog",
        "table": ".el-table",
        "row": ".el-table__row",
        "columnheader": ".el-table__header-wrapper",
        "combobox": ".el-select",
        "option": ".el-select-dropdown__item",
        "checkbox": ".el-checkbox",
        "radio": ".el-radio",
        "switch": ".el-switch",
    }
    
    # TDesign 稳定类名映射
    TDESIGN_CLASS_MAP = {
        "tab": ".t-tabs__nav-item",
        "textbox": ".t-input__inner",
        "button": ".t-button",
        "dialog": ".t-dialog",
        "table": ".t-table",
        "row": ".t-table__row",
        "columnheader": ".t-table__header",
        "combobox": ".t-select",
        "checkbox": ".t-checkbox",
        "radio": ".t-radio",
        "switch": ".t-switch",
    }
    
    # 不稳定类名前缀（禁止使用）
    # 参考: vue-spa-locator-spec.md 第1章
    UNSTABLE_CLASS_PREFIXES = (
        "data-v-",      # Vue scoped CSS
        "_",            # CSS Modules 哈希
        "el-id-",       # Element UI 动态 ID
        "t-id-",        # TDesign 动态 ID
    )
    
    def __init__(self):
        self.elements: List[ElementInfo] = []
    
    def parse(self, content: str) -> List[ElementInfo]:
        """
        解析快照内容
        
        支持的格式：
        1. Playwright browser_snapshot:
           - button "登录" [ref=S1E7]
           - textbox "用户名" [ref=S1E5] placeholder="请输入"
           
        2. Chrome DevTools take_snapshot:
           - button "登录" [uid=2_11]
           - textbox "英文ID" [uid=2_9]
           
        3. Playwright toMatchAriaSnapshot:
           - button "登录"
           - textbox "用户名"
           
        4. 带层级的格式（保留层级信息）:
           - form "登录表单"
             - textbox "用户名" [ref=S1E5]
             - button "登录" [ref=S1E7]
        """
        self.elements = []
        
        # 多种格式的正则模式
        # 格式1: - role "name" [ref=xxx] attr="value"
        # 格式2: - role "name" [uid=xxx] attr=value
        # 格式3: - role "name" [数字]
        # 格式4: - role "name" (无ID)
        # 格式5: - role "name" [level=1] (heading等)
        
        # 主模式：匹配 - role "name" 后面可选的 [xxx] 和属性
        pattern = r'^(\s*)-\s+(\w+)\s+"([^"]*)"(.*)$'
        
        # ID 提取模式
        id_patterns = [
            r'\[ref=([^\]]+)\]',      # [ref=S1E7]
            r'\[uid=([^\]]+)\]',      # [uid=2_11]
            r'\[(\d+)\]',             # [7] 纯数字
        ]
        
        for line in content.split('\n'):
            if not line.strip():
                continue
            
            match = re.match(pattern, line)
            if match:
                indent = match.group(1)
                role = match.group(2)
                name = match.group(3)
                rest = match.group(4).strip()
                
                # 提取 ID
                uid = ""
                for id_pattern in id_patterns:
                    id_match = re.search(id_pattern, rest)
                    if id_match:
                        uid = id_match.group(1)
                        # 从 rest 中移除 ID 部分
                        rest = re.sub(id_pattern, '', rest).strip()
                        break
                
                # 如果没有 ID，生成一个基于位置的 ID
                if not uid:
                    uid = f"auto_{len(self.elements) + 1}"
                
                # 解析剩余的属性
                attributes = self._parse_attributes(rest)
                
                # 保存层级信息（缩进深度）
                attributes['_indent'] = str(len(indent) // 2)  # 假设每级缩进 2 空格
                
                # 生成选择器
                selector, locator_type = self._generate_selector(role, name, uid, attributes)
                
                # 确定元素类型
                element_type = self.ROLE_TO_TYPE.get(role, "generic")
                
                element = ElementInfo(
                    uid=uid,
                    role=role,
                    name=name,
                    selector=selector,
                    locator_type=locator_type,
                    element_type=element_type,
                    attributes=attributes,
                )
                
                self.elements.append(element)
        
        return self.elements
    
    def _parse_attributes(self, attrs_str: str) -> Dict[str, str]:
        """
        解析属性字符串
        
        支持格式：
        - key="value with spaces"
        - key=value
        - [key=value]
        - key (布尔属性)
        """
        attributes = {}
        
        if not attrs_str:
            return attributes
        
        # 模式1: key="value" 或 key='value'
        pattern1 = r'(\w+)=["\']([^"\']*)["\']'
        for match in re.finditer(pattern1, attrs_str):
            attributes[match.group(1)] = match.group(2)
        
        # 模式2: key=value (无引号，非空格)
        # 排除已匹配的部分
        remaining = re.sub(pattern1, '', attrs_str)
        pattern2 = r'(\w+)=(\S+)'
        for match in re.finditer(pattern2, remaining):
            key = match.group(1)
            if key not in attributes:  # 避免覆盖
                attributes[key] = match.group(2)
        
        # 模式3: [key=value] 方括号内的属性（如 [level=1]）
        pattern3 = r'\[(\w+)=([^\]]+)\]'
        for match in re.finditer(pattern3, attrs_str):
            key = match.group(1)
            if key not in ['ref', 'uid'] and key not in attributes:  # 排除 ID
                attributes[key] = match.group(2)
        
        # 模式4: 布尔属性（如 required, hidden）
        bool_attrs = ['required', 'hidden', 'disabled', 'checked', 'readonly']
        for attr in bool_attrs:
            if re.search(rf'\b{attr}\b', attrs_str, re.IGNORECASE):
                attributes[attr] = 'true'
        
        return attributes
    
    def _is_stable_class(self, class_name: str) -> bool:
        """检查类名是否稳定（非动态生成）"""
        # 检查是否为不稳定前缀
        for prefix in self.UNSTABLE_CLASS_PREFIXES:
            if class_name.startswith(prefix):
                return False
        
        # 检查是否包含哈希（CSS Modules 特征：下划线+字母数字）
        if re.match(r'^[a-zA-Z]+_[a-zA-Z0-9]{5,}$', class_name):
            return False
        
        return True
    
    def _get_ui_framework_class(self, classes: List[str]) -> Optional[str]:
        """从类名列表中识别 UI 框架类名"""
        # Element UI 类名优先
        for cls in classes:
            if cls.startswith('el-') and self._is_stable_class(cls):
                return f".{cls}"
        
        # TDesign 类名
        for cls in classes:
            if cls.startswith('t-') and self._is_stable_class(cls):
                return f".{cls}"
        
        return None
    
    def _generate_selector(
        self,
        role: str,
        name: str,
        uid: str,
        attributes: Dict[str, str]
    ) -> Tuple[str, str]:
        """
        生成推荐的选择器
        
        优先级（针对 Vue SPA + Element UI/TDesign 项目优化）:
        1. id（唯一标识，排除动态 ID）
        2. UI 框架稳定类名（.el-xxx, .t-xxx）+ 文本/placeholder
        3. placeholder（输入框）
        4. 文本内容（按钮、链接等）
        5. name 属性（表单元素）
        6. 稳定的 CSS 类名
        7. 标签+文本组合
        8. uid（最后手段）
        
        注意:
        - 不使用 data-testid（页面未添加）
        - 不使用 getByRole 定位 Tab/表头（Element UI 2.x 不遵守 ARIA）
        - 不使用 data-v-xxx（Vue scoped CSS，每次构建变化）
        - 不使用带哈希的 CSS Modules 类名
        
        参考: vue-spa-locator-spec.md
        """
        # 解析类名列表
        classes = attributes.get('class', '').split() if 'class' in attributes else []
        
        # 1. id（排除动态生成的 ID）
        if "id" in attributes:
            id_val = attributes['id']
            # 排除 Element UI/TDesign 动态 ID
            if not id_val.startswith(('el-id-', 't-id-', 'el-popper-')):
                return f"#{id_val}", "id"

        # 2. UI 框架类名 + 文本/placeholder（最稳定的组合）
        ui_class = self._get_ui_framework_class(classes)
        if ui_class:
            # Tab: 使用 UI 框架类名 + filter({ hasText })
            # ⚠️ Element UI 2.x 的 Tab 没有 role="tab"，必须用类名
            if role == "tab" and name:
                return f"{ui_class}:has-text('{name}')", "css"
            
            # 输入框: 使用 placeholder
            if role == "textbox" and "placeholder" in attributes:
                placeholder = attributes['placeholder']
                # Element UI 输入框内部是 .el-input__inner
                if '.el-input' in ui_class or '.t-input' in ui_class:
                    inner_class = '.el-input__inner' if 'el-' in ui_class else '.t-input__inner'
                    return f"{inner_class}[placeholder*='{placeholder}']", "css"
                return f"{ui_class}[placeholder*='{placeholder}']", "css"
            
            # 按钮: UI 框架类名 + 文本
            if role == "button" and name:
                return f"{ui_class}:has-text('{name}')", "css"
            
            # 表头: Element UI 表头文本在嵌套 div 中
            # ⚠️ 不能用 th:has-text()，因为文本在 .cell 内
            if role == "columnheader" and name:
                if 'el-' in ui_class:
                    return f".el-table__header-wrapper >> text='{name}'", "css"
                elif 't-' in ui_class:
                    return f".t-table__header >> text='{name}'", "css"

        # 3. placeholder（输入框首选）
        if "placeholder" in attributes:
            placeholder = attributes['placeholder']
            # 检查是否有 Element UI/TDesign 输入框类
            if any(cls.startswith(('el-input', 't-input')) for cls in classes):
                return f".el-input__inner[placeholder*='{placeholder}']", "css"
            return f"getByPlaceholder('{placeholder}')", "placeholder"

        # 3.5 textbox 使用 getByLabel（如果有名称）
        if role == "textbox" and name:
            # 尝试使用 label 定位
            return f"getByLabel('{name}')", "label"

        # 4. 文本内容（按钮、链接等可交互元素）
        # ⚠️ Tab 不使用 getByRole('tab')，Element UI 2.x 不添加 role
        if name and role in ["button", "link", "menuitem", "listitem"]:
            return f"getByText('{name}')", "text"
        
        # Tab 特殊处理：使用 Element UI 类名
        if name and role == "tab":
            return f".el-tabs__item:has-text('{name}')", "css"

        # 5. name 属性（表单元素）
        # 注意：使用 :not([type="hidden"]) 排除隐藏字段
        if "name" in attributes and role in ["textbox", "checkbox", "radio", "combobox"]:
            return f"[name='{attributes['name']}']:not([type='hidden'])", "name"

        # 5.5 type 属性（密码框等特殊输入框）
        if role == "textbox" and "type" in attributes:
            type_val = attributes['type']
            if type_val == "password":
                # 密码框通常只有一个，使用 type 选择器
                return "input[type='password']", "css"
            elif type_val in ["email", "tel", "url", "number"]:
                return f"input[type='{type_val}']", "css"

        # 5.6 checkbox/radio 使用 getByRole + name（如果有名称）
        if role == "checkbox" and name:
            return f"getByRole('checkbox', {{ name: '{name}' }})", "role"
        if role == "radio" and name:
            return f"getByRole('radio', {{ name: '{name}' }})", "role"

        # 6. 稳定的 CSS 类名（过滤掉动态类名）
        stable_classes = [cls for cls in classes if self._is_stable_class(cls)]
        if stable_classes:
            # 优先选择语义化类名
            for cls in stable_classes:
                if any(keyword in cls.lower() for keyword in ['btn', 'button', 'input', 'search', 'submit', 'cancel']):
                    return f".{cls}", "css"
            # 使用第一个稳定类名
            return f".{stable_classes[0]}", "css"

        # 7. 标签+文本组合（用于 heading、表头等）
        if role and name:
            tag_map = {
                "heading": "h1, h2, h3",
                "columnheader": "th",
                "cell": "td",
            }
            if role in tag_map:
                return f"{tag_map[role]}:has-text('{name}')", "css"

        # 8. 最后使用 uid（不推荐，仅作为兜底）
        return f"[data-uid='{uid}']", "css"
    
    def filter_interactive(self) -> List[ElementInfo]:
        """过滤出可交互元素"""
        return [e for e in self.elements if e.role in self.INTERACTIVE_ROLES]
    
    def filter_by_types(self, types: Set[str]) -> List[ElementInfo]:
        """按类型过滤"""
        return [e for e in self.elements if e.element_type in types or e.role in types]
    
    def to_pom_format(self, page_id: str = "page", page_name: str = "页面") -> Dict:
        """转换为 POM 格式"""
        elements = []
        
        for elem in self.elements:
            # 生成元素 ID
            elem_id = self._generate_element_id(elem)
            
            elements.append({
                "id": elem_id,
                "name": elem.name or f"{elem.role}_{elem.uid}",
                "locator": elem.selector,
                "locatorType": elem.locator_type,
                "type": elem.element_type,
            })
        
        return {
            "id": page_id,
            "name": page_name,
            "url": "",
            "elements": elements,
        }
    
    def _generate_element_id(self, elem: ElementInfo) -> str:
        """生成元素 ID"""
        # 优先使用 data-testid 或 id
        if "data-testid" in elem.attributes:
            return elem.attributes["data-testid"]
        if "id" in elem.attributes:
            return elem.attributes["id"]
        if "name" in elem.attributes:
            return elem.attributes["name"]
        
        # 使用名称生成
        if elem.name:
            # 转换为 camelCase
            name = re.sub(r'[^\w\s]', '', elem.name)
            words = name.split()
            if words:
                return words[0].lower() + ''.join(w.capitalize() for w in words[1:])
        
        # 使用角色 + uid
        return f"{elem.role}_{elem.uid}"


def main():
    parser = argparse.ArgumentParser(
        description="页面快照解析工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 解析快照文件
  python3 parse_snapshot.py snapshot.txt
  
  # 输出为 YAML 格式
  python3 parse_snapshot.py snapshot.txt -o elements.yaml
  
  # 仅提取可交互元素
  python3 parse_snapshot.py snapshot.txt --interactive
  
  # 仅提取指定类型
  python3 parse_snapshot.py snapshot.txt --types button,input,link
        """
    )
    
    parser.add_argument("snapshot", help="快照文件路径")
    parser.add_argument("-o", "--output", help="输出文件路径（.yaml 或 .json）")
    parser.add_argument("--interactive", action="store_true", help="仅提取可交互元素")
    parser.add_argument("--types", help="仅提取指定类型（逗号分隔）")
    parser.add_argument("--page-id", default="page", help="页面 ID")
    parser.add_argument("--page-name", default="页面", help="页面名称")
    parser.add_argument("--pom", action="store_true", help="输出为 POM 格式")
    
    args = parser.parse_args()
    
    snapshot_path = Path(args.snapshot)
    if not snapshot_path.exists():
        logger.error(f"文件不存在: {args.snapshot}")
        sys.exit(1)
    
    # 文件大小检查（最大 10MB）
    MAX_FILE_SIZE = 10 * 1024 * 1024
    file_size = snapshot_path.stat().st_size
    if file_size > MAX_FILE_SIZE:
        logger.error(f"文件过大: {file_size} bytes (最大 {MAX_FILE_SIZE} bytes)")
        sys.exit(1)
    
    # 读取快照
    with open(args.snapshot, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 解析
    parser_obj = SnapshotParser()
    elements = parser_obj.parse(content)
    
    logger.info(f"解析到 {len(elements)} 个元素")
    
    # 过滤
    if args.interactive:
        elements = parser_obj.filter_interactive()
        logger.info(f"过滤后 {len(elements)} 个可交互元素")
    
    if args.types:
        types = set(t.strip() for t in args.types.split(','))
        elements = parser_obj.filter_by_types(types)
        logger.info(f"过滤后 {len(elements)} 个指定类型元素")
    
    # 更新解析器的元素列表
    parser_obj.elements = elements
    
    # 输出
    if args.pom:
        output_data = parser_obj.to_pom_format(args.page_id, args.page_name)
    else:
        output_data = [e.to_dict() for e in elements]
    
    if args.output:
        ext = Path(args.output).suffix.lower()
        
        if ext == ".yaml" or ext == ".yml":
            if not HAS_YAML:
                logger.error("需要安装 pyyaml: pip install pyyaml")
                sys.exit(1)
            
            with open(args.output, 'w', encoding='utf-8') as f:
                yaml.dump(output_data, f, allow_unicode=True, default_flow_style=False)
        else:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"已保存: {args.output}")
    else:
        # 打印到控制台
        print(json.dumps(output_data, ensure_ascii=False, indent=2))
    
    sys.exit(0)


if __name__ == "__main__":
    main()
