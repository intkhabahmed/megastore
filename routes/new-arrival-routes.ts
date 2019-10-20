import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/jwt-helper';
import NewArrival from '../src/app/schema/new-arrival';

export class NewArrivalsRoute {
    public newArrivalRoute(app) {
        app.route('/api/newArrivals/all').get((req: Request, res: Response, next: NextFunction) => {
            NewArrival.find((err, newArrivals) => {
                if (err) { return next(err); }
                res.json(newArrivals);
            });
        });

        app.route('/api/newArrivals').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                NewArrival.create(req.body, (err, newArrival) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(newArrival)
                })
            }
        })

        app.route('/api/newArrivals/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                NewArrival.findByIdAndUpdate(req.params.id, req.body, (err, newArrival) => {
                    if (err) { return next(err); }
                    res.json(newArrival);
                })
            }
        })

        app.route('/api/newArrivals/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                NewArrival.findByIdAndRemove(req.params.id, req.body, (err, newArrival) => {
                    if (err) { return next(err); }
                    res.json(newArrival);
                });
            }
        })
    }
}