const jwt = require("jsonwebtoken");

exports.generateAccessToken = function( id ) {
  return generateToken( id );
}

generateToken = function( id ) {
  const secret = process.env.ACCESS_TOKEN;

  const accessToken = jwt.sign(
    { ID: id },
    secret,
    { expiresIn: "1h" }
  );

  return accessToken;
}

exports.checkExpiry = function( token ) {
  const exp = token.exp;
  const date = new Date.now();

  return date > exp;
}
