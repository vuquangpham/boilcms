const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");
const {getFilenameBasedOnSize} = require("../utils/helper.utils");
const {cropImage} = require("../utils/os.utils");

// dependencies
const path = require("path");

class Media extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Validate input data to get the correct data
     * */
    validateInputData(request, action = 'add'){
        // crop image
        cropImage({
            imageSource: path.join(request.file.path),
            imageDestination: path.join(process.cwd(), request.file.destination),
            scale: 'small',
            imageOutputName: request.file.metadata.fileName,
            imageFileExtension: request.file.metadata.fileExt
        })
            .then()
            .catch(error => {
                console.log(error);
            });

        return {
            name: request.body.name ?? request.file.fileName,
            type: request.file.mimetype,
            url: {
                original:  '/' + request.file.path.split('\\').slice(1).join('\\'),
                small:  '/' + request.file.metadata.destinationDirectory + '/' + getFilenameBasedOnSize(request.file.metadata.fileName, 'small', request.file.metadata.fileExt)
            },
            directory: request.file.metadata.destinationDirectory
        };
    }
}

module.exports = new Media({
    name: 'Media',
    url: '/media',
    type: 'media',
    contentType: Type.types.MEDIA
});