const express = require("express");
const rotas = require("./routes");
const PORT = process.env.PORT || 8000;
const app = express();
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://front-equipe-09-git-main-antoniopco95.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(rotas);

app.listen(PORT, () => {
  console.log(`Server on na rota ${PORT}`);
});
