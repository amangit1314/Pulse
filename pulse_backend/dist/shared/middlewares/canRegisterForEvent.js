import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { Messages } from "../../core/constants/messages.js";
import { ErrorCodes } from "../../core/constants/errorCodes.js";
// 🔹 Simulated DB call — replace with Prisma or your repo layer
async function findRegistration(eventId, email) {
    const registrations = [
        { eventId: 1, email: "test@example.com" }, // sample
    ];
    return registrations.find(r => r.eventId === eventId && r.email === email);
}
export async function canRegisterForEvent(req, res, next) {
    try {
        const eventId = Number(req.params.event_id);
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json(ApiResponse.error(Messages.VALIDATION.INVALID_INPUT, ErrorCodes.GENERAL.VALIDATION));
        }
        const existingRegistration = await findRegistration(eventId, email);
        if (existingRegistration) {
            return res
                .status(400)
                .json(ApiResponse.error(Messages.REGISTRATION.DUPLICATE, ErrorCodes.REGISTRATION.DUPLICATE));
        }
        next();
    }
    catch (err) {
        next(err);
    }
}
