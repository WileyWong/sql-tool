#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
跨平台编码处理工具模块

解决 Windows PowerShell GBK 编码与 Python UTF-8 之间的兼容性问题。
所有 e2e-testing 工具脚本应在入口处调用 setup_encoding() 函数。

用法:
    # 方式1: 直接导入（同目录下）
    from encoding_utils import setup_encoding
    setup_encoding()
    
    # 方式2: 使用内联代码（无依赖）
    # 将 _setup_encoding_inline() 的代码复制到脚本开头

功能:
    1. Windows 环境自动启用 UTF-8 模式
    2. 重新配置 stdout/stderr 编码
    3. 提供安全的文件读写函数
"""

import os
import sys
import logging
from typing import Optional, Any
from pathlib import Path

logger = logging.getLogger(__name__)

__all__ = [
    'setup_encoding',
    'safe_open',
    'read_text_file',
    'write_text_file',
    'get_encoding',
]


def setup_encoding() -> None:
    """
    设置 Python 运行时编码为 UTF-8。
    
    在 Windows 环境下自动启用 UTF-8 模式，解决 PowerShell GBK 编码问题。
    应在脚本入口处尽早调用此函数。
    
    Example:
        if __name__ == "__main__":
            from encoding_utils import setup_encoding
            setup_encoding()
            main()
    """
    # 设置环境变量，影响子进程
    os.environ['PYTHONUTF8'] = '1'
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    
    # Windows 特殊处理
    if sys.platform == 'win32':
        # 重新配置标准输出/错误流编码
        if hasattr(sys.stdout, 'reconfigure'):
            try:
                sys.stdout.reconfigure(encoding='utf-8', errors='replace')
            except Exception:
                pass
        
        if hasattr(sys.stderr, 'reconfigure'):
            try:
                sys.stderr.reconfigure(encoding='utf-8', errors='replace')
            except Exception:
                pass
        
        # 尝试设置控制台代码页为 UTF-8 (65001)
        try:
            import ctypes
            kernel32 = ctypes.windll.kernel32
            kernel32.SetConsoleOutputCP(65001)
            kernel32.SetConsoleCP(65001)
        except Exception:
            pass


def get_encoding() -> str:
    """
    获取当前推荐使用的文件编码。
    
    Returns:
        str: 编码名称，始终返回 'utf-8'
    """
    return 'utf-8'


def safe_open(
    filepath: str,
    mode: str = 'r',
    encoding: Optional[str] = None,
    errors: str = 'replace'
) -> Any:
    """
    安全地打开文件，自动处理编码。
    
    Args:
        filepath: 文件路径
        mode: 打开模式 ('r', 'w', 'a', 'rb', 'wb' 等)
        encoding: 编码，默认 UTF-8（二进制模式忽略）
        errors: 编码错误处理方式，默认 'replace'
    
    Returns:
        文件对象
    
    Example:
        with safe_open('data.txt', 'r') as f:
            content = f.read()
    """
    # 二进制模式不需要编码
    if 'b' in mode:
        return open(filepath, mode)
    
    # 文本模式使用 UTF-8
    if encoding is None:
        encoding = 'utf-8'
    
    return open(filepath, mode, encoding=encoding, errors=errors)


def read_text_file(
    filepath: str,
    encoding: Optional[str] = None,
    errors: str = 'replace'
) -> str:
    """
    安全地读取文本文件内容。
    
    Args:
        filepath: 文件路径
        encoding: 编码，默认 UTF-8
        errors: 编码错误处理方式
    
    Returns:
        str: 文件内容
    
    Raises:
        FileNotFoundError: 文件不存在
        IOError: 读取失败
    """
    if encoding is None:
        encoding = 'utf-8'
    
    with open(filepath, 'r', encoding=encoding, errors=errors) as f:
        return f.read()


def write_text_file(
    filepath: str,
    content: str,
    encoding: Optional[str] = None,
    errors: str = 'replace'
) -> None:
    """
    安全地写入文本文件。
    
    Args:
        filepath: 文件路径
        content: 要写入的内容
        encoding: 编码，默认 UTF-8
        errors: 编码错误处理方式
    
    Raises:
        IOError: 写入失败
    """
    if encoding is None:
        encoding = 'utf-8'
    
    # 确保目录存在
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    
    with open(filepath, 'w', encoding=encoding, errors=errors) as f:
        f.write(content)


# 模块加载时自动设置编码
# 这样只要 import 此模块就会自动配置
setup_encoding()
