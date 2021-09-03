import { Request } from "express";

const jwt = require('jsonwebtoken');
export const verifyToken = (req: Request, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    let token = req.headers.authorization.split(" ")[1]
    if (token == 'null') {
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    let payload = jwt.verify(token, 'craft-megastore-secret-key')
    if (!payload) {
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    req.params.userId = payload.subject
    req.params.isAdmin = payload.isAdmin
    next()
}
