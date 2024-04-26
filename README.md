# Customized-ComfyUI-Mixlab-Nodes

> Original Codebase:
> [shadowcz007/comfyui-mixlab-nodes](https://github.com/shadowcz007/comfyui-mixlab-nodes)  
> Aligned version: v0.22.0

# Major Modifications to the Original

- > #### web/javascript/app_mixlab.js  
  > 1. 添加KSampler节点获取与PhotoMaker部分节点获取
  > 2. PhotoMaker节点绑定ComfyUI另一个插件：[shiimizu/ComfyUI-PhotoMaker-Plus](https://github.com/shiimizu/ComfyUI-PhotoMaker-Plus)
  >
- > #### web/index.html  
  > 1. 添加KSampler等高级设置
  > 2. 删去icon与description
  > 3. output添加下载按钮
  > 4. 新增传入comfyui的workflow，修改postTo /prompt的jsondata，新增extra_data，模拟comfyui的postTo /prompt数据格式，用以适应其他的custom nodes
  >
- > #### \_\_init\_\_.py  
  > 设置获取历史生成结果为10个 (get_prompt_result)
  > 
