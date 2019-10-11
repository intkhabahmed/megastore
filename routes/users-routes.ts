import { NextFunction, Request, Response } from 'express';
import User from '../src/app/schema/user';

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
                        User.create(req.body, (err, users) => {
                            if (err) {
                                return next(err)
                            }
                            res.json(users)
                        })
                    }
                })
        })

        app.route('/api/users/all').get((req: Request, res: Response, next: NextFunction) => {
            User.find().populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec((err, users) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(users)
                })
        })

        app.route('/api/users/authenticate').post((req: Request, res: Response, next: NextFunction) => {
            User.findOne({ email: req.body.email }).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').select('+password').exec((err, user) => {
                    if (err) {
                        return next(err)
                    }
                    if (user) {
                        if (user.password === req.body.password) {
                            user.password = undefined
                            res.json(user)
                        } else {
                            res.status(400).send({ message: "Email/Password is incorrect" })
                        }

                    } else {
                        res.status(404).send({ message: "Email does not exists" })
                    }
                })
        })

        app.route('/api/users/:id').get((req: Request, res: Response, next: NextFunction) => {
            User.findById(req.params.id).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec((err, user) => {
                    if (err) { return next(err); }
                    res.json(user);
                });
        });

        app.route('/api/users/:id').put((req: Request, res: Response, next: NextFunction) => {
            User.findByIdAndUpdate(req.params.id, req.body).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec((err, user) => {
                    if (err) { return next(err); }
                    res.json(user);
                });
        });

        app.route('/api/users/:id').delete((req: Request, res: Response, next: NextFunction) => {
            User.findByIdAndRemove(req.params.id, req.body).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec((err, user) => {
                    if (err) { return next(err); }
                    res.json(user);
                });
        });

        app.route('/api/users/changePassword/:id').put((req: Request, res: Response, next: NextFunction) => {
            User.findById(req.params.id).populate('addresses').populate('messages')
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