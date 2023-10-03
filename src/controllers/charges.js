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
  const { cobranca_id, status, data_vencimento } = req.params;

  try {
    const cobranca = await knex('cobranca')
      .where({
        cobranca_id: cobranca_id
      })
      .first()

    if (!cobranca) {
      return res.status(404).json('Cobrança não encontrada')
    }

    if (status === false && data_vencimento <= ) {
      const chargeDeleted = await knex('cobranca').where({
        cobranca_id: cobranca_id
      }).del();
    }
    else if (!chargeDeleted) {
      return res.status(400).json('Cobrança não foi excluida,  já se encontra paga')
    }

    return res.status(200).json('Cobrança excluida com sucesso')
  } catch (error) {
    return res.status(400).json('Não foi possivel excluir a cobrança')
  }
}



module.exports = { chargesOverdue, expectedCharges, paidCharges, createCharge, getCharge, deleteCharge, detailsCharge, editCharge };
