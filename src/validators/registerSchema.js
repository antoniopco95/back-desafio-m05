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
  cpf: joi
    .string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "any.required": "O campo cpf é obrigatório",
      "string.empty": "O campo cpf é obrigatório",
      "string.cpf": "O campo cpf precisa ter um formato válido",
    }),
  telefone: joi
    .string()
    .min(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "any.required": "O campo telefone é obrigatório",
      "string.empty": "O campo telefone é obrigatório",
      "string.telefone": "O campo telefone precisa ter um formato válido",
      "string.lenght": "O campo telefone precisa ter um formato válido",
    }),
  cep: joi.string().allow().allow(""),

  endereco: joi.string().allow().allow(""),

  complemento: joi.string().allow().allow(""),

  bairro: joi.string().allow().allow(""),

  cidade: joi.string().allow().allow(""),

  uf: joi.string().allow().allow(""),
});

module.exports = { registerUserSchema, registerClientSchema };
