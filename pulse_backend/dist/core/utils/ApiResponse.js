export class ApiResponse {
    static success(message, data) {
        return { success: true, message, data };
    }
    static error(message, code, statusCode = 400) {
        return { success: false, message, code, statusCode };
    }
}
