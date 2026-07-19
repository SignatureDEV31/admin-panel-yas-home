import { api } from "@/lib/axios";
import { Amenity, CreateAmenityPayload } from "@/features/amenities/types/amenity";

/**
 * Fetches the complete list of amenities from GET /admin/get_amenities.
 * Uses the configured axios api client, logs error details, and throws
 * for client error boundary/retry component consumption.
 */
export async function getAmenities(): Promise<Amenity[]> {
  try {
    const response = await api.get<Amenity[]>("/admin/get_amenities");
    return response.data;
  } catch (error) {
    console.error("Error fetching amenities in service:", error);
    throw error;
  }
}

/**
 * Creates a new amenity using POST /admin/create_amenities.
 * Logs error details and throws for form handler error consumption.
 */
export async function createAmenity(payload: CreateAmenityPayload): Promise<Amenity> {
  try {
    const response = await api.post<Amenity>("/admin/create_amenities", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating amenity in service:", error);
    throw error;
  }
}
