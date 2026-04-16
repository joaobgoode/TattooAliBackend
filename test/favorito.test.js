const app = require("../app.js");
const request = require("supertest");

const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

describe("Rotas de favoritos", () => {
  it("GET /api/favoritos/tatuador/:id sem token retorna 401", async () => {
    const res = await request(app).get("/api/favoritos/tatuador/1");
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/favoritos/toggle sem token retorna 401", async () => {
    const res = await request(app)
      .post("/api/favoritos/toggle")
      .send({ tatuador_id: 1 });
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/favoritos sem token retorna 401", async () => {
    const res = await request(app).get("/api/favoritos");
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/favoritos/toggle com body inválido retorna 400", async () => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      return;
    }
    const loginRes = await request(app)
      .post("/api/user/login")
      .send({ email: TEST_EMAIL, senha: TEST_PASSWORD });
    if (loginRes.statusCode !== 200) {
      return;
    }
    const token = loginRes.body.token;
    const res = await request(app)
      .post("/api/favoritos/toggle")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: "x" });
    expect(res.statusCode).toBe(400);
  });
});

describe("Rotas de favoritos (autenticado)", () => {
  let token;
  let role;

  beforeAll(async () => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      return;
    }
    const loginRes = await request(app)
      .post("/api/user/login")
      .send({ email: TEST_EMAIL, senha: TEST_PASSWORD });
    if (loginRes.statusCode !== 200) {
      return;
    }
    token = loginRes.body.token;
    const perfilRes = await request(app)
      .get("/api/perfil/")
      .set("Authorization", `Bearer ${token}`);
    if (perfilRes.statusCode === 200) {
      role = perfilRes.body.role;
    }
  });

  it("usuário não cliente recebe 403 em GET status", async () => {
    if (!token || role === "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/favoritos/tatuador/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/cliente/i);
  });

  it("usuário não cliente recebe 403 em POST toggle", async () => {
    if (!token || role === "cliente") {
      return;
    }
    const res = await request(app)
      .post("/api/favoritos/toggle")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: 1 });
    expect(res.statusCode).toBe(403);
  });

  it("usuário não cliente recebe 403 em GET lista", async () => {
    if (!token || role === "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/favoritos")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it("cliente: GET status com tatuador inexistente retorna 404", async () => {
    if (!token || role !== "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/favoritos/tatuador/999999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it("cliente: toggle com próprio user_id retorna 400", async () => {
    if (!token || role !== "cliente") {
      return;
    }
    const perfilRes = await request(app)
      .get("/api/perfil/")
      .set("Authorization", `Bearer ${token}`);
    if (perfilRes.statusCode !== 200 || perfilRes.body.user_id == null) {
      return;
    }
    const res = await request(app)
      .post("/api/favoritos/toggle")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: perfilRes.body.user_id });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/si mesmo/i);
  });

  it("cliente: GET status retorna favorito false quando não há registro", async () => {
    if (!token || role !== "cliente") {
      return;
    }
    const tatuadorRes = await request(app)
      .get("/api/tatuador/bairro/1")
      .set("Authorization", `Bearer ${token}`);
    if (tatuadorRes.statusCode !== 200 || !tatuadorRes.body?.length) {
      return;
    }
    const tatuadorId = tatuadorRes.body[0].user_id;
    const res = await request(app)
      .get(`/api/favoritos/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("favorito");
    expect(res.body).toHaveProperty("ativo");
    expect(res.body.favorito).toBe(false);
  });

  it("cliente: toggle e verificação de status", async () => {
    if (!token || role !== "cliente") {
      return;
    }
    const tatuadorRes = await request(app)
      .get("/api/tatuador/bairro/1")
      .set("Authorization", `Bearer ${token}`);
    if (tatuadorRes.statusCode !== 200 || !tatuadorRes.body?.length) {
      return;
    }
    const tatuadorId = tatuadorRes.body[0].user_id;

    const t1 = await request(app)
      .post("/api/favoritos/toggle")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: tatuadorId });
    expect(t1.statusCode).toBe(200);
    expect(t1.body.ativo).toBe(true);
    expect(t1.body.favorito).toBe(true);

    const st = await request(app)
      .get(`/api/favoritos/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(st.statusCode).toBe(200);
    expect(st.body.favorito).toBe(true);

    const t2 = await request(app)
      .post("/api/favoritos/toggle")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: tatuadorId });
    expect(t2.statusCode).toBe(200);
    expect(t2.body.ativo).toBe(false);
    expect(t2.body.favorito).toBe(false);

    const list = await request(app)
      .get("/api/favoritos")
      .set("Authorization", `Bearer ${token}`);
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });
});
