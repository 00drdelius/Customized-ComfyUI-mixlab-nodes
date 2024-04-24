function updateKSampler(KSampler_id, name, val){
    if (
        !["steps","cfg","sampler_name","scheduler","denoise"].includes(name)
    ){ throw new Error(`KSampler doesn't have param: ${name} !!`)}
    var kSampler = window._appData.data[KSampler_id];
    if (kSampler.class_type!="KSampler") {throw new Error("id Passed in not KSampler's!!")}
    else {
        kSampler.inputs[name]=val;
    }
}

function createKsampler(data){
    const { 
        input: inputData,
    } = data;

    var KSampler={};
    var KSamplerInput={};
    var KSamplerId;
    for (let ele of inputData){
        if (ele.class_type==="KSampler"){
            KSampler=ele;
            KSamplerInput=ele.inputs;
            KSamplerId=ele.id;
            break;
        }
    }
    if (JSON.stringify(KSampler)==`{}`){
        const error_msg="KSampler not in inputData!! May cause unexpected UI error.";
        console.warn(error_msg);
        throw new Error(error_msg);
    };
    var KSamplerEle = document.createElement('details');
    KSamplerEle.innerHTML=`<summary>KSampler</summary>\n`;
    KSamplerEle.innerHTML+=`<div class="ksampler-config"> <div>`;
    KSamplerEle.style="margin-bottom: 20px;"
    const kconfig = KSamplerEle.querySelector(".ksampler-config");
    let kconfigInput = document.createElement('div');
    kconfigInput.style = `outline: 1px dashed gray;margin-bottom: 12px;margin-top: 12px;`

    let em = document.createElement('em');
    let emText = document.createElement('span');
    emText.innerText=`KSampler高级设置`;
    em.appendChild(emText);

    var steps=createNumSlide(
        `steps`, 0,
        (newSteps)=>updateKSampler(KSamplerId,"steps",newSteps),
        0,100, 'int',
        null, null,
        false
    );
    var cfg=createNumSlide(
        `cfg`, 0,
        (newcfg)=>updateKSampler(KSamplerId,"cfg",newcfg),
        0,100, 'float',
        null, null,
        false
    );
    var denoise=createNumSlide(
        `denoise`, 0,
        (newdenoise)=>updateKSampler(KSamplerId,"denoise",newdenoise),
        0,1, 'float',
        null,null,
        false
    );

    let [div_sampler_name, selectDom1] = createSelectWithOptions(
        "sampler_name",
        Array.from(
            ['euler', 'euler_ancestral', 'heun', 'heunpp2', 'dpm_2', 'dpm_2_ancestral', 'lms', 'dpm_fast', 'dpm_adaptive', 'dpmpp_2s_ancestral', 'dpmpp_sde', 'dpmpp_sde_gpu', 'dpmpp_2m', 'dpmpp_2m_sde', 'dpmpp_2m_sde_gpu', 'dpmpp_3m_sde', 'dpmpp_3m_sde_gpu', 'ddpm', 'lcm', 'ddim', 'uni_pc', 'uni_pc_bh2'],
            o => {return {value:o, text:o}}
        ), 'euler'
    )
    selectDom1.addEventListener('change', e=>{
        e.preventDefault();
        updateKSampler(KSamplerId, "sampler_name", selectDom1.value)
    })

    let [div_scheduler, selectDom2] = createSelectWithOptions(
        "scheduler",
        Array.from(
            ['ddim_uniform', 'simple', 'sgm_uniform', 'exponential', 'karras', 'normal'],
            o => {return {value:o, text:o}}
        ), 'normal'
    )
    selectDom2.addEventListener('change', e=>{
        e.preventDefault();
        updateKSampler(KSamplerId, "scheduler", selectDom2.value)
    })

    //添加至总UI
    kconfigInput.appendChild(steps);
    kconfigInput.appendChild(cfg);
    kconfigInput.appendChild(denoise);
    kconfigInput.appendChild(div_sampler_name);
    kconfigInput.appendChild(div_scheduler);

    KSamplerEle.appendChild(kconfigInput);
    return KSamplerEle;
}





