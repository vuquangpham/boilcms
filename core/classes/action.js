class Action{
    constructor() {
        this.actions = [
            {
                type: 'default',
                filename: 'index'
            },
            {
                type: 'add',
                filename: 'detail'
            },
            {
                type: 'edit',
                filename: 'detail'
            }
        ]
    }
    getActionType(type){
        return this.actions.find(t => t.type === type)
    }

    /**
     * Validate action
     * @param action {string}
     * @return
     */
    isValidAction(action){
        return this.actions.find(t => t.type === action.toLowerCase().trim()) !== undefined
    }
}
module.exports = new Action()