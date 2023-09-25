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


const createCharge = async (req, res) => {
  try {
    const { cliente_id, valor, paga, data_vencimento, descricao } = req.body;
    console.log(req.body)
    if (!cliente_id || !valor || !paga || !data_vencimento) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos", cliente_id, valor, paga,data_vencimento});
    }
    const client = await knex('cliente').select("*").where("cliente_id", cliente_id).first();
    if (!client) {
      return res
        .status(400)
        .json({ error: "Por favor inserir cliente existente" });
    }
    await knex('cobranca').insert({
      cliente_id,
      valor,
      data_vencimento,
      paga,
      descricao
    });

    return res.status(200).json({ error: "Cobraça cadastrada com sucesso" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json("Erro ao criar cobrança.");
  }
};

const getCharges = async (req, res) => {

  try {
    const charges = await knex("cobranca").select('*');
    if (!charges) {

      return res
        .status(400)
        .json({ error: "Erro ao buscar cobranças" });
    }

    return res.status(200).json(charges)

  } catch (error) {
    console.log(error)
    res.status(500).json({error:'Erro ao buscar cobranças'});
  }

}
const myCharges = async (req, res)=>{
  try{
    const id = req.params.id
    const charges = await knex("cobranca").where("cliente_id", id)
      if(!charges){
        return res.status(404).json({error:"Erro ao buscar cobraças do cliente"})
      }
      return res.status(200).json(charges)

  }catch(error){
     return res.status(404).json({error:"Erro ao buscar cobraças do cliente"})

  }
}

module.exports = { chargesOverdue, expectedCharges, paidCharges, createCharge, getCharges, myCharges };
