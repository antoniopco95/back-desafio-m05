const { validateEmailDomain } = require("../validators/userValidator");
const knex = require("knex")(require("../knexfile").development);
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    if (!validateEmailDomain(email)) {
      return res.status(400).json({ error: "Por favor, use um e-mail válido" });
    }

    const existEmail = await knex("usuarios").where("email", email).first();

    if (existEmail) {
      return res.status(400).json({ error: "O email ja se encontra em uso" });
    }

    const hash = await bcrypt.hash(senha, 10);

    await knex("usuarios")
      .insert({
        nome,
        email,
        senha: hash,
      })
      .returning(["nome", "email"]);

    return res.json({ message: "Cadastro Concluido" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar o usuário." });
  }
};

module.exports = {
  register,
};
