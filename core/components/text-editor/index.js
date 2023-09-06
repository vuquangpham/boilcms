const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');

class TextEditor extends Component{
    constructor(){
        super({
            name: 'text-editor',
            title: 'Text Editor',
            description: 'WYSIWYG content',
            params: [
                {
                    type: ComponentController.paramTypes.TEXT,
                    heading: 'Content',
                    paramName: 'content',
                    classesName: 'content-class'
                },
            ],
        });
    }

    render(data){
        return `<div>Text Editor</div>`;
    }
}

module.exports = new TextEditor();