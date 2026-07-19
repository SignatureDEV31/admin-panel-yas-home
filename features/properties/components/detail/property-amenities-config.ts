import {
  GraduationCap,
  HeartPulse,
  Palmtree,
  Bus,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";
import { AmenityItemConfig } from "./property-amenities-group";

export interface AmenitySectionConfig {
  title: string;
  icon: LucideIcon;
  gridCols?: string;
  items: AmenityItemConfig[];
}

export const AMENITIES_SECTIONS: AmenitySectionConfig[] = [
  {
    title: "Education Nearby",
    icon: GraduationCap,
    gridCols: "grid-cols-2 sm:grid-cols-3",
    items: [
      { key: "educationMaternal", label: "Maternelle" },
      { key: "educationPrimere", label: "École Primaire" },
      { key: "educationCollege", label: "Collège" },
      { key: "educationLycee", label: "Lycée" },
      { key: "educationUniversite", label: "Université" },
      { key: "educationEspaceDeLoisir", label: "Espace de Loisir" },
    ],
  },
  {
    title: "Medical Facilities",
    icon: HeartPulse,
    gridCols: "grid-cols-2 sm:grid-cols-4",
    items: [
      { key: "medicalsHopital", label: "Hôpital" },
      { key: "medicalsPharmacie", label: "Pharmacie" },
      { key: "medicalsClinique", label: "Clinique" },
      { key: "medicalsLaboratoire", label: "Laboratoire" },
    ],
  },
  {
    title: "Leisure & Recreation",
    icon: Palmtree,
    gridCols: "grid-cols-2 sm:grid-cols-3",
    items: [
      { key: "loisirParc", label: "Parc" },
      { key: "loisirGym", label: "Salle de Gym" },
      { key: "loisirBibliotheque", label: "Bibliothèque" },
      { key: "loisirTheatre", label: "Théâtre" },
      { key: "loisirTerrains", label: "Terrains de Sport" },
      { key: "loisirMall", label: "Mall / Centre Co" },
    ],
  },
  {
    title: "Transport Nearby",
    icon: Bus,
    gridCols: "grid-cols-2 sm:grid-cols-4",
    items: [
      { key: "transportBus", label: "Bus" },
      { key: "transportTrameway", label: "Tramway" },
      { key: "transportMetro", label: "Métro" },
      { key: "transportTrain", label: "Train" },
    ],
  },
  {
    title: "Internal & Building Features",
    icon: ShieldCheck,
    gridCols: "grid-cols-2 sm:grid-cols-3",
    items: [
      { key: "internParking", label: "Parking" },
      { key: "internGarageIndividuel", label: "Garage Individuel" },
      { key: "internParkingCollectif", label: "Parking Collectif" },
      { key: "internJardin", label: "Jardin" },
      { key: "internPiscine", label: "Piscine" },
      { key: "internLoisir", label: "Espace Loisir" },
      { key: "internSafe", label: "Coffre-fort / Safe" },
      { key: "internCamera", label: "Caméras de Surveillance" },
      { key: "internPolice", label: "Poste de Police / Sécurité" },
      { key: "internInfirmerie", label: "Infirmerie" },
      { key: "internAscenseurs", label: "Ascenseurs" },
      { key: "internGym", label: "Gym Interne" },
    ],
  },
];
