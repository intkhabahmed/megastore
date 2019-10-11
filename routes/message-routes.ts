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
            Message.find().populate('user').exec((err, messages) => {
                if (err) {
                    return next(err)
                }
                res.json(messages)
            })
        })

        app.route('/api/messages/user/:id').get((req: Request, res: Response, next: NextFunction) => {
            Message.find({ userId: req.params.id }).populate('user').exec((err, message) => {
                if (err) { return next(err); }
                res.json(message);
            });
        });

        app.route('/api/messages/:id').put((req: Request, res: Response, next: NextFunction) => {
            Message.findByIdAndUpdate(req.params.id, req.body).populate('user').exec((err, message) => {
                if (err) { return next(err); }
                res.json(message);
            });
        });

        app.route('/api/messages/:id').delete((req: Request, res: Response, next: NextFunction) => {
            Message.findByIdAndRemove(req.params.id, req.body).populate('user').exec((err, message) => {
                if (err) { return next(err); }
                res.json(message);
            });
        });
    }
}