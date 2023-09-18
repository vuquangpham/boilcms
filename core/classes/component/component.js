class Component{
    constructor(config){
        const {name, title, description, params} = this.validateConfig(config);
        this.name = name;
        this.title = title;
        this.description = description;
        this.params = params;
        this.order = config.order ?? 0;
    }

    validateConfig(config){
        return config;
    }

    render(data){
    }
}

module.exports = Component;