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

        app.route('/api/grossWeights').post((req: Request, res: Response, next: NextFunction) => {
            GrossWeight.create(req.body, (err, grossWeight) => {
                if (err) {
                    return next(err)
                }
                res.json(grossWeight)
            })
        })

        app.route('/api/grossWeights/:id').put((req: Request, res: Response, next: NextFunction) => {
            GrossWeight.findByIdAndUpdate(req.params.id, req.body, (err, grossWeight) => {
                if (err) { return next(err); }
                res.json(grossWeight);
            });
        });

        app.route('/api/grossWeights/:id').delete((req: Request, res: Response, next: NextFunction) => {
            GrossWeight.findByIdAndRemove(req.params.id, req.body, (err, grossWeight) => {
                if (err) { return next(err); }
                res.json(grossWeight);
            });
        });
    }
}