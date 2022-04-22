const { required } = require("joi");
const joi = require("joi");

function userValidation(body) {
  const userValidateSchema = joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().min(8).max(20).required(),
  });
  return userValidateSchema.validate(body);
}

// function sauceValidation(body) {
//     const sauceValidationSchema = joi.object({
//         userId: ,
//   name: ,
//   manufacturer: ,
//   description: ,
//   mainPepper: ,
//   imageUrl: ,
//   heat: ,
//   likes: ,
//   dislikes: ,
//   usersLiked: ,
//   usersDisliked: ,
//     })
//     return.sauceValidationSchema.validate(body);
// }

module.exports = userValidation;
