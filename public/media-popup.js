class Image{
    constructor(imageObject, isRadio = false){
        this.src = imageObject.url.small;
        this.title = imageObject.title;
        this.isRadio = isRadio;
        this.domElement = this.getDOMElement();
    }

    getDOMElement(){
        const domEl = document.createElement('div')

        domEl.innerHTML = `
<label>
    <input type="${this.isRadio ? 'radio' : 'checkbox'}" name="selected-image">
    <div class="single-image img-wrapper-cover" data-media-image>
        <img src="${this.src}" alt="${this.title}" />
    </div>
</label>
        `;

        domEl.classList.add('single-image-wrapper');
        domEl.setAttribute('data-media-item', '')

        return domEl
    }
}

document.querySelectorAll('[data-pb-component-popup]').forEach(wrapper => {
    function handleWrapperClick(e) {
        let functionHandling = () => {
        };

        const showMediaBtnEl = e.target.closest('[data-add-media-btn]');
        const uploadMediaBtnEl = e.target.closest('[data-save-media-btn]');

        if (showMediaBtnEl) {
            functionHandling = showAllMediaFile;
        }
        if (uploadMediaBtnEl) {
            functionHandling = uploadMediaFile;
        }

        functionHandling();
    }

    function showAllMediaFile() {
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
                result.data.forEach(d => {
                    const image = new Image(d, false);
                    wrapper.querySelector('[data-media-list]').appendChild(image.domElement);
                });
            })
            .catch(err => console.error(err));
    }

    function uploadMediaFile() {
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