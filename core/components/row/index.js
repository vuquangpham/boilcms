const Component = require('../../classes/component/component');

class Row extends Component{
    constructor(){
        super({
            name: 'row',
            title: 'Row',
            description: 'Wrapper for elements',
            params: [],
            order: -1,

            // options for ROW
            options: [
                {
                    name: 'Full width section',
                    paramName: 'has-full-width',
                    value: {
                        'No': '',
                        'Yes': 'has-full-width-section'
                    }
                }
            ]
        });
    }

    render(data){
        return `<div class="row" data-component-wrapper>#{DATA_CHILDREN}</div>`;
    }
}

module.exports = new Row();