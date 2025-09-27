# GeoHash坐标转换工具

一个基于Next.js 14的在线GeoHash坐标转换工具，支持百度09坐标系和GPS84坐标系下的GeoHash编码转换为经纬度坐标。

## 🌟 功能特性

### 核心功能
- **多坐标系支持**: 支持百度09坐标系(BD09)和GPS84坐标系(WGS84)
- **单个转换**: 输入单个GeoHash编码进行快速转换
- **批量转换**: 支持批量处理多个GeoHash编码，提高工作效率
- **实时验证**: 输入时实时验证GeoHash格式，提供即时反馈
- **智能错误处理**: 详细的错误提示和修正建议

### 用户体验
- **一键复制**: 快速复制转换结果到剪贴板
- **CSV导出**: 批量结果支持CSV格式导出
- **响应式设计**: 完美适配桌面和移动设备
- **性能优化**: 支持大批量数据处理，内置进度指示器
- **无障碍访问**: 符合Web无障碍标准

### 技术特性
- **客户端计算**: 所有转换在浏览器端完成，保护数据隐私
- **高精度转换**: 支持1-12位长度的GeoHash，精度可达米级
- **错误恢复**: 批量处理中的错误不会影响其他有效数据
- **SEO优化**: 完整的元数据和结构化数据支持

## 🛠 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI框架**: Tailwind CSS + 自定义组件
- **语言**: TypeScript
- **测试**: Jest + Testing Library
- **代码规范**: ESLint + Prettier
- **部署**: Vercel
- **性能监控**: 内置性能监控和优化

## 🚀 快速开始

### 在线使用
访问 [GeoHash坐标转换工具](https://your-vercel-domain.vercel.app) 直接使用

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd GeoHashHelper
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📖 使用说明

### 单个转换
1. 选择坐标系类型（BD09或GPS84）
2. 输入GeoHash编码（如：`wx4g0ec1`）
3. 点击"转换"按钮
4. 查看转换结果，可一键复制

### 批量转换
1. 切换到"批量模式"
2. 输入多个GeoHash编码（每行一个或用逗号分隔）
3. 选择坐标系类型
4. 点击"批量转换"
5. 查看结果列表，支持CSV导出

### 支持的GeoHash格式
- **长度**: 1-12位字符
- **字符集**: 0-9, b-z (不包含a, i, l, o)
- **示例**: 
  - `wx4g` (4位，精度约2.4km)
  - `wx4g0ec1` (8位，精度约38m)
  - `wx4g0ec19` (9位，精度约4.8m)

## 🔧 开发脚本

### 基础命令
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行ESLint检查
- `npm run lint:fix` - 自动修复ESLint问题
- `npm run format` - 格式化代码
- `npm run format:check` - 检查代码格式

### 测试命令
- `npm test` - 运行所有测试
- `npm run test:watch` - 监听模式运行测试
- `npm run test:e2e` - 运行端到端测试
- `npm run test:workflow` - 测试转换工作流
- `npm run test:ui` - 测试UI交互
- `npm run test:compatibility` - 浏览器兼容性测试
- `npm run test:coverage` - 生成测试覆盖率报告

### 部署命令
- `npm run deploy:check` - 部署前检查
- `npm run deploy:preview` - 部署到预览环境
- `npm run deploy:production` - 部署到生产环境

### 分析命令
- `npm run analyze` - 分析打包大小
- `npm run analyze:server` - 分析服务端打包
- `npm run analyze:browser` - 分析客户端打包

## 🌐 部署

### Vercel部署（推荐）

项目已配置Vercel自动部署：

1. **自动部署**: 推送到主分支自动触发部署
2. **预览部署**: Pull Request自动创建预览环境
3. **环境变量**: 在Vercel控制台配置必要的环境变量

### 手动部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

### 部署检查清单

- [ ] 所有测试通过
- [ ] 代码格式检查通过
- [ ] 构建成功
- [ ] 性能指标达标
- [ ] 跨浏览器兼容性验证
- [ ] 移动端适配验证
- [ ] SEO元数据完整

## 🏗 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── MainLayout.tsx     # 主布局组件
│   ├── InputSection.tsx   # 输入区域组件
│   ├── ResultsDisplay.tsx # 结果展示组件
│   ├── ErrorBoundary.tsx  # 错误边界组件
│   └── ...               # 其他UI组件
├── lib/                   # 核心逻辑库
│   ├── geohash-decoder.ts # GeoHash解码器
│   ├── coordinate-converter.ts # 坐标转换器
│   ├── conversion-engine.ts # 转换引擎
│   ├── batch-processor.ts # 批量处理器
│   └── ...               # 其他工具函数
└── __tests__/            # 测试文件
    ├── unit/             # 单元测试
    ├── integration/      # 集成测试
    └── e2e/              # 端到端测试
```

## 🧪 测试策略

### 测试覆盖范围
- **单元测试**: 核心算法和工具函数
- **集成测试**: 组件交互和数据流
- **端到端测试**: 完整用户工作流
- **性能测试**: 批量处理和渲染性能
- **兼容性测试**: 跨浏览器和设备测试

### 测试数据
项目包含完整的测试数据集：
- 各种长度的有效GeoHash样本
- 边界情况和异常输入
- 大批量数据性能测试集
- 跨坐标系转换验证数据

## 🔍 性能优化

### 已实现的优化
- **虚拟化列表**: 大量结果的高效渲染
- **Web Worker**: 后台批量处理
- **代码分割**: 按需加载组件
- **缓存策略**: 静态资源长期缓存
- **压缩优化**: Gzip和Brotli压缩

### 性能指标
- **首次内容绘制(FCP)**: < 1.5s
- **最大内容绘制(LCP)**: < 2.5s
- **首次输入延迟(FID)**: < 100ms
- **累积布局偏移(CLS)**: < 0.1
- **批量处理**: 支持10,000+条记录

## 🛡 安全特性

- **内容安全策略(CSP)**: 防止XSS攻击
- **HTTPS强制**: 所有连接使用HTTPS
- **数据隐私**: 客户端计算，数据不上传
- **输入验证**: 严格的输入格式验证
- **错误处理**: 安全的错误信息展示

## 🌍 浏览器支持

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **移动浏览器**: iOS Safari 14+, Chrome Mobile 90+

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 开发规范
- 遵循TypeScript严格模式
- 使用ESLint和Prettier保持代码风格
- 编写测试覆盖新功能
- 更新相关文档

## 📝 更新日志

### v0.1.0 (当前版本)
- ✅ 基础GeoHash转换功能
- ✅ 批量处理支持
- ✅ 响应式UI设计
- ✅ CSV导出功能
- ✅ 完整测试覆盖
- ✅ Vercel部署配置

## 📞 支持与反馈

如果您遇到问题或有改进建议，请：
1. 查看[常见问题](https://github.com/your-repo/issues)
2. 创建[新的Issue](https://github.com/your-repo/issues/new)
3. 参与[讨论](https://github.com/your-repo/discussions)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件