import { urlNode } from "../../utils/constants";

export async function getTurnosService() {
  // const token = localStorage.getItem("token");
  const response = await fetch(`${urlNode}/turnos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de turnos");
  }

  const data = await response.json();
  var turnos = [];
  Object.values(data).forEach((turno) => {
    const iso_fin = turno.fecha_fin;
    const iso_ini = turno.fecha_ini;
    const ymd_fin = iso_fin.slice(0, 10);
    const ymd_ini = iso_ini.slice(0, 10);
    var turnoAux = {
      coef_aguin: parseFloat(parseFloat(turno.coef_aguin)),
      coef_fest_lab: parseFloat(turno.coef_fest_lab),
      coef_fest_nolab: parseFloat(turno.coef_fest_nolab),
      coef_prim_dom: parseFloat(turno.coef_prim_dom),
      coef_vac: parseFloat(turno.coef_vac),
      fecha_fin: ymd_fin,
      fecha_ini: ymd_ini,
      hrs_turno: parseFloat(turno.hrs_turno),
      id_turno: parseInt(turno.id_turno),
      pago_fest_lab: parseFloat(turno.pago_fest_lab),
      pago_fest_nolab: parseFloat(turno.pago_fest_nolab),
      pago_hrs_ext: parseFloat(turno.pago_hrs_ext),
      pago_prima_dom: parseFloat(turno.pago_prima_dom),
      salario_base: parseFloat(turno.salario_base),
      turno: turno.turno,
    };
    turnos.push(turnoAux);
  });
  return turnos;
}
