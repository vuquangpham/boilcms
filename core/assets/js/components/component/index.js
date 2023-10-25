export default class Component{
    constructor(information){
        this.name = information.name;
        this.params = information.params;
        this.isGroupComponent = this.name === 'row';
        this.component = this.createComponent();
    }

    createComponent(){
        const componentDiv = document.createElement('div');
        componentDiv.setAttribute('data-component', this.name);

        // component name
        const componentNameEl = document.createElement('div');
        const componentName = this.name.replaceAll('-', ' ');
        componentNameEl.setAttribute('data-component-name', componentName);
        componentNameEl.innerHTML = componentName;
        componentDiv.appendChild(componentNameEl);

        // add utils
        componentDiv.appendChild(this.createUtils());

        // add content
        componentDiv.appendChild(this.createContent(this.params));

        // add add-button
        if(this.isGroupComponent) componentDiv.appendChild(this.createAddComponents());

        return componentDiv;
    }

    createUtils(){
        const utilsDiv = document.createElement('div');
        utilsDiv.setAttribute('data-component-utils', '');

        // inner HTML
        utilsDiv.innerHTML = `
        <button type="button" data-toggle="component-panel" data-component-edit>Edit</button>
        <button type="button" data-component-delete>Delete</button>
        `;

        return utilsDiv;
    }

    createAddComponents(){
        const addComponentDiv = document.createElement('div');
        addComponentDiv.setAttribute('data-component-add', '');

        // inner HTML
        addComponentDiv.innerHTML = `
        <button type="button" data-toggle="components">Add More</button>
        `;

        return addComponentDiv;
    }

    createContent(params){
        const contentDiv = document.createElement('div');
        contentDiv.setAttribute('data-component-content', '');

        // group component
        if(this.isGroupComponent){
            contentDiv.setAttribute('data-component-children', '');
        }

        // inner HTML
        contentDiv.innerHTML += params.reduce((acc, cur) => {
            const isObject = typeof cur.value === 'object';
            const stringifyValue = JSON.stringify(cur.value);

            acc += `
<div data-param="${cur.key}">
    <span data-param-value='${stringifyValue}'>${isObject ? stringifyValue : cur.value}</span>
</div>`;
            return acc;
        }, '');

        return contentDiv;
    }
}