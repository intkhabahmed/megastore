import { verifyToken } from './../helpers/jwt-helper';
import { NextFunction, Request, Response } from 'express';
import Banner from '../src/app/schema/banner';

export class BannersRoute {
    public bannerRoute(app) {
        app.route('/api/banners/all').get((req: Request, res: Response, next: NextFunction) => {
            Banner.find((err, banners) => {
                if (err) { return next(err); }
                res.json(banners);
            });
        });

        app.route('/api/banners').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Banner.create(req.body, (err, banner) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(banner)
                })
            }
        })

        app.route('/api/banners/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Banner.findByIdAndUpdate(req.params.id, req.body, (err, banner) => {
                    if (err) { return next(err); }
                    res.json(banner);
                })
            }
        })

        app.route('/api/banners/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Banner.findByIdAndRemove(req.params.id, req.body, (err, banner) => {
                    if (err) { return next(err); }
                    res.json(banner);
                });
            }
        })
    }
}
