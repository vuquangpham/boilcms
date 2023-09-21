// create HTML Div
const createComponent = (info) => {
    // name, params
    const name = info.name;

    // name, value
    const params = info.params;
    // name, value

    // params HTML
    const paramHTML = params.reduce((acc, cur) => {
        acc += `
<div data-param="${cur.key}">
    <span data-param-value="${cur.value}">${cur.value ?? ''}</span>
</div>`;
        return acc;
    }, '');

    // add more components (for row only)
    const addMoreComponent = name === 'row' ? `
<div data-component-add>
    <button type="button" data-toggle="components">Add More</button>
</div>
    ` : '';

    const html = `
<div data-component="${name}">  
    <div data-component-utils>
        <button>Duplicate</button>
        <button>Move</button>
        <button>Delete</button>
    </div>
    
    <div data-component-content ${info.name === 'row' ? 'data-component-children' : ''}>${paramHTML}</div>
    
    ${addMoreComponent}
</div>
`;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
};

// load component information to the panel
const loadComponent = (info) => {

};

// update data after edit
const updateComponent = (component, params) => {

};


const handleSaveBtnClick = (componentPanel, parentEl) => {
    const componentInfo = {
        name: componentPanel.dataset.component,
        params: []
    };
    Array.from(componentPanel.children).forEach(el => {
        const obj = {};
        obj.key = el.dataset.param;
        obj.value = el.querySelector('[data-param-value]').textContent;
        componentInfo.params.push(obj);
    });

    const html = createComponent(componentInfo);
    Theme.toggleAttributeAction(html.querySelectorAll('[data-toggle]'));
    parentEl.querySelector('[data-component-content]').insertAdjacentElement('beforeend', html);

    const wrapperEl = document.querySelector('[data-component="wrapper"]');
    const generateComponentEl = document.querySelector('[data-generate-component]');

    const content = generateObj(wrapperEl);
    console.log(content);
    console.log(JSON.stringify(content));
    generateComponentEl.innerHTML = JSON.stringify(content);
};

document.querySelectorAll('[data-content]').forEach(wrapper => {
    console.log('wrapper', wrapper);

    const componentPanel = wrapper.querySelector('.component-popup__content');

    let parentEl = null;

    wrapper.addEventListener('click', (e) => {
        const target = e.target;

        const addButtonEl = target.closest('[data-component-add]');
        if(addButtonEl){
            parentEl = addButtonEl.closest('[data-component]');
        }

        // save click
        const saveBtnClick = target.closest('.component-popup__save');
        if(saveBtnClick){
            handleSaveBtnClick(componentPanel, parentEl);
        }

        // component click
        const componentEl = target.closest('button[data-component]');
        if(componentEl){
            const componentName = componentEl.dataset.component;
            console.log(document.documentElement.classList);

            fetch(location.href + '&' + new URLSearchParams({
                method: 'get',
                action: 'get',
                getJSON: true,
                componentName
            }))
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    componentPanel.innerHTML = result.data;
                    componentPanel.dataset.component = result.component.name;

                    if(result.component.name === 'row') handleSaveBtnClick(componentPanel, parentEl);
                });
            console.log(componentName);
        }
    });
});


const generateObj = (domEl) => {
    const contentElm = domEl.querySelector('[data-component-children]');
    const componentName = domEl.dataset.component;

    let returnObj = {
        name: componentName,
        children: []
    };

    // not have children => component with the data provided
    if(!contentElm){
        const elm = domEl.querySelector('[data-component-content]');
        returnObj.params = [];

        [...elm.children].forEach(param => {
            const object = {
                key: param.dataset.param,
                value: param.querySelector('[data-param-value]').dataset.paramValue,
            };
            returnObj.params.push(object);
        });

        return returnObj;
    }

    [...contentElm.children].forEach(el => {
        returnObj.children.push(generateObj(el));
    });
    return returnObj;
};

const generateDomEl = (obj) => {
    const componentName = obj.name;
    const componentParams = obj.params;

    const div = document.createElement('div');
    div.setAttribute('data-component', componentName);

    const innerDomHTML = [];

    if(obj.children){
        obj.children.forEach(child => {
            innerDomHTML.push(generateDomEl(child));
        });
    }

    // create utils
    const utils = document.createElement('div');
    utils.setAttribute('data-component-utils', '');
    utils.innerHTML = `
        <button>Duplicate</button>
        <button>Move</button>
        <button>Delete</button>
    `;
    div.appendChild(utils);

    // content
    const content = document.createElement('div');
    content.setAttribute('data-component-content', '');

    if(innerDomHTML.length > 0){
        innerDomHTML.forEach(dom => content.appendChild(dom));
    }

    // add button
    if(componentName === 'row' || componentName === 'wrapper'){
        const add = document.createElement('div');
        add.setAttribute('data-component-add', '');

        content.setAttribute('data-component-children', '');

        add.innerHTML = `<button type="button" data-toggle="components">Add More</button>`;
        div.appendChild(add);
    }

    // set content
    if(componentParams){
        const divs = componentParams.reduce((acc, param) => {
            const div = document.createElement('div');
            div.setAttribute('data-param', param.key);

            const span = document.createElement('span');
            span.setAttribute('data-param-value', param.value);
            span.innerHTML = param.value;

            div.appendChild(span);
            acc.push(div);

            return acc;
        }, []);

        divs.forEach(div => content.appendChild(div));
    }
    div.appendChild(content);

    return div;
};