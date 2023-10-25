import Component from "../component";
import Quill from "quill";

class UpdateComponentState{
    constructor(){
    }

    /**
     * Generate DOM Element to Object
     * @param domElement {HTMLElement}
     * @return {Object}
     * */
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
                const value = JSON.parse(param.querySelector('[data-param-value]').dataset.paramValue);
                const object = {
                    key: param.dataset.param,
                    value: value,
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

    /**
     * Generate Object to DOM Element
     * @param property {Object}
     * @return {HTMLElement}
     * */
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

    cloneDOMComponent(item, context){
        // new item
        const id = item.querySelector('[data-id]')?.getAttribute('data-id');
        let newItemHTML = item.outerHTML;

        if(id) newItemHTML = newItemHTML.replaceAll(id, Date.now().toString());

        const div = document.createElement('div');
        div.innerHTML = newItemHTML;
        const newItem = div.firstElementChild;

        // clear data
        newItem.querySelectorAll('[data-param-value]').forEach(e => e.setAttribute('data-param-value', ''));

        // register type
        newItem.querySelectorAll('[data-type]').forEach(typeEl => {

            const type = typeEl.getAttribute('data-type');
            if(type === 'text-field') this.initTextField([typeEl], true);
            if(type === 'text') this.initWYSIWYGEditor(typeEl.querySelectorAll('#editor-container'), context);
        });

        return newItem;
    }


    /**
     * Init WYSIWYG Editor
     * @param elements {NodeListOf | Array}
     * @param context {Object}
     * @return {void}
     * */
    initWYSIWYGEditor(elements, context){
        // reset editors
        // todo: maybe we will have a bug here @vupham, because of the editors variable
        context.editors = [];

        elements.forEach(editorElement => {

            // init editor
            const editor = new Quill(editorElement, {
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
            editor.on('text-change', () => {
                const value = editorElement.querySelector('.ql-editor').innerHTML;
                editorElement.setAttribute('data-param-value', value);
            });

            context.editors.push(editor);
        });
    }

    /**
     * Init Text Field
     * @param elements {NodeListOf | Array}
     * @param clearLastValue {Boolean}
     * @return {void}
     * */
    initTextField(elements, clearLastValue = false){
        elements.forEach(textField => {
            const previousValueEl = textField.querySelector('[data-param-value]');
            const input = textField.querySelector('input');

            if(clearLastValue) input.value = '';

            input.addEventListener('input', () => {
                previousValueEl.setAttribute('data-param-value', input.value);
            });
        });
    }
}

export default new UpdateComponentState();