document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => {
    const domEl = {
        image: wrapper.querySelector('[data-media-image]'),
        name: wrapper.querySelector('[data-media-name]'),
    }
    console.log(domEl)

    wrapper.addEventListener('click', (e) => {
        // handle show popup
        const target = e.target.closest('.media-item')
        if(!target) return

        // handle replace image
        handleReplaceImage()
        // action: -> find image -> delete directory of the old image -> update folder moi

        // handle delete image
        handleDeleteImage()
        // delete in database & directory

        handleShowPopup()
        const id = target.dataset.id
        const urlObject = new URL(location.href);
        const url = urlObject.origin + urlObject.pathname;

        fetch(url + '?' + new URLSearchParams({
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        }))
            .then(res => res.json())
            .then(result => {
                domEl.image.src = result.data.url.original
            })
    })
})