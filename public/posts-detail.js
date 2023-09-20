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
    <span>${cur.key} ${cur.value ?? ''}</span>
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
    
    <div data-component-content>${paramHTML}</div>
    
    ${addMoreComponent}
</div>
`;
    console.log(html);
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
    console.log(componentInfo, parentEl);
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