import { Request, Response, NextFunction } from 'express'
import ShippingRate from '../src/app/schema/shipping-rate'

export class ShippingRatesRoute {
    public shippingRoute(app) {
        app.route('/api/shippingRates').post((req: Request, res: Response, next: NextFunction) => {
            ShippingRate.create(req.body, (err, shippingRate) => {
                if (err) {
                    return next(err)
                }
                res.json(shippingRate)
            })
        })

        app.route('/api/shippingRates/filter').post((req: Request, res: Response, next: NextFunction) => {
            ShippingRate.find(req.body, (err, shippingRate) => {
                if (err) {
                    return next(err)
                }
                res.json(shippingRate)
            })
        })

        app.route('/api/shippingRates/all').get((req: Request, res: Response, next: NextFunction) => {
            ShippingRate.find((err, shippingRates) => {
                if (err) {
                    return next(err)
                }
                res.json(shippingRates)
            })
        })

        app.route('/api/shippingRates/:id').put((req: Request, res: Response, next: NextFunction) => {
            ShippingRate.findByIdAndUpdate(req.params.id, req.body, (err, shippingRate) => {
                if (err) { return next(err); }
                res.json(shippingRate);
            });
        });

        app.route('/api/shippingRates/:id').delete((req: Request, res: Response, next: NextFunction) => {
            ShippingRate.findByIdAndRemove(req.params.id, req.body, (err, shippingRate) => {
                if (err) { return next(err); }
                res.json(shippingRate);
            });
        });
    }
}