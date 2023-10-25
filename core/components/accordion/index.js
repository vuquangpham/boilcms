const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');

class Accordion extends Component{
    constructor(){
        super({
            name: 'accordion',
            title: 'Accordion',
            description: 'Accordion with WYSIWYG Content',
            params: [
                {
                    type: ComponentController.paramTypes.TEXT,
                    heading: 'Content',
                    paramName: 'content',
                    classesName: 'content-class'
                },
                {
                    type: 'group',
                    heading: 'Group',
                    paramName: 'group',
                    classesName: 'group-class',
                    params: [
                        {
                            type: ComponentController.paramTypes.TEXT_FIELD,
                            heading: 'Heading',
                            paramName: 'heading',
                            classesName: 'heading-class'
                        },
                        {
                            type: ComponentController.paramTypes.TEXT,
                            heading: 'Text',
                            paramName: 'text',
                            classesName: 'text-class'
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

module.exports = new Accordion();