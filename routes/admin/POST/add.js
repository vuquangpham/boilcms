const {cropImage} = require('../../../core/utils/os.utils')
const path = require('path')
const {getServerHostURL, getFilenameBasedOnSize} = require("../../../core/utils/helper.utils");

const Type = require('../../../core/classes/utils/type');
const {stringToSlug} = require("../../../core/utils/helper.utils");
const PageBuilder = require('../../../core/database/page-builder/model');

/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    let requestBodyData = request.body;

    // validate type
    switch(categoryItem.contentType){
        case Type.types.POSTS:{
            requestBodyData = validatePostType(request);
            break;
        }
    }

    const promise = categoryItem.add(requestBodyData);
    const extraData = {};

    return [promise, extraData];
};


const validatePostType = (request) => {
    const title = request.body.title;
    const url = stringToSlug(title);
    const visibility = request.body.visibility;
    const content = new PageBuilder({
        content: request.body.content
    });

    // save to database
    content.save();

    return {
        title,
        url,
        visibility,
        content
    };
};

/*
const Post = new mongoose.Schema({
    title: {
        type: String,
        default: '',
        required: true
    },
    url: {
        type: String,
        default: ''
    },
    visibility: {
        type: String
    },
    publish: {
        type: Date,
        default: () => Date.now()
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageBuilder'
    }
});
* */

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
        url: {
            original :serverHostURL + '/' + request.file.path.split('\\').slice(1).join('\\'),
            small: serverHostURL + '/' + request.file.metadata.destinationDirectory + '/' + getFilenameBasedOnSize(request.file.metadata.fileName, 'small', request.file.metadata.fileExt)
        },
        directory: request.file.metadata.destinationDirectory
    }

    return mediaObj
}

module.exports = handleAddAction;