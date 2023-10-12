document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => {
    const domEl = {
        nameMedia: wrapper.querySelector('[data-media-name]'),
        urlMedia: wrapper.querySelector('[data-media-url]'),
        inputMedia: wrapper.querySelector('[data-input-media]'),
        inner: wrapper.querySelector('[data-popup-inner]'),


        // preview media
        mediaItem: wrapper.querySelector('div[data-media-item]'),
        mediaImage: wrapper.querySelector('div[data-media-item] img'),

        // popup
        popupForm: wrapper.querySelector('[data-media-form]'),
        closePopupForm: wrapper.querySelector('[data-media-close-btn]'),

        // input field
        mediaName: wrapper.querySelector('[data-media-name]'),
        mediaURL: wrapper.querySelector('[data-media-url]'),

        // replace image input
        replaceMediaInput: wrapper.querySelector('[data-media-replace]')
    };
    const domElements = domEl;

    // vars
    const urlObject = new URL(location.href);
    const FETCH_URL = urlObject.origin + urlObject.pathname;

    /**
     * Replace media item in popup
     * */
    const replaceMediaItem = (data) => {
        // set the id for the form
        domElements.popupForm.dataset.id = data._id;

        // change the media
        domElements.mediaImage.src = data.url.original;
        domElements.mediaImage.alt = data.name;

        // change the input of the form
        domElements.mediaName.value = data.name;
        domElements.mediaURL.href = data.url.original;
        domElements.mediaURL.textContent = data.url.original;
    };

    /**
     * Show single media item
     * */
    const showSingleMediaItem = (target) => {
        const id = target.dataset.id;

        // add loading class (for toggling the old image)
        domElements.mediaItem.classList.add('loading');

        // get detail media
        // method: get, action on page edit to get detail page
        fetch(FETCH_URL + '?' + new URLSearchParams({
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        }))
            .then(res => res.json())
            .then(result => replaceMediaItem(result.data))

            // catch the error
            .catch(err => console.error(err))

            // remove the loading
            .finally(() => {
                domElements.mediaImage.onload = () => {
                    domElements.mediaItem.classList.remove('loading');
                };
            });
    };

    /**
     * Delete media item
     * */
    const handleDeleteMedia = (target) => {
        const formEl = target.closest('[data-media-form]');
        const id = formEl.getAttribute('data-id');

        fetch(FETCH_URL + '?' + new URLSearchParams({
            action: 'delete',
            method: 'post',
            getJSON: true,
            id: id
        }))
            .then(() => {
                // get deleted media item and remove the dom
                const deletedMediaItem = wrapper.querySelector(`button[data-media-item][data-id="${id}"]`);
                if(deletedMediaItem) deletedMediaItem.remove();

                // close the popup
                domElements.closePopupForm.click();
            })
            .catch(err => console.error(err));
    };

    /**
     * Handle save media
     * */
    function handleSaveMedia(target){
        const formEl = target.closest('[data-media-form]');
        const id = formEl.getAttribute('data-id');

        const formData = new FormData();
        formData.append('name', domElements.nameMedia.value);
        formData.append('image', domElements.replaceMediaInput.files[0]);

        fetch(FETCH_URL + '?' + new URLSearchParams({
            method: 'post',
            action: 'edit',
            getJSON: true,
            id: id
        }), {
            method: 'post',
            body: formData
        })
            .then(res => res.json())
            .then((result) => {
                const mediaItemEl = wrapper.querySelector(`[data-media-item][data-id="${id}"] img`);
                if(!mediaItemEl){
                    console.error('Can not find an image with id', id);
                    return;
                }

                // update the new media
                mediaItemEl.src = result.url.small;
                mediaItemEl.alt = result.name;

                // close the popup
                domElements.closePopupForm.click();
            })
            .catch(err => console.error(err));
    }

    /**
     * Replace input change handler
     * */
    const handleReplaceInputChange = () => {
        // the input doesn't exist
        if(!domElements.replaceMediaInput.files || !domElements.replaceMediaInput.files[0]) return;

        // read uploaded file
        const reader = new FileReader();
        reader.onload = (e) => {
            domElements.mediaImage.setAttribute('src', e.target.result.toString());
        };
        reader.readAsDataURL(domElements.replaceMediaInput.files[0]);
    };

    function handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        const singleMediaItemEL = e.target.closest('button[data-media-item]');
        const deleteBtnEl = e.target.closest('[data-media-delete-btn]');
        const saveMediaBtnEl = e.target.closest('[data-media-save-btn]');

        // show single media item
        if(singleMediaItemEL){
            functionHandling = showSingleMediaItem;
            target = singleMediaItemEL;
        }

        // save media
        else if(saveMediaBtnEl){
            functionHandling = handleSaveMedia;
            target = saveMediaBtnEl;
        }

        // delete media
        else if(deleteBtnEl){
            functionHandling = handleDeleteMedia;
            target = deleteBtnEl;
        }

        // call the function
        functionHandling(target);
    }

    // handle click action
    wrapper.addEventListener('click', handleWrapperClick);

    // handle replace media
    domElements.replaceMediaInput.addEventListener('change', handleReplaceInputChange);
});