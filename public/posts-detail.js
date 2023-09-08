document.querySelectorAll('[data-post-detail]').forEach(wrapper => {

    let parentRow = null;
    const componentDetailPopup = wrapper.querySelector('.component-popup__content');

    const handleAddButtonClick = (target) => {
        parentRow = target.closest('[data-component="row"]');
        console.log(parentRow);
    };
    const handleComponentClick = (target) => {
        console.log(target);
        const action = target.dataset.action;
        let promise = Promise.resolve();

        switch(action){
            case 'edit':{

                break;
            }
            case 'add':{
                promise = fetch(location.href + '&' + new URLSearchParams({
                    action: 'get'
                }), {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({componentName: target.dataset.component})
                });
                break;
            }
        }

        promise
            .then(res => res.json())
            .then(result => {
                // show in popup
                componentDetailPopup.insertAdjacentHTML('beforeend', result.content);

                // create in row
                const html = `
                <div data-component="${result.component.name}" data-action="edit">
                    <div data-component-title>${result.component.title}</div>
                    <div data-component-description></div>
                </div>
                `;
                parentRow.querySelector('[data-component-content]').insertAdjacentHTML('beforeend', html);
            });
    };

    wrapper.addEventListener('click', (e) => {
        const target = e.target.closest('[data-component-add]') || e.target.closest('[data-component]');
        if(!target) return;

        if(target.hasAttribute('data-component-add')) handleAddButtonClick(target);
        else handleComponentClick(target);
    });
});