import fetch from "@global/fetch";

class Image{
    constructor(imageObject, isRadio = false){
        this.src = imageObject.url.small;
        this.name = imageObject.name;
        this.id = imageObject._id;
        this.isRadio = isRadio;
        this.domElement = this.getDOMElement();
    }

    getDOMElement(){
        const domEl = document.createElement('div');

        domEl.innerHTML = `
<button type="button" data-media><label>
    <input type="${this.isRadio ? 'radio' : 'checkbox'}" value="${this.id}" name="selected-media">
    <div class="single-image img-wrapper-cover t" data-media-item>
        <img src="${this.src}" alt="${this.name}" />
    </div>
</label></button>`;

        return domEl.firstElementChild;
    }
}

export default class MediaPopup{
    constructor(wrapper){
        this.wrapper = wrapper;

        // dom elements
        this.elements = {
            mediaList: null
        };

        // flag
        this.isSingleImage = false;

        // fetch URL
        const urlObject = new URL(location.href);
        const baseUrl = urlObject.origin;
        const adminPath = urlObject.pathname.split('/')[1];
        this.FETCH_URL = baseUrl + '/' + adminPath + '/media';
    }

    loadAllMedias(target){
        // selected media
        const mediaValueOnParam = target.closest('[data-param]').querySelector('[data-param-value]').getAttribute('data-param-value');
        const selectedMedias = mediaValueOnParam ? JSON.parse(mediaValueOnParam) : [];

        // re-assign dom element and clear the previous list
        this.elements.mediaList = target.closest('[data-param]').querySelector('[data-media-list]');
        this.elements.mediaList.innerHTML = '';

        // check type of image element (single or multiple)
        const typeOfImage = target.closest('[data-type="image"]').getAttribute('data-options');
        this.isSingleImage = typeOfImage === 'single-image';

        fetch(this.FETCH_URL, {
            method: 'get',
            action: 'get',
            getJSON: true
        })
            .then(res => res.json())
            .then(result => {
                let notHaveCheckedImage = false;

                // append images to the DOM
                const data = result.data;
                data.map(d => new Image(d, this.isSingleImage))
                    .forEach(d => this.elements.mediaList.appendChild(d.domElement));

                selectedMedias.forEach(id => {
                    const element = this.elements.mediaList.querySelector(`input[name="selected-media"][value="${id}"]`);
                    if(element) return element.checked = true;

                    // flag for showing the error with the default image
                    notHaveCheckedImage = true;
                });

                if(notHaveCheckedImage){
                    const errorDiv = document.createElement('div');
                    errorDiv.classList.add('description', 'error');
                    errorDiv.innerHTML = "The chosen image has been deleted. Please upload or select the other one!";
                    this.elements.mediaList.insertAdjacentElement('beforeend', errorDiv);
                }
            });
    }

    loadMediaById(id){
        return new Promise((resolve, reject) => {
            fetch(this.FETCH_URL, {
                method: 'get',
                action: 'edit',
                id,
                getJSON: true
            })
                .then(res => res.json())
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }

    /**
     * Submitting the form for adding the new image
     * */
    handleSubmitForm(e){
        e.preventDefault();

        // re-assign the dom
        this.elements.mediaNameInput = this.elements.popupForm.querySelector('[data-media-name]');
        this.elements.replaceMediaInput = this.elements.popupForm.querySelector('[data-add-media]');

        // the input doesn't exist
        if(!this.elements.replaceMediaInput.files || !this.elements.replaceMediaInput.files[0]) return;

        const formData = new FormData();
        formData.append('name', this.elements.mediaNameInput.value);
        formData.append('image', this.elements.replaceMediaInput.files[0]);

        fetch(this.FETCH_URL, {
            method: 'post',
            action: 'add',
            getJSON: true,
        }, {
            method: 'post',
            body: formData
        })
            .then(res => res.json())
            .then((result) => {
                const image = new Image(result, this.isSingleImage);

                // re-assign dom element and clear the previous list
                this.elements.mediaList = this.wrapper.querySelector('[data-media-list]');
                this.elements.mediaList.appendChild(image.domElement);
            })
            .catch(err => console.error(err));
    }

    /**
     * Load Preview Medias
     * */
    loadPreviewMedias(wrapper, urls){
        const selectedMediaEl = wrapper.querySelector('[data-selected-medias]');
        selectedMediaEl.innerHTML = urls.map(url => {
            return `
<div data-selected-media-item class="img-wrapper-cover ar-1">
     <img src="${url}" alt="selected-media">       
</div>
            `;
        }).join('');
    }

    handleAfterSelectedMedias(target){
        const wrapper = target.closest('[data-type]');
        const mediaElements = Array.from(wrapper.querySelectorAll('input[name="selected-media"]'));

        const selectedMedias = mediaElements
            .filter(c => c.checked)
            .map(c => c.value);

        const selectedMediaElements = mediaElements.filter(mediaEl => mediaEl.checked);

        // medias id
        const selectedMediasId = selectedMediaElements.map(c => c.value);

        // medias url
        const selectedMediasURL = selectedMediaElements.map(c => c.closest('button').querySelector('img').src);

        // load media to the components
        this.loadPreviewMedias(wrapper, selectedMediasURL);

        // save to the attribute
        target.closest('[data-param]')
            .querySelector('[data-param-value]')
            .setAttribute('data-param-value', JSON.stringify(selectedMediasId));
    }

    toggleCustomPopup(popupContent){
        popupContent.classList.toggle('active');
    }

    isMediaPopup(e){
        let target = null,
            functionForHandling = () => {
            };

        const loadMediaButton = e.target.closest('[data-load-media]');
        const mediaForm = e.target.closest('[data-media-form]');
        const saveMediaButton = e.target.closest('[data-save-media]');

        // popup
        const toggleButton = e.target.closest('[data-custom-toggle]');

        if(toggleButton){
            const id = toggleButton.getAttribute('data-custom-toggle');
            const popupContent = document.querySelector(`[data-custom-toggle-content="${id}"]`);
            this.toggleCustomPopup(popupContent);
        }

        if(loadMediaButton){
            functionForHandling = this.loadAllMedias.bind(this);
            target = loadMediaButton;
        }

        // add new media
        else if(mediaForm && !this.elements.popupForm){
            this.elements.popupForm = mediaForm;
            mediaForm.addEventListener('submit', this.handleSubmitForm.bind(this));
        }

        // save media
        else if(saveMediaButton){
            functionForHandling = this.handleAfterSelectedMedias.bind(this);
            target = saveMediaButton;
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}