// scripts/sync-crm.mjs
// Legge tutti i .xlsx in data/crm/ e produce data/clients.json unificato.
// Uso:  node scripts/sync-crm.mjs
//
// Schemi supportati:
//  - CRM_Master / Nuovi_Prospect_* → Pet stores, breeders, daycare
//  - Distributori_Target           → Distributori
//  - Italian_Stores_Target         → Italian specialty markets

import XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";

const CRM_DIR = path.join(process.cwd(), "data", "crm");
const OUT_FILE = path.join(process.cwd(), "data", "clients.json");

// ============================================================================
// Lookup geografico: città USA → [lon, lat]
// Copre NJ / NY / PA / CT / MD / DE / VA / WV (tutte le città nei file)
// Coordinate approssimate centro città. Precisione sufficiente per display mappa.
// ============================================================================
const CITY_COORDS = {
  // NJ — Hudson County
  "hoboken": [-74.0324, 40.7439],
  "jersey city": [-74.0431, 40.7178],
  "union city": [-74.0260, 40.7795],
  "bayonne": [-74.1143, 40.6687],
  "weehawken": [-74.0234, 40.7684],
  // NJ — Essex County
  "newark": [-74.1724, 40.7357],
  "montclair": [-74.2090, 40.8176],
  "livingston": [-74.3149, 40.7959],
  "bloomfield": [-74.1860, 40.8068],
  "west orange": [-74.2391, 40.7987],
  "maplewood": [-74.2735, 40.7312],
  "millburn": [-74.3038, 40.7256],
  "short hills": [-74.3229, 40.7487],
  // NJ — Bergen County
  "hackensack": [-74.0435, 40.8859],
  "paramus": [-74.0754, 40.9446],
  "teaneck": [-74.0165, 40.8976],
  "fort lee": [-73.9701, 40.8509],
  "englewood": [-73.9726, 40.8928],
  "fair lawn": [-74.1171, 40.9404],
  // NJ — Union County
  "elizabeth": [-74.2107, 40.6640],
  "garwood": [-74.3232, 40.6515],
  "westfield": [-74.3474, 40.6590],
  "summit": [-74.3574, 40.7155],
  "cranford": [-74.2996, 40.6582],
  "linden": [-74.2446, 40.6220],
  // NJ — Passaic County
  "clifton": [-74.1638, 40.8584],
  "paterson": [-74.1724, 40.9168],
  "wayne": [-74.2766, 40.9254],
  "fairfield": [-74.3074, 40.8834],
  // NJ — Morris County
  "morristown": [-74.4810, 40.7968],
  "madison": [-74.4171, 40.7598],
  "denville": [-74.4818, 40.8912],
  // NJ — Middlesex County
  "edison": [-74.4121, 40.5187],
  "new brunswick": [-74.4518, 40.4862],
  "highland park": [-74.4268, 40.4959],
  "princeton": [-74.6672, 40.3573],
  // NJ — Monmouth County
  "shrewsbury": [-74.0607, 40.3293],
  "red bank": [-74.0643, 40.3471],
  "middletown": [-74.0946, 40.3967],
  "rumson": [-74.0010, 40.3729],
  // NJ — Altro
  "lyndhurst": [-74.1246, 40.8121],
  "north arlington": [-74.1329, 40.7884],
  "ridgewood": [-74.1116, 40.9793],

  // NY — Manhattan
  "new york": [-73.9857, 40.7580],
  "manhattan": [-73.9712, 40.7831],
  "new york (little italy)": [-73.9969, 40.7194],
  "new york (west village)": [-74.0066, 40.7335],

  // NY — Brooklyn
  "brooklyn": [-73.9442, 40.6782],
  "bay ridge (brooklyn)": [-74.0261, 40.6342],
  "williamsburg (brooklyn)": [-73.9576, 40.7081],
  "park slope (brooklyn)": [-73.9760, 40.6710],
  "bensonhurst (brooklyn)": [-74.0005, 40.6042],

  // NY — Bronx / Queens / Staten Island
  "bronx": [-73.8648, 40.8448],
  "queens": [-73.7949, 40.7282],
  "astoria (queens)": [-73.9218, 40.7720],
  "long island city": [-73.9497, 40.7447],
  "staten island": [-74.1502, 40.5795],

  // NY — Westchester County
  "scarsdale": [-73.7990, 40.9891],
  "rye": [-73.6840, 40.9815],
  "larchmont": [-73.7576, 40.9337],
  "white plains": [-73.7629, 41.0340],
  "mamaroneck": [-73.7326, 40.9487],
  "new rochelle": [-73.7823, 40.9115],
  "yonkers": [-73.8987, 40.9312],
  "bronxville": [-73.8337, 40.9390],
  "mount kisco": [-73.7282, 41.2043],
  "chappaqua": [-73.7637, 41.1617],

  // NY — Long Island (Nassau / Suffolk)
  "great neck": [-73.7290, 40.8009],
  "garden city": [-73.6360, 40.7268],
  "huntington": [-73.4282, 40.8687],

  // NY — Altro
  "area ny": [-73.9857, 40.7580],

  // CT
  "greenwich": [-73.6241, 41.0262],
  "stamford": [-73.5387, 41.0534],
  "westport": [-73.3579, 41.1414],
  "new canaan": [-73.4937, 41.1470],
  "darien": [-73.4698, 41.0787],
  "fairfield ct": [-73.2540, 41.1408],

  // PA
  "philadelphia": [-75.1652, 39.9526],
  "lebanon": [-76.4114, 40.3409],
  "pittsburgh": [-79.9959, 40.4406],

  // MD / DE / VA / WV (distributori)
  "edgewood": [-76.2969, 39.4187],
  "baltimore": [-76.6122, 39.2904],
  "wilmington": [-75.5277, 39.7391],
  "richmond": [-77.4360, 37.5407],
};

