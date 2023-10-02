/**
 * Get params on the request object
 * @param req {Object}
 * @param defaultParams {Array}
 * @return {Array}
 * */
const getParamsOnRequest = (req, defaultParams) => {
    return req.params['0'].length > 1 ? req.params['0'].split('/').slice(1) : defaultParams;
};


/**
 * Get server host URL
 * @param {Object} request
 * @return {String}
 * */
// const getServerHostURL = (request) => request.protocol + '://' + request.get('host')

/**
 * Get file name based on file size
 * @param sourceName {String}
 * @param size {String}
 * @param extension {String}
 * @return {String}
 * */
const getFilenameBasedOnSize = (sourceName, size, extension) => {
    if (!size) return sourceName + '.' + extension
    return sourceName + '-' + size + '.' + extension
}

/**
 * Convert string to slug
 * @param string
 * @return string
 * */
const stringToSlug = (string) => {
    if(!string) return '';
    return string.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .toLowerCase();
};

/**
 * Minify string
 * @param {String} string
 * @return {String}
 * */
const minifyString = (string) => string.replace(/\s+/g, '');

module.exports = {
    stringToSlug,

    getParamsOnRequest,
    getServerHostURL,
    getFilenameBasedOnSize,

    minifyString
};
