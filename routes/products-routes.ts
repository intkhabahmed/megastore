import { NextFunction, Request, Response } from 'express';
import Product from '../src/app/schema/product';
import { verifyToken } from './../helpers/jwt-helper';

export class ProductsRoute {

    public productRoute(app): void {
        app.route('/api/products').post((req: Request, res: Response, next: NextFunction) => {
            var limit = req.body.limit || Number.MAX_SAFE_INTEGER
            delete req.body.limit
            Product.find(req.body).limit(limit).exec((err, products) => {
                if (err) { return next(err); }
                res.json(products);
            });
        });

        app.route('/api/:id').get((req: Request, res: Response, next: NextFunction) => {
            Product.findById(req.params.id, (err, product) => {
                if (err) { return next(err); }
                res.json(product);
            });
        });

        app.route('/api/').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Product.create(req.body, (err, product) => {
                    if (err) { return next(err); }
                    res.json(product);
                })
            }
        })

        app.route('/api/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            delete req.body.selectedIndex
            delete req.body.subIndex
            Product.findByIdAndUpdate(req.params.id, req.body, (err, product) => {
                if (err) { return next(err); }
                res.json(product);
            });
        });

        app.route('/api/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Product.findByIdAndRemove(req.params.id, req.body, (err, product) => {
                    if (err) { return next(err); }
                    res.json(product);
                })
            }
        });
    }
}
