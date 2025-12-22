#!/usr/bin/env python3
"""
JavaScript 代码质量诊断脚本
分析 JS 文件中的常见问题：全局变量、回调嵌套、代码重复等
"""

import os
import re
import sys
import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Tuple

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
class AnalysisResult:
    """分析结果"""
    files_analyzed: int = 0
    total_lines: int = 0
    issues: List[Issue] = field(default_factory=list)
    metrics: Dict[str, any] = field(default_factory=dict)

class JavaScriptAnalyzer:
    """JavaScript 代码分析器"""
    
    def __init__(self):
        self.result = AnalysisResult()
        
        # 问题检测模式
        self.patterns = {
            'var_usage': (
                r'\bvar\s+\w+',
                'warning',
                '使用 var 声明变量',
                '建议使用 const 或 let 替代 var'
            ),
            'global_var': (
                r'^(?:var|let|const)\s+\w+\s*=',
                'warning',
                '顶层变量声明',
                '可能造成全局污染，考虑使用模块化'
            ),
            'callback_hell': (
                r'function\s*\([^)]*\)\s*\{[^}]*function\s*\([^)]*\)\s*\{',
                'warning',
                '嵌套回调',
                '建议使用 Promise 或 async/await 重构'
            ),
            'magic_number': (
                r'(?<!["\'\w])\b(?!0\b|1\b|2\b|-1\b)\d{2,}\b(?!["\'])',
                'info',
                '魔法数字',
                '建议提取为命名常量'
            ),
            'console_log': (
                r'\bconsole\.(log|debug|info)\s*\(',
                'info',
                'console 调试语句',
                '生产环境应移除或使用日志库'
            ),
            'eval_usage': (
                r'\beval\s*\(',
                'error',
                '使用 eval',
                'eval 存在安全风险，应避免使用'
            ),
            'with_statement': (
                r'\bwith\s*\(',
                'error',
                '使用 with 语句',
                'with 语句已废弃，应避免使用'
            ),
            'double_equals': (
                r'[^=!<>]==[^=]',
                'warning',
                '使用 == 比较',
                '建议使用 === 进行严格比较'
            ),
            'sync_xhr': (
                r'\.open\s*\([^,]+,\s*[^,]+,\s*false\s*\)',
                'error',
                '同步 XHR 请求',
                '同步请求会阻塞主线程，应使用异步方式'
            ),
            'innerhtml': (
                r'\.innerHTML\s*=',
                'warning',
                '直接操作 innerHTML',
                '可能存在 XSS 风险，建议使用 textContent 或 DOM API'
            ),
            'document_write': (
                r'\bdocument\.write\s*\(',
                'error',
                '使用 document.write',
                'document.write 会阻塞解析，应避免使用'
            ),
            'settimeout_string': (
                r'setTimeout\s*\(\s*["\']',
                'error',
                'setTimeout 使用字符串参数',
                '应使用函数而非字符串'
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
                continue
            
            for pattern_name, (pattern, severity, category, message) in self.patterns.items():
                if re.search(pattern, line):
                    self.result.issues.append(Issue(
                        file=rel_path,
                        line=line_num,
                        severity=severity,
                        category=category,
                        message=message,
                        code=line.strip()[:80]
                    ))
        
        # 分析函数长度
        self._analyze_function_length(content, rel_path)
        
        # 分析嵌套深度
        self._analyze_nesting_depth(lines, rel_path)
    
    def _analyze_function_length(self, content: str, filepath: str) -> None:
        """分析函数长度"""
        # 简单匹配函数定义
        func_pattern = r'(?:function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?function|\w+\s*:\s*(?:async\s+)?function|\w+\s*\([^)]*\)\s*\{)'
        
        lines = content.split('\n')
        in_function = False
        func_start = 0
        brace_count = 0
        
        for i, line in enumerate(lines):
            if re.search(func_pattern, line):
                in_function = True
                func_start = i + 1
                brace_count = line.count('{') - line.count('}')
            elif in_function:
                brace_count += line.count('{') - line.count('}')
                if brace_count <= 0:
                    func_length = i - func_start + 2
                    if func_length > 50:
                        self.result.issues.append(Issue(
                            file=filepath,
                            line=func_start,
                            severity='warning',
                            category='函数过长',
                            message=f'函数长度 {func_length} 行，超过建议的 50 行',
                            code=''
                        ))
                    in_function = False
    
    def _analyze_nesting_depth(self, lines: List[str], filepath: str) -> None:
        """分析嵌套深度"""
        max_depth = 0
        current_depth = 0
        max_depth_line = 0
        
        for i, line in enumerate(lines, 1):
            current_depth += line.count('{') - line.count('}')
            if current_depth > max_depth:
                max_depth = current_depth
                max_depth_line = i
        
        if max_depth > 4:
            self.result.issues.append(Issue(
                file=filepath,
                line=max_depth_line,
                severity='warning',
                category='嵌套过深',
                message=f'最大嵌套深度 {max_depth} 层，超过建议的 4 层',
                code=''
            ))
    
    def analyze_directory(self, directory: str, extensions: Tuple[str, ...] = ('.js', '.mjs')) -> None:
        """分析目录下的所有文件"""
        path = Path(directory)
        
        for filepath in path.rglob('*'):
            if filepath.suffix in extensions:
                # 跳过 node_modules 和 dist
                if 'node_modules' in str(filepath) or 'dist' in str(filepath):
                    continue
                self.analyze_file(str(filepath))
    
    def generate_report(self) -> str:
        """生成分析报告"""
        report = []
        report.append("=" * 60)
        report.append("JavaScript 代码质量分析报告")
        report.append("=" * 60)
        report.append("")
        
        # 概览
        report.append("## 概览")
        report.append(f"- 分析文件数: {self.result.files_analyzed}")
        report.append(f"- 总代码行数: {self.result.total_lines}")
        report.append(f"- 发现问题数: {len(self.result.issues)}")
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
            ]
        }, ensure_ascii=False, indent=2)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python analyze-js.py <目录或文件> [--json]")
        print("示例: python analyze-js.py ./src")
        print("      python analyze-js.py ./src/app.js --json")
        sys.exit(1)
    
    target = sys.argv[1]
    output_json = '--json' in sys.argv
    
    analyzer = JavaScriptAnalyzer()
    
    if os.path.isfile(target):
        analyzer.analyze_file(target)
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
