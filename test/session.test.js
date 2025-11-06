const app = require("../app.js");
const request = require("supertest");

const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

describe("Rotas de Sessões (/api/sessions)", () => {
  let accessToken;
  let sessionId;
  let clientId = 31; 
  const baseUrl = "/api/sessions";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: TEST_EMAIL, senha: TEST_PASSWORD });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    accessToken = res.body.token;
  });

  it("deve criar uma nova sessão válida (schema correto)", async () => {
    const newSession = {
      cliente_id: clientId,
      data_atendimento: "2025-11-10T10:00:00",
      valor_sessao: 150.50,
      numero_sessao: 1,
      descricao: "Sessão de teste",
    };

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newSession);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("sessao_id");
    sessionId = res.body.sessao_id;
  });

  it("deve listar todas as sessões do usuário", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve obter uma sessão pelo ID", async () => {
    const res = await request(app)
      .get(`${baseUrl}/${sessionId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sessao_id", sessionId);
  });

  it("deve atualizar uma sessão existente com dados válidos", async () => {
    const updateData = {
      descricao: "Sessão atualizada via teste automático",
      valor_sessao: 200.0,
      numero_sessao: 2,
      realizado: false,
      cancelado: false,
      motivo: null,
    };

    const res = await request(app)
      .put(`${baseUrl}/${sessionId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("descricao", updateData.descricao);
  });

  it("deve alterar o status de realização da sessão", async () => {
    const res = await request(app)
      .put(`${baseUrl}/realizar/${sessionId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ realizado: true }); 

    expect(res.statusCode).toBe(200);
    expect(res.body.realizado).toBe(true);
  });

  it("deve listar sessões pendentes", async () => {
    const res = await request(app)
      .get(`${baseUrl}/pendentes`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve listar sessões realizadas", async () => {
    const res = await request(app)
      .get(`${baseUrl}/realizadas`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve listar sessões canceladas", async () => {
    const res = await request(app)
      .get(`${baseUrl}/canceladas`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve listar sessões pendentes por data", async () => {
    const res = await request(app)
      .get(`${baseUrl}/pendentes/data?data=2025-11-10`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve listar sessões de um cliente pendentes", async () => {
    const res = await request(app)
      .get(`${baseUrl}/cliente/${clientId}/pendentes`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve listar sessões de um cliente realizadas", async () => {
    const res = await request(app)
      .get(`${baseUrl}/cliente/${clientId}/realizadas`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve excluir uma sessão existente", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/${sessionId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect([200, 204]).toContain(res.statusCode);
  });

  it("não deve criar sessão com data_atendimento inválida", async () => {
    const invalidSession = {
      cliente_id: clientId,
      data_atendimento: "2025/11/10 10:00", 
      valor_sessao: 100,
      numero_sessao: 1,
    };

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(invalidSession);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Formato de data e hora inválido/);
  });

  it("não deve criar sessão com valor_sessao negativo", async () => {
    const invalidSession = {
      cliente_id: clientId,
      data_atendimento: "2025-11-10T10:00:00",
      valor_sessao: -50,
      numero_sessao: 1,
    };

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(invalidSession);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Valor da sessão deve ser um número positivo/);
  });
});
