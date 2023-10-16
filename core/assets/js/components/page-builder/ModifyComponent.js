import Component from "../component";
import fetch from "@global/fetch";

// WYSIWYG editor
import Quill from "quill";
import 'quill/dist/quill.snow.css';

export default class ModifyComponent{
    constructor(wrapper){
        this.wrapper = wrapper;
        this.isEdit = false;

        this.init();
    }

    init(){
        // register DOM elements
        this.parentGroup = null;
        this.componentDetailPanel = this.wrapper.querySelector('[data-pb-component-popup-content]');
        this.wrapperComponentEl = this.wrapper.querySelector('[data-component-wrapper]');
        this.jsonElement = this.wrapper.querySelector('[data-pb-json]');

        // render components based on JSON
        this.renderComponents();
    }

    renderComponents(){
        const jsonContent = this.jsonElement.textContent;
        if(!jsonContent) return;

        // get wrapper component
        const componentElement = this.generateObjectToDomElement(JSON.parse(jsonContent));

        // register data toggle
        Theme.toggleAttributeAction(componentElement.querySelectorAll('[data-toggle]'));

        // replace element
        this.wrapperComponentEl.replaceWith(componentElement);
        this.wrapperComponentEl = componentElement;
    }

    generateDomElementToObject(domElement){
        const contentElm = domElement.querySelector('[data-component-children]');
        const componentName = domElement.dataset.component;

        let returnObj = {
            name: componentName,
            children: []
        };

        // not have children => component with the data provided
        if(!contentElm){
            const elm = domElement.querySelector('[data-component-content]');
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
            returnObj.children.push(this.generateDomElementToObject.call(this, el));
        });
        return returnObj;
    }

    generateObjectToDomElement(property){
        const componentInformation = {
            name: property.name,
            params: property.params || [],
            children: property.children
        };

        const component = new Component(componentInformation);

        const componentElement = component.component;
        const componentContentElement = componentElement.querySelector('[data-component-content]');

        // loop to get children elements
        componentInformation.children
            .map(child => this.generateObjectToDomElement.call(this, child))
            .forEach(dom => componentContentElement.appendChild(dom));

        return componentElement;
    }

    getComponentInfoFromServer(componentName){
        return new Promise((resolve, reject) => {
            const urlObject = new URL(location.href);
            const url = urlObject.origin + urlObject.pathname;

            fetch(url, {
                method: 'get',
                action: 'get',
                getJSON: true,
                componentName
            })
                .then(res => res.json())
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }

    handleAddComponentClick(target){
        // re-assign parent group
        this.parentGroup = target.closest('[data-component]');
    }

    handleEditComponentClick(target){
        this.isEdit = true;
        this.edittingComponent = target.closest('[data-component]');

        const componentName = this.edittingComponent.dataset.component;

        // get param value
        const params = Array.from(this.edittingComponent.querySelectorAll('[data-param]'))
            .map(param => {
                const obj = {};
                obj.key = param.getAttribute('data-param');
                obj.value = param.querySelector('[data-param-value]').getAttribute('data-param-value');

                return obj;
            });

        this.getComponentInfoFromServer(componentName)
            .then(result => {
                this.loadComponent(result);

                // load data to popup
                this.loadDataToPopup(params);

                // re-update the previous value
                if(this.componentTypes.find(t => t === 'text')){
                    const editorElement = this.componentDetailPanel.querySelector('#editor-container');
                    const value = editorElement.getAttribute('data-param-value');

                    if(value){
                        editorElement.querySelector('.ql-editor').innerHTML = value;
                        this.editor.update();
                    }

                }
            });
    }

    handleDeleteComponentClick(target){
        const componentEl = target.closest('[data-component]');
        componentEl.remove();

        // re-generate JSON
        this.createJSON();
    }

    handleSaveBtnClick(_){
        // component information
        const componentInformation = {
            name: this.componentDetailPanel.dataset.component,
            params: []
        };

        // get params
        Array.from(this.componentDetailPanel.children).forEach(el => {
            const paramValueEl = el.querySelector('[data-param-value]');
            const value = paramValueEl?.getAttribute('data-param-value');

            const obj = {};
            obj.key = el.dataset.param;

            obj.value = value || paramValueEl?.textContent.trim();
            if(!obj.value) obj.value = '';

            componentInformation.params.push(obj);
        });

        const componentInstance = new Component(componentInformation);
        const componentDomEl = componentInstance.component;

        // edit component or add the new one
        if(this.isEdit){
            this.edittingComponent.replaceWith(componentDomEl);
            this.isEdit = false;
        }else{
            // insert to the group
            this.parentGroup.querySelector('[data-component-content]').insertAdjacentElement('beforeend', componentDomEl);
        }

        // toggle attribute
        Theme.toggleAttributeAction(componentDomEl.querySelectorAll('[data-toggle]'));

        // create JSON
        this.createJSON();
    }

    loadDataToPopup(data){
        data.forEach(d => {
            this.componentDetailPanel
                .querySelector(`[data-param="${d.key}"]`)
                .querySelector('[data-param-value]').setAttribute('data-param-value', d.value);
        });
    }

    createJSON(){
        this.jsonElement.value = JSON.stringify(this.generateDomElementToObject(this.wrapperComponentEl));
    }

    loadComponent(result){
        // get types of component
        this.componentTypes = result.component
            .params
            .map(p => p.type.slice(0, -4));

        const div = document.createElement('div');
        div.innerHTML = result.data;

        // reset the last one
        this.componentDetailPanel.innerHTML = '';
        this.componentDetailPanel.append(...[...div.children]);
        this.componentDetailPanel.dataset.component = result.component.name;

        // init component script
        if(this.componentTypes.find(t => t === 'text')){
            const editorElement = this.componentDetailPanel.querySelector('#editor-container');

            // init editor
            this.editor = new Quill(editorElement, {
                modules: {
                    toolbar: [
                        [{header: [1, 2, false]}],
                        ['bold', 'italic', 'underline', 'strike', 'link'],
                        ['list', 'blockquote']
                    ]
                },
                placeholder: 'Input your content here...',
                theme: 'snow',
            });

            // update the param value
            this.editor.on('text-change', () => {
                const value = editorElement.querySelector('.ql-editor').innerHTML;
                editorElement.setAttribute('data-param-value', value);
            });
        }

        // toggle attribute
        Theme.toggleAttributeAction(this.componentDetailPanel.querySelectorAll('[data-toggle]'));
    }

    handleComponentClick(target){
        const componentName = target.dataset.component;

        this.getComponentInfoFromServer(componentName)
            .then(result => {
                this.loadComponent(result);

                if(this.isGroupComponent(componentName)) this.handleSaveBtnClick(target);
            });
    }

    isGroupComponent(componentName){
        return componentName === 'row';
    }

    isModifyHandler(e){
        let functionForHandling = () => {
        }, target = null;

        // add more components
        const addButtonEl = e.target.closest('[data-component-add]');

        // save component
        const saveButtonEl = e.target.closest('[data-pb-component-popup-save]');

        // delete component
        const deleteButtonEl = e.target.closest('button[data-component-delete]');

        // edit component
        const editButtonEl = e.target.closest('button[data-component-edit]');

        // click to the component in components list
        const componentEl = e.target.closest('button[data-component]');

        // add component button
        if(addButtonEl){
            functionForHandling = this.handleAddComponentClick.bind(this);
            target = addButtonEl;
        }

        // save component
        else if(saveButtonEl){
            functionForHandling = this.handleSaveBtnClick.bind(this);
            target = saveButtonEl;
        }

        // add component from popup
        else if(componentEl){
            functionForHandling = this.handleComponentClick.bind(this);
            target = componentEl;
        }

        // edit component
        else if(editButtonEl){
            functionForHandling = this.handleEditComponentClick.bind(this);
            target = editButtonEl;
        }

        // delete component
        else if(deleteButtonEl){
            functionForHandling = this.handleDeleteComponentClick.bind(this);
            target = deleteButtonEl;
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}
