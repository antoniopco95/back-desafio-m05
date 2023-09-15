const bcrypt = require("bcryptjs");
const { validateEmailDomain } = require("../validators/userValidator");
const knex = require("knex")(require("../knexfile").development);
const editUser = async (req,res)=>{
    console.log(1)
    const id = req.params.id
    const { nome, email, senha, cpf, telefone } = req.body;
    try {
        const user = await knex("usuarios").where("id", id).first()
    
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        
        const updatedUser = {};
        
        if (nome) updatedUser.nome = nome;
        if (email){
            const  existEmail = await knex("usuarios").where("email", email).first();
             
            if (!validateEmailDomain(email)) {
                 return res.status(400).json({ error: "Por favor, use um e-mail válido" });
                }

            if(existEmail) {
                if(id === existEmail.id){
                    
                    updatedUser.email = email;
                    
                }else {
                    return res.status(400).json({ error: "O email ja se encontra em uso" });
                }
            }
        }
        if (senha){ 
            const hash = await bcrypt.hash(senha, 10);
            updatedUser.senha = hash
        };
        if (cpf) updatedUser.cpf = cpf;
        if (telefone) updatedUser.telefone = telefone;

        await knex('usuarios').where('id', id).update(updatedUser);

        res.json({ message: 'Usuário atualizado com sucesso.' });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    }
}

module.exports={editUser}