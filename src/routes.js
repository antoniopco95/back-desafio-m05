const express = require("express");
const rotas = express();
const { editUser, getUser } = require("./controllers/editUser");
const { authorizeUser } = require("./middlewares/authentication");
const { register } = require("./controllers/userRegister");
const { login } = require("./controllers/userLogin");
const {
  getClient,
  getClientDefaulter,
  getClientToday,
  createNewClient,
  editClient,
  client
} = require("./controllers/client");
const {
  chargesOverdue,
  expectedCharges,
  paidCharges,
  createCharge,
  getCharge
} = require("./controllers/charges");
const { validateReq } = require("./middlewares/validation");
const {
  registerUserSchema,
  registerClientSchema,
} = require("./validators/registerSchema");

rotas.use(express.json());

rotas.post("/registrar", validateReq(registerUserSchema), register);
rotas.post("/login", login);
rotas.get("/usuarios", authorizeUser, getUser)
rotas.put("/editar/:id", authorizeUser, editUser);
rotas.get("/clientes", authorizeUser, getClient);
rotas.put("/clientes/:id", authorizeUser, editClient)
rotas.get("/cobrancas/vencidas", authorizeUser, chargesOverdue);
rotas.get("/cobrancas/previstas", authorizeUser, expectedCharges);
rotas.get("/cobrancas/pagas", authorizeUser, paidCharges);
rotas.post("/cobrancas", authorizeUser, createCharge);
rotas.get("/cobrancas", authorizeUser, getCharge)
rotas.get("/clientes/inadimplentes", authorizeUser, getClientDefaulter);
rotas.get("/clientes/em-dia", authorizeUser, getClientToday);
rotas.post("/create-cliente", authorizeUser, validateReq(registerClientSchema), createNewClient),
rotas.get("/cliente/?:id", authorizeUser,client )
  module.exports = rotas;
