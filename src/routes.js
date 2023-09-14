const express = require("express");
const rotas = express();
const { register } = require("./controllers/userRegister");
const { login } = require("./controllers/userLogin");

rotas.use(express.json());

rotas.post("/registrar", register);
rotas.post("/login", login);

module.exports = rotas;
