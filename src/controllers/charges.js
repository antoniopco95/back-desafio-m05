const knex = require("knex")(require("../knexfile").development);

const chargesOverdue = async (req, res) => {
  try {
     const charges = await knex('cobranca')
      .join('cliente', 'cobranca.cliente_id', '=', 'cliente.cliente_id')
      .select('cobranca.*', 'cliente.nome') 
      .where('cobranca.paga', false);
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
    console.log(error)
    return res.status(500).json({error:"Erro ao buscar cobranças vencidas."});
  }
};
const expectedCharges = async (req, res) => {
   try {
    const charges = await knex('cobranca')
      .join('cliente', 'cobranca.cliente_id', '=', 'cliente.cliente_id')
      .select('cobranca.*', 'cliente.nome') 
      .where('cobranca.paga', false);

    const dateCurrent = new Date();

    const expected = charges.filter(cobranca => new Date(cobranca.data_vencimento) > dateCurrent);

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
    const paid = await knex('cobranca')
      .join('cliente', 'cobranca.cliente_id', '=', 'cliente.cliente_id')
      .select('cobranca.*', 'cliente.nome') 
      .where('cobranca.paga', true);
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

    return res.status(200).json({ message : "Cobraça cadastrada com sucesso" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json("Erro ao criar cobrança.");
  }
};

const getCharges = async (req, res) => {

   try {
    const dateCurrent = new Date();

    const chargesWithDetails = await knex('cobranca')
      .join('cliente', 'cobranca.cliente_id', '=', 'cliente.cliente_id')
      .select('cobranca.*', 'cliente.nome')
      .then(charges => 
        charges.map(charge => {
          let status;
          const dueDate = new Date(charge.data_vencimento);

          if (charge.paga) {
            status = 'paga';
          } else if (dueDate > dateCurrent) {
            status = 'prevista';
          } else {
            status = 'vencida';
          }

          return {
            ...charge,
            status
          };
        })
      );

    if (!chargesWithDetails || chargesWithDetails.length === 0) {
      return res
        .status(400)
        .json({ error: "Erro ao buscar cobranças" });
    }

    return res.status(200).json(chargesWithDetails)

  } catch (error) {
    res.status(500).json({error:'Erro ao buscar cobranças'});
  }

}
const myCharges = async (req, res)=>{
  try{
      const id = req.params.id;
    const charges = await knex("cobranca").where("cliente_id", id);

    if (!charges || charges.length === 0) {
        return res.status(404).json({ error: "Erro ao buscar cobranças do cliente" });
    }

    const chargesWithStatus = charges.map(charge => {
        let status;
        const today = new Date();
        const dueDate = new Date(charge.data_vencimento);

        if (charge.paga) {
            status = 'Paga';
        } else if (dueDate > today) {
            status = 'Prevista';
        } else {
            status = 'Vencida';
        }
        return {
            ...charge,
            status
        };
    });

    return res.status(200).json(chargesWithStatus);
  }catch(error){
     return res.status(404).json({error:"Erro ao buscar cobraças do cliente"})

  }
}

module.exports = { chargesOverdue, expectedCharges, paidCharges, createCharge, getCharges, myCharges };
