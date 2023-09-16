const knex = require("knex")(require("../knexfile").development);

const chargesOverdue = async (req, res) => {
  try {
    const overdue = await knex
      .select("cobranca.*", "cliente.nome")
      .from("cobranca")
      .join("cliente", "cobranca.cliente_id", "cliente.cliente_id")
      .where("cobranca.status", "Vencida");

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
    res.status(500).send("Erro ao buscar o total devido por cliente.");
  }
};
const expectedCharges = async (req, res) => {
  try {
    const expected = await await knex
      .select("cobranca.*", "cliente.nome")
      .from("cobranca")
      .join("cliente", "cobranca.cliente_id", "cliente.cliente_id")
      .where("cobranca.status", "Prevista");
    let totalExpected = 0;
    expected.forEach((element) => {
      totalExpected += parseFloat(element.valor);
    });

    return res.json({
      cobrancas_previstas: expected,
      total_previsto: totalExpected.toFixed(2),
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar o total devido por cliente.");
  }
};
const paidCharges = async (req, res) => {
  try {
    const paid = await knex
      .select("cobranca.*", "cliente.nome")
      .from("cobranca")
      .join("cliente", "cobranca.cliente_id", "cliente.cliente_id")
      .where("cobranca.status", "Paga");
    let totalpaid = 0;
    paid.forEach((element) => {
      totalpaid += parseFloat(element.valor);
    });

    return res.json({
      cobrancas_pagas: paid,
      total_pago: totalpaid.toFixed(2),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao buscar o total devido por cliente.");
  }
};

module.exports = { chargesOverdue, expectedCharges, paidCharges };
