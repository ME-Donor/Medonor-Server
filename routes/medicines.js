const express = require('express');
const bodyParser = require('body-parser');
const Medicines = require('../models/medicines');
const authenticate = require('../authenticate');
const mongoose=require('mongoose');
const medicinesRouter = express.Router();

medicinesRouter.use(bodyParser.json());

medicinesRouter.route('/')
.options((req,res)=>{res.sendStatus(200);})
.get((req, res, next) => {

    Medicines.find({})
    .populate('author')
    .then((medicine) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(medicine);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.roleAuthorization(['donor']),(req,res,next) => {
    if (req.body != null) {
        const medicineObj = {
            name: req.body.name,
            expirydate: req.body.expirydate,
            author: req.user._id,
            amount:req.body.amount
          };
        //req.body.author = req.user._id;
        Medicines.create(medicineObj)
        .then((medicine) => {
            Medicines.findById(medicine._id)
            .populate('author')
            .then((medicine) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(medicine);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Medicine not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put(authenticate.verifyUser,authenticate.roleAuthorization(['donor']),(req,res,next) => {
    
    res.statusCode = 403;
    res.end('PUT operation not supported on /medicines');
})
.delete(authenticate.verifyUser,authenticate.roleAuthorization(['admin']), (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /medicines');
});

medicinesRouter.route('/:medicineId')
.options((req,res)=>{res.sendStatus(200);})
.get((req,res,next) => {
    Medicines.findById(req.params.medicineId)
    .populate('author')
    .then((medicine) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(medicine);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.roleAuthorization(['admin','donor']), (req, res, next) => {
    Medicines.findById(req.params.medicineId)
    .then((medicine) => {
        if (medicine != null) {
            if (!medicine.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this medicine!');
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id;
            Medicines.findByIdAndUpdate(req.params.medicineId, {
                $set: req.body
            }, { new: true })
            .then((medicine) => {
                Medicines.findById(medicine._id)
                .populate('author')
                .then((medicine) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(medicine); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('Medicine ' + req.params.medicineId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.roleAuthorization(['donor','admin']),(req, res, next) => {

    Medicines.findById(req.params.medicineId)
    .then((medicine) => {
        if (medicine != null) {
            Medicines.findByIdAndRemove(req.params.medicineId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Blog with id ' + req.params.medicineId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = medicinesRouter;

