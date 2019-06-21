const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

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
        res.redirect(`/authors/${newAuthor.id}`)
        // res.send(newAuthor.name)
        // res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (error) {
        console.log(error);        
        res.redirect('/')
    }    
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (error) {
        console.log(`error in author edit router: ${error}`);
        res.redirect('/authors')
    }
    // res.send('edit author ' + req.params.id)
})

router.put('/:id', async (req, res) => {
    // res.send('update author ' + req.params.id)
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
        // res.redirect(`authors`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {    
    // res.send('delete author ' + req.params.id)
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
        // res.redirect(`authors`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {            
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router