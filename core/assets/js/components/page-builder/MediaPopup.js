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

    addNewMedia(){
        // re-assign the element
        this.elements.replaceMediaInput = this.wrapper.querySelector('[data-add-media]');

        console.log('handle add here');
        // the input doesn't exist
        if(!this.elements.replaceMediaInput.files || !this.elements.replaceMediaInput.files[0]) return;

    }

    isMediaPopup(e){
        let target = null,
            functionForHandling = () => {
            };

        const loadMediaButton = e.target.closest('[data-load-media]');
        const addMediaButton = e.target.closest('[data-add-media-button]');

        if(loadMediaButton){
            functionForHandling = this.loadAllMedias.bind(this);
            target = loadMediaButton;
        }

        // add new media
        else if(addMediaButton){
            functionForHandling = this.addNewMedia.bind(this);
            target = addMediaButton;
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}