const express = require('express'),
    router = express.Router(),
    user = require('../../models/userModel'),
    decodeToken = require('../middleware/decodeToken');
var logger = require('../../util/logger')

const api_name = 'userApi.js';

router.post('/get', decodeToken, (req, res) => {
    let u = res.req.decoded;
    //TODO: search in DB by iid and send user back to ui
    user.getUserByEmail(u.email).then((user) => {
        logger.debug('res :', { user })
        if (!user) res.status(401).send(null);
        res.status(200).json(user);
    })
        .catch(err => {
            _e.HandleError(err, api_name + '/get')
            res.status(500).send(err);
        })
});

router.get('/get-all', (req, res) => {
    // var u = res.req.decoded;
    //TODO: search in DB by iid and send user back to ui
    user.getAllUsers().then((users) => {
        logger.debug('res :', { users })
        res.status(200).json(users);
    })
        .catch(err => {
            _e.HandleError(err, api_name + '/get-all')
            res.status(500).send(err);
        })
});

// signup new users using quick form 
router.post('/signup', (req, res) => {
    if (!req.body.terms) return res.status(404).send({ auth: false, terms: 'missing' })
    if (req.body.password != req.body.confirmPassword) return res.status(404).send({ auth: false, ConfirmPassword: 'password dont match' })
    // res.status(404).send({auth: false,ConfirmPassword:'missing'}) 
    let u = {};
    u.first_name = req.body.fullName;
    u.email = req.body.email;
    u.password = req.body.password;
    //insert user to db
    user.insertUser(u).then((response) => {
        if (!response.token)
            logger.debug('res in api  :', { response })
        res.status(200).send(response);
    }).catch(err => {
        _e.HandleError(err, api_name + '/signup')
        res.status(500).send(err);
    })
});

// insert users with full details 
router.post('/insert', (req, res) => {
    let u = req.body;
    user.insertUser(u).then((response) => {
        if (!response.token)
            logger.info('user inserted  :', { response })
        res.status(200).send(response);
    }).catch(err => {
        _e.HandleError(err, api_name + '/insert')
        res.status(500).send(err);
    })
});

// login existing user and return token
router.post('/login', (req, res) => {
    let email = req.body.email
    let pass = req.body.password
    user.login(email, pass).then((response) => {
        if (!response) throw Error('bad username or pass')
        logger.debug('response :', { response });
        res.status(200).send(response);
    }).catch(err => {
        _e.HandleError(err, api_name + '/login')
        res.status(500).send(err);
    })
});

module.exports = router;
