# 归档过时内容 - 完整示例

本文档提供各种归档场景的完整示例，帮助你快速理解和使用归档功能。

## 📖 目录

1. [基础归档示例](#基础归档示例)
2. [完整归档流程](#完整归档流程)
3. [不同类型归档](#不同类型归档)
4. [复杂场景处理](#复杂场景处理)
5. [自动化脚本示例](#自动化脚本示例)

---

## 基础归档示例

### 示例 1: 归档废弃的技能

**场景**: OAuth 2.0 升级，旧的 Session 认证技能需要归档

**执行**:
```bash
# 命令格式
归档 skills/session-authentication skills "认证机制已升级到 OAuth 2.0"
```

**执行过程**:
```
🔍 验证源路径...
   ✅ skills/session-authentication 存在

📋 归档信息:
   - 源路径: skills/session-authentication
   - 分类: skills
   - 原因: 认证机制已升级到 OAuth 2.0
   - 目标: spec/archive/skills/2024-01-15_session-authentication/

⚠️  即将归档，是否继续? (y/n): y

📁 创建归档目录...
   ✅ spec/archive/skills/2024-01-15_session-authentication/ 已创建

📝 生成归档元数据...
   ✅ ARCHIVE-INFO.md 已创建

🚚 复制文件...
   ✅ 复制完成 (15 文件, 5 目录, 2.5MB)

🔗 检查链接...
   ℹ️  发现 3 个链接引用
   - docs/api-reference.md:42
   - README.md:15
   - docs/architecture.md:88

🔧 更新链接...
   ✅ 已更新 3 个链接

📊 更新归档索引...
   ✅ spec/archive/README.md 已更新

🗑️  删除源文件? (y/n): y
   ✅ 源文件已删除

✅ 归档完成!

归档路径: spec/archive/skills/2024-01-15_session-authentication/
查看详细报告: 归档报告.md
```

**生成的文件**:
```
spec/archive/skills/2024-01-15_session-authentication/
├── SKILL.md
├── src/
│   ├── auth-handler.ts
│   └── session-manager.ts
├── tests/
│   └── auth.test.ts
├── README.md
└── ARCHIVE-INFO.md  (新增)

spec/archive/README.md  (更新)
归档报告.md  (临时文件)
```

---

### 示例 2: 归档过时的文档

**场景**: API 从 v1 升级到 v2，旧文档需要归档

**执行**:
```bash
归档 docs/api-v1.md docs "API 已升级到 v2 版本"
```

**ARCHIVE-INFO.md 内容**:
```markdown
# 归档信息

## 基本信息
- **归档日期**: 2024-02-20
- **原始路径**: docs/api-v1.md
- **归档分类**: docs
- **归档执行人**: zhangsan

## 归档原因
API 已从 v1 升级到 v2，增加了新的端点和功能，v1 文档不再适用。

## 原始内容
- api-v1.md (45 KB)

## 替代方案
- **新文档**: docs/api-v2.md
- **迁移指南**: docs/migration/v1-to-v2.md

## 相关链接
- [API v2 文档](mdc:docs/api-v2.md)
- [迁移指南](mdc:docs/migration/v1-to-v2.md)

## 注意事项
- v1 API 将在 2024-06-01 停止支持
- 建议所有客户端尽快迁移到 v2

## 回滚信息
如需恢复:
\`\`\`bash
cp spec/archive/docs/2024-02-20_api-v1/api-v1.md docs/
\`\`\`
```

---

### 示例 3: 归档临时脚本

**场景**: 数据迁移脚本已完成使用，需要归档

**执行**:
```bash
归档 scripts/temp-data-migration.sh scripts "数据迁移已完成，脚本不再需要"
```

**特点**:
- 保留时间较短（建议 6 个月）
- 可能不需要详细的替代方案
- 重点记录执行结果

**ARCHIVE-INFO.md 简化版**:
```markdown
# 归档信息

## 基本信息
- **归档日期**: 2024-03-10
- **原始路径**: scripts/temp-data-migration.sh
- **归档分类**: scripts
- **归档执行人**: lisi

## 归档原因
数据迁移任务已于 2024-03-05 完成，脚本不再需要。

## 执行记录
- **执行时间**: 2024-03-05 10:00-12:00
- **处理记录数**: 150,000
- **成功率**: 100%
- **执行日志**: logs/migration-2024-03-05.log

## 原始内容
- temp-data-migration.sh (2.3 KB)

## 注意事项
- 保留执行日志以备审计
- 6 个月后可删除

## 回滚信息
不适用（迁移不可逆）
```

---

## 完整归档流程

### 完整示例: 归档旧的支付集成

#### 步骤 1: 准备归档

**检查依赖**:
```bash
# 搜索所有引用
grep -r "skills/stripe-payment-v1" . \
    --include="*.md" \
    --include="*.ts" \
    --exclude-dir="node_modules" \
    --exclude-dir=".git"

# 输出:
# docs/payment-integration.md:12: 详见 [Stripe 集成](mdc:skills/stripe-payment-v1/SKILL.md)
# src/checkout/payment.ts:5: // 使用 skills/stripe-payment-v1
```

**通知团队**:
```markdown
📢 归档通知

各位开发者：

我们计划在 **2024-04-01** 归档旧的 Stripe 支付集成（skills/stripe-payment-v1）。

**原因**: 已升级到 Stripe API v2，旧集成不再维护

**影响范围**:
- checkout 模块需要更新导入
- 相关文档需要更新链接

**替代方案**: skills/stripe-payment-v2

**迁移指南**: docs/migration/stripe-v1-to-v2.md

如有疑问，请在本周五前反馈。

— 支付团队
```

#### 步骤 2: 执行归档

```bash
归档 skills/stripe-payment-v1 skills "已升级到 Stripe API v2"
```

#### 步骤 3: 处理链接更新

**自动更新的链接**:
```markdown
# docs/payment-integration.md (更新前)
详见 [Stripe 集成](mdc:skills/stripe-payment-v1/SKILL.md)

# docs/payment-integration.md (更新后)
详见 [Stripe 集成 v2](mdc:skills/stripe-payment-v2/SKILL.md)
旧版本已归档: [Stripe v1 (已归档)](mdc:.codebuddy/spec/archive/skills/2024-04-01_stripe-payment-v1/SKILL.md)
```

**手动更新的代码**:
```typescript
// src/checkout/payment.ts (更新前)
import { StripePayment } from 'skills/stripe-payment-v1';

// src/checkout/payment.ts (更新后)
import { StripePayment } from 'skills/stripe-payment-v2';
```

#### 步骤 4: 更新文档

**CHANGELOG.md**:
```markdown
## [2024-04-01]

### Removed
- 归档旧的 Stripe 支付集成 (v1)
  - 位置: spec/archive/skills/2024-04-01_stripe-payment-v1/
  - 原因: 已升级到 Stripe API v2
  - 迁移指南: docs/migration/stripe-v1-to-v2.md
```

**README.md**:
```markdown
## 支付集成

当前使用 [Stripe v2](mdc:skills/stripe-payment-v2/SKILL.md)

历史版本:
- ~~Stripe v1~~ (已归档，不再维护)
```

#### 步骤 5: 验证

**验证清单**:
```markdown
- [x] 归档目录已创建
- [x] 所有文件已复制
- [x] ARCHIVE-INFO.md 完整
- [x] 文档链接已更新
- [x] 代码导入已更新
- [x] 测试通过
- [x] 归档索引已更新
- [x] CHANGELOG 已记录
- [x] 团队已通知
```

---

## 不同类型归档

### 归档技能 (Skills)

**示例**:
```bash
归档 skills/old-auth skills "认证升级到 OAuth 2.0"
```

**目录结构**:
```
spec/archive/skills/2024-01-15_old-auth/
├── SKILL.md
├── scripts/
│   └── auth.py
├── reference.md
├── examples.md
├── ARCHIVE-INFO.md
└── README.md
```

**关键元数据**:
```markdown
## 替代方案
- **新技能**: skills/oauth2-auth
- **迁移指南**: docs/oauth-migration.md

## 注意事项
- 旧 API 端点将在 3 个月后下线
- 所有客户端需要更新
```

---

### 归档命令 (Commands)

**示例**:
```bash
归档 commands/old-deploy commands "已替换为新的 CI/CD 流程"
```

**目录结构**:
```
spec/archive/commands/2024-02-10_old-deploy/
├── command.md
├── deploy.sh
├── ARCHIVE-INFO.md
└── README.md
```

**关键元数据**:
```markdown
## 替代方案
- **新命令**: commands/ci-deploy
- **文档**: docs/ci-cd-guide.md

## 注意事项
- 新流程使用 GitHub Actions
- 不再需要手动部署脚本
```

---

### 归档文档 (Docs)

**示例**:
```bash
归档 docs/old-architecture.md docs "架构已重构，文档过时"
```

**目录结构**:
```
spec/archive/docs/2024-03-15_old-architecture/
├── old-architecture.md
├── diagrams/
│   └── old-arch.png
├── ARCHIVE-INFO.md
└── README.md
```

**关键元数据**:
```markdown
## 替代方案
- **新文档**: docs/architecture-v2.md
- **迁移日志**: docs/refactoring-log.md

## 注意事项
- 保留文档作为历史参考
- 理解系统演进过程
```

---

### 归档模板 (Templates)

**示例**:
```bash
归档 templates/old-component.tsx templates "组件库已升级"
```

**目录结构**:
```
spec/archive/templates/2024-04-20_old-component/
├── old-component.tsx
├── styles.css
├── ARCHIVE-INFO.md
└── README.md
```

---

### 归档规范 (Standards)

**示例**:
```bash
归档 standards/code-style-v1.md standards "代码规范已更新到 v2"
```

**目录结构**:
```
spec/archive/standards/2024-05-10_code-style-v1/
├── code-style-v1.md
├── examples/
├── ARCHIVE-INFO.md
└── README.md
```

---

## 复杂场景处理

### 场景 1: 归档包含大量依赖的模块

**问题**: 模块被多处引用，需要仔细处理

**解决方案**:

1. **全面依赖分析**:
```bash
# 搜索所有引用
grep -r "skills/complex-module" . \
    --include="*.ts" \
    --include="*.js" \
    --include="*.md" \
    > dependencies.txt

# 输出示例:
# src/feature-a/index.ts:3: import { Module } from 'skills/complex-module';
# src/feature-b/utils.ts:7: import { Helper } from 'skills/complex-module';
# docs/guide.md:42: [文档](mdc:skills/complex-module/README.md)
```

2. **分阶段迁移**:
```markdown
## 迁移计划

### 第一阶段 (Week 1-2)
- [ ] 更新 feature-a 使用新模块
- [ ] 测试 feature-a

### 第二阶段 (Week 3-4)
- [ ] 更新 feature-b 使用新模块
- [ ] 测试 feature-b

### 第三阶段 (Week 5)
- [ ] 更新所有文档
- [ ] 执行归档
```

3. **保留过渡期**:
```markdown
## 归档策略

- **即时操作**: 复制到归档目录
- **保留原位置**: 保留 2 周（2024-06-01 到 2024-06-15）
- **完全移除**: 2024-06-15 删除原文件

## ARCHIVE-INFO.md
### 注意事项
- 原位置文件保留到 2024-06-15
- 如仍有引用，请尽快迁移
- 联系人: @zhangsan
```

---

### 场景 2: 归档包含敏感信息的内容

**问题**: 归档内容包含密钥、密码等敏感信息

**解决方案**:

1. **归档前清理**:
```bash
#!/bin/bash
# clean-sensitive.sh

# 复制到临时目录
cp -r skills/old-payment /tmp/old-payment-clean

# 删除敏感文件
rm -f /tmp/old-payment-clean/config/secrets.json
rm -f /tmp/old-payment-clean/.env

# 替换敏感信息
sed -i 's/api_key=.*/api_key=***REDACTED***/g' \
    /tmp/old-payment-clean/config/api.conf

# 执行归档（使用清理后的版本）
归档 /tmp/old-payment-clean skills "支付集成已升级"

# 清理临时文件
rm -rf /tmp/old-payment-clean
```

2. **ARCHIVE-INFO.md 标注**:
```markdown
## 注意事项

⚠️ **敏感信息已清理**:
- API 密钥已移除
- 配置文件中的密码已替换为 ***REDACTED***
- .env 文件未包含在归档中

原始敏感信息已安全销毁。
```

---

### 场景 3: 归档后发现需要恢复

**问题**: 归档后发现某个功能还需要使用

**解决方案**:

1. **快速恢复**:
```bash
# 从归档恢复到新位置
cp -r spec/archive/skills/2024-06-01_old-feature/ \
     skills/restored-feature/

# 重命名避免冲突
mv skills/restored-feature/old-feature.ts \
   skills/restored-feature/feature.ts
```

2. **更新 ARCHIVE-INFO.md**:
```markdown
## 恢复记录

### 2024-06-10 部分恢复
- **恢复位置**: skills/restored-feature
- **恢复原因**: 发现该功能仍被 legacy 系统使用
- **恢复人**: lisi
- **计划**: 临时恢复，计划在 Q3 完成 legacy 系统迁移后再次归档
```

3. **通知团队**:
```markdown
📢 恢复通知

由于 legacy 系统仍依赖该功能，已从归档恢复:
- 原归档: spec/archive/skills/2024-06-01_old-feature/
- 恢复位置: skills/restored-feature/

计划在 Q3 完成 legacy 系统迁移后再次归档。

— 开发团队
```

---

## 自动化脚本示例

### 完整归档脚本

```bash
#!/bin/bash
# archive.sh - 自动化归档脚本

set -e  # 遇到错误立即退出

# 参数
SOURCE_PATH="$1"
CATEGORY="$2"
REASON="$3"

# 验证参数
if [ -z "$SOURCE_PATH" ] || [ -z "$CATEGORY" ] || [ -z "$REASON" ]; then
    echo "用法: $0 <source-path> <category> <reason>"
    echo "示例: $0 skills/old-auth skills \"认证升级\""
    exit 1
fi

# 验证源路径
if [ ! -e "$SOURCE_PATH" ]; then
    echo "❌ 错误: 源路径不存在: $SOURCE_PATH"
    exit 1
fi

# 验证分类
VALID_CATEGORIES=("skills" "commands" "docs" "templates" "standards")
if [[ ! " ${VALID_CATEGORIES[@]} " =~ " ${CATEGORY} " ]]; then
    echo "❌ 错误: 无效的分类: $CATEGORY"
    echo "有效分类: ${VALID_CATEGORIES[@]}"
    exit 1
fi

# 生成归档信息
TIMESTAMP=$(date +%Y-%m-%d)
BASENAME=$(basename "$SOURCE_PATH")
ARCHIVE_NAME="${TIMESTAMP}_${BASENAME}"
ARCHIVE_DIR="spec/archive/${CATEGORY}/${ARCHIVE_NAME}"

echo "🔍 归档信息:"
echo "   源路径: $SOURCE_PATH"
echo "   分类: $CATEGORY"
echo "   原因: $REASON"
echo "   目标: $ARCHIVE_DIR"
echo ""

# 用户确认
read -p "继续归档? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "取消归档"
    exit 0
fi

# 创建归档目录
echo "📁 创建归档目录..."
mkdir -p "$ARCHIVE_DIR"

# 复制文件
echo "🚚 复制文件..."
cp -r "$SOURCE_PATH/"* "$ARCHIVE_DIR/"

# 生成 ARCHIVE-INFO.md
echo "📝 生成归档元数据..."
cat > "$ARCHIVE_DIR/ARCHIVE-INFO.md" <<EOF
# 归档信息

## 基本信息
- **归档日期**: $TIMESTAMP
- **原始路径**: $SOURCE_PATH
- **归档分类**: $CATEGORY
- **归档执行人**: $(whoami)

## 归档原因
$REASON

## 原始内容
$(ls -lh "$ARCHIVE_DIR" | tail -n +2)

## 回滚信息
如需恢复:
\`\`\`bash
cp -r $ARCHIVE_DIR $SOURCE_PATH
\`\`\`
EOF

# 检查链接
echo "🔗 检查链接..."
grep -r "$SOURCE_PATH" . \
    --include="*.md" \
    --exclude-dir=".git" \
    --exclude-dir="node_modules" \
    --exclude-dir="spec/archive" \
    > /tmp/archive-links.txt || true

if [ -s /tmp/archive-links.txt ]; then
    echo "⚠️  发现 $(wc -l < /tmp/archive-links.txt) 个链接引用:"
    cat /tmp/archive-links.txt
    echo ""
    echo "请手动更新这些链接"
fi

# 更新归档索引
echo "📊 更新归档索引..."
if [ ! -f "spec/archive/README.md" ]; then
    cat > "spec/archive/README.md" <<EOF
# 归档索引

## 归档统计
- **总归档数**: 1
- **最近归档**: $TIMESTAMP

## 按类别归档

### $CATEGORY (1)
1. [$TIMESTAMP - $BASENAME]($CATEGORY/$ARCHIVE_NAME/)
EOF
else
    # TODO: 更新现有索引
    echo "   ℹ️  请手动更新 spec/archive/README.md"
fi

# 询问是否删除源文件
echo ""
read -p "删除源文件? (y/n): " delete_confirm
if [ "$delete_confirm" = "y" ]; then
    rm -rf "$SOURCE_PATH"
    echo "🗑️  源文件已删除"
fi

echo ""
echo "✅ 归档完成!"
echo "   归档路径: $ARCHIVE_DIR"
echo "   元数据: $ARCHIVE_DIR/ARCHIVE-INFO.md"

# 清理临时文件
rm -f /tmp/archive-links.txt
```

**使用方法**:
```bash
chmod +x archive.sh
./archive.sh skills/old-auth skills "认证升级到 OAuth 2.0"
```

---

### 自动检测归档候选

```bash
#!/bin/bash
# detect-archive-candidates.sh

echo "检测归档候选项..."
echo ""

# 1. 检查 @deprecated 标记
echo "## 1. 已标记为 Deprecated 的代码"
echo ""
grep -r "@deprecated" src/ skills/ \
    --include="*.ts" \
    --include="*.js" \
    --include="*.md" | \
    while read line; do
        file=$(echo "$line" | cut -d: -f1)
        echo "- $file"
    done
echo ""

# 2. 检查长时间未修改的临时文件
echo "## 2. 超过 6 个月未修改的临时文件"
echo ""
find . -path ./node_modules -prune -o \
       -path ./.git -prune -o \
       -path ./spec/archive -prune -o \
       -name "temp*" -o -name "*-temp.*" -o -name "*.tmp" | \
    while read file; do
        if [ -f "$file" ]; then
            modified=$(stat -f "%Sm" -t "%Y-%m-%d" "$file" 2>/dev/null || \
                      stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1)
            echo "- $file (最后修改: $modified)"
        fi
    done
echo ""

# 3. 检查旧版本文件
echo "## 3. 旧版本文件"
echo ""
find . -path ./node_modules -prune -o \
       -path ./.git -prune -o \
       -path ./spec/archive -prune -o \
       -name "*-v[0-9]*" -o -name "*_v[0-9]*" | \
    while read file; do
        if [ -f "$file" ]; then
            echo "- $file"
        fi
    done
echo ""

# 生成报告
REPORT_FILE="archive-candidates-$(date +%Y%m%d).md"
{
    echo "# 归档候选项报告"
    echo ""
    echo "生成时间: $(date)"
    echo ""
    bash "$0"
} > "$REPORT_FILE"

echo "报告已生成: $REPORT_FILE"
```

---

## 输出示例

### 成功归档的完整输出

```
$ ./archive.sh skills/old-payment skills "支付集成已升级"

🔍 归档信息:
   源路径: skills/old-payment
   分类: skills
   原因: 支付集成已升级
   目标: spec/archive/skills/2024-06-15_old-payment

继续归档? (y/n): y

📁 创建归档目录...
   ✅ spec/archive/skills/2024-06-15_old-payment/ 已创建

🚚 复制文件...
   复制 skills/old-payment/SKILL.md
   复制 skills/old-payment/payment-handler.ts
   复制 skills/old-payment/README.md
   ✅ 复制完成 (12 文件, 3 目录, 1.8MB)

📝 生成归档元数据...
   ✅ ARCHIVE-INFO.md 已创建

🔗 检查链接...
   ⚠️  发现 5 个链接引用:
   docs/payment-guide.md:15: [支付](mdc:skills/old-payment/SKILL.md)
   docs/api-reference.md:88: 详见 skills/old-payment
   src/checkout/index.ts:5: import { Payment } from 'skills/old-payment';
   README.md:42: - [支付集成](skills/old-payment/)
   CHANGELOG.md:156: 新增 skills/old-payment

   请手动更新这些链接

📊 更新归档索引...
   ✅ spec/archive/README.md 已更新

删除源文件? (y/n): y
🗑️  源文件已删除

✅ 归档完成!
   归档路径: spec/archive/skills/2024-06-15_old-payment
   元数据: spec/archive/skills/2024-06-15_old-payment/ARCHIVE-INFO.md

提示: 请记得更新上述 5 个链接引用
```

---

## 相关资源

- **主 Skill**: [SKILL.md](SKILL.md)
- **详细参考**: [reference.md](reference.md)
- **验证清单**: [checklist.md](checklist.md)
