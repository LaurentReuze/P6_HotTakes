const Sauce = require("../models/saucesModel");

exports.getAllSauce = (req, res, next) => {
  // On cherche dans la BD; l'intégralite des sauces avcec Sauce.find()
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  // On cherche dans la BD, uniquement une sauce avec sauce.findOne()
  // le req.params.id est un paramètre de la route c'est :id dans le chemin
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.creatSauce = (req, res, next) => {
  // On recupère un objet JS sous forme de chaine de caractère (car il contient une image),
  // donc on le parse pour le retransformer en objet JS
  const sauceParse = JSON.parse(req.body.sauce);
  // On supprime l'id de la requete crée par Mongoose pour laisser la DB géré ses propres Id
  delete sauceParse._id;
  // On crée une nouvel instance du modèle
  const sauce = new Sauce({
    // On recupère l'intégralité du body pour ensuite l'enregistrer plus tard dans la BD
    ...sauceParse,
    // ${req.protocol} correspond au protocole HTTP ou HTTPS
    // ${req.host("host")} correspond au début de l'adresse du site (ex. www.google.fr)
    // ${req.file.filename}` correspond au nom du fichier
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  //   // On sauvegarde l'objet dans la BD
  sauce
    .save()
    //     // Si tout est ok, on envoi un status 201 (création)
    .then(() => res.status(201).json({ message: "Nouvelle sauce crée !" }))
    //     // Si ça s'est mal passé, on envoi un status 400 (Bad erreur)
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeDisliked = (req, res, next) => {};
