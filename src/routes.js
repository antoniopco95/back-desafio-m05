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
  getCharges, 
  myCharges
} = require("./controllers/charges");
const { validateReq } = require("./middlewares/validation");
const {
  registerUserSchema,
  registerClientSchema,
} = require("./validators/registerSchema");

rotas.use(express.json());

rotas.get("/usuarios", authorizeUser, getUser)
rotas.post("/registrar", validateReq(registerUserSchema), register);
rotas.post("/login", login);
rotas.put("/editar/:id", authorizeUser, editUser);

rotas.get("/cobrancas/vencidas", authorizeUser, chargesOverdue);
rotas.get("/cobrancas/previstas", authorizeUser, expectedCharges);
rotas.get("/cobrancas/pagas", authorizeUser, paidCharges);
rotas.get("/cobrancas", authorizeUser, getCharges)
rotas.get("/cliente/cobranca/:id", authorizeUser, myCharges)
rotas.post("/cobrancas", authorizeUser, createCharge);

rotas.get("/clientes/inadimplentes", authorizeUser, getClientDefaulter);
rotas.get("/clientes/em-dia", authorizeUser, getClientToday);
rotas.get("/cliente/:id", authorizeUser,client )
rotas.get("/clientes", authorizeUser, getClient);
rotas.post("/create-cliente", authorizeUser, validateReq(registerClientSchema), createNewClient),
rotas.put('/cliente/:id', authorizeUser, editClient)

  module.exports = rotas;
