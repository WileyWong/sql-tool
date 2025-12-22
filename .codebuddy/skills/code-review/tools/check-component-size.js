#!/usr/bin/env node

/**
 * Vue 组件代码行数检查工具
 * 
 * 功能：
 * - 扫描项目中所有 .vue 文件
 * - 检查组件代码行数是否超过阈值（默认 300 行）
 * - 生成检查报告
 * 
 * 使用：
 *   node tools/check-component-size.js
 *   node tools/check-component-size.js --threshold=200
 *   node tools/check-component-size.js --path=src/components
 */

import { glob } from 'glob'
import fs from 'fs'
import path from 'path'

// 默认配置
const DEFAULT_THRESHOLD = 300
const DEFAULT_PATH = 'src/**/*.vue'

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const config = {
    threshold: DEFAULT_THRESHOLD,
    searchPath: DEFAULT_PATH
  }

  args.forEach(arg => {
    if (arg.startsWith('--threshold=')) {
      config.threshold = parseInt(arg.split('=')[1], 10)
    } else if (arg.startsWith('--path=')) {
      config.searchPath = arg.split('=')[1] + '/**/*.vue'
    }
  })

  return config
}

// 计算文件行数
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content.split('\n').length
  } catch (error) {
    console.error(`❌ 读取文件失败: ${filePath}`)
    return 0
  }
}

// 主函数
async function main() {
  const config = parseArgs()
  
  console.log('🔍 Vue 组件代码行数检查')
  console.log(`📂 扫描路径: ${config.searchPath}`)
  console.log(`📏 阈值: ${config.threshold} 行\n`)

  // 扫描所有 .vue 文件
  const files = glob.sync(config.searchPath)

  if (files.length === 0) {
    console.log('⚠️  未找到 Vue 组件文件')
    return
  }

  console.log(`📊 找到 ${files.length} 个 Vue 组件\n`)

  // 检查每个文件
  const results = []
  let totalLines = 0
  let oversizedCount = 0

  files.forEach(file => {
    const lines = countLines(file)
    totalLines += lines

    const result = {
      file,
      lines,
      isOversized: lines > config.threshold
    }

    results.push(result)

    if (result.isOversized) {
      oversizedCount++
    }
  })

  // 按行数降序排序
  results.sort((a, b) => b.lines - a.lines)

  // 输出检查结果
  console.log('📋 检查结果:\n')

  if (oversizedCount > 0) {
    console.log(`⚠️  发现 ${oversizedCount} 个超过 ${config.threshold} 行的组件:\n`)
    
    results
      .filter(r => r.isOversized)
      .forEach((r, index) => {
        const relativePath = path.relative(process.cwd(), r.file)
        console.log(`  ${index + 1}. ${relativePath}`)
        console.log(`     📏 ${r.lines} 行 (超出 ${r.lines - config.threshold} 行)\n`)
      })
  } else {
    console.log(`✅ 所有组件都在 ${config.threshold} 行以内\n`)
  }

  // 输出统计信息
  const avgLines = Math.round(totalLines / files.length)
  const maxLines = results[0].lines
  const minLines = results[results.length - 1].lines

  console.log('📊 统计信息:')
  console.log(`  总组件数: ${files.length}`)
  console.log(`  总代码行数: ${totalLines}`)
  console.log(`  平均行数: ${avgLines}`)
  console.log(`  最大行数: ${maxLines} (${results[0].file})`)
  console.log(`  最小行数: ${minLines} (${results[results.length - 1].file})`)
  console.log(`  超标组件数: ${oversizedCount}`)
  console.log(`  超标比例: ${Math.round(oversizedCount / files.length * 100)}%`)

  // Top 10 最大组件
  console.log('\n🏆 Top 10 最大组件:')
  results.slice(0, 10).forEach((r, index) => {
    const relativePath = path.relative(process.cwd(), r.file)
    const status = r.isOversized ? '⚠️ ' : '✅'
    console.log(`  ${index + 1}. ${status} ${relativePath} (${r.lines} 行)`)
  })

  // 返回退出码（如果有超标组件，返回 1）
  if (oversizedCount > 0) {
    console.log('\n⚠️  建议: 将大组件拆分为多个子组件，提升可维护性')
    process.exit(1)
  } else {
    console.log('\n✅ 组件大小检查通过')
    process.exit(0)
  }
}

main().catch(error => {
  console.error('❌ 检查失败:', error)
  process.exit(1)
})
