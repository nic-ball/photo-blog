const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const DomPurify = require('jsdom');
const { JSDOM } = require('jsdom');
const dompurify = DomPurity(new JSDOM().window);

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  published: {
    type: Date,
    default: Date.now,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Live'],
    default: 'Live',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    tyoe: String,
    required: true,
  },
});

blogSchema.pre('validate', function (next) {
  if (this.title) {
    // strict true allows slugify to remove weird characters from the slug
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.body) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.body));
  }

  next();
});

module.exports = mongoose.model('BlogModel', blogSchema, 'MainCollection');
