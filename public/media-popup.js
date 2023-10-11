document.querySelectorAll('[data-pb-component-popup]').forEach(wrapper => {

    function handleWrapperClick(e) {
        let functionHandling = () => {
        }, target = null;
        const showMediaBtnEl = e.target.closest('[data-add-media-btn]');
        const uploadMediaBtnEl = e.target.closest('[data-save-media-btn]');

        if (showMediaBtnEl) {
            functionHandling = showAllMediaFile;
            target = showMediaBtnEl;
        }
        if (uploadMediaBtnEl) {
            console.log('click')
            functionHandling = uploadMediaFile;
        }

        functionHandling(target);
    }

    function showAllMediaFile(target) {
        const urlObject = new URL(location.href);
        const baseUrl = urlObject.origin;
        const adminPath = urlObject.pathname.split('/')[1];
        fetch(baseUrl + '/' + adminPath + '/media' + '?' + new URLSearchParams({
            method: 'get',
            action: 'get',
            getJSON: true,
        }))
            .then(res => res.json())
            .then(result => {

                const imgElements = [];

                result.data.forEach(d => {
                    const url = d.url.small;
                    const div = document.createElement('div');
                    div.className = 'single-image';
                    const imgElm = document.createElement('img');
                    imgElm.src = url;

                    div.appendChild(imgElm);
                    document.querySelector('.media-item').appendChild(div);
                });

            })
            .catch(err => console.error(err));
    }

    function uploadMediaFile(target) {
        const inputMedia = wrapper.querySelector('[data-input-media]');

        const urlObject = new URL(location.href);
        const baseUrl = urlObject.origin;
        const adminPath = urlObject.pathname.split('/')[1];
        // Get file from input

        const selectedFile = inputMedia.files[0];

        if (!selectedFile) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData(inputMedia.closest('.form-load-image-content'));


        fetch(baseUrl + '/' + adminPath + '/media' + '?' + new URLSearchParams({
            method: 'post',
            action: 'add',
            getJSON: true,
        }), {
            method: 'POST',
            body: formData
        })
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }

    function addMediaFile() {
        const inputMedia = wrapper.querySelector('[data-input-media]');
        const testMedia = wrapper.querySelector('[data-preview-media]');
        if (inputMedia.files && inputMedia.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                testMedia
                    .setAttribute('src', e.target.result);
            };
            reader.readAsDataURL(inputMedia.files[0]);
        }
    }


    wrapper.addEventListener('click', handleWrapperClick);
    wrapper.addEventListener('change', addMediaFile);
});