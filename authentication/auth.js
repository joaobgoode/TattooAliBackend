const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_JWT;;

//Gerando um token
function generateAccessToken(username) {
  return jwt.sign(username, secretKey);
}

//Verificando o token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, String(secretKey), (err, user) => {
    console.log(err);

    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;

    next()
  })
}

module.exports = { generateAccessToken, authenticateToken }
