import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { SignUpFormData } from "@/features/auth/schemas/sign-up.schema";

// sing up function **
export const handleSignUp = async (
  data: SignUpFormData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  refreshUser?: () => Promise<void>,
): Promise<void> => {
  try {
    setLoading(true);

    await api.post("/authentication/sign-up", data);

    toast.success("Compte créé avec succès", {
      id: "toast-create-account",
    });
    if (refreshUser) {
      await refreshUser();
    }
  } catch (error) {
    console.error("Error creating account handleSignUp: ", error);

    toast.error("Erreur lors de la création du compte", {
      id: "toast-create-account-error",
    });
  } finally {
    setLoading(false);
  }
};
