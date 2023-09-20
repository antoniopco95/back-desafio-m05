const express = require("express");
const rotas = require("./routes");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: "https://front-equipe-09-git-main-matheulucas.vercel.app",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(rotas);

app.listen(PORT, () => {
  console.log(`Server on na rota ${PORT}`);
});
