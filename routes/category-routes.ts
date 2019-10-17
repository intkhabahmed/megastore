import { verifyToken } from './../helpers/jwt-helper';
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

        app.route('/api/categories').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Category.create(req.body, (err, category) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(category)
                })
            }
        })

        app.route('/api/categories/:id').put(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Category.findByIdAndUpdate(req.params.id, req.body, (err, category) => {
                    if (err) { return next(err); }
                    res.json(category);
                })
            }
        })

        app.route('/api/categories/:id').delete(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Category.findByIdAndRemove(req.params.id, req.body, (err, category) => {
                    if (err) { return next(err); }
                    res.json(category);
                });
            }
        })
    }
}