#!/usr/bin/env python3
"""
HTML结构诊断工具
自动扫描HTML文件，识别语义化、可访问性和结构问题

使用方式：
    python scripts/analyze-html.py index.html
    python scripts/analyze-html.py index.html --output report.md
"""

import re
import sys
import argparse
from collections import Counter, defaultdict
from pathlib import Path
from html.parser import HTMLParser


class HTMLAnalyzer(HTMLParser):
    """HTML分析器"""
    
    def __init__(self):
        super().__init__()
        self.issues = []
        self.warnings = []
        self.stats = defaultdict(int)
        
        # 标签栈（用于计算嵌套深度）
        self.tag_stack = []
        self.max_depth = 0
        
        # 标题层级
        self.headings = []
        self.last_heading_level = 0
        
        # 语义标签
        self.semantic_tags = set()
        self.has_main = False
        self.has_header = False
        self.has_footer = False
        self.has_nav = False
        
        # 可访问性
        self.images_without_alt = []
        self.inputs_without_label = []
        self.links_without_text = []
        self.divs_with_onclick = []
        self.empty_buttons = []
        
        # 当前处理的元素
        self.current_tag = None
        self.current_attrs = {}
        self.current_line = 0
        
        # 标签计数
        self.tag_counts = Counter()
        
        # 表单元素ID
        self.input_ids = set()
        self.label_fors = set()
        
        # lang 属性检测
        self.has_lang = False
    
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        self.current_attrs = dict(attrs)
        self.current_line = self.getpos()[0]
        self.tag_counts[tag] += 1
        
        # 更新标签栈
        self.tag_stack.append(tag)
        current_depth = len(self.tag_stack)
        if current_depth > self.max_depth:
            self.max_depth = current_depth
        
        # 检查语义标签
        self._check_semantic_tag(tag)
        
        # 检查标题层级
        self._check_heading(tag)
        
        # 检查可访问性
        self._check_accessibility(tag, attrs)
        
        # 检查结构问题
        self._check_structure(tag, attrs)
    
    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
    
    def handle_data(self, data):
        # 检查链接和按钮是否有文本
        if self.current_tag == 'a' and not data.strip():
            if 'aria-label' not in self.current_attrs:
                self.links_without_text.append(self.current_line)
        
        if self.current_tag == 'button' and not data.strip():
            if 'aria-label' not in self.current_attrs:
                self.empty_buttons.append(self.current_line)
    
    def _check_semantic_tag(self, tag):
        """检查语义标签使用"""
        semantic_list = ['header', 'main', 'footer', 'nav', 'article', 
                        'section', 'aside', 'figure', 'figcaption', 'time']
        
        if tag in semantic_list:
            self.semantic_tags.add(tag)
        
        if tag == 'main':
            self.has_main = True
        elif tag == 'header':
            self.has_header = True
        elif tag == 'footer':
            self.has_footer = True
        elif tag == 'nav':
            self.has_nav = True
        elif tag == 'html':
            # 检查 html 标签的 lang 属性
            if 'lang' in self.current_attrs:
                self.has_lang = True
    
    def _check_heading(self, tag):
        """检查标题层级"""
        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            level = int(tag[1])
            self.headings.append((level, self.current_line))
            
            # 检查跳级
            if self.last_heading_level > 0 and level > self.last_heading_level + 1:
                self.issues.append(
                    f"第{self.current_line}行: 标题层级跳跃 (h{self.last_heading_level} → h{level})"
                )
            
            self.last_heading_level = level
    
    def _check_accessibility(self, tag, attrs):
        """检查可访问性问题"""
        attrs_dict = dict(attrs)
        
        # 图片缺少alt
        if tag == 'img':
            if 'alt' not in attrs_dict:
                self.images_without_alt.append(self.current_line)
        
        # 表单元素
        if tag == 'input':
            input_type = attrs_dict.get('type', 'text')
            if input_type not in ['hidden', 'submit', 'button', 'reset']:
                input_id = attrs_dict.get('id')
                if input_id:
                    self.input_ids.add(input_id)
                elif 'aria-label' not in attrs_dict and 'aria-labelledby' not in attrs_dict:
                    self.inputs_without_label.append(self.current_line)
        
        # label的for属性
        if tag == 'label':
            for_id = attrs_dict.get('for')
            if for_id:
                self.label_fors.add(for_id)
        
        # div模拟按钮
        if tag == 'div' and 'onclick' in attrs_dict:
            if 'role' not in attrs_dict or attrs_dict.get('role') != 'button':
                self.divs_with_onclick.append(self.current_line)
    
    def _check_structure(self, tag, attrs):
        """检查结构问题"""
        attrs_dict = dict(attrs)
        
        # 检查div模拟语义标签
        class_name = attrs_dict.get('class', '')
        
        semantic_class_map = {
            'header': 'header',
            'footer': 'footer',
            'nav': 'nav',
            'sidebar': 'aside',
            'main': 'main',
            'article': 'article'
        }
        
        if tag == 'div':
            for class_pattern, semantic_tag in semantic_class_map.items():
                if class_pattern in class_name.lower():
                    self.warnings.append(
                        f"第{self.current_line}行: 建议使用 <{semantic_tag}> 替代 <div class=\"...{class_pattern}...\">"
                    )
    
    def finalize(self):
        """完成分析，生成最终报告"""
        # 检查h1数量
        h1_count = sum(1 for h in self.headings if h[0] == 1)
        if h1_count == 0:
            self.issues.append("页面缺少 <h1> 标签")
        elif h1_count > 1:
            self.issues.append(f"页面有 {h1_count} 个 <h1> 标签，应该只有一个")
        
        # 检查页面结构
        if not self.has_main:
            self.warnings.append("页面缺少 <main> 标签")
        
        # 检查 lang 属性（可访问性要求）
        if not self.has_lang:
            self.issues.append("页面 <html> 标签缺少 lang 属性（WCAG 3.1.1 要求）")
        
        # 检查表单label关联
        unassociated_inputs = self.input_ids - self.label_fors
        for input_id in unassociated_inputs:
            self.warnings.append(f"输入框 #{input_id} 没有关联的 <label>")


