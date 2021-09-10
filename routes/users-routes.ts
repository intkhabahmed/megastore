import { NextFunction, Request, Response } from 'express';
import User from '../src/app/schema/user';
import { secretKey, senderEmail, senderPassword } from './../helpers/config';
import { verifyToken } from './../helpers/jwt-helper';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import ResetToken from 'src/app/schema/reset-token';
import { clientUrl } from 'src/environments/environment';
import * as nodemailer from 'nodemailer';
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
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            if (err) {
                                return next(err)
                            }
                            req.body.password = hash
                            User.create(req.body, (err, user) => {
                                if (err) {
                                    return next(err)
                                }
                                let token = jwt.sign({ subject: user._id, isAdmin: user.isAdmin }, secretKey)
                                res.send({ token })
                            })
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
                        bcrypt.compare(req.body.password, user.password, (err, isPasswordValid) => {
                            if (err) {
                                return next(err)
                            }
                            if (isPasswordValid) {
                                let token = jwt.sign({ subject: user._id, isAdmin: user.isAdmin }, secretKey)
                                res.send({ token })
                            } else {
                                res.status(404).send({ message: "Invalid email or password" })
                            }
                        })

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
                    bcrypt.compare(req.body.oldPassword, user.password, (err, isPasswordValid) => {
                        if (err) { return next(err); }
                        if (isPasswordValid) {
                            bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                                if (err) { return next(err); }
                                user.password = hash
                                user.save((err, user) => {
                                    if (err) { return next(err); }
                                    res.json(user);
                                })
                            })
                        } else {
                            res.status(404).send({ message: "Old Password did not match" })
                        }
                    })
                });
        });

        app.route('/api/users/resetPassword').post((req: Request, res: Response, next: NextFunction) => {
            User.findOne({ email: req.body.email }).populate('addresses').populate('messages')
                .populate('orders').populate('wishlist').exec(async (err, user) => {
                    if (err) { return next(err) }
                    if (user) {
                        await ResetToken.findOneAndDelete({ userId: user._id });
                        let resetToken = crypto.randomBytes(32).toString('hex')
                        const hashedToken = await bcrypt.hash(resetToken, 10)
                        let resetTokenModel = new ResetToken({
                            userId: user._id,
                            token: hashedToken
                        })
                        resetTokenModel.save((err, token) => {
                            if (err) { return next(err) }
                            if (token) {
                                const link = `${clientUrl}/passwordReset?token=${resetToken}&id=${user._id}`
                                let transporter = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: senderEmail,
                                        pass: senderPassword
                                    }
                                });
                                let mailOptions = {
                                    from: senderEmail,
                                    to: req.body.email,
                                    subject: 'Craft Megastore: Reset Password',
                                    html: `<html><body><p>Hi ${user.firstName},</p><p>Please click on the following link to reset your password:</p><p><a href="${link}">${link}</a></p><p>If you did not request this, please ignore this email and your password will remain unchanged.</p></body></html>`
                                };
                                transporter.sendMail(mailOptions, (err, info) => {
                                    if (err) { return next(err) }
                                    res.json({ message: "Email sent" })
                                })
                            }
                        })
                    } else {
                        res.status(404).send({ message: "Email does not exists" })
                    }
                })
        })

        app.route('/api/users/createNewPassword').put((req: Request, res: Response, next: NextFunction) => {
            ResetToken.findOne({ userId: req.body.userId }).exec((err, token) => {
                if (err) { return next(err) }
                if (token) {
                    bcrypt.compare(req.body.token, token.token, (err, isValidToken) => {
                        if (err) { return next(err) }
                        if (isValidToken) {
                            User.findById(token.userId).exec((err, user) => {
                                if (err) { return next(err) }
                                if (user) {
                                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                                        if (err) { return next(err) }
                                        user.password = hash
                                        User.findByIdAndUpdate(user._id, user).exec((err, _user) => {
                                            if (err) { return next(err) }
                                            res.json({ message: "Password updated" })
                                        })
                                    })
                                } else {
                                    res.status(500).send({ message: "Error resetting password, try again later" })
                                }
                            })
                        } else {
                            res.status(404).send({ message: "Token does not exists or expired. Please request a new reset email" })
                        }
                    })
                } else {
                    res.status(404).send({ message: "Token does not exists or expired. Please request a new reset email" })
                }
            })
        })
    }
}
