#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP 命令生成器

将执行步骤转换为 MCP 工具调用参数，AI 直接复制执行。
节省 ~70% Token。

用法:
    python mcp_command_generator.py steps.json --mcp playwright --output commands.json

依赖: 无
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from encoding_utils import setup_encoding
setup_encoding()

import json
import argparse
import logging
from typing import Dict, List, Any

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class MCPCommandGenerator:
    # 操作类型到 MCP 工具的映射
    ACTION_MAP = {
        "playwright": {
            "SPA导航": ("browser_navigate", lambda s: {"url": s.get("value", s.get("selector", ""))}),
            "点击": ("browser_click", lambda s: {"element": s.get("selector", ""), "ref": s.get("target", "")}),
            "输入": ("browser_type", lambda s: {"element": s.get("selector", ""), "text": s.get("value", ""), "ref": s.get("target", "")}),
            "清空并输入": ("browser_type", lambda s: {"element": s.get("selector", ""), "text": s.get("value", ""), "clear": True}),
            "悬停": ("browser_hover", lambda s: {"element": s.get("selector", ""), "ref": s.get("target", "")}),
            "截图": ("browser_take_screenshot", lambda s: {}),
            "等待": ("browser_wait_for", lambda s: {"text": s.get("value", ""), "timeout": s.get("timeout", 10000)}),
        },
        "devtools": {
            "SPA导航": ("navigate_page", lambda s: {"url": s.get("value", s.get("selector", ""))}),
            "点击": ("click", lambda s: {"uid": s.get("target", "")}),
            "输入": ("fill", lambda s: {"uid": s.get("target", ""), "value": s.get("value", "")}),
            "截图": ("take_screenshot", lambda s: {}),
        }
    }
    
    def __init__(self, mcp_type: str = "playwright"):
        self.mcp_type = mcp_type
        self.action_map = self.ACTION_MAP.get(mcp_type, self.ACTION_MAP["playwright"])
    
    def generate(self, steps: List[Dict]) -> List[Dict]:
        commands = []
        for step in steps:
            action = step.get("action", "")
            if action not in self.action_map:
                commands.append({"step": step.get("seq", 0), "action": action, "tool": None, 
                                "note": f"操作 '{action}' 需要手动处理"})
                continue
            
            tool_name, args_fn = self.action_map[action]
            args = args_fn(step)
            
            # 清理空值
            args = {k: v for k, v in args.items() if v}
            
            commands.append({
                "step": step.get("seq", 0),
                "action": action,
                "description": step.get("description", ""),
                "tool": tool_name,
                "args": args,
            })
        return commands
    
    def generate_from_case(self, case: Dict) -> Dict:
        steps = case.get("steps", [])
        commands = self.generate(steps)
        
        return {
            "caseId": case.get("caseId", ""),
            "name": case.get("name", ""),
            "baseURL": case.get("baseURL", ""),
            "user": case.get("user", {}),
            "commandCount": len(commands),
            "commands": commands,
        }


def main():
    parser = argparse.ArgumentParser(description="MCP 命令生成器")
    parser.add_argument("input", help="输入文件 (execution_parser 输出的 JSON)")
    parser.add_argument("--mcp", "-m", choices=["playwright", "devtools"], default="playwright")
    parser.add_argument("--output", "-o", help="输出文件路径")
    parser.add_argument("--case", "-c", help="指定用例ID")
    args = parser.parse_args()
    
    # 读取输入
    try:
        with open(args.input, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"读取输入文件失败: {e}")
        sys.exit(1)
    
    generator = MCPCommandGenerator(args.mcp)
    
    # 处理用例
    cases = data.get("cases", [data] if "steps" in data else [])
    results = []
    
    for case in cases:
        if args.case and case.get("caseId") != args.case:
            continue
        results.append(generator.generate_from_case(case))
    
    output = {"mcp": args.mcp, "count": len(results), "cases": results}
    output_str = json.dumps(output, ensure_ascii=False, indent=2)
    
    if args.output:
        Path(args.output).write_text(output_str, encoding='utf-8')
        logger.info(f"已保存: {args.output}")
    else:
        print(output_str)
    sys.exit(0)


if __name__ == "__main__":
    main()
