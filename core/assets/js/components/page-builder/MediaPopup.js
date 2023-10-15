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
        domEl.setAttribute('data-media', '');

        domEl.innerHTML = `
<button style="border:none;" type="button"><label>
    <input type="${this.isRadio ? 'radio' : 'checkbox'}" value="${this.id}" name="selected-image">
    <div class="single-image img-wrapper-cover t" data-media-item>
        <img src="${this.src}" alt="${this.name}" />
    </div>
</label></button>`;

        return domEl;
    }
}

export default class MediaPopup{
    constructor(wrapper){
        this.wrapper = wrapper;

        // dom elements
        this.elements = {
            mediaList: null
        };

        // fetch URL
        const urlObject = new URL(location.href);
        const baseUrl = urlObject.origin;
        const adminPath = urlObject.pathname.split('/')[1];
        this.FETCH_URL = baseUrl + '/' + adminPath + '/media';
    }

    loadAllMedias(target){
        // selected media
        const selectedMedias = JSON.parse(target.closest('[data-param]').querySelector('[data-param-value]').getAttribute('data-param-value'));

        // re-assign dom element and clear the previous list
        this.elements.mediaList = this.wrapper.querySelector('[data-media-list]');
        this.elements.mediaList.innerHTML = '';

        fetch(this.FETCH_URL, {
            method: 'get',
            action: 'get',
            getJSON: true
        })
            .then(res => res.json())
            .then(result => {
                const data = result.data;
                data.map(d => new Image(d))
                    .forEach(d => this.elements.mediaList.appendChild(d.domElement));

                selectedMedias.forEach(id => {
                    this.elements.mediaList.querySelector(`input[type="checkbox"][value="${id}"]`).checked = true;
                });
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
                const image = new Image(result);

                // re-assign dom element and clear the previous list
                this.elements.mediaList = this.wrapper.querySelector('[data-media-list]');
                this.elements.mediaList.appendChild(image.domElement);
            })
            .catch(err => console.error(err));
    }

    handleAfterSelectedMedias(target){
        const selectedMedias = Array
            .from(this.wrapper.querySelectorAll('input[type="checkbox"]'))
            .filter(c => c.checked)
            .map(c => c.value);

        // load media to the components

        // save to the attribute
        target.closest('[data-param]')
            .querySelector('[data-param-value]')
            .setAttribute('data-param-value', JSON.stringify(selectedMedias));
        console.log(selectedMedias);
    }

    isMediaPopup(e){
        let target = null,
            functionForHandling = () => {
            };

        const loadMediaButton = e.target.closest('[data-load-media]');
        const mediaForm = e.target.closest('[data-media-form]');
        const saveMediaButton = e.target.closest('[data-save-media]');

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