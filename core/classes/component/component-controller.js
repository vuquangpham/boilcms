const path = require("path");
const fs = require('fs');
const {CORE_DIRECTORY} = require("../../utils/config.utils");

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
            this.instances.sort((a, b) => a.order - b.order);
        });
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