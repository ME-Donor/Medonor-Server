const express = require('express');
const bodyParser = require('body-parser');
const NgoBlogs = require('../models/ngoblog');
const authenticate = require('../authenticate');
const multer = require('multer');
const mongoose = require('mongoose');
const ngoblogsRouter = express.Router();

ngoblogsRouter.use(bodyParser.json());

ngoblogsRouter
  .route('/')

  .get((req, res, next) => {
    NgoBlogs.find({})
      .populate('author')
      .then(
        (ngoblog) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(ngoblog);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser,authenticate.roleAuthorization(['ngo']), (req, res, next) => {
    if (req.body !== null) {
      //req.body.author = req.user._id;
      const ngoObj = {
        heading: req.body.heading,
        description: req.body.description,
        author: req.user._id,
      };
      NgoBlogs.create(ngoObj)
        .then(
          (ngoblog) => {
            NgoBlogs.findById(ngoblog._id)
              .populate('author')
              .then((ngoblog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(ngoblog);
              });
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    } else {
      err = new Error('Blog not found in request body');
      err.status = 404;
      return next(err);
    }
  })
  .put(
    authenticate.verifyUser,
    authenticate.roleAuthorization(['ngo']),
    (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /ngoblogs');
    }
  )
  .delete(
    authenticate.verifyUser,
    authenticate.roleAuthorization(['admin']),
    (req, res, next) => {
      res.statusCode = 403;
      res.end('DELETE operation not supported on /ngoblogs');
    }
  );

ngoblogsRouter
  .route('/:ngoblogId')
  .options((req, res) => {
    res.sendStatus(200);
  })
  .get((req, res, next) => {
    NgoBlogs.findById(req.params.ngoblogId)
      .populate('author')
      .then(
        (ngoblog) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(ngoblog);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(
    authenticate.verifyUser,
    authenticate.roleAuthorization(['admin', 'ngo']),
    (req, res, next) => {
      NgoBlogs.findById(req.params.ngoblogId)
        .then(
          (ngoblog) => {
            if (ngoblog != null) {
              if (!ngoblog.author.equals(req.user._id)) {
                var err = new Error(
                  'You are not authorized to update this blog!'
                );
                err.status = 403;
                return next(err);
              }
              req.body.author = req.user._id;
              NgoBlogs.findByIdAndUpdate(
                req.params.ngoblogId,
                {
                  $set: req.body,
                },
                { new: true }
              ).then(
                (ngoblog) => {
                  NgoBlogs.findById(ngoblog._id)
                    .populate('author')
                    .then((ngoblog) => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(ngoblog);
                      res.json(ngoblog);
                      res.json(ngoblog);
                    });
                },
                (err) => next(err)
              );
            } else {
              err = new Error('Blog ' + req.params.blogId + ' not found');
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    authenticate.verifyUser,
    authenticate.roleAuthorization(['ngo', 'admin']),
    (req, res, next) => {
      NgoBlogs.findById(req.params.ngoblogId)
        .then(
          (ngoblog) => {
            if (ngoblog != null) {
              NgoBlogs.findByIdAndRemove(req.params.ngoblogId)
                .then(
                  (resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                    res.json(resp);
                    res.json(resp);
                  },
                  (err) => next(err)
                )
                .catch((err) => next(err));
            } else {
              err = new Error(
                'Blog with id ' + req.params.ngoblogId + ' not found'
              );
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

module.exports = ngoblogsRouter;
