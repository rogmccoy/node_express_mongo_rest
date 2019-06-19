const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    // query comes from the url (?name=roger), not the body
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            // this object is what is passed to the view and the view can then do stuff with it
            author: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    
})

// new author route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// create author route
router.post('/', async (req, res) => {
    const author = new Author({
        // this variable will parse the post request and save name to the author variable
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        // res.send(newAuthor.name)
        res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router