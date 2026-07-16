import { api } from "@/lib/axios";
import { AdminStats } from "./type";


/**
 * Fetches the admin dashboard statistics from GET /admin/stats.
 * Reuses the configured axios api client, logs error details, and throws
 * for client error boundary/retry component consumption.
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await api.get<AdminStats>("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats in service:", error);
    throw error;
  }
}
