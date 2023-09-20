const express = require("express");
const rotas = require("./routes");
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "https://front-equipe-09-git-main-antoniopco95.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(express.json());
app.use(rotas);
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server on na rota ${PORT}`);
});
