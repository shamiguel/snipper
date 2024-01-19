const express = require('express');
const app = express();
const PORT = 3000;
const snippets = require('./seedData.json');
app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})


let id = snippets.length; 

app.post('/snippets', (req, res) => {
    const { language, code } = req.body 

    if(!language || !code){
        return res 
        .status(400)
        .json({error: 'Language and code snippets are required fields.'});
    };

    const snippet = {
        id: ++id,
        language, 
        code
    }
    snippets.push(snippet);
    res.status(201).json(snippet)
});

app.get('/snippets', (req,res)=>{
    const {language} = req.query 

    if(language){
        const filteredSnippets = snippets.filter(
            (snip) => snip.language.toLocaleLowerCase() === language.toLocaleLowerCase() 
            );
        return res.json(filteredSnippets);    
    };
    res.json(snippets)
});

app.get('/snippets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const snippet = snippets.find(snip => snip.id === id);
    if(!snippet){
        return res.status(404).json({error: 'Snippet not found'});
    }
    res.json(snippet)
})


