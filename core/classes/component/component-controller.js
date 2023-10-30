const path = require("path");
const {CORE_DIRECTORY} = require("../../utils/config.utils");
const Controller = require('../utils/controller');

class ComponentController extends Controller{
    constructor(){
        super();

        // get instances
        this.init(path.join(CORE_DIRECTORY, 'components'));

        // params
        this.paramTypes = {
            TEXT: 'text',
            IMAGE: 'image',
            TEXT_FIELD: 'text-field'
        };
    }

    getComponentBasedOnName(name){
        return this.instances.find(i => i.name === name);
    }

    generateUID(){
        return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
    }

    validateParam(params){
        const defaultParam = {
            type: this.paramTypes.TEXT,
            heading: '',
            paramName: '',
            classesName: 'col-12',
            options: '',
            description: ''
        };

        return params.map(p => {
            // has params inside
            if(p.params){
                p.params = this.validateParam(p.params);
            }

            return {...defaultParam, ...p};
        });
    }

    getHTML(instance){
        // import package
        const Content = require('../utils/content');

        if(!instance) return Promise.reject('Not existed!');

        const directory = path.join(CORE_DIRECTORY, 'views', 'core-component-type');
        let htmlPromises = [];

        // validate params
        const validatedParams = this.validateParam(instance.params);

        validatedParams.forEach(param => {
            // group type
            if(param.type === 'group'){
                const itemId = this.generateUID();

                const promise = new Promise((resolve, reject) => {
                    const html = `
<div data-type="group" data-param="group" data-id="${this.generateUID()}" data-group>
    <div data-group-children data-eta>
        <div data-group-item data-item-id="${itemId}" class="ps-relative">
            <div data-eta-receiver="${itemId}">
                #REPLACE
                <button type="button" data-group-remove>Delete</button>
            </div>
            <button type="button" class="ps-absolute t0 r0" data-eta-trigger="${itemId}">Collapse</button>
        </div>
    </div>
    <button type="button" data-group-add>Add</button>
</div>`;

                    const promises = param.params.map(p => Content.getHTML(path.join(directory, p.type + '.ejs'), p));

                    Promise.all(promises)
                        .then(data => resolve(html.replace('#REPLACE', data.join(''))))
                        .catch(err => {
                            console.log(err);
                            reject('');
                        });
                });
                htmlPromises.push(promise);

            }else{
                htmlPromises.push(Content.getHTML(path.join(directory, param.type + '.ejs'), param));
            }
        });

        return new Promise(resolve => {
            Promise.all(htmlPromises)
                .then(html => {
                    resolve(html.join('').trim());
                });
        });
    }
}

module.exports = new ComponentController();