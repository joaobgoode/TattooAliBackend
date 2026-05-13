const express = require("express");
const request = require("supertest");
const estudioController = require("../controllers/estudioController");
const estudioService = require("../services/estudioService");

jest.mock("../services/estudioService", () => ({
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: 1 };
    next();
  });

  app.post("/api/estudio", estudioController.createEstudio);
  app.get("/api/estudio", estudioController.getEstudios);
  app.get("/api/estudio/:id", estudioController.getEstudioById);
  app.put("/api/estudio/:id", estudioController.updateEstudio);
  app.delete("/api/estudio/:id", estudioController.deleteEstudio);

  return app;
}

describe("Estúdio Controller", () => {
  let app;

  const validEstudio = {
    nome: "Estúdio Teste",
    telefone: "11999998888",
    endereco: "Rua do Teste, 123",
    cnpj: "12345678000199", // exemplo de CNPJ válido
  };

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
  });

  it("cria um estúdio com dados válidos", async () => {
    estudioService.create.mockResolvedValue({
      estudio_id: 1,
      ...validEstudio,
      user_id: 1,
    });

    const res = await request(app).post("/api/estudio").send(validEstudio);

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      nome: validEstudio.nome,
      cnpj: validEstudio.cnpj,
    });
    expect(estudioService.create).toHaveBeenCalledWith({
      nome: validEstudio.nome,
      telefone: validEstudio.telefone,
      endereco: validEstudio.endereco,
      cnpj: validEstudio.cnpj,
      user_id: 1,
    });
  });

  it("retorna 400 para CNPJ inválido", async () => {
    const res = await request(app)
      .post("/api/estudio")
      .send({ ...validEstudio, cnpj: "11111111000191" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("CNPJ inválido");
    expect(estudioService.create).not.toHaveBeenCalled();
  });

  it("retorna 400 quando nome estiver vazio", async () => {
    const res = await request(app)
      .post("/api/estudio")
      .send({ ...validEstudio, nome: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Nome obrigatório");
  });

  it("lista estúdios do usuário", async () => {
    estudioService.getAll.mockResolvedValue([
      { estudio_id: 1, ...validEstudio },
    ]);
    const res = await request(app).get("/api/estudio");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(estudioService.getAll).toHaveBeenCalledWith(1);
  });

  it("busca estúdio por id", async () => {
    estudioService.getById.mockResolvedValue({
      estudio_id: 1,
      ...validEstudio,
    });
    const res = await request(app).get("/api/estudio/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("estudio_id", 1);
  });

  it("retorna 404 se estúdio não existir", async () => {
    estudioService.getById.mockResolvedValue(null);
    const res = await request(app).get("/api/estudio/999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Estúdio não encontrado");
  });

  it("atualiza estúdio existente", async () => {
    estudioService.belongsToUser.mockResolvedValue(true);
    estudioService.update.mockResolvedValue({
      estudio_id: 1,
      nome: "Novo Nome",
    });

    const res = await request(app)
      .put("/api/estudio/1")
      .send({ nome: "Novo Nome" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Novo Nome");
    expect(estudioService.belongsToUser).toHaveBeenCalledWith("1", 1);
  });

  it("deleta estúdio existente", async () => {
    estudioService.belongsToUser.mockResolvedValue(true);
    estudioService.remove.mockResolvedValue({ estudio_id: 1 });

    const res = await request(app).delete("/api/estudio/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Estúdio removido com sucesso");
  });
});
