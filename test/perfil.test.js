const app = require("../app.js")
const request = require('supertest');

TEST_EMAIL = process.env.TEST_EMAIL
TEST_PASSWORD = process.env.TEST_PASSWORD



describe("Checagem do role do usuario", function () {
    it('testando se o usuario aparece com o role correto (tatuador, cliente ou admin)', async () => {
        const loginRes = await request(app)
            .post('/api/user/login')
            .send({email: TEST_EMAIL, senha: TEST_PASSWORD});
        
        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body).toHaveProperty('token');

        const token = loginRes.body.token;

        const perfilRes = await request(app)
            .get('/api/perfil/')
            .set('Authorization', `Bearer ${token}`);

        expect(perfilRes.statusCode).toBe(200);
        expect(perfilRes.body).toHaveProperty('role');

        expect(['cliente', 'tatuador', 'admin']).toContain(perfilRes.body.role)
        console.log(loginRes.body)
    })

    it('deve retornar role "tatuador" para um usuário tatuador', async () => {
        const loginRes = await request(app)
            .post('/api/user/login')
            .send({ email: TEST_EMAIL, senha: TEST_PASSWORD });
        
        const perfilRes = await request(app)
            .get('/api/perfil/')
            .set('Authorization', `Bearer ${loginRes.body.token}`);
        
        expect(perfilRes.statusCode).toBe(200);
        expect(perfilRes.body.role).toBe('tatuador');
    });

    it('deve retornar role "cliente" para um usuário cliente', async () => {
        const loginRes = await request(app)
            .post('/api/user/login')
            .send({ email: TEST_EMAIL, senha: TEST_PASSWORD });
        
        const perfilRes = await request(app)
            .get('/api/perfil/')
            .set('Authorization', `Bearer ${loginRes.body.token}`);
        
        expect(perfilRes.statusCode).toBe(200);
        expect(perfilRes.body.role).toBe('cliente');
    });
})