const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://UserTest:w2lwDiCKFcClDXov@cluster0.ndetm.mongodb.net/hot_takes?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },

  (err) => {
    if (!err) console.log("Connexion à MongoDB réussie !");
    else console.log("Connexion à MongoDB échouée :" + err);
  }
);
