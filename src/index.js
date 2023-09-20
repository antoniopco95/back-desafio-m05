const express = require("express");
const rotas = require("./routes");
const PORT = process.env.PORT || 8000;
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
/* app.use(
  cors({
    origin: "https://front-equipe-09-git-main-antoniopco95.vercel.app",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); */
app.use(express.json());
app.use(rotas);

app.listen(PORT, () => {
  console.log(`Server on na rota ${PORT}`);
});
