const {
  validateEmailDomain,
  emailExists,
} = require("../validators/userValidator");
const knex = require("knex")(require("../knexfile").development);
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");

const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.json({ error: "Todos os campos devem ser preenchidos" });
    }

    const result = await knex("usuarios").where("email", email).first();
    if (result) {
      return res.json({ error: "O email ja se encontra em uso" });
    }

    if (!validateEmailDomain(email)) {
      return res.status(400).json({ error: "Por favor, use um e-mail válido" });
    }

    const hash = await bcrypt.hash(senha, 10);
    const user = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: hash,
        cpf,
        telefone,
      })
      .returning("*");
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar o usuário." });
  }
};

module.exports = {
  register,
};
