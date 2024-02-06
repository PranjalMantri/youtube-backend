// const asyncHandler = (handlerFunction) => {
//   return (req, res, next) => {
//     Promise.resolve(handlerFunction(req, res, next)).catch((err) => next(err));
//   };
// };

const asyncHandler = (handlerFunction) => {
  (req, res, next) => {
    Promise.resolve(handlerFunction(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

const asyncHandle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.send(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};
