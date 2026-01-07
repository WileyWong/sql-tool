#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
POM 生成器（增强版）

从页面快照直接生成完整的 POM YAML，包含智能命名和降级定位器。
相比 parse_snapshot.py 的增强：
- 自动生成语义化元素 ID（camelCase）
- 自动添加降级定位器（fallback）
- 标注导航类型（navigation_type）
- 检测并警告不稳定定位器
- 直接输出 POM YAML 格式

节省 ~85% Token。

用法:
    # 生成 POM YAML
    python pom_generator.py snapshot.txt --page-id loginPage --page-name 登录页
    
    # 输出到文件
    python pom_generator.py snapshot.txt --output pom.yaml
    
    # 指定 URL
    python pom_generator.py snapshot.txt --url /login --output pom.yaml

依赖:
    pip install pyyaml (可选)
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
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field, asdict

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
class ElementDef:
    """元素定义"""
    id: str
    name: str
    role: str
    locator: str
    locator_type: str = "css"
    fallback: List[str] = field(default_factory=list)
    wait: str = "可见"
    timeout: int = 10000
    navigation_type: str = ""  # spa, new_tab, download
    warnings: List[str] = field(default_factory=list)


@dataclass
class PageDef:
    """页面定义"""
    id: str
    name: str
    url: str
    description: str = ""
    generated_at: str = ""
    source: str = "snapshot"
    elements: Dict[str, ElementDef] = field(default_factory=dict)


