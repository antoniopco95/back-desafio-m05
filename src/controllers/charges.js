const knex = require("knex")(require("../knexfile").development);

const chargesOverdue = async (req, res) => {
  try {
    const charges =  await knex("cobranca").where('paga', false)
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
    return res.status(500).json({error:"Erro ao buscar cobranças vencidas."});
  }
};
const expectedCharges = async (req, res) => {
  try {
    const charges = await await knex("cobranca").where('paga', false)
    const dateCurrent = new Date()
    const expected = charges.filter(cobranca => new Date(cobranca.data_vencimento) > dateCurrent )
    let totalExpected = 0;
    expected.forEach((element) => {
      totalExpected += parseFloat(element.valor);
    });

    return res.json({
      cobrancas_previstas: expected,
      total_previsto: totalExpected.toFixed(2),
    });
  } catch (error) {
    return res.status(500).json({error:"Erro ao buscar cobranças previstas."});
  }
};
const paidCharges = async (req, res) => {
  try {
   const paid =  await knex("cobranca").where('paga', true)
    let totalpaid = 0;
    paid.forEach((element) => {
      totalpaid += parseFloat(element.valor);
    });

    return res.json({
      cobrancas_pagas: paid,
      total_pago: totalpaid.toFixed(2),
    });
  } catch (error) {
    return res.status(500).json({error:"Erro ao buscar cobranças pagas."});
  }
};

module.exports = { chargesOverdue, expectedCharges, paidCharges };
