const jwt = require("jsonwebtoken");
const secretKey = "kunciRahasiaYangTidakSama";
function authenticateTokenAdmin(req, res, next) {
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
    const { adminId, email_admin } = decoded;
    req.admin = { adminId, email_admin };
    next();
  });
}
module.exports = authenticateTokenAdmin;

