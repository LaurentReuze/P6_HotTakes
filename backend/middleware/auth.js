// MiddleWare qui vérifie le token

const jwtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // On recupère le token dans le header / Authorization
    // split(' ') signifie l'espace qu'il y a entre Beare et le token
    // [1] correspond au second élément du tableau (le token)
    const token = req.headers.authorization.split(" ")[1];
    // jwtoken.verify vérifie le token avec la clé Publique
    // On recupère un objet JS
    const decodeToken = jwtoken.verify(token, "random_token_secret");
    // on recupère le userId de l'objet JS decodeToken
    const userId = decodeToken.userId;
    req.auth = { userId };
    // le premier req.body vérifie si il y a un userId dans la requete
    // req.body.userId && req.body.userId vérifie si il y a un userId ET qu'il est différent
    // de userId du token
    if (req.body.userId && req.body.userId !== userId) {
      throw "le User ID ne correspond pas";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
