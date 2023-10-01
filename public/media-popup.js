document.querySelectorAll('[data-pb-component-popup]').forEach(wrapper => {
    const domElements = {
        image: wrapper.querySelector('[data-media-img]')
    };

    // console.log('media',wrapper.querySelector('[data-media-img]'))
    function handleWrapperClick(e){
        let functionHandling = () => {
        }, target = null;
        const showMediaBtnEl = e.target.closest('[data-add-media-btn]');
        const uploadMediaBtnEl = e.target.closest('[data-save-media-btn]');
        const inputMediaEl = e.target.closest('[data-input-media]');

        if(showMediaBtnEl){
            functionHandling = showAllMediaFile;
            target = showMediaBtnEl;
        }
        if(uploadMediaBtnEl){
            functionHandling = uploadMediaFile;
        }

        functionHandling(target);
    }

    function showAllMediaFile(target){
        const urlObject = new URL(location.href);
        const url = urlObject.origin;
        const adminPort = urlObject.pathname.split('/')[1];
        fetch(url + '/' + adminPort + '/media' + '?' + new URLSearchParams({
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

    function uploadMediaFile(target){
        const saveMedia = wrapper.querySelector('[data-save-media-btn]');
        const inputMedia = wrapper.querySelector('[data-input-media]');

        const urlObject = new URL(location.href);
        const url = urlObject.origin;
        const adminPort = urlObject.pathname.split('/')[1];
        // Lấy tệp từ input

        const selectedFile = inputMedia.files[0];

        if(!selectedFile){
            console.error("Không có tệp nào được chọn.");
            return;
        }

        const formData = new FormData(inputMedia.closest('.form-load-image-content'));

        fetch('http://localhost:3000/boiler-admin/media?method=post&action=add&getJSON=true', {
            method: 'POST',
            body: formData
        })
            .then(res => console.log(res))
            // .then(result => console.log(result))
            .catch(err => console.error(err));
    }

    function addMediaFile(){
        const inputMedia = wrapper.querySelector('[data-input-media]');
        const testMedia = wrapper.querySelector('[data-preview-media]');
        if(inputMedia.files && inputMedia.files[0]){
            console.log(inputMedia.files[0]);
            const reader = new FileReader();
            reader.onload = function(e){
                console.log(e.target);
                testMedia
                    .setAttribute('src', e.target.result);
            };
            // console.log(domEl.input.files[0])
            reader.readAsDataURL(inputMedia.files[0]);
        }
    }


    wrapper.addEventListener('click', handleWrapperClick);
    wrapper.addEventListener('change', addMediaFile);
});