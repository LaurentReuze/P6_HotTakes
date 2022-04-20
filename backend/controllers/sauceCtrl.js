const Sauce = require("../models/saucesModel");
const fs = require("fs");
const { table } = require("console");

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
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      res.status(404).json({ error: new Error("Objet non trouvé") });
    }
    if (sauce.userId !== req.auth.userId) {
      res.status(401).json({ error: new Error("Requête non authorisé") });
    }
  });
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeDisliked = (req, res, next) => {
  async function modifSauce() {
    try {
      const like = req.body.like;
      const sauce = await Sauce.findOne({ _id: req.params.id });
      // Si l'utilisateur ajoute un like
      if (like === 1) {
        sauce.likes++;
        console.log(sauce.likes);
        Sauce.updateOne(
          { _id: req.params.id },
          {
            likes: sauce.likes,
            usersLiked: [req.body.userId],
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
      // Si l'utilisateur ajoute un dislike
      if (like === -1) {
        sauce.dislikes++;
        Sauce.updateOne(
          { _id: req.params.id },
          {
            dislikes: sauce.dislikes,
            usersDisliked: [req.body.userId],
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
      // Si l'utilisateur enlève son like ou Dislike
      if (like === 0) {
        if (sauce.usersLiked.includes(req.body.userId)) {
          const indexTab = sauce.usersLiked.indexOf(req.body.userId);
          // console.log(indexTab);
          sauce.usersLiked.splice(indexTab, 1);
          // console.table(sauce.usersDisliked);
          sauce.likes--;
          Sauce.updateOne(
            { _id: req.params.id },
            {
              likes: sauce.likes,
              usersLiked: sauce.usersLiked,
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          const indexTab = sauce.usersDisliked.indexOf(req.body.userId);
          // console.log(indexTab);
          sauce.usersDisliked.splice(indexTab, 1);
          // console.table(sauce.usersDisliked);
          sauce.dislikes--;
          Sauce.updateOne(
            { _id: req.params.id },
            {
              dislikes: sauce.dislikes,
              usersDisliked: sauce.usersDisliked,
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
    } catch (error) {
      (error) => res.status(400).json({ error });
    }
  }
  modifSauce();
};
