const knex = require("knex")(require("../knexfile").development);

const chargesOverdue = async (req, res) => {
  try {
    const charges = await knex("cobranca").where('paga', false)
    const dateCurrent = new Date()
    const overdue = charges.filter(cobranca => new Date(cobranca.data_vencimento) < dateCurrent)
    let totalDue = 0;
    overdue.forEach((element) => {
      totalDue += parseFloat(element.valor);
    });

    return res
      .status(200)
      .json({
        cobrancas_vencidas: overdue,
        Total_Vencido: totalDue.toFixed(2),
      });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar cobranças vencidas." });
  }
};
const expectedCharges = async (req, res) => {
  try {
    const charges = await await knex("cobranca").where('paga', false)
    const dateCurrent = new Date()
    const expected = charges.filter(cobranca => new Date(cobranca.data_vencimento) > dateCurrent)
    let totalExpected = 0;
    expected.forEach((element) => {
      totalExpected += parseFloat(element.valor);
    });

    return res.json({
      cobrancas_previstas: expected,
      total_previsto: totalExpected.toFixed(2),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar cobranças previstas." });
  }
};
const paidCharges = async (req, res) => {
  try {
    const paid = await knex("cobranca").where('paga', true)
    let totalpaid = 0;
    paid.forEach((element) => {
      totalpaid += parseFloat(element.valor);
    });

    return res.json({
      cobrancas_pagas: paid,
      total_pago: totalpaid.toFixed(2),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar cobranças pagas." });
  }
};


const createCharge = async (req, res) => {
  try {
    const { cliente_id, valor, paga, data_vencimento, descricao } = req.body;
    if (!cliente_id || !valor || !paga || !data_vencimento) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }
    const client = await knex('cliente').select("*").where("id", cliente_id).first();
    if (!client) {
      return res
        .status(400)
        .json({ error: "Por favor inserir cliente existente" });
    }
    await knex('cliente').insert({
      cliente_id,
      valor,
      data_vencimento,
      paga,
      descricao
    });

    return res.json({ message: "Cobraça cadastrada com sucesso" });
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Erro ao criar cobrança.");
  }
};

const getCharge = async (req, res) => {

  const cliente_id = req.params.id;
  try {
    const charges = await knex("cobrancas").where("cliente_id", cliente_id);
    if (!charges) {

      return res
        .status(400)
        .json({ error: "Erro ao buscar cobranças" });
    }

    return res.status(200).json(charges)

  } catch (error) {
    console.log(error)
    res.status(500).send('Erro ao buscar cobranças');
  }
}


const deleteCharge = async (req, res) => {
  const { cobranca_id, paga, data_vencimento } = req.params;

  try {
    const cobranca = await knex('cobranca')
      .where({
        cobranca_id: cobranca_id
      })
      .first()

    if (!cobranca) {
      return res.status(404).json('Cobrança não encontrada')
    }


    const chargeDeleted = await knex('cobranca')
      .where({ cobranca_id: cobranca_id })
      .where('data_vencimento', '<=', knex.fn.now())
      .andWhere('paga', '=', false);
.del();

if (!chargeDeleted) {
  return res.status(400).json('Cobrança não foi excluida,  já se encontra paga')
}

return res.status(200).json('Cobrança excluida com sucesso')
} catch (error) {
  return res.status(400).json('Não foi possivel excluir a cobrança')
}
}



const editCharge = async (req, res) => {
  const id = req.params.id;
  const { nome, descricao, data_vencimento, valor, paga } = req.body;
  try {
    const cobranca = await knex("cobranca").where("id", id).first();

    if (!cobranca) {
      return res.status(404).json({ message: "Cobrança não encontrada." });
    }

    const updatedCharge = {};

    if (descricao) updatedCharge.descricao = descricao;
    if (data_vencimento) updatedCharge.data_vencimento = data_vencimento;
    if (valor) updatedCharge.valor = valor;
    if (paga) updatedCharge.paga = paga;

    if (!descricao || !data_vencimento || !valor || paga === undefined) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    await knex("cliente").where("id", id).update(updatedCharge);
    const { ...chargeEdit } = updatedCharge;
    return res.json({ message: "Cobrança editada com sucesso.", chargeEdit });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar cobrança." });
  }
};

const detailsCharge = async (req, res) => {
  const id = req.params.id;

  try {
    const cobranca = await knex("cobranca")
      .select("nome", "descricao", "data_vencimento", "valor", "paga", "cobranca_id")
      .where("id", id)
      .first();

    if (!cobranca) {
      return res.status(404).json({ message: "Cobrança não encontrada." });
    }

    res.status(200).json(cobranca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar cobrança." });
  }
};

module.exports = { chargesOverdue, expectedCharges, paidCharges, createCharge, getCharge, deleteCharge, detailsCharge, editCharge };
