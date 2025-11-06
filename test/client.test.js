const app = require("../app.js")
const request = require('supertest');

TEST_EMAIL = process.env.TEST_EMAIL
TEST_PASSWORD = process.env.TEST_PASSWORD

let clientId;

describe("Rotas de cliente", function() {
    let accessToken
    it('faz login e obtém o token de acesso', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: TEST_EMAIL, senha: TEST_PASSWORD });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        accessToken = res.body.token;
    })

    
    it('testando criar um cliente com dados válidos', async () => {
        const newClient = {
            nome: "Cliente Teste JS",
            telefone: "11999998888",
            descricao: "Descrição do cliente de teste",
            endereco: "Rua do Teste, 123"
        };
        const response = await request(app)
            .post('/api/client/')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newClient);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('client_id');
        expect(response.body.nome).toBe(newClient.nome);
        clientId = response.body.client_id; 
    })

    it('deve retornar 400 se o campo nome estiver em branco (obrigatório)', async () => {
        const response = await request(app)
            .post('/api/client/')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ telefone: "11999998888" });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Campos obrigatórios em branco");
    })
    
    it('deve retornar 400 se o nome for muito curto', async () => {
        const response = await request(app)
            .post('/api/client/')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ nome: "Cur", telefone: "11999998888" });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Campos inválidos");
    })

    it('deve retornar 400 se o telefone contiver caracteres não numéricos', async () => {
        const response = await request(app)
            .post('/api/client/')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ nome: "Nome Válido", telefone: "11-999998888" });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Campos inválidos");
    })


    it('testando listar todos os clientes do usuário logado', async () => {
        const response = await request(app)
            .get('/api/client/')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0); 
    })
    
    it('testando buscar cliente por nome (query param)', async () => {
        const response = await request(app)
            .get('/api/client/?nome=Teste')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].nome.toLowerCase()).toContain("teste");
    })
    
    it('testando buscar cliente por telefone (query param)', async () => {
        const phone = "11999998888";
        const response = await request(app)
            .get(`/api/client/?telefone=${phone}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(false); 
       // expect(response.body[0].telefone).toBe(phone);
    })

    
    it('testando buscar cliente por ID válido', async () => {
        const response = await request(app)
            .get(`/api/client/${clientId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('client_id', clientId);
        expect(response.body.nome).toBe("Cliente Teste JS");
    })

    it('deve retornar 404 para ID de cliente inexistente', async () => {
        const nonExistentId = 999999;
        const response = await request(app)
            .get(`/api/client/${nonExistentId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Cliente não encontrado ou não pertence ao usuario");
    })


    it('testando atualizar nome e endereço do cliente', async () => {
        const updatedData = {
            nome: "Cliente Teste Atualizado",
            endereco: "Novo Endereço, 456"
        };
        const response = await request(app)
            .put(`/api/client/${clientId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedData);
        expect(response.statusCode).toBe(200);
        expect(response.body.nome).toBe(updatedData.nome);
        expect(response.body.endereco).toBe(updatedData.endereco);
        expect(response.body.telefone).toBe("11999998888"); 
    })

    it('deve retornar 400 ao tentar atualizar com nome inválido', async () => {
        const response = await request(app)
            .put(`/api/client/${clientId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ nome: "Cur" }); 
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Campos inválidos");
    })
    
    it('deve retornar 404 ao tentar atualizar um cliente inexistente', async () => {
        const nonExistentId = 999999;
        const response = await request(app)
            .put(`/api/client/${nonExistentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ nome: "Nome Válido" });
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Cliente não encontrado ou não pertence ao usuario");
    })

    
    it('testando deletar o cliente criado', async () => {
        const response = await request(app)
            .delete(`/api/client/${clientId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Cliente removido com sucesso");
    })
    
    it('deve retornar 404 ao tentar deletar o mesmo cliente novamente', async () => {
        const response = await request(app)
            .delete(`/api/client/${clientId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Cliente não encontrado ou não pertence ao usuario");
    })

    it('deve retornar 404 ao tentar deletar cliente inexistente', async () => {
        const nonExistentId = 999999;
        const response = await request(app)
            .delete(`/api/client/${nonExistentId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Cliente não encontrado ou não pertence ao usuario");
    })

    it('testando acesso negado na rota GET /api/client/ sem token', async () => {
        const response = await request(app)
            .get('/api/client/');
        expect(response.statusCode).toBe(401);
    })
})