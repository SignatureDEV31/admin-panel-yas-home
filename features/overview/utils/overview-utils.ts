export const CHART_COLORS = {
  yashomePink: "#FF014F",
  main: "#151533",
  indigo: "#6366f1",
  emerald: "#10b981",
  violet: "#8b5cf6",
  blue: "#3b82f6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#64748b"
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  } catch {
    return "-";
  }
};

export const getInitials = (name: string | null): string => {
  if (!name || name.trim() === "") return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || "")
    .join("");
};

export const normalizeCityName = (name: string): string => {
  if (!name || name.trim() === "") return "Unknown";

  const raw = name.trim();
  
  // 1. Accent-insensitive lookup key
  const cleaned = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents (e.g. ï -> i, é -> e)
    .replace(/[-_]+/g, " ")          // replace hyphens/underscores with spaces
    .replace(/\s+/g, " ")            // collapse extra spaces
    .trim();

  // 2. Comprehensive Arabic / French / English City & Commune Normalization Mapping
  const cityMap: Record<string, string> = {
    // Aïn El Turk
    "ain el turk": "Aïn El Turk",
    "ain turk": "Aïn El Turk",
    "ain el-turk": "Aïn El Turk",
    "عين الترك": "Aïn El Turk",
    "عين ترك": "Aïn El Turk",

    // Bordj El Kiffan
    "bordj el kiffan": "Bordj El Kiffan",
    "bordj el kiffane": "Bordj El Kiffan",
    "bordj kiffan": "Bordj El Kiffan",
    "برج الكيفان": "Bordj El Kiffan",
    "برج كيفان": "Bordj El Kiffan",

    // Bir El Djir
    "bir el djir": "Bir El Djir",
    "bir el jir": "Bir El Djir",
    "bir djir": "Bir El Djir",
    "bir jir": "Bir El Djir",
    "bir-el-djir": "Bir El Djir",
    "bir-el-jir": "Bir El Djir",
    "bireldjir": "Bir El Djir",
    "bireljir": "Bir El Djir",
    "بير الجير": "Bir El Djir",
    "بير جير": "Bir El Djir",
    "بئر الجير": "Bir El Djir",
    "بئر جير": "Bir El Djir",

    // Mazagran
    "mazagran": "Mazagran",
    "mazaghran": "Mazagran",
    "مزغران": "Mazagran",

    // Oran
    "oran": "Oran",
    "wahrane": "Oran",
    "wahran": "Oran",
    "وهران": "Oran",

    // Algiers
    "alger": "Algiers",
    "algiers": "Algiers",
    "el djazair": "Algiers",
    "الجزائر": "Algiers",

    // Constantine
    "constantine": "Constantine",
    "qacentina": "Constantine",
    "qasentina": "Constantine",
    "قسنطينة": "Constantine",

    // Blida
    "blida": "Blida",
    "البليدة": "Blida",
    "بليدة": "Blida",

    // Annaba
    "annaba": "Annaba",
    "عنابة": "Annaba",

    // Sétif
    "setif": "Sétif",
    "سطيف": "Sétif",

    // Tizi Ouzou
    "tizi ouzou": "Tizi Ouzou",
    "تيزي وزو": "Tizi Ouzou",

    // Béjaïa
    "bejaia": "Béjaïa",
    "bgayet": "Béjaïa",
    "بجاية": "Béjaïa",

    // Batna
    "batna": "Batna",
    "باتنة": "Batna",

    // Tlemcen
    "tlemcen": "Tlemcen",
    "تلمسان": "Tlemcen",

    // Bousfer
    "bousfer": "Bousfer",
    "بوسفر": "Bousfer",

    // Es Senia
    "es senia": "Es Senia",
    "senia": "Es Senia",
    "السانية": "Es Senia",
    "سانية": "Es Senia",

    // Arzew
    "arzew": "Arzew",
    "أرزيو": "Arzew",
    "ارزيو": "Arzew",

    // Chéraga
    "cheraga": "Chéraga",
    "الشراقة": "Chéraga",
    "شراقة": "Chéraga",

    // Zéralda
    "zeralda": "Zéralda",
    "زرالدة": "Zéralda",

    // Kouba
    "kouba": "Kouba",
    "القبة": "Kouba",
    "قبة": "Kouba",

    // Hydra
    "hydra": "Hydra",
    "حيدرة": "Hydra",

    // Ben Aknoun
    "ben aknoun": "Ben Aknoun",
    "بن عكنون": "Ben Aknoun",

    // El Biar
    "el biar": "El Biar",
    "الأبيار": "El Biar",
    "الابيار": "El Biar",

    // Sidi Bel Abbès
    "sidi bel abbes": "Sidi Bel Abbès",
    "سيدي بلعباس": "Sidi Bel Abbès",

    // Mostaganem
    "mostaganem": "Mostaganem",
    "مستغانم": "Mostaganem",

    // Chlef
    "chlef": "Chlef",
    "الشلف": "Chlef",
    "شلف": "Chlef",

    // Biskra
    "biskra": "Biskra",
    "بسكرة": "Biskra",

    // Djelfa
    "djelfa": "Djelfa",
    "الجلفة": "Djelfa",

    // Médéa
    "medea": "Médéa",
    "المدية": "Médéa",

    // Skikda
    "skikda": "Skikda",
    "سكيكدة": "Skikda",

    // Tiaret
    "tiaret": "Tiaret",
    "تيارت": "Tiaret",

    // Ghardaïa
    "ghardaia": "Ghardaïa",
    "غرداية": "Ghardaïa",

    // Boumerdès
    "boumerdes": "Boumerdès",
    "بومرداس": "Boumerdès",

    // Tipaza
    "tipaza": "Tipaza",
    "tipasa": "Tipaza",
    "تيبازة": "Tipaza",

    // Bordj El Bahri
    "bordj el bahri": "Bordj El Bahri",
    "برج البحري": "Bordj El Bahri",
  };

  // Direct match on cleaned key or original raw
  if (cityMap[cleaned]) return cityMap[cleaned];
  if (cityMap[raw.toLowerCase()]) return cityMap[raw.toLowerCase()];

  // Fallback: title case word formatting
  return raw
    .split(/[\s-_]+/)
    .map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");
};
