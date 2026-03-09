require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

let cadastros = [];
let proximoID = 1;

//validacoes
function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validaTelefone(telefone) {
  const apenasNumeros = String(telefone).replace(/\D/g, "");
  return /^\d{10,11}$/.test(apenasNumeros);
}

//midleware de validação
function validarCadastro(req, res, next) {
  const { nome, email, telefone, mensagem } = req.body;
  if (!nome || !email || !telefone) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }
  if (!emailValido(email)) {
    return res.status(400).json({ mensagem: "Email inválido" });
  }
  if (!telefone || !validaTelefone(telefone)) {
    return res.status(400).json({ mensagem: "Telefone inválido" });
  }
  if (mensagem && mensagem.length > 500) {
    return res
      .status(400)
      .json({ mensagem: "Mensagem deve conter no máximo 500 caracteres" });
  }
  next();
}

app.get("/cadastros", (req, res) => {
  res.status(200).json(cadastros);
});
app.post("/cadastros", validarCadastro, (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;
  const novoCadastro = {
    id: proximoID++,
    nome,
    email,
    telefone,
    mensagem: mensagem || null,
  };
  cadastros.push(novoCadastro);
  res.status(201).json({
    mensagem: "Cadastro com sucesso",
    cadastro: novoCadastro,
  });
});

app.listen(PORT, () => {
  console.log("servidor iniciado na porta" + PORT);
});