/**
 * 创建下拉选择，带title
 * @param title: label中的title名
 * @param options: 下拉选择条
 * @param defaultValue: 默认值
 * @returns [div, selectElement]: div: wrapper element, ...
 */
function createSelectWithOptions(title, options, defaultValue) {

    const div = document.createElement("div");
    div.className = 'card';
    // Create a label for the upload control
    const nameLabel = document.createElement("label");
    nameLabel.textContent = title;
    div.appendChild(nameLabel);
    var selectElement = createSelect(options, defaultValue);
    div.appendChild(selectElement)
    return [div, selectElement];
}

// 创建下拉选择
function createSelect(options, defaultValue) {
    var selectElement = document.createElement("select");
    selectElement.className = "select"

    // 循环遍历选项数组
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i].value;
        option.innerText = options[i].text;
        selectElement.appendChild(option);
        // if(options[i].selected) 
    }

    // 设置默认值
    selectElement.value = defaultValue;
    // console.log(defaultValue, options)
    return selectElement
}

/** 
 * 创建滑动条，带title
 * @param labelText: innerHTML in label
 * @param value: no need to concern
 * @param callback: function to execute if slides
 * @param minmaxValue: min&max of slider input
 * @param type: typeof slider input value
 * @param createToggle: if create Toggle btn or not
*/
function createNumSlide(
    labelText, value = 0, callback,
    minValue = 0, maxValue = 1,
    type = 'float', keywords = null, targetId = null,
    createToggle = true
) {

    value = 'float' ? parseFloat(value.toFixed(3)) : parseInt(value)
    try {
        let i = parseFloat(localStorage.getItem(`_slider_${targetId}`))
        if (!!i) {
            value = i;
            callback && callback(value)
        }
    } catch (error) {

    }

    // 输入div
    let inputDiv = document.createElement('div');
    inputDiv.style.display = 'flex'

    // 创建滑块输入元素
    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = minValue;
    slider.max = maxValue;
    slider.step = type == 'float' ? 0.01 : 1
    slider.value = value;
    slider.style.width = '150px'

    // 创建标签元素
    var label = document.createElement("label");
    label.innerHTML = labelText;
    label.setAttribute('data-content', value);

    if (keywords && keywords[0]) {
        // label.innerHTML = ``
        // 有备选的关键词

        let defaultValue = (targetId ? localStorage.getItem(`_slide_${targetId}`) : '') || keywords[0];

        window._appData.data[targetId].inputs.prompt_keyword = defaultValue;

        let selectTag = createSelect(Array.from(keywords, (k, i) => {
            return {
                value: k,
                text: k,
                selected: i == 0
            }
        }), defaultValue);

        selectTag.style = `background: none;
                            color: black;    max-width: 300px;
                            border-bottom: 1px solid #acacac;
                            border-radius: 0;`
        // selectTag.setAttribute('data-content',labelText);
        selectTag.addEventListener('change', e => {
            e.preventDefault();
            window._appData.data[targetId].inputs.prompt_keyword = selectTag.value;

            targetId ? localStorage.setItem(`_slide_${targetId}`, selectTag.value) : ''
        })
        label.appendChild(selectTag);
    }

    // 创建容器元素，并将滑块输入和标签添加到容器中
    var container = document.createElement("div");
    container.appendChild(label);

    container.className = 'card';


    // 创建切换按钮元素
    if (createToggle){
        var toggleButton = createToggleBtn()

        toggleButton.addEventListener("click", function () {
            if (slider.type === 'range') {
                slider.type = 'number'
            } else {
                slider.type = 'range'
            }
        });
        inputDiv.appendChild(toggleButton);
    }

    inputDiv.appendChild(slider);
    container.appendChild(inputDiv)

    // 添加change事件监听器
    slider.addEventListener("input", function (event) {
        var value = event.target.value;
        value = type == 'float' ? value : Math.round(value)
        console.log("滑块输入的值为：" + value);
        label.setAttribute('data-content', value);
        // 在这里可以执行其他操作，根据需要进行相应的处理
        callback && callback(value)

        localStorage.setItem(`_slider_${targetId}`, value)
    });

    // 返回容器元素
    return container;

}

