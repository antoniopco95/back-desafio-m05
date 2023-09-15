const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile").development);
const passwordJwt = process.env.JWT_HASH;

const authorizeUser = async (req, res, next) => {
  const tokenAUt = req.headers['authorization'];
  console.log(tokenAUt)

  if (!tokenAUt) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  // const token = tokenAUt.split(" ")[1];

  try {
    const { id } = jwt.verify(tokenAUt, passwordJwt);
    console.log(id)

    const userExists = await knex("usuarios").where("id", id).first();

    if (!userExists) {
      return res.status(401).json({ mensagem: "Não autorizado." });
    }

    req.usuario = userExists;

    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
};

module.exports = { authorizeUser };
