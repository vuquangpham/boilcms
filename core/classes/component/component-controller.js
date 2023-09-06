const Content = require('../utils/content');
const path = require("path");
const fs = require('fs');
const {CORE_DIRECTORY} = require("../../utils/configs");

class ComponentController{
    constructor(){
        this.paramTypes = {
            TEXT: 'text.ejs',
            IMAGE: 'image.ejs'
        };
        this.instances = [];

        // get instances
        this.init();
    }

    init(){
        const directory = path.join(CORE_DIRECTORY, 'components');
        fs.readdir(directory, (err, fileNames) => {
            if(err){
                console.error(err);
                return;
            }

            // add to instances
            fileNames.forEach(file => this.instances.push(require(path.join(directory, file))));
        });

    }

    register(config){
        const defaultConfig = {
            name: 'sample-component',
            title: 'Sample Component',
            description: '',
            params: [
                {
                    type: '',
                    heading: '',
                    paramName: '',
                    classesName: '',
                    description: ''
                }
            ]
        };

        // validate
        this.instances.push(config);
        return config;
    }

    getComponentBasedOnName(name){
        return this.instances.find(i => i.name === name);
    }

    getHTML(instance){
        if(!instance) return Promise.reject('Not existed!');

        const directory = path.join(process.cwd(), 'core', 'views', 'core-component-type');
        let htmlPromises = [];

        instance.params.forEach(param => {
            htmlPromises.push(Content.getHTML(path.join(directory, param.type), {
                classesName: param.className,
                description: param.description
            }));
        });

        return new Promise(resolve => {
            Promise.all(htmlPromises)
                .then(html => {
                    resolve(html);
                });
        });
    }
}

module.exports = new ComponentController();