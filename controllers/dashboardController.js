const dashboardservice = require('../services/dashboarService');

function validateDia(dia){
    return /[0-3][0-9]/.test(dia);
}

function validateMes(mes){
    const meses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    return meses.includes(mes)
}

function validateAno(ano){
    return /[0-9][0-9][0-9][0-9]/.test(dia);
}

function getToday(){
    const today = new Date();
    const dia = today.getDate();
    const mes = today.getMonth() + 1;
    const ano = today.getFullYear()
    return {dia, mes, ano}
}

async function getSessionsOfDay(req, res){
    const id = req.user.id
    const dia = req.query.dia
    const mes = req.query.mes
    const ano = req.query.ano
    try {
        if (!dia && !mes && !ano){
            const data = getToday()
            const sessoes = await dashboardservice.totalSessionsOfDay(id, data.dia, data.mes, data.ano)
            return res.status(200).json(sessoes)
        }

        if (validateDia(dia) && validateMes(mes) && validateAno(ano)){
            const sessoes = await dashboardservice.totalSessionsOfDay(id, dia, mes, ano)
            return res.status(200).json(sessoes)
        }
        return res.status(400).json({ message: "Bad Request" })

    } catch (err) {
        return res.status(500).json({ message: error.message })
    }
}

async function getSessionsOfMonth(req, res){
    const id = req.user.id
    const mes = req.query.mes
    const ano = req.query.ano
    try {
        if (!mes && !ano){
            const data = getToday()
            const sessoes = await dashboardservice.totalSessionsOfMonth(id, data.mes, data.ano)
            return res.status(200).json(sessoes)
        }

        if (validateMes(mes) && validateAno(ano)){
            const sessoes = await dashboardservice.totalSessionsOfMonth(id, mes, ano)
            return res.status(200).json(sessoes)
        }
        return res.status(400).json({ message: "Bad Request" })

    } catch (err) {
        return res.status(500).json({ message: error.message })
    }
}

async function getSessionsOfYear(req, res){
    const id = req.user.id
    const ano = req.query.ano
    try {
        if (!ano){
            const data = getToday()
            const sessoes = await dashboardservice.totalSessionsOfYear(id, data.ano)
            return res.status(200).json(sessoes)
        }

        if (validateAno(ano)){
            const sessoes = await dashboardservice.totalSessionsOfYear(id, ano)
            return res.status(200).json(sessoes)
        }
        return res.status(400).json({ message: "Bad Request" })

    } catch (err) {
        return res.status(500).json({ message: error.message })
    }
}

async function getSessionsValueOfDay(req, res){
    const id = req.user.id
    const dia = req.query.dia
    const mes = req.query.mes
    const ano = req.query.ano
    try {
        if (!dia && !mes && !ano){
            const data = getToday()
            const realizado = await dashboardservice.totalSessionsValueOfDay(id, data.dia, data.mes, data.ano)
            return res.status(200).json(realizado)
        }

        if (validateDia(dia) && validateMes(mes) && validateAno(ano)){
            const realizado = await dashboardservice.totalSessionsOfDay(id, dia, mes, ano)
            return res.status(200).json(realizado)
        }
        return res.status(400).json({ message: "Bad Request" })

    } catch (err) {
        return res.status(500).json({ message: error.message })
    }
}

async function getSessionsValueOfMonth(req, res){
    const id = req.user.id
    const mes = req.query.mes
    const ano = req.query.ano
    try {
        if (!mes && !ano){
            const data = getToday()
            const realizado = await dashboardservice.totalSessionsValueOfMonth(id, data.mes, data.ano)
            return res.status(200).json(realizado)
        }

        if (validateMes(mes) && validateAno(ano)){
            const realizado = await dashboardservice.totalSessionsValueOfMonth(id, mes, ano)
            return res.status(200).json(realizado)
        }
        return res.status(400).json({ message: "Bad Request" })

    } catch (err) {
        return res.status(500).json({ message: error.message })
    }
}

async function getSessionsValueOfYear(req, res){
    const id = req.user.id
    const ano = req.query.ano
    try {
        if (!ano){
            const data = getToday()
            const realizado = await dashboardservice.totalSessionsValueOfYear(id, data.ano)
            return res.status(200).json(realizado)
        }

        if (validateAno(ano)){
            const realizado = await dashboardservice.totalSessionsValueOfYear(id, ano)
            return res.status(200).json(realizado)
        }
        return res.status(400).json({ message: "Bad Request" })

    } catch (err) {
        return res.status(500).json({ message: error.message })
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