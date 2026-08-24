# -*- coding: utf-8 -*-
"""
build_database.py
Récupère les rappels automobiles officiels depuis RappelConso (data.gouv.fr)
et génère data/recalls.json au format de l'application Analyse Technique Kevin.
"""
import json
import os
import re
import urllib.request

SOURCE_URL = (
    "https://www.data.gouv.fr/api/2/datasets/rappelconso-v2/"
    "?page_size=1"
)

# Fallback : fichier d'échange officiel RappelConso (JSON)
DATA_URL = "https://data.economie.gouv.fr/explore/dataset/rappels-conso/download?format=json&timezone=Europe%2FParis"

MOT_CLES_VEHICULE = [
    "véhicule", "vehicule", "automobile", "voiture", "suv",
    "berline", "break", "utilitaire", "fourgon", "pickup",
    "moto", "scooter", "camion", "autocar", "caravane", "remorque",
]

MARQUES_CONNUES = [
    "PEUGEOT", "RENAULT", "CITROEN", "CITROËN", "DS", "OPEL", "DACIA",
    "VOLKSWAGEN", "AUDI", "BMW", "MERCEDES", "MERCEDES-BENZ", "PORSCHE",
    "SEAT", "SKODA", "MINI", "LAND ROVER", "RANGE ROVER", "JAGUAR",
    "VOLVO", "FIAT", "ALFA ROMEO", "LANCIA", "FORD", "TESLA",
    "JEEP", "DODGE", "CHEVROLET",
    "TOYOTA", "LEXUS", "NISSAN", "HONDA", "MAZDA", "SUZUKI", "SUBARU",
    "MITSUBISHI", "ISUZU",
    "HYUNDAI", "KIA", "SSANGYONG", "GENESIS",
    "MG", "BYD", "JAECOO", "OMODA", "CHERY", "XPENG", "LEAPMOTOR",
]


def fetch_json(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (compatible; AnalyseKevinBot/1.0)"
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def detect_marque(texte):
    t = texte.upper()
    for m in MARQUES_CONNUES:
        if m in t:
            return m.replace("CITROËN", "CITROEN")
    return None


def est_automobile(rec):
    texte = " ".join(str(v) for v in rec.values() if isinstance(v, str))
    tl = texte.lower()
    if any(m in tl for m in MOT_CLES_VEHICULE):
        return True
    return detect_marque(texte) is not None and "siège" not in tl and "siege" not in tl


def nettoyer(s):
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", "", str(s))
    s = s.replace("\r", "").strip()
    return s[:1200]


def convertir(rec):
    """Convertit une entrée RappelConso en fiche application."""
    marque = detect_marque(json.dumps(rec, ensure_ascii=False)) or "AUTRE"
    modele = nettoyer(
        rec.get("modeles_concernes")
        or rec.get("modele")
        or rec.get("nom_produit")
        or "Modèles multiples"
    )
    titre = nettoyer(
        rec.get("motif_rappel") or rec.get("description_du_produit") or "Rappel constructeur"
    )[:120]
    details_parts = []
    for cle in ("risques_encourus_par_le_consommateur", "risques",
                "conduite_que_doit_tenir_le_consommateur", "conduite_a_tenir",
                "description_des_evenements"):
        val = nettoyer(rec.get(cle))
        if val:
            details_parts.append(val)
    date_pub = rec.get("date_publication") or rec.get("date_debut_fin_publication") or ""
    source = "RappelConso" + ((" — " + date_pub[:10]) if date_pub else "")

    return {
        "marque": marque,
        "modele": modele,
        "moteur": "Toutes motorisations (voir fiche)",
        "annee": str(date_pub)[:4] if date_pub else "—",
        "dtc": "",
        "source": source,
        "titre": titre,
        "details": "\n".join(details_parts) or "Consultez la fiche officielle sur ovs.economie.gouv.fr avec le VIN.",
    }


def main():
    print("📥 Téléchargement des données RappelConso...")
    try:
        brut = fetch_json(DATA_URL)
    except Exception as e:
        print("⚠️ Source indisponible :", e)
        brut = []

    fiches = []
    for rec in brut:
        try:
            if est_automobile(rec):
                fiche = convertir(rec)
                # Déduplication par marque+titre
                cle = (fiche["marque"] + "|" + fiche["titre"]).lower()
                if cle not in {(f["marque"] + "|" + f["titre"]).lower() for f in fiches}:
                    fiches.append(fiche)
        except Exception as ex:
            print("   ligne ignorée :", ex)

    os.makedirs("data", exist_ok=True)
    with open("data/recalls.json", "w", encoding="utf-8") as f:
        json.dump(fiches, f, ensure_ascii=False, indent=1)

    print(f"✅ {len(fiches)} fiches automobile écrites dans data/recalls.json")


if __name__ == "__main__":
    main()
