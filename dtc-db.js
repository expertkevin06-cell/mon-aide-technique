/* dtc-db.js v6 — extractDtc ultra-robuste (P20EE fonctionne enfin) */
(function(){
'use strict';

var DTC_REGEX = /\b[pcbu][0-9a-f]{4,5}\b/gi;

var D = {
/* MOTEUR */
'P0016':['Corrélation vilo/AAC admission','Distribution décalée, capteur, VVT','Contrôle calage, capteurs, phasers'],
'P0017':['Corrélation vilo/AAC échappement','Distribution décalée','Contrôle calage, tendeurs'],
'P0087':['Pression rail basse','Pompe HP, filtre, limaille','Contrôle pression, pompe, rinçage'],
'P00AF':['Actuateur turbo HS','Actuateur carbonisé','Remplace actuateur'],
'P0100':['MAF circuit','MAF, câblage','Contrôle MAF'],
'P0101':['MAF plage/perf','MAF encrassé, fuite','Nettoie/remplace MAF'],
'P0171':['Mélange pauvre (b1)','Prise air, pompe, sonde','Recherche fuite + sonde'],
'P0172':['Mélange riche (b1)','Injecteur fuyard','Contrôle injecteurs'],
'P0201':['Injecteur cyl.1 circuit','Injecteur 1','Test injecteur 1'],
'P0299':['Pression turbo basse','Fuite, wastegate, turbo, EGR','Contrôle durites/wastegate/turbo'],
'P0300':['Ratés multiples','Bobines, bougies, injecteurs','Bobines/bougies, compressions'],
'P0301':['Ratés cyl.1','Bobine/bougie 1','Permuter bobine'],
'P0302':['Ratés cyl.2','Bobine/bougie 2','Permuter bobine'],
'P0303':['Ratés cyl.3','Bobine/bougie 3','Permuter bobine'],
'P0304':['Ratés cyl.4','Bobine/bougie 4','Permuter bobine'],
'P0335':['Capteur vilo circuit','Capteur/câblage','Contrôle capteur vilo'],
'P0340':['Capteur AAC A circuit','Capteur, calage','Contrôle capteur + calage'],
'P0351':['Bobine A défaut','Bobine A','Remplace bobine A'],
'P0352':['Bobine B défaut','Bobine B','Remplace bobine B'],
'P0353':['Bobine C défaut','Bobine C','Remplace bobine C'],
'P0354':['Bobine D défaut','Bobine D','Remplace bobine D'],
'P0380':['Préchauffage circuit','Boîtier, bougies','Contrôle boîtier + bougies'],
'P0401':['EGR débit insuffisant','Vanne encrassée','Nettoie/remplace EGR'],
'P0402':['EGR débit excessif','Vanne bloquée','Nettoie/remplace EGR'],
'P0420':['Catalyseur efficacité (b1)','Catalyseur, sondes','Contrôle sondes + cata'],
'P0441':['EVAP purge incorrecte','Électrovanne','Remplace électrovanne'],
'P0455':['EVAP grosse fuite','Bouchon, canister','Contrôle bouchon + canister'],
'P0562':['Tension basse','Batterie/alternateur','Test batterie, masses'],
'P0563':['Tension haute','Régulateur','Contrôle alternateur'],
/* BOÎTE */
'P0700':['Calculateur boîte défaut','Mécatronique','Diagnostic boîte, MAJ'],
'P0705':['Gamme boîte A circuit','Capteur/levier','Contrôle capteur gamme'],
'P0711':['T° huile boîte élevée','Surchauffe/huile','Refroidissement, vidange'],
'P0715':['Régime entrée boîte','Capteur/mécatronique','Contrôle capteur + mécatro'],
'P0730':['Rapport incorrect','Embrayages, mécatro','Vidange, diagnostic'],
'P0740':['TCC convertisseur circuit','TCC','Diagnostic convertisseur'],
'P0776':['Électrovanne pression B','Mécatronique DSG/EAT','Vidange + mécatro'],
'P0841':['Capteur pression boîte A','Mécatronique','Diagnostic mécatro'],
'P17BF':['Mécatronique DSG (VAG)','Mécatronique DQ200','MAJ + mécatro'],
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
'P229F':['NOx capteur circuit (b2)','Capteur NOx aval','Contrôle capteur NOx aval'],
'P242F':['FAP restriction suie','FAP colmaté','Régénération forcée/remplacement'],
'P2459':['FAP régénérations anormales','Parcours courts, capteurs','Régénération + capteurs'],
'P2463':['FAP suie excessive','Régénérations incomplètes','Régénération, entretien'],
/* ABS / CHÂSSIS */
'C0035':['Capteur roue AV G','Capteur/câblage','Remplace capteur'],
'C0040':['Capteur roue AV D','Capteur/câblage','Remplace capteur'],
'C0045':['Capteur roue AR G','Capteur/câblage','Remplace capteur'],
'C0050':['Capteur roue AR D','Capteur/câblage','Remplace capteur'],
'C1103':['Radar AV Front Assist','Radar sali/décalé','Nettoie/calibre radar'],
'C1104':['Radar AV signal','Radar HS','Calibration radar'],
'C1287':['Capteur angle volant','Capteur','Calibration capteur angle'],
/* AIRBAG */
'B0001':['Airbag conducteur circuit','Clockspring, coussin','Diagnostic SRS'],
'B0002':['Airbag passager circuit','Coussin, capteur occupation','Diagnostic SRS'],
'B0050':['Prétensionneur ceinture G','Prétensionneur','Remplace prétensionneur'],
'B0053':['Prétensionneur ceinture D','Prétensionneur','Remplace prétensionneur'],
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
'P1E00':['Défaut charge VE (OBC)','OBC, câble, borne','Contrôle OBC/prise'],
'P1811':['Sélection de vitesse impossible (véhicule bloqué en N)','ECU transmission, capteur position, calculateur boîte','Fermer le véhicule, attendre extinction complète des voyants (mise en veille) — si persistant : MAJ logicielle en concession']
};

function gen(code){var m;
 if(m=code.match(/^P0?3(0[1-9]|1[0-2])$/)){var n=parseInt(m[1],10);return['Ratés cylindre '+n,'Bobine/bougie/injecteur '+n,'Permuter bobine, contrôler'];}
 if(m=code.match(/^P02(0[1-9]|1[0-2])$/)){var c=parseInt(m[1],10);return['Injecteur cyl. '+c,'Injecteur '+c,'Test injecteur '+c];}
 if(m=code.match(/^P03(5[1-8])$/)){var L='ABCDEFGH';var i=parseInt(code.slice(3),10)-51;return['Bobine '+L[i],'Bobine '+L[i],'Remplace bobine '+L[i]];}
 return null;
}

/* === EXTRACTION DTC ULTRA-ROBUSTE === */
window.extractDtc = function(q){
 if(!q) return [];
 var text = String(q).toUpperCase();
 var out = [];
 var seen = {};

 /* Pattern principal : [P|C|B|U] + 4-5 caractères hexadécimaux */
 var pattern = /\b([PCBU][0-9A-F]{4,5})\b/g;
 var match;
 while((match = pattern.exec(text)) !== null){
  var c = match[1];
  if(!seen[c]){ seen[c] = 1; out.push(c); }
 }

 /* Pattern fallback : 1 lettre + 4-5 hex */
 if(out.length === 0){
  var pattern2 = /([PCBU][0-9A-F]{4,5})/g;
  while((match = pattern2.exec(text)) !== null){
   var c2 = match[1];
   if(!seen[c2]){ seen[c2] = 1; out.push(c2); }
  }
 }

 /* DEBUG console */
 console.log('[extractDtc] input:', q, '→ output:', out);
 return out;
};

window.dtcInfo = function(code){
 if(!code) return null;
 code = String(code).toUpperCase().trim();
 var info = D[code];
 console.log('[dtcInfo] code:', code, '→ found:', !!info);
 if(info) return info;
 return gen(code);
};

window.dtcSuggest = function(q, limit){
 if(!q) return [];
 q = String(q).toUpperCase().replace(/\s+/g,'');
 if(!q) return [];
 var out = [];
 for(var k in D){
  if(k.indexOf(q) > -1 || k.startsWith(q)){
   out.push({code:k, label:D[k][0]});
   if(out.length >= limit) break;
  }
 }
 out.sort(function(a,b){
  var sa = a.code.startsWith(q) ? 0 : 1;
  var sb = b.code.startsWith(q) ? 0 : 1;
  return sa - sb || a.code.localeCompare(b.code);
 });
 return out.slice(0, limit || 10);
};

window.dtcSystem = function(code){
 if(!code) return 'Autre';
 code = String(code).toUpperCase();
 if(/^P0[0-3]/.test(code) || /^P1[0-3]/.test(code)) return 'Moteur';
 if(/^P04|^P20|^P22|^P24/.test(code)) return 'Dépollution';
 if(/^P0[7-9]|^P17|^P27|^P18/.test(code)) return 'Boîte';
 if(/^C0[0-2]/.test(code) || /^C1[0-4]/.test(code)) return 'ABS';
 if(/^B00|^B1[0469]/.test(code)) return 'Airbag';
 if(/^C11|^C12[89]|^U0[124]/.test(code)) return 'ADAS';
 if(/^P0[A-F]|^P0[C-D]|^P1E/.test(code)) return 'HT';
 return 'Autre';
};

/* === TEST IMMÉDIAT P20EE === */
(function testP20EE(){
 var test = extractDtc('P20EE');
 console.log('[TEST P20EE] extractDtc("P20EE") =', test);
 var info = dtcInfo('P20EE');
 console.log('[TEST P20EE] dtcInfo("P20EE") =', info);
})();

window.DTC_COUNT = Object.keys(D).length;
window.DTC_REGEX = DTC_REGEX;
try { localStorage.setItem('mrt_dtc_local', '1'); } catch(e){}

console.log('[dtc-db] v6 chargé — ' + window.DTC_COUNT + ' codes DTC');
})();
