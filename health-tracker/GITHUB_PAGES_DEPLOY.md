# 🚀 GitHub Pages 部署指南

本指南详细介绍如何将健康记录助手应用部署到GitHub Pages。

## 🌟 优势

- ✅ 免费托管
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 支持PWA功能
- ✅ 部署简单，维护方便

## 📋 部署步骤

### 步骤1：创建GitHub账号

如果还没有GitHub账号，请先注册：
[GitHub注册](https://github.com/signup)

### 步骤2：创建新仓库

1. 登录GitHub
2. 点击右上角的 `+` 按钮
3. 选择 `New repository`
4. 填写仓库信息：
   - **Repository name**: `health-tracker`
   - **Description**: 健康记录助手PWA应用
   - **Visibility**: 选择 `Public`（免费）
   - 勾选 `Add a README file`
   - 点击 `Create repository`

### 步骤3：准备项目文件

1. **下载项目文件**：确保你有完整的项目文件
2. **生成图标**：
   - 打开 `create-icons.html` 文件
   - 点击 "生成所有图标" 按钮
   - 下载所有生成的图标文件
   - 将图标文件放到项目根目录

### 步骤4：上传文件到GitHub

#### 方法A：使用GitHub网页版

1. 进入你的 `health-tracker` 仓库
2. 点击 `Add file` → `Upload files`
3. 拖拽所有项目文件到浏览器
4. 填写 `Commit changes` 信息
5. 点击 `Commit changes` 按钮

#### 方法B：使用Git命令（推荐）

```bash
# 克隆仓库
git clone https://github.com/你的用户名/health-tracker.git

# 进入目录
cd health-tracker

# 复制所有项目文件到这里
# 确保包含所有图标文件

# 提交文件
git add .
git commit -m "Initial commit: 健康记录助手PWA应用"

# 推送到GitHub
git push origin main
```

### 步骤5：启用GitHub Pages

1. 进入仓库设置：点击 `Settings` 选项卡
2. 找到 `Pages` 选项（在左侧菜单）
3. 在 `Source` 部分：
   - **Branch**: 选择 `main`
   - **Folder**: 选择 `/ (root)`
4. 点击 `Save` 按钮
5. 稍等几分钟，GitHub Pages会自动部署

### 步骤6：获取访问链接

部署完成后，你会看到访问链接：
`https://你的用户名.github.io/health-tracker`

## 🔧 配置PWA

### 确保manifest.json配置正确

```json
{
  "name": "健康记录助手",
  "short_name": "健康记录",
  "start_url": "/health-tracker/",
  "scope": "/health-tracker/"
}
```

### 确保Service Worker注册正确

```javascript
navigator.serviceWorker.register('/health-tracker/sw.js')
```

### 更新base标签（如果需要）

在 `index.html` 中添加：

```html
<base href="/health-tracker/">
```

## 🌐 测试部署

1. **访问应用**：打开生成的GitHub Pages链接
2. **测试功能**：
   - 记录血压、吃药、运动
   - 测试提醒功能
   - 测试数据导出
3. **安装到手机**：
   - 在安卓Chrome中访问链接
   - 点击 "添加到主屏幕"
   - 测试离线使用

## 📱 安卓手机安装步骤

1. **打开链接**：在Chrome浏览器中输入GitHub Pages地址
2. **安装提示**：会自动出现 "添加到主屏幕" 提示
3. **手动安装**：
   - 点击Chrome菜单（右上角三个点）
   - 选择 "添加到主屏幕" 或 "安装应用"
   - 确认安装
4. **使用应用**：
   - 桌面会出现 "健康记录" 图标
   - 点击图标启动应用
   - 支持离线使用

## 🔄 自动部署

### 推送更新

每次修改代码后，只需推送到GitHub：

```bash
git add .
git commit -m "Update: 描述你的修改"
git push origin main
```

GitHub Pages会自动重新部署。

### 部署状态

在仓库的 `Actions` 选项卡中可以查看部署状态。

## 🐛 常见问题

### Q: 404 Not Found
A: 检查：
- 仓库名称是否正确
- 分支选择是否正确（main/master）
- 文件是否正确上传
- 等待几分钟后刷新

### Q: 图标不显示
A: 确保：
- 图标文件已上传到仓库根目录
- 文件名格式正确（icon-192x192.png等）
- manifest.json中的路径正确

### Q: PWA安装按钮不出现
A: 确保：
- 使用HTTPS（GitHub Pages自动提供）
- Service Worker注册成功
- manifest.json配置正确
- 访问路径正确

### Q: 提醒功能不工作
A: 检查：
- 通知权限是否授予
- 浏览器是否支持推送通知
- 手机是否允许通知

## 📁 推荐文件结构

```
health-tracker/
├── index.html          # 主页面
├── app.js             # 应用逻辑
├── sw.js              # Service Worker
├── manifest.json      # PWA配置
├── icon-72x72.png     # 图标
├── icon-96x96.png     # 图标
├── icon-128x128.png   # 图标
├── icon-144x144.png   # 图标
├── icon-152x152.png   # 图标
├── icon-192x192.png   # 图标
├── icon-384x384.png   # 图标
├── icon-512x512.png   # 图标
├── README.md          # 项目说明
└── DEPLOY.md          # 部署指南
```

## 🎯 部署成功标志

- ✅ 访问链接能正常打开
- ✅ 页面显示健康记录助手界面
- ✅ 浏览器控制台无错误
- ✅ 可以安装到主屏幕
- ✅ 支持离线使用

## 📞 技术支持

如果遇到问题：

1. 检查GitHub Pages设置
2. 查看浏览器控制台错误
3. 确保文件路径正确
4. 参考GitHub Pages文档

---

**部署成功后，你就拥有了一个可以在任何设备上访问的健康记录助手！** 🎉
