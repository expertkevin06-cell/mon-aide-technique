/* search-sources.js — Catalogue de 25+ sources externes organisées par catégorie */
(function(){
'use strict';
const SOURCES=[
/* OFFICIELS & RAPPELS */
{name:'NHTSA (US)',cat:'officiel',url:(q)=>'https://www.nhtsa.gov/search?query='+encodeURIComponent(q),icon:'🇺🇸'},
{name:'Safety Gate (UE)',cat:'officiel',url:(q)=>'https://ec.europa.eu/safety-gate-alerts/screen/search?query='+encodeURIComponent(q),icon:'🇪🇺'},
{name:'Rappel Conso (FR)',cat:'officiel',url:(q)=>'https://rappel.conso.gouv.fr/recherche?query='+encodeURIComponent(q),icon:'🇫🇷'},
{name:'Transport Canada',cat:'officiel',url:(q)=>'https://tc.canada.ca/en/vehicle-recalls/search?text='+encodeURIComponent(q),icon:'🇨🇦'},
{name:'VOSA UK',cat:'officiel',url:(q)=>'https://www.gov.uk/check-mot-history',icon:'🇬🇧'},
/* TECHNIQUES & PIÈCES AUTO */
{name:'Auto-doc (problèmes connus)',cat:'technique',url:(q)=>'https://www.auto-doc.fr/info/problemes-avec-'+encodeURIComponent(q.toLowerCase().replace(/[^a-z0-9]+/g,'-')),icon:'🔧'},
{name:'Oscaro conseils',cat:'technique',url:(q)=>'https://www.oscaro.com/content/recherche?q='+encodeURIComponent(q),icon:'🛠️'},
{name:'Pièces Auto 24',cat:'technique',url:(q)=>'https://www.piecesauto24.com/recherche?q='+encodeURIComponent(q),icon:'🔩'},
{name:'Revue Technique Auto',cat:'technique',url:(q)=>'https://www.rta.fr/recherche?q='+encodeURIComponent(q),icon:'📚'},
{name:'Mister Auto',cat:'technique',url:(q)=>'https://www.mister-auto.com/recherche/?q='+encodeURIComponent(q),icon:'🔧'},
/* PRESSE AUTOMOBILE */
{name:'L\'Argus (fiabilité)',cat:'presse',url:(q)=>'https://www.largus.fr/recherche?q='+encodeURIComponent(q+' fiabilité problèmes'),icon:'📰'},
{name:'Auto Plus',cat:'presse',url:(q)=>'https://www.autoplus.fr/recherche?q='+encodeURIComponent(q),icon:'📰'},
{name:'Auto Moto',cat:'presse',url:(q)=>'https://www.auto-moto.com/recherche?q='+encodeURIComponent(q),icon:'📰'},
{name:'Caradisiac (avis)',cat:'presse',url:(q)=>'https://www.caradisiac.com/recherche?q='+encodeURIComponent(q+' avis fiabilité'),icon:'💬'},
{name:'Les Numériques Auto',cat:'presse',url:(q)=>'https://www.lesnumeriques.com/recherche?q='+encodeURIComponent(q),icon:'📱'},
/* FORUMS SPÉCIALISÉS */
{name:'Forum-Auto',cat:'forum',url:(q)=>'https://www.forum-auto.com/recherche?q='+encodeURIComponent(q),icon:'👥'},
{name:'Planète Citroën',cat:'forum',url:(q)=>'https://www.planete-citroen.com/search/?q='+encodeURIComponent(q),icon:'👥'},
{name:'Forum-PE (Peugeot)',cat:'forum',url:(q)=>'https://www.forum-peugeot.com/forums/search/?q='+encodeURIComponent(q),icon:'👥'},
{name:'Renault-Forum',cat:'forum',url:(q)=>'https://www.forum-renault.fr/search/?q='+encodeURIComponent(q),icon:'👥'},
{name:'Golf7.net (VAG)',cat:'forum',url:(q)=>'https://www.golf7.net/forums/search/?q='+encodeURIComponent(q),icon:'👥'},
/* VÉHICULES ÉLECTRIQUES */
{name:'Automobile-Propre',cat:'ve',url:(q)=>'https://www.automobile-propre.com/?s='+encodeURIComponent(q),icon:'⚡'},
{name:'InsideEVs',cat:'ve',url:(q)=>'https://insideevs.com/search/?q='+encodeURIComponent(q),icon:'⚡'},
{name:'Tesla Motors Club',cat:'ve',url:(q)=>'https://teslamotorsclub.com/tmc/search/?q='+encodeURIComponent(q),icon:'⚡'},
/* CHINE / ASIE */
{name:'Baidu Auto',cat:'chine',url:(q)=>'https://www.baidu.com/s?wd='+encodeURIComponent(q+' 故障'),icon:'🇨🇳'},
{name:'Dongchedi (懂车帝)',cat:'chine',url:(q)=>'https://www.dongchedi.com/search?keyword='+encodeURIComponent(q),icon:'🇨🇳'},
{name:'Autohome (汽车之家)',cat:'chine',url:(q)=>'https://so.autohome.com.cn/search?q='+encodeURIComponent(q+' 故障'),icon:'🇨🇳'},
/* US / INTERNATIONAL */
{name:'CarComplaints',cat:'us',url:(q)=>'https://www.carcomplaints.com/search/?q='+encodeURIComponent(q),icon:'🇺🇸'},
{name:'Edmunds',cat:'us',url:(q)=>'https://www.edmunds.com/search/?q='+encodeURIComponent(q+' problems'),icon:'🇺🇸'},
{name:'RepairPal',cat:'us',url:(q)=>'https://repairpal.com/search?q='+encodeURIComponent(q),icon:'🇺🇸'},
{name:'Consumer Reports',cat:'us',url:(q)=>'https://www.consumerreports.org/search/?q='+encodeURIComponent(q+' reliability'),icon:'🇺🇸'},
/* VIDÉOS */
{name:'YouTube (tutos pannes)',cat:'video',url:(q)=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q+' problème panne diagnostic'),icon:'🎬'},
{name:'YouTube (anglais)',cat:'video',url:(q)=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q+' problems diagnosis fix'),icon:'🎬'}
];
const CAT_LABELS={officiel:'🏛️ Officiels & rappels',technique:'🔧 Techniques & pièces',presse:'📰 Presse auto',forum:'👥 Forums',ve:'⚡ Véhicules électriques',chine:'🇨🇳 Chine / Asie',us:'🇺🇸 US / International',video:'🎬 Vidéos'};
window.SEARCH_SOURCES=SOURCES;
window.SEARCH_CATS=CAT_LABELS;
window.getSourcesByCategory=function(cat){return SOURCES.filter(s=>!cat||s.cat===cat);};
window.buildSourceLinks=function(queries){
 if(!Array.isArray(queries))queries=[queries];
 const out={};
 Object.keys(CAT_LABELS).forEach(cat=>{
  out[cat]={label:CAT_LABELS[cat],items:[]};
  SOURCES.filter(s=>s.cat===cat).forEach(s=>{
   const url=s.url(queries.join(' '));
   out[cat].items.push({name:s.name,icon:s.icon,url:url});
  });
 });
 return out;
};
})();
