const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');

const Media = require('../../categories/media');

class ImageContent extends Component{
    constructor(){
        super({
            name: 'image-content',
            title: 'Image Content',
            description: 'WYSIWYG content and image',
            params: [
                {
                    type: ComponentController.paramTypes.TEXT,
                    heading: 'Content',
                    paramName: 'content',
                    classesName: 'content-class'
                },
                {
                    type: ComponentController.paramTypes.TEXT_FIELD,
                    heading: 'Text',
                    paramName: 'text',
                    classesName: 'text-class'
                },
                {
                    type: ComponentController.paramTypes.IMAGE,
                    heading: 'Image',
                    paramName: 'image',
                    classesName: 'image-class'
                },
                {
                    type: 'group',
                    heading: 'Group',
                    paramName: 'group',
                    classesName: 'group-class',
                    params: [
                        {
                            type: ComponentController.paramTypes.TEXT_FIELD,
                            heading: 'Text',
                            paramName: 'text',
                            classesName: 'text-class'
                        },
                        {
                            type: ComponentController.paramTypes.IMAGE,
                            heading: 'Image',
                            paramName: 'image',
                            classesName: 'image-class'
                        },
                    ]
                }
            ],
        });
    }

    async render(data){
        const params = data.params;
        const imagesData = JSON.parse(params.find(p => p.key === 'image').value);

        const promises = [];
        imagesData.forEach(id => {
            promises.push(Media.getDataById(id));
        });

        // load all images
        const images = await Promise.all(promises);
        const imagesHTML = images.map(i => {
            const url = i.url.original;
            return `
                <div>
                    <img src="${url}" alt="${i.name}">            
                </div>`;
        }).join('');

        return `<div>Image content</div><div>${imagesHTML}</div>`;
    }
}

module.exports = new ImageContent();