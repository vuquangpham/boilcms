document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => {
    console.log(wrapper)

    const domEl = {
        image: wrapper.querySelector('[data-media-image]'),
        name: wrapper.querySelector('[data-media-name]'),
        url: wrapper.querySelector('[data-media-url]'),
        input: wrapper.querySelector('[data-input-media]'),
        replace: wrapper.querySelector('[data-replace-media]')
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
                // console.log('result: ', result)
                console.log('update src')
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
            const reader = new FileReader();
            reader.onload = function (e) {
                domEl.image
                    .setAttribute('src', e.target.result)
            };
            // console.log(domEl.input.files[0])
            reader.readAsDataURL(domEl.input.files[0]);
        }
    }

    function handleWrapperClick(e) {
        let functionHandling = () => {
        };
        let target = null;

        const showPopupEl = e.target.closest('[data-media-item]')
        // const replaceBtnEl = e.target.closest('[data-replace-media]')
        const saveMediaBtnEl = e.target.closest('[data-save-media]')
        const mediaImageEl = e.target.closest('[data-media-image]')

        if (showPopupEl) {
            functionHandling = handleShowPopup;
            target = showPopupEl
        } else if (mediaImageEl) {
            console.log('media click', domEl.input)
            functionHandling = domEl.input.click.bind(domEl.input);
        }
        functionHandling(target)
    }

    wrapper.addEventListener('click', handleWrapperClick)
    wrapper.addEventListener('change', handleReplaceImage)

})