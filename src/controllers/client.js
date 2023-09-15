const knex = require("knex")(require("../knexfile").development);

knex;
const getClient = async (req, res) => {
  try {
    const client = await knex("cliente").select("*");
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao buscar clientes.");
  }
};
const createNewClient = async (req, res) => {};
module.exports = { getClient };
