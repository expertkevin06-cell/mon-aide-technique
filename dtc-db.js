/* dtc-db.js v7 — Extraction DTC ULTRA-SIMPLE (P20EE garanti fonctionnel) */
(function(){
'use strict';

var D = {
/* MOTEUR */
'P0016':['Corrélation vilo/AAC admission','Distribution décalée, capteur, VVT','Contrôle calage, capteurs, phasers'],
'P0087':['Pression rail basse','Pompe HP, filtre, limaille','Contrôle pression, pompe, rinçage'],
'P00AF':['Actuateur turbo HS','Actuateur carbonisé','Remplace actuateur'],
'P0100':['MAF circuit','MAF, câblage','Contrôle MAF'],
'P0101':['MAF plage/perf','MAF encrassé, fuite','Nettoie/remplace MAF'],
'P0171':['Mélange pauvre (b1)','Prise air, pompe, sonde','Recherche fuite + sonde'],
'P0299':['Pression turbo basse','Fuite, wastegate, turbo, EGR','Contrôle durites/wastegate/turbo'],
'P0300':['Ratés multiples','Bobines, bougies, injecteurs','Bobines/bougies, compressions'],
'P0301':['Ratés cyl.1','Bobine/bougie 1','Permuter bobine'],
'P0302':['Ratés cyl.2','Bobine/bougie 2','Permuter bobine'],
'P0303':['Ratés cyl.3','Bobine/bougie 3','Permuter bobine'],
'P0304':['Ratés cyl.4','Bobine/bougie 4','Permuter bobine'],
'P0335':['Capteur vilo circuit','Capteur/câblage','Contrôle capteur vilo'],
'P0340':['Capteur AAC A circuit','Capteur, calage','Contrôle capteur + calage'],
'P0351':['Bobine A défaut','Bobine A','Remplace bobine A'],
'P0401':['EGR débit insuffisant','Vanne encrassée','Nettoie/remplace EGR'],
'P0420':['Catalyseur efficacité (b1)','Catalyseur, sondes','Contrôle sondes + cata'],
'P0562':['Tension basse','Batterie/alternateur','Test batterie, masses'],
/* BOÎTE */
'P0700':['Calculateur boîte défaut','Mécatronique','Diagnostic boîte, MAJ'],
'P0711':['T° huile boîte élevée','Surchauffe/huile','Refroidissement, vidange'],
'P0776':['Électrovanne pression B','Mécatronique DSG/EAT','Vidange + mécatro'],
'P0841':['Capteur pression boîte A','Mécatronique','Diagnostic mécatro'],
'P17BF':['Mécatronique DSG (VAG)','Mécatronique DQ200','MAJ + mécatro'],
'P1811':['Sélection vitesse impossible (N bloqué)','ECU transmission, capteur','Fermer véhicule, attendre extinction voyants ou MAJ concession'],
/* DÉPOLLUTION — CODES CRITIQUES */
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
'P242F':['FAP restriction suie','FAP colmaté','Régénération forcée/remplacement'],
'P2459':['FAP régénérations anormales','Parcours courts, capteurs','Régénération + capteurs'],
'P2463':['FAP suie excessive','Régénérations incomplètes','Régénération, entretien'],
/* ABS / CHÂSSIS */
'C0035':['Capteur roue AV G','Capteur/câblage','Remplace capteur'],
'C0040':['Capteur roue AV D','Capteur/câblage','Remplace capteur'],
'C1103':['Radar AV Front Assist','Radar sali/décalé','Nettoie/calibre radar'],
/* AIRBAG */
'B0001':['Airbag conducteur circuit','Clockspring, coussin','Diagnostic SRS'],
'B0050':['Prétensionneur ceinture G','Prétensionneur','Remplace prétensionneur'],
'B1000':['Calculateur airbag','Calculateur, clockspring','Diagnostic SRS'],
'B1600':['Clockspring circuit','Clockspring','Remplace clockspring'],
/* RÉSEAU */
'U0100':['Perte communication ECM','CAN moteur','Contrôle module moteur'],
'U0121':['Perte communication ABS','CAN ABS','Contrôle module ABS'],
'U0155':['Perte communication multimédia','Head unit','MAJ/remplacement head unit'],
'U1233':['Écran multimédia reboot','Software instable','MAJ firmware, reset usine'],
/* HT / VE */
'P0A0D':['Interlock HT circuit','Câblage orange','Diagnostic HV agréé'],
'P0A1F':['Module gestion batterie HT','BMS','Diagnostic BMS'],
'P0A78':['Onduleur puissance','Refroidissement onduleur','Contrôle pompe/liquide'],
'P0A80':['Batterie HT à remplacer','Modules déséquilibrés, SOH faible','Diagnostic modules, équilibrage, remplacement'],
'P0A93':['Refroidissement onduleur pompe','Pompe HS','Remplace pompe'],
'P0AA6':['Isolement batterie HT','Câbles/pack, fuite diélectrique','Diagnostic HV agréé uniquement'],
'P0C73':['DC/DC sortie défaut','DC-DC','Contrôle DC-DC'],
'P0C78':['Convertisseur DC/DC défaillant','DC-DC, charge 12V','Contrôle/remplace DC-DC'],
'P0D16':['Charge HT circuit pilote','Câble/borne','Contrôle câble + borne'],
'P0D17':['Charge HT communication','Câble/borne','Contrôle communication'],
'P1E00':['Défaut charge VE (OBC)','OBC, câble, borne','Contrôle OBC/prise']
};

/* === EXTRACTION DTC ULTRA-SIMPLE === */
/* Fonction qui marche à 100% : cherche juste [P|C|B|U] + 4-5 hex */
function extractDtcSimple(text){
 if(!text) return [];
 var result = [];
 var seen = {};
 var upper = String(text).toUpperCase();
 
 /* Pattern : lettre P/C/B/U suivie de 4-5 caractères hex (0-9 A-F) */
 var regex = /[PCBU][0-9A-F]{4,5}/g;
 var match;
 
 while((match = regex.exec(upper)) !== null){
  var code = match[0];
  /* Vérifier que c'est bien un code complet (5 caractères) */
  if(code.length === 5 && !seen[code]){
   seen[code] = true;
   result.push(code);
  }
 }
 
 console.log('[extractDtc] "' + text + '" → ', result);
 return result;
}

/* === INFOS DTC === */
function dtcInfoSimple(code){
 if(!code) return null;
 code = String(code).toUpperCase().trim();
 console.log('[dtcInfo] Recherche de:', code, '→ existe:', !!D[code]);
 return D[code] || null;
}

/* === SUGGESTIONS === */
function dtcSuggestSimple(q, limit){
 if(!q) return [];
 q = String(q).toUpperCase().replace(/\s+/g,'');
 if(!q) return [];
 var out = [];
 for(var k in D){
  if(k.indexOf(q) > -1){
   out.push({code:k, label:D[k][0]});
   if(out.length >= limit) break;
  }
 }
 return out;
}

/* === SYSTÈME DTC === */
function dtcSystemSimple(code){
 if(!code) return 'Autre';
 code = String(code).toUpperCase();
 if(/^P0[0-3]/.test(code)) return 'Moteur';
 if(/^P20|^P22|^P24/.test(code)) return 'Dépollution';
 if(/^P0[7-9]/.test(code)) return 'Boîte';
 if(/^C0[0-2]/.test(code) || /^C1[0-4]/.test(code)) return 'ABS';
 if(/^B00/.test(code)) return 'Airbag';
 if(/^U0[12]/.test(code)) return 'Réseau';
 if(/^P0[A-F]/.test(code)) return 'HT';
 return 'Autre';
}

/* === EXPORT GLOBAL === */
window.extractDtc = extractDtcSimple;
window.dtcInfo = dtcInfoSimple;
window.dtcSuggest = dtcSuggestSimple;
window.dtcSystem = dtcSystemSimple;
window.DTC_COUNT = Object.keys(D).length;

/* === TEST AUTOMATIQUE P20EE === */
(function testP20EE(){
 console.log('=== TEST P20EE ===');
 var extracted = extractDtcSimple('P20EE');
 console.log('extractDtc("P20EE") =', extracted);
 var info = dtcInfoSimple('P20EE');
 console.log('dtcInfo("P20EE") =', info);
 console.log('=== FIN TEST ===');
 
 if(!extracted.length || !info){
  console.error('❌ P20EE NE FONCTIONNE PAS !');
 } else {
  console.log('✅ P20EE FONCTIONNE CORRECTEMENT');
 }
})();

try { localStorage.setItem('mrt_dtc_local', '1'); } catch(e){}

console.log('[dtc-db] v7 chargé — ' + window.DTC_COUNT + ' codes DTC');
})();
