#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
执行结果分析器

解析 progress.md 和 execution.log，生成结构化的测试报告。
避免 AI 逐行解析日志，节省 ~85% Token。

用法:
    # 分析执行结果目录
    python result_analyzer.py execute-20251231-103000/
    
    # 输出到文件
    python result_analyzer.py execute-20251231-103000/ --output report.json
    
    # 仅分析失败用例
    python result_analyzer.py execute-20251231-103000/ --failures-only

输出:
    结构化的分析报告 JSON，包含：
    - 执行统计（通过率、失败分布）
    - 按优先级统计
    - 失败详情（错误类型、修复建议）
    - 慢用例列表

依赖:
    无额外依赖
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
from enum import Enum

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ExecutionStatus(Enum):
    """执行状态"""
    PENDING = "待执行"
    RUNNING = "执行中"
    PASSED = "通过"
    FAILED = "失败"
    SKIPPED = "跳过"
    BLOCKED = "阻塞"


class ErrorType(Enum):
    """错误类型"""
    ELEMENT_NOT_FOUND = "元素定位"
    TIMEOUT = "超时"
    ASSERTION_FAILED = "断言失败"
    NETWORK_ERROR = "网络错误"
    NAVIGATION_ERROR = "导航错误"
    SCRIPT_ERROR = "脚本错误"
    UNKNOWN = "未知错误"


@dataclass
class CaseResult:
    """用例执行结果"""
    case_id: str
    name: str = ""
    priority: str = "P1"
    status: str = "待执行"
    duration: float = 0.0  # 秒
    error_type: str = ""
    error_message: str = ""
    error_step: int = 0
    screenshot: str = ""
    suggestion: str = ""


@dataclass
class AnalysisReport:
    """分析报告"""
    # 基本信息
    source_dir: str = ""
    analyzed_at: str = ""
    
    # 统计摘要
    total: int = 0
    passed: int = 0
    failed: int = 0
    skipped: int = 0
    blocked: int = 0
    pass_rate: str = "0%"
    total_duration: str = "0s"
    
    # 按优先级统计
    by_priority: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    
    # 失败详情
    failures: List[Dict[str, Any]] = field(default_factory=list)
    
    # 慢用例
    slow_cases: List[Dict[str, Any]] = field(default_factory=list)
    
    # 错误分类
    error_distribution: Dict[str, int] = field(default_factory=dict)


