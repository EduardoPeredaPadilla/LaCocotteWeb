import { urlNode } from "../../utils/constants";

export async function getRegDiarioPersByUser(
  user_alias,
  fecha_inicio,
  fecha_fin
) {
  const res = await fetch(
    `${urlNode}/reg-diario-pers-by-user?user_alias=${encodeURIComponent(
      user_alias
    )}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
  );
  if (!res.ok) throw new Error("Error al obtener registros");
  return await res.json();
}

export async function registrarPago(pagoData) {
  const res = await fetch(`${urlNode}/pagos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pagoData),
  });
  if (!res.ok) throw new Error("Error al registrar el pago");
  return await res.json();
}

export async function getPagosService() {
  // const token = localStorage.getItem("token");
  const response = await fetch(`${urlNode}/pagos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de pagos");
  }

  const data = await response.json();
  var pagos = [];
  Object.values(data).forEach((pago) => {
    const iso = pago.fecha;
    const ymd = iso.slice(0, 10);
    var pagoAux = {
      id_user: pago.id_user,
      fecha: ymd,
      nombre: pago.nombre,
      periodo: pago.periodo,
      total_dias: pago.total_dias,
      tot_fest_lab: pago.tot_fest_lab,
      tot_fest_noLab: pago.tot_fest_noLab,
      total_pago_salarios: pago.total_pago_salarios,
      total_pago_hrsext: pago.total_pago_hrsext,
      total_pago_primdom: pago.total_pago_primdom,
      total_pago_fest_lab: pago.total_pago_fest_lab,
      total_pago_fest_nolab: pago.total_pago_fest_nolab,
      pago_total: pago.pago_total,
    };
    pagos.push(pagoAux);
  });
  return pagos;
}

export async function getPagosServiceByUser(user_alias, periodo) {
  // const token = localStorage.getItem("token");
  const response = await fetch(
    `${urlNode}/pagos-by-user-period?user_alias=${encodeURIComponent(
      user_alias
    )}&periodo=${periodo}`
  );
  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de pagos");
  }

  const data = await response.json();
  var pagos = [];
  Object.values(data).forEach((pago) => {
    const iso = pago.fecha;
    const ymd = iso.slice(0, 10);
    var pagoAux = {
      id_user: pago.id_user,
      fecha: ymd,
      nombre: pago.nombre,
      periodo: pago.periodo,
      total_dias: pago.total_dias,
      tot_fest_lab: pago.tot_fest_lab,
      tot_fest_noLab: pago.tot_fest_noLab,
      total_pago_salarios: pago.total_pago_salarios,
      total_pago_hrsext: pago.total_pago_hrsext,
      total_pago_primdom: pago.total_pago_primdom,
      total_pago_fest_lab: pago.total_pago_fest_lab,
      total_pago_fest_nolab: pago.total_pago_fest_nolab,
      pago_total: pago.pago_total,
      observs: pago.observs,
      pago_registrado: true,
      // estado: pago.estado,
    };
    pagos.push(pagoAux);
  });
  return pagos;
}
