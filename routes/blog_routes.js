const express = require('express');
const blogArticle = require('./../models/blog_models');
const router = express.Router();

router.get('/new', (req, res) => {
  res.render('blog_views/new', { article: new blogArticle() });
});

router.post(
  '/',
  async (req, res, next) => {
    req.article = new blogArticle();
    next();
  },
  saveInstanceAndRedirect('new'),
);

router.get('/edit/:id', async (req, res) => {
  const article = await blogArticle.findById(req.params.id);
  res.render('blog_views/edit', { article: article });
});

router.get('/:slug', async (req, res, next) => {
  const article = await blogArticle.findOne({ slug: req.params.slug });
  if (article == null) return res.redirect('/');
  res.render('blog_views/show', { article: article });
});

router.put(
  '/:id',
  async (req, res, next) => {
    req.article = await blogArticle.findById(req.params.id);
    next();
  },
  saveInstanceAndRedirect('edit'),
);

router.delete('/:id', async (req, res) => {
  await blogArticle.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

function saveInstanceAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.body = req.body.body;
    article.status = req.body.status;
    try {
      article = await article.save();
      res.redirect(`/${article.slug}`);
    } catch (e) {
      res.render(`blod_views/${path}`, { article: article });
    }
  };
}

module.exports = router;
