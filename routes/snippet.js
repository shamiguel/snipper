const router = require('express').Router();
const {encrypt, decrypt} = require('../utils/encrypt');
const {requiresAuth} = require('express-openid-connect')
const snippets = require('../seedData.json');

let id = snippets.length; 
router.post('/', requiresAuth(), (req, res) => {
    const { language, code } = req.body 

    if(!language || !code){
        return res 
        .status(400)
        .json({error: 'Language and code snippets are required fields.'});
    };
    const encode = encrypt(code)
    const snippet = {
        id: ++id,
        language, 
        encode
    }
    snippets.push(snippet);
    console.log(snippets)
    res.status(201).json(snippet)
});

router.get('/', requiresAuth(), (req, res) => {
    const { language } = req.query
    console.log("enc",
        encrypt("print('Hello, World!')")
    )
    const decodedSnippet = snippets.map(snippet => ({
      ...snippet,
      code: decrypt(snippet.code)
    }))
    if (language) {
      const filteredSnippet = decodedSnippet.filter(
        snippet => snippet.language.toLowerCase() === language.toLowerCase()
      )
      return res.json(filteredSnippet)
    }
  
    res.json(decodedSnippet)
  })

router.get('/:id', requiresAuth(), (req, res) => {
    const id = parseInt(req.params.id);
    const snippet = snippets.find(snip => snip.id === id);
    if(!snippet){
        return res.status(404).json({error: 'Snippet not found'});
    }
    snippet.code = decrypt(snippet.instructions)
    res.json(snippet)
})


module.exports = router;

