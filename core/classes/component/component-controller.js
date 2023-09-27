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
            TEXT: 'text.ejs',
            IMAGE: 'image.ejs'
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
            htmlPromises.push(Content.getHTML(path.join(directory, param.type), {
                classesName: param.className,
                description: param.description,
                paramName: param.paramName
            }));
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