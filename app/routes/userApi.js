const express = require('express'),
    router = express.Router(),
    user = require('../../models/userModel'),
    decodeToken = require('../middleware/decodeToken'),
    _e = require('../../app/util/errorHandle'),
    asyncMiddleware = require('../middleware/asyncMiddleware'),
    logger = require('../../app/util/logger');

const api_name = 'userApi.js';

router.post('/get', decodeToken, asyncMiddleware(async (req, res) => {
    let u = res.req.decoded;
    let user = user.getUserByEmail(u.email)
    logger.debug('res :', {
        user
    })
    if (!user) res.status(200).send('no such user');
    res.status(200).json(user);
}));

router.get('/get-all', asyncMiddleware(async (req, res) => {
    // var u = res.req.decoded;
    //TODO: search in DB by iid and send user back to ui
    let users = user.getAllUsers();
    logger.debug('res :', {
        users
    })
    res.status(200).json(users);
}));

// signup new users using quick form 
router.post('/signup', asyncMiddleware(async (req, res) => {
    if (!req.body.terms) return res.status(404).send({
        auth: false,
        terms: 'missing'
    })
    if (req.body.password != req.body.confirmPassword) return res.status(404).send({
        auth: false,
        ConfirmPassword: 'password dont match'
    })
    // res.status(404).send({auth: false,ConfirmPassword:'missing'}) 
    let u = {};
    u.first_name = req.body.fullName;
    u.email = req.body.email;
    u.password = req.body.password;
    //insert user to db
    let response = user.insertUser(u);
    if (!response.token) res.status(401).send();
    logger.debug('res in api  :', {
        response
    })
    res.status(200).send(response);
}));

// insert users with full details 
router.post('/insert', asyncMiddleware(async (req, res) => {
    let u = req.body;
    let response = await user.insertUser(u)
    if (!response) res.status(200).send('something went wrong');
    res.status(200).send(response);
    logger.info('user inserted  :', {
        response
    })
    res.status(200).send(response);
}));

// login existing user and return token
router.post('/login', asyncMiddleware(async (req, res) => {
    let email = req.body.email
    let pass = req.body.password
    if (!email && !pass) return res.status(500).send('failed username or password')
    let response = await user.login(email, pass)
    logger.debug('response :', {
        response
    });
    if (!response) res.status(200).send('not this time');
    res.status(200).send(response);
}));


module.exports = router;