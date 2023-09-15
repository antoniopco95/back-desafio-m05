const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile").development);
const passwordJwt = process.env.JWT_HASH;

const authorizeUser = async (req, res, next) => {
  const tokenAut = req.headers['authorization'];

  if (!tokenAut) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
  const parts = tokenAut.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no token.' });
  }
   const token = parts[1];

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
