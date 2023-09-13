const { validateEmailDomain } = require('./validators/userValidator');
const knex = require('knex')(require('./knexfile').development);
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');

const register = async (req, res) => {
   try {
        const { nome, sobrenome, email, senha, telefone, data_nascimento, genero } = req.body;

        if(!nome || !sobrenome || !email || !senha || !cpf || !telefone){
            return res.json({ error: "Todos os campos devem ser preenchido "})
        }
        if (!validateEmailDomain(email)) {
            return res.status(400).json({ error: 'Por favor, use um e-mail válido' });}

        const hash = await bcrypt.hash(senha, 10);
        const user = await knex('usuarios').insert({
            nome,
            sobrenome,
            email,
            senha: hash,
            cpf,            
            telefone,
        }).returning('*');
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
};

module.exports={
    register
}