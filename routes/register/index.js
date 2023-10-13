const handleGetMethod = require('./get')
const handlePostMethod = require('./post')

const router = require('express').Router();


/**
 * Dynamic page with file type
 * */
router.all('*', (request, response, next) => {
    const method = response.locals.method;

    switch(method.name){
        case 'get':{
            handleGetMethod(request, response, next);
            break;
        }
        case 'post':{
            handlePostMethod(request, response, next);
        }
    }
});


module.exports = router;