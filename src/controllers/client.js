const knex = require("knex")(require("../knexfile").development);
const { validateEmailDomain } = require("../validators/userValidator");

const getClient = async (req, res) => {
    try {
        const client = await knex('cliente').select("*");
        return res.status(200).json(client)

    } catch (error) {
        console.log(error)
        res.status(500).send('Erro ao buscar clientes.');
    }
}

const createNewClient = async (req, res) => {

    const { nome, email, cpf, telefone, endereco, complemento, cep, bairro, cidade, uf } = req.body;

    try {
        if (!nome || !email || !cpf || !telefone) {
            return res
                .status(400)
                .json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        if (!validateEmailDomain(email)) {
            return res.status(400).json({ error: "Por favor, use um e-mail válido" });
        }

        const existEmail = await knex("cliente").where("email", email).first();

        if (existEmail) {
            return res.status(400).json({ error: "O email ja se encontra em uso" });
        }

        const existCpf = await knex('cliente').where('cpf', cpf).first();

        if (existCpf) {
            return res.status(400).json({ error: 'O cpf ja esta em uso' });
        }

        await knex('cliente').insert({
            nome,
            email,
            cpf,
            telefone,
            endereco,
            cep,
            bairro,
            cidade,
            uf
        }).returning('*');

        return res.json({ message: "Cadastro Concluido" });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Erro ao registrar o cliente." });
    }
}




const getClientDefaulter = async (req, res) => {
    try {
        const defaulter = await knex.select('cliente.cliente_id', 'cliente.nome', 'cliente.cpf')
            .from('cliente')
            .leftJoin('cobranca', 'cliente.cliente_id', 'cobranca.cliente_id')
            .whereNot('cobranca.status', 'Vencida')
            .orWhereNull('cobranca.status')
            .distinct(); // Usando distinct para evitar duplicação
        return res.json(defaulter);
    } catch (error) {
        res.status(500).send('Erro ao buscar clientes em dia.');
    }

}
const getClientToday = async (req, res) => {
    try {
        const today = await knex.select('cliente.cliente_id', 'cliente.nome', 'cliente.cpf')
            .from('cliente')
            .leftJoin('cobranca', 'cliente.cliente_id', 'cobranca.cliente_id')
            .whereNot('cobranca.status', 'Paga')
            .orWhereNull('cobranca.status')
            .distinct(); // Usando distinct para evitar duplicação
        return res.json(today);
    } catch (error) {
        res.status(500).send('Erro ao buscar clientes em dia.');
    }
}

module.exports = { getClient, getClientDefaulter, getClientToday, createNewClient };
