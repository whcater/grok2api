
# grok2API 接入指南
1. 基于 Docker 的实现
2. 增加支持windows环境本地运行 npm run start

## 项目简介
本项目提供了一种简单、高效的方式通过 Docker 部署 使用openAI的格式转换调用grok官网，进行api处理。
## 方法一：Docker部署

### 1. 获取项目
克隆我的仓库：[grok2api](https://github.com/xLmiler/grok2api)
### 2. 部署选项

#### 方式0：本地跑，楼主试过windows 更改CHROME_PATH可以run, mac只能用docker运行啦
- 需要在项目根目录添加.env文件, 内容如下：
- PICGO_KEY 、 SSO 和 CHROME_PATH 参数填上自己的
``` text
API_KEY=sk-123456
PICGO_KEY=***
IS_CUSTOM_SSO=false
ISSHOW_SEARCH_RESULTS=false
PORT=3000
SHOW_THINKING=true
SSO=xxx
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```
- 加好.env文件后， 执行 npm run start就行了

#### 方式A：直接使用Docker镜像
```bash
docker run -it -d --name grok2api \
  -p 3000:3000 \
  -e API_KEY=your_api_key \
  -e TUMY_KEY=你的图床key,和PICGO_KEY 二选一 \
  -e PICGO_KEY=你的图床key,和TUMY_KEY二选一 \
  -e IS_CUSTOM_SSO=false \
  -e ISSHOW_SEARCH_RESULTS=false \
  -e PORT=3000 \
  -e SHOW_THINKING=true \
  -e SSO=your_sso \
  yxmiler/grok2api:latest
```

#### 方式B：使用Docker Compose
````artifact
version: '3.8'
services:
  grok2api:
    image: yxmiler/grok2api:latest
    container_name: grok2api
    ports:
      - "3000:3000"
    environment:
      - API_KEY=your_api_key
      - TUMY_KEY=你的图床key,和PICGO_KEY 二选一
      - PICGO_KEY=你的图床key,和TUMY_KEY二选一
      - IS_CUSTOM_SSO=false
      - ISSHOW_SEARCH_RESULTS=false
      - PORT=3000
      - SHOW_THINKING=true
      - SSO=your_sso
    restart: unless-stopped
````

#### 方式C：自行构建
1. 克隆仓库
2. 构建镜像
```bash
docker build -t yourusername/grok2api .
```
3. 运行容器
```bash
docker run -it -d --name grok2api \
  -p 3000:3000 \
  -e API_KEY=your_api_key \
  -e TUMY_KEY=你的图床key,和PICGO_KEY 二选一 \
  -e PICGO_KEY=你的图床key,和TUMY_KEY二选一 \
  -e IS_CUSTOM_SSO=false \
  -e ISSHOW_SEARCH_RESULTS=false \
  -e PORT=3000 \
  -e SHOW_THINKING=true \
  -e SSO=your_sso \
  yourusername/grok2api:latest
```

### 3. 环境变量配置

|变量 | 说明 | 示例|
|--- | --- | ---|
|`API_KEY` | 自定义认证鉴权密钥（可以不填，默认是sk-123456） | `sk-123456`|
|`PICGO_KEY` | PicGo图床密钥，两个图床二选一 ，不填无法流式生图 | -|
|`TUMY_KEY` | TUMY图床密钥，两个图床二选一，不填无法流式生图| -|
|`ISSHOW_SEARCH_RESULTS` | 是否显示搜索结果 （可不填，默认关闭） | `true/false`|
|`SSO` | Grok官网SSO Cookie,可以设置多个使用英文 , 分隔，我的代码里会对不同账号的SSO自动轮询和均衡（除非开启IS_CUSTOM_SSO否则必填） | `sso,sso`|
|`PORT` | 服务部署端口（可不填，默认3000） | `3000`|
|`IS_CUSTOM_SSO` | 这是如果你想自己来自定义负载均衡而不是通过我的代码来为你轮询均衡启动的开关，开启后 API_KEY 需要设置为请求用的 token，同时SSO环境变量失效，每次只能传入一个， API_KEY的值为你的 sso 的 cookie 值，不支持在apikey填入多个。想自动使用多个sso请关闭 IS_CUSTOM_SSO 这个环境变量，然后按照SSO环境变量要求在sso环境变量里填入多个sso，由我的项目代码来为你自动轮询（可不填，默认关闭）| `true/false`|
|`SHOW_THINKING` | 是否显示思考模型的思考过程（可不填，默认关闭） | `true/false`|

## 方法二：Hugging Face部署

### 部署地址
https://huggingface.co/spaces/yxmiler/GrokAPIService

### 功能特点
实现的功能：
1. 已支持文字生成图，使用grok-2-imageGen和grok-3-imageGen模型。
2. 已支持全部模型识图和传图，只会识别存储用户消息最新的一个图，历史记录图全部为占位符替代。
3. 已支持搜索功能，使用grok-2-search或者grok-3-search模型，可以选择是否关闭搜索结果
4. 已支持深度搜索功能，使用grok-3-deepsearch
5. 已支持推理模型功能，使用grok-3-reasoning
6. 已支持真流式，上面全部功能都可以在流式情况调用
7. 支持多账号轮询，在环境变量中配置
8. grok2采用临时账号机制，理论无限调用。
9. 可以选择是否移除思考模型的思考过程。
10. 支持自行设置轮询和负载均衡，而不依靠项目代码
11. 已转换为openai格式。

### 可用模型列表
- `grok-2`
- `grok-2-imageGen`
- `grok-2-search`
- `grok-3`
- `grok-3-search`
- `grok-3-imageGen`
- `grok-3-deepsearch`
- `grok-3-reasoning`
- 
### cookie的获取办法：
1. 打开[grok官网](https://grok.com/)
2. 复制如下的SSO的cookie的值填入SSO变量即可
![9EA{{UY6 PU~PENQHYO5JS7](https://github.com/user-attachments/assets/539d4a53-9352-49fd-8657-e942a94f44e9)



### API调用

#### Docker版本
- 模型列表：`/v1/models`
- 对话：`/v1/chat/completions`

#### Hugging Face版本
- 模型列表：`/hf/v1/models`
- 对话：`/hf/v1/chat/completions`

## 备注
- 消息基于用户的伪造连续对话
- 可能存在一定程度的降智
- 生图模型不支持历史对话，仅支持生图。
## 补充说明
- 如需使用流式生图的图像功能，需在[PicGo图床](https://www.picgo.net/)或者[tumy图床](https://tu.my/)申请API Key，前者似乎无法注册了，没有前面图床账号的可以选择后一个图床。
- 自动移除历史消息里的think过程，同时如果历史消息里包含里base64图片文本，而不是通过文件上传的方式上传，则自动转换为[图片]占用符。

# 第三方客户配置和使用
- ## [CherryStudio](https://cherry-ai.com/) 
1. setup
![](https://raw.githubusercontent.com/whcater/pic-lib/main/image-1.png)
2. usage
![](https://raw.githubusercontent.com/whcater/pic-lib/main/image-2.png)

## 注意事项
⚠️ 本项目仅供学习和研究目的，请遵守相关使用条款。

