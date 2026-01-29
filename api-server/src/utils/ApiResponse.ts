class ApiResponse {
  statusCode: number;
  data: Record<string, unknown>;
  message: string;
  success: boolean;

  constructor(statusCode: number, message: string = "Success", data: Record<string, unknown>) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
