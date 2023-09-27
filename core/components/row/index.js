const Component = require('../../classes/component/component');

class Row extends Component{
    constructor(){
        super({
            name: 'row',
            title: 'Row',
            description: 'Wrapper for elements',
            params: [],
            order: -1
        });
    }

    render(data){
        return `<div class="row" data-component-wrapper>#{DATA_CHILDREN}</div>`;
    }
}

module.exports = new Row();