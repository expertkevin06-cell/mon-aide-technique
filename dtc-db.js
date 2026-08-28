/* dtc-db.js v4 — Extraction DTC corrigée (P20EE, P202E, codes alphanumériques) */
(function(){
'use strict';

/* === REGEX CENTRAL : détecte tous les codes OBD-II (numériques ET hexadécimaux) === */
const DTC_REGEX = /\b[pcbu][0-9a-f]{4,5}\b/gi;

var D={
/* --- MOTEUR --- */
'P0001':['Régulateur débit carburant : circuit','Régulateur, câblage','Contrôle circuit + régulateur'],
'P0002':['Régulateur débit carburant : plage','Régulateur encrassé','Contrôle/remplace régulateur'],
'P0008':['Calage distribution (banc 1)','Chaîne/courroie détendue','Contrôle calage + kit'],
'P0009':['Calage distribution (banc 2)','Chaîne/courroie','Contrôle calage banc 2'],
'P0010':['Actionneur AAC A (b1) circuit','Électrovanne VVT','Contrôle électrovanne'],
'P0011':['AAC A (b1) calage avancé','VVT grippé, huile','Contrôle VVT + huile'],
'P0012':['AAC A (b1) calage retardé','VVT, chaîne','Contrôle VVT + calage'],
'P0016':['Corrélation vilo/AAC admission','Distribution décalée, capteur, VVT','Contrôle calage, capteurs, phasers'],
'P0017':['Corrélation vilo/AAC échappement','Distribution décalée','Contrôle calage, tendeurs'],
'P0087':['Pression rail basse','Pompe HP, filtre, limaille','Contrôle pression, pompe, rinçage'],
'P0088':['Pression rail haute','Régulateur','Contrôle régulateur'],
'P00AF':['Actuateur turbo HS','Actuateur carbonisé','Remplace actuateur'],
'P0100':['MAF circuit','MAF, câblage','Contrôle MAF'],
'P0101':['MAF plage/perf','MAF encrassé, fuite','Nettoie/remplace MAF'],
'P0102':['MAF basse','MAF/câblage','Contrôle câblage'],
'P0103':['MAF haute','MAF/câblage','Contrôle MAF'],
'P0116':['T° liquide plage','Sonde, thermostat','Contrôle sonde + thermostat'],
'P0117':['T° liquide basse','Sonde/câblage','Contrôle sonde'],
'P0118':['T° liquide haute','Sonde HS','Remplace sonde'],
'P0121':['Papillon A plage','Papillon encrassé','Nettoie papillon'],
'P0122':['Papillon A basse','Capteur/câblage','Contrôle capteur'],
'P0123':['Papillon A haute','Capteur/câblage','Contrôle capteur'],
'P0125':['T° insuffisante boucle','Thermostat ouvert','Contrôle thermostat'],
'P0128':['Thermostat sous seuil','Thermostat bloqué ouvert','Remplace thermostat'],
'P0171':['Mélange pauvre (b1)','Prise air, pompe, sonde','Recherche fuite + sonde'],
'P0172':['Mélange riche (b1)','Injecteur fuyard','Contrôle injecteurs'],
'P0174':['Mélange pauvre (b2)','Prise air b2','Recherche fuite b2'],
'P0175':['Mélange riche (b2)','Injecteurs b2','Contrôle injecteurs b2'],
'P0191':['Capteur rail plage','Capteur/câblage','Contrôle capteur rail'],
'P0201':['Injecteur cyl.1 circuit','Injecteur 1','Test injecteur 1'],
'P0202':['Injecteur cyl.2 circuit','Injecteur 2','Test injecteur 2'],
'P0203':['Injecteur cyl.3 circuit','Injecteur 3','Test injecteur 3'],
'P0204':['Injecteur cyl.4 circuit','Injecteur 4','Test injecteur 4'],
'P0217':['Surchauffe moteur','Refroidissement','Arrêter, contrôler circuit'],
'P0230':['Pompe carburant circuit','Relais, pompe','Contrôle relais + pompe'],
'P0234':['Turbo surpression','Wastegate','Contrôle wastegate'],
'P0299':['Pression turbo basse','Fuite, wastegate, turbo, EGR','Contrôle durites/wastegate/turbo'],
'P0300':['Ratés multiples','Bobines, bougies, injecteurs','Bobines/bougies, compressions'],
'P0301':['Ratés cyl.1','Bobine/bougie 1','Permuter bobine'],
'P0302':['Ratés cyl.2','Bobine/bougie 2','Permuter bobine'],
'P0303':['Ratés cyl.3','Bobine/bougie 3','Permuter bobine'],
'P0304':['Ratés cyl.4','Bobine/bougie 4','Permuter bobine'],
'P0335':['Capteur vilo circuit','Capteur/câblage','Contrôle capteur vilo'],
'P0336':['Capteur vilo plage','Capteur, cible','Contrôle capteur + cible'],
'P0340':['Capteur AAC A circuit','Capteur, calage','Contrôle capteur + calage'],
'P0341':['Capteur AAC A plage','Capteur HS','Remplace capteur'],
'P0351':['Bobine A défaut','Bobine A','Remplace bobine A'],
'P0352':['Bobine B défaut','Bobine B','Remplace bobine B'],
'P0353':['Bobine C défaut','Bobine C','Remplace bobine C'],
'P0354':['Bobine D défaut','Bobine D','Remplace bobine D'],
'P0380':['Préchauffage circuit','Boîtier, bougies','Contrôle boîtier + bougies'],
'P0401':['EGR débit insuffisant','Vanne encrassée','Nettoie/remplace EGR'],
'P0402':['EGR débit excessif','Vanne bloquée','Nettoie/remplace EGR'],
'P0403':['EGR circuit','Électrovanne','Contrôle circuit EGR'],
'P0404':['EGR plage/perf','Vanne encrassée','Nettoie/remplace'],
'P0405':['EGR capteur A basse','Capteur/câblage','Contrôle capteur'],
'P0406':['EGR capteur A haute','Capteur HS','Remplace capteur'],
'P0420':['Catalyseur efficacité (b1)','Catalyseur, sondes','Contrôle sondes + cata'],
'P0430':['Catalyseur efficacité (b2)','Catalyseur b2','Contrôle cata b2'],
'P0441':['EVAP purge incorrecte','Électrovanne','Remplace électrovanne'],
'P0442':['EVAP petite fuite','Bouchon, durites','Contrôle bouchon'],
'P0443':['EVAP électrovanne circuit','Électrovanne','Contrôle électrovanne'],
'P0455':['EVAP grosse fuite','Bouchon, canister','Contrôle bouchon + canister'],
'P0456':['EVAP très petite fuite','Fuite minime','Test fumée'],
'P0480':['Ventilateur 1 circuit','Relais, moteur','Contrôle relais + ventilateur'],
'P0481':['Ventilateur 2 circuit','Relais, moteur','Contrôle ventilateur 2'],
'P0496':['EVAP purge élevée','Électrovanne ouverte','Remplace électrovanne'],
'P0562':['Tension basse','Batterie/alternateur','Test batterie, masses'],
'P0563':['Tension haute','Régulateur','Contrôle alternateur'],
'P0571':['Contacteur frein A','Contacteur pédale','Remplace contacteur'],
'P0601':['ECM erreur mémoire','Calculateur','Diagnostic calculateur'],
'P0638':['Papillon motorisé plage','Boîtier papillon','Nettoie/remplace boîtier'],
'P0645':['Relais embrayage clim','Relais','Contrôle relais'],
'P0685':['Relais principal ECM','Relais','Contrôle relais'],
'P0691':['Ventilateur 1 commande basse','Relais/câblage','Contrôle relais'],
/* --- BOÎTE --- */
'P0700':['Calculateur boîte défaut','Mécatronique','Diagnostic boîte, MAJ'],
'P0705':['Gamme boîte A circuit','Capteur/levier','Contrôle capteur gamme'],
'P0706':['Gamme boîte A plage','Capteur','Contrôle capteur'],
'P0710':['T° huile boîte circuit','Capteur','Contrôle capteur T°'],
'P0711':['T° huile boîte élevée','Surchauffe/huile','Refroidissement, vidange'],
'P0715':['Régime entrée boîte','Capteur/mécatronique','Contrôle capteur + mécatro'],
'P0720':['Vitesse sortie boîte','Capteur','Contrôle capteur sortie'],
'P0730':['Rapport incorrect','Embrayages, mécatro','Vidange, diagnostic'],
'P0731':['1er rapport incorrect','Embrayage 1','Diagnostic boîte'],
'P0732':['2e rapport incorrect','Embrayage 2','Diagnostic boîte'],
'P0733':['3e rapport incorrect','Embrayage 3','Diagnostic boîte'],
'P0740':['TCC convertisseur circuit','TCC','Diagnostic convertisseur'],
'P0748':['Électrovanne pression A','Mécatronique','Diagnostic mécatro'],
'P0750':['Électrovanne A','Électrovanne','Diagnostic boîte'],
'P0755':['Électrovanne B','Électrovanne','Diagnostic boîte'],
'P0776':['Électrovanne pression B','Mécatronique DSG/EAT','Vidange + mécatro'],
'P0841':['Capteur pression boîte A','Mécatronique','Diagnostic mécatro'],
'P0868':['Pression huile boîte basse','Huile/pompe','Vidange + pompe'],
'P1336':['Capteur vilo signal','Capteur/câblage','Contrôle capteur'],
'P1602':['Immobiliseur code','Clé/calculateur','Réapprentissage'],
'P17BF':['Mécatronique DSG (VAG)','Mécatronique DQ200','MAJ + mécatro'],
'P2101':['Papillon motorisé circuit','Boîtier','Contrôle boîtier'],
'P2111':['Papillon bloqué ouvert','Boîtier','Nettoie/remplace'],
'P2112':['Papillon bloqué fermé','Boîtier','Nettoie/remplace'],
'P2122':['Pédale D basse','Capteur pédale','Contrôle capteur'],
'P2135':['Corrélation pédale/papillon','Capteurs','Contrôle capteurs'],
'P2177':['Pauvre hors ralenti','Prise air, injecteurs','Recherche fuite'],
'P2187':['Riche au ralenti','Injecteurs','Contrôle injecteurs'],
/* --- DÉPOLLUTION (EGR/FAP/AdBlue/NOx/SCR) --- */
'P2002':['FAP efficacité basse','FAP colmaté','Régénération, contrôle FAP'],
'P202E':['AdBlue : injection faible','Injecteur bouché, pompe, cristallisation','Contrôle injecteur + pompe AdBlue, rinçage circuit'],
'P203C':['AdBlue : niveau capteur','Capteur niveau, réservoir','Contrôle capteur niveau AdBlue'],
'P204D':['AdBlue : qualité/capteur','AdBlue contaminé, capteur NOx amont','Contrôle qualité AdBlue + capteur NOx'],
'P207F':['AdBlue : qualité réservoir','AdBlue contaminé, cristallisation','Vidange/remplissage AdBlue neuf'],
'P20BA':['AdBlue : chauffe injecteur','Résistance chauffe, injecteur, câblage','Contrôle injecteur AdBlue + résistance chauffe'],
'P20EE':['Rendement catalyseur SCR insuffisant pour traiter les NOx','Catalyseur SCR dégradé, qualité AdBlue contaminée, injecteur AdBlue bouché/cristallisé, capteur NOx amont/aval défaillant, fuite échappement avant SCR, température SCR insuffisante','Diagnostic complet : 1) Qualité AdBlue (réfractométrie) 2) Test injecteur AdBlue (débit/pulvérisation) 3) Capteurs NOx amont/aval 4) Contrôle température SCR 5) Catalyseur SCR 6) Fuites échappement'],
'P2200':['NOx capteur circuit (b1)','Capteur NOx amont, câblage','Contrôle capteur NOx + faisceau'],
'P2201':['NOx capteur plage (b1)','Capteur NOx HS, contamination','Remplace capteur NOx amont'],
'P2207':['NOx capteur chauffe (b1)','Résistance chauffe capteur NOx','Remplace capteur NOx'],
'P229F':['NOx capteur circuit (b2)','Capteur NOx aval','Contrôle capteur NOx aval'],
'P22AA':['NOx capteur circuit pompe','Pompe AdBlue','Contrôle pompe AdBlue'],
'P22AE':['NOx capteur pompe circuit bas','Pompe AdBlue HS','Remplace pompe AdBlue'],
'P242F':['FAP restriction suie','FAP colmaté','Régénération forcée/remplacement'],
'P2459':['FAP régénérations anormales','Parcours courts, capteurs','Régénération + capteurs'],
'P2463':['FAP suie excessive','Régénérations incomplètes','Régénération, entretien'],
'P24AE':['NOx conversion efficacité insuffisante','SCR inefficace','Contrôle catalyseur SCR + AdBlue'],
'P2563':['Turbo position wastegate','Wastegate','Contrôle wastegate'],
'P2632':['Pompe refroidissement HT','Pompe HT défaillante','Contrôle pompe HT'],
'P2635':['Pompe refroidissement perf','Pompe HT perf','Contrôle pompe'],
/* --- ABS / CHÂSSIS --- */
'C0035':['Capteur roue AV G','Capteur/câblage','Remplace capteur'],
'C0040':['Capteur roue AV D','Capteur/câblage','Remplace capteur'],
'C0045':['Capteur roue AR G','Capteur/câblage','Remplace capteur'],
'C0050':['Capteur roue AR D','Capteur/câblage','Remplace capteur'],
'C0110':['Moteur pompe ABS','Pompe ABS','Contrôle pompe ABS'],
'C0121':['Relais pompe ABS','Relais','Contrôle relais'],
'C0710':['Direction assistée défaut','Capteur couple','Contrôle direction'],
'C0750':['TPMS capteur 1','Pile/capteur','Remplace capteur'],
'C1103':['Radar AV Front Assist','Radar sali/décalé','Nettoie/calibre radar'],
'C1104':['Radar AV signal','Radar HS','Calibration radar'],
'C1201':['ABS : contrôle moteur','Moteur/ABS','Diagnostic moteur + ABS'],
'C1287':['Capteur angle volant','Capteur','Calibration capteur angle'],
/* --- AIRBAG / SRS --- */
'B0001':['Airbag conducteur circuit','Clockspring, coussin','Diagnostic SRS'],
'B0002':['Airbag passager circuit','Coussin, capteur occupation','Diagnostic SRS'],
'B0010':['Airbag latéral G','Coussin latéral','Diagnostic SRS'],
'B0013':['Airbag rideau G','Rideau','Diagnostic SRS'],
'B0020':['Airbag latéral D','Coussin latéral','Diagnostic SRS'],
'B0028':['Airbag rideau D','Rideau','Diagnostic SRS'],
'B0050':['Prétensionneur ceinture G','Prétensionneur','Remplace prétensionneur'],
'B0053':['Prétensionneur ceinture D','Prétensionneur','Remplace prétensionneur'],
'B1000':['Calculateur airbag','Calculateur, clockspring','Diagnostic SRS'],
'B1310':['Module éclairage LED','Module/faisceau','Contrôle module LED'],
'B1421':['Résistance pulseur clim','Résistance','Remplace résistance'],
'B1600':['Clockspring circuit','Clockspring','Remplace clockspring'],
/* --- RÉSEAU / ÉLECTRONIQUE --- */
'U0073':['Bus communication désactivé','CAN bus','Contrôle réseau CAN'],
'U0100':['Perte communication ECM','CAN moteur','Contrôle module moteur'],
'U0121':['Perte communication ABS','CAN ABS','Contrôle module ABS'],
'U0155':['Perte communication multimédia','Head unit','MAJ/remplacement head unit'],
'U0235':['Perte communication radar AV','Radar/caméra','Contrôle radar + caméra'],
'U0416':['Données ESP invalides','Réseau','Diagnostic réseau'],
'U0417':['Données frein invalides','Réseau','Diagnostic réseau'],
'U0420':['Données direction invalides','Réseau','Diagnostic réseau'],
'U1233':['Écran multimédia reboot','Software instable','MAJ firmware, reset usine'],
'U3000':['Module contrôle tension','Alimentation','Contrôle alimentation'],
/* --- VÉHICULES ÉLECTRIQUES / HYBRIDES --- */
'P0A0D':['Interlock HT circuit','Câblage orange','Diagnostic HV agréé'],
'P0A0E':['Interlock HT performance','Connecteurs','Diagnostic HV'],
'P0A1F':['Module gestion batterie HT','BMS','Diagnostic BMS'],
'P0A78':['Onduleur puissance','Refroidissement onduleur','Contrôle pompe/liquide'],
'P0A80':['Batterie HT à remplacer','Modules déséquilibrés, SOH faible','Diagnostic modules, équilibrage, remplacement'],
'P0A93':['Refroidissement onduleur pompe','Pompe HS','Remplace pompe'],
'P0AA6':['Isolement batterie HT','Câbles/pack, fuite diélectrique','Diagnostic HV agréé uniquement'],
'P0AFB':['Tension HT basse','Pack/modules','Diagnostic pack'],
'P0B10':['Tension cellule module 1','Cellules déséquilibrées','Équilibrage modules'],
'P0B15':['Tension cellule module 2','Cellules','Équilibrage'],
'P0B2A':['Température batterie HT','Capteurs T°','Contrôle capteurs T°'],
'P0B45':['Contacteur HT principal','Contacteur','Diagnostic contacteur'],
'P0B75':['Capteur courant HT','Capteur','Contrôle capteur'],
'P0B90':['Isolation HT interne','Pack','Diagnostic pack'],
'P0C73':['DC/DC sortie défaut','DC-DC','Contrôle DC-DC'],
'P0C78':['Convertisseur DC/DC défaillant','DC-DC, charge 12V','Contrôle/remplace DC-DC'],
'P0C79':['DC/DC performance','DC-DC dégradé','Contrôle DC-DC'],
'P0D16':['Charge HT circuit pilote','Câble/borne','Contrôle câble + borne'],
'P0D17':['Charge HT communication','Câble/borne','Contrôle communication'],
'P1E00':['Défaut charge VE (OBC)','OBC, câble, borne','Contrôle OBC/prise']
};

/* === GÉNÉRATEURS (cylindres, bobines…) === */
function gen(code){var m;
 if(m=code.match(/^P0?3(0[1-9]|1[0-2])$/)){var n=parseInt(m[1],10);return['Ratés cylindre '+n,'Bobine/bougie/injecteur '+n,'Permuter bobine, contrôler'];}
 if(m=code.match(/^P02(0[1-9]|1[0-2])$/)){var c=parseInt(m[1],10);return['Injecteur cyl. '+c,'Injecteur '+c,'Test injecteur '+c];}
 if(m=code.match(/^P03(5[1-8])$/)){var L='ABCDEFGH';var i=parseInt(code.slice(3),10)-51;return['Bobine '+L[i],'Bobine '+L[i],'Remplace bobine '+L[i]];}
 if(m=code.match(/^P06(7[1-9]|80)$/)){var g=parseInt(code.slice(3),10)-70;return['Préchauffage cyl. '+g,'Bougie '+g,'Remplace bougie '+g];}
 return null;}

/* === FONCTION CENTRALE : extraction de codes DTC depuis une chaîne === */
window.extractDtc = function(q){
 if(!q)return[];
 var matches = String(q).match(DTC_REGEX) || [];
 var seen = {};
 var out = [];
 for(var i=0;i<matches.length;i++){
  var c = matches[i].toUpperCase();
  if(!seen[c]){seen[c]=1;out.push(c);}
 }
 return out;
};

window.dtcInfo=function(code){
 code=(code||'').toUpperCase().trim();
 if(D[code])return D[code];
 return gen(code);
};

/* Suggestion : matche par préfixe (P20 → P20EE, P202E, P207F…) */
window.dtcSuggest=function(q,limit){
 q=(q||'').toUpperCase().replace(/\s+/g,'');
 if(!q)return[];
 var out=[];
 for(var k in D){
  if(k.indexOf(q)>-1 || k.startsWith(q)){
   out.push({code:k,label:D[k][0]});
   if(out.length>=limit)break;
  }
 }
 out.sort(function(a,b){
  var sa = a.code.startsWith(q)?0:1;
  var sb = b.code.startsWith(q)?0:1;
  return sa-sb || a.code.localeCompare(b.code);
 });
 if(out.length<limit){
  for(var c=1;c<=12;c++){
   var kk='P03'+('0'+c).slice(-2);
   if(kk.indexOf(q)>-1&&!D[kk]){
    out.push({code:kk,label:'Ratés cylindre '+c});
    if(out.length>=limit)break;
   }
  }
 }
 return out.slice(0,limit);
};

window.dtcSystem=function(code){
 code=(code||'').toUpperCase();
 if(/^P0[0-3]/.test(code)||/^P1[0-3]/.test(code))return'Moteur';
 if(/^P04|^P20|^P22|^P24/.test(code))return'Dépollution';
 if(/^P0[7-9]|^P17|^P27/.test(code))return'Boîte';
 if(/^C0[0-2]/.test(code)||/^C1[0-4]/.test(code))return'ABS';
 if(/^B00|^B1[0469]/.test(code))return'Airbag';
 if(/^C11|^C12[89]|^U0[124]/.test(code))return'ADAS';
 if(/^P0[A-F]|^P0[C-D]|^P1E/.test(code))return'HT';
 return'Autre';
};

window.DTC_COUNT=Object.keys(D).length;
window.DTC_REGEX=DTC_REGEX;
try{localStorage.setItem('mrt_dtc_local','1');}catch(e){}
})();
