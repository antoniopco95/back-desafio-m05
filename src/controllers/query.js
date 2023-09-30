const knex = require("knex")(require("../knexfile").development);

const queryClient = async (req,res) =>{
         try {
        const { nome, cpf, email, order } = req.query;

        let query = knex('cliente').select('*');

        if (nome) {
            query.where('nome', 'ILIKE', `%${nome}%`);
        }

        if (cpf) {
            query.where('cpf', cpf);
        }

        if (email) {
            query.where('email', 'like', `%${email}%`);
        }

        if (order) {
            query.orderBy('nome');
        }

        const result = await query;
        if (result.length === 0) {
            return res.status(404).json({ message: "Nenhum resultado encontrado." });
        }

        return res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
    }

    const queryCharges = async (req,res)=>{
    try {
        const { nome, id, order } = req.query;
        console.log(req.query)
        let query = knex('cobranca')
            .join('cliente', 'cobranca.cliente_id', '=', 'cliente.cliente_id')
            .select('cobranca.*', 'cliente.nome');

        if (nome) {
            query.where('cliente.nome', 'ILIKE', `%${nome}%`);
        }

        if (id) {
            query.where('cobranca.cobranca_id', id);
        }

        if (order) {
            query.orderBy(order === 'id' ? 'cobranca.cobranca_id' : 'cliente.nome');
        }

        const result = await query;
        if (result.length === 0) {
            return res.status(404).json({ message: "Nenhum resultado encontrado." });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro ao buscar cobranças' });
    }
   
}

module.exports ={queryCharges, queryClient}