const router = require('express').Router();
const basicAuth = require('../middleware/basicAuth');
const bcrypt = require('bcrypt');

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

router.get('/', basicAuth, async(req, res)=>{
    const user = users.find(user=> user.email === req.user.email);

    if(!user){
        return res.status(404).send({error: 'User not found'}); 
    }

    const resul = await bcrypt.compare(req.user.password, user.password);

    if(!result){
        return res.status(401).json({error: 'Incorrect password'})
    };

    res.json({id: user.id, email: user.email})
})

module.exports = router