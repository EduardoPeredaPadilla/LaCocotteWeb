import { urlNode } from "../../utils/constants";

export async function registrarRegDiarioPers(data) {
  const response = await fetch(`${urlNode}/reg-diario-pers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al registrar personal");
  return response.json();
}

export async function registrarResumenDiario(data) {
  const response = await fetch(`${urlNode}/resumen-diario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Si usas JWT, agrega el Authorization aquí
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al registrar el resumen diario");
  }
  return response.json();
}

export async function getResumenesDiariosService() {
  // const token = localStorage.getItem("token");
  const response = await fetch(`${urlNode}/resumen-diario`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de resumen-diario");
  }

  const data = await response.json();
  var resList = [];
  Object.values(data).forEach((resumen) => {
    resList.push(resumen);
  });
  return resList;
}

export async function getRegDiarioPersByIdRd(id_rd) {
  const response = await fetch(`${urlNode}/reg-diario-pers/${id_rd}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok)
    throw new Error("No se pudo obtener el personal del resumen");
  return response.json();
}
