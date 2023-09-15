const express = require("express");
const rotas = express();
const{ editUser} = require("./controllers/editUser")
const {authorizeUser} = require("./middlewares/authentication")
const { register } = require("./controllers/userRegister");
const { login } = require("./controllers/userLogin");

rotas.use(express.json());

rotas.post("/registrar", register);
rotas.post("/login", login);
rotas.put("/editar/:id", authorizeUser, editUser )

module.exports = rotas;
