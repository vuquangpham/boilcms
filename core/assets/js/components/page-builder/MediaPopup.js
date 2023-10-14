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

        domEl.innerHTML = `
<label>
    <input type="${this.isRadio ? 'radio' : 'checkbox'}" name="selected-image">
    <div class="single-image img-wrapper-cover" data-media-image>
        <img src="${this.src}" alt="${this.name}" />
    </div>
</label>
        `;

        domEl.classList.add('single-image-wrapper');
        domEl.setAttribute('data-media-item', '');

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

    isMediaPopup(e){
        let target = null,
            functionForHandling = () => {
            };

        const loadMediaButton = e.target.closest('[data-load-media]');
        if(loadMediaButton){
            functionForHandling = this.loadAllMedias.bind(this);
            target = loadMediaButton;
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}