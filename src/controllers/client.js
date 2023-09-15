const knex = require("knex")(require("../knexfile").development);

knex
const getClient = async (req,res)=>{
    try{
        const client = await knex('cliente').select("*");
        res.status(200).json(client)

    }catch(error){
        console.log(error)
        res.status(500).send('Erro ao buscar clientes.');
    }
}
const createNewClient= async (req,res)=>{

}
const getClientDefaulter=async(req,res)=>{
    try {
        const defaulter = await knex.select('cliente.cliente_id', 'cliente.nome', 'cliente.cpf')
                                .from('cliente')
                                .leftJoin('cobranca', 'cliente.cliente_id', 'cobranca.cliente_id')
                                .whereNot('cobranca.status', 'Vencida')
                                .orWhereNull('cobranca.status')
                                .distinct(); // Usando distinct para evitar duplicação
        res.json(defaulter);
    } catch (error) {
        res.status(500).send('Erro ao buscar clientes em dia.');
    }

}
const getClientToday= async(req,res)=>{
     try {
        const today = await knex.select('cliente.cliente_id', 'cliente.nome', 'cliente.cpf')
                                .from('cliente')
                                .leftJoin('cobranca', 'cliente.cliente_id', 'cobranca.cliente_id')
                                .whereNot('cobranca.status', 'Paga')
                                .orWhereNull('cobranca.status')
                                .distinct(); // Usando distinct para evitar duplicação
        res.json(today);
    } catch (error) {
        res.status(500).send('Erro ao buscar clientes em dia.');
    }
}
module.exports={getClient, getClientDefaulter , getClientToday  }