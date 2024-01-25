const router = require('express').Router();
const {requiresAuth} = require('express-openid-connect')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = []

router.get('/', requiresAuth(), async(req, res) => {
    res.json(req.oidc.user)
})

module.exports = router