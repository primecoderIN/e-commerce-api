const BigPromise = (controller) => (req, res, next) => {
  return Promise.resolve(controller(req, res, next)).catch(next);
};
module.exports = BigPromise;


//Big promise using async await 

// const asyncWrapper = (controller) => {
//   return async (req, res, next) => {
//     try {
//       await controller(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// module.exports = asyncWrapper;
