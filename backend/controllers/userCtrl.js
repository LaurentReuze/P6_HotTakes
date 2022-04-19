const User = require("../models/usersModel");
const bcrypt = require("bcrypt");

// ------------------- Gestion de l'enregistrement d'une nouvel utilisateur ----------------
exports.signup = (req, res, next) => {
  // bcrypt.hash est la méthode de bcrypt pour hasher les données
  // (req.body.password) correspond au mot de passe envoyé dans la requête
  // le chiffre 10 correspond au passage de 10 fois la methode de hashage
  bcrypt
    .hash(req.body.password, 10)
    // on recupère le resultat du hash, on crée un nouveau user sur le modèle usersModel
    .then((hashPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashPassword,
      });
      // On sauvegarde dans la BD le nouveau user avec la méthode user.save
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ------------------- Gestion du login de l'utilisateur ----------------
exports.login = (req, res, next) => {
  // cherche le user dans la BD qui correspond à l'adresse mail récupéré dans la requête
  // {email: req.body.email} correspond à l'élément de comparaison pour la recherche dans la BD
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si on ne trouve pas l'email dans la BD, on affiche une erreur 401 + message
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      // Sinon on compare le mot de passe enregistrer avec celui fourni dans la requête
      // avec bcrypt.compare. req.body.password correspond au mdp de la requête
      // user.password celui de la BD
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si le mot de passe ne correspond pas on affiche une erreur 401 + message
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Sinon on envoi un status 200, et on envoi un objet JSON contenant le UserId et un Token
          res.status(200).json({
            userId: user._id,
            token: "TOKEN",
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
