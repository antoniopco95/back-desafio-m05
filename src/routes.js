const express = require("express");
const rotas = express();
const { editUser } = require("./controllers/editUser");
const { authorizeUser } = require("./middlewares/authentication");
const { register } = require("./controllers/userRegister");
const { login } = require("./controllers/userLogin");
const {
  getClient,
  getClientDefaulter,
  getClientToday,
  createNewClient
} = require("./controllers/client");
const {
  chargesOverdue,
  expectedCharges,
  paidCharges,
  createCharge
} = require("./controllers/charges");
const { validateReq } = require("./middlewares/validation");
const {
  registerUserSchema,
  registerClientSchema,
} = require("./validators/registerSchema");

rotas.use(express.json());

rotas.post("/registrar", validateReq(registerUserSchema), register);
rotas.post("/login", login);
rotas.put("/editar/:id", authorizeUser, editUser);
rotas.get("/clientes", authorizeUser, getClient);
rotas.get("/cobrancas/vencidas", authorizeUser, chargesOverdue);
rotas.get("/cobrancas/previstas", authorizeUser, expectedCharges);
rotas.get("/cobrancas/pagas", authorizeUser, paidCharges);
rotas.post("/cobrancas", authorizeUser, createCharge);
rotas.get("/clientes/inadimplentes", authorizeUser, getClientDefaulter);
rotas.get("/clientes/em-dia", authorizeUser, getClientToday);
rotas.post("/create-cliente", authorizeUser, validateReq(registerClientSchema), createNewClient),
  module.exports = rotas;
