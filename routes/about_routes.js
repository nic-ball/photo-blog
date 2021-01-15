const express = require('express');
const aboutBlogger = require('../models/about_models');
const router = express.Router();

router.get('/new', (req, res) => {
  const error = '';
  res.render('about_views/new', {
    about_form: new aboutBlogger(),
    error: error,
  });
});

router.post(
  '/',
  async (req, res, next) => {
    req.about_form = new aboutBlogger();
    next();
  },
  saveInstanceAndRedirect('new'),
);

router.get('/edit/:id', async (req, res) => {
  const about_form = await aboutBlogger.findById(req.params.id);
  res.render('about_views/edit', { about_form: about_form });
});

router.put(
  '/:id',
  async (req, res, next) => {
    req.about_form = await aboutBlogger.findById(req.params.id);
    next();
  },
  saveInstanceAndRedirect('edit'),
);

router.delete('/delete/:id', async (req, res) => {
  await aboutBlogger.findByIdAndDelete(req.params.id);
  res.redirect('/about');
});

function saveAboutInstanceAndRedirect(path) {
  return async (req, res) => {
    let about_form = req.about_form;
    about_form.first_name = req.body.first_name;
    about_form.last_name = req.body.last_name;
    about_form.contact = req.body.contact;
    about_form.github = req.body.github;
    about_form.achievements = req.body.achievements;
    try {
      about_form = await about_form.save();
      res.redirect(`/about`);
    } catch (e) {
      res.render(`about_views/${path}`, {
        about_form: about_form,
        error: errors,
      });
    }
  };
}

module.exports = router;
