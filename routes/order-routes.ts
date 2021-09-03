import { verifyToken } from './../helpers/jwt-helper';
import { Request, Response, NextFunction } from 'express'
import Order from '../src/app/schema/order'

export class OrdersRoute {
    public orderRoute(app) {
        app.route('/api/orders/all').get(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Order.find().populate('user').populate('payment').exec((err, orders) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(orders)
                })
            }
        })

        app.route('/api/orders').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            req.body.user = req.params.userId
            Order.create(req.body, (err, order) => {
                if (err) {
                    return next(err)
                }
                res.json(order)
            })
        })

        app.route('/api/orders/user/:id').get(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            Order.find({ user: req.params.id, orderStatus: { $ne: 3 } }).populate('user').populate('payment').exec((err, orders) => {
                if (err) { return next(err); }
                res.json(orders);
            })
        })

        app.route('/api/orders/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Order.findByIdAndUpdate(req.params.id, req.body).populate('user').populate('payment').exec((err, order) => {
                    if (err) { return next(err); }
                    res.json(order);
                })
            }
        })

        app.route('/api/orders/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Order.findByIdAndRemove(req.params.id, req.body).populate('user').populate('payment').exec((err, order) => {
                    if (err) { return next(err); }
                    res.json(order);
                })
            }
        })
    }
}
