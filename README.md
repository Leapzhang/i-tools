<h1 align="center">爱拓工具箱</h1>

<div align="center">

[![Stars](https://img.shields.io/github/stars/iLay1678/i-tools?style=flat)](https://github.com/iLay1678/i-tools)
![badge](https://cnb.cool/ilay1678/i-tools/-/badge/git/latest/ci/status/tag_push)

</div>



## 功能列表
1. **阿里云盘TV授权**
   - 获取阿里云盘TV端的授权令牌
2. **挪车码牌生成**
   - 生成挪车码牌，方便他人联系车主
3. **二维码生成**
   - 生成自定义二维码
4. **JSON格式化工具**
   - JSON处理工具，支持格式化、压缩、验证和统计分析
5. **敬请期待**
   - 更多工具正在开发中...

## 部署

### 一键部署

#### Vercel 自动部署

<a href="https://vercel.com/new/clone?repository-url=https://github.com/iLay1678/i-tools" target="_blank">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>

#### Cloudflare Pages 自动部署

<a href="https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/deploy-to-workers&repository=https://github.com/iLay1678/i-tools" target="_blank">
  <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers" />
</a>




### Docker部署
```
docker run --name=i-tools -d -p 3000:3000 ghcr.io/ilay1678/i-tools:latest 
```
国内镜像
```
docker run --name=i-tools -d -p 3000:3000 docker.cnb.cool/ilay1678/mirrors/i-tools:latest 
```

## Stargazers over time
[![Stargazers over time](https://starchart.cc/iLay1678/i-tools.svg?variant=adaptive)](https://starchart.cc/iLay1678/i-tools)