import { Request, Response, NextFunction } from 'express'
import Message from '../src/app/schema/message'

export class MessagesRoute {
    public orderRoute(app) {
        app.route('/api/messages').post((req: Request, res: Response, next: NextFunction) => {
            Message.create(req.body, (err, message) => {
                if (err) {
                    return next(err)
                }
                res.json(message)
            })
        })

        app.route('/api/messages/all').get((req: Request, res: Response, next: NextFunction) => {
            Message.find((err, messages) => {
                if (err) {
                    return next(err)
                }
                res.json(messages)
            })
        })

        app.route('/api/orders/user/:id').get((req: Request, res: Response, next: NextFunction) => {
            Message.find({ userId: req.params.id }, (err, message) => {
                if (err) { return next(err); }
                res.json(message);
            });
        });

        app.route('/api/messages/:id').put((req: Request, res: Response, next: NextFunction) => {
            Message.findByIdAndUpdate(req.params.id, req.body, (err, message) => {
                if (err) { return next(err); }
                res.json(message);
            });
        });

        app.route('/api/messages/:id').delete((req: Request, res: Response, next: NextFunction) => {
            Message.findByIdAndRemove(req.params.id, req.body, (err, message) => {
                if (err) { return next(err); }
                res.json(message);
            });
        });
    }
}