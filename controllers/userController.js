const userService = require('../services/userService');
const auth = require('../authentication/auth.js')

const bcrypt = require('bcrypt')

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

async function login(req,res) {
  const{
    nome,sobrenome,cpf,email,senha
  } = req.body
  if ( !email || !senha) {
    return res.status(400).json({ error: "Campos obrigatórios em branco"})
  }
  try {
    const user = await userService.getByEmail(email)
    if (!user) {
          return res.status(400).json({ error: "Email não cadastrado"})
    }
    const senhaHasheada = user.senha
    const ok = await bcrypt.compare(senha,senhaHasheada)
    if (!ok) {
          return res.status(400).json({ error: "Senha inválida"})
    }
    const token = auth.generateAccessToken(user)
    return res.status(200).json({token:token})
  } catch (error) {
    return res.status(400).json({ error: error.message})
  }
}

module.exports = {register,login}