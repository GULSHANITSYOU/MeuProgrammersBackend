class apiResponse {
  constructor(status, statusCode, data, massage = "success fully fetched") {
    this.status = status;
    this.statusCode = statusCode;
    this.data = data;
    this.massage = massage;
  }
}

export { apiResponse };

