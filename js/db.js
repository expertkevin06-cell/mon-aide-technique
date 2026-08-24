// ===== BASE DE DONNÉES — Analyse Technique Kevin =====
// Problèmes connus par marque/catégorie — 2018 à 2026
// Sources à vérifier : OVS France, rappels constructeurs

const DB = [

// ==================== 🇫🇷 RENAULT ====================
{marque:"RENAULT",modele:"Clio V",moteur:"1.0 TCe 90",annee:"2019-2026",titre:"Airbag — Ceinture",details:"Défaut possible du prétensionnaire de ceinture côté passager.\nVérifier campagne OVS constructeur."},
{marque:"RENAULT",modele:"Clio V",moteur:"E-Tech 140",annee:"2020-2026",titre:"Batterie haute tension — Charge",details:"Risque d'arrêt de charge prématurée ou défaut contacteur de recharge.\nDiagnostic OBD + mise à jour BMS."},
{marque:"RENAULT",modele:"Captur II",moteur:"1.3 TCe 130/160",annee:"2019-2026",titre:"Tenue de route — Freinage",details:"Défaut capteur ESP possible entraînant perte d'assistance au freinage.\nRemplacement bloc ABS si campagne."},
{marque:"RENAULT",modele:"Megane E-Tech",moteur:"Électrique",annee:"2022-2026",titre:"ADAS — Caméra frontale",details:"Caméra de conduite assistée pouvant se désactiver (freinage AEB inopérant).\nMise à jour logiciel ADAS."},
{marque:"RENAULT",modele:"Zoe",moteur:"Électrique R110/R135",annee:"2018-2024",titre:"Charge — Batterie HT",details:"Défaut boîtier de charge embarquée (OBC), charge impossible ou lente.\nContrôle câble type 2 et OBC."},
{marque:"RENAULT",modele:"Austral / Espace VI",moteur:"Tous",annee:"2022-2026",titre:"Tablette multimédia",details:"Écran OpenR : freeze, redémarrages, perte CarPlay.\nMise à jour firmware constructeur."},

// ==================== 🇫🇷 PEUGEOT ====================
{marque:"PEUGEOT",modele:"208 II / e-208",moteur:"PureTech / Électrique",annee:"2019-2026",titre:"Ceinture — Boucle arrière",details:"Boucles de ceinture arrière pouvant ne pas verrouiller correctement.\nRemplacement boucles."},
{marque:"PEUGEOT",modele:"208 / e-208",moteur:"Électrique 136 ch",annee:"2020-2026",titre:"Batterie HT — Coupure puissance",details:"Défaut contacteur principal HS pouvant couper la traction en roulant.\nCampagne remplacement contacteur."},
{marque:"PEUGEOT",modele:"3008 II / 5008 II",moteur:"PureTech / BlueHDi",annee:"2018-2023",titre:"Tenue de route — Suspension",details:"Bras de suspension et silentblocs usure prématurée → bruits, trajectoire instable.\nContrôle géométrie + remplacement bras."},
{marque:"PEUGEOT",modele:"3008 II",moteur:"Hybrid 225/300",annee:"2020-2023",titre:"ABS — Freinage hybride",details:"Défaut modulateur frein régénératif, voyant ABS/ESP allumé.\nReprogrammation ou remplacement bloc hydraulique."},
{marque:"PEUGEOT",modele:"308 III / 2008 II",moteur:"PureTech 130",annee:"2021-2026",titre:"ADAS — Caméra",details:"Caméra frontale défaillante : alertes collision intempestives ou absentes.\nRecalibration caméra après remplacement pare-brise."},
{marque:"PEUGEOT",modele:"Tous modèles i-Cockpit",moteur:"Tous",annee:"2018-2026",titre:"Tablette — Écran tactile",details:"Panne écran tactile, perte affichage compteur numérique.\nMise à jour NAC/RCC ou remplacement dalle."},

// ==================== 🇫🇷 CITROËN ====================
{marque:"CITROEN",modele:"C3 III / C4",moteur:"PureTech / Électrique",annee:"2018-2026",titre:"Airbag Takata",details:"Gonfleur d'airbag passager Takata dégradé par l'humidité (risque projection).\n⚠️ PRIORITÉ MAXIMALE — remplacement gonfleur."},
{marque:"CITROEN",modele:"ë-C4 / ë-C3",moteur:"Électrique",annee:"2021-2026",titre:"Charge rapide DC",details:"Défaut onduleur/borne CCS : arrêts de charge rapide.\nMise à jour logiciel batterie + contrôle connecteur."},
{marque:"CITROEN",modele:"C5 Aircross",moteur:"Hybride 225",annee:"2018-2026",titre:"Batterie HT — Refroidissement",details:"Pompe de refroidissement batterie défaillante → limitation puissance.\nRemplacement pompe + purge circuit."},

// ==================== 🇩🇪 VOLKSWAGEN ====================
{marque:"VOLKSWAGEN",modele:"ID.3 / ID.4",moteur:"Électrique",annee:"2020-2026",titre:"Tablette — Écran central",details:"Écran tactile qui s'éteint (caméras de recul et indicateurs perdus).\nCampagne mise à jour logicielle ID."},
{marque:"VOLKSWAGEN",modele:"Golf VIII",moteur:"TSI / TDI",annee:"2020-2026",titre:"ADAS — Assistants défaillants",details:"Erreurs Travel Assist, ACC qui coupe aléatoirement.\nMise à jour software + recalibration radar."},
{marque:"VOLKSWAGEN",modele:"ID.4 / ID.5",moteur:"Électrique",annee:"2021-2026",titre:"Batterie HT — Cellules",details:"Cellules CATL défectueuses : perte de capacité, risque coupure traction.\nCampagne remplacement module batterie."},
{marque:"VOLKSWAGEN",modele:"T-Roc / Tiguan",moteur:"TSI / TDI",annee:"2018-2026",titre:"ABS — Capteurs roue",details:"Capteurs ABS encrassés/défaillants → voyant ESP + ABS désactivé.\nNettoyage/remplacement capteurs."},

// ==================== 🇩🇪 AUDI / BMW / MERCEDES ====================
{marque:"AUDI",modele:"Q4 e-tron / e-tron GT",moteur:"Électrique",annee:"2021-2026",titre:"Charge — Batterie HT",details:"Défaut gestion charge AC/DC, limitation à faible puissance.\nCampagne logiciel BMS."},
{marque:"AUDI",modele:"A3 / A4 / Q5",moteur:"TFSI / TDI",annee:"2018-2026",titre:"Airbag — Prétensionneurs",details:"Prétensionneurs pyrotechniques sensibles à l'humidité (campagne Takata étendue).\nVérif VIN chez concessionnaire."},
{marque:"BMW",modele:"Série 3 G20 / X5",moteur:"Diesel / Essence",annee:"2019-2026",titre:"Freinage — ABS/DSC",details:"Défaut calculateur DSC : perte partielle freinage, voyants allumés.\nCampagne remplacement module DSC."},
{marque:"BMW",modele:"i4 / iX / iX3",moteur:"Électrique",annee:"2021-2026",titre:"Batterie HT — Coupure",details:"Défaut cellules Samsung SDI : arrêt brutal possible de la traction.\nDiagnostic batterie + campagne remplacement."},
{marque:"BMW",modele:"X1 U11 / Série 1 F40",moteur:"Essence / Hybride",annee:"2019-2026",titre:"ADAS — Caméra",details:"Caméra frontale non opérationnelle après choc léger pare-brise.\nRecalibration obligatoire."},
{marque:"MERCEDES-BENZ",modele:"EQE / EQS",moteur:"Électrique",annee:"2021-2026",titre:"Tablette MBUX",details:"Écran MBUX noir/redémarrage, perte navigation.\nMises à jour OTA + TCU."},
{marque:"MERCEDES-BENZ",modele:"GLC / Classe C W206",moteur:"220d / 300e",annee:"2022-2026",titre:"Tenue de route — Direction",details:"Défaut crémaillère EPS : assistance variable ou perte direction assistée.\nCampagne remplacement crémaillère."},
{marque:"MERCEDES-BENZ",modele:"Classe A / GLB",moteur:"Tous",annee:"2018-2026",titre:"Ceintures — Enrouleurs",details:"Enrouleurs de ceinture bloqués ou sans rappel automatique.\nRemplacement enrouleurs."},

// ==================== 🇺🇸 TESLA / FORD / JEEP ====================
{marque:"TESLA",modele:"Model 3 / Model Y",moteur:"Électrique",annee:"2019-2026",titre:"ADAS — Autopilot/Caméra",details:"Rappels multiples : stop fantôme, feux rouges non détectés, caméras embuées.\nMises à jour OTA régulières."},
{marque:"TESLA",modele:"Model Y",moteur:"Électrique",annee:"2021-2026",titre:"Ceintures — Fixation",details:"Ceintures arrière mal boulonnées (rappel 2022).\nRetorque des fixations."},
{marque:"TESLA",modele:"Model 3/Y/S/X",moteur:"Électrique",annee:"2018-2026",titre:"Charge — Connecteur",details:"Porte de charge bloquée, défaut Supercharge, câble CCS.\nRemplacement portique ou connecteur."},
{marque:"FORD",modele:"Kuga PHEV",moteur:"Hybride rechargeable 225",annee:"2019-2022",titre:"⚠️ Batterie HT — INCENDIE",details:"Cellules défectueuses risquant incendie même à l'arrêt.\n🚨 NE PAS CHARGER — rappel majeur, remplacement pack batterie."},
{marque:"FORD",modele:"Focus IV / Fiesta VII",moteur:"EcoBoost/EcoBlue",annee:"2018-2026",titre:"Embrayage — Boîte Powershift",details:"Patine embrayage, vibrations, défaut TCU.\nRemplacement embrayage + reprog TCU."},
{marque:"JEEP",modele:"Avenger / Renegade 4xe",moteur:"Hybride / Électrique",annee:"2023-2026",titre:"Batterie HT / ADAS",details:"Défauts charge PHEV + caméra recul intermittente.\nCampagnes logicielles Stellantis."},

// ==================== 🇯🇵 TOYOTA / NISSAN / HONDA / MAZDA ====================
{marque:"TOYOTA",modele:"RAV4 V Hybrid",moteur:"Hybride 222/306",annee:"2019-2026",titre:"Tenue de route — Séparation roue",details:"Boulons de roue pouvant se desserrer (campagne 2020).\n⚠️ Contrôle serrage roues immédiat."},
{marque:"TOYOTA",modele:"Yaris IV / Corolla XII",moteur:"Hybride",annee:"2019-2026",titre:"Freinage — ABS hybride",details:"Défaut pompe à frein hybride → course pédale longue, ABS inopérant.\nCampagne pompe de freinage."},
{marque:"TOYOTA",modele:"bZ4X",moteur:"Électrique",annee:"2022-2026",titre:"⚠️ Roues — Fixations",details:"Risque de décollement de roue (vis de moyeu).\n🚨 Immobilisation temporaire — remplacement vis."},
{marque:"NISSAN",modele:"Leaf",moteur:"Électrique",annee:"2018-2026",titre:"Batterie HT — Dégradation",details:"Perte capacité accélérée par chaleur (pas de TMS liquide).\nTest SOH via LeafSpy."},
{marque:"NISSAN",modele:"Qashqai III",moteur:"DIG-T / e-Power",annee:"2021-2026",titre:"ADAS — ProPilot",details:"ProPilot qui se désengage, caméra/radar désynchronisés.\nRecalibration + mises à jour."},
{marque:"HONDA",modele:"CR-V / Civic e:HEV",moteur:"Hybride",annee:"2022-2026",titre:"Tablette — Honda Connect",details:"Freeze écran, GPS perdu, Bluetooth instable.\nMises à jour firmware."},
{marque:"MAZDA",modele:"CX-60 PHEV",moteur:"PHEV 327 ch",annee:"2022-2026",titre:"Batterie HT — Coupure",details:"Arrêt moteur hybride en roulant (campagne 2023).\nReprog logiciel hybride."},
{marque:"SUBARU",modele:"Forester / Outback",moteur:"Boxer / e-Boxer",annee:"2018-2026",titre:"ABS — EyeSight",details:"Défaut EyeSight : freinage auto intempestif, caméras stéréo.\nRecalibration + reprog."},

// ==================== 🇰🇷 HYUNDAI / KIA ====================
{marque:"HYUNDAI",modele:"IONIQ 5",moteur:"Électrique 170-325 ch",annee:"2021-2026",titre:"⚠️ Batterie HT — INCENDIE",details:"Cellules LG défectueuses : risque incendie.\n🚨 Campagne mondiale — diagnostic + remplacement pack."},
{marque:"HYUNDAI",modele:"Kona Electric I",moteur:"Électrique",annee:"2018-2021",titre:"⚠️ Batterie HT — INCENDIE",details:"Le plus grand rappel batterie HT de l'histoire (~80 000 veh).\nRemplacement intégral batterie LG."},
{marque:"HYUNDAI",modele:"Tucson IV / Santa Fe",moteur:"Hybride/PHEV",annee:"2020-2026",titre:"Freinage — ABS/ESC",details:"Défaut module ESC : fuite liquide interne → perte freinage assisté.\nCampagne remplacement bloc HECU."},
{marque:"KIA",modele:"EV6",moteur:"Électrique",annee:"2021-2026",titre:"Charge — ICCU",details:"Défaut Integrated Charging Control Unit : charge impossible, coupure traction.\nCampagne remplacement ICCU."},
{marque:"KIA",modele:"Sportage V / Niro",moteur:"Hybride/PHEV",annee:"2021-2026",titre:"ABS — HECU",details:"Comme Hyundai Tucson : fuite interne bloc ABS.\nRemplacement unité hydraulique."},
{marque:"KIA",modele:"Stonic / Picanto",moteur:"Essence",annee:"2018-2026",titre:"Airbag — Câblage",details:"Connecteur airbag volant défaillant → témoin airbag allumé.\nRemplacement spiral câble."},

// ==================== 🇮🇹 STELLANTIS ITALIE ====================
{marque:"FIAT",modele:"500e",moteur:"Électrique",annee:"2020-2026",titre:"Batterie HT — Charge",details:"Défauts charge rapide et BMS (campagnes 2022-2023).\nMises à jour + contrôle pack."},
{marque:"FIAT",modele:"Ducato",moteur:"2.2/3.0 Multijet",annee:"2018-2026",titre:"Freinage — ABS",details:"Défaut capteur ABS arrière, ESP erratique.\nCapteurs + anneau ABS."},
{marque:"ALFA ROMEO",modele:"Tonale / Giulia",moteur:"Hybride / Diesel",annee:"2022-2026",titre:"ADAS — Caméra",details:"Alertes collision fantômes, AEB intempestif.\nRecalibration caméra Tricam."},

// ==================== 🇸🇪🇬🇧 VOLVO / LAND ROVER / JAGUAR ====================
{marque:"VOLVO",modele:"XC40 Recharge / EX30",moteur:"Électrique",annee:"2021-2026",titre:"Batterie HT — Logiciel",details:"Limitation charge, coupures traction ponctuelles.\nCampagnes OTA + BMS."},
{marque:"VOLVO",modele:"XC60 / XC90",moteur:"B4/B5/T8",annee:"2018-2026",titre:"Tenue de route — Suspension pneumatique",details:"Compresseur suspension arrière défaillant → affaissement.\nRemplacement compresseur."},
{marque:"LAND ROVER",modele:"Range Rover / Defender",moteur:"D200-P400",annee:"2018-2026",titre:"Tablette — Pivi Pro",details:"Crash système infotainment, écran noir, GPS perdu.\nMises à jour OTA fréquentes."},
{marque:"JAGUAR",modele:"I-Pace",moteur:"Électrique 400 ch",annee:"2018-2026",titre:"⚠️ Batterie HT — INCENDIE",details:"Cellules LG : risque incendie pendant charge (rappels 2023-2024).\nDiagnostic batterie + remplacement modules."},

// ==================== 🇨🇳 MG / BYD ====================
{marque:"MG",modele:"MG4 / ZS EV",moteur:"Électrique",annee:"2021-2026",titre:"Charge — BMS",details:"Arrêts de charge, erreurs CCS, limitations puissance.\nMises à jour BMS SAIC."},
{marque:"BYD",modele:"Atto 3 / Seal",moteur:"Électrique",annee:"2022-2026",titre:"ADAS — Caméra",details:"Assistants de conduite imprécis, caméra recul lente.\nMises à jour logicielles."}

];
