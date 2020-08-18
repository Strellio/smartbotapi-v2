'use strict'
import { Request, Response, NextFunction } from "express";
import { createHmac } from "../../../../lib/utils";
import config from "../../../../config";
import errors from "../../../../lib/errors";
import { get } from "lodash/fp";





export const verifyWebhook = ({ path, secret, hasSplit = false }: {
    path: string
    secret: string
    hasSplit: boolean
}) => (req: Request, res: Response, next: NextFunction) => {
    const hubSignature: string = get(path, req)
    const [algorithm, signature] = hubSignature.split("=")
    const hmacFromHeader = hasSplit ? signature : hubSignature
    const hmacAlgorithm = - hasSplit ? algorithm : "sha256"
    try {
        const hmac = createHmac({ secret: config.get("INTERCOM_CLIENT_SECRET") as any, data: JSON.stringify(req.body), algorithm: hmacAlgorithm })
        if (hmac !== hmacFromHeader) {
            throw errors.throwError({
                name: errors.WebhookValidationFailed,
                message: "invalid signature"
            })
        }
        next()
    } catch (error) {
        next(error)

    }
}