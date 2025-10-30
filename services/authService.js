const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Envia email de recuperação de senha usando Supabase Auth.
 * @param {string} email
 * @param {string} redirectTo - URL para onde o usuário será redirecionado após clicar no link de recuperação (opcional)
 */
async function sendPasswordResetEmail(email, redirectTo) {
  if (!email){
    throw new Error('Email é obrigatório');
  } 

  const options = {};
  if (redirectTo){
    options.redirectTo = redirectTo;
  } 

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, options);

  if (error) {
    const err = new Error(error.message || 'Erro ao solicitar recuperação de senha');
    err.original = error;
    throw err;
  }

  return data;
}

module.exports = { sendPasswordResetEmail };
