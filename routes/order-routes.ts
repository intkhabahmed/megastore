import { Request, Response, NextFunction } from 'express'
import Order from '../src/app/schema/order'

export class OrdersRoute {
    public orderRoute(app) {
        app.route('/api/orders/all').get((req: Request, res: Response, next: NextFunction) => {
            Order.find().populate('user').populate('address').exec((err, orders) => {
                if (err) {
                    return next(err)
                }
                res.json(orders)
            })
        })

        app.route('/api/orders').post((req: Request, res: Response, next: NextFunction) => {
            Order.create(req.body, (err, order) => {
                if (err) {
                    return next(err)
                }
                res.json(order)
            })
        })

        app.route('/api/orders/user/:id').get((req: Request, res: Response, next: NextFunction) => {
            Order.find({ user: req.params.id }).populate('user').populate('address').exec((err, orders) => {
                if (err) { return next(err); }
                res.json(orders);
            });
        });

        app.route('/api/orders/:id').put((req: Request, res: Response, next: NextFunction) => {
            Order.findByIdAndUpdate(req.params.id, req.body).populate('user').populate('address').exec((err, order) => {
                if (err) { return next(err); }
                res.json(order);
            });
        });

        app.route('/api/orders/:id').delete((req: Request, res: Response, next: NextFunction) => {
            Order.findByIdAndRemove(req.params.id, req.body).populate('user').populate('address').exec((err, order) => {
                if (err) { return next(err); }
                res.json(order);
            });
        });
    }
}