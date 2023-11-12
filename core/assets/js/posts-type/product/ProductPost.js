import fetch from "../../../../../assets/js/fetch";

export default class ProductPost {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {
            productAttributes: wrapper.querySelector('[data-product-attributes]'),
            taxonomyProductAttributes: wrapper.querySelector('[data-taxonomy]'),
            testAttributes: wrapper.querySelector('[data-single-attribute]')
        }

        this.attributeIndex = 1;

        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this))
    }

    handleAddNewAttribute() {

        // create child
        const newAttribute = document.createElement('div');
        newAttribute.innerHTML = this.elements.testAttributes.outerHTML
        newAttribute.setAttribute('data-taxonomy', '')
        newAttribute.setAttribute('data-attribute-number', this.attributeIndex)

        // replace input, textarea name by the increasing index
        newAttribute.querySelectorAll('input, textarea').forEach(
            input => {
                input.name = input.name.replace(/\[\d+]/, '[' + this.attributeIndex + ']');

            }
        )

        this.elements.productAttributes.appendChild(newAttribute)

        // increase index
        this.attributeIndex++
    }

    handleWrapperClick(e) {
        let functionHandling = () => {
        }
        let target = null

        const addNewAttributeBtnEl = e.target.closest('button[data-add-new-attribute]')

        if (addNewAttributeBtnEl) {
            functionHandling = this.handleAddNewAttribute.bind(this)
            target = addNewAttributeBtnEl
        }

        functionHandling(target)
    }
}