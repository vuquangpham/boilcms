import Component from "../component";
import fetch from "@global/fetch";
import UpdateComponentState from "./UpdateComponentState";

// WYSIWYG editor
import Quill from "quill";
import 'quill/dist/quill.snow.css';

export default class ModifyComponent{
    constructor(wrapper){
        this.wrapper = wrapper;
        this.isEdit = false;

        // editors for wysiwyg editor
        this.editors = [];

        this.init();
    }

    init(){
        // register DOM elements
        this.parentGroup = null;
        this.componentDetailPanel = this.wrapper.querySelector('[data-pb-component-popup-content]');
        this.wrapperComponentEl = this.wrapper.querySelector('[data-component-wrapper]');
        this.jsonElement = this.wrapper.querySelector('[data-pb-json]');

        // register onchange event
        this.jsonElement.addEventListener('input', Theme.debounce(this.renderComponents.bind(this)));

        // render components based on JSON
        this.renderComponents();
    }

    renderComponents(){
        const jsonContent = this.jsonElement.value;
        if(!jsonContent){
            this.wrapperComponentEl.querySelector('[data-component-content]').innerHTML = '';
            return;
        }

        // get wrapper component
        const componentElement = UpdateComponentState.generateObjectToDomElement(JSON.parse(jsonContent));

        // register data toggle
        Theme.toggleAttributeAction(componentElement.querySelectorAll('[data-toggle]'));

        // replace element
        this.wrapperComponentEl.replaceWith(componentElement);
        this.wrapperComponentEl = componentElement;
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

    updateThePreviousValue(){
        // re-update the previous value
        if(this.componentTypes.find(t => t === 'text')){
            const editorElements = this.componentDetailPanel.querySelectorAll('#editor-container');

            editorElements.forEach((editorElement, index) => {
                const value = editorElement.getAttribute('data-param-value');
                if(value){
                    editorElement.querySelector('.ql-editor').innerHTML = value;
                    this.editors[index].update();
                }
            });
        }
        if(this.componentTypes.find(t => t === 'text-field')){

            this.componentDetailPanel.querySelectorAll('[data-type="text-field"]').forEach(textField => {
                const previousValueEl = textField.querySelector('[data-param-value]');
                const input = textField.querySelector('input');
                const previousValue = previousValueEl.getAttribute('data-param-value');

                if(previousValue){
                    input.value = previousValue;
                }
            });
        }
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
                const value = param.querySelector('[data-param-value]').getAttribute('data-param-value');
                try{
                    obj.value = JSON.parse(value);
                }catch(e){
                    obj.value = value;
                }
                return obj;
            })
            .reduce((acc, cur) => {
                if(cur.key === 'group'){
                    cur.value = cur.value.map(item => {
                        return item.reduce((acc, cur) => {
                            const obj = acc.find(o => o.key === cur.key);

                            // already exist, increase the count
                            if(obj){
                                cur.index = obj.index + 1;
                            }else{
                                cur.index = 0;
                            }
                            acc.push(cur);
                            return acc;
                        }, []);
                    });
                }

                const obj = acc.find(o => o.key === cur.key);

                // already exist, increase the count
                if(obj){
                    cur.index = obj.index + 1;
                }else{
                    cur.index = 0;
                }

                acc.push(cur);
                return acc;
            }, []);

        this.getComponentInfoFromServer(componentName)
            .then(result => {
                this.loadComponent(result);

                // load data to popup
                this.loadDataToPopup(params);
                this.updateThePreviousValue();
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
        Array.from(this.componentDetailPanel.querySelectorAll(':scope > [data-type]')).forEach(el => {
            const paramValueEl = el.querySelector('[data-param-value]');
            const value = paramValueEl?.getAttribute('data-param-value');

            const obj = {};
            obj.key = el.dataset.param;
            obj.value = value || '';

            if(obj.key === 'group'){
                obj.value = Array.from(el.querySelectorAll('[data-group-item]')).map(gItem => {
                    return Array.from(gItem.querySelectorAll('[data-type]')).map(e => {
                        const paramValueEl = e.querySelector('[data-param-value]');
                        const value = paramValueEl?.getAttribute('data-param-value');

                        const obj = {};
                        obj.key = e.dataset.param;
                        obj.value = value || '';

                        return obj;
                    });
                });
            }
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
            // group type
            if(d.key === 'group'){
                const parentElm = this.componentDetailPanel.querySelectorAll(`[data-param="${d.key}"]`)[d.index];
                const groupElm = parentElm.querySelector('[data-group-children]');

                d.value.forEach((childData, index) => {
                    let childItem = parentElm.querySelector(`[data-group-item]:nth-child(${index + 1})`);

                    // the child item 2nd, 3rd... is not exist because the BE server only return 1
                    if(!childItem){
                        const item = groupElm.querySelector('[data-group-item]');

                        // new item
                        childItem = UpdateComponentState.cloneDOMComponent(item, this);
                        groupElm.appendChild(childItem);
                    }

                    childData.forEach(d => {
                        childItem
                            .querySelectorAll(`[data-param="${d.key}"]`)[d.index]
                            .querySelector('[data-param-value]').setAttribute('data-param-value', d.value);
                    });
                });

                return;
            }

            // another type
            this.componentDetailPanel
                .querySelectorAll(`[data-param="${d.key}"]`)[d.index]
                .querySelector('[data-param-value]').setAttribute('data-param-value', d.value);
        });
    }

    createJSON(){
        this.jsonElement.value = JSON.stringify(UpdateComponentState.generateDomElementToObject(this.wrapperComponentEl));
    }

    loadComponent(result){
        // get types of component
        this.componentTypes = Array
            .from(
                new Set(result.component
                    .params
                    .map(p => p.type))
            );

        const div = document.createElement('div');
        div.innerHTML = result.data;

        // reset the last one
        this.componentDetailPanel.innerHTML = '';
        this.componentDetailPanel.append(...[...div.children]);
        this.componentDetailPanel.dataset.component = result.component.name;

        // init component script
        if(this.componentTypes.find(t => t === 'text'))
            UpdateComponentState.initWYSIWYGEditor(this.componentDetailPanel.querySelectorAll('#editor-container'), this);
        if(this.componentTypes.find(t => t === 'text-field'))
            UpdateComponentState.initTextField(this.componentDetailPanel.querySelectorAll('[data-type="text-field"]'));

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

    handleAddItemInGroupComponent(target){
        const parent = target.closest('[data-group]');
        const group = parent.querySelector('[data-group-children]');
        const item = group.querySelector('[data-group-item]');

        const newItem = UpdateComponentState.cloneDOMComponent(item, this);
        group.appendChild(newItem);
    }

    handleRemoveItemInGroupComponent(target){
        const item = target.closest('[data-group-item]');
        item.remove();
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

        // add item in group
        const addItemInGroupEl = e.target.closest('button[data-group-add]');

        // remove item in group
        const removeItemInGroupEl = e.target.closest('button[data-group-remove]');

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
        }

        // add item in group component type
        else if(addItemInGroupEl){
            functionForHandling = this.handleAddItemInGroupComponent.bind(this);
            target = addItemInGroupEl;
        }

        // remove item in group component type
        else if(removeItemInGroupEl){
            functionForHandling = this.handleRemoveItemInGroupComponent.bind(this);
            target = removeItemInGroupEl;
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}
