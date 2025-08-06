import { useContext, useState, useEffect } from "react";
import { GestPagosContext } from "../../context/GestPagosContext/GestPagosContext";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { RegDiarioContext } from "../../context/RegDiarioContext/RegDiarioContext";
import { ConfigContext } from "../../context/ConfigContext/ConfigContext";

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const GestPagos = () => {
  const { listaPersonal } = useContext(AuthContext);
  const { resDiarioSelected } = useContext(RegDiarioContext);
  const { turnos } = useContext(ConfigContext);

  const {
    periodoToGest,
    setPeriodoToGest,
    getWeeksOfMonth,
    submenuGestPagos,
    setSubmenuGestPagos,
    listPersGPagos,

    // eslint-disable-next-line no-unused-vars
    initialPersState,
    handlerRegitrarPago,
    persSelectedGPagos,
    setPersSelectedGPagos,
    setListPersGPagos,
    fetchRegDiarioPersByUser,
    getRegPagosByUserHook,
  } = useContext(GestPagosContext);
  const [weeks, setWeeks] = useState([]);

  // Actualiza las semanas cuando cambian año o mes
  useEffect(() => {
    setWeeks(getWeeksOfMonth(periodoToGest.year, periodoToGest.month));
    setPeriodoToGest((prev) => ({ ...prev, period: null }));
    // eslint-disable-next-line
  }, [periodoToGest.year, periodoToGest.month]);

  // Maneja el cambio de año
  const handleYearChange = (e) => {
    setPeriodoToGest((prev) => ({
      ...prev,
      year: parseInt(e.target.value, 10),
      // month y period se mantienen
    }));
  };

  // Maneja el cambio de mes
  const handleMonthChange = (e) => {
    const monthIndex = meses.indexOf(e.target.value) + 1;
    setPeriodoToGest((prev) => ({
      ...prev,
      month: monthIndex,
      // period se resetea en el useEffect
    }));
  };

  // Maneja el cambio de periodo (semana)
  const handlePeriodChange = (e) => {
    setPeriodoToGest((prev) => ({
      ...prev,
      period: e.target.value,
    }));
  };

  const handlerSelectPersonal = async (e) => {
    const alias = e.target.value;
    const pers = listPersGPagos.find((p) => p.user_alias === alias);
    console.log("pers ", pers);
    console.log("periodoToGest ", periodoToGest);

    try {
      const response = await fetchRegDiarioPersByUser(
        alias,
        periodoToGest.period,
        periodoToGest.year
      );
      console.log("pers ", pers);
      console.log("response fetchRegDiarioPersByUser ", response);
      var totFestLab = 0;
      var totFestNoLab = 0;
      var totalPagoSalarios = 0;
      var totalPagoHrsExt = 0;
      var totalPagoPrimDom = 0;
      var totalPagoFestLab = 0;
      var totalPagoFestNoLab = 0;
      // var pagoTotal = 0;
      var observs = "Some info";

      var pagoTurnoAux = 0;

      console.log("resDiarioSelected ", resDiarioSelected);
      Object.values(response).forEach((reg) => {
        console.log(reg);
        pagoTurnoAux = parseFloat(reg.pago_turno);
        if (
          reg.status_festivo === "Festivo" &&
          reg.status_laborable === "Laborable"
        ) {
          totFestLab = totFestLab + 1;
          totalPagoFestLab = totalPagoFestLab + parseFloat(reg.pago_turno) * 2;
        } else if (
          reg.status_festivo === "Festivo" &&
          reg.status_laborable === "No Laborable"
        ) {
          totFestNoLab = totFestNoLab + 1;
          totalPagoFestNoLab = totalPagoFestNoLab + parseFloat(reg.pago_turno);
        }
        // Verifica si selectedFecha es domingo
        var fechaReg = reg.fecha;
        const iso = fechaReg;
        const ymd = iso.slice(0, 10);
        const esDomingo = ymd
          ? new Date(reg.fecha).getDay() === 0
          : // ? new Date(selectedFecha).getDay() === 0
            false;

        if (esDomingo) {
          console.log("¡Es domingo!");
          totalPagoPrimDom = turnos[0].pago_prima_dom;
        } else {
          console.log("No es domingo.");
        }
        // var fechaReg = reg.fecha;
        totalPagoSalarios = totalPagoSalarios + parseFloat(reg.pago_turno);
        totalPagoHrsExt = totalPagoHrsExt + parseFloat(reg.pago_hrs_ext);
        observs = reg.observs;
      });

      var pagoSeptimoDia =
        Object.values(response).length === 6 ? parseFloat(pagoTurnoAux) : 0;
      // observs =
      //   Object.values(response).length === 6
      //     ? "Se paga un septimo día $280.00"
      //     : observs;

      var persRecord = {
        id_user: pers.id_user,
        user_name: pers.user_name,
        user_alias: pers.user_alias,
        year: periodoToGest.year,
        periodo: periodoToGest.period,
        totalDias: Object.values(response).length || 0,
        // Object.values(response).length === 6
        //   ? Object.values(response).length + 1
        //   : Object.values(response).length || 0,
        totFestLab,
        totFestNoLab,
        totalPagoSalarios,
        totalPagoHrsExt,
        totalPagoPrimDom,
        totalPagoFestLab,
        totalPagoFestNoLab,
        pagoTotal:
          totalPagoSalarios +
          totalPagoHrsExt +
          totalPagoPrimDom +
          totalPagoFestLab +
          totalPagoFestNoLab +
          pagoSeptimoDia,
        observs,
        regsDiarios: response,
      };
      console.log("persRecord ", persRecord);

      // setPersSelectedGPagos(pers);

      // Lista de Pagos del periodo y personal seleccionados
      const pagos = await getRegPagosByUserHook(
        pers.user_alias,
        periodoToGest.period,
        periodoToGest.year
      );
      console.log("pagos ", pagos);

      if (Object.values(pagos).length === 0) {
        setPersSelectedGPagos(persRecord);
      }

      Object.values(pagos).forEach((pago) => {
        console.log("pago ", pago);
        console.log("persRecord ", persRecord);
        if (pago.periodo === persRecord.periodo) {
          console.log("pago ", pago);
          console.log("persRecord ", persRecord);
          persRecord.observs = pago.observs || persRecord.observs;
          persRecord = {
            ...persRecord,
            pago_registrado: true,
          };
          console.log("persRecord ", persRecord);
        }
        setPersSelectedGPagos(persRecord);
      });
    } catch (error) {
      console.log("error ", error);
    }
  };

  const submitRegitrarPago = async () => {
    try {
      const response = await handlerRegitrarPago();
      console.log("response ", response);
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    console.log("INICIA UseEffect GestPagos");
    console.log("listaPersonal ", listaPersonal);
    var listaAux = [];
    Object.values(listaPersonal).map((pers) => {
      var persAux = {
        id_user: pers.id_user,
        user_name: pers.user_name,
        user_alias: pers.user_alias,
      };
      listaAux.push(persAux);
    });
    setListPersGPagos(listaAux);
    console.log("listaAux ", listaAux);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="gest-pagos-container" id="gest-pagos-container">
      <h6 className="text-red">Gestión de Pagos</h6>
      <br />
      <div className="gest-pagos-content" id="gest-pagos-content">
        <div className="g-pag-c-1">
          <label htmlFor="año">Selecciona el año</label>
          <select
            id="año"
            className="form-select form-select-sm gest-pagos-select"
            value={periodoToGest.year}
            onChange={handleYearChange}
          >
            {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <label htmlFor="mes">Selecciona el Mes</label>
          <select
            id="mes"
            className="form-select form-select-sm gest-pagos-select"
            value={meses[periodoToGest.month - 1]}
            onChange={handleMonthChange}
          >
            {meses.map((mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            ))}
          </select>
          <label htmlFor="periodo">Selecciona el periodo</label>
          <select
            id="periodo"
            className="form-select form-select-sm gest-pagos-select"
            value={periodoToGest.period || ""}
            onChange={handlePeriodChange}
          >
            <option value="">Selecciona una semana</option>
            {weeks.map((w, idx) => (
              <option key={idx} value={w}>
                {w}
              </option>
            ))}
          </select>
          {/* ...resto del código... */}
          {periodoToGest.period && (
            <>
              <p>
                <a
                  href="#"
                  // className="menu-item menu-item-gest-pago"
                  className={
                    submenuGestPagos.pagoInd
                      ? "menu-item menu-item-gest-pago menu-item-gest-pago-active"
                      : "menu-item menu-item-gest-pago"
                  }
                  id="g-pag-submenu-pInd"
                  onClick={() => {
                    setSubmenuGestPagos({
                      pagoInd: true,
                      pagoGlobal: false,
                    });
                  }}
                >
                  Pago Individual
                </a>
              </p>
              <p>
                <a
                  href="#"
                  className={
                    submenuGestPagos.pagoGlobal
                      ? "menu-item menu-item-gest-pago menu-item-gest-pago-active"
                      : "menu-item menu-item-gest-pago"
                  }
                  id="g-pag-submenu-pGlobal"
                  onClick={() => {
                    setSubmenuGestPagos({
                      pagoInd: false,
                      pagoGlobal: true,
                    });
                  }}
                >
                  Pago Global
                </a>
              </p>
            </>
          )}
        </div>
        <div className="g-pag-c-2" id="g-pag-c-2">
          {periodoToGest.period && submenuGestPagos.pagoInd ? (
            <div
              className="g-pag-ind-form-container"
              id="g-pag-ind-form-container"
            >
              <form className="g-pag-ind-form" id="g-pag-ind-form">
                <div>
                  <label htmlFor="pers_name" className="label-get-pag">
                    Selecciona al perosnal
                  </label>
                  <br />
                  <select
                    id="pers_name"
                    className="form-select"
                    aria-label=".form-select-sm example"
                    value={persSelectedGPagos.user_alias || ""}
                    onChange={(e) => {
                      handlerSelectPersonal(e);
                    }}
                  >
                    <option value="">Selecciona un empleado</option>
                    {listPersGPagos &&
                      listPersGPagos.map((pers, idx) => (
                        <option key={idx} value={pers.user_alias}>
                          {pers.user_alias}
                        </option>
                      ))}
                  </select>
                </div>

                <div></div>
                <div className="form-floating mb-3 gper-input"></div>
                <div className="g-pago-pago-total" id="g-pago-pago-total">
                  <h6>Pago Total</h6>
                  <h6 id="pago_total">${persSelectedGPagos.pagoTotal}</h6>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="dias_lab"
                    value={persSelectedGPagos.totalDias || 0}
                    readOnly
                    placeholder="Total de días laborados"
                  />
                  <label htmlFor="dias_lab" className="gper-input-label">
                    Total de Días Laborados
                  </label>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="dias_fest_lab"
                    value={persSelectedGPagos.totFestLab || 0}
                    readOnly
                    placeholder="Total de días Fest laborados"
                  />
                  <label htmlFor="dias_fest_lab" className="gper-input-label">
                    Total de Días Festivos Laborados
                  </label>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="dias_fest_nolab"
                    value={persSelectedGPagos.totFestNoLab || 0}
                    readOnly
                    placeholder="Total de días Fest No laborados"
                  />
                  <label htmlFor="dias_fest_nolab" className="gper-input-label">
                    Total de Días Festivos No Laborados
                  </label>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="pago_salarios"
                    step="0.01"
                    value={persSelectedGPagos.totalPagoSalarios || 0}
                    readOnly
                    placeholder="Pago de Salarios"
                  />
                  <label htmlFor="pago_salarios" className="gper-input-label">
                    Pago de Salarios
                  </label>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="pago_hrs_extras"
                    step="0.01"
                    value={persSelectedGPagos.totalPagoHrsExt || 0}
                    readOnly
                    placeholder="Total de días laboradosPago de Hrs Extras"
                  />
                  <label htmlFor="pago_hrs_extras" className="gper-input-label">
                    Pago de Hrs Extras
                  </label>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="pago_primas_dom"
                    placeholder="Pago de Primas Dominicales"
                    step="0.01"
                    value={persSelectedGPagos.totalPagoPrimDom || 0}
                    readOnly
                  />
                  <label htmlFor="pago_primas_dom" className="gper-input-label">
                    Pago de Primas Dominicales
                  </label>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="pago_fest_lab"
                    step="0.01"
                    readOnly
                    value={persSelectedGPagos.totalPagoFestLab || 0}
                    placeholder="Pago de días Fest laborados"
                  />
                  <label htmlFor="pago_fest_lab" className="gper-input-label">
                    Pago de Fest Lab
                  </label>
                </div>
                <div className="form-floating mb-3 gper-input">
                  <input
                    type="number"
                    className="form-control gper-input-text"
                    id="pago_fest_nolab"
                    step="0.01"
                    value={persSelectedGPagos.totalPagoFestNoLab || 0}
                    readOnly
                    placeholder="Pago de Fest No Lab"
                  />
                  <label htmlFor="pago_fest_nolab" className="gper-input-label">
                    Pago de Fest No Lab
                  </label>
                </div>
              </form>
              <div className="g-pag-ind-form-obs-btns-container">
                <div className="form-floating mb-3 gper-input">
                  <textarea
                    className="form-control"
                    placeholder="Observaciones"
                    id="g-pag-observ"
                    // style={"height: 85px"}
                    value={persSelectedGPagos.observs || ""}
                    // readOnly={persSelectedGPagos.observs !== ""}
                    // readOnly
                    onChange={(e) =>
                      setPersSelectedGPagos({
                        ...persSelectedGPagos,
                        observs: e.target.value,
                      })
                    }
                  ></textarea>
                  <label htmlFor="g-pag-observ">Observaciones</label>
                </div>
                <div className="g-pag-ind-form-btns-container">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pag-reg"
                      checked={persSelectedGPagos.pago_registrado || false}
                      disabled
                    />
                    <label className="form-check-label" htmlFor="pag-reg">
                      Pago ya registrado
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    id="btn-form-pago-reg"
                    onClick={submitRegitrarPago}
                  >
                    Registrar Pago
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GestPagos;
