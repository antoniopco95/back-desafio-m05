const knex = require("knex")(require("../knexfile").development);
const { validateEmailDomain } = require("../validators/userValidator");

const getClient = async (req, res) => {
    try {
        const subquery = knex('cobranca')
            .distinct('cliente_id')
            .where('data_vencimento', '<', knex.fn.now())
            .andWhere('paga', '=', false);

        knex('cliente')
            .select('cliente.cliente_id', 'cliente.nome', 'cliente.cpf', 'cliente.telefone', 'cliente.email')
            .leftJoin(subquery.as('ci'), 'cliente.cliente_id', 'ci.cliente_id')
            .select(knex.raw('CASE WHEN "ci"."cliente_id" IS NOT NULL THEN ? ELSE ? END AS status', ['Inadimplente', 'Em dia']))
            .then(result => {
                return res.status(200).json(result)
            })


    } catch (error) {

        return res.status(500).json({ error: 'Erro ao buscar clientes.' });
    }
}

const client = async (req, res) => {
    try {
        const id = req.params.id;
        const client = await knex('cliente').select("*").where("cliente_id", id).first();
        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar cliente.' });
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
            complemento,
            bairro,
            cidade,
            uf
        }).returning('*');

        return res.json({ message: "Cadastro Concluido" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao registrar o cliente." });
    }
}

const getClientDefaulter = async (req, res) => {
    try {
        const subquery = knex('cobranca')
            .distinct('cliente_id')
            .where('data_vencimento', '<', knex.fn.now())
            .andWhere('paga', '=', false);

        knex('cliente')
            .select('cliente.cliente_id', 'cliente.nome')
            .leftJoin(subquery.as('ci'), 'cliente.cliente_id', 'ci.cliente_id')
            .select(knex.raw('CASE WHEN "ci"."cliente_id" IS NOT NULL THEN ? ELSE ? END AS status', ['Inadimplente', 'Em dia']))
            .then(result => {
                const defaulter = result.filter(r => r.status === 'Inadimplente');
                return res.status(200).json(defaulter);
            })
    } catch (error) {
        res.status(500).send('Erro ao buscar clientes em dia.');
    }
}
const getClientToday = async (req, res) => {
        try {
            const subquery = knex('cobranca')
                .distinct('cliente_id')
                .where('data_vencimento', '<', knex.fn.now())
                .andWhere('paga', '=', false);

            knex('cliente')
                .select('cliente.cliente_id', 'cliente.nome')
                .leftJoin(subquery.as('ci'), 'cliente.cliente_id', 'ci.cliente_id')
                .select(knex.raw('CASE WHEN "ci"."cliente_id" IS NOT NULL THEN ? ELSE ? END AS status', ['Inadimplente', 'Em dia']))
                .then(result => {
                    const clientToday = result.filter(r => r.status === 'Em dia');
                    return res.status(200).json(clientToday);
                })
        } catch (error) {

            return res.status(500).json({ error: 'Erro ao buscar clientes em dia.' });
        }
    }

    const editClient = async (req, res) => {
        const id = req.params.id;
        const { nome, email, cpf, telefone, endereco, cep, complemento,bairro, cidade, uf } = req.body;
        try {
            const cliente = await knex("cliente").where("cliente_id", id).first();

            if (!cliente) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }

            const updatedClient = {...cliente};

            if (nome) updatedClient.nome = nome;
            if (email) {
                const existEmail = await knex("cliente").where("email", email).first();

                if (!validateEmailDomain(email)) {
                    return res
                        .status(400)
                        .json({ error: "Por favor, use um e-mail válido" });
                }

                if (existEmail) {
                    if (Number(id) === existEmail.cliente_id) {
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
                console.log(cpf.length)
                if (cpf.length === 11) {
                    const existCpf = await knex("cliente").where("cpf", cpf).first();

                    if (existCpf) {
                        if (Number(id) === existCpf.cliente_id) {
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
            if(complemento) updatedClient.complemento = complemento
            if (endereco) updatedClient.endereco = endereco;
            if (cep) updatedClient.cep = cep;
            if (bairro) updatedClient.bairro = bairro;
            if (cidade) updatedClient.cidade = cidade;
            if (uf) updatedClient.uf = uf;

            await knex("cliente").where("cliente_id", id).update(updatedClient);
            return res.json({ message: "Cliente atualizado com sucesso."});
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar cliente." });
        }
    };

    module.exports = { getClient, getClientDefaulter, getClientToday, createNewClient, client, editClient };
