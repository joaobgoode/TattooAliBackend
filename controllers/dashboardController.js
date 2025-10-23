const dashboardservice = require('../services/dashboardService');

function formatResponse(sessoes) {
  const sessoesFormatado = {
    realizados: 0,
    pendentes: 0
  }

  for (let entry of sessoes) {
    const data = entry.dataValues
    console.log(data)
    if (data.realizado) {
      sessoesFormatado.realizados += parseFloat(data.total) || 0
    } else if (data.realizado == false) {
      sessoesFormatado.pendentes += parseFloat(data.total) || 0
    }
  }

  return sessoesFormatado
}

function validateDia(dia) {
  return /[0-3][0-9]/.test(dia);
}

function validateMes(mes) {
  const meses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  return meses.includes(mes)
}

function validateAno(ano) {
  return /[0-9][0-9][0-9][0-9]/.test(dia);
}

function getToday() {
  const today = new Date();
  const dia = today.getDate();
  const mes = today.getMonth() + 1;
  const ano = today.getFullYear()
  return { dia, mes, ano }
}

async function getSessionsOfDay(req, res) {
  const id = req.user.id
  const dia = req.query.dia
  const mes = req.query.mes
  const ano = req.query.ano
  try {
    if (!dia && !mes && !ano) {
      const data = getToday()
      const sessoes = await dashboardservice.totalSessionsOfDay(id, data.dia, data.mes, data.ano)
      return res.status(200).json(formatResponse(sessoes))
    }

    if (validateDia(dia) && validateMes(mes) && validateAno(ano)) {
      const sessoes = await dashboardservice.totalSessionsOfDay(id, dia, mes, ano)
      return res.status(200).json(formatResponse(sessoes))
    }
    return res.status(400).json({ message: "Bad Request" })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err.message })
  }
}

async function getSessionsOfMonth(req, res) {
  const id = req.user.id
  const mes = req.query.mes
  const ano = req.query.ano
  try {
    if (!mes && !ano) {
      const data = getToday()
      const sessoes = await dashboardservice.totalSessionsOfMonth(id, data.mes, data.ano)
      return res.status(200).json(formatResponse(sessoes))
    }

    if (validateMes(mes) && validateAno(ano)) {
      const sessoes = await dashboardservice.totalSessionsOfMonth(id, mes, ano)
      return res.status(200).json(formatResponse(sessoes))
    }
    return res.status(400).json({ message: "Bad Request" })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

async function getSessionsOfYear(req, res) {
  const id = req.user.id
  const ano = req.query.ano
  try {
    if (!ano) {
      const data = getToday()
      const sessoes = await dashboardservice.totalSessionsOfYear(id, data.ano)
      return res.status(200).json(formatResponse(sessoes))
    }

    if (validateAno(ano)) {
      const sessoes = await dashboardservice.totalSessionsOfYear(id, ano)
      return res.status(200).json(formatResponse(sessoes))
    }
    return res.status(400).json({ message: "Bad Request" })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

async function getSessionsValueOfDay(req, res) {
  const id = req.user.id
  const dia = req.query.dia
  const mes = req.query.mes
  const ano = req.query.ano
  try {
    if (!dia && !mes && !ano) {
      const data = getToday()
      const realizado = await dashboardservice.totalSessionsValueOfDay(id, data.dia, data.mes, data.ano)
      return res.status(200).json(formatResponse(realizado))
    }

    if (validateDia(dia) && validateMes(mes) && validateAno(ano)) {
      const realizado = await dashboardservice.totalSessionsOfDay(id, dia, mes, ano)
      return res.status(200).json(formatResponse(realizado))
    }
    return res.status(400).json({ message: "Bad Request" })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

async function getSessionsValueOfMonth(req, res) {
  const id = req.user.id
  const mes = req.query.mes
  const ano = req.query.ano
  try {
    if (!mes && !ano) {
      const data = getToday()
      const realizado = await dashboardservice.totalSessionsValueOfMonth(id, data.mes, data.ano)
      return res.status(200).json(formatResponse(realizado))
    }

    if (validateMes(mes) && validateAno(ano)) {
      const realizado = await dashboardservice.totalSessionsValueOfMonth(id, mes, ano)
      return res.status(200).json(formatResponse(realizado))
    }
    return res.status(400).json({ message: "Bad Request" })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

async function getSessionsValueOfYear(req, res) {
  const id = req.user.id
  const ano = req.query.ano
  try {
    if (!ano) {
      const data = getToday()
      const realizado = await dashboardservice.totalSessionsValueOfYear(id, data.ano)
      return res.status(200).json(formatResponse(realizado))
    }

    if (validateAno(ano)) {
      const realizado = await dashboardservice.totalSessionsValueOfYear(id, ano)
      return res.status(200).json(formatResponse(realizado))
    }
    return res.status(400).json({ message: "Bad Request" })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getSessionsOfDay,
  getSessionsOfMonth,
  getSessionsOfYear,
  getSessionsValueOfDay,
  getSessionsValueOfMonth,
  getSessionsValueOfYear
};
