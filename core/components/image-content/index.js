const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');

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
                    classesName: 'content-class',
                    description: 'WYSIWYG Content'
                },
                {
                    type: ComponentController.paramTypes.IMAGE,
                    heading: 'Image',
                    paramName: 'image',
                    classesName: 'image-class',
                    options: 'single-image',
                    description: 'Please select single image'
                },
            ],
        });
    }

    async render(data){
        const params = data.params;

        return `<div>Image content</div>`;
    }
}

module.exports = new ImageContent();