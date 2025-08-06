import { urlNode } from "../../utils/constants";

export async function loginAuthService({ email, pass }) {
  const response = await fetch(`${urlNode}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pass }),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export async function getUsersListService() {
  // const token = localStorage.getItem("token");
  const response = await fetch(`${urlNode}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de usuarios");
  }

  const data = await response.json();
  var usersList = [];
  Object.values(data).forEach((user) => {
    var userAux = {
      ...user,
      activeDay: false,
      horaEntrada: "",
      horaSalida: "",
      hrsExt: 0,
      pagoTurno: 0,
      pagoHrsExtra: 0,
      pagoTotalDia: 0,
    };
    usersList.push(userAux);
  });
  return usersList;
}
