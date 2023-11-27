const jwt = require("jsonwebtoken");
const secretKey = "kunciRahasiaYangSama";
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Akses ditolak, token tidak ada" });
  }
  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ error: "Format token tidak valid" });
  }

  const tokenValue = tokenParts[1];

  jwt.verify(tokenValue, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token tidak valid" });
    }
    const { userId, email_user } = decoded;
    req.user = { userId, email_user };
    next();
  });
}
module.exports = authenticateToken;
