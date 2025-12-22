#!/usr/bin/env python3
"""
CSS重复代码诊断工具
自动扫描CSS文件，识别重复代码和可变量化的属性

使用方式：
    python scripts/analyze-css.py styles.css
    python scripts/analyze-css.py styles.css --output report.md
"""

import re
import sys
import argparse
from collections import Counter, defaultdict
from pathlib import Path


def parse_css(content: str) -> list:
    """解析CSS内容，提取选择器和属性"""
    # 移除注释
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    rules = []
    # 匹配选择器和声明块
    pattern = r'([^{]+)\{([^}]+)\}'
    for match in re.finditer(pattern, content):
        selector = match.group(1).strip()
        declarations = match.group(2).strip()
        
        # 解析属性
        props = {}
        for decl in declarations.split(';'):
            if ':' in decl:
                prop, value = decl.split(':', 1)
                props[prop.strip()] = value.strip()
        
        if props:
            rules.append({'selector': selector, 'properties': props})
    
    return rules


def extract_colors(rules: list) -> Counter:
    """提取所有颜色值"""
    colors = []
    color_props = ['color', 'background', 'background-color', 'border-color', 
                   'border', 'box-shadow', 'text-shadow', 'outline-color']
    
    # 颜色匹配模式
    hex_pattern = r'#[0-9a-fA-F]{3,8}'
    rgb_pattern = r'rgba?\([^)]+\)'
    
    for rule in rules:
        for prop, value in rule['properties'].items():
            if any(cp in prop for cp in color_props):
                # 提取hex颜色
                colors.extend(re.findall(hex_pattern, value.lower()))
                # 提取rgb/rgba颜色
                colors.extend(re.findall(rgb_pattern, value.lower()))
    
    return Counter(colors)


def extract_spacing(rules: list) -> Counter:
    """提取所有间距值"""
    spacing = []
    spacing_props = ['padding', 'margin', 'gap', 'padding-top', 'padding-right',
                     'padding-bottom', 'padding-left', 'margin-top', 'margin-right',
                     'margin-bottom', 'margin-left']
    
    px_pattern = r'\d+px'
    
    for rule in rules:
        for prop, value in rule['properties'].items():
            if prop in spacing_props:
                spacing.extend(re.findall(px_pattern, value))
    
    return Counter(spacing)


def extract_radius(rules: list) -> Counter:
    """提取所有圆角值"""
    radius = []
    
    for rule in rules:
        if 'border-radius' in rule['properties']:
            value = rule['properties']['border-radius']
            radius.append(value)
    
    return Counter(radius)


def extract_shadows(rules: list) -> Counter:
    """提取所有阴影值"""
    shadows = []
    
    for rule in rules:
        if 'box-shadow' in rule['properties']:
            shadows.append(rule['properties']['box-shadow'])
    
    return Counter(shadows)


def extract_gradients(rules: list) -> Counter:
    """提取所有渐变值"""
    gradients = []
    gradient_pattern = r'(linear|radial)-gradient\([^)]+\)'
    
    for rule in rules:
        for prop, value in rule['properties'].items():
            matches = re.findall(gradient_pattern, value, re.IGNORECASE)
            if matches:
                gradients.append(value)
    
    return Counter(gradients)


def find_layout_patterns(rules: list) -> dict:
    """识别布局模式"""
    patterns = defaultdict(list)
    
    for rule in rules:
        props = rule['properties']
        selector = rule['selector']
        
        # Flex居中
        if (props.get('display') == 'flex' and 
            props.get('align-items') == 'center' and 
            props.get('justify-content') == 'center'):
            patterns['flex-center'].append(selector)
        
        # Flex垂直布局
        elif (props.get('display') == 'flex' and 
              props.get('flex-direction') == 'column'):
            patterns['flex-column'].append(selector)
        
        # Flex两端对齐
        elif (props.get('display') == 'flex' and 
              props.get('justify-content') == 'space-between'):
            patterns['flex-between'].append(selector)
        
        # 文本居中
        if props.get('text-align') == 'center':
            patterns['text-center'].append(selector)
    
    return dict(patterns)


