/**
 * Sends a standardized success response.
 * @param {Response} res Express response object
 * @param {String} message Success message
 * @param {Object} data Response data payload
 * @param {Number} statuscode HTTP status code (default: 200)
 */
export const sendSuccessResponse = (res, message, data = {}, statuscode = 200) => {
  res.status(statuscode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response.
 * @param {Response} res Express response object
 * @param {String} message Error descriptive message
 * @param {Object|String} error Detailed error information
 * @param {Number} statuscode HTTP status code (default: 500)
 */
export const sendErrorResponse = (res, message, error = {}, statuscode = 500) => {
  res.status(statuscode).json({
    success: false,
    message,
    error: typeof error === "object" && error !== null ? error : { message: error },
  });
};
