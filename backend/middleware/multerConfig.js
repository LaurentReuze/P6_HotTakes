const multer = require("multer");

// Dictionnaire des mine_type
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// multer.diskStorage indique à multer qu'on va enregistrer le fichier sur le disque Dur
const storage = multer.diskStorage({
  // la destination est le dossier du disque dans lequel enregistrer le fichier
  destination: (req, file, callback) => {
    // null signifie qu'il n'y a pas eu d'erreur (je comprend poas trop) et
    //'images' est le nom du dossier
    callback(null, "images");
  },
  // filename est le nom du fichier
  filename: (req, file, callback) => {
    // file.originalname est le nom d'origine du fichier
    // .split(' ') designe les espaces qui peut y avoir dans le nom des fichiers
    // et on le remplace avec un _ avec la methode .join
    const name = file.originalname.split(" ").join("_");
    // on détermine l'extension avec le contenu du mine_type du fichier envoyé
    const extension = MIME_TYPES[file.mimetype];
    // on crée le nom du fichier complet avec le nom(name) + un timestamp(Date.now). l'extension
    callback(null, name + Date.now() + "." + extension);
  },
});
//
module.exports = multer({ storage: storage }).single("image");
