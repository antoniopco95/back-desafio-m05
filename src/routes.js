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
} = require("./controllers/client");
const {
  chargesOverdue,
  expectedCharges,
  paidCharges,
} = require("./controllers/charges");
const { validateReq } = require("./middlewares/validation");
const { editUserSchema } = require("./validators/editSchema");
const {
  registerUserSchema,
  registerClientSchema,
} = require("./validators/registerSchema");

rotas.use(express.json());

rotas.post("/registrar", validateReq(registerUserSchema), register);
rotas.post("/login", login);
rotas.put("/editar/:id", authorizeUser, validateReq(editUserSchema), editUser);
rotas.get("/clientes", authorizeUser, getClient);
rotas.get("/cobrancas/vencidas", authorizeUser, chargesOverdue);
rotas.get("/cobrancas/previstas", authorizeUser, expectedCharges);
rotas.get("/cobrancas/pagas", authorizeUser, paidCharges);
rotas.get("/clientes/inadimplentes", authorizeUser, getClientDefaulter);
rotas.get("/clientes/em-dia", authorizeUser, getClientToday);
module.exports = rotas;
