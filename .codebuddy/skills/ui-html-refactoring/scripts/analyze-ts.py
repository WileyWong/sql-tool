#!/usr/bin/env python3
"""
TypeScript 代码质量诊断脚本
分析 TS 文件中的类型安全问题：any 滥用、类型断言、重复类型等
"""

import os
import re
import sys
import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Tuple, Set

@dataclass
class Issue:
    """问题记录"""
    file: str
    line: int
    severity: str  # error, warning, info
    category: str
    message: str
    code: str = ""

@dataclass
class TypeDefinition:
    """类型定义记录"""
    name: str
    file: str
    line: int
    properties: Set[str] = field(default_factory=set)

@dataclass
class AnalysisResult:
    """分析结果"""
    files_analyzed: int = 0
    total_lines: int = 0
    issues: List[Issue] = field(default_factory=list)
    type_definitions: List[TypeDefinition] = field(default_factory=list)
    metrics: Dict[str, any] = field(default_factory=dict)

class TypeScriptAnalyzer:
    """TypeScript 代码分析器"""
    
    def __init__(self):
        self.result = AnalysisResult()
        
        # 问题检测模式
        self.patterns = {
            'any_type': (
                r':\s*any\b',
                'error',
                'any 类型',
                '避免使用 any，应定义具体类型'
            ),
            'any_array': (
                r':\s*any\[\]',
                'error',
                'any[] 数组类型',
                '应定义具体的数组元素类型'
            ),
            'any_return': (
                r'\)\s*:\s*any\s*[{=]',
                'error',
                '函数返回 any',
                '应定义具体的返回类型'
            ),
            'any_param': (
                r'\(\s*\w+\s*:\s*any\b',
                'error',
                '参数使用 any',
                '应定义具体的参数类型'
            ),
            'as_any': (
                r'\bas\s+any\b',
                'error',
                'as any 类型断言',
                '应使用类型守卫或正确的类型定义'
            ),
            'type_assertion': (
                r'<[A-Z]\w*>(?!\s*\()',
                'warning',
                '尖括号类型断言',
                '建议使用 as 语法，避免与 JSX 冲突'
            ),
            'non_null_assertion': (
                r'\w+!\.',
                'warning',
                '非空断言 (!)',
                '应使用可选链 (?.) 或正确处理 null/undefined'
            ),
            'ts_ignore': (
                r'@ts-ignore',
                'error',
                '@ts-ignore 注释',
                '应修复类型错误而非忽略'
            ),
            'ts_nocheck': (
                r'@ts-nocheck',
                'error',
                '@ts-nocheck 注释',
                '不应禁用整个文件的类型检查'
            ),
            'object_type': (
                r':\s*object\b(?!\s*\|)',
                'warning',
                'object 类型',
                '应使用更具体的对象类型定义'
            ),
            'function_type': (
                r':\s*Function\b',
                'warning',
                'Function 类型',
                '应使用具体的函数签名类型'
            ),
            'implicit_any_param': (
                r'(?:function\s+\w+|=>\s*)\s*\(\s*\w+\s*(?:,\s*\w+\s*)*\)',
                'info',
                '可能的隐式 any 参数',
                '检查是否缺少参数类型注解'
            ),
            'empty_interface': (
                r'interface\s+\w+\s*\{\s*\}',
                'info',
                '空接口',
                '空接口可能表示设计问题'
            ),
            'type_import': (
                r'^import\s+\{[^}]*\}\s+from',
                'info',
                '可能缺少 type 导入',
                '纯类型导入建议使用 import type'
            )
        }
    
    def analyze_file(self, filepath: str) -> None:
        """分析单个文件"""
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
        except Exception as e:
            print(f"警告: 无法读取文件 {filepath}: {e}", file=sys.stderr)
            return
        
        self.result.files_analyzed += 1
        self.result.total_lines += len(lines)
        
        rel_path = os.path.relpath(filepath)
        
        # 检测各类问题
        for line_num, line in enumerate(lines, 1):
            # 跳过注释行
            stripped = line.strip()
            if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
                # 但检查 @ts-ignore 和 @ts-nocheck
                if '@ts-ignore' in line or '@ts-nocheck' in line:
                    for pattern_name in ['ts_ignore', 'ts_nocheck']:
                        pattern, severity, category, message = self.patterns[pattern_name]
                        if re.search(pattern, line):
                            self.result.issues.append(Issue(
                                file=rel_path,
                                line=line_num,
                                severity=severity,
                                category=category,
                                message=message,
                                code=line.strip()[:80]
                            ))
                continue
            
            for pattern_name, (pattern, severity, category, message) in self.patterns.items():
                if pattern_name in ['ts_ignore', 'ts_nocheck']:
                    continue  # 已在上面处理
                if re.search(pattern, line):
                    self.result.issues.append(Issue(
                        file=rel_path,
                        line=line_num,
                        severity=severity,
                        category=category,
                        message=message,
                        code=line.strip()[:80]
                    ))
        
        # 分析类型定义
        self._analyze_type_definitions(content, rel_path)
        
        # 分析泛型使用
        self._analyze_generic_usage(content, rel_path)
    
    def _analyze_type_definitions(self, content: str, filepath: str) -> None:
        """分析类型定义，检测重复"""
        lines = content.split('\n')
        
        # 匹配 interface 和 type 定义
        interface_pattern = r'(?:export\s+)?interface\s+(\w+)'
        type_pattern = r'(?:export\s+)?type\s+(\w+)\s*='
        
        for i, line in enumerate(lines, 1):
            # 检查 interface
            match = re.search(interface_pattern, line)
            if match:
                name = match.group(1)
                # 提取属性
                properties = set()
                brace_count = line.count('{') - line.count('}')
                j = i
                while brace_count > 0 and j < len(lines):
                    prop_match = re.search(r'^\s*(\w+)\s*[?:]', lines[j])
                    if prop_match:
                        properties.add(prop_match.group(1))
                    brace_count += lines[j].count('{') - lines[j].count('}')
                    j += 1
                
                self.result.type_definitions.append(TypeDefinition(
                    name=name,
                    file=filepath,
                    line=i,
                    properties=properties
                ))
            
            # 检查 type
            match = re.search(type_pattern, line)
            if match:
                name = match.group(1)
                self.result.type_definitions.append(TypeDefinition(
                    name=name,
                    file=filepath,
                    line=i,
                    properties=set()
                ))
    
    def _analyze_generic_usage(self, content: str, filepath: str) -> None:
        """分析泛型使用情况"""
        # 检查是否有可以使用泛型的重复模式
        # 例如：多个相似的函数只是类型不同
        pass  # 简化实现
    
    def _check_duplicate_types(self) -> None:
        """检查重复的类型定义"""
        # 按名称分组
        by_name: Dict[str, List[TypeDefinition]] = {}
        for td in self.result.type_definitions:
            if td.name not in by_name:
                by_name[td.name] = []
            by_name[td.name].append(td)
        
        # 检查同名类型
        for name, definitions in by_name.items():
            if len(definitions) > 1:
                for td in definitions:
                    self.result.issues.append(Issue(
                        file=td.file,
                        line=td.line,
                        severity='warning',
                        category='重复类型定义',
                        message=f'类型 {name} 在多处定义，考虑统一',
                        code=''
                    ))
        
        # 检查相似属性的接口
        interfaces = [td for td in self.result.type_definitions if td.properties]
        for i, td1 in enumerate(interfaces):
            for td2 in interfaces[i+1:]:
                if td1.properties and td2.properties:
                    common = td1.properties & td2.properties
                    if len(common) >= 3 and len(common) / max(len(td1.properties), len(td2.properties)) > 0.7:
                        self.result.issues.append(Issue(
                            file=td1.file,
                            line=td1.line,
                            severity='info',
                            category='相似类型定义',
                            message=f'{td1.name} 与 {td2.name} 有 {len(common)} 个相同属性，考虑提取基类型',
                            code=''
                        ))
    
    def analyze_directory(self, directory: str, extensions: Tuple[str, ...] = ('.ts', '.tsx')) -> None:
        """分析目录下的所有文件"""
        path = Path(directory)
        
        for filepath in path.rglob('*'):
            if filepath.suffix in extensions:
                # 跳过 node_modules、dist 和 .d.ts 文件
                filepath_str = str(filepath)
                if 'node_modules' in filepath_str or 'dist' in filepath_str:
                    continue
                if filepath_str.endswith('.d.ts'):
                    continue
                self.analyze_file(filepath_str)
        
        # 分析完成后检查重复类型
        self._check_duplicate_types()
    
    def generate_report(self) -> str:
        """生成分析报告"""
        report = []
        report.append("=" * 60)
        report.append("TypeScript 代码质量分析报告")
        report.append("=" * 60)
        report.append("")
        
        # 概览
        report.append("## 概览")
        report.append(f"- 分析文件数: {self.result.files_analyzed}")
        report.append(f"- 总代码行数: {self.result.total_lines}")
        report.append(f"- 发现问题数: {len(self.result.issues)}")
        report.append(f"- 类型定义数: {len(self.result.type_definitions)}")
        report.append("")
        
        # 按严重程度统计
        severity_count = {'error': 0, 'warning': 0, 'info': 0}
        for issue in self.result.issues:
            severity_count[issue.severity] += 1
        
        report.append("## 问题统计")
        report.append(f"- 错误 (error): {severity_count['error']}")
        report.append(f"- 警告 (warning): {severity_count['warning']}")
        report.append(f"- 提示 (info): {severity_count['info']}")
        report.append("")
        
        # 类型安全评分
        any_count = sum(1 for i in self.result.issues if 'any' in i.category.lower())
        assertion_count = sum(1 for i in self.result.issues if '断言' in i.category)
        
        report.append("## 类型安全指标")
        report.append(f"- any 类型使用: {any_count}")
        report.append(f"- 类型断言使用: {assertion_count}")
        report.append(f"- @ts-ignore 使用: {sum(1 for i in self.result.issues if 'ts-ignore' in i.category.lower())}")
        report.append("")
        
        # 按类别统计
        category_count: Dict[str, int] = {}
        for issue in self.result.issues:
            category_count[issue.category] = category_count.get(issue.category, 0) + 1
        
        if category_count:
            report.append("## 问题分类")
            for category, count in sorted(category_count.items(), key=lambda x: -x[1]):
                report.append(f"- {category}: {count}")
            report.append("")
        
        # 详细问题列表
        if self.result.issues:
            report.append("## 详细问题")
            report.append("")
            
            # 按文件分组
            issues_by_file: Dict[str, List[Issue]] = {}
            for issue in self.result.issues:
                if issue.file not in issues_by_file:
                    issues_by_file[issue.file] = []
                issues_by_file[issue.file].append(issue)
            
            for filepath, issues in sorted(issues_by_file.items()):
                report.append(f"### {filepath}")
                for issue in sorted(issues, key=lambda x: x.line):
                    severity_icon = {'error': '❌', 'warning': '⚠️', 'info': 'ℹ️'}[issue.severity]
                    report.append(f"  {severity_icon} 行 {issue.line}: [{issue.category}] {issue.message}")
                    if issue.code:
                        report.append(f"     代码: {issue.code}")
                report.append("")
        
        return '\n'.join(report)
    
    def to_json(self) -> str:
        """输出 JSON 格式结果"""
        return json.dumps({
            'files_analyzed': self.result.files_analyzed,
            'total_lines': self.result.total_lines,
            'type_definitions': len(self.result.type_definitions),
            'issues': [
                {
                    'file': i.file,
                    'line': i.line,
                    'severity': i.severity,
                    'category': i.category,
                    'message': i.message,
                    'code': i.code
                }
                for i in self.result.issues
            ],
            'metrics': {
                'any_count': sum(1 for i in self.result.issues if 'any' in i.category.lower()),
                'assertion_count': sum(1 for i in self.result.issues if '断言' in i.category),
                'ts_ignore_count': sum(1 for i in self.result.issues if 'ts-ignore' in i.category.lower())
            }
        }, ensure_ascii=False, indent=2)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python analyze-ts.py <目录或文件> [--json]")
        print("示例: python analyze-ts.py ./src")
        print("      python analyze-ts.py ./src/app.ts --json")
        sys.exit(1)
    
    target = sys.argv[1]
    output_json = '--json' in sys.argv
    
    analyzer = TypeScriptAnalyzer()
    
    if os.path.isfile(target):
        analyzer.analyze_file(target)
        analyzer._check_duplicate_types()
    elif os.path.isdir(target):
        analyzer.analyze_directory(target)
    else:
        print(f"错误: 路径不存在 {target}", file=sys.stderr)
        sys.exit(1)
    
    if output_json:
        print(analyzer.to_json())
    else:
        print(analyzer.generate_report())


if __name__ == '__main__':
    main()
