const review = require("../models/review.js");
const client = require("../models/Client.js");
const { Op } = require("sequelize");

const includeCliente = [
  {
    model: client,
    as: "cliente",
    attributes: ["client_id", "nome"],
  },
];


async function getAll(reviewId) {
    return await review.findAll(
        {where: { review_id: reviewId,},
        include: includeCliente}
        
    );
}

async function getById(userId, reviewId){
    return await review.findOne({
        where: {user_id: userId, review_id: reviewId},
        include: includeCliente
    })
}

async function postReview(newReview){
    return await review.create(newReview);
}

async function updateReview(reviewId, newReview){
    const analise = await review.findByPk(reviewId, {include: includeCliente})
    if (!analise) throw new Error('Análise não encontrada');

    Object.assign(analise, newReview);
    await analise.save();
    return analise;
}

async function deleteReview(reviewId){
    const analise = await review.findByPk(reviewId, {include: includeCliente})
    if (!analise) throw new Error('Análise não encontrada');

    await analise.destroy();
    return;
}

module.exports = {
    getAll,
    getById,
    postReview,
    updateReview,
    deleteReview
}