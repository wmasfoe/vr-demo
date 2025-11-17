# Project Context

## Purpose
构建一个可嵌入 VAST 协议 `<HTMLResource>` 的伴随广告 Demo，核心是通过 HTML+JS 呈现可交互的全景视图，支持移动端陀螺仪控制，帮助验证伴随广告在移动端场景下的可行性与交互体验。

## Tech Stack
- 原生 JavaScript + Web APIs（DeviceOrientation / Gyroscope 等）
- three.js（全景建模与交互渲染）
- Vite 作为开发/打包工具（最终输出单一 `index.html`，内部可内联或引用打包后的 JS/CSS）
- 交付物：一个自包含的 HTML 文件，供 VAST `<HTMLResource>` 引入

## Project Conventions

### Code Style
- 目录：源码存于 `src/`，打包产物在 `dist/`
- 采用模块化原生 JS（ESM），按功能划分文件（渲染、交互等）
- 基本 ESLint/Prettier 未强制，但建议保持一致的缩进与语义化命名
- HTML/CSS/JS 尽量自包含，避免依赖 CDN 资源，确保广告容器可离线加载

### Architecture Patterns
- 分层模块：
  - `renderer/`：封装 three.js 全景场景、相机与材质管理
  - `controls/`：处理触摸/拖拽/陀螺仪交互，向渲染层传递相机更新
  - `core/`：初始化入口、加载纹理或模型资源、桥接渲染与控制模块
- Vite 配置负责将多文件打包成单一 HTML，必要时使用内联脚本或 bundler 插件确保最终输出符合 VAST 载入限制
- 当前阶段不负责 VAST 加载逻辑，仅聚焦交互 Demo，可后续抽象为 SDK

### Testing Strategy
- Demo 阶段不引入自动化测试
- 手动验证重点：移动端陀螺仪、触摸交互、主流安卓浏览器（Chrome、WebView）、iOS Safari 兼容性

### Git Workflow
- 由仓库维护者自定（未在 spec 中强制）；建议保持小粒度提交与描述性信息，便于追踪迭代

## Domain Context
- VAST 规范（IAB Tech Lab）对伴随广告的资产加载要求：HTML 需在受控容器中运行，不能越权访问宿主页面
- 全景体验需在移动端加载迅速，避免大模型/大贴图导致广告加载超时
- 需遵循移动 VR/全景交互常见 UX（初始指引、陀螺仪权限提示）

## Important Constraints
- 最终交付单一 HTML 文件（含需引用的 JS/CSS），确保 `<HTMLResource>` 能直接嵌入
- 主要面向移动端浏览器；必须优先支持安卓机型（Chrome/WebView），iOS 为次要但必要兼容
- 保持文件体积适中，加载时间在广告可接受范围内（< 2s 理想值）
- 尽量避免依赖需要额外权限的 API，陀螺仪需在用户同意后启用

## External Dependencies
- three.js（本地打包，避免第三方 CDN）
- 浏览器原生 DeviceOrientation / Gyroscope API
- （未来）可接入 VAST 资产管理或分析 SDK，但当前 Demo 阶段未集成
