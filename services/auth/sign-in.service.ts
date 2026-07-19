import { api } from "@/lib/axios";
import { toast } from "sonner";
import { SignInFormData } from "../schemas/sign-in.schema";
import { AppDispatch } from "@/store/store";
import { setUser } from "@/store/user-slice";

export const handleSignIn = async (
  data: SignInFormData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: AppDispatch,
  refreshUser?: () => Promise<void>,
): Promise<void> => {
  try {
    setLoading(true);

    const { rememberMe, ...loginData } = data;
    const response = await api.post("/authentication/sign-in", loginData);

    const { accessToken, user } = response.data;

    // Store token
    localStorage.setItem("token", accessToken);

    // Set Authorization header
    api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;

    // Dispatch to Redux
    dispatch(setUser(user));

    toast.success("Connexion réussie", {
      id: "toast-sign-in",
    });
    if (refreshUser) {
      await refreshUser();
    }
  } catch (error) {
    console.error("Error signing in handleSignIn: ", error);

    toast.error("Email ou mot de passe incorrect", {
      id: "toast-sign-in-error",
    });
  } finally {
    setLoading(false);
  }
};