def generate_report(css_file: str, rules: list) -> str:
    """生成诊断报告"""
    colors = extract_colors(rules)
    spacing = extract_spacing(rules)
    radius = extract_radius(rules)
    shadows = extract_shadows(rules)
    gradients = extract_gradients(rules)
    layouts = find_layout_patterns(rules)
    
    # 过滤重复3次以上的值
    dup_colors = {k: v for k, v in colors.items() if v >= 3}
    dup_spacing = {k: v for k, v in spacing.items() if v >= 3}
    dup_radius = {k: v for k, v in radius.items() if v >= 2}
    dup_shadows = {k: v for k, v in shadows.items() if v >= 2}
    dup_gradients = {k: v for k, v in gradients.items() if v >= 2}
    
    report = f"""# CSS重构诊断报告

**文件**: {css_file}
**选择器总数**: {len(rules)}

## 重复代码统计

### 重复颜色值 ({len(dup_colors)}处)
"""
    
    if dup_colors:
        for color, count in sorted(dup_colors.items(), key=lambda x: -x[1]):
            report += f"- `{color}`: {count}次\n"
    else:
        report += "- 无重复颜色值\n"
    
    report += f"""
### 重复间距值 ({len(dup_spacing)}处)
"""
    
    if dup_spacing:
        for space, count in sorted(dup_spacing.items(), key=lambda x: -x[1]):
            report += f"- `{space}`: {count}次\n"
    else:
        report += "- 无重复间距值\n"
    
    report += f"""
### 重复圆角值 ({len(dup_radius)}处)
"""
    
    if dup_radius:
        for r, count in sorted(dup_radius.items(), key=lambda x: -x[1]):
            report += f"- `{r}`: {count}次\n"
    else:
        report += "- 无重复圆角值\n"
    
    report += f"""
### 重复阴影值 ({len(dup_shadows)}处)
"""
    
    if dup_shadows:
        for shadow, count in sorted(dup_shadows.items(), key=lambda x: -x[1]):
            report += f"- `{shadow[:50]}...`: {count}次\n"
    else:
        report += "- 无重复阴影值\n"
    
    report += f"""
### 重复渐变值 ({len(dup_gradients)}处)
"""
    
    if dup_gradients:
        for gradient, count in sorted(dup_gradients.items(), key=lambda x: -x[1]):
            report += f"- `{gradient[:60]}...`: {count}次\n"
    else:
        report += "- 无重复渐变值\n"
    
    report += """
## 可抽取布局模式
"""
    
    if layouts:
        for pattern, selectors in layouts.items():
            if len(selectors) >= 2:
                report += f"\n### {pattern} ({len(selectors)}处)\n"
                report += f"可抽取为工具类 `.{pattern}`\n"
                report += f"涉及选择器: {', '.join(selectors[:5])}"
                if len(selectors) > 5:
                    report += f" 等{len(selectors)}个"
                report += "\n"
    else:
        report += "- 无可抽取的布局模式\n"
    
    # 变量化建议
    report += """
## 变量化建议

### 推荐定义的CSS变量

```css
:root {
"""
    
    # 颜色变量建议
    for i, (color, _) in enumerate(sorted(dup_colors.items(), key=lambda x: -x[1])[:5]):
        report += f"    --app-color-{i+1}: {color};\n"
    
    # 间距变量建议
    for space, _ in sorted(dup_spacing.items(), key=lambda x: -x[1])[:3]:
        name = space.replace('px', '')
        report += f"    --app-space-{name}: {space};\n"
    
    # 圆角变量建议
    for i, (r, _) in enumerate(sorted(dup_radius.items(), key=lambda x: -x[1])[:3]):
        report += f"    --app-radius-{i+1}: {r};\n"
    
    report += """}
```

## 重构优先级建议

"""
    
    total_duplicates = len(dup_colors) + len(dup_spacing) + len(dup_radius) + len(dup_shadows) + len(dup_gradients)
    
    if total_duplicates > 20:
        report += "**优先级: 高** - 存在大量重复代码，建议进行全面重构\n"
    elif total_duplicates > 10:
        report += "**优先级: 中** - 存在较多重复代码，建议进行变量化重构\n"
    elif total_duplicates > 5:
        report += "**优先级: 低** - 存在少量重复代码，可进行增量优化\n"
    else:
        report += "**优先级: 无** - 代码重复率较低，无需重构\n"
    
    return report


def main():
    parser = argparse.ArgumentParser(description='CSS重复代码诊断工具')
    parser.add_argument('css_file', help='CSS文件路径')
    parser.add_argument('--output', '-o', help='输出报告文件路径')
    
    args = parser.parse_args()
    
    css_path = Path(args.css_file)
    if not css_path.exists():
        print(f"错误: 文件不存在 - {args.css_file}")
        sys.exit(1)
    
    content = css_path.read_text(encoding='utf-8')
    rules = parse_css(content)
    report = generate_report(args.css_file, rules)
    
    if args.output:
        Path(args.output).write_text(report, encoding='utf-8')
        print(f"报告已保存到: {args.output}")
    else:
        print(report)


if __name__ == '__main__':
    main()
