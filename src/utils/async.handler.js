export const asyncHandler = (controler) => (req, res, next) =>
   Promise.resolve(controler(req, res, next)).catch((err) => next(err));
