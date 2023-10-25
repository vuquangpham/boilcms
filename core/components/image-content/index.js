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
        console.log(params);

        return `<div>Image content</div>`;
    }
}

module.exports = new ImageContent();