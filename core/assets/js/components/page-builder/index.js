import ModifyComponent from "./ModifyComponent";

export default class PageBuilder{
    constructor(wrapper){
        // invalid element
        if(!wrapper) return;
        this.wrapper = wrapper;

        // handlers
        this.modifyHandlers = new ModifyComponent(wrapper);

        // register event
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));
    }

    handleWrapperClick(e){
        // get the target
        let functionForHandling = () => {
        }, target = null;

        // modify handler
        const modifyHandlers = this.modifyHandlers.isModifyHandler(e);
        if(modifyHandlers !== null){
            functionForHandling = modifyHandlers.functionForHandling;
            target = modifyHandlers.target;
        }

        // media popup

        // invoked the function
        functionForHandling(target);
    }


}