const knex = require("knex")(require("../knexfile").development);
const { validateEmailDomain } = require("../validators/userValidator");

const getClient = async (req, res) => {
    try {
        const { cliente_id } = req.body;
        const client = await knex('cliente').select("*").where("cliente_id", cliente_id).first();
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

const editClient = async (req, res) => {
    const id = req.params.id;
    const { nome, email, cpf, telefone, endereco, cep, bairro, cidade, uf } = req.body;
    try {
        const cliente = await knex("cliente").where("id", id).first();

        if (!cliente) {
            return res.status(404).json({ message: "Cliente não encontrado." });
        }

        const updatedClient = {};

        if (nome) updatedClient.nome = nome;
        if (email) {
            const existEmail = await knex("cliente").where("email", email).first();

            if (!validateEmailDomain(email)) {
                return res
                    .status(400)
                    .json({ error: "Por favor, use um e-mail válido" });
            }

            if (existEmail) {
                if (id === existEmail.cliente_id) {
                    updatedClient.email = email;
                } else {
                    return res
                        .status(400)
                        .json({ error: "O email ja se encontra em uso" });
                }
            }
            updatedClient.email = email
        }
        if (cpf) {
            if (cpf.lenght === 11) {
                const existCpf = await knex("cliente").where("cpf", cpf).first();

                if (existCpf) {
                    if (id === existCpf.cliente_id) {
                        updatedClient.cpf = cpf;
                    } else {
                        return res
                            .status(400)
                            .json({ error: "O cpf ja se encontra em uso" });
                    }
                }
                updatedClient.cpf = cpf;
            } else {
                return res
                    .status(400)
                    .json({ error: "cpf inválido" });
            }
        }
        if (telefone) updatedClient.telefone = telefone;
        if (endereco) updatedClient.endereco = endereco;
        if (cep) updatedClient.cep = cep;
        if (bairro) updatedClient.bairro = bairro;
        if (cidade) updatedClient.cidade = cidade;
        if (uf) updatedClient.uf = uf;

        await knex("cliente").where("id", id).update(updatedClient);
        const { ...userEdit } = updatedClient;
        return res.json({ message: "Cliente atualizado com sucesso.", userEdit });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar cliente." });
    }
};


module.exports = { getClient, getClientDefaulter, getClientToday, createNewClient, editClient };
