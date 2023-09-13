const express = require("express");
const rotas = express();
const { register } = require("./controllers/userRegister");

rotas.use(express.json());

rotas.post("/registrar", register);

module.exports = rotas;
