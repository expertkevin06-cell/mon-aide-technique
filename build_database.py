import json, time, urllib.request, urllib.parse, os

OUTPUT = "data/recalls.json"
os.makedirs("data", exist_ok=True)

recalls = []
seen = set()

# Reprise si base existante
if os.path.exists(OUTPUT):
    with open(OUTPUT, encoding="utf-8") as f:
        for r in json.load(f):
            seen.add(f"{r['brand']}|{r['model']}|{r['campaignNumber']}|{r['source']}")
            recalls.append(r)
    print(f"Base existante : {len(recalls)} fiches")

MAX_FICHES = int(os.environ.get("MAX_FICHES", "25000"))

def add(brand, model, year, energy, system, campaign, description, dtc, source):
    key = f"{brand}|{model}|{campaign}|{source}"
    if key in seen or not description:
        return
    seen.add(key)
    recalls.append({
        "brand": brand.strip().title(), "model": model.strip(), "year": str(year),
        "energy": energy, "system": system, "campaignNumber": campaign,
        "description": description[:800], "dtcCode": dtc, "source": source
    })

def get_json(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ATKevin/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        print(f"Erreur: {e}")
        return None

ENERGY_KW = {
    "Électrique": ["electric", "ev ", "battery pack", "high voltage", "hv battery"],
    "Hybride": ["hybrid", "phev", "plug-in"],
    "Diesel": ["diesel", "nox", "dpf", "adblue"],
    "Flexfuel E85": ["flex fuel", "e85", "ethanol"],
}
SYSTEM_KW = {
    "Airbag": ["airbag", "inflator", "takata"],
    "ABS/ESP": ["abs", "anti-lock", "stability", "esc"],
    "Ceintures": ["seat belt", "seatbelt", "buckle", "retractor"],
    "Boîte de vitesses": ["transmission", "gearbox", "clutch", "shift"],
    "Batterie haute tension": ["high voltage battery", "battery pack"],
    "Charge DC/AC": ["charging", "charger", "dc fast", "onboard charger"],
    "Freins": ["brake"],
    "Direction": ["steering"],
    "Carburant": ["fuel pump", "fuel tank", "fuel leak", "fuel line"],
    "Électronique": ["software", "ecu", "camera", "sensor", "wiring", "electrical"],
}
DTC_BY_SYSTEM = {
    "Airbag": "B0001-B0FFF", "ABS/ESP": "C0035 / C1095",
    "Boîte de vitesses": "P0700-P07FF", "Moteur": "P0100-P1699",
    "Batterie haute tension": "P0A80 / P1A00", "Charge DC/AC": "P0D01 / U0111",
    "Carburant": "P0087 / P0230", "Freins": "C1214 / P0562",
    "Direction": "C1511 / U0126", "Ceintures": "B1342",
    "Électronique": "U0100-U0299",
}

def detect_energy(t):
    t = t.lower()
    for e, kws in ENERGY_KW.items():
        if any(k in t for k in kws): return e
    return "Essence"

def detect_system(t):
    t = t.lower()
    for s, kws in SYSTEM_KW.items():
        if any(k in t for k in kws): return s
    return "Moteur"

print("=== NHTSA ===")
data = get_json("https://api.nhtsa.gov/products/vehicle/makes?issueType=r") or {}
makes = [m["make"] for m in data.get("results", [])]
print(f"{len(makes)} marques")

for make in makes:
    if len(recalls) >= MAX_FICHES: break
    mdata = get_json(f"https://api.nhtsa.gov/products/vehicle/models?issueType=r&make={urllib.parse.quote(make)}") or {}
    models = [m["model"] for m in mdata.get("results", [])]
    print(f"--- {make} ({len(models)} modèles) ---")
    for model in models:
        if len(recalls) >= MAX_FICHES: break
        rdata = get_json(f"https://api.nhtsa.gov/recalls/recallsByVehicle?make={urllib.parse.quote(make)}&model={urllib.parse.quote(model)}&modelYear=9999")
        time.sleep(0.15)
        if not rdata: continue
        for r in rdata.get("results", []):
            desc = r.get("summary", "")
            comp = r.get("component", "")
            text = desc + " " + comp
            add(make, model, r.get("modelYear", ""),
                detect_energy(text), detect_system(text),
                r.get("nhtsaCampaignNumber", ""), desc,
                DTC_BY_SYSTEM.get(detect_system(text), ""), "NHTSA")
    print(f"Total: {len(recalls)}")

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(recalls, f, ensure_ascii=False, indent=1)
print(f"TERMINÉ : {len(recalls)} fiches dans {OUTPUT}")
