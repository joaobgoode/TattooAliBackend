const app = require("../app.js");
const request = require("supertest");

const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

describe("Rotas de follow", () => {
  it("GET /api/follow/feed sem token retorna 401", async () => {
    const res = await request(app).get("/api/follow/feed");
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/follow/seguindo sem token retorna 401", async () => {
    const res = await request(app).get("/api/follow/seguindo");
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/follow/seguidores sem token retorna 401", async () => {
    const res = await request(app).get("/api/follow/seguidores");
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/follow/tatuador/1 sem token retorna 401", async () => {
    const res = await request(app).get("/api/follow/tatuador/1");
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/follow sem token retorna 401", async () => {
    const res = await request(app)
      .post("/api/follow")
      .send({ tatuador_id: 1 });
    expect(res.statusCode).toBe(401);
  });

  it("DELETE /api/follow/tatuador/1 sem token retorna 401", async () => {
    const res = await request(app).delete("/api/follow/tatuador/1");
    expect(res.statusCode).toBe(401);
  });
});

describe("Rotas de follow (autenticado)", () => {
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

  it("não cliente recebe 403 em GET status", async () => {
    if (!token || role === "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/follow/tatuador/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/cliente/i);
  });

  it("não cliente recebe 403 em POST seguir", async () => {
    if (!token || role === "cliente") {
      return;
    }
    const res = await request(app)
      .post("/api/follow")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: 1 });
    expect(res.statusCode).toBe(403);
  });

  it("não cliente recebe 403 em GET seguindo", async () => {
    if (!token || role === "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/follow/seguindo")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it("não cliente recebe 403 em GET feed", async () => {
    if (!token || role === "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/follow/feed")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it("não tatuador recebe 403 em GET seguidores", async () => {
    if (!token || role === "tatuador" || role === "admin") {
      return;
    }
    const res = await request(app)
      .get("/api/follow/seguidores")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it("cliente: POST seguir com body inválido retorna 400", async () => {
    if (!token || role !== "cliente") {
      return;
    }
    const res = await request(app)
      .post("/api/follow")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: "x" });
    expect(res.statusCode).toBe(400);
  });

  it("cliente: GET feed com limit acima do máximo retorna 400", async () => {
    if (!token || role !== "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/follow/feed?limit=999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });

  it("cliente: GET status com tatuador inexistente retorna 404", async () => {
    if (!token || role !== "cliente") {
      return;
    }
    const res = await request(app)
      .get("/api/follow/tatuador/999999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it("cliente: seguir a si mesmo retorna 400", async () => {
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
      .post("/api/follow")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: perfilRes.body.user_id });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/si mesmo/i);
  });

  it("cliente: fluxo seguir, status, lista, feed vazio, deixar de seguir", async () => {
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

    const st0 = await request(app)
      .get(`/api/follow/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(st0.statusCode).toBe(200);
    expect(st0.body).toHaveProperty("seguindo");
    expect(st0.body).toHaveProperty("ativo");

    const f1 = await request(app)
      .post("/api/follow")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: tatuadorId });
    expect(f1.statusCode).toBe(200);
    expect(f1.body.seguindo).toBe(true);

    const st1 = await request(app)
      .get(`/api/follow/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(st1.statusCode).toBe(200);
    expect(st1.body.seguindo).toBe(true);

    const list = await request(app)
      .get("/api/follow/seguindo")
      .set("Authorization", `Bearer ${token}`);
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(
      list.body.some(
        (row) =>
          row.tatuador_id === tatuadorId ||
          row.tatuador?.user_id === tatuadorId
      )
    ).toBe(true);

    const feed = await request(app)
      .get("/api/follow/feed?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(feed.statusCode).toBe(200);
    expect(feed.body).toHaveProperty("data");
    expect(feed.body).toHaveProperty("total");
    expect(feed.body).toHaveProperty("page", 1);
    expect(feed.body).toHaveProperty("limit", 10);
    expect(feed.body).toHaveProperty("totalPages");
    expect(Array.isArray(feed.body.data)).toBe(true);

    const u1 = await request(app)
      .delete(`/api/follow/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(u1.statusCode).toBe(200);
    expect(u1.body.seguindo).toBe(false);

    const st2 = await request(app)
      .get(`/api/follow/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(st2.statusCode).toBe(200);
    expect(st2.body.seguindo).toBe(false);
  });

  it("cliente: unfollow sem estar seguindo retorna 404", async () => {
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

    await request(app)
      .post("/api/follow")
      .set("Authorization", `Bearer ${token}`)
      .send({ tatuador_id: tatuadorId });

    await request(app)
      .delete(`/api/follow/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .delete(`/api/follow/tatuador/${tatuadorId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("Rotas de follow — tatuador seguidores", () => {
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

  it("tatuador ou admin: GET seguidores retorna array", async () => {
    if (!token || (role !== "tatuador" && role !== "admin")) {
      return;
    }
    const res = await request(app)
      .get("/api/follow/seguidores")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
