import { validationResult } from "express-validator";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { Messages } from "../../core/constants/messages.js";
import { ErrorCodes } from "../../core/constants/errorCodes.js";
export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(ApiResponse.error(Messages.VALIDATION.INVALID_INPUT, ErrorCodes.GENERAL.VALIDATION));
    }
    next();
}
