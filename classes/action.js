class Action{
    constructor() {
        this.actions = ['get', 'add', 'edit', 'post'];
    }

    /**
     * Validate action
     * @param action {string}
     * @return
     */
    isValidAction(action){
        return this.actions.includes(action.trim().toLowerCase())
    }
}
module.exports = new Action()