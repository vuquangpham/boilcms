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
    if (!string) return '';
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

/**
 * Filter suitable input from request form
 * @param obj {object}
 * @param allowedFields
 * @return {object}
 * */
const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj;
}

/**
 * Capitalize first character of string
 * @param string {string}
 * @param character {string}
 * @return {string}
 * */
const capitalizeString = (string, character = ' ') => string.toLowerCase()
    .split(character)
    .map(s => s[0].toUpperCase() + s.slice(1)).join(' ')


module.exports = {
    stringToSlug,

    getParamsOnRequest,
    getFilenameBasedOnSize,

    minifyString,
    filterObj,
    capitalizeString
};
