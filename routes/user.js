const router = require('express').Router();
const basicAuth = require('../middleware/basicAuth');
const bcrypt = require('bcrypt');
const authorize = require('../middleware/authorize');
const jwt = require('jsonwebtoken');

const users = []

router.post('/', basicAuth, async(req, res) => {
    const { email, password } = req.user;
    const id = users.length + 1;

    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = { 
        id, 
        email, 
        password: hashedPassword
    }

    users.push(user);
    res.status(201).json({id, email});
})

router.post('/login', basicAuth, async(req, res)=>{
    const user = users.find(user=> user.email === req.user.email);

    if(!user){
        return res.status(404).send({error: 'User not found'}); 
    }

    const result = await bcrypt.compare(req.user.password, user.password);

    if(!result){
        return res.status(401).json({error: 'Incorrect password'})
    };

    const payload = { id: user.id, email: user.email};

    const accessToken = jwt.sign(payload, process.env['TOKEN_SECRET'])

    res.json({accessToken})
})

router.get('/', authorize, async(req, res) => {
    res.json(req.user)
})

module.exports = router