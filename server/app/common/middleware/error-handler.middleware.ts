
import type { ErrorResponse } from "../helper/response.helper";
import { type ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const response: ErrorResponse = {
    success: false,
    error_code: (err?.status ?? 500) as number,
    message: (err?.message ?? "Something went wrong!") as string,
    data: err?.data ?? {},
  };

  console.error("SERVER_ERROR:", response);

  res.status(response.error_code).send(response);
  next();
};

export default errorHandler;