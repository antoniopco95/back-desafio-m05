const knex = require("knex")(require("../knexfile").development);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passwordJwt = process.env.JWT_HASH;

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await knex("usuarios").where("email", email).first();

    if (!user) {
      return res.status(404).json({ error: "E-mail ou senha inválido." });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res.status(404).json({ error: "E-mail ou senha inválido." });
    }

    const token = jwt.sign({ id: user.id }, passwordJwt, { expiresIn: "8h" });

    const { senha: _, ...userLogged } = user;

    return res.json({ usuario: userLogged, token });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao logar o usuário." });
  }
};


module.exports = { login };
