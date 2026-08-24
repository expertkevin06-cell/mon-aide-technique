// ===== BASE DE DONNÉES — Analyse Technique Kevin =====
// Ajoutez vos rappels réels en suivant ce modèle :
// { marque, modele, moteur, annee, titre, details }

const DB = [
  { marque: "RENAULT", modele: "Clio IV", moteur: "1.5 dCi 90", annee: "2015-2019",
    titre: "Rappel — Boîte EDC",
    details: "Mise à jour du logiciel de gestion de la boîte automatique EDC.\nContactez votre concessionnaire Renault." },
  { marque: "RENAULT", modele: "Clio IV", moteur: "0.9 TCe 90", annee: "2013-2016",
    titre: "Rappel — Serrures de portes",
    details: "Remplacement des serrures avant pouvant se bloquer par temps froid." },
  { marque: "RENAULT", modele: "Captur", moteur: "1.2 TCe 120", annee: "2014-2017",
    titre: "Rappel — Consommation d'huile",
    details: "Contrôle du niveau d'huile et remplacement du moteur si nécessaire." },
  { marque: "PEUGEOT", modele: "3008", moteur: "1.6 BlueHDi 120", annee: "2017-2020",
    titre: "Rappel — AdBlue",
    details: "Vérification du circuit AdBlue et mise à jour du calculateur moteur." },
  { marque: "PEUGEOT", modele: "208", moteur: "1.2 PureTech 82", annee: "2014-2019",
    titre: "Rappel — Courroie de distribution humide",
    details: "Contrôle de la courroie dans le bain d'huile.\nRemplacement si usure détectée." },
  { marque: "VOLKSWAGEN", modele: "Golf VII", moteur: "1.6 TDI 115", annee: "2013-2017",
    titre: "Rappel — Correctif émissions NOx",
    details: "Correctif logiciel du calculateur moteur.\nOpération gratuite chez le concessionnaire." },
  { marque: "BMW", modele: "Série 3 (F30)", moteur: "320d 190 ch", annee: "2015-2018",
    titre: "Rappel — Vanne EGR",
    details: "Remplacement de la vanne EGR pouvant fuiter (risque incendie)." }
];
