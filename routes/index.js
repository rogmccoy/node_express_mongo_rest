const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createdAt: -1 }).limit(10).exec()
    } catch (error) {
        console.log(error)        
        books = []
    }
    // render is passed a view
    res.render('index1', { books: books })
})

module.exports = router