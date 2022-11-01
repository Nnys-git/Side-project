const { valid } = require("joi");
const Joi = require("joi");

//Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(100).required().email(), //檢查是否是email格式
    password: Joi.string().min(6).max(1024).required(),
    role: Joi.string().valid("student", "instructor").required(),
  }); //.valid()跟enum依樣會見查是否user輸入的值是括弧中的值
  return schema.validate(data);
  //回傳藉由這個Joi object檢查後的物件
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
