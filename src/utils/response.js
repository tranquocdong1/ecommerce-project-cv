export const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    data,
  });
};
