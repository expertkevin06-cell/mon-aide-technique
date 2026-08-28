/* known-issues.js v2 — Base massive de pannes connues (60+ modèles) */
(function(){
'use strict';

/* Structure : {symptôme, causes, action, codes DTC, source} */
var ISSUES = {
/* === RENAULT === */
'Renault|Clio':[
['1.5 dCi K9K : injecteurs HS','Perte puissance, démarrage difficile','Rinçage circuit HP + pompe + injecteurs',['P0087','P0201'],'Auto-doc'],
['1.5 dCi K9K : pompe HP','Fuite huile, bruit','Remplacement pompe HP',['P0087'],'L\'Argus'],
['1.2 TCe : consommation huile','Consommation >0.5L/1000km','Suivi + bougies/bobines',['P0300'],'Renault-Forum'],
['EDC : à-coups urbains','Double embrayage usé','Vidange + MAJ logiciel',['P0700'],'Forum-PE'],
['FAP colmaté (dCi)','Mode dégradé','Régénération forcée',['P242F'],'Auto-doc'],
['Électronique : UCH défaillant','Voyants multiples','Diagnostic UCH + reprogrammation',['U-codes'],'L\'Argus']
],
'Renault|Captur':[
['1.2 TCe : distribution','Chaîne/chaîne détendue','Kit distribution renforcé',['P0016'],'Renault-Forum'],
['1.5 dCi : turbo','Perte puissance','Contrôle turbo/wastegate',['P0299'],'Auto-doc'],
['Boîte EDC : mécatronique','Passages de vitesse aléatoires','Diagnostic mécatronique',['P0700'],'L\'Argus']
],
'Renault|3008':[],
'Renault|Kadjar':[
['1.2 TCe : casse moteur','Consommation huile extrême','Remplacement moteur',['P0300'],'L\'Argus'],
['1.5 dCi : chaîne distribution','Bruit métallique','Kit chaîne renforcé',['P0016'],'Renault-Forum'],
['4x4 : transfert bruit','Huile dégradée','Vidange boîte transfert',['Codes 4WD'],'Auto-doc']
],
'Renault|Austral':[
['1.2 TCe mild-hybrid : batterie 48V','Batterie faible','Remplacement batterie 48V',['Codes HV'],'Automobile-Propre'],
['Multimédia OpenR : reboots','Software instable','MAJ firmware',['U1233'],'Les Numériques']
],
'Renault|Arkana':[
['1.3 TCe : injecteurs','Ralenti irrégulier','Test injecteurs',['P0201'],'L\'Argus'],
['E-Tech : batterie HT faible','Autonomie réduite','Équilibrage modules',['P0A80'],'Automobile-Propre']
],
'Renault|Mégane':[
['1.2 TCe : consommation huile','Consommation excessive','Contrôle segments',['P0300'],'Renault-Forum'],
['1.5 dCi : vanne EGR','Encrassement','Nettoyage/remplacement EGR',['P0401'],'Auto-doc'],
['1.6 dCi : chaîne distribution','Bruit à froid','Kit chaîne renforcé',['P0016'],'L\'Argus']
],
'Renault|Mégane E-Tech':[
['Batterie 40/60 kWh : charge lente','Thermique pack','Préconditionnement',['Codes HV'],'Automobile-Propre'],
['OpenR Link : écran noir','Software','MAJ firmware',['U1233'],'Renault-Forum'],
['Pompe à chaleur : inefficace','Pompe HS','Remplacement pompe',['Codes thermique'],'InsideEVs']
],
'Renault|Zoe':[
['Batterie 22/41 kWh : SOH faible','Autonomie réduite','Reconditionnement batterie',['P0A80'],'Automobile-Propre'],
['Charge 22 kW : limitation','Chargeur embarqué','Contrôle OBC',['P1E00'],'InsideEVs'],
['Moteur R90/R110 : roulements','Bruit moteur','Remplacement roulements',['Codes moteur'],'Renault-Forum']
],
'Renault|Scénic':[
['1.5 dCi : FAP colmaté','Mode dégradé','Régénération forcée',['P242F'],'Auto-doc'],
['1.2 TCe : courroie','Dégradation courroie','Remplacement courroie',['P0016'],'Renault-Forum'],
['Boîte EDC : à-coups','Embrayages usés','Vidange + MAJ',['P0700'],'L\'Argus']
],
'Renault|Talisman':[
['1.6 dCi : chaîne distribution','Bruit métallique','Kit chaîne renforcé',['P0016'],'Renault-Forum'],
['4Control : direction assistée','Direction dure','Diagnostic 4Control',['C0710'],'Auto-doc'],
['Boîte EDC : mécatronique','Passages aléatoires','Diagnostic mécatronique',['P0700'],'L\'Argus']
],
'Renault|Espace':[
['1.6 dCi : turbo','Perte puissance','Contrôle turbo',['P0299'],'Auto-doc'],
['4Control : calibration','Direction imprécise','Calibration 4Control',['C0710'],'Renault-Forum'],
['Multimédia R-Link : écran noir','Software','MAJ firmware',['U1233'],'L\'Argus']
],
'Renault|Kangoo':[
['1.5 dCi : injecteurs','Fuite retour','Test injecteurs',['P0201'],'Auto-doc'],
['1.2 TCe : consommation huile','Consommation excessive','Contrôle segments',['P0300'],'Renault-Forum'],
['Boîte manuelle : synchros','Passages difficiles','Vidange huile boîte',['Codes boîte'],'L\'Argus']
],
'Renault|Trafic':[
['2.0 dCi : chaîne distribution','Bruit à froid','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['2.0 dCi : turbo','Perte puissance','Contrôle turbo/wastegate',['P0299'],'Renault-Forum'],
['Boîte manuelle : embrayage','Patine','Remplacement embrayage',['Codes embrayage'],'L\'Argus']
],
'Renault|Master':[
['2.3 dCi : chaîne distribution','Bruit métallique','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['2.3 dCi : injecteurs','Ralenti irrégulier','Test injecteurs',['P0201'],'Renault-Forum'],
['Boîte manuelle : synchros','Passages difficiles','Vidange huile boîte',['Codes boîte'],'L\'Argus']
],
/* === PEUGEOT === */
'Peugeot|208':[
['1.2 PureTech : courroie immergée','Dégradation prématurée','Courroie + crépine + huile 0W20',['P0016'],'Forum-PE'],
['1.5 BlueHDi : chaîne distribution','Chaîne AAC fragile','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['e-208 : batterie 50 kWh déséquilibre','Autonomie réduite','Équilibrage modules',['P0A80'],'Automobile-Propre']
],
'Peugeot|2008':[
['1.2 PureTech : courroie','Dégradation','Courroie + crépine',['P0016'],'Forum-PE'],
['1.5 BlueHDi : EGR encrassée','Perte puissance','Nettoyage EGR',['P0401'],'Auto-doc'],
['e-2008 : charge DC lente','Thermique pack','Préconditionnement',['Codes HV'],'InsideEVs']
],
'Peugeot|308':[
['1.2 PureTech : courroie immergée','Casse moteur possible','Courroie + crépine + huile',['P0016'],'Forum-PE'],
['1.6 THP : chaîne distribution','Bruit métallique','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['1.5 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['EAT8 : à-coups passages','Mécatro/huile','Vidange + MAJ logiciel',['P0700'],'Forum-PE']
],
'Peugeot|3008':[
['1.2 PureTech : courroie immergée','Dégradation prématurée','Courroie + crépine + huile 0W20',['P0016'],'Forum-PE'],
['1.5 BlueHDi : chaîne arbre à cames','Bruit métallique, casse','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['EAT8 : à-coups passages rapports','Mécatro/huile','Vidange boîte + MAJ logiciel',['P0700'],'Forum-PE'],
['AdBlue : cristallisation injecteur','Qualité AdBlue, injecteur bouché','Remplacement injecteur AdBlue',['P20EE','P202E'],'Auto-doc'],
['Multimédia i-Cockpit : écran noir','Head unit défaillant','MAJ firmware, reset, remplacement',['U0155'],'Caradisiac']
],
'Peugeot|5008':[
['1.2 PureTech : courroie immergée','Dégradation','Courroie + crépine + huile',['P0016'],'Forum-PE'],
['1.5 BlueHDi : chaîne distribution','Chaîne AAC fragile','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['EAT8 : à-coups','Mécatro/huile','Vidange + MAJ logiciel',['P0700'],'Forum-PE']
],
'Peugeot|508':[
['1.6 THP : chaîne distribution','Bruit métallique','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['2.0 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['EAT8 : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forum-PE'],
['Hybrid : batterie HT faible','Cellules déséquilibrées','Équilibrage modules',['P0A80'],'Automobile-Propre']
],
'Peugeot|Rifter':[
['1.5 BlueHDi : chaîne distribution','Chaîne AAC','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['1.2 PureTech : courroie','Dégradation','Courroie + crépine',['P0016'],'Forum-PE'],
['Boîte manuelle : synchros','Passages difficiles','Vidange huile',['Codes boîte'],'L\'Argus']
],
'Peugeot|Expert':[
['2.0 BlueHDi : chaîne distribution','Chaîne AAC','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['2.0 BlueHDi : turbo','Perte puissance','Contrôle turbo',['P0299'],'Forum-PE'],
['Boîte manuelle : embrayage','Patine','Remplacement embrayage',['Codes embrayage'],'L\'Argus']
],
'Peugeot|Traveller':[
['2.0 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['2.0 BlueHDi : FAP colmaté','Mode dégradé','Régénération forcée',['P242F'],'Forum-PE']
],
/* === CITROËN === */
'Citroën|C3':[
['1.2 PureTech : courroie immergée','Dégradation','Courroie + crépine',['P0016'],'Planète Citroën'],
['1.5 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['ë-C3 : batterie 50 kWh','Déséquilibre cellules','Équilibrage modules',['P0A80'],'Automobile-Propre']
],
'Citroën|C4':[
['1.2 PureTech : courroie','Dégradation','Courroie + crépine',['P0016'],'Planète Citroën'],
['1.5 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['ë-C4 : charge DC lente','Thermique pack','Préconditionnement',['Codes HV'],'InsideEVs']
],
'Citroën|C5 Aircross':[
['1.2 PureTech : courroie immergée','Dégradation prématurée','Courroie + crépine + huile',['P0016'],'Planète Citroën'],
['1.5 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['Suspension hydraulique progressive','Fuite sphères','Contrôle sphères, remplacement',['Codes suspension'],'Planète Citroën'],
['EAT8 : à-coups','Mécatro/huile','Vidange + MAJ logiciel',['P0700'],'Auto-doc']
],
'Citroën|Berlingo':[
['1.5 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['1.2 PureTech : courroie','Dégradation','Courroie + crépine',['P0016'],'Planète Citroën'],
['ë-Berlingo : batterie','Déséquilibre','Équilibrage modules',['P0A80'],'Automobile-Propre']
],
'Citroën|Jumpy':[
['2.0 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['2.0 BlueHDi : turbo','Perte puissance','Contrôle turbo',['P0299'],'Planète Citroën']
],
'Citroën|Jumper':[
['2.2 BlueHDi : chaîne distribution','Chaîne AAC','Kit chaîne renforcée',['P0016'],'Auto-doc'],
['2.2 BlueHDi : injecteurs','Ralenti irrégulier','Test injecteurs',['P0201'],'Planète Citroën']
],
/* === DS === */
'DS Automobiles|DS3':[
['1.2 PureTech : courroie','Dégradation','Courroie + crépine',['P0016'],'Planète Citroën'],
['1.5 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'L\'Argus']
],
'DS Automobiles|DS4':[
['1.2 PureTech : courroie immergée','Dégradation','Courroie + crépine',['P0016'],'Planète Citroën'],
['1.6 PureTech : chaîne distribution','Bruit métallique','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['EAT8 : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forum-PE']
],
'DS Automobiles|DS7':[
['1.6 PureTech : chaîne distribution','Bruit métallique','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['2.0 BlueHDi : chaîne AAC','Chaîne fragile','Kit chaîne renforcée',['P0016'],'L\'Argus'],
['Hybrid : batterie HT','Déséquilibre','Équilibrage modules',['P0A80'],'Automobile-Propre']
],
/* === VOLKSWAGEN === */
'Volkswagen|Polo':[
['1.0 TSI : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'Forums VAG'],
['1.0 TSI : injecteurs','Ralenti irrégulier','Test injecteurs',['P0201'],'Auto-doc']
],
'Volkswagen|Golf':[
['1.2/1.4 TSI : consommation huile','Segments usés','Suivi consommation',['P0300'],'L\'Argus'],
['DSG7 DQ200 : mécatronique','À-coups, patinage','Vidange huile mécatro + MAJ',['P17BF','P0841'],'Golf7.net'],
['1.6 TDI : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['2.0 TDI : EGR encrassée','Perte puissance','Nettoyage EGR',['P0401'],'Forums VAG'],
['FAP colmaté (diesel)','Mode dégradé','Régénération forcée',['P242F'],'Auto-doc']
],
'Volkswagen|Tiguan':[
['2.0 TDI : turbo défaillant','Perte puissance','Contrôle turbo/wastegate',['P0299'],'L\'Argus'],
['DSG6 : à-coups à froid','Huile dégradée','Vidange huile boîte + MAJ',['P0700'],'Forums VAG'],
['AdBlue : cristallisation','Injecteur bouché','Remplacement injecteur',['P20EE'],'Auto-doc'],
['Haldex (4Motion) : patinage','Huile dégradée','Vidange Haldex',['Codes 4WD'],'Forums VAG']
],
'Volkswagen|ID.4':[
['Hayon électrique : ouverture aléatoire','Moteur hayon','Diagnostic moteur hayon',['B1234'],'Auto-doc'],
['Infotainment MEB : reboots','Software instable','MAJ firmware 3.x+',['U0155'],'Forums VAG'],
['Batterie HT 77 kWh : limitation DC','Thermique pack','Préconditionnement',['P0A80'],'Automobile-Propre'],
['Pompe à chaleur : inefficace','Pompe HS','Remplacement pompe',['Codes thermique'],'InsideEVs'],
['Charge AC 11 kW : limitation 7 kW','OBC défaillant','Contrôle OBC',['P1E00'],'Forums ID.4'],
['Radar Front Assist : alertes fantômes','Radar sali','Nettoyage + calibration',['C1103'],'L\'Argus']
],
'Volkswagen|ID.3':[
['Infotainment MEB : lenteurs','Software','MAJ firmware',['U0155'],'InsideEVs'],
['Batterie 58 kWh : déséquilibre','Cellules','Équilibrage modules',['P0A80'],'Automobile-Propre'],
['Charge DC : puissance plafonnée','Thermique','Préconditionnement',['Codes HV'],'Forums ID.3']
],
'Volkswagen|T-Roc':[
['1.5 TSI : injecteurs','Ralenti irrégulier','Test injecteurs',['P0201'],'Auto-doc'],
['2.0 TDI : EGR','Encrassement','Nettoyage EGR',['P0401'],'Forums VAG']
],
'Volkswagen|T-Cross':[
['1.0 TSI : chaîne','Chaîne fragile','Kit chaîne renforcé',['P0016'],'Forums VAG'],
['Boîte DSG : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Auto-doc']
],
'Volkswagen|Passat':[
['2.0 TDI : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'Forums VAG'],
['DSG : à-coups','Mécatro','Vidange + MAJ',['P0700'],'L\'Argus'],
['4Motion : transfert','Huile dégradée','Vidange boîte transfert',['Codes 4WD'],'Forums VAG']
],
/* === AUDI === */
'Audi|A3':[
['2.0 TDI EA288 : EGR/FAP','Encrassement','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc'],
['DSG7 DQ381 : mécatro','Mécatronique','MAJ logiciel, mécatronique',['P17BF'],'Forums Audi'],
['MMI : reboots','Software','MAJ MMI, reset',['U0155'],'Forums Audi']
],
'Audi|A4':[
['2.0 TDI : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Multitronic : à-coups','Huile dégradée','Vidange huile CVT',['P0700'],'Forums Audi'],
['MMI : écran noir','Software','MAJ MMI',['U0155'],'Auto-doc']
],
'Audi|Q3':[
['2.0 TDI : EGR','Encrassement','Nettoyage EGR',['P0401'],'Auto-doc'],
['S tronic : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forums Audi']
],
'Audi|Q5':[
['3.0 TDI : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['S tronic : mécatro','Mécatronique','Vidange + MAJ',['P0700'],'Forums Audi'],
['Quattro : transfert','Huile dégradée','Vidange boîte transfert',['Codes 4WD'],'Forums Audi']
],
'Audi|Q4 e-tron':[
['Batterie 77 kWh : déséquilibre','Cellules','Équilibrage modules',['P0A80'],'Automobile-Propre'],
['Charge DC 135 kW : limitation','Thermique pack','Préconditionnement',['Codes HV'],'InsideEVs'],
['MMI : reboots','Software','MAJ MMI, reset',['U0155'],'Forums Audi']
],
'Audi|e-tron':[
['Batterie 95 kWh : déséquilibre','Cellules','Équilibrage modules',['P0A80'],'Automobile-Propre'],
['Charge 150 kW : limitation','Thermique','Préconditionnement',['Codes HV'],'InsideEVs'],
['Suspension pneumatique : fuite','Coussins d\'air','Remplacement coussins',['Codes suspension'],'Forums Audi']
],
/* === BMW === */
'BMW|Série 3':[
['N47/B47 : chaîne distribution','Chaîne AAC fragile','Kit chaîne renforcé (rappel BMW)',['P0016'],'L\'Argus'],
['2.0 TDI/20d : turbo','Turbo, wastegate','Contrôle turbo, wastegate',['P0299'],'Forums BMW'],
['iDrive : reboots','Software','MAJ iDrive, reset',['U0155'],'Auto-doc']
],
'BMW|Série 5':[
['N47/B47 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Boîte ZF 8HP : à-coups','Huile dégradée','Vidange huile ZF, MAJ logiciel',['P0700'],'Forums BMW']
],
'BMW|X3':[
['N47/B47 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Boîte ZF 8HP : à-coups','Huile dégradée, mécatro','Vidange huile ZF, MAJ logiciel',['P0700'],'Forums BMW'],
['xDrive : transfert bruit','Huile dégradée','Vidange boîte transfert',['Codes 4WD'],'Auto-doc']
],
'BMW|X5':[
['3.0d : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Boîte ZF 8HP : à-coups','Huile','Vidange + MAJ',['P0700'],'Forums BMW'],
['Suspension pneumatique : fuite','Coussins','Remplacement coussins',['Codes suspension'],'Auto-doc']
],
/* === MERCEDES === */
'Mercedes-Benz|Classe A':[
['OM651 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['7G-DCT : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forums Mercedes']
],
'Mercedes-Benz|Classe C':[
['OM651 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['7G-Tronic/9G-Tronic : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forums Mercedes'],
['MBUX : reboots','Software','MAJ MBUX, reset usine',['U0155'],'Auto-doc']
],
'Mercedes-Benz|Classe E':[
['OM651 : chaîne AAC','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['9G-Tronic : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forums Mercedes'],
['AIRMATIC : fuite','Coussins d\'air','Remplacement coussins',['Codes suspension'],'Auto-doc']
],
'Mercedes-Benz|GLC':[
['OM654 : chaîne AAC','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['9G-Tronic : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forums Mercedes'],
['4MATIC : transfert','Huile','Vidange boîte transfert',['Codes 4WD'],'Forums Mercedes']
],
/* === TESLA === */
'Tesla|Model 3':[
['Batterie LFP : calibration SOC','BMS décalibré','Charge 100% périodique, MAJ BMS',['Codes BMS'],'InsideEVs'],
['Panneau de verre : fissures','Choc thermique','Remplacement panneau',['—'],'Automobile-Propre'],
['Autopilot : rappel logiciel','Caméras/calibration','MAJ OTA, calibration caméras',['C-codes ADAS'],'NHTSA'],
['Suspension : claquements','Amortisseurs, silentblocs','Contrôle suspension',['Codes suspension'],'Tesla Motors Club'],
['Pompe à chaleur : inefficacité','Pompe HS','Remplacement pompe à chaleur',['Codes thermique'],'InsideEVs']
],
'Tesla|Model Y':[
['Batterie LFP : calibration SOC','BMS décalibré','Charge 100% périodique, MAJ BMS',['Codes BMS'],'InsideEVs'],
['Panneau de verre : fissures','Choc thermique','Remplacement panneau',['—'],'Automobile-Propre'],
['Autopilot : rappel logiciel','Software','MAJ OTA, calibration',['C-codes ADAS'],'NHTSA'],
['Hayon : moteur défaillant','Moteur hayon','Remplacement moteur hayon',['B1234'],'Tesla Motors Club'],
['Direction : crémaillère bruit','Crémaillère usée','Remplacement crémaillère',['C0710'],'Forums Tesla']
],
/* === TOYOTA === */
'Toyota|Yaris':[
['Hybride 1.5 : batterie HT faible','Cellules déséquilibrées','Reconditionnement batterie',['P0A80'],'L\'Argus'],
['Boîte e-CVT : bruit moulinage','Planétaires usés','Contrôle huile, planétaires',['P0700'],'Forum Toyota'],
['EGR : encrassement (diesel)','Vanne EGR','Nettoyage/remplacement',['P0401'],'Auto-doc']
],
'Toyota|Corolla':[
['Hybride 1.8 : batterie HT','Cellules vieillissantes','Reconditionnement, équilibrage',['P0A80'],'L\'Argus'],
['E-CVT : patinage','Planétaires, huile','Vidange huile, contrôle',['P0700'],'Forum Toyota']
],
'Toyota|RAV4':[
['Hybride 2.5 : batterie HT','Cellules vieillissantes','Reconditionnement, équilibrage',['P0A80'],'L\'Argus'],
['E-CVT : patinage à forte charge','Planétaires, huile','Vidange huile, contrôle planétaires',['P0700'],'Forum Toyota'],
['2.5 D-4D : EGR/FAP','Encrassement diesel','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc']
],
'Toyota|C-HR':[
['Hybride 1.8 : batterie HT','Cellules','Reconditionnement',['P0A80'],'L\'Argus'],
['E-CVT : bruit','Planétaires','Contrôle huile',['P0700'],'Forum Toyota']
],
/* === HYUNDAI === */
'Hyundai|Tucson':[
['1.6 T-GDi Theta II : coussinets bielle (KSDS)','Coussinets fragiles, serrage moteur','Contrôle KSDS, campagne NHTSA, remplacement moteur',['P1326'],'NHTSA'],
['1.6 CRDi : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['DCT7 : à-coups passages','Double embrayage usé','Vidange, MAJ logiciel, remplacement embrayages',['P0700'],'Forums Hyundai']
],
'Hyundai|Kona':[
['Kona Electric : batterie 39/64 kWh','Déséquilibre cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Charge DC 77 kW : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['1.0 T-GDi : chaîne distribution','Chaîne fragile','Contrôle tension, remplacement si bruit',['P0016'],'Auto-doc']
],
'Hyundai|i30':[
['1.0 T-GDi : injecteurs','Ralenti irrégulier','Test injecteurs',['P0201'],'Auto-doc'],
['1.6 CRDi : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus']
],
/* === KIA === */
'Kia|Sportage':[
['1.6 CRDi : EGR/FAP','Encrassement diesel','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc'],
['DCT7 : à-coups','Double embrayage','Vidange, MAJ logiciel',['P0700'],'Forums Kia'],
['1.6 T-GDi : injecteurs HP','Injecteurs défaillants','Test injecteurs, remplacement',['P0201'],'L\'Argus']
],
'Kia|EV6':[
['Batterie 77 kWh : limitation thermique','Gestion thermique pack','Préconditionnement, contrôle pompe HT',['Codes HV','P0A93'],'InsideEVs'],
['Charge 800V : puissance plafonnée','Thermique, connecteurs','Contrôle connecteurs CCS, préconditionnement',['Codes charge'],'Automobile-Propre'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Forums Kia']
],
'Kia|Niro':[
['Hybride : batterie HT faible','Cellules déséquilibrées','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['DCT : à-coups','Double embrayage','Vidange, MAJ logiciel',['P0700'],'Forums Kia']
],
/* === NISSAN === */
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
'Nissan|Juke':[
['1.5 dCi : injecteurs','Limaille','Rinçage + pompe HP',['P0087'],'Auto-doc'],
['1.2 DIG-T : chaîne','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus']
],
/* === FORD === */
'Ford|Kuga':[
['1.5 EcoBoost : surchauffe','Durites LDR, thermostat','Contrôle circuit refroidissement, remplacement durites',['P0217'],'CarComplaints'],
['2.0 TDCi : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Boîte Powershift : à-coups','Double embrayage, mécatro','Diagnostic boîte, remplacement embrayages',['P0700'],'Forums Ford']
],
'Ford|Focus':[
['1.0 EcoBoost : courroie distribution','Courroie immergée','Remplacement courroie + crépine',['P0016'],'Forums Ford'],
['1.5 TDCi : injecteurs','Limaille','Rinçage + pompe HP',['P0087'],'Auto-doc'],
['Powershift : à-coups','Double embrayage','Vidange + MAJ',['P0700'],'CarComplaints']
],
'Ford|Mustang Mach-E':[
['Batterie 88/91 kWh : autonomie réduite','Déséquilibre cellules','Équilibrage modules, MAJ BMS',['P0A80'],'InsideEVs'],
['Écran SYNC 4A : reboots','Software instable','MAJ SYNC, reset usine',['U0155'],'Tesla Motors Club'],
['Charge DC 150 kW : limitation','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'Automobile-Propre']
],
/* === BYD === */
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
'BYD|Dolphin':[
['Blade Battery 60 kWh : déséquilibre','Cellules','Équilibrage modules',['P0A80'],'Automobile-Propre'],
['Charge DC 88 kW : limitation','Thermique','Préconditionnement',['Codes HV'],'InsideEVs']
],
/* === DACIA === */
'Dacia|Duster':[
['1.5 dCi : chaîne distribution','Chaîne fragile','Remplacement kit chaîne',['P0016'],'L\'Argus'],
['Boîte EDC : à-coups','Double embrayage usé','Vidange, MAJ logiciel',['P0700'],'Forum-PE'],
['4x4 : boîte transfert bruit','Huile dégradée, pignons','Vidange boîte transfert, contrôle pignons',['Codes 4WD'],'Auto-doc']
],
'Dacia|Sandero':[
['1.0 TCe : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['1.5 dCi : injecteurs/pompe HP','Limaille','Rinçage, pompe HP + injecteurs',['P0087'],'Auto-doc'],
['Boîte EDC : à-coups','Double embrayage','Vidange, MAJ logiciel',['P0700'],'Forum-PE']
],
'Dacia|Spring':[
['Batterie 27 kWh : autonomie réduite','Cellules vieillissantes','Équilibrage, rapport SOH',['Codes BMS'],'Automobile-Propre'],
['Charge AC : lenteur','Chargeur faible','Charge sur prise adaptée',['P1E00'],'Baidu']
],
'Dacia|Jogger':[
['1.0 TCe : chaîne','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['1.5 dCi : injecteurs','Limaille','Rinçage + pompe HP',['P0087'],'Auto-doc']
],
/* === MAZDA === */
'Mazda|3':[
['2.0 Skyactiv-G : injecteurs HP','Injecteurs défaillants','Test injecteurs, remplacement',['P0201'],'Auto-doc'],
['Skyactiv-D 2.2 : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['i-Activsense : calibration radar','Radar AV décalibré','Calibration statique/dynamique',['C1103'],'Auto-doc']
],
'Mazda|CX-5':[
['2.2 Skyactiv-D : chaîne AAC','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['2.2 Skyactiv-D : EGR','Encrassement','Nettoyage EGR',['P0401'],'Auto-doc'],
['i-Activ AWD : transfert','Huile dégradée','Vidange boîte transfert',['Codes 4WD'],'Forums Mazda']
],
/* === VOLVO === */
'Volvo|XC60':[
['D4/D5 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Geartronic 8 : à-coups','Mécatro, huile','Vidange boîte, MAJ logiciel',['P0700'],'Forums Volvo'],
['Sensus : reboots','Software','MAJ Sensus, reset',['U0155'],'Auto-doc'],
['T8 Recharge : batterie HT faible','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre']
],
'Volvo|XC40':[
['T4/T5 : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['Geartronic 8 : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forums Volvo'],
['Recharge : batterie HT','Déséquilibre','Équilibrage modules',['P0A80'],'Automobile-Propre']
],
/* === PORSCHE === */
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
'Porsche|Macan':[
['2.0 TFSI : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['PDK : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forums Porsche']
],
/* === FIAT === */
'Fiat|500':[
['1.2 Fire : joints de queue de soupape','Fuite huile','Remplacement joints',['P0562'],'Auto-doc'],
['0.9 TwinAir : turbo','Turbo, wastegate','Contrôle turbo, wastegate',['P0299'],'Planète Fiat'],
['500e : batterie HT','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre']
],
'Fiat|Tipo':[
['1.6 MultiJet : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['1.6 MultiJet : EGR','Encrassement','Nettoyage EGR',['P0401'],'Planète Fiat']
],
/* === ALFA ROMEO === */
'Alfa Romeo|Giulia':[
['2.0 Turbo : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['2.2 Diesel Multijet : EGR/FAP','Encrassement','Nettoyage EGR, régénération FAP',['P0401','P242F'],'Auto-doc'],
['Boîte ZF 8 : à-coups','Huile dégradée','Vidange huile ZF, MAJ logiciel',['P0700'],'Forums Alfa']
],
'Alfa Romeo|Stelvio':[
['2.0 Turbo : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['2.2 Multijet : EGR/FAP','Encrassement','Nettoyage EGR, régénération',['P0401','P242F'],'Auto-doc'],
['Boîte ZF 8 : à-coups','Huile','Vidange + MAJ',['P0700'],'Forums Alfa']
],
/* === JEEP === */
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
/* === MG === */
'MG|MG4':[
['Batterie 51/64/77 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Charge DC : puissance plafonnée','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Forums MG'],
['Batterie 12V : décharge prématurée','Gestion veille','Contrôle 12V, MAJ veille DC-DC',['B-codes'],'CarComplaints']
],
'MG|ZS EV':[
['Batterie 44/51 kWh : déséquilibre','Cellules','Équilibrage modules',['P0A80'],'Automobile-Propre'],
['Charge DC : limitation','Thermique','Préconditionnement',['Codes HV'],'InsideEVs']
],
/* === HONDA === */
'Honda|Civic':[
['1.5 VTEC Turbo : injecteurs','Ralenti irrégulier','Test injecteurs',['P0201'],'Auto-doc'],
['1.6 i-DTEC : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['CVT : à-coups','Huile dégradée','Vidange huile CVT',['P0700'],'Forums Honda']
],
'Honda|CR-V':[
['1.5 VTEC Turbo : injecteurs','Injecteurs','Test + remplacement',['P0201'],'Auto-doc'],
['2.0 i-MMD : batterie HT','Cellules','Équilibrage modules',['P0A80'],'Automobile-Propre'],
['CVT : bruit','Chaîne CVT','Contrôle huile, remplacement si bruit',['P0700'],'Forums Honda']
],
/* === SUBARU === */
'Subaru|Forester':[
['Boxer : joints de queue de soupape','Fuite huile','Remplacement joints',['P0562'],'Forums Subaru'],
['CVT Lineartronic : à-coups','Huile dégradée, chaîne','Vidange CVT, contrôle chaîne',['P0700'],'Auto-doc'],
['EyeSight : calibration caméra','Caméras pare-brise','Calibration après pare-brise',['C-codes ADAS'],'Forums Subaru']
],
'Subaru|XV':[
['Boxer : joints soupape','Fuite huile','Remplacement joints',['P0562'],'Forums Subaru'],
['CVT : à-coups','Huile','Vidange CVT',['P0700'],'Auto-doc']
],
/* === SKODA === */
'Škoda|Octavia':[
['1.6 TDI : chaîne distribution','Chaîne fragile','Kit chaîne renforcé',['P0016'],'Auto-doc'],
['2.0 TDI : EGR','Encrassement','Nettoyage EGR',['P0401'],'Forums VAG'],
['DSG : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Golf7.net']
],
'Škoda|Kodiaq':[
['2.0 TDI : chaîne distribution','Chaîne AAC','Kit chaîne renforcé',['P0016'],'L\'Argus'],
['DSG : à-coups','Mécatro','Vidange + MAJ',['P0700'],'Forums VAG'],
['4x4 : Haldex','Huile dégradée','Vidange Haldex',['Codes 4WD'],'Forums VAG']
],
'Škoda|Enyaq':[
['Batterie 82 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['Charge DC : limitation','Thermique pack','Préconditionnement',['Codes HV'],'InsideEVs'],
['Infotainment : reboots','Software','MAJ firmware',['U0155'],'Forums VAG']
],
/* === NIO === */
'NIO|ET7':[
['Battery Swap : erreurs communication','BMS/station','Contrôle BMS, reset communication',['Codes swap'],'InsideEVs'],
['Batterie 75/100/150 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Automobile-Propre'],
['ADAS : calibration LiDAR','Capteurs LiDAR','Calibration LiDAR + caméras',['C-codes ADAS'],'Baidu']
],
/* === XIAOMI === */
'Xiaomi Auto|SU7':[
['Batterie 73/101 kWh : déséquilibre','Cellules','Équilibrage modules, MAJ BMS',['P0A80'],'Baidu'],
['Charge 800V : limitation puissance','Thermique pack','Préconditionnement, contrôle thermique',['Codes HV'],'InsideEVs'],
['Infotainment : reboots','Software','MAJ firmware, reset',['U0155'],'Baidu']
],
/* === BYD autres === */
'BYD|Tang':[
['Blade Battery 108 kWh : déséquilibre','Cellules','Équilibrage modules',['P0A80'],'Baidu'],
['Charge DC : limitation','Thermique','Préconditionnement',['Codes HV'],'InsideEVs']
],
'BYD|Han':[
['Blade Battery 85 kWh : déséquilibre','Cellules','Équilibrage modules',['P0A80'],'Baidu'],
['Charge DC : limitation','Thermique','Préconditionnement',['Codes HV'],'InsideEVs']
]
};

/* Fonction publique */
window.getKnownIssues = function(brand, model){
 if(!brand || !model) return [];
 
 /* Chercher d'abord la clé exacte */
 var key1 = brand + '|' + model;
 if(ISSUES[key1]) return ISSUES[key1];
 
 /* Chercher une clé partielle (normalisation) */
 var normalize = window.normalizeModel || function(s){ return (s||'').toLowerCase().replace(/[.\-\s]/g,''); };
 
 for(var k in ISSUES){
  var parts = k.split('|');
  var b = parts[0];
  var m = parts[1];
  var bMatch = b.toLowerCase() === brand.toLowerCase();
  var mMatch = normalize(m) === normalize(model);
  if(bMatch && mMatch) return ISSUES[k];
 }
 
 return [];
};

window.KNOWN_ISSUES_COUNT = Object.keys(ISSUES).length;
console.log('[known-issues] v2 chargé — ' + window.KNOWN_ISSUES_COUNT + ' modèles');
})();
