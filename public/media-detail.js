document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => {

    const domEl = {
        image: wrapper.querySelector('[data-media-image]'),
        name: wrapper.querySelector('[data-media-name]'),
        url: wrapper.querySelector('[data-media-url]'),
        input: wrapper.querySelector('[data-input-media]'),
        replace: wrapper.querySelector('[data-replace-media]'),
        checkbox: wrapper.querySelector('[data-media-checkbox]'),
        overlay: wrapper.querySelector('[data-popup-overlay]'),
        inner: wrapper.querySelector('[data-popup-inner]'),
        item: wrapper.querySelector('[data-media-item]')
    }

    function handleShowPopup(target) {
        const id = target.dataset.id
        const urlObject = new URL(location.href);
        const url = urlObject.origin + urlObject.pathname;
        console.log('id: ', id, 'urlObject: ', urlObject, 'url: ', url)

        document.querySelector('[data-image-loading]').classList.add('loading')

        fetch(url + '?' + new URLSearchParams({
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        }))
            .then(res => res.json())
            .then(result => {
                // console.log('result: ', result)
                domEl.inner.dataset.id = id;
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

    function handleReplaceImage() {
        if (domEl.input.files && domEl.input.files[0]) {
            domEl.checkbox.checked = true
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log(e.target)
                domEl.image
                    .setAttribute('src', e.target.result)
            };
            // console.log(domEl.input.files[0])
            reader.readAsDataURL(domEl.input.files[0]);
        }
    }

    function handleSaveImage(target) {
        const id = domEl.inner.dataset.id;
        const urlObject = new URL(location.href)
        const url = urlObject.origin + urlObject.pathname

        let formData = new FormData()
        formData.append('name',domEl.name.value)
        formData.append('url',domEl.url.href)
        if(domEl.checkbox.checked && domEl.input.files[0]){
            formData.append('image',domEl.input.files[0])
        }
        fetch(url + '?' + new URLSearchParams({
            method: 'post',
            action: 'edit',
            id: id
        }), {
            method: 'post',
            body: formData
        })
            .then(res => {
                const mediaItem = document.querySelector(`[data-media-item][data-id="${id}"]`)
                if(mediaItem){
                    const mediaImage = mediaItem.querySelector('[data-media-img]')
                    if(mediaImage && domEl.input.files[0]){
                        mediaImage.src = URL.createObjectURL(domEl.input.files[0])
                    }
                }
                document.querySelector('html').classList.remove('media-is-open')
            })
            .catch(err => console.error(err)
    )
    }

    function handleWrapperClick(e) {
        let functionHandling = () => {
        };
        let target = null;

        const showPopupEl = e.target.closest('[data-media-item]')
        const saveMediaBtnEl = e.target.closest('[data-save-media]')
        const mediaImageEl = e.target.closest('[data-media-image]')
        const overlayEl = e.target.closest('[data-popup-overlay]')

        if (showPopupEl) {
            functionHandling = handleShowPopup;
            target = showPopupEl
        } else if (mediaImageEl) {
            console.log('media click', domEl.input)
            functionHandling = domEl.input.click.bind(domEl.input);
        } else if (saveMediaBtnEl) {
            functionHandling = handleSaveImage;
        } else if (overlayEl) {
            domEl.checkbox.checked = false
        }
        functionHandling(target)
    }

    wrapper.addEventListener('click', handleWrapperClick)
    wrapper.addEventListener('change', handleReplaceImage)

})