const jwt = require("jsonwebtoken");
const { default: knex } = require("knex");
const passwordJwt = process.env.JWT_HASH;

const authorizeUser = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, passwordJwt);

    const userExists = await knex("usuarios").where("id", id).first();

    if (!userExists) {
      return res.status(401).json({ mensagem: "Não autorizado." });
    }

    req.usuario = userExists;

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
};

module.exports = { authorizeUser };
