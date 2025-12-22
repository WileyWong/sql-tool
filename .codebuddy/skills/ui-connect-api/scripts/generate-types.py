#!/usr/bin/env python3
"""
生成TypeScript类型定义脚本
基于JSON Schema自动生成TypeScript接口

使用方法:
python generate-types.py --schema schema.json --output src/types/

依赖:
pip install jsonschema
"""

import json
import argparse
from pathlib import Path
from typing import Dict, Any, List

def json_type_to_typescript(json_type: str, format_type: str = None) -> str:
    """将JSON Schema类型转换为TypeScript类型"""
    type_mapping = {
        'string': 'string',
        'number': 'number',
        'integer': 'number',
        'boolean': 'boolean',
        'array': 'any[]',
        'object': 'any',
        'null': 'null'
    }
    
    # 处理特殊格式
    if json_type == 'string' and format_type:
        format_mapping = {
            'date': 'string', # 可以改为 Date 如果需要
            'date-time': 'string',
            'email': 'string',
            'uri': 'string',
            'uuid': 'string'
        }
        return format_mapping.get(format_type, 'string')
    
    return type_mapping.get(json_type, 'any')

def generate_interface_from_object(name: str, schema: Dict[str, Any], indent: int = 0) -> str:
    """从对象schema生成TypeScript接口"""
    spaces = "  " * indent
    interface_lines = [f"{spaces}export interface {name} {{"]
    
    properties = schema.get('properties', {})
    required = schema.get('required', [])
    
    for prop_name, prop_schema in properties.items():
        optional = "" if prop_name in required else "?"
        prop_type = get_property_type(prop_schema)
        
        # 添加注释
        description = prop_schema.get('description', '')
        if description:
            interface_lines.append(f"{spaces}  /** {description} */")
        
        interface_lines.append(f"{spaces}  {prop_name}{optional}: {prop_type};")
    
    interface_lines.append(f"{spaces}}}")
    return "\n".join(interface_lines)

def get_property_type(schema: Dict[str, Any]) -> str:
    """获取属性的TypeScript类型"""
    schema_type = schema.get('type')
    
    if schema_type == 'array':
        items = schema.get('items', {})
        item_type = get_property_type(items)
        return f"Array<{item_type}>"
    
    elif schema_type == 'object':
        # 如果有properties，生成内联接口
        properties = schema.get('properties')
        if properties:
            prop_types = []
            required = schema.get('required', [])
            for prop_name, prop_schema in properties.items():
                optional = "" if prop_name in required else "?"
                prop_type = get_property_type(prop_schema)
                prop_types.append(f"{prop_name}{optional}: {prop_type}")
            return "{ " + "; ".join(prop_types) + " }"
        return 'any'
    
    elif 'enum' in schema:
        # 枚举类型
        enum_values = schema['enum']
        if all(isinstance(v, str) for v in enum_values):
            return " | ".join([f"'{v}'" for v in enum_values])
        else:
            return " | ".join([str(v) for v in enum_values])
    
    elif 'oneOf' in schema or 'anyOf' in schema:
        # 联合类型
        options = schema.get('oneOf', schema.get('anyOf', []))
        union_types = [get_property_type(option) for option in options]
        return " | ".join(union_types)
    
    else:
        format_type = schema.get('format')
        return json_type_to_typescript(schema_type, format_type)

def generate_types_from_schema(schema: Dict[str, Any]) -> str:
    """从JSON Schema生成TypeScript类型定义"""
    result = []
    
    # 添加文件头注释
    result.append("// 自动生成的TypeScript类型定义")
    result.append("// 请不要手动修改此文件")
    result.append("")
    
    # 处理根级定义
    definitions = schema.get('definitions', {})
    if not definitions:
        definitions = schema.get('$defs', {})
    
    for name, definition in definitions.items():
        if definition.get('type') == 'object':
            interface_code = generate_interface_from_object(name, definition)
            result.append(interface_code)
            result.append("")
    
    # 如果根schema本身是一个对象，也生成接口
    if schema.get('type') == 'object' and 'title' in schema:
        title = schema['title']
        interface_code = generate_interface_from_object(title, schema)
        result.append(interface_code)
        result.append("")
    
    return "\n".join(result)

def generate_api_responses() -> str:
    """生成通用API响应类型"""
    return """// 通用API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  success: boolean;
}

export interface ApiError {
  code: number;
  message: string;
  details?: any;
}
"""

def main():
    parser = argparse.ArgumentParser(description='生成TypeScript类型定义')
    parser.add_argument('--schema', '-s', required=True, help='JSON Schema文件路径')
    parser.add_argument('--output', '-o', required=True, help='输出目录')
    parser.add_argument('--include-api-types', action='store_true', help='包含通用API类型')
    
    args = parser.parse_args()
    
    # 加载JSON Schema
    with open(args.schema, 'r', encoding='utf-8') as f:
        schema = json.load(f)
    
    # 创建输出目录
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 生成类型定义
    types_content = generate_types_from_schema(schema)
    
    # 添加通用API类型
    if args.include_api_types:
        types_content += "\n" + generate_api_responses()
    
    # 写入文件
    output_file = output_dir / 'types.ts'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(types_content)
    
    print(f"✅ 生成TypeScript类型定义: {output_file}")
    print("🎉 类型生成完成！")

if __name__ == "__main__":
    main()