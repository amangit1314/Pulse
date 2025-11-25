import { ErrorCodes } from "../../core/constants/errorCodes.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
export function errorHandler(err, req, res, next) {
    console.error("Error:", err);
    res
        .status(err.statusCode || 500)
        .json(ApiResponse.error(err.message || "Internal Server Error", err.code || ErrorCodes.GENERAL.SERVER, err.statusCode || 500));
}
