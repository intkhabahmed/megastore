import { NextFunction, Request, Response } from 'express';
import User from '../src/app/schema/user';
import { secretKey } from './../helpers/config';
import { verifyToken } from './../helpers/jwt-helper';
const jwt = require('jsonwebtoken')

export class UsersRoute {

    public userRoute(app) {
        app.route('/api/users/register').post((req: Request, res: Response, next: NextFunction) => {
            User.findOne({ email: req.body.email }).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec((err, user) => {
                    if (err) {
                        return next(err)
                    }
                    if (user) {
                        res.status(409).send({ message: "Email is already registered" })
                    } else {
                        req.body.isAdmin = false
                        User.create(req.body, (err, user) => {
                            if (err) {
                                return next(err)
                            }
                            let token = jwt.sign({ subject: user._id, isAdmin: user.isAdmin }, secretKey)
                            res.send({ token })
                        })
                    }
                })
        })

        app.route('/api/users/all').get(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                User.find().populate('addresses').populate('messages')
                    .populate('orders').populate('wishlist').exec((err, users) => {
                        if (err) {
                            return next(err)
                        }
                        res.json(users)
                    })
            }
        })

        app.route('/api/users/authenticate').post((req: Request, res: Response, next: NextFunction) => {
            User.findOne({ email: req.body.email }).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').select('+password').exec((err, user) => {
                    if (err) {
                        return next(err)
                    }
                    if (user) {
                        if (user.password === req.body.password) {
                            let token = jwt.sign({ subject: user._id, isAdmin: user.isAdmin }, secretKey)
                            res.send({ token })
                        } else {
                            res.status(400).send({ message: "Email/Password is incorrect" })
                        }

                    } else {
                        res.status(404).send({ message: "Email does not exists" })
                    }
                })
        })

        app.route('/api/users/current').get(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            User.findById(req.params.userId).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec((err, user) => {
                    if (err) { return next(err); }
                    res.json(user);
                });
        });

        app.route('/api/users/current').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin && req.body.isAdmin) {
                res.status(401).send({ message: "Unauthorized action" })
            } else {
                User.findByIdAndUpdate(req.params.userId, req.body).populate('addresses').populate('messages')
                    .populate('orders').populate('wishlist').exec((err, user) => {
                        if (err) { return next(err); }
                        res.json(user);
                    })
            }
        });

        app.route('/api/users/current').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            User.findByIdAndRemove(req.params.userId, req.body).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec((err, user) => {
                    if (err) { return next(err); }
                    res.json(user);
                });
        });

        app.route('/api/users/changePassword').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            User.findById(req.params.userId).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').select('+password').exec((err, user) => {
                    if (err) { return next(err); }
                    if (user.password !== req.body.oldPassword) {
                        res.status(403).send({ message: "Old Password did not match" })
                    } else {
                        user.password = req.body.newPassword
                        User.findByIdAndUpdate(req.params.id, user).populate('addresses').populate('messages')
                            .populate('orders').populate('wishlist').exec((err, user) => {
                                if (err) { return next(err) }
                                res.json(user)
                            })
                    }
                });
        });
    }
}
