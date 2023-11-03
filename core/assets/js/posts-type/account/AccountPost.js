import fetch from "@global/fetch";

export default class AccountPost {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {

            // popup form
            closePopupForm: wrapper.querySelector('[data-account-close-btn]'),

            // input fields
            currentPasswordInput: wrapper.querySelector('[data-current-password]'),
            passwordInput: wrapper.querySelector('[data-password]'),
            confirmPasswordInput: wrapper.querySelector('[data-confirm-password]')
        }

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + '/boiler-admin/user';

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this))
    }

    handleShowAccountPopup() {

        // clear input when show account popup
        this.elements.currentPasswordInput = '';
        this.elements.passwordInput = '';
        this.elements.confirmPasswordInput = '';
    }

    handleUpdatePasswordAccount(target) {

        const formEl = target.closest('[data-account-form]');
        const id = formEl.getAttribute('data-id');

        const formData = new FormData();
        formData.append('currentPassword', this.elements.currentPasswordInput.value);
        formData.append('password', this.elements.passwordInput.value);
        formData.append('confirmPassword', this.elements.confirmPasswordInput.value);

        fetch(this.FETCH_URL, {
            method: 'post',
            action: 'edit',
            getJSON: true,
            id: id
        }, {
            method: 'post',
            body: formData
        })
            .then((result) => {

                // close the popup
                this.elements.closePopupForm.click();
            })
            .catch(err => console.error(err));
    }

    handleWrapperClick(e) {
        let functionHandling = () => {
        };
        let target = null;

        const updatePasswordBtnEl = e.target.closest('button[data-account-password-update-btn]')

        if (updatePasswordBtnEl) {
            functionHandling = this.handleUpdatePasswordAccount.bind(this)
            target = updatePasswordBtnEl
        }

        // call the function
        functionHandling(target)
    }
}