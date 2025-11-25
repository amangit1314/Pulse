export class ApiResponse {
  static success(message: string, data?: any) {
    return { success: true, message, data };
  }

  static error(message: string, code: string, statusCode = 400) {
    return { success: false, message, code, statusCode };
  }
}
