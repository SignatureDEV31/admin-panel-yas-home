import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { SignUpFormData, SignUpPayload } from "@/features/auth/schemas/sign-up.schema";

// sing up function **
export const handleSignUp = async (
  data: SignUpFormData | SignUpPayload,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  refreshUser?: () => Promise<void>,
): Promise<void> => {
  try {
    setLoading(true);

    const { rememberMe, confirmPassword, ...payload } = data as SignUpFormData;

    await api.post("/authentication/sign-up", payload);

    toast.success("Compte créé avec succès", {
      id: "toast-create-account",
    });
    if (refreshUser) {
      await refreshUser();
    }
  } catch (error: any) {
    console.error("Error creating account handleSignUp: ", error);

    const status = error?.response?.status;
    const responseMessage = error?.response?.data?.message;

    let displayMessage = "Erreur lors de la création du compte";
    if (status === 409) {
      displayMessage = "Un compte avec cette adresse email ou ce numéro de téléphone existe déjà.";
    } else if (typeof responseMessage === "string") {
      displayMessage = responseMessage;
    } else if (Array.isArray(responseMessage)) {
      displayMessage = responseMessage.join(", ");
    }

    toast.error(displayMessage, {
      id: "toast-create-account-error",
    });
  } finally {
    setLoading(false);
  }
};
