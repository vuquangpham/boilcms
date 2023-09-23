const {cropImage} = require('../../../core/utils/os.utils')
const path = require('path')
const {getServerHostURL, getFilenameBasedOnSize} = require("../../../core/utils/helper.utils");

/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    let requestBodyData = {};

    // validate type
    switch (categoryItem.type) {
        case 'media': {
            requestBodyData = getMediaBodyData(request);
            break;
        }
        default: {
            requestBodyData = request.body;
        }
    }

    const promise = categoryItem.add(requestBodyData);
    const extraData = {};

    return [promise, extraData];
};

/**
 * Validate media item
 * */
const validateMediaType = (request) => {
    cropImage({
        imageSource: path.join(request.file.path),
        imageDestination: path.join(process.cwd(), request.file.destination),
        scale: 'small',
        imageOutputName: request.file.metadata.fileName,
        imageFileExtension: request.file.metadata.fileExt
    })
        .then()
        .catch(error => {
            console.log(error)
        })

    const serverHostURL = getServerHostURL(request);
    const mediaObj = {
        name: request.body.name ?? request.file.fileName,
        type: request.file.mimetype,
        url: request.protocol + '://' + request.get('host') + '\\' + request.file.path.split('\\').slice(1).join('\\')
    }
    return mediaObj
}

module.exports = handleAddAction;