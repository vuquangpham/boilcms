const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');
const Media = require("../../categories/media");

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

        let groupHTML = '';

        // content
        const content = params.find(p => p.key === 'content');

        // group
        const group = params.find(p => p.key === 'group').value;
        group.forEach(p => {
            const heading = p.find(p => p.key === 'heading').value;
            const text = p.find(p => p.key === 'text').value;

            groupHTML += `
<div class="item">
    <div class="heading">${heading}</div>
    <div class="text">${text}</div>
</div>
            `;
        });

        return `
<div class="accordion">
    <div class="heading">${content.value}</div>
    <div class="group">${groupHTML}</div>
</div>`;
    }
}

module.exports = new Accordion();