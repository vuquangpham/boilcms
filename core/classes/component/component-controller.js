const path = require("path");
const {CORE_DIRECTORY} = require("../../utils/config.utils");
const Controller = require('../utils/controller');
const Content = require("../utils/content");

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

    getHTML(instance){
        // import package
        const Content = require('../utils/content');

        if(!instance) return Promise.reject('Not existed!');

        const directory = path.join(CORE_DIRECTORY, 'views', 'core-component-type');
        let htmlPromises = [];

        instance.params.forEach(param => {
            // group type
            if(param.type === 'group'){

                const promise = new Promise((resolve, reject) => {
                    const html = '<div>#REPLACE</div>';

                    const promises = param.params.map(p => Content.getHTML(path.join(directory, p.type + '.ejs'), {
                        classesName: p.className,
                        description: p.description,
                        paramName: p.paramName,
                        type: p.type
                    }));

                    Promise.all(promises)
                        .then(data => resolve(html.replace('#REPLACE', data.join(''))))
                        .catch(err => {
                            console.log(err);
                            reject('');
                        });
                });
                htmlPromises.push(promise);
            }else{
                htmlPromises.push(Content.getHTML(path.join(directory, param.type + '.ejs'), {
                    classesName: param.className,
                    description: param.description,
                    paramName: param.paramName,
                    type: param.type
                }));
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