// Fallback per stato se città non trovata
const STATE_FALLBACK = {
  NJ: [-74.4057, 40.0583],
  NY: [-74.2179, 43.2994],
  PA: [-77.1945, 41.2033],
  CT: [-72.7554, 41.6032],
  MD: [-76.6413, 39.0458],
  DE: [-75.5277, 39.0000],
  VA: [-78.6569, 37.4316],
  WV: [-80.4549, 38.5976],
};

function geocode(city, state) {
  const key = (city || "").toLowerCase().trim();
  if (CITY_COORDS[key]) return CITY_COORDS[key];
  // Prova rimuovendo parentesi: "Bay Ridge (Brooklyn)" → "bay ridge"
  const stripped = key.replace(/\s*\(.*\)\s*/g, "").trim();
  if (CITY_COORDS[stripped]) return CITY_COORDS[stripped];
  // Fallback su centroide stato
  if (STATE_FALLBACK[state]) return STATE_FALLBACK[state];
  // Ultimo fallback: centro NJ
  return STATE_FALLBACK.NJ;
}

// ============================================================================
// Normalizzazione status pipeline → 4 valori standard
// lead | contattato | interessato | confermato
// ============================================================================
function normalizeStatus(raw) {
  const s = String(raw || "").toLowerCase();
  if (!s || s === "nan") return "lead";
  if (s.includes("confermato") || s.includes("firmato") || s.includes("ordine")) return "confermato";
  if (s.includes("interessato") || s.includes("risposto") || s.includes("campione")) return "interessato";
  if (s.includes("contattato") || s.includes("inviato") || s.includes("chiamato")) return "contattato";
  return "lead"; // "Da contattare", "Nuovo target", "Nuovo prospect" → lead
}

// ============================================================================
// Normalizzazione priority
// ============================================================================
function normalizePriority(raw) {
  const s = String(raw || "").toUpperCase();
  if (s.includes("UNICUM")) return "UNICUM";
  if (s.includes("HOT") || s.includes("P1") || s.includes("TOP15")) return "HOT";
  if (s.includes("WARM") || s.includes("P2")) return "WARM";
  if (s.includes("COLD") || s.includes("P3")) return "COLD";
  return "WARM";
}

