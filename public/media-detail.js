document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => {

    const domEl = {
        image: wrapper.querySelector('[data-preview-media]'),
        name: wrapper.querySelector('[data-media-name]'),
        url: wrapper.querySelector('[data-media-url]'),
        input: wrapper.querySelector('[data-input-media]'),
        inner: wrapper.querySelector('[data-popup-inner]'),
    }
    const findMediaByID = (id) => {
        const urlObject = new URL(location.href)
        const url = urlObject.origin + urlObject.pathname

        return fetch(url + '?' + new URLSearchParams({
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        }), {
            method: 'get'
        })
            .then(res => res.json())
            .then(result => result.data.url.small)
            .catch(err => console.error(err))
    }

    function handleShowPopup(target) {
        const id = target.dataset.id
        const urlObject = new URL(location.href);
        const url = urlObject.origin + urlObject.pathname;

        document.querySelector('[data-image-loading]').classList.add('loading')

        fetch(url + '?' + new URLSearchParams({
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        }))
            .then(res => res.json())
            .then(result => {
                domEl.inner.dataset.id = id;
                domEl.inner.dataset.directory = result.data.directory
                domEl.image.src = result.data.url.small;
                domEl.name.value = result.data.name;
                domEl.url.href = result.data.url.original;
                domEl.url.textContent = result.data.url.original
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                domEl.image.onload = () => {
                    document.querySelector('[data-image-loading]').classList.remove('loading')
                }
            })
    }
    function handleDeleteMedia(target) {
        const media = target.closest('[data-popup-inner]')
        const id = media.getAttribute('data-id')
        const directory = media.getAttribute('data-directory')
        const urlObject = new URL(location.href)
        const url = urlObject.origin + urlObject.pathname



        fetch(url + '?' + new URLSearchParams({
            action: 'delete',
            method: 'post',
            getJSON: true,
            id: id
        }))
            .then(res => {
                console.log('directory: ',directory)
                // fs.rmSync(directory, { recursive: true, force: true });
                const mediaItem = document.querySelector(`[data-media-item][data-id="${id}"]`)
                if(mediaItem){
                    mediaItem.remove()
                    console.log('remove')
                }
                document.querySelector('html').classList.remove('media-is-open')
            })
            .catch(err => console.error(err))

    }
    function handleReplaceMedia() {
        if (domEl.input.files && domEl.input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log(e.target)
                domEl.image
                    .setAttribute('src', e.target.result)
            };
            reader.readAsDataURL(domEl.input.files[0]);
        }
    }

    function handleSaveMedia(target) {
        const id = domEl.inner.dataset.id;
        const urlObject = new URL(location.href)
        const url = urlObject.origin + urlObject.pathname

        let formData = new FormData(wrapper.querySelector('[data-form]'))
        formData.append('name', domEl.name.value)
        formData.append('image', domEl.input.files[0])

        fetch(url + '?' + new URLSearchParams({
            method: 'post',
            action: 'edit',
            getJSON: true,
            id: id
        }), {
            method: 'post',
            body: (formData)
        })
            .then(res => {
                const mediaItem = document.querySelector(`[data-media-item][data-id="${id}"]`)
                if (mediaItem) {
                    const mediaImage = mediaItem.querySelector('[data-media-img]')
                    if (mediaImage && domEl.input.files[0]) {
                        findMediaByID(id)
                            .then(imgUrl => {
                                mediaImage.src = urlObject.origin + imgUrl
                                console.log(mediaImage)
                            })
                            .catch(err => console.error(err))
                    }
                }
                document.querySelector('html').classList.remove('media-is-open')
            })
            .catch(err => console.error(err))
    }

    function handleWrapperClick(e) {
        let functionHandling = () => {
        };
        let target = null;

        const showPopupEl = e.target.closest('[data-media-item]')
        const saveMediaBtnEl = e.target.closest('[data-save-media]')
        const mediaImageEl = e.target.closest('[data-preview-media]')
        const deleteBtnEl = e.target.closest('[data-delete-media-btn]')

        if (showPopupEl) {
            functionHandling = handleShowPopup;
            target = showPopupEl
        } else if (mediaImageEl) {
            functionHandling = domEl.input.click.bind(domEl.input);
        } else if (saveMediaBtnEl) {
            functionHandling = handleSaveMedia;
        } else if (deleteBtnEl){
            functionHandling = handleDeleteMedia;
            target = deleteBtnEl
        }
        functionHandling(target)
    }

    wrapper.addEventListener('click', handleWrapperClick)
    wrapper.addEventListener('change', handleReplaceMedia)

})