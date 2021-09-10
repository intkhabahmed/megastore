import { NextFunction, Request, Response } from 'express';
import { convertToJson, decrypt, encrypt } from './../helpers/ccavutil';
import { ccWorkingKey } from './../helpers/config';
import { verifyToken } from './../helpers/jwt-helper';
import { Payment } from './../src/app/models/payment';
import Payments from './../src/app/schema/payment';

export class PaymentsRoute {
    public paymentRoute(app) {
        app.route('/api/ccavRequestHandler').post((req: Request, res: Response, _next: NextFunction) => {
            var encRequest = encrypt(req.body.unencReq, ccWorkingKey);
            res.send({ encRequest })
        })

        app.route('/api/ccavResponseHandler').post((req: Request, res: Response, next: NextFunction) => {
            var ccavResponse = decrypt(req.body.encResp, ccWorkingKey);
            var ccavJson = convertToJson(ccavResponse)
            var payment = new Payment()
            payment.amount = ccavJson.amount
            payment.bankRefNo = ccavJson.bank_ref_no
            payment.cardName = ccavJson.card_name
            payment.failureMessage = ccavJson.failure_message
            payment.orderId = ccavJson.order_id
            payment.orderStatus = ccavJson.order_status
            payment.paymentMode = ccavJson.payment_mode
            payment.statusCode = ccavJson.status_code
            payment.statusMessage = ccavJson.status_message
            payment.trackingId = ccavJson.tracking_id
            payment.transDate = new Date(ccavJson.trans_date)

            Payments.create(payment, (err, _createdPayment) => {
                if (err) {
                    return next(err)
                }
                if (payment.orderStatus === 'Success') {
                    res.redirect('https://www.craftmegastore.in/order-status?status=1')
                } else {
                    res.redirect('https://www.craftmegastore.in/order-status?status=0')
                }
            })
        })

        app.route('/api/payments/order').post(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            Payments.findOne(req.body, (err, payment) => {
                if (err) return next(err)
                res.json(payment)
            })
        })

        app.route('/api/payments/all').get(verifyToken, (req: Request, res: Response, next: NextFunction) => {
            if (!req.params.isAdmin) {
                res.status(401).send({ message: "Unauthorized request" })
            } else {
                Payments.find((err, payments) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(payments)
                })
            }
        })
    }
}