// ============================================================================
// Normalizzazione tipo
// ============================================================================
function normalizeType(raw, source) {
  const s = String(raw || "").toLowerCase();
  if (source === "distributor") return "distributor";
  if (source === "italian_market") return "italian_market";
  if (s.includes("breeder") || s.includes("allevator")) return "breeder";
  if (s.includes("daycare") || s.includes("kennel") || s.includes("canile")) return "daycare";
  if (s.includes("veterinar")) return "veterinary";
  if (s.includes("italian") || s.includes("deli") || s.includes("specialty market")) return "italian_market";
  return "pet_store";
}

function cleanField(v) {
  if (v == null) return "";
  const s = String(v).trim();
  if (s === "NON_TROVATO" || s === "nan" || s.toLowerCase() === "nan") return "";
  return s;
}

// ============================================================================
// Parser per ogni tipo di file
// ============================================================================
function parsePetStoreRow(row, source) {
  const city = cleanField(row["Citta"]);
  const state = cleanField(row["Stato"]);
  return {
    id: `${source}-${row["ID"]}`,
    source,
    name: cleanField(row["Nome_Negozio"]),
    owner: cleanField(row["Owner_Nome"]),
    type: normalizeType(row["Tipo"], source),
    city,
    state,
    zone: cleanField(row["Zona"]),
    coordinates: geocode(city, state),
    priority: normalizePriority(row["Priorità"]),
    status: normalizeStatus(row["Stato_Papeline"] || row["Stato_Pipeline"]),
    phone: cleanField(row["Telefono"]),
    email: cleanField(row["Email"]),
    website: cleanField(row["Website"]),
    instagram: cleanField(row["Instagram"]),
    brands_sold: cleanField(row["Brand_Gia_Venduti"]),
    specialization: cleanField(row["Specializzazione"]),
    hook: cleanField(row["Hook_Personalizzato"]),
    hook_en: cleanField(row["Hook_EN"]),
    next_step: cleanField(row["Prossimo_Step"]),
    review_google: cleanField(row["Review_Google"]),
    score: cleanField(row["Score_Qualifica"]),
  };
}

function parseDistributorRow(row) {
  const city = cleanField(row["HQ_Citta"]);
  const state = cleanField(row["HQ_Stato"]);
  return {
    id: `distributor-${row["ID"]}`,
    source: "distributor",
    name: cleanField(row["Nome_Azienda"]),
    owner: cleanField(row["VP_Sales_Responsabile"]),
    type: "distributor",
    city,
    state,
    zone: cleanField(row["Stati_Coperti"]),
    coordinates: geocode(city, state),
    priority: normalizePriority(row["Tier"]),
    status: normalizeStatus(row["Stato_Pipeline"]),
    phone: "",
    email: cleanField(row["Email_Commerciale"]),
    website: cleanField(row["Website"]),
    instagram: cleanField(row["LinkedIn_Azienda"]),
    brands_sold: cleanField(row["Brand_LineCard_Top10"]),
    specialization: cleanField(row["Tipo_Org"]),
    hook: cleanField(row["Fit_Per_Alleva_IT"]),
    hook_en: cleanField(row["Fit_Per_Alleva_EN"]),
    next_step: cleanField(row["Prossimo_Step"]),
    retailers_estimate: cleanField(row["Retailer_Stimati"]),
    seniority: cleanField(row["Anzianita"]),
  };
}

function parseItalianStoreRow(row) {
  const city = cleanField(row["Citta"]);
  const state = cleanField(row["Stato"]);
  return {
    id: `italian-${row["ID"]}`,
    source: "italian_market",
    name: cleanField(row["Nome_Store"]),
    owner: cleanField(row["Owner"]),
    type: "italian_market",
    city,
    state,
    zone: "",
    coordinates: geocode(city, state),
    priority: normalizePriority(row["Tier"]),
    status: normalizeStatus(row["Stato_Pipeline"]),
    phone: cleanField(row["Telefono"]),
    email: cleanField(row["Email"]),
    website: cleanField(row["Website"]),
    instagram: cleanField(row["Instagram"]),
    brands_sold: cleanField(row["Prodotti_Venduti"]),
    specialization: cleanField(row["Tipo"]),
    hook: cleanField(row["Hook_Personalizzato_IT"]),
    hook_en: cleanField(row["Hook_EN"]),
    next_step: cleanField(row["Prossimo_Step"]),
    italian_surname: cleanField(row["Cognome_Italiano"]),
    family_story: cleanField(row["Famiglia_Storia"]),
    seniority: cleanField(row["Anzianita"]),
  };
}

