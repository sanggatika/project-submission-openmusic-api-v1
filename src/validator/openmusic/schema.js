const Joi = require('joi');

const OpenMusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required().min(1990).max(2021),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
});

module.exports = { OpenMusicPayloadSchema };
