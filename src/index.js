
const express = require('express')
const app = express()
const rotas = require('./rotas')
const cors = require('cors');
const PORT = process.env.PORT

app.use(express.json())
app.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.post('/registrar', rotas.register)

app.listen(PORT,()=>{
    console.log(`Server on na rota ${PORT}`)
})