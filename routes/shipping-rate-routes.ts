import { NextFunction, Request, Response } from 'express';
import ShippingRate from '../src/app/schema/shipping-rate';
import { verifyToken } from './../helpers/jwt-helper';

export class ShippingRatesRoute {
    public shippingRoute(app) {
        app.route('/api/shippingRates').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                ShippingRate.create(req.body, (err, shippingRate) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(shippingRate)
                })
            }
        })

        app.route('/api/shippingRates/filter').post((req: Request, res: Response, next: NextFunction) => {
            ShippingRate.find(req.body, (err, shippingRate) => {
                if (err) {
                    return next(err)
                }
                res.json(shippingRate)
            })
        })

        app.route('/api/shippingRates/calculate').post((req: Request, res: Response, next: NextFunction) => {
            ShippingRate.findOne(req.body, (err, shippingRate) => {
                if (err) {
                    return next(err)
                }
                if (shippingRate) {
                    res.json(shippingRate)
                } else {
                    res.status(404).send({ message: "Invalid value" })
                }
            })
        })

        app.route('/api/shippingRates/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                ShippingRate.findByIdAndUpdate(req.params.id, req.body, (err, shippingRate) => {
                    if (err) { return next(err); }
                    res.json(shippingRate);
                })
            }
        })

        app.route('/api/shippingRates/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                ShippingRate.findByIdAndRemove(req.params.id, req.body, (err, shippingRate) => {
                    if (err) { return next(err); }
                    res.json(shippingRate);
                })
            }
        })
    }
}
