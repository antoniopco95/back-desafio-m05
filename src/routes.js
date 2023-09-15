const express = require("express");
const rotas = express();
const{ editUser} = require("./controllers/editUser")
const {authorizeUser} = require("./middlewares/authentication")
const { register } = require("./controllers/userRegister");
const { login } = require("./controllers/userLogin");
const { getClient } = require("./controllers/client");
const { chargesOverdue, expectedCharges, paidCharges } = require("./controllers/charges");

rotas.use(express.json());

rotas.post("/registrar", register);
rotas.post("/login", login);
rotas.put("/editar/:id", authorizeUser, editUser )
rotas.get("/clientes", authorizeUser, getClient)
rotas.get("/cobrancas/vencidas", authorizeUser, chargesOverdue)
rotas.get("/cobrancas/previstas", authorizeUser, expectedCharges)
rotas.get("/cobrancas/pagas", authorizeUser, paidCharges)
module.exports = rotas;
