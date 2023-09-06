class Component{
    constructor(config){
        const {name, title, description, params} = this.validateConfig(config);
        this.name = name;
        this.title = title;
        this.description = description;
        this.params = params;
    }

    validateConfig(config){
        return config;
    }

    render(data){
    }
}

module.exports = Component;