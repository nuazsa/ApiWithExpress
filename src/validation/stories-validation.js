import Joi from "joi";

const createStoryValidation = Joi.object({
  description: Joi.string().min(3).max(1000).required()
});

const getStoryByIdValidation = Joi.number().min(1).positive().required();

export {
  createStoryValidation,
  getStoryByIdValidation,
}