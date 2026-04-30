const express = require("express");
const request = require("supertest");
const reviewReplyController = require("../controllers/reviewReplyController");
const reviewReplyService = require("../services/reviewReplyService");
const User = require("../models/user.js");

jest.mock("../services/reviewReplyService");
jest.mock("../models/user.js");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: 99 };
    req.userData = { cpf: "52998224725" };
    next();
  });
  app.get("/reviews/:reviewId/respostas", reviewReplyController.listReplies);
  app.post("/reviews/:reviewId/respostas", reviewReplyController.createReply);
  app.patch(
    "/reviews/:reviewId/respostas/:replyId",
    reviewReplyController.updateReply
  );
  app.delete(
    "/reviews/:reviewId/respostas/:replyId",
    reviewReplyController.deleteReply
  );
  return app;
}

describe("Review reply controller", () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
  });

  it("GET lista respostas com sucesso", async () => {
    reviewReplyService.listByReview.mockResolvedValue([
      { review_reply_id: 1, resposta: "Obrigado!" },
    ]);

    const res = await request(app).get("/reviews/10/respostas");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(reviewReplyService.listByReview).toHaveBeenCalledWith(
      10,
      99,
      "52998224725"
    );
  });

  it("GET retorna 403 para usuário sem vínculo na review", async () => {
    reviewReplyService.listByReview.mockResolvedValue(null);

    const res = await request(app).get("/reviews/10/respostas");

    expect(res.statusCode).toBe(403);
  });

  it("POST cria resposta com sucesso", async () => {
    reviewReplyService.createReply.mockResolvedValue({
      review_reply_id: 3,
      resposta: "Agradeço o feedback!",
    });

    const res = await request(app)
      .post("/reviews/20/respostas")
      .send({ resposta: "Agradeço o feedback!" });

    expect(res.statusCode).toBe(201);
    expect(res.body.review_reply_id).toBe(3);
    expect(reviewReplyService.createReply).toHaveBeenCalledWith(
      20,
      99,
      "52998224725",
      "Agradeço o feedback!"
    );
  });

  it("POST bloqueia resposta vazia", async () => {
    const res = await request(app)
      .post("/reviews/20/respostas")
      .send({ resposta: "   " });

    expect(res.statusCode).toBe(400);
    expect(reviewReplyService.createReply).not.toHaveBeenCalled();
  });

  it("PATCH atualiza resposta do autor", async () => {
    reviewReplyService.updateReply.mockResolvedValue({
      review_reply_id: 5,
      resposta: "Texto atualizado",
    });

    const res = await request(app)
      .patch("/reviews/20/respostas/5")
      .send({ resposta: "Texto atualizado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.resposta).toBe("Texto atualizado");
  });

  it("PATCH retorna 403 quando não for autor da resposta", async () => {
    reviewReplyService.updateReply.mockResolvedValue("forbidden");

    const res = await request(app)
      .patch("/reviews/20/respostas/5")
      .send({ resposta: "Texto atualizado" });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/autor/i);
  });

  it("DELETE remove resposta do autor", async () => {
    reviewReplyService.deleteReply.mockResolvedValue(true);

    const res = await request(app).delete("/reviews/20/respostas/5");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removida/i);
  });

  it("DELETE retorna 403 quando não for autor da resposta", async () => {
    reviewReplyService.deleteReply.mockResolvedValue("forbidden");

    const res = await request(app).delete("/reviews/20/respostas/5");

    expect(res.statusCode).toBe(403);
  });

  it("busca CPF no banco quando userData não possui cpf", async () => {
    app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      req.user = { id: 99 };
      req.userData = {};
      next();
    });
    app.get("/reviews/:reviewId/respostas", reviewReplyController.listReplies);
    User.findByPk.mockResolvedValue({ cpf: "52998224725" });
    reviewReplyService.listByReview.mockResolvedValue([]);

    const res = await request(app).get("/reviews/1/respostas");

    expect(res.statusCode).toBe(200);
    expect(User.findByPk).toHaveBeenCalledWith(99, { attributes: ["cpf"] });
  });
});
