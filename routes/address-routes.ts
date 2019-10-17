import { NextFunction, Request, Response } from 'express';
import Address from '../src/app/schema/address';
import { verifyToken } from './../helpers/jwt-helper';

export class AddressesRoute {
    public addressRoute(app) {
        app.route('/api/addresses').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            Address.create(req.body, (err, address) => {
                if (err) {
                    return next(err)
                }
                res.json(address)
            })
        })

        app.route('/api/addresses/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            Address.findByIdAndUpdate(req.params.id, req.body).populate('user').exec((err, address) => {
                if (err) { return next(err); }
                res.json(address);
            });
        });

        app.route('/api/addresses/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            Address.findByIdAndRemove(req.params.id, req.body).populate('user').exec((err, address) => {
                if (err) { return next(err); }
                res.json(address);
            });
        });
    }
}