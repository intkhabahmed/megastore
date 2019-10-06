import { Request, Response, NextFunction } from 'express'
import Address from '../src/app/schema/address'

export class AddressesRoute {
    public addressRoute(app) {
        app.route('/api/addresses/all').get((req: Request, res: Response, next: NextFunction) => {
            Address.find().populate('user').exec((err, addresses) => {
                if (err) { return next(err); }
                res.json(addresses);
            });
        });

        app.route('/api/addresses').post((req: Request, res: Response, next: NextFunction) => {
            Address.create(req.body, (err, address) => {
                if (err) {
                    return next(err)
                }
                res.json(address)
            })
        })

        app.route('/api/addresses/:id').put((req: Request, res: Response, next: NextFunction) => {
            Address.findByIdAndUpdate(req.params.id, req.body).populate('user').exec((err, address) => {
                if (err) { return next(err); }
                res.json(address);
            });
        });

        app.route('/api/addresses/:id').delete((req: Request, res: Response, next: NextFunction) => {
            Address.findByIdAndRemove(req.params.id, req.body).populate('user').exec((err, address) => {
                if (err) { return next(err); }
                res.json(address);
            });
        });
    }
}