// ============================================================================
// Main
// ============================================================================
function readSheet(filePath) {
  const buf = fs.readFileSync(filePath);
  const wb = XLSX.read(buf, { type: "buffer" });
  const firstSheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
}

function detectSource(fileName) {
  const n = fileName.toLowerCase();
  if (n.includes("distributori")) return "distributor";
  if (n.includes("italian")) return "italian_market";
  if (n.includes("crm_master")) return "crm_master";
  if (n.includes("nuovi_prospect") || n.includes("scouting")) return "new_prospect";
  return "crm_master"; // default
}

function main() {
  if (!fs.existsSync(CRM_DIR)) {
    console.error(`ERRORE: cartella ${CRM_DIR} non esiste. Crea la cartella e metti dentro i file .xlsx.`);
    process.exit(1);
  }

  const files = fs.readdirSync(CRM_DIR).filter((f) => f.endsWith(".xlsx") && !f.startsWith("~$"));
  if (files.length === 0) {
    console.error(`ERRORE: nessun .xlsx in ${CRM_DIR}`);
    process.exit(1);
  }

  const allProspects = [];
  const bySource = {};

  for (const file of files) {
    const source = detectSource(file);
    const rows = readSheet(path.join(CRM_DIR, file));
    const parsed = rows.map((row) => {
      if (source === "distributor") return parseDistributorRow(row);
      if (source === "italian_market") return parseItalianStoreRow(row);
      return parsePetStoreRow(row, source);
    });
    // Filtra righe vuote (senza nome)
    const clean = parsed.filter((p) => p.name);
    allProspects.push(...clean);
    bySource[source] = (bySource[source] || 0) + clean.length;
    console.log(`  ✓ ${file}: ${clean.length} contatti (source: ${source})`);
  }

  // Calcolo funnel contatori
  const funnel = { lead: 0, contattato: 0, interessato: 0, confermato: 0 };
  allProspects.forEach((p) => {
    if (funnel[p.status] !== undefined) funnel[p.status]++;
  });

  // Contatori aggregati utili
  const byType = {};
  const byState = {};
  const byPriority = { UNICUM: 0, HOT: 0, WARM: 0, COLD: 0 };
  allProspects.forEach((p) => {
    byType[p.type] = (byType[p.type] || 0) + 1;
    if (p.state) byState[p.state] = (byState[p.state] || 0) + 1;
    if (byPriority[p.priority] !== undefined) byPriority[p.priority]++;
  });

  const output = {
    meta: {
      title: "Pipeline commerciale Diusapet USA",
      subtitle: `${allProspects.length} contatti reali · CRM Cowork · ultimo sync ${new Date().toISOString().slice(0, 10)}`,
      source: "Cowork CRM — pet stores, italian markets, distributors, breeders",
      goal_pre_container_orders: 5,
      total_prospects: allProspects.length,
      generated_at: new Date().toISOString(),
    },
    funnel,
    stats: {
      by_source: bySource,
      by_type: byType,
      by_state: byState,
      by_priority: byPriority,
    },
    map: {
      center_lon: -74.15,
      center_lat: 40.70,
      zoom: 48,
    },
    prospects: allProspects.sort((a, b) => {
      // Ordine: UNICUM > HOT > WARM > COLD, poi per nome
      const order = { UNICUM: 0, HOT: 1, WARM: 2, COLD: 3 };
      const d = (order[a.priority] ?? 99) - (order[b.priority] ?? 99);
      if (d !== 0) return d;
      return a.name.localeCompare(b.name);
    }),
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`\n✓ Scritti ${allProspects.length} contatti in ${OUT_FILE}`);
  console.log(`\n  Funnel: ${JSON.stringify(funnel)}`);
  console.log(`  Per tipo: ${JSON.stringify(byType)}`);
  console.log(`  Per stato: ${JSON.stringify(byState)}`);
  console.log(`  Per priorità: ${JSON.stringify(byPriority)}`);
}

main();
