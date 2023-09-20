const express = require("express");
const rotas = require("./routes");
const PORT = process.env.PORT || 8000;

const app = express();


app.use(express.json());
app.use(rotas);

app.listen(PORT, () => {
  console.log(`Server on na rota ${PORT}`);
});
