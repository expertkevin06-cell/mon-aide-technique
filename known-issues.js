/* known-issues.js — Pannes connues typiques par modèle (base massive) */
(function(){
'use strict';
/* Structure : [symptôme, causes probables, action, codes DTC associés, source] */
const ISSUES={
'Volkswagen|ID.4':[
['Hayon électrique : ouverture/fermeture aléatoire','Moteur hayon, capteur, câblage','Diagnostic moteur hayon, calibration, remplacement si HS',['B1234'],'Auto-doc'],
['Infotainment MEB : reboots, écran noir','Software instable, mémoire saturée','MAJ firmware 3.x+, reset usine, remplacement head unit',['U0155','U1233'],'Forums VAG'],
['Batterie HT 77 kWh : limitation puissance DC','Thermique pack, modules déséquilibrés','Préconditionnement, contrôle modules, équilibrage',['P0A80','P0B2A'],'Automobile-Propre'],
['Pompe à chaleur : perte autonomie hiver','Pompe HS ou circuit défaillant','Diagnostic pompe à chaleur, contrôle circuit',['Codes thermique'],'InsideEVs'],
['Charge AC 11 kW : limitation à 7 kW','OBC défaillant, câble','Contrôle OBC, câblage, MAJ BMS',['P1E00','Codes OBC'],'Forums ID.4'],
['Radar AV Front Assist : alertes fantômes','Radar sali, décalibration','Nettoyage radar, calibration statique/dynamique',['C1103','C1104'],'L\'Argus'],
['Suspension pneumatique (GTX) : fuite','Coussin d\'air, compresseur','Contrôle circuit, remplacement coussin',['Codes suspension'],'Auto-doc'],
['Direction assistée : alerte intermittente','Capteur couple, colonne','Diagnostic capteur, MAJ, remplacement colonne',['C0710'],'Forums VAG']
],
'Volkswagen|ID.3':[
['Infotainment MEB : lenteurs/reboots','Software instable','MAJ firmware, reset usine',['U0155'],'InsideEVs'],
['Batterie 58 kWh : déséquilibre cellules','Vieillissement, BMS','Équilibrage modules, rapport SOH',['P0A80'],'Automobile-Propre'],
['Charge DC : puissance plafonnée','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'Forums ID.3'],
['Pédale frein : sensation molle','Maître-cylindre, capteur','Contrôle circuit freinage, capteur',['Codes frein'],'Auto-doc']
],
'Volkswagen|Golf':[
['1.2/1.4 TSI : consommation huile','Segments, cylindres ovalisés','Suivi consommation, intervention si >0,5L/1000km',['P0300'],'L\'Argus'],
['DSG7 DQ200 : mécatronique HS','Mécatronique défaillant, embrayages usés','Vidange huile mécatro, MAJ logiciel, remplacement',['P17BF','P0841'],'Golf7.net'],
['1.6 TDI : chaîne distribution','Chaîne/tendeurs fragiles','Remplacement kit chaîne renforcé',['P0016'],'Auto-doc'],
['EGR 2.0 TDI : vanne encrassée','Vanne EGR, refroidisseur','Nettoyage/remplacement EGR + refroidisseur',['P0401','P0402'],'Forums VAG'],
['FAP colmaté (diesel)','Parcours urbains courts','Régénération forcée, contrôle capteurs',['P242F','P2463'],'Auto-doc']
],
'Volkswagen|Tiguan':[
['2.0 TDI : turbo défaillant','Turbo, wastegate, durites','Contrôle turbo, wastegate, durites sous pression',['P0299','P00AF'],'L\'Argus'],
['Boîte DSG6 : à-coups à froid','Huile dégradée, mécatro','Vidange huile boîte + filtre, MAJ logiciel',['P0700'],'Forums VAG'],
['Injection AdBlue : cristallisation','Injecteur AdBlue bouché','Remplacement injecteur AdBlue, rinçage circuit',['P20EE','P202E'],'Auto-doc'],
['Haldex (4Motion) : patinage','Huile dégradée, pompe','Vidange Haldex + filtre, contrôle pompe',['Codes 4WD'],'Forums VAG']
],
'Peugeot|3008':[
['1.2 PureTech : courroie immergée dégradation','Courroie dans l\'huile, crépine bouchée','Remplacement courroie + crépine + huile 0W20',['P0016','P0300'],'Forum-PE'],
['1.5 BlueHDi : chaîne distribution','Chaîne arbre à cames fragile','Remplacement kit chaîne renforcée',['P0016'],'L\'Argus'],
['EAT8 : à-coups passages rapports','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forum-PE'],
['AdBlue : cristallisation injecteur','Qualité AdBlue, injecteur','Contrôle qualité AdBlue, remplacement injecteur',['P20EE','P202E'],'Auto-doc'],
['Multimédia i-Cockpit : écran noir','Head unit défaillant','MAJ firmware, reset, remplacement',['U0155'],'Caradisiac']
],
'Peugeot|208':[
['1.2 PureTech : courroie distribution','Courroie immergée dégradation','Remplacement courroie + crépine',['P0016'],'Forum-PE'],
['e-208 : autonomie réelle < WLTP','Batterie 50 kWh, thermique','Rapport SOH, équilibrage modules',['P0A80'],'Automobile-Propre'],
['Boîte EAT6 : à-coups urbains','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forum-PE'],
['Capteurs TPMS : perte signal','Pile capteur, interférences','Remplacement capteur, réapprentissage',['C0750'],'Auto-doc']
],
'Renault|Clio':[
['1.2 TCe : consommation huile','Segments, cylindres ovalisés','Suivi consommation, bougies/bobines',['P0300','P0171'],'Renault-Forum'],
['1.5 dCi K9K : injecteurs/pompe HP','Limaille circuit HP','Rinçage circuit, pompe HP + injecteurs',['P0087','P0201'],'L\'Argus'],
['EDC : à-coups passages rapports','Double embrayage usé','Contrôle embrayages, MAJ logiciel',['P0700'],'Renault-Forum'],
['FAP colmaté (dCi)','Parcours urbains courts','Régénération forcée, contrôle capteurs',['P242F'],'Auto-doc']
],
'Renault|Mégane E-Tech':[
['Batterie 40/60 kWh : charge DC lente','Thermique pack, BMS','Préconditionnement, MAJ BMS',['Codes HV'],'Automobile-Propre'],
['OpenR Link : reboots, écran noir','Software, mémoire','MAJ OpenR Link, reset usine',['U1233'],'Renault-Forum'],
['Pompe à chaleur : efficacité réduite','Pompe HS, circuit','Diagnostic pompe, contrôle circuit',['Codes thermique'],'Auto-doc'],
['ADAS : calibration caméra pare-brise','Caméra décalée','Calibration statique/dynamique',['U-codes ADAS'],'Les Numériques']
],
'Renault|Zoe':[
['Batterie 22/41 kWh : SOH faible','Vieillissement cellules','Rapport SOH, équilibrage, remplacement modules',['P0A80'],'Automobile-Propre'],
['Charge AC 22 kW : limitation','Chargeur embarqué','Contrôle OBC, câblage, MAJ',['P1E00'],'InsideEVs'],
['Moteur R90/R110 : roulements bruit','Roulements usés','Remplacement roulements moteur',['Codes moteur'],'Renault-Forum']
],
'Dacia|Duster':[
['1.5 dCi : chaîne distribution','Chaîne fragile','Remplacement kit chaîne',['P0016'],'L\'Argus'],
['Boîte EDC : à-coups','Double embrayage usé','Vidange, MAJ logiciel',['P0700'],'Forum-PE'],
['4x4 : boîte transfert bruit','Huile dégradée, pignons','Vidange boîte transfert, contrôle pignons',['Codes 4WD'],'Auto-doc']
],
'Citroën|C5 Aircross':[
['1.2 PureTech : courroie immergée','Dégradation prématurée','Remplacement courroie + crépine',['P0016'],'Planète Citroën'],
['1.5 BlueHDi : chaîne distribution','Chaîne AAC fragile','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['Suspension hydraulique progressive','Fuite sphères, LHM','Contrôle sphères, remplacement si fuite',['Codes suspension'],'Planète Citroën'],
['EAT8 : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Auto-doc']
],
'Citroën|ë-C4':[
['Batterie 50 kWh : déséquilibre','Vieillissement cellules','Équilibrage modules, rapport SOH',['P0A80'],'Automobile-Propre'],
['Charge DC 100 kW : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Head unit : reboots','Software','MAJ firmware, reset',['U0155'],'Planète Citroën']
],
'Toyota|Yaris':[
['Hybride 1.5 : batterie HT faible','Cellules déséquilibrées','Reconditionnement batterie, équilibrage',['P0A80'],'L\'Argus'],
['Boîte e-CVT : bruit moulinage','Planétaires usés','Contrôle huile, planétaires',['P0700'],'Forum Toyota'],
['EGR : encrassement (diesel)','Vanne EGR','Nettoyage/remplacement',['P0401'],'Auto-doc']
],
'Toyota|RAV4':[
['Hybride 2.5 : batterie HT','Cellules vieillissantes','Reconditionnement, équilibrage',['P0A80'],'L\'Argus'],
['E-CVT : patinage à forte charge','Planétaires, huile','Vidange huile, contrôle planétaires',['P0700'],'Forum Toyota'],
['2.5 D-4D : EGR/FAP','Encrassement diesel','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc']
],
'Hyundai|Kona':[
['Kona Electric : batterie 39/64 kWh','Déséquilibre cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Charge DC 77 kW : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['1.0 T-GDi : chaîne distribution','Chaîne fragile','Contrôle tension, remplacement si bruit',['P0016'],'Auto-doc']
],
'Hyundai|Tucson':[
['1.6 T-GDi Theta II : coussinets bielle (KSDS)','Coussinets fragiles, serrage moteur','Contrôle KSDS, campagne NHTSA, remplacement moteur',['P1326'],'NHTSA'],
['1.6 CRDi : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['DCT7 : à-coups passages','Double embrayage usé','Vidange, MAJ logiciel, remplacement embrayages',['P0700'],'Forums Hyundai']
],
'Kia|EV6':[
['Batterie 77 kWh : limitation thermique','Gestion thermique pack','Préconditionnement, contrôle pompe HT',['Codes HV','P0A93'],'InsideEVs'],
['Charge 800V : puissance plafonnée','Thermique, connecteurs','Contrôle connecteurs CCS, préconditionnement',['Codes charge'],'Automobile-Propre'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Forums Kia']
],
'Kia|Sportage':[
['1.6 CRDi : EGR/FAP','Encrassement diesel','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc'],
['DCT7 : à-coups','Double embrayage','Vidange, MAJ logiciel',['P0700'],'Forums Kia'],
['1.6 T-GDi : injecteurs HP','Injecteurs défaillants','Test injecteurs, remplacement',['P0201'],'L\'Argus']
],
'Ford|Kuga':[
['1.5 EcoBoost : surchauffe','Durites LDR, thermostat','Contrôle circuit refroidissement, remplacement durites',['P0217'],'CarComplaints'],
['2.0 TDCi : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Boîte Powershift : à-coups','Double embrayage, mécatro','Diagnostic boîte, remplacement embrayages',['P0700'],'Forums Ford']
],
'Ford|Mustang Mach-E':[
['Batterie 88/91 kWh : autonomie réduite','Déséquilibre cellules','Équilibrage modules, MAJ BMS',['P0A80'],'InsideEVs'],
['Écran SYNC 4A : reboots','Software instable','MAJ SYNC, reset usine',['U0155'],'Tesla Motors Club'],
['Charge DC 150 kW : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'Automobile-Propre']
],
'Tesla|Model 3':[
['Batterie LFP : calibration SOC','BMS décalibré','Charge 100% périodique, MAJ BMS',['Codes BMS'],'InsideEVs'],
['Panneau de verre : fissures','Choc thermique','Remplacement panneau, garantie',['—'],'Automobile-Propre'],
['Autopilot : rappel logiciel','Caméras/calibration','MAJ OTA, calibration caméras',['C-codes ADAS'],'NHTSA'],
['Suspension : claquements','Amortisseurs, silentblocs','Contrôle suspension, remplacement si jeu',['Codes suspension'],'Tesla Motors Club'],
['Pompe à chaleur : inefficacité','Pompe HS','Remplacement pompe à chaleur',['Codes thermique'],'InsideEVs']
],
'Tesla|Model Y':[
['Batterie LFP : calibration SOC','BMS décalibré','Charge 100% périodique, MAJ BMS',['Codes BMS'],'InsideEVs'],
['Panneau de verre : fissures','Choc thermique','Remplacement panneau',['—'],'Automobile-Propre'],
['Autopilot : rappel logiciel','Software','MAJ OTA, calibration',['C-codes ADAS'],'NHTSA'],
['Hayon : moteur défaillant','Moteur hayon','Remplacement moteur hayon',['B1234'],'Tesla Motors Club'],
['Direction : crémaillère bruit','Crémaillère usée','Remplacement crémaillère',['C0710'],'Forums Tesla']
],
'BMW|Série 3':[
['N47/B47 : chaîne distribution','Chaîne AAC fragile','Kit chaîne renforcé (rappel BMW)',['P0016'],'L\'Argus'],
['2.0 TDI/20d : turbo','Turbo, wastegate','Contrôle turbo, wastegate',['P0299'],'Forums BMW'],
['iDrive : reboots','Software','MAJ iDrive, reset',['U0155'],'Auto-doc']
],
'BMW|X3':[
['N47/B47 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Boîte ZF 8HP : à-coups','Huile dégradée, mécatro','Vidange huile ZF, MAJ logiciel',['P0700'],'Forums BMW'],
['xDrive : transfert bruit','Huile dégradée','Vidange boîte transfert',['Codes 4WD'],'Auto-doc']
],
'Mercedes-Benz|Classe C':[
['OM651 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['7G-Tronic/9G-Tronic : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forums Mercedes'],
['MBUX : reboots','Software','MAJ MBUX, reset usine',['U0155'],'Auto-doc']
],
'Audi|A3':[
['2.0 TDI EA288 : EGR/FAP','Encrassement','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc'],
['DSG7 DQ381 : mécatro','Mécatronique','MAJ logiciel, mécatronique',['P17BF'],'Forums Audi'],
['MMI : reboots','Software','MAJ MMI, reset',['U0155'],'Forums Audi']
],
'Audi|Q4 e-tron':[
['Batterie 77 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Charge DC 135 kW : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['MMI : reboots','Software','MAJ MMI, reset',['U0155'],'Forums Audi']
],
'Volvo|XC60':[
['D4/D5 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Geartronic 8 : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forums Volvo'],
['Sensus : reboots','Software','MAJ Sensus, reset',['U0155'],'Auto-doc'],
['T8 Recharge : batterie HT faible','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre']
],
'BYD|Atto 3':[
['Blade Battery LFP : calibration SOC','BMS décalibré','Charge 100% périodique, MAJ BMS',['Codes BMS'],'InsideEVs'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Automobile-Propre'],
['Charge DC 88 kW : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'Baidu']
],
'BYD|Seal':[
['Blade Battery 82 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Charge DC 150 kW : puissance plafonnée','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Baidu']
],
'Peugeot|5008':[
['1.2 PureTech : courroie immergée','Dégradation','Courroie + crépine + huile',['P0016'],'Forum-PE'],
['1.5 BlueHDi : chaîne distribution','Chaîne AAC fragile','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['EAT8 : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forum-PE']
],
'Renault|Captur':[
['1.2 TCe : consommation huile','Segments','Suivi conso, bougies/bobines',['P0300'],'Renault-Forum'],
['1.5 dCi K9K : injecteurs','Limaille circuit HP','Rinçage, pompe HP + injecteurs',['P0087'],'L\'Argus'],
['EDC : à-coups','Double embrayage','Contrôle embrayages, MAJ logiciel',['P0700'],'Renault-Forum']
],
'Dacia|Sandero':[
['1.0 TCe : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['1.5 dCi : injecteurs/pompe HP','Limaille','Rinçage, pompe HP + injecteurs',['P0087'],'Auto-doc'],
['Boîte EDC : à-coups','Double embrayage','Vidange, MAJ logiciel',['P0700'],'Forum-PE']
],
'Nissan|Qashqai':[
['1.5 dCi (K9K) : injecteurs/pompe HP','Limaille circuit HP','Rinçage, pompe HP + injecteurs',['P0087'],'Auto-doc'],
['1.2 DIG-T : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['e-POWER : batterie HT faible','Cellules déséquilibrées','Équilibrage, MAJ BMS',['P0A80'],'Automobile-Propre']
],
'Nissan|Leaf':[
['Batterie 24/30/40/62 kWh : dégradation','Cellules vieillissantes','Rapport SOH, équilibrage, remplacement modules',['P0A80'],'Automobile-Propre'],
['Charge CHAdeMO : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Réducteur : bruit','Pignons usés','Contrôle huile réducteur, remplacement si bruit',['Codes moteur'],'Forums Leaf']
],
'Mazda|3':[
['2.0 Skyactiv-G : injecteurs HP','Injecteurs défaillants','Test injecteurs, remplacement',['P0201'],'Auto-doc'],
['Skyactiv-D 2.2 : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['i-Activsense : calibration radar','Radar AV décalibré','Calibration statique/dynamique',['C1103'],'Auto-doc']
],
'Subaru|Forester':[
['Boxer : joints de queue de soupape','Fuite huile','Remplacement joints',['P0562'],'Forums Subaru'],
['CVT Lineartronic : à-coups','Huile dégradée, chaîne','Vidange CVT, contrôle chaîne',['P0700'],'Auto-doc'],
['EyeSight : calibration caméra','Caméras pare-brise','Calibration après pare-brise',['C-codes ADAS'],'Forums Subaru']
],
'Fiat|500':[
['1.2 Fire : joints de queue de soupape','Fuite huile','Remplacement joints',['P0562'],'Auto-doc'],
['0.9 TwinAir : turbo','Turbo, wastegate','Contrôle turbo, wastegate',['P0299'],'Planète Fiat'],
['500e : batterie HT','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre']
],
'Alfa Romeo|Giulia':[
['2.0 Turbo : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['2.2 Diesel Multijet : EGR/FAP','Encrassement','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc'],
['Boîte ZF 8 : à-coups','Huile dégradée','Vidange huile ZF, MAJ logiciel',['P0700'],'Forums Alfa']
],
'Jeep|Compass':[
['1.3 T4 : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['2.0 Multijet : EGR/FAP','Encrassement','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc'],
['4xe : batterie HT faible','Cellules déséquilibrées','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Boîte 9HP : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forums Jeep']
],
'Jeep|Wrangler':[
['3.6 Pentastar : refroidissement','Boîtier thermostat, pompe','Contrôle circuit refroidissement',['P0128','P0217'],'Forums Jeep'],
['2.0 Turbo : refroidissement','Circuit LDR','Contrôle circuit, pompe',['P0217'],'L\'Argus'],
['4xe : batterie HT','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Boîte ZF 8 : à-coups','Huile dégradée','Vidange huile ZF, MAJ logiciel',['P0700'],'Forums Jeep']
],
'Porsche|Taycan':[
['Batterie 800V : limitation thermique','Gestion thermique pack','Préconditionnement, contrôle pompe HT',['Codes HV','P0A93'],'InsideEVs'],
['Charge DC 270 kW : limitation','Thermique, connecteurs','Contrôle connecteurs, préconditionnement',['Codes charge'],'Automobile-Propre'],
['PCM : reboots','Software','MAJ PCM, reset usine',['U0155'],'Forums Porsche']
],
'Porsche|Cayenne':[
['3.0 TDI : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Boîte Tiptronic 8 : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forums Porsche'],
['Suspension pneumatique : fuite','Coussins d\'air','Contrôle circuit, remplacement coussins',['Codes suspension'],'Auto-doc']
],
'MG|MG4':[
['Batterie 51/64/77 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Charge DC : puissance plafonnée','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Forums MG'],
['Batterie 12V : décharge prématurée','Gestion veille','Contrôle 12V, MAJ veille DC-DC',['B-codes'],'CarComplaints']
],
'NIO|ET7':[
['Battery Swap : erreurs communication','BMS/station','Contrôle BMS, reset communication',['Codes swap'],'InsideEVs'],
['Batterie 75/100/150 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['ADAS : calibration LiDAR','Capteurs LiDAR','Calibration LiDAR + caméras',['C-codes ADAS'],'Baidu']
],
'XPeng|G9':[
['Charge 800V : limitation thermique','Gestion thermique pack','Préconditionnement, contrôle pompe HT',['Codes HV'],'InsideEVs'],
['Batterie 78/98 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['XPIlot : calibration LiDAR','Capteurs LiDAR','Calibration LiDAR + caméras',['C-codes ADAS'],'Baidu']
],
'Zeekr|001':[
['Charge 800V : limitation puissance','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Batterie 86/100 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Baidu'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Automobile-Propre']
],
'Li Auto|L9':[
['EREV 1.5T : pompe/refroidissement','Pompe HT défaillante','Contrôle pompe, circuit refroidissement',['P0217'],'InsideEVs'],
['Batterie HT : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['ADAS Li AD : calibration LiDAR','Capteurs LiDAR','Calibration LiDAR + caméras',['C-codes ADAS'],'Baidu']
],
'Dongfeng|Aeolus':[
['Moteur thermique : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['Boîte DCT : à-coups','Double embrayage','Vidange, MAJ logiciel',['P0700'],'Baidu']
],
'Chery|Tiggo 8':[
['1.6 TGDI : injecteurs HP','Injecteurs défaillants','Test injecteurs, remplacement',['P0201'],'Auto-doc'],
['Boîte DCT : à-coups','Double embrayage','Vidange, MAJ logiciel',['P0700'],'Baidu'],
['ADAS : calibration radar','Radar AV','Calibration statique/dynamique',['C1103'],'Baidu']
],
'Haval|H6':[
['1.5T GDI : injecteurs HP','Injecteurs défaillants','Test injecteurs, remplacement',['P0201'],'Auto-doc'],
['DHT : à-coups passages','Hybrid, mécatro','Vidange, MAJ logiciel',['P0700'],'Baidu'],
['ADAS : calibration LiDAR','Capteurs LiDAR','Calibration LiDAR + caméras',['C-codes ADAS'],'Baidu']
],
'Great Wall|Tank 300':[
['2.0T : refroidissement','Circuit LDR','Contrôle circuit, pompe',['P0217'],'Auto-doc'],
['Boîte ZF 8 : surchauffe off-road','Huile dégradée','Contrôle refroidissement, vidange huile',['P0711'],'Baidu'],
['4x4 : boîte transfert','Huile dégradée','Vidange boîte transfert',['Codes 4WD'],'Baidu']
],
'Hongqi|E-HS9':[
['Batterie 84/99/120 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Baidu'],
['Charge DC : limitation puissance','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Baidu']
],
'Maxus|eDeliver 9':[
['Batterie 72/88 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'InsideEVs'],
['Charge DC : limitation puissance','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'Automobile-Propre'],
['Hayon : moteur défaillant','Moteur hayon','Remplacement moteur hayon',['B1234'],'Auto-doc']
],
'Aion|S':[
['Batterie 58/69 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Baidu'],
['Charge DC : limitation puissance','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['ADAS : calibration LiDAR','Capteurs LiDAR','Calibration LiDAR + caméras',['C-codes ADAS'],'Baidu']
],
'Wuling|Hongguang Mini EV':[
['Batterie 9/13/26 kWh : autonomie < 80 km','Cellules vieillissantes','Équilibrage cellules, rapport SOH',['Codes BMS'],'Baidu'],
['Charge AC 2 kW : lenteur','Chargeur faible','Charge sur prise adaptée',['P1E00'],'Baidu'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Baidu']
],
'Baojun|Yep':[
['Batterie 28 kWh : autonomie réduite','Cellules','Équilibrage, rapport SOH',['Codes BMS'],'Baidu'],
['Charge DC : limitation puissance','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'Baidu']
],
'VinFast|VF8':[
['Batterie 82 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'InsideEVs'],
['Charge DC : limitation puissance','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'Automobile-Propre'],
['ADAS : calibration LiDAR','Capteurs LiDAR','Calibration LiDAR + caméras',['C-codes ADAS'],'Baidu']
]
};
/* Fonction publique : retourne les pannes connues pour un couple marque/modèle */
window.getKnownIssues=function(brand,model){
 if(!brand||!model)return[];
 /* Chercher d'abord la clé exacte */
 const key1=brand+'|'+model;
 if(ISSUES[key1])return ISSUES[key1];
 /* Chercher une clé partielle (ex: "ID.4" pour "ID4") */
 for(const k in ISSUES){
  const[b,m]=k.split('|');
  const bMatch=b.toLowerCase()===brand.toLowerCase();
  const mMatch=m.toLowerCase().replace(/[.\-\s]/g,'')===model.toLowerCase().replace(/[.\-\s]/g,'');
  if(bMatch&&mMatch)return ISSUES[k];
 }
 return[];
};
window.KNOWN_ISSUES_COUNT=Object.keys(ISSUES).length;
})();
