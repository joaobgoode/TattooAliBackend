const userService = require('../services/userService');

async function register(req,res) {
  const{
    nome,sobrenome,cpf,email,senha
  } = req.body
  if (!nome || !sobrenome || !cpf || !email || !senha) {
    return res.status(400).json({ error: "Campos obrigatórios em branco"})
  }
  try {
    const user = await userService.getByEmail(email)
    if (user) {
          return res.status(400).json({ error: "Email já cadastrado tente novamente"})
    }
    await userService.create({nome:nome,sobrenome:sobrenome,cpf:cpf,email:email,senha:senha})
    return res.status(200).json({ message: "Usuário criado com sucesso"})
  } catch (error) {
    return res.status(400).json({ error: error.message})
  }

}
