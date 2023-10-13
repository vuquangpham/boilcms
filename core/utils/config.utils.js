const path = require('path');

// directory
const ADMIN_URL = 'boiler-admin';
const REGISTER_URL = 'register';
const CORE_DIRECTORY = path.join(process.cwd(), 'core');
const PUBLIC_DIRECTORY = path.join(process.cwd(),'public')

module.exports = {
    ADMIN_URL, REGISTER_URL, CORE_DIRECTORY, PUBLIC_DIRECTORY
};