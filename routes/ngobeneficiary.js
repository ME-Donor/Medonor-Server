const express = require('express');
const bodyParser = require('body-parser');
const NgoBeneficiary = require('../models/ngobeneficiary');
const authenticate = require('../authenticate');
const mongoose=require('mongoose');
const ngobeneficiaryRouter = express.Router();

ngobeneficiaryRouter.use(bodyParser.json());

ngobeneficiaryRouter.route('/')
.options((req,res)=>{res.sendStatus(200);})
.get((req, res, next) => {

    NgoBeneficiary.find({})
    .populate('author')
    .then((ngobeneficiary) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ngobeneficiary);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req,res,next) => {
    
    if (req.body != null) {
        //req.body.author = req.user._id;
        NgoBeneficiary.create(req.body)
        .then((ngobeneficiary) => {
            NgoBeneficiary.findById(ngobeneficiary._id)
            .populate('author')
            .then((ngobeneficiary) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(ngobeneficiary);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Blog not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put(authenticate.verifyUser,authenticate.roleAuthorization(['ngo']),(req,res,next) => {
    
    res.statusCode = 403;
    res.end('PUT operation not supported on /ngobeneficiary');
})
.delete(authenticate.verifyUser,authenticate.roleAuthorization(['admin']), (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /ngobeneficiary');
});

ngobeneficiaryRouter.route('/:ngobeneficiaryId')
.options((req,res)=>{res.sendStatus(200);})
.get((req,res,next) => {
    NgoBeneficiary.findById(req.params.ngobeneficiaryId)
    .populate('author')
    .then((ngobeneficiary) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ngobeneficiary);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.roleAuthorization(['admin','ngo']), (req, res, next) => {
    NgoBeneficiary.findById(req.params.ngobeneficiaryId)
    .then((ngobeneficiary) => {
        if (ngobeneficiary != null) {
            if (!ngobeneficiary.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this blog!');
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id;
            NgoBeneficiary.findByIdAndUpdate(req.params.ngobeneficiaryId, {
                $set: req.body
            }, { new: true })
            .then((ngobeneficiary) => {
                NgoBeneficiary.findById(ngobeneficiary._id)
                .populate('author')
                .then((ngobeneficiary) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(ngobeneficiary); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('Blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.roleAuthorization(['ngo','admin']),(req, res, next) => {

    NgoBeneficiary.findById(req.params.ngobeneficiaryId)
    .then((ngobeneficiary) => {
        if (ngobeneficiary != null) {
            NgoBeneficiary.findByIdAndRemove(req.params.ngobeneficiaryId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Blog with id ' + req.params.ngobeneficiaryId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = ngobeneficiaryRouter;