def analyze_html(content: str) -> HTMLAnalyzer:
    """分析HTML内容"""
    analyzer = HTMLAnalyzer()
    try:
        analyzer.feed(content)
        analyzer.finalize()
    except Exception as e:
        analyzer.issues.append(f"HTML解析错误: {str(e)}")
    return analyzer


def generate_report(html_file: str, analyzer: HTMLAnalyzer) -> str:
    """生成诊断报告"""
    
    # 计算统计数据
    total_tags = sum(analyzer.tag_counts.values())
    div_count = analyzer.tag_counts.get('div', 0)
    semantic_count = len(analyzer.semantic_tags)
    
    div_ratio = (div_count / total_tags * 100) if total_tags > 0 else 0
    
    report = f"""# HTML结构诊断报告

**文件**: {html_file}
**标签总数**: {total_tags}
**最大嵌套深度**: {analyzer.max_depth}

## 统计概览

| 指标 | 值 | 评价 |
|------|-----|------|
| 语义标签数 | {semantic_count} | {'✅ 良好' if semantic_count >= 3 else '⚠️ 偏少'} |
| div标签占比 | {div_ratio:.1f}% | {'✅ 合理' if div_ratio < 30 else '⚠️ 过多'} |
| 最大嵌套深度 | {analyzer.max_depth} | {'✅ 合理' if analyzer.max_depth <= 5 else '❌ 过深'} |
| h1标签数 | {sum(1 for h in analyzer.headings if h[0] == 1)} | {'✅ 正确' if sum(1 for h in analyzer.headings if h[0] == 1) == 1 else '❌ 异常'} |

## 语义化分析

### 已使用的语义标签
"""
    
    if analyzer.semantic_tags:
        for tag in sorted(analyzer.semantic_tags):
            report += f"- `<{tag}>`\n"
    else:
        report += "- 未使用语义标签\n"
    
    report += "\n### 缺失的关键标签\n"
    missing = []
    if not analyzer.has_main:
        missing.append('main')
    if not analyzer.has_header:
        missing.append('header')
    if not analyzer.has_footer:
        missing.append('footer')
    if not analyzer.has_nav:
        missing.append('nav')
    
    if missing:
        for tag in missing:
            report += f"- `<{tag}>`\n"
    else:
        report += "- 无\n"
    
    report += "\n### 标题层级\n"
    if analyzer.headings:
        for level, line in analyzer.headings:
            report += f"- h{level} (第{line}行)\n"
    else:
        report += "- 未使用标题标签\n"
    
    report += "\n## 可访问性问题\n"
    
    # 图片问题
    report += f"\n### 图片缺少alt ({len(analyzer.images_without_alt)}处)\n"
    if analyzer.images_without_alt:
        for line in analyzer.images_without_alt[:5]:
            report += f"- 第{line}行\n"
        if len(analyzer.images_without_alt) > 5:
            report += f"- ...等{len(analyzer.images_without_alt)}处\n"
    else:
        report += "- 无\n"
    
    # 表单问题
    report += f"\n### 表单控件缺少label ({len(analyzer.inputs_without_label)}处)\n"
    if analyzer.inputs_without_label:
        for line in analyzer.inputs_without_label[:5]:
            report += f"- 第{line}行\n"
    else:
        report += "- 无\n"
    
    # div模拟按钮
    report += f"\n### div模拟按钮 ({len(analyzer.divs_with_onclick)}处)\n"
    if analyzer.divs_with_onclick:
        for line in analyzer.divs_with_onclick[:5]:
            report += f"- 第{line}行: 建议使用 `<button>` 或添加 `role=\"button\"`\n"
    else:
        report += "- 无\n"
    
    # 空链接/按钮
    empty_interactive = len(analyzer.links_without_text) + len(analyzer.empty_buttons)
    report += f"\n### 空链接/按钮 ({empty_interactive}处)\n"
    if analyzer.links_without_text:
        for line in analyzer.links_without_text[:3]:
            report += f"- 第{line}行: 空链接\n"
    if analyzer.empty_buttons:
        for line in analyzer.empty_buttons[:3]:
            report += f"- 第{line}行: 空按钮\n"
    if empty_interactive == 0:
        report += "- 无\n"
    
    report += "\n## 问题汇总\n"
    
    # 严重问题
    report += "\n### 严重问题\n"
    if analyzer.issues:
        for issue in analyzer.issues:
            report += f"- ❌ {issue}\n"
    else:
        report += "- 无\n"
    
    # 警告
    report += "\n### 警告\n"
    if analyzer.warnings:
        for warning in analyzer.warnings[:10]:
            report += f"- ⚠️ {warning}\n"
        if len(analyzer.warnings) > 10:
            report += f"- ...等{len(analyzer.warnings)}条警告\n"
    else:
        report += "- 无\n"
    
    # 重构建议
    report += "\n## 重构建议\n"
    
    suggestions = []
    
    if div_ratio > 30:
        suggestions.append("div标签占比过高，建议使用语义化标签替代")
    
    if analyzer.max_depth > 5:
        suggestions.append(f"嵌套深度为{analyzer.max_depth}层，建议优化结构减少到5层以内")
    
    if not analyzer.has_main:
        suggestions.append("添加 `<main>` 标签包裹主要内容")
    
    if analyzer.images_without_alt:
        suggestions.append("为所有信息性图片添加描述性 alt 属性")
    
    if analyzer.divs_with_onclick:
        suggestions.append("将 div[onclick] 替换为 `<button>` 元素")
    
    if suggestions:
        for i, suggestion in enumerate(suggestions, 1):
            report += f"{i}. {suggestion}\n"
    else:
        report += "HTML结构良好，无需重构\n"
    
    # 评分
    score = 100
    score -= len(analyzer.issues) * 10
    score -= len(analyzer.warnings) * 2
    score -= len(analyzer.images_without_alt) * 3
    score -= len(analyzer.divs_with_onclick) * 5
    if analyzer.max_depth > 5:
        score -= (analyzer.max_depth - 5) * 5
    if div_ratio > 30:
        score -= int((div_ratio - 30) / 5)
    
    score = max(0, min(100, score))
    
    report += f"\n## 综合评分\n\n**{score}/100**\n"
    
    if score >= 90:
        report += "\n✅ 优秀：HTML结构规范，可访问性良好\n"
    elif score >= 70:
        report += "\n⚠️ 良好：存在一些问题需要改进\n"
    elif score >= 50:
        report += "\n⚠️ 一般：建议进行结构优化\n"
    else:
        report += "\n❌ 较差：需要进行全面重构\n"
    
    return report


def main():
    parser = argparse.ArgumentParser(description='HTML结构诊断工具')
    parser.add_argument('html_file', help='HTML文件路径')
    parser.add_argument('--output', '-o', help='输出报告文件路径')
    
    args = parser.parse_args()
    
    html_path = Path(args.html_file)
    if not html_path.exists():
        print(f"错误: 文件不存在 - {args.html_file}")
        sys.exit(1)
    
    content = html_path.read_text(encoding='utf-8')
    analyzer = analyze_html(content)
    report = generate_report(args.html_file, analyzer)
    
    if args.output:
        Path(args.output).write_text(report, encoding='utf-8')
        print(f"报告已保存到: {args.output}")
    else:
        print(report)


if __name__ == '__main__':
    main()
