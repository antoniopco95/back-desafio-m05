const joi = require("joi");

const registerUserSchema = joi.object({
  nome: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
  }),
  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório",
    "string.empty": "O campo email é obrigatório",
    "string.email": "O campo email precisa ter um formato válido",
  }),
  senha: joi.string().min(8).required().messages({
    "any.required": "O campo senha é obrigatório",
    "string.empty": "O campo senha é obrigatório",
  }),
});

const registerClientSchema = joi.object({
  nome: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
  }),
  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório",
    "string.empty": "O campo email é obrigatório",
    "string.email": "O campo email precisa ter um formato válido",
  }),
  cpf: joi.number().required().messages({
    "string.empty": "O campo senha é obrigatório",
  }),
  telefone: joi.string().required().messages({
    "string.empty": "O campo telefone é obrigatório",
  }),
});

module.exports = { registerUserSchema, registerClientSchema };
