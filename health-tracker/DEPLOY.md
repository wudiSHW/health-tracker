# 🚀 健康记录助手 - 部署指南

## 📁 项目文件结构

```
health-tracker/
├── index.html          # 主页面
├── app.js             # 应用逻辑
├── sw.js              # Service Worker
├── manifest.json      # PWA配置
├── server.js          # Node.js服务器（可选）
├── icon.svg           # 应用图标源文件
├── generate_icons.py  # 图标生成脚本
├── README.md          # 项目说明
└── DEPLOY.md          # 部署指南（本文件）
```

## 🌐 部署方式

### 方式一：使用任意Web服务器

将项目文件夹上传到任何支持静态文件的Web服务器：

- **Nginx**: 将文件放到 `html` 目录
- **Apache**: 将文件放到 `htdocs` 目录
- **GitHub Pages**: 推送到仓库并启用Pages
- **Netlify/Vercel**: 直接拖拽上传文件夹

### 方式二：使用Node.js（推荐开发环境）

1. 安装Node.js (https://nodejs.org)
2. 在项目目录运行：
```bash
node server.js
```
3. 访问 http://localhost:8080

### 方式三：使用Python

如果有Python环境：

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### 方式四：使用VS Code Live Server

1. 在VS Code中安装 "Live Server" 扩展
2. 右键点击 `index.html` 
3. 选择 "Open with Live Server"

## 📱 安卓手机安装步骤

### 在线部署后安装

1. **部署应用**
   - 将应用部署到服务器（如GitHub Pages）
   - 获取访问链接（如 https://yourname.github.io/health-tracker）

2. **手机访问**
   - 在安卓手机上用Chrome浏览器打开链接
   - 首次访问时会看到"添加到主屏幕"提示
   - 点击"安装"

3. **手动安装**
   - 如果没有自动提示，点击Chrome菜单（右上角三个点）
   - 选择"添加到主屏幕"或"安装应用"
   - 确认安装

4. **使用应用**
   - 安装完成后，手机桌面会出现"健康记录"图标
   - 点击图标即可像普通APP一样使用
   - 支持离线使用和数据本地存储

### 本地测试安装

1. **电脑和手机同一WiFi**
2. **电脑启动服务器**
   ```bash
   node server.js
   ```
3. **查看电脑IP**
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
4. **手机访问**
   - 在Chrome中访问 `http://电脑IP:8080`
   - 按上述步骤安装

## ⚙️ 配置提醒功能

### 启用通知权限

1. 首次打开应用时，会请求通知权限
2. 点击"允许"以接收提醒
3. 如果拒绝了，可以在浏览器设置中重新开启

### 设置提醒时间

1. 切换到"提醒"页面
2. 设置血压测量、吃药、运动的提醒时间
3. 即使关闭浏览器，到时间也会收到通知

## 🎨 自定义配置

### 修改提醒时间默认值

编辑 `app.js` 文件：

```javascript
// 找到这些行并修改默认值
document.getElementById('bpReminderTime').value = "08:00";
document.getElementById('medReminderTime').value = "08:00";
document.getElementById('exerciseReminderTime').value = "16:00";
```

### 修改应用名称/颜色

编辑 `manifest.json` 文件：

```json
{
  "name": "你的应用名称",
  "short_name": "短名称",
  "theme_color": "#你的主题色",
  "background_color": "#你的背景色"
}
```

### 生成应用图标

1. 安装Python依赖：
```bash
pip install cairosvg Pillow
```

2. 运行生成脚本：
```bash
python generate_icons.py
```

3. 脚本会生成所有尺寸的PNG图标

## 🔒 HTTPS要求

### 为什么需要HTTPS？

- PWA功能（Service Worker、推送通知）需要HTTPS
- 安卓安装到主屏幕功能需要HTTPS
- 本地localhost开发可以不需要HTTPS

### 免费HTTPS方案

1. **GitHub Pages**: 自动提供HTTPS
2. **Netlify**: 免费部署+HTTPS
3. **Vercel**: 免费部署+HTTPS
4. **Cloudflare**: 免费CDN+HTTPS

## 🐛 常见问题

### Q: 为什么无法安装到主屏幕？
A: 确保：
- 使用HTTPS或localhost
- manifest.json配置正确
- Service Worker正常注册
- 使用支持的浏览器（Chrome、Edge、Samsung Internet）

### Q: 为什么收不到提醒通知？
A: 检查：
- 是否授予了通知权限
- 浏览器是否允许后台运行
- 手机是否开启了省电模式（可能限制后台活动）

### Q: 数据会丢失吗？
A: 数据存储在浏览器本地存储中：
- 清除浏览器数据会丢失
- 卸载应用不会丢失（重新安装后数据还在）
- 建议定期导出备份

### Q: 支持iPhone吗？
A: 支持，但功能有限：
- iOS Safari支持PWA安装
- 但iOS限制后台通知，提醒功能可能不完整
- 建议在安卓手机上使用获得最佳体验

## 📞 技术支持

如有问题，请查看：
- README.md - 项目说明
- 浏览器控制台（F12）查看错误信息
- 确保使用最新版Chrome浏览器

---

**祝您使用愉快，身体健康！** ❤️
