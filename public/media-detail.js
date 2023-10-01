// document.querySelector('.form-image').addEventListener('submit', function (e) {
//     e.preventDefault(); // Ngăn chặn form gửi lại trang
//
//     // const formData = new FormData(this)
//     const formData = new FormData(); // Lấy dữ liệu form từ sự kiện submit
//     formData.append('file', document.querySelector('[data-input-test]').files[0]);
//
//     // Log dữ liệu form
//     formData.forEach((value, key) => {
//         console.log(key, value);
//     });
//     console.log(formData.get('file'))
//     fetch('http://localhost:3000/boiler-admin/media?method=post&action=add&getJSON=true',{
//         method: 'POST',
//         body: formData
//     })
//         .then(response => {
//             // Kiểm tra xem phản hồi có chứa JSON hay không
//             const contentType = response.headers.get('content-type');
//             if (contentType && contentType.includes('application/json')) {
//                 return response.json(); // Phản hồi là JSON, sử dụng .json()
//             } else {
//                 return response.text(); // Phản hồi không phải JSON, sử dụng .text()
//             }
//         })
//         .then(data => {
//             console.log(data); // In ra nội dung của phản hồi
//         })
//         .catch(err => console.error(err))
// });
document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => {

    const domEl = {
        image: wrapper.querySelector('[data-media-image]'),
        name: wrapper.querySelector('[data-media-name]'),
        url: wrapper.querySelector('[data-media-url]'),
        input: wrapper.querySelector('[data-input-media]'),
        replace: wrapper.querySelector('[data-replace-media]'),
        inner: wrapper.querySelector('[data-popup-inner]'),
        item: wrapper.querySelector('[data-media-item]'),
        img: wrapper.querySelector('[data-media-img]'),
        directory: wrapper.querySelector('[data-directory]')
    }

    function handleShowPopup(target) {
        const id = target.dataset.id
        const urlObject = new URL(location.href);
        const url = urlObject.origin + urlObject.pathname;
        // console.log(domEl.img.src)
        // console.log('id: ', id, 'urlObject: ', urlObject, 'url: ', url)

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

    function handleDeleteMedia() {

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

    function handleSaveImage(target) {
        const id = domEl.inner.dataset.id;
        const urlObject = new URL(location.href)
        const url = urlObject.origin + urlObject.pathname

        // console.log('inputFile', domEl.input.files[0])
        // console.log(wrapper.querySelector('[data-form]'))
        let formData = new FormData(wrapper.querySelector('[data-form]'))
        formData.append('name', domEl.name.value)
        formData.append('image', domEl.input.files[0])
        formData.append('url', domEl.url.href)
        // if (domEl.input.files[0]) {
        //     console.log('123')
        // }
        // console.log(domEl.name.value)
        // console.log('form data: ',formData)
        // for (let [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }
        fetch(url + '?' + new URLSearchParams({
            method: 'post',
            action: 'edit',
            getJSON: true,
            id: id
        }), {
            method: 'post',
            body: (formData)
        })
            // .then(res => res.json())
            .then(res => {
                // console.log('res: ', res)
                const mediaItem = document.querySelector(`[data-media-item][data-id="${id}"]`)
                if (mediaItem) {
                    const mediaImage = mediaItem.querySelector('[data-media-img]')
                    if (mediaImage && domEl.input.files[0]) {
                        // mediaImage.src = URL.createObjectURL(domEl.input.files[0])
                        mediaImage.src = urlObject.origin + domEl.directory
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
        const mediaImageEl = e.target.closest('[data-media-image]')

        if (showPopupEl) {
            functionHandling = handleShowPopup;
            target = showPopupEl
        } else if (mediaImageEl) {
            // console.log('media click', domEl.input)
            functionHandling = domEl.input.click.bind(domEl.input);
        } else if (saveMediaBtnEl) {
            functionHandling = handleSaveImage;
        }
        functionHandling(target)
    }

    wrapper.addEventListener('click', handleWrapperClick)
    wrapper.addEventListener('change', handleReplaceImage)

})