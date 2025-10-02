const { XLOCK } = require('sequelize/lib/table-hints')
const Client = require('../models/Client.js')
const Sessions = require('../models/Session.js')
const {Op, fn, literal} = require('../sequelize')
const { Where } = require('sequelize/lib/utils')

async function totalSessionsOfDay(user_id, day, month, year) {
    const sessions = await Sessions.findAll({ 
        attributes: [
            'realizado', [fn('COUNT'), 'sessao_id', 'total']
        ],
        where: {
            [Op.and]:[
                literal(`EXTRACT(DAY FROM data_atendimento) = ${day}`),
                literal(`EXTRACT(MONTH FROM data_atendimento) = ${month}`),
                literal(`EXTRACT(YEAR FROM data_atendimento) = ${year}`),
            ],
            usuario_id: user_id,
            cancelado: false
        },
        group: ['realizado']
    })
    return sessions
}

async function totalSessionsOfMonth(user_id, month, year) {
    const sessions = await Sessions.findAll({ 
        attributes: [
            'realizado', [fn('COUNT'), 'sessao_id', 'total']
        ],
        where: {
            [Op.and]:[
                literal(`EXTRACT(MONTH FROM data_atendimento) = ${month}`),
                literal(`EXTRACT(YEAR FROM data_atendimento) = ${year}`),
            ],
            usuario_id: user_id,
            cancelado: false
        },
        group: ['realizado']
    })
    return sessions
}

async function totalSessionsOfYear(user_id, year) {
    const sessions = await Sessions.findAll({ 
        attributes: [
            'realizado', [fn('COUNT'), 'sessao_id', 'total']
        ],
        where: {
            [Op.and]:[
                literal(`EXTRACT(YEAR FROM data_atendimento) = ${year}`),
            ],
            usuario_id: user_id,
            cancelado: false
        },
        group: ['realizado']
    })
    return sessions
}

async function totalSessionsValueOfDay(user_id, day, month, year) {
    const sessions = await Sessions.findAll({ 
        attributes: [
            'realizado', [fn('SUM'), 'valor', 'total']
        ],
        where: {
            [Op.and]:[
                literal(`EXTRACT(DAY FROM data_atendimento) = ${day}`),
                literal(`EXTRACT(MONTH FROM data_atendimento) = ${month}`),
                literal(`EXTRACT(YEAR FROM data_atendimento) = ${year}`),
            ],
            usuario_id: user_id,
            cancelado: false
        },
        group: ['realizado']
    })
    return sessions
}

async function totalSessionsValueOfMonth(user_id, month, year) {
    const sessions = await Sessions.findAll({ 
        attributes: [
            'realizado', [fn('SUM'), 'valor', 'total']
        ],
        where: {
            [Op.and]:[
                literal(`EXTRACT(MONTH FROM data_atendimento) = ${month}`),
                literal(`EXTRACT(YEAR FROM data_atendimento) = ${year}`),
            ],
            usuario_id: user_id,
            cancelado: false
        },
        group: ['realizado']
    })
    return sessions
}

async function totalSessionsValueOfYear(user_id, year) {
    const sessions = await Sessions.findAll({ 
        attributes: [
            'realizado', [fn('SUM'), 'valor', 'total']
        ],
        where: {
            [Op.and]:[
                literal(`EXTRACT(YEAR FROM data_atendimento) = ${year}`),
            ],
            usuario_id: user_id,
            cancelado: false
        },
        group: ['realizado']
    })
    return sessions
}

module.exports = {
    totalSessionsOfDay,
    totalSessionsOfMonth,
    totalSessionsOfYear,
    totalSessionsValueOfDay,
    totalSessionsValueOfMonth,
    totalSessionsValueOfYear
};