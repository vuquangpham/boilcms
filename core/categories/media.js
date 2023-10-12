const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");
const {getFilenameBasedOnSize} = require("../utils/helper.utils");
const {cropImage, deleteDirectoryInAsync} = require("../utils/os.utils");

// dependencies
const path = require("path");
const {PUBLIC_DIRECTORY} = require("../utils/config.utils");

class Media extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Delete directory in redundant media
     * */
    deleteAssetDirectory(media){
        // working with folder have to use path.join
        const directory = path.join(PUBLIC_DIRECTORY, media.directory);

        // promise
        return deleteDirectoryInAsync(directory);
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
            .catch(error => {
                console.log(error);
            });

        // TODO: Missing case when function cropImage have error but still return the object below, fix it later
        return {
            name: request.body.name || request.file.filename,
            type: request.file.mimetype,
            url: {
                original: '/' + request.file.metadata.destinationDirectory + '/' + getFilenameBasedOnSize(request.file.metadata.fileName, '', request.file.metadata.fileExt),
                small: '/' + request.file.metadata.destinationDirectory + '/' + getFilenameBasedOnSize(request.file.metadata.fileName, 'small', request.file.metadata.fileExt)
            },
            directory: request.file.metadata.destinationDirectory
        };
    }

    /**
     * Update media file and replace redundant media
     * */
    update(id, data){
        return new Promise((resolve, reject) => {
            this.getDataById(id)
                .then(result => {
                    // promise
                    const deleteInDirectory = this.deleteAssetDirectory(result);
                    const updateMedia = this.databaseModel.updateOne({_id: id}, data);

                    // handle delete media
                    Promise.all([deleteInDirectory, updateMedia])
                        .then(result => resolve(this.getDataById({_id: id})))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }

    /**
     * Delete media
     * */
    delete(id){
        return new Promise((resolve, reject) => {
            this.getDataById(id)
                .then(result => {
                    // promise
                    const deleteInDirectory = this.deleteAssetDirectory(result);
                    const deleteInDatabase = this.databaseModel.deleteOne({_id: id});

                    // handle delete media
                    Promise.all([deleteInDirectory, deleteInDatabase])
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = new Media({
    name: 'Media',
    url: '/media',
    type: 'media',
    contentType: Type.types.MEDIA
});