class ResultAnalyzer:
    """执行结果分析器"""
    
    # 错误模式识别
    ERROR_PATTERNS = [
        # (正则, 错误类型, 修复建议)
        (r"Element not found|locator.+not found|No element matches", 
         ErrorType.ELEMENT_NOT_FOUND, 
         "更新选择器或检查页面结构是否变化"),
        (r"Timeout|timed out|exceeded timeout",
         ErrorType.TIMEOUT,
         "增加超时时间或检查页面加载性能"),
        (r"expect\(.+\)\.to|assertion failed|AssertionError",
         ErrorType.ASSERTION_FAILED,
         "检查期望值是否正确或页面状态是否符合预期"),
        (r"net::ERR_|NetworkError|fetch failed|ECONNREFUSED",
         ErrorType.NETWORK_ERROR,
         "检查网络连接或目标服务是否可用"),
        (r"Navigation|navigat|page.goto|ERR_NAME_NOT_RESOLVED",
         ErrorType.NAVIGATION_ERROR,
         "检查 URL 是否正确或页面是否存在"),
        (r"Error:|Exception:|Uncaught|ReferenceError|TypeError",
         ErrorType.SCRIPT_ERROR,
         "检查测试脚本逻辑或页面 JavaScript 错误"),
    ]
    
    # 慢用例阈值（秒）
    SLOW_THRESHOLD = 30.0
    
    def __init__(self):
        self.cases: Dict[str, CaseResult] = {}
        self.report = AnalysisReport()
    
    def analyze(self, result_dir: str) -> AnalysisReport:
        """
        分析执行结果目录
        
        Args:
            result_dir: 执行结果目录路径
        
        Returns:
            AnalysisReport
        """
        result_path = Path(result_dir)
        if not result_path.exists():
            logger.error(f"目录不存在: {result_dir}")
            return self.report
        
        self.report.source_dir = str(result_path.absolute())
        self.report.analyzed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 解析 progress.md
        progress_file = result_path / "progress.md"
        if progress_file.exists():
            self._parse_progress(progress_file)
        
        # 解析 execution.log
        log_file = result_path / "logs" / "execution.log"
        if not log_file.exists():
            log_file = result_path / "execution.log"
        if log_file.exists():
            self._parse_log(log_file)
        
        # 扫描截图
        self._scan_screenshots(result_path)
        
        # 生成统计
        self._generate_statistics()
        
        return self.report
    
    def _parse_progress(self, filepath: Path):
        """解析 progress.md 文件"""
        try:
            content = filepath.read_text(encoding='utf-8')
        except Exception as e:
            logger.error(f"读取 progress.md 失败: {e}")
            return
        
        # 解析用例状态
        # 格式: | 1 | TC-001 | 用例名称 | P0 | 通过 | 5.2s |
        table_pattern = r'\|\s*(\d+)\s*\|\s*([^\|]+)\s*\|\s*([^\|]+)\s*\|\s*(P\d)\s*\|\s*(\S+)\s*\|\s*([\d.]+)s?\s*\|'
        
        for match in re.finditer(table_pattern, content):
            seq, case_id, name, priority, status, duration = match.groups()
            case_id = case_id.strip()
            
            if case_id not in self.cases:
                self.cases[case_id] = CaseResult(case_id=case_id)
            
            self.cases[case_id].name = name.strip()
            self.cases[case_id].priority = priority.strip()
            self.cases[case_id].status = status.strip()
            
            try:
                self.cases[case_id].duration = float(duration)
            except ValueError:
                pass
        
        # 解析错误信息
        # 格式: ### TC-001 失败详情
        error_pattern = r'###\s+(\S+)\s+失败详情\s*\n([\s\S]*?)(?=###|\Z)'
        
        for match in re.finditer(error_pattern, content):
            case_id, error_content = match.groups()
            case_id = case_id.strip()
            
            if case_id in self.cases:
                # 提取错误步骤
                step_match = re.search(r'步骤\s*(\d+)', error_content)
                if step_match:
                    self.cases[case_id].error_step = int(step_match.group(1))
                
                # 提取错误信息
                error_lines = [line.strip() for line in error_content.split('\n') if line.strip()]
                if error_lines:
                    self.cases[case_id].error_message = '\n'.join(error_lines[:3])
    
    def _parse_log(self, filepath: Path):
        """解析 execution.log 文件"""
        try:
            content = filepath.read_text(encoding='utf-8')
        except Exception as e:
            logger.error(f"读取 execution.log 失败: {e}")
            return
        
        # 解析日志中的错误信息
        # 格式: [ERROR] [TC-001] Step 3: Element not found
        error_pattern = r'\[ERROR\]\s*\[([^\]]+)\](?:\s*Step\s*(\d+):?)?\s*(.+)'
        
        for match in re.finditer(error_pattern, content):
            case_id, step, message = match.groups()
            case_id = case_id.strip()
            
            if case_id not in self.cases:
                self.cases[case_id] = CaseResult(case_id=case_id)
            
            if step:
                self.cases[case_id].error_step = int(step)
            
            if message:
                self.cases[case_id].error_message = message.strip()
        
        # 解析执行时间
        # 格式: [INFO] [TC-001] Completed in 5.2s
        time_pattern = r'\[INFO\]\s*\[([^\]]+)\]\s*Completed in\s*([\d.]+)s'
        
        for match in re.finditer(time_pattern, content):
            case_id, duration = match.groups()
            case_id = case_id.strip()
            
            if case_id in self.cases:
                try:
                    self.cases[case_id].duration = float(duration)
                except ValueError:
                    pass
    
    def _scan_screenshots(self, result_dir: Path):
        """扫描截图文件"""
        # 查找所有截图
        for ext in ['*.png', '*.jpg', '*.jpeg']:
            for screenshot in result_dir.glob(ext):
                # 从文件名提取用例ID
                # 格式: TC-001_error_103015.png 或 TC-001_success_103015.png
                name = screenshot.stem
                match = re.match(r'(TC-[^_]+)_(error|success|fail)', name)
                if match:
                    case_id = match.group(1)
                    if case_id in self.cases:
                        self.cases[case_id].screenshot = str(screenshot.name)
    
    def _classify_error(self, error_message: str) -> Tuple[ErrorType, str]:
        """分类错误并生成修复建议"""
        if not error_message:
            return ErrorType.UNKNOWN, "检查执行日志获取更多信息"
        
        for pattern, error_type, suggestion in self.ERROR_PATTERNS:
            if re.search(pattern, error_message, re.IGNORECASE):
                return error_type, suggestion
        
        return ErrorType.UNKNOWN, "检查执行日志获取更多信息"
    
    def _generate_statistics(self):
        """生成统计数据"""
        # 基础统计
        self.report.total = len(self.cases)
        
        total_duration = 0.0
        priority_stats: Dict[str, Dict[str, int]] = {}
        error_dist: Dict[str, int] = {}
        
        for case in self.cases.values():
            # 状态统计
            if case.status in ["通过", "PASSED", "passed"]:
                self.report.passed += 1
            elif case.status in ["失败", "FAILED", "failed"]:
                self.report.failed += 1
                
                # 分类错误
                error_type, suggestion = self._classify_error(case.error_message)
                case.error_type = error_type.value
                case.suggestion = suggestion
                
                # 错误分布
                error_dist[error_type.value] = error_dist.get(error_type.value, 0) + 1
                
                # 添加到失败列表
                self.report.failures.append({
                    "caseId": case.case_id,
                    "name": case.name,
                    "priority": case.priority,
                    "step": case.error_step,
                    "errorType": case.error_type,
                    "message": case.error_message[:200] if case.error_message else "",
                    "screenshot": case.screenshot,
                    "suggestion": case.suggestion,
                })
            elif case.status in ["跳过", "SKIPPED", "skipped"]:
                self.report.skipped += 1
            elif case.status in ["阻塞", "BLOCKED", "blocked"]:
                self.report.blocked += 1
            
            # 时间统计
            total_duration += case.duration
            
            # 优先级统计
            priority = case.priority or "P1"
            if priority not in priority_stats:
                priority_stats[priority] = {"passed": 0, "failed": 0, "total": 0}
            priority_stats[priority]["total"] += 1
            if case.status in ["通过", "PASSED", "passed"]:
                priority_stats[priority]["passed"] += 1
            elif case.status in ["失败", "FAILED", "failed"]:
                priority_stats[priority]["failed"] += 1
            
            # 慢用例
            if case.duration > self.SLOW_THRESHOLD:
                self.report.slow_cases.append({
                    "caseId": case.case_id,
                    "name": case.name,
                    "duration": f"{case.duration:.1f}s",
                    "reason": self._guess_slow_reason(case),
                })
        
        # 计算通过率
        if self.report.total > 0:
            rate = (self.report.passed / self.report.total) * 100
            self.report.pass_rate = f"{rate:.1f}%"
        
        # 格式化总时间
        if total_duration < 60:
            self.report.total_duration = f"{total_duration:.1f}s"
        elif total_duration < 3600:
            minutes = int(total_duration // 60)
            seconds = int(total_duration % 60)
            self.report.total_duration = f"{minutes}m{seconds}s"
        else:
            hours = int(total_duration // 3600)
            minutes = int((total_duration % 3600) // 60)
            self.report.total_duration = f"{hours}h{minutes}m"
        
        # 优先级统计
        for priority, stats in priority_stats.items():
            if stats["total"] > 0:
                rate = (stats["passed"] / stats["total"]) * 100
                self.report.by_priority[priority] = {
                    "passed": stats["passed"],
                    "failed": stats["failed"],
                    "total": stats["total"],
                    "rate": f"{rate:.1f}%",
                }
        
        # 错误分布
        self.report.error_distribution = error_dist
        
        # 按优先级排序失败列表
        priority_order = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}
        self.report.failures.sort(key=lambda x: priority_order.get(x.get("priority", "P1"), 1))
        
        # 按时间排序慢用例
        self.report.slow_cases.sort(key=lambda x: float(x["duration"].rstrip("s")), reverse=True)
    
    def _guess_slow_reason(self, case: CaseResult) -> str:
        """推测慢用例原因"""
        if case.duration > 120:
            return "可能存在大量数据加载或复杂操作"
        elif case.duration > 60:
            return "可能存在网络延迟或页面加载慢"
        else:
            return "可能存在不必要的等待"
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            "sourceDir": self.report.source_dir,
            "analyzedAt": self.report.analyzed_at,
            "summary": {
                "total": self.report.total,
                "passed": self.report.passed,
                "failed": self.report.failed,
                "skipped": self.report.skipped,
                "blocked": self.report.blocked,
                "passRate": self.report.pass_rate,
                "duration": self.report.total_duration,
            },
            "byPriority": self.report.by_priority,
            "errorDistribution": self.report.error_distribution,
            "failures": self.report.failures,
            "slowCases": self.report.slow_cases,
        }


def main():
    parser = argparse.ArgumentParser(
        description="执行结果分析器 - 解析 progress.md 和 execution.log",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 分析执行结果目录
  python result_analyzer.py execute-20251231-103000/
  
  # 输出到文件
  python result_analyzer.py execute-20251231-103000/ --output report.json
  
  # 仅显示失败用例
  python result_analyzer.py execute-20251231-103000/ --failures-only
        """
    )
    
    parser.add_argument("result_dir", help="执行结果目录路径")
    parser.add_argument("--output", "-o", help="输出文件路径")
    parser.add_argument("--failures-only", "-f", action="store_true", help="仅显示失败用例")
    
    args = parser.parse_args()
    
    # 检查目录存在
    result_path = Path(args.result_dir)
    if not result_path.exists():
        logger.error(f"目录不存在: {args.result_dir}")
        sys.exit(1)
    
    # 分析
    analyzer = ResultAnalyzer()
    analyzer.analyze(args.result_dir)
    
    # 获取结果
    result = analyzer.to_dict()
    
    # 仅失败用例
    if args.failures_only:
        result = {
            "summary": result["summary"],
            "failures": result["failures"],
        }
    
    # 输出
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        logger.info(f"已保存: {args.output}")
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    
    # 根据结果返回退出码
    if analyzer.report.failed > 0:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
