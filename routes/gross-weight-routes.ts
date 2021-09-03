import { verifyToken } from './../helpers/jwt-helper';
import { Request, Response, NextFunction } from 'express'
import GrossWeight from '../src/app/schema/gross-weight'

export class GrossWeightsRoute {
    public grossWeightRoute(app) {
        app.route('/api/grossWeights/all').get((req: Request, res: Response, next: NextFunction) => {
            GrossWeight.find((err, grossWeights) => {
                if (err) { return next(err); }
                res.json(grossWeights);
            });
        });

        app.route('/api/grossWeights').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                GrossWeight.create(req.body, (err, grossWeight) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(grossWeight)
                })
            }
        })

        app.route('/api/grossWeights/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                GrossWeight.findByIdAndUpdate(req.params.id, req.body, (err, grossWeight) => {
                    if (err) { return next(err); }
                    res.json(grossWeight);
                });
            }
        });

        app.route('/api/grossWeights/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                GrossWeight.findByIdAndRemove(req.params.id, req.body, (err, grossWeight) => {
                    if (err) { return next(err); }
                    res.json(grossWeight);
                });
            }
        });
    }
}
