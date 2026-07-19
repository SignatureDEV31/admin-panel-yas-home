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
  const trimmed = name.trim().toLowerCase();
  
  const cityMap: Record<string, string> = {
    "alger": "Algiers",
    "algiers": "Algiers",
    "el djazair": "Algiers",
    "الجزائر": "Algiers",
    
    "oran": "Oran",
    "wahrane": "Oran",
    "وهران": "Oran",
    
    "constantine": "Constantine",
    "qacentina": "Constantine",
    "قسنطينة": "Constantine",
    
    "blida": "Blida",
    "البليدة": "Blida",
    
    "annaba": "Annaba",
    "عنابة": "Annaba",
    
    "setif": "Sétif",
    "sétif": "Sétif",
    "سطيف": "Sétif",
    
    "tizi ouzou": "Tizi Ouzou",
    "tizi-ouzou": "Tizi Ouzou",
    "تيزي وزو": "Tizi Ouzou",
    
    "bejaia": "Béjaïa",
    "béjaïa": "Béjaïa",
    "bgayet": "Béjaïa",
    "بجاية": "Béjaïa",
    
    "batna": "Batna",
    "باتنة": "Batna",
    
    "tlemcen": "Tlemcen",
    "تلمسان": "Tlemcen"
  };

  if (cityMap[trimmed]) {
    return cityMap[trimmed];
  }

  return name
    .trim()
    .split(/[\s-_]+/)
    .map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");
};
