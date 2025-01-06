import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Datos del usuario
      role: null, // Rol del usuario
      setUser: (userData) => set(userData),
      clearUser: () => set({ user: null, role: null }), // Para cerrar sesión
    }),
    {
      name: "auth-storage", // Nombre de la clave en localStorage
    }
  )
);

export default useAuthStore;
