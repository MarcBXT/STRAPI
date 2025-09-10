'use strict';

const errorResponse400 = (message, detail) => ({
  error: "BAD REQUEST",
  message,
  statusCode: 400,
  detail
});


module.exports = { errorResponse400 };