import { Request, Response, NextFunction } from 'express';
import Product from '../src/app/schema/product'

export class ProductsRoute {

    public productRoute(app): void {
        app.route('/api/products').post((req: Request, res: Response, next: NextFunction) => {
            Product.find(req.body, (err, products) => {
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

        app.route('/api/').post((req: Request, res: Response, next: NextFunction) => {
            Product.create(req.body, (err, product) => {
                if (err) { return next(err); }
                res.json(product);
            });
        });

        app.route('/api/:id').put((req: Request, res: Response, next: NextFunction) => {
            Product.findByIdAndUpdate(req.params.id, req.body, (err, product) => {
                if (err) { return next(err); }
                res.json(product);
            });
        });

        app.route('/api/:id').delete((req: Request, res: Response, next: NextFunction) => {
            Product.findByIdAndRemove(req.params.id, req.body, (err, product) => {
                if (err) { return next(err); }
                res.json(product);
            });
        });
    }
}