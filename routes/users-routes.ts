import { NextFunction, Request, Response } from 'express';
import User from '../src/app/schema/user';
import { throwError } from 'rxjs';

export class UsersRoute {
    public userRoute(app) {
        app.route('/api/users/register').post((req: Request, res: Response, next: NextFunction) => {
            User.create(req.body, (err, users) => {
                if (err) {
                    return next(err)
                }
                res.json(users)
            })
        })

        app.route('/api/users/all').get((req: Request, res: Response, next: NextFunction) => {
            User.find((err, users) => {
                if (err) {
                    return next(err)
                }
                res.json(users)
            })
        })

        app.route('/api/users/authenticate').post((req: Request, res: Response, next: NextFunction) => {
            User.findOne(req.body, (err, user) => {
                if (err) {
                    return next(err)
                }
                if (user) {
                    res.json(user)
                } else {
                    res.status(404).send({ message: "Email/Password is incorrect" })
                }
            })
        })

        app.route('/api/users/:id').put((req: Request, res: Response, next: NextFunction) => {
            User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
                if (err) { return next(err); }
                res.json(user);
            });
        });

        app.route('/api/users/:id').delete((req: Request, res: Response, next: NextFunction) => {
            User.findByIdAndRemove(req.params.id, req.body, (err, user) => {
                if (err) { return next(err); }
                res.json(user);
            });
        });
    }
}