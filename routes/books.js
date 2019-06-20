const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')
const Author = require('../models/author')
const Book = require('../models/book')
// const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// multer is used to upload files and store on the file system
/* const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
}) */

// all books route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        // render() is being passed a view
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new book route
router.get('/new', (req, res) => {
    // res.render('books/new', { book: new Book() })
    renderNewPage(res, new Book())
})

// create book route
// use the upload.single() when you are uploading an actual image file
// router.post('/', upload.single('cover'), async (req, res) => {
router.post('/', async (req, res) => {

    // const fileName = req.file != null ? req.file.filename : null
    
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        // coverImageName: fileName,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch {
        // if (book.coverImageName != null) removeBookCover(book.coverImageName)
        renderNewPage(res, book, true)
    }
})

/* function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
} */

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

// coverEncoded is the image file being uploaded
// this function is storing the uploaded image file as a base64 encoded string
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    // convert the coverEncoded image into JSON data
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {        
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router