class PomGenerator:
    """POM 生成器"""
    
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
        "dialog": "dialog",
        "table": "table",
        "row": "row",
        "cell": "cell",
        "columnheader": "columnheader",
        "heading": "heading",
        "img": "image",
        "searchbox": "input",
    }
    
    # 可交互元素角色
    INTERACTIVE_ROLES = {
        "button", "link", "textbox", "checkbox", "radio",
        "combobox", "listbox", "option", "menuitem", "tab",
        "searchbox", "slider", "spinbutton", "switch",
    }
    
    # 导航相关关键词
    NAVIGATION_KEYWORDS = {
        "spa": ["跳转", "导航", "切换", "进入", "打开页面", "路由"],
        "new_tab": ["新标签", "新窗口", "blank", "下载"],
        "download": ["下载", "导出", "export"],
    }
    
    # 不稳定定位器模式
    UNSTABLE_PATTERNS = [
        (r'data-v-[a-f0-9]+', 'Vue scoped CSS'),
        (r'el-id-\d+-\d+', 'Element UI 动态 ID'),
        (r't-id-\d+-\d+', 'TDesign 动态 ID'),
        (r'\.[a-zA-Z]+_[a-zA-Z0-9]{5,}', 'CSS Modules 哈希'),
    ]
    
    # Element UI 稳定类名
    ELEMENT_UI_CLASSES = {
        "tab": ".el-tabs__item",
        "textbox": ".el-input__inner",
        "button": ".el-button",
        "dialog": ".el-dialog",
        "table": ".el-table",
        "combobox": ".el-select",
        "checkbox": ".el-checkbox",
        "radio": ".el-radio",
    }
    
    def __init__(self):
        self.elements: List[Dict] = []
        self.warnings: List[str] = []
    
    def parse_snapshot(self, content: str) -> List[Dict]:
        """解析快照内容"""
        self.elements = []
        
        # 匹配模式: - role "name" [ref=xxx] attrs
        pattern = r'^(\s*)-\s+(\w+)\s+"([^"]*)"(.*)$'
        
        # ID 提取模式
        id_patterns = [
            r'\[ref=([^\]]+)\]',
            r'\[uid=([^\]]+)\]',
            r'\[(\d+)\]',
        ]
        
        for line in content.split('\n'):
            if not line.strip():
                continue
            
            match = re.match(pattern, line)
            if not match:
                continue
            
            indent, role, name, rest = match.groups()
            
            # 跳过非交互元素
            if role not in self.INTERACTIVE_ROLES:
                continue
            
            # 提取 ID
            uid = ""
            for id_pattern in id_patterns:
                id_match = re.search(id_pattern, rest)
                if id_match:
                    uid = id_match.group(1)
                    rest = re.sub(id_pattern, '', rest).strip()
                    break
            
            if not uid:
                uid = f"auto_{len(self.elements) + 1}"
            
            # 解析属性
            attrs = self._parse_attributes(rest)
            
            self.elements.append({
                "uid": uid,
                "role": role,
                "name": name,
                "attributes": attrs,
            })
        
        return self.elements
    
    def _parse_attributes(self, attrs_str: str) -> Dict[str, str]:
        """解析属性字符串"""
        attrs = {}
        
        if not attrs_str:
            return attrs
        
        # key="value" 或 key='value'
        pattern1 = r'(\w+)=["\']([^"\']*)["\']'
        for match in re.finditer(pattern1, attrs_str):
            attrs[match.group(1)] = match.group(2)
        
        # key=value
        remaining = re.sub(pattern1, '', attrs_str)
        pattern2 = r'(\w+)=(\S+)'
        for match in re.finditer(pattern2, remaining):
            if match.group(1) not in attrs:
                attrs[match.group(1)] = match.group(2)
        
        return attrs
    
    def _generate_element_id(self, role: str, name: str, index: int) -> str:
        """生成语义化元素 ID"""
        if not name:
            return f"{role}_{index}"
        
        # 清理特殊字符
        clean_name = re.sub(r'[^\w\u4e00-\u9fa5\s]', '', name)
        
        # 中文转拼音首字母或保留
        words = clean_name.split()
        
        if not words:
            return f"{role}_{index}"
        
        # 生成 camelCase
        # 常见元素类型后缀
        type_suffix = {
            "button": "Btn",
            "textbox": "Input",
            "link": "Link",
            "checkbox": "Checkbox",
            "radio": "Radio",
            "combobox": "Select",
            "tab": "Tab",
        }
        
        # 简单处理：取前几个字符
        base_name = clean_name[:20].strip()
        
        # 添加类型后缀
        suffix = type_suffix.get(role, "")
        
        # 生成 ID
        if base_name:
            # 首字母小写
            elem_id = base_name[0].lower() + base_name[1:].replace(" ", "")
            if suffix and not elem_id.lower().endswith(suffix.lower()):
                elem_id += suffix
            return elem_id
        
        return f"{role}_{index}"
    
    def _generate_locator(
        self,
        role: str,
        name: str,
        attrs: Dict[str, str]
    ) -> Tuple[str, str, List[str]]:
        """
        生成定位器和降级方案
        
        Returns:
            (主定位器, 定位类型, 降级定位器列表)
        """
        fallback = []
        
        # 1. placeholder (输入框首选)
        if "placeholder" in attrs:
            placeholder = attrs["placeholder"]
            if role == "textbox":
                # Element UI 输入框
                primary = f".el-input__inner[placeholder*='{placeholder}']"
                fallback.append(f"getByPlaceholder('{placeholder}')")
                return primary, "css", fallback
        
        # 2. id (排除动态 ID)
        if "id" in attrs:
            id_val = attrs["id"]
            if not any(id_val.startswith(p) for p in ["el-id-", "t-id-", "el-popper-"]):
                return f"#{id_val}", "id", []
        
        # 3. Element UI 类名 + 文本
        if role in self.ELEMENT_UI_CLASSES:
            ui_class = self.ELEMENT_UI_CLASSES[role]
            if name:
                primary = f"{ui_class}:has-text('{name}')"
                fallback.append(f"getByText('{name}')")
                return primary, "css", fallback
        
        # 4. 文本内容
        if name and role in ["button", "link", "menuitem"]:
            primary = f"getByText('{name}')"
            fallback.append(f"text='{name}'")
            return primary, "text", fallback
        
        # 5. Tab 特殊处理
        if role == "tab" and name:
            primary = f".el-tabs__item:has-text('{name}')"
            fallback.append(f"text='{name}'")
            return primary, "css", fallback
        
        # 6. name 属性
        if "name" in attrs:
            primary = f"[name='{attrs['name']}']"
            return primary, "name", []
        
        # 7. 角色 + 名称
        if name:
            primary = f"getByRole('{role}', {{ name: '{name}' }})"
            return primary, "role", []
        
        # 8. 兜底
        return f"[data-uid='{attrs.get('uid', 'unknown')}']", "css", []
    
    def _detect_navigation_type(self, role: str, name: str, attrs: Dict[str, str]) -> str:
        """检测导航类型"""
        text = f"{name} {attrs.get('href', '')} {attrs.get('target', '')}".lower()
        
        for nav_type, keywords in self.NAVIGATION_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text:
                    return nav_type
        
        # 链接默认可能是 SPA 导航
        if role == "link":
            return "spa"
        
        return ""
    
    def _check_unstable_locator(self, locator: str) -> List[str]:
        """检查不稳定定位器"""
        warnings = []
        
        for pattern, desc in self.UNSTABLE_PATTERNS:
            if re.search(pattern, locator):
                warnings.append(f"检测到不稳定定位器: {desc}")
        
        return warnings
    
    def generate(
        self,
        page_id: str,
        page_name: str,
        page_url: str = "",
        description: str = ""
    ) -> PageDef:
        """
        生成 POM 定义
        
        Args:
            page_id: 页面 ID
            page_name: 页面名称
            page_url: 页面 URL
            description: 页面描述
        
        Returns:
            PageDef
        """
        page = PageDef(
            id=page_id,
            name=page_name,
            url=page_url,
            description=description,
            generated_at=datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            source="snapshot",
        )
        
        for i, elem in enumerate(self.elements):
            role = elem["role"]
            name = elem["name"]
            attrs = elem["attributes"]
            attrs["uid"] = elem["uid"]
            
            # 生成元素 ID
            elem_id = self._generate_element_id(role, name, i + 1)
            
            # 生成定位器
            locator, locator_type, fallback = self._generate_locator(role, name, attrs)
            
            # 检测导航类型
            nav_type = self._detect_navigation_type(role, name, attrs)
            
            # 检查不稳定定位器
            warnings = self._check_unstable_locator(locator)
            
            # 确定等待策略
            wait = "可见"
            if role == "dialog":
                wait = "附加"
            elif nav_type == "spa":
                wait = "网络空闲"
            
            element = ElementDef(
                id=elem_id,
                name=name or f"{role}_{i + 1}",
                role=role,
                locator=locator,
                locator_type=locator_type,
                fallback=fallback,
                wait=wait,
                timeout=10000,
                navigation_type=nav_type,
                warnings=warnings,
            )
            
            page.elements[elem_id] = element
            
            # 收集警告
            self.warnings.extend(warnings)
        
        return page
    
    def to_yaml_dict(self, page: PageDef) -> Dict[str, Any]:
        """转换为 YAML 字典格式"""
        elements = {}
        
        for elem_id, elem in page.elements.items():
            elem_dict = {
                "locator": elem.locator,
                "description": elem.name,
                "type": elem.role,
            }
            
            if elem.fallback:
                elem_dict["fallback"] = elem.fallback
            
            if elem.navigation_type:
                elem_dict["navigation_type"] = elem.navigation_type
            
            if elem.wait != "可见":
                elem_dict["wait"] = elem.wait
            
            if elem.warnings:
                elem_dict["_warnings"] = elem.warnings
            
            elements[elem_id] = elem_dict
        
        return {
            "metadata": {
                "name": page.name,
                "url": page.url,
                "description": page.description,
                "generated_at": page.generated_at,
                "source": page.source,
            },
            "elements": elements,
        }
    
    def to_excel_rows(self, page: PageDef) -> List[List[str]]:
        """转换为 Excel 行格式（用于 POM Sheet）"""
        rows = []
        
        for elem_id, elem in page.elements.items():
            rows.append([
                page.id,           # 页面ID
                page.name,         # 页面名称
                page.url,          # 页面URL
                elem_id,           # 元素ID
                elem.name,         # 元素名称
                elem.locator_type, # 定位方式
                elem.locator,      # 定位值
                elem.wait,         # 等待策略
                elem.timeout,      # 等待超时
                "",                # API模式
                elem.role,         # 描述（存放角色）
            ])
        
        return rows


