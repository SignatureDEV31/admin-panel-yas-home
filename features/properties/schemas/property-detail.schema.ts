import { z } from "zod";

export const propertyDetailSchema = z.object({
  // Basic Specifications & Attributes
  propertyName: z.string().min(1, "Property Name is required"),
  propertyType: z.enum(["VENTE", "LOCATION"]),
  category: z.string().optional(),
  price: z.string().or(z.number()).optional(),
  surface: z.string().or(z.number()).optional(),
  propertyEtage: z.string().or(z.number()).optional(),
  beds: z.string().or(z.number()).optional(),

  // Location & Coordinates
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  latitude: z.string().or(z.number()).optional(),
  longitude: z.string().or(z.number()).optional(),

  // Description
  description: z.string().optional(),

  // Amenities Flags
  educationMaternal: z.boolean().optional(),
  educationPrimere: z.boolean().optional(),
  educationCollege: z.boolean().optional(),
  educationLycee: z.boolean().optional(),
  educationUniversite: z.boolean().optional(),
  educationEspaceDeLoisir: z.boolean().optional(),

  medicalsHopital: z.boolean().optional(),
  medicalsPharmacie: z.boolean().optional(),
  medicalsClinique: z.boolean().optional(),
  medicalsLaboratoire: z.boolean().optional(),

  loisirParc: z.boolean().optional(),
  loisirGym: z.boolean().optional(),
  loisirBibliotheque: z.boolean().optional(),
  loisirTheatre: z.boolean().optional(),
  loisirTerrains: z.boolean().optional(),
  loisirMall: z.boolean().optional(),

  transportBus: z.boolean().optional(),
  transportTrameway: z.boolean().optional(),
  transportMetro: z.boolean().optional(),
  transportTrain: z.boolean().optional(),

  internParking: z.boolean().optional(),
  internGarageIndividuel: z.boolean().optional(),
  internParkingCollectif: z.boolean().optional(),
  internJardin: z.boolean().optional(),
  internPiscine: z.boolean().optional(),
  internLoisir: z.boolean().optional(),
  internSafe: z.boolean().optional(),
  internCamera: z.boolean().optional(),
  internPolice: z.boolean().optional(),
  internInfirmerie: z.boolean().optional(),
  internAscenseurs: z.boolean().optional(),
  internGym: z.boolean().optional(),
});

export type PropertyDetailFormData = z.infer<typeof propertyDetailSchema>;
