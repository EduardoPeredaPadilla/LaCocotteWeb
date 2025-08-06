import { useState } from "react";
import {
  getPagosServiceByUser,
  getRegDiarioPersByUser,
  registrarPago,
} from "../services/GestPagosService/gestPagosService";

const initialPersState = {
  user_name: "",
  user_alias: "",
  year: 0,
  periodo: "",
  totalDias: 0,
  totFestLab: 0,
  totFestNoLab: 0,
  totalPagoSalarios: 0,
  totalPagoHrsExt: 0,
  totalPagoPrimDom: 0,
  totalPagoFestLab: 0,
  totalPagoFestNoLab: 0,
  pagoTotal: 0,
  observs: "",
  regsDiarios: [],
};

const getCurrentYearMonth = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // 1-12
    period: null,
  };
};

const useGestPagos = () => {
  const [periodoToGest, setPeriodoToGest] = useState(getCurrentYearMonth());
  const [submenuGestPagos, setSubmenuGestPagos] = useState({
    pagoInd: false,
    pagoGlobal: false,
  });

  const [listPersGPagos, setListPersGPagos] = useState(null);
  const [persSelectedGPagos, setPersSelectedGPagos] =
    useState(initialPersState);

  function getWeeksOfMonth(year, month) {
    const weeks = [];
    // Primer día del mes
    let date = new Date(year, month - 1, 1);
    // Buscar el primer lunes del mes
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() + 1);
    }
    // Generar semanas de lunes a domingo
    while (date.getMonth() === month - 1) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const startDay = start.getDate();
      const startMonth = start.toLocaleString("es-ES", { month: "long" });
      const endDay = end.getDate();
      const endMonth = end.toLocaleString("es-ES", { month: "long" });

      let label;
      if (startMonth === endMonth) {
        label = `Semana del ${startDay} al ${endDay} de ${startMonth} del ${year}`;
      } else {
        label = `Semana del ${startDay} de ${startMonth} al ${endDay} de ${endMonth} del ${year}`;
      }

      weeks.push(label);
      date.setDate(date.getDate() + 7);
    }
    return weeks;
  }

  function parsePeriodoToDates(periodo, year) {
    // Ejemplo: "Semana del 28 de julio al 3 de agosto" o "Semana del 21 al 27 de julio"
    const regex = /Semana del (\d{1,2}) de (\w+)(?: al (\d{1,2}) de (\w+))?/i;
    const match = periodo.match(regex);
    if (!match) return null;
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const diaInicio = parseInt(match[1], 10);
    const mesInicio = meses.indexOf(match[2].toLowerCase());
    const diaFin = match[3] ? parseInt(match[3], 10) : diaInicio + 6;
    const mesFin = match[4] ? meses.indexOf(match[4].toLowerCase()) : mesInicio;

    const fecha_inicio = new Date(year, mesInicio, diaInicio);
    const fecha_fin = new Date(year, mesFin, diaFin);

    // Formato YYYY-MM-DD
    const pad = (n) => n.toString().padStart(2, "0");
    return {
      fecha_inicio: `${fecha_inicio.getFullYear()}-${pad(
        fecha_inicio.getMonth() + 1
      )}-${pad(fecha_inicio.getDate())}`,
      fecha_fin: `${fecha_fin.getFullYear()}-${pad(
        fecha_fin.getMonth() + 1
      )}-${pad(fecha_fin.getDate())}`,
    };
  }

  async function fetchRegDiarioPersByUser(user_alias, periodo, year) {
    const fechas = parsePeriodoToDates(periodo, year);
    if (!fechas) return [];
    return await getRegDiarioPersByUser(
      user_alias,
      fechas.fecha_inicio,
      fechas.fecha_fin
    );
  }

  async function handlerRegitrarPago() {
    console.log("persSelectedGPagos ", persSelectedGPagos);
    try {
      const pagoData = {
        id_user: persSelectedGPagos.id_user,
        fecha: new Date().toISOString().slice(0, 10), // o la fecha que corresponda
        nombre: persSelectedGPagos.user_name,
        periodo: persSelectedGPagos.periodo,
        total_dias: persSelectedGPagos.totalDias,
        tot_fest_lab: persSelectedGPagos.totFestLab,
        tot_fest_noLab: persSelectedGPagos.totFestNoLab,
        total_pago_salarios: persSelectedGPagos.totalPagoSalarios,
        total_pago_hrsext: persSelectedGPagos.totalPagoHrsExt,
        total_pago_primdom: persSelectedGPagos.totalPagoPrimDom,
        total_pago_fest_lab: persSelectedGPagos.totalPagoFestLab,
        total_pago_fest_nolab: persSelectedGPagos.totalPagoFestNoLab,
        pago_total: persSelectedGPagos.pagoTotal,
        observs: persSelectedGPagos.observs || "",
      };
      console.log("pagoData ", pagoData);
      setPersSelectedGPagos({
        ...persSelectedGPagos,
        pago_registrado: true,
      });
      const response = await registrarPago(pagoData);

      console.log("Pago registrado exitosamente: ", response);
    } catch (error) {
      console.log("error ", error);
    }
  }

  async function getRegPagosByUserHook(user_alias, periodo, year) {
    const fechas = parsePeriodoToDates(periodo, year);
    if (!fechas) return [];
    return await getPagosServiceByUser(user_alias, periodo);
  }

  return {
    periodoToGest,
    setPeriodoToGest,
    handlerRegitrarPago,
    getWeeksOfMonth,
    submenuGestPagos,
    setSubmenuGestPagos,
    listPersGPagos,
    setListPersGPagos,
    persSelectedGPagos,
    initialPersState,
    setPersSelectedGPagos,
    fetchRegDiarioPersByUser,
    getRegPagosByUserHook,
  };
};

export default useGestPagos;
