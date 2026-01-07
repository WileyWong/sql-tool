#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快照差异分析器

对比两次页面快照，识别新增/删除/变化的元素。
节省 ~70% Token。

用法:
    python snapshot_diff.py before.txt after.txt --output diff.json

依赖: 无
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from encoding_utils import setup_encoding
setup_encoding()

import re
import json
import argparse
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@dataclass
class Element:
    uid: str
    role: str
    name: str
    attributes: Dict[str, str] = field(default_factory=dict)


class SnapshotDiff:
    INTERACTIVE_ROLES = {"button", "link", "textbox", "checkbox", "radio", "combobox", "tab", "menuitem"}
    
    def __init__(self):
        self.before_elements: Dict[str, Element] = {}
        self.after_elements: Dict[str, Element] = {}
    
    def parse_snapshot(self, content: str) -> Dict[str, Element]:
        elements = {}
        pattern = r'^(\s*)-\s+(\w+)\s+"([^"]*)"(.*)$'
        id_patterns = [r'\[ref=([^\]]+)\]', r'\[uid=([^\]]+)\]', r'\[(\d+)\]']
        auto_id = 0
        
        for line in content.split('\n'):
            match = re.match(pattern, line)
            if not match:
                continue
            indent, role, name, rest = match.groups()
            uid = ""
            for id_pattern in id_patterns:
                id_match = re.search(id_pattern, rest)
                if id_match:
                    uid = id_match.group(1)
                    break
            if not uid:
                auto_id += 1
                uid = f"auto_{auto_id}"
            attrs = {}
            for m in re.finditer(r'(\w+)=["\']([^"\']*)["\']', rest):
                attrs[m.group(1)] = m.group(2)
            elements[uid] = Element(uid=uid, role=role, name=name, attributes=attrs)
        return elements
    
    def load_snapshots(self, before_path: str, after_path: str) -> bool:
        try:
            self.before_elements = self.parse_snapshot(Path(before_path).read_text(encoding='utf-8'))
            self.after_elements = self.parse_snapshot(Path(after_path).read_text(encoding='utf-8'))
            return True
        except Exception as e:
            logger.error(f"加载快照失败: {e}")
            return False
    
    def diff(self, interactive_only: bool = False) -> Dict[str, Any]:
        before_uids = set(self.before_elements.keys())
        after_uids = set(self.after_elements.keys())
        
        added, removed, changed = [], [], []
        
        for uid in after_uids - before_uids:
            elem = self.after_elements[uid]
            if interactive_only and elem.role not in self.INTERACTIVE_ROLES:
                continue
            added.append({"uid": uid, "role": elem.role, "name": elem.name})
        
        for uid in before_uids - after_uids:
            elem = self.before_elements[uid]
            if interactive_only and elem.role not in self.INTERACTIVE_ROLES:
                continue
            removed.append({"uid": uid, "role": elem.role, "name": elem.name})
        
        for uid in before_uids & after_uids:
            b, a = self.before_elements[uid], self.after_elements[uid]
            if interactive_only and b.role not in self.INTERACTIVE_ROLES:
                continue
            changes = []
            if b.name != a.name:
                changes.append({"field": "name", "before": b.name, "after": a.name})
            if changes:
                changed.append({"uid": uid, "role": b.role, "changes": changes})
        
        return {"summary": {"added": len(added), "removed": len(removed), "changed": len(changed)},
                "added": added, "removed": removed, "changed": changed}


def main():
    parser = argparse.ArgumentParser(description="快照差异分析器")
    parser.add_argument("before", help="Before 快照文件")
    parser.add_argument("after", help="After 快照文件")
    parser.add_argument("--output", "-o", help="输出文件路径")
    parser.add_argument("--interactive", "-i", action="store_true", help="仅可交互元素")
    args = parser.parse_args()
    
    differ = SnapshotDiff()
    if not differ.load_snapshots(args.before, args.after):
        sys.exit(1)
    
    result = differ.diff(interactive_only=args.interactive)
    output = json.dumps(result, ensure_ascii=False, indent=2)
    
    if args.output:
        Path(args.output).write_text(output, encoding='utf-8')
        logger.info(f"已保存: {args.output}")
    else:
        print(output)
    sys.exit(0)


if __name__ == "__main__":
    main()
