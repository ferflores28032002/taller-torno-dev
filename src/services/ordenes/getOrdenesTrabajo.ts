import axiosInstance from "src/api/axiosInstance";

export const getOrdenesTrabajo = async () => {
  try {
    const response = await axiosInstance.get("OrdenTrabajo");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las órdenes de trabajo:", error);
    throw error;
  }
};

export const createOrdenTrabajo = async (data) => {
    try {
      const response = await axiosInstance.post("OrdenTrabajo", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear la orden de trabajo:", error);
      throw error;
    }
  };
  

export const editOrdenTrabajo = async (id, data) => {
  try {
    const response = await axiosInstance.put(`OrdenTrabajo/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al editar la orden de trabajo:", error);
    throw error;
  }
};

export const deleteOrdenTrabajo = async (id) => {
  try {
    const response = await axiosInstance.delete(`OrdenTrabajo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la orden de trabajo:", error);
    throw error;
  }
};

export const getOrdenTrabajoDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`OrdenTrabajo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los detalles de la orden de trabajo:", error);
    throw error;
  }
};
