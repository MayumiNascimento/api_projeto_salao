const jwt = require("jsonwebtoken");

exports.verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Adiciona os dados do usuário ao request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido." });
  }
};

exports.permitirApenasAdmin = (req, res, next) => {
  if (req.usuario.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem acessar esta rota." });
  }
  next();
};

exports.permitirApenasFuncionario = (req, res, next) => {
  if (req.usuario.tipo !== "funcionario") {
    return res.status(403).json({ message: "Acesso negado. Apenas funcionários podem acessar esta rota." });
  }
  next();
};