def main():
    parser = argparse.ArgumentParser(
        description="POM 生成器 - 从快照生成完整的 POM 定义",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 生成 POM YAML
  python pom_generator.py snapshot.txt --page-id loginPage --page-name 登录页
  
  # 输出到文件
  python pom_generator.py snapshot.txt --output pom.yaml
  
  # 指定 URL
  python pom_generator.py snapshot.txt --url /login --page-id loginPage
  
  # 输出 Excel 格式（用于粘贴到 POM Sheet）
  python pom_generator.py snapshot.txt --format excel
        """
    )
    
    parser.add_argument("snapshot", help="快照文件路径")
    parser.add_argument("--page-id", default="page", help="页面 ID")
    parser.add_argument("--page-name", default="页面", help="页面名称")
    parser.add_argument("--url", default="", help="页面 URL")
    parser.add_argument("--description", default="", help="页面描述")
    parser.add_argument("--output", "-o", help="输出文件路径")
    parser.add_argument("--format", "-f", choices=["yaml", "json", "excel"], default="yaml", help="输出格式")
    
    args = parser.parse_args()
    
    # 检查文件存在
    snapshot_path = Path(args.snapshot)
    if not snapshot_path.exists():
        logger.error(f"文件不存在: {args.snapshot}")
        sys.exit(1)
    
    # 读取快照
    try:
        content = snapshot_path.read_text(encoding='utf-8')
    except Exception as e:
        logger.error(f"读取文件失败: {e}")
        sys.exit(1)
    
    # 生成 POM
    generator = PomGenerator()
    generator.parse_snapshot(content)
    
    logger.info(f"解析到 {len(generator.elements)} 个可交互元素")
    
    page = generator.generate(
        page_id=args.page_id,
        page_name=args.page_name,
        page_url=args.url,
        description=args.description,
    )
    
    # 输出警告
    if generator.warnings:
        logger.warning(f"发现 {len(generator.warnings)} 个潜在问题:")
        for warning in set(generator.warnings):
            logger.warning(f"  - {warning}")
    
    # 格式化输出
    if args.format == "yaml":
        output_data = generator.to_yaml_dict(page)
        if HAS_YAML:
            output_str = yaml.dump(output_data, allow_unicode=True, default_flow_style=False, sort_keys=False)
        else:
            output_str = json.dumps(output_data, ensure_ascii=False, indent=2)
            logger.warning("未安装 pyyaml，输出 JSON 格式")
    elif args.format == "json":
        output_data = generator.to_yaml_dict(page)
        output_str = json.dumps(output_data, ensure_ascii=False, indent=2)
    else:  # excel
        rows = generator.to_excel_rows(page)
        output_data = {"rows": rows}
        output_str = json.dumps(output_data, ensure_ascii=False, indent=2)
    
    # 输出
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output_str)
        logger.info(f"已保存: {args.output}")
    else:
        print(output_str)
    
    sys.exit(0)


if __name__ == "__main__":
    main()
