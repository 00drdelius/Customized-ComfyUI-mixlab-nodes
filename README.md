# Customized-ComfyUI-Mixlab-Nodes

> Original Codebase:
> [shadowcz007/comfyui-mixlab-nodes](https://github.com/shadowcz007/comfyui-mixlab-nodes)  
> Aligned version: v0.22.0

# Major Modifications to the Original

- > web/javascript/app_mixlab.js  
  > 添加KSampler节点获取与PhotoMaker部分节点获取
  > PhotoMaker节点绑定ComfyUI另一个插件：[shiimizu/ComfyUI-PhotoMaker-Plus](https://github.com/shiimizu/ComfyUI-PhotoMaker-Plus)
  >
- > web/index.html  
  > 添加KSampler等高级设置;
  > 删去icon与description;
  > output添加下载按钮;
  >
- > \_\_init\_\_.py  
  > 设置获取历史生成结果为10个 (get_prompt_result)
  > 