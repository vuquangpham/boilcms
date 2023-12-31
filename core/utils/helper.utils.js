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
 * Get protocol and domain
 * @param request {Object}
 * @return {String}
 * */
const getProtocolAndDomain = (request) => {
    return request.protocol + '://' + request.get('host') + '/';
};

/**
 * Get file name based on file size
 * @param sourceName {String}
 * @param size {String}
 * @param extension {String}
 * @return {String}
 * */
const getFilenameBasedOnSize = (sourceName, size, extension) => {
    if(!size) return sourceName + '.' + extension;
    return sourceName + '-' + size + '.' + extension;
};

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

/**
 * Filter suitable input from request form
 * @param obj {object}
 * @param allowedFields
 * @return {object}
 * */
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

/**
 * Capitalize first character of string
 * @param string {string}
 * @param character {string}
 * @return {string}
 * */
const capitalizeString = (string, character = ' ') => {
    if(string.length === 1) return string;

    return string.toLowerCase()
        .split(character)
        .map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
};

/**
 * Modify date from date time mongoose to custom date time
 * */
const modifyDate = (publishTime) => {
    const year = publishTime.getFullYear();
    const month = (publishTime.getMonth() + 1).toString().padStart(2, '0');
    const date = publishTime.getDate().toString().padStart(2, '0');
    const hour = publishTime.getHours().toString().padStart(2, '0');
    const minute = publishTime.getMinutes().toString().padStart(2, '0');
    return `${month}/${date}/${year} at ${hour}:${minute}`;
};

/**
 * Splits a given URL string into parts based on a specified character, and then joins a subset of those parts back together.
 * @param currentUrl {String}
 * @param start {Number}
 * @param end {Number}
 * @param character {String}
 * @return {String}
 * */
const splitUrl = (currentUrl, start, end, character = ' ') => {
    const parts = currentUrl.split(character);
    return parts.slice(start, end).join(character);
};

const splitString = (currentString, character = ' ') => {
    return currentString.split(character).map(value => value.trim())
}


module.exports = {
    stringToSlug,

    getProtocolAndDomain,
    getParamsOnRequest,
    getFilenameBasedOnSize,

    minifyString,
    filterObj,
    capitalizeString,
    splitUrl,
    splitString,

    modifyDate,
};
