import fetch from "@global/fetch";

class Image{
    constructor(imageObject, isRadio = false){
        this.src = imageObject.url.small;
        this.name = imageObject.name;
        this.isRadio = isRadio;
        this.domElement = this.getDOMElement();
    }

    getDOMElement(){
        const domEl = document.createElement('div');
        domEl.setAttribute('data-media', '');

        domEl.innerHTML = `
<button style="border:none;" type="button"><label>
    <input type="${this.isRadio ? 'radio' : 'checkbox'}" name="selected-image">
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

    loadAllMedias(){
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
            });
    }

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

    isMediaPopup(e){
        let target = null,
            functionForHandling = () => {
            };

        const loadMediaButton = e.target.closest('[data-load-media]');
        const mediaForm = e.target.closest('[data-media-form]');

        if(loadMediaButton){
            functionForHandling = this.loadAllMedias.bind(this);
            target = loadMediaButton;
        }

        // add new media
        else if(mediaForm && !this.elements.popupForm){
            this.elements.popupForm = mediaForm;
            mediaForm.addEventListener('submit', this.handleSubmitForm.bind(this));
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}