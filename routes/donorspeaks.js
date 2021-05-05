const express = require('express');
const bodyParser = require('body-parser');
const DonorSpeaks = require('../models/donorspeaks');
const authenticate = require('../authenticate');
const mongoose = require('mongoose');
const donorspeaksRouter = express.Router();

donorspeaksRouter.use(bodyParser.json());

donorspeaksRouter
  .route('/')
  .options((req, res) => {
    res.sendStatus(200);
  })
  .get((req, res, next) => {
    DonorSpeaks.find({})
      .populate('author')
      .then(
        (donorspeaks) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(donorspeaks);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser,authenticate.roleAuthorization(['donor']), (req, res, next) => {
    if (req.body != null) {
      //req.body.author = req.user._id;
      const donorSpeaksObj = {
        heading: req.body.heading,
        description: req.body.description,
        author: req.user._id,
      };

      DonorSpeaks.create(donorSpeaksObj)
        .then(
          (donorspeaks) => {
            DonorSpeaks.findById(donorspeaks._id)
              .populate('author')
              .then((donorspeaks) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(donorspeaks);
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
    authenticate.roleAuthorization(['donor']),
    (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /donorspeaks');
    }
  )
  .delete(
    authenticate.verifyUser,
    authenticate.roleAuthorization(['admin']),
    (req, res, next) => {
      res.statusCode = 403;
      res.end('DELETE operation not supported on /donorspeaks');
    }
  );

donorspeaksRouter
  .route('/:donorspeaksId')
  .options((req, res) => {
    res.sendStatus(200);
  })
  .get((req, res, next) => {
    DonorSpeaks.findById(req.params.donorspeaksId)
      .populate('author')
      .then(
        (donorspeaks) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(donorspeaks);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(
    authenticate.verifyUser,
    authenticate.roleAuthorization(['admin', 'donor']),
    (req, res, next) => {
      DonorSpeaks.findById(req.params.donorspeaksId)
        .then(
          (donorspeaks) => {
            if (donorspeaks != null) {
              if (!donorspeaks.author.equals(req.user._id)) {
                var err = new Error(
                  'You are not authorized to update this blog!'
                );
                err.status = 403;
                return next(err);
              }
              req.body.author = req.user._id;
              DonorSpeaks.findByIdAndUpdate(
                req.params.donorspeaksId,
                {
                  $set: req.body,
                },
                { new: true }
              ).then(
                (donorspeaks) => {
                  DonorSpeaks.findById(donorspeaks._id)
                    .populate('author')
                    .then((donorspeaks) => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(donorspeaks);
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
    authenticate.roleAuthorization(['donor', 'admin']),
    (req, res, next) => {
      DonorSpeaks.findById(req.params.donorspeaksId)
        .then(
          (donorspeaks) => {
            if (donorspeaks != null) {
              DonorSpeaks.findByIdAndRemove(req.params.donorspeaksId)
                .then(
                  (resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                  },
                  (err) => next(err)
                )
                .catch((err) => next(err));
            } else {
              err = new Error(
                'Blog with id ' + req.params.donorspeaksId + ' not found'
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

module.exports = donorspeaksRouter;
