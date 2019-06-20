const mongoose = require('mongoose')
const path = require('path')
// const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    /* coverImageName: {
        type: String,
        required: false
    }, */
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

/* // this creates a virtual property in the book schema, in this case: coverImagePath
bookSchema.virtual('coverImagePath').get(function() {
    if( this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
}) */

// this is converting the base64 encoded data back to an image file used by the HTML page
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)
// coverImageBasePath will be a property on the Book object created from this model
// module.exports.coverImageBasePath = coverImageBasePath