function createUI(data, share = true) {
    // appData.input, appData.output, appData.seed, share, appData.link
    if (!data) return
    const { input: inputData, output: outputData, data: workflow, seed, seedTitle, link, name } = data;

    let mainDiv = document.createElement('div');

    if (document.body.querySelector('#app_container')) document.body.querySelector('#app_container').remove()
    let appDetails = document.createElement('details');
    appDetails.id = "app_container"
    appDetails.setAttribute('open', true)
    appDetails.innerHTML = `<summary>${name}</summary>`;
    appDetails.style = `background: whitesmoke;
    color: black;
    padding: 12px;
    cursor: pointer;
    margin: 8px 44px;`


    let leftDetails = document.createElement('details');
    leftDetails.setAttribute('open', 'true')
    leftDetails.id = 'app_input_pannel'
    leftDetails.innerHTML = `<summary>INPUT</summary>
        <div class="content"></div>`

    let leftDiv = leftDetails.querySelector('.content');
    let rightDiv = document.createElement('div');

    mainDiv.className = 'app'
    leftDiv.className = 'panel'
    leftDiv.style.alignItems = 'flex-start';
    rightDiv.className = 'panel'
    leftDiv.style.flex = 0.4
    rightDiv.style.flex = 1;
    // rightDiv.style.height='70vh'
    //         rightDiv.style=`position: fixed;
    // right: 0;
    // top: 12px;flex:0.6`

    // 创建标题
    let titleDiv = document.createElement('div');
    titleDiv.className = 'header'

    var title = document.createElement('h1');
    title.textContent = 'My Application';
    titleDiv.appendChild(title);

    if (share) {
        const shareBtn = document.createElement('button');
        shareBtn.innerText = 'copy url';
        shareBtn.addEventListener('click', e => {
            e.preventDefault();
            let url = `${get_url()}/mixlab/app?filename=${encodeURIComponent(window._appData.filename)}&category=${encodeURIComponent(window._appData.category || '')}`;
            copyTextToClipboard(url, success(e, shareBtn, 'copy url'));
        })

        titleDiv.appendChild(shareBtn);
    }



    let iconDes = document.createElement('div');
    // 创建应用图标
    var icon = document.createElement('img');
    icon.style.width = '48px';
    // icon.style.height = '98px';
    icon.src = base64Df;

    var des = document.createElement('p');
    des.style = `margin-left: 12px; font-size: 14px;`
    iconDes.appendChild(icon)
    iconDes.appendChild(des);
    iconDes.className = 'description'

    // 创建状态标签
    let statusDiv = document.createElement('div');
    statusDiv.className = 'status_seed'
    var status = document.createElement('div');
    status.textContent = 'Status';
    status.className = 'status';

    // seed 汇总
    var seeds = document.createElement('details');
    // seeds.textContent = 'Status';
    seeds.className = 'seeds';

    try {
        if (Object.keys(seed).length > 0) {
            seeds.innerHTML = `<summary>SEED</summary>
        <div class="content"> </div>`;
            const content = seeds.querySelector('.content')
            for (const id in seed) {
                const s = seed[id];
                if (!Array.isArray(workflow[id].inputs.seed)) {

                    let seedInput = document.createElement('div');
                    content.appendChild(seedInput)
                    seedInput.style = `outline: 1px dashed gray;margin-bottom: 12px;margin-top: 12px;`

                    let em = document.createElement('em');
                    let emText = document.createElement('span');
                    emText.innerText = `#${seedTitle && seedTitle[id] ? seedTitle[id] : id} ${s.toUpperCase()}`;
                    em.appendChild(emText);

                    seedInput.appendChild(em)

                    if (s === 'fixed') {
                        // console.log('###fiex',1)
                        let inSeed = createNumSlide(``, 0, (newSeed) => updateSeed(id, newSeed), 0, 1849378600828930, 'int');
                        inSeed.style = `padding: 8px;background: none`

                        let toggleRandomize = createToggleBtn();
                        toggleRandomize.style = `background:none;color:black`;

                        toggleRandomize.addEventListener("click", function () {
                            if (data.seed[id] === 'randomize') {
                                data.seed[id] = 'fixed';
                                inSeed.style.display = 'block'
                            } else {
                                data.seed[id] = 'randomize';
                                inSeed.style.display = 'none'
                            }
                            emText.innerText = `#${seedTitle && seedTitle[id] ? seedTitle[id] : id} ${data.seed[id].toUpperCase()}`;
                        });

                        seedInput.appendChild(inSeed);
                        em.appendChild(toggleRandomize);

                    }

                }


            }
        }

    } catch (error) {
        console.log(error)
    }

    // new update: advanced config
    try{
        
    } catch (error) {
        console.log(error)
    }
    // new update: advanced config

    statusDiv.appendChild(status);
    statusDiv.appendChild(seeds);

    // 创建高级设置
    var advanced=document.createElement("details");
    advanced.className="advanced-config";
    let title=document.createElement("summary");
    title.innerText="高级设置";
    var kconfigEle=createKsampler(data);
    advanced.appendChild(title);
    advanced.appendChild(kconfigEle);

    // 创建输入框
    var input1 = createInputs(inputData)

    var output = createOutputs(outputData, link)

    // 创建提交按钮
    var submitButton = document.createElement('button');
    submitButton.textContent = 'Create';
    submitButton.className = 'run_btn'

    // 将所有UI元素添加到页面中
    leftDiv.appendChild(titleDiv);
    leftDiv.appendChild(iconDes);
    // leftDiv.appendChild(des);
    leftDiv.appendChild(statusDiv);
    leftDiv.append(advanced);
    leftDiv.appendChild(input1);
    mainDiv.appendChild(submitButton);

    rightDiv.appendChild(output);

    mainDiv.appendChild(leftDetails);
    mainDiv.appendChild(rightDiv);

    appDetails.appendChild(mainDiv);
    document.body.appendChild(appDetails)

    appDetails.addEventListener('toggle', e => {
        e.preventDefault();
        document.body.querySelector('#author').style.display = appDetails.open ? 'flex' : 'none'
    })

    // 返回每个UI元素的引用和对应的更新方法
    return {
        title: {
            element: title,
            update: function (newTitle) {
                title.textContent = newTitle;
            }
        },
        icon: {
            element: icon,
            update: function (newIconPath) {
                icon.src = newIconPath;
            }
        },
        des: {
            element: des,
            update: function (text) {
                des.textContent = text;
            }
        },
        status: {
            element: status,
            update: function (newStatus) {
                status.textContent = newStatus;
            }
        },
        input1: {
            element: input1,
            update: function () {
                // 可以在这里添加上传图片的逻辑
            }
        },
        output: {
            element: output,
            update: async function (type = "image", val, id) {
                console.log(val, id)
                if (val && type == "image" && output.querySelector(`#output_${id} img`)) {

                    let im = await createImage(val)

                    output.querySelector(`#output_${id} img`).src = val;

                    let a = output.querySelector(`#output_${id}`);
                    a.setAttribute('data-pswp-width', im.naturalWidth);
                    a.setAttribute('data-pswp-height', im.naturalHeight);
                    a.setAttribute('target', "_blank");
                    a.setAttribute('href', val);

                }

                if (val && (type == "images" || type == 'images_prompts') && output.querySelector(`#output_${id} img`)) {
                    let imgDiv = output.querySelector(`#output_${id}`)
                    imgDiv.style.display = 'none';

                    // 清空
                    // Array.from(imgDiv.parentElement.querySelectorAll('.output_images'), im => im.remove());

                    for (const v of val) {

                        let url = v, prompt = ''

                        if (type == 'images_prompts') {
                            // 是个数组，多了对应的prompt
                            url = v[0];
                            prompt = v[1];
                        }

                        let im = await createImage(url);

                        // 构建新的
                        let a = document.createElement('a');
                        a.className = `${imgDiv.id} output_images`
                        a.setAttribute('data-pswp-width', im.naturalWidth);
                        a.setAttribute('data-pswp-height', im.naturalHeight);
                        a.setAttribute('target', "_blank");
                        a.setAttribute('href', url);


                        let img = new Image();
                        // img;
                        img.src = url;
                        a.appendChild(img);

                        if (prompt) {
                            a.style.textDecoration = 'none';
                            let p = document.createElement('p')
                            p.className = 'prompt_image'
                            p.innerText = prompt;
                            a.appendChild(p)
                            img.alt = prompt
                        }

                        // imgDiv.parentElement.appendChild(a);
                        imgDiv.parentElement.insertBefore(a, imgDiv.parentElement.firstChild);
                    }

                }

                if (val && type == "video" && output.querySelector(`#output_${id} video`)) {

                    let video = output.querySelector(`#output_${id} video`);
                    let img = output.querySelector(`#output_${id} img`);
                    img.style.display = 'none';
                    video.style.display = 'block';

                    video.onloadeddata = function () {

                        let a = output.querySelector(`#output_${id}`);
                        a.setAttribute('data-pswp-width', video.videoWidth);
                        a.setAttribute('data-pswp-height', video.videoHeight);
                        a.setAttribute('target', "_blank");
                        a.setAttribute('href', val);
                    };

                    video.src = val;

                }

                if (val && type == "text" && output.querySelector(`#output_${id}`)) output.querySelector(`#output_${id}`).innerText = val;

                // 3d meshes
                if (val && type == 'meshes' && output.querySelector(`#output_${id}`)) {

                    let threeD = output.querySelector('.threeD')
                    //判断默认的图片，需要去掉后创建model-viewer
                    let imgDf = output.querySelector(`#output_${id} img`);
                    if (!threeD) {
                        if (imgDf) imgDf.parentElement.remove();
                        threeD = document.createElement('div');
                        threeD.className = 'threeD'
                        threeD.id = `output_${id}`
                        output.querySelector('.output_card').appendChild(threeD)
                        // output.insertBefore(threeD, output.firstChild);
                    };


                    for (const meshUrl of val) {
                        const modelViewer = document.createElement('div');
                        modelViewer.style = `width:300px;margin:4px;height:300px;display:block`
                        modelViewer.innerHTML = `<model-viewer  src="${meshUrl}" 
                            min-field-of-view="0deg" max-field-of-view="180deg"
                            shadow-intensity="1" 
                            camera-controls 
                            touch-action="pan-y"
                            style="width:300px;height:300px;"
                            > 
                            <div class="controls">
                                <button class="export">Save As</button>
                            </div>
                        </model-viewer>`

                        const btn = modelViewer.querySelector('.export');
                        btn.addEventListener('click', async e => {
                            e.preventDefault();
                            const glTF = await (modelViewer.querySelector('model-viewer')).exportScene()
                            const file = new File([glTF], 'mixlab.glb')
                            const link = document.createElement('a')
                            link.download = file.name
                            link.href = URL.createObjectURL(file)
                            link.click()
                        })
                        threeD.appendChild(modelViewer)
                    }

                }
            }
        },
        submitButton: {
            element: submitButton,
            update: function (runFn, cancelFn) {
                submitButton.addEventListener('dblclick', (e) => {
                    e.preventDefault()
                    submitButton.classList.remove('disabled');
                });
                submitButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    if (submitButton.classList.contains('data-click')) {
                        return
                    } else {
                        submitButton.classList.add('data-click')
                        setTimeout(() => submitButton.classList.remove('data-click'), 500)
                    }

                    if (!submitButton.classList.contains('disabled')) {
                        runFn && runFn();
                        submitButton.classList.add('disabled');
                        submitButton.innerText = 'Cancel'
                    } else {
                        // 如果能取消
                        let canCancel = cancelFn && cancelFn();
                        if (canCancel) submitButton.classList.remove('disabled');
                        if (canCancel) submitButton.innerText = 'Create';
                    }

                });
            },
            running: () => {
                submitButton.innerText = 'Cancel';
                if (!submitButton.classList.contains('disabled')) submitButton.classList.add('disabled');
            },
            reset: () => {
                submitButton.innerText = 'Create';
                submitButton.classList.remove('disabled');
                submitButton.classList.remove('data-click');
            }
        },
    };
}
