import { NextFunction, Request, Response } from 'express';
import Category from '../src/app/schema/category';

export class CategoriesRoute {
    public categoryRoute(app) {
        app.route('/api/categories/all').get((req: Request, res: Response, next: NextFunction) => {
            Category.find((err, categories) => {
                if (err) { return next(err); }
                res.json(categories);
            });
        });

        app.route('/api/categories').post((req: Request, res: Response, next: NextFunction) => {
            Category.create(req.body, (err, category) => {
                if (err) {
                    return next(err)
                }
                res.json(category)
            })
        })

        app.route('/api/categories/:id').put((req: Request, res: Response, next: NextFunction) => {
            Category.findByIdAndUpdate(req.params.id, req.body, (err, category) => {
                if (err) { return next(err); }
                res.json(category);
            });
        });

        app.route('/api/categories/:id').delete((req: Request, res: Response, next: NextFunction) => {
            Category.findByIdAndRemove(req.params.id, req.body, (err, category) => {
                if (err) { return next(err); }
                res.json(category);
            });
        });
    }
}