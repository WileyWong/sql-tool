#!/usr/bin/env python3
"""
生成API服务代码脚本
基于OpenAPI规范自动生成TypeScript API服务类

使用方法:
python generate-api-service.py --input openapi.json --output src/services/

依赖:
pip install pyyaml requests
"""

import json
import yaml
import os
import argparse
from typing import Dict, List, Any
from pathlib import Path

def load_openapi_spec(file_path: str) -> Dict[str, Any]:
    """加载OpenAPI规范文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        if file_path.endswith('.yaml') or file_path.endswith('.yml'):
            return yaml.safe_load(f)
        else:
            return json.load(f)

def generate_typescript_types(schemas: Dict[str, Any]) -> str:
    """生成TypeScript类型定义"""
    types = []
    
    for name, schema in schemas.items():
        if schema.get('type') == 'object':
            properties = schema.get('properties', {})
            required = schema.get('required', [])
            
            type_def = f"export interface {name} {{\n"
            for prop_name, prop_schema in properties.items():
                optional = "" if prop_name in required else "?"
                prop_type = get_typescript_type(prop_schema)
                type_def += f"  {prop_name}{optional}: {prop_type};\n"
            type_def += "}\n"
            types.append(type_def)
    
    return "\n".join(types)

def get_typescript_type(schema: Dict[str, Any]) -> str:
    """将OpenAPI类型转换为TypeScript类型"""
    type_mapping = {
        'string': 'string',
        'number': 'number',
        'integer': 'number',
        'boolean': 'boolean',
        'array': 'Array<any>',
        'object': 'any'
    }
    
    schema_type = schema.get('type', 'any')
    if schema_type == 'array':
        items = schema.get('items', {})
        item_type = get_typescript_type(items)
        return f"Array<{item_type}>"
    
    return type_mapping.get(schema_type, 'any')

def generate_api_service(paths: Dict[str, Any], service_name: str) -> str:
    """生成API服务类"""
    methods = []
    
    for path, operations in paths.items():
        for method, operation in operations.items():
            if method in ['get', 'post', 'put', 'delete', 'patch']:
                method_name = operation.get('operationId', f"{method}_{path.replace('/', '_').replace('{', '').replace('}', '')}")
                method_code = generate_method(method.upper(), path, operation, method_name)
                methods.append(method_code)
    
    service_template = f"""import {{ api }} from '../config/axios';

export class {service_name}Service {{
{chr(10).join(methods)}
}}
"""
    return service_template

def generate_method(http_method: str, path: str, operation: Dict[str, Any], method_name: str) -> str:
    """生成单个API方法"""
    params = []
    path_params = []
    
    # 提取路径参数
    if '{' in path:
        import re
        path_params = re.findall(r'\{(\w+)\}', path)
        params.extend([f"{param}: string | number" for param in path_params])
    
    # 提取请求体参数
    request_body = operation.get('requestBody', {})
    if request_body:
        params.append("data: any")
    
    # 提取查询参数
    parameters = operation.get('parameters', [])
    query_params = [p for p in parameters if p.get('in') == 'query']
    if query_params:
        params.append("params?: any")
    
    param_str = ", ".join(params)
    
    # 构建URL
    url = path
    for param in path_params:
        url = url.replace(f"{{{param}}}", f"${{{param}}}")
    
    # 构建方法体
    if http_method in ['POST', 'PUT', 'PATCH'] and request_body:
        method_body = f"    return api.{http_method.lower()}(`{url}`, data);"
    elif query_params:
        method_body = f"    return api.{http_method.lower()}(`{url}`, {{ params }});"
    else:
        method_body = f"    return api.{http_method.lower()}(`{url}`);"
    
    return f"""  static async {method_name}({param_str}) {{
{method_body}
  }}"""

def main():
    parser = argparse.ArgumentParser(description='生成API服务代码')
    parser.add_argument('--input', '-i', required=True, help='OpenAPI规范文件路径')
    parser.add_argument('--output', '-o', required=True, help='输出目录')
    parser.add_argument('--service-name', '-s', default='Api', help='服务类名称前缀')
    
    args = parser.parse_args()
    
    # 加载OpenAPI规范
    spec = load_openapi_spec(args.input)
    
    # 创建输出目录
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 生成类型定义
    schemas = spec.get('components', {}).get('schemas', {})
    if schemas:
        types_content = generate_typescript_types(schemas)
        with open(output_dir / 'types.ts', 'w', encoding='utf-8') as f:
            f.write(types_content)
        print(f"✅ 生成类型定义: {output_dir / 'types.ts'}")
    
    # 生成API服务
    paths = spec.get('paths', {})
    if paths:
        service_content = generate_api_service(paths, args.service_name)
        with open(output_dir / f'{args.service_name.lower()}-service.ts', 'w', encoding='utf-8') as f:
            f.write(service_content)
        print(f"✅ 生成API服务: {output_dir / f'{args.service_name.lower()}-service.ts'}")
    
    print("🎉 代码生成完成！")

if __name__ == "__main__":
    main()