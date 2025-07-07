import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { RegDiarioContext } from "../../context/RegDiarioContext/RegDiarioContext";

// Suma horas a un string "HH:mm"
function sumarHoras(hora, horasASumar) {
  if (!hora) return "";
  let [h, m] = hora.split(":").map(Number);
  // Separa horas y minutos de horasASumar
  const horas = Math.floor(horasASumar);
  const minutos = Math.round((horasASumar - horas) * 60);
  h += horas;
  m += minutos;
  if (m >= 60) {
    h += Math.floor(m / 60);
    m = m % 60;
  }
  if (h >= 24) h -= 24;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

const RegistriDirario = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, setUser, login, setLogin, listaPersoanal, setListaPersoanal } =
    useContext(AuthContext);

  const { selectedFecha, setSelectedFecha } = useContext(RegDiarioContext);

  function handlerCheckPersonalChange(e, personal) {
    const checked = e.target.checked;
    const updatedPersonal = {
      ...personal,
      activeDay: checked,
      horaEntrada: checked ? personal.horaEntrada : "",
      horaSalida: checked ? personal.horaSalida : "",
      horaSalidaEsperada: checked ? personal.horaSalidaEsperada : "",
      hrsExt: checked ? personal.hrsExt : 0,
      // hrsTurno: checked ? personal.hrsTurno : 0,
      pagoTurno: checked ? personal.pagoTurno : 0,
      pagoHrsExtra: checked ? personal.pagoHrsExtra : 0,
      pagoTotalDia: checked ? personal.pagoTotalDia : 0,
    };
    setListaPersoanal((prevLista) =>
      prevLista.map((item) =>
        item.user_alias === personal.user_alias ? updatedPersonal : item
      )
    );
  }

  // Handler para hora de entrada
  function handleHoraEntradaChange(e, personal) {
    const horaEntrada = e.target.value;
    let hrsTurno;
    if (horaEntrada === "09:00") {
      hrsTurno = 8;
    } else if (horaEntrada === "15:00" || horaEntrada === "16:00") {
      hrsTurno = 7.5;
    } else {
      hrsTurno = 7;
    }
    const horaSalidaEsperada = horaEntrada
      ? sumarHoras(horaEntrada, hrsTurno)
      : "";

    const pagoTurno = 280; // fijo
    const pagoHrsExtra = 0; // al seleccionar entrada, aún no hay extras
    const pagoTotalDia = pagoTurno + pagoHrsExtra;

    setListaPersoanal((prevLista) =>
      prevLista.map((item) =>
        item.user_alias === personal.user_alias
          ? {
              ...item,
              horaEntrada,
              horaSalida: horaSalidaEsperada,
              horaSalidaEsperada,
              hrsExt: 0,
              hrsTurno,
              pagoTurno,
              pagoHrsExtra,
              pagoTotalDia,
            }
          : item
      )
    );
  }

  // Calcula la diferencia en horas decimales entre dos horas "HH:mm"
  function calcularHorasExtras(horaSalida, horaSalidaEsperada) {
    if (!horaSalida || !horaSalidaEsperada) return 0;
    const [h1, m1] = horaSalida.split(":").map(Number);
    const [h2, m2] = horaSalidaEsperada.split(":").map(Number);
    let minutos1 = h1 * 60 + m1;
    let minutos2 = h2 * 60 + m2;
    // Si la salida real es menor que la esperada, asumimos que pasó de medianoche
    if (minutos1 < minutos2) {
      minutos1 += 24 * 60;
    }
    let diff = minutos1 - minutos2;
    return diff > 0 ? +(diff / 60).toFixed(2) : 0;
  }

  // Handler para modificar la hora de salida manualmente
  // function handleHoraSalidaChange(e, personal) {
  //   const horaSalida = e.target.value;
  //   const horaSalidaEsperada = personal.horaSalidaEsperada || "";
  //   const hrsExt = calcularHorasExtras(horaSalida, horaSalidaEsperada);
  //   setListaPersoanal((prevLista) =>
  //     prevLista.map((item) =>
  //       item.user_alias === personal.user_alias
  //         ? { ...item, horaSalida, hrsExt }
  //         : item
  //     )
  //   );
  // }
  function handleHoraSalidaChange(e, personal) {
    const horaSalida = e.target.value;
    const horaSalidaEsperada = personal.horaSalidaEsperada || "";
    const hrsExt = calcularHorasExtras(horaSalida, horaSalidaEsperada);

    const pagoTurno = 280;
    const pagoPorHoraExtra = 70;
    const pagoHrsExtra = +(hrsExt * pagoPorHoraExtra).toFixed(2);
    const pagoTotalDia = +(pagoTurno + pagoHrsExtra).toFixed(2);

    setListaPersoanal((prevLista) =>
      prevLista.map((item) =>
        item.user_alias === personal.user_alias
          ? {
              ...item,
              horaSalida,
              hrsExt,
              pagoTurno,
              pagoHrsExtra,
              pagoTotalDia,
            }
          : item
      )
    );
  }

  // Calcula la diferencia en horas decimales entre dos horas "HH:mm"
  // eslint-disable-next-line no-unused-vars
  function calcularHoras(horaInicio, horaFin) {
    if (!horaInicio || !horaFin) return 0;
    const [h1, m1] = horaInicio.split(":").map(Number);
    const [h2, m2] = horaFin.split(":").map(Number);
    let minutos1 = h1 * 60 + m1;
    let minutos2 = h2 * 60 + m2;
    let diff = minutos2 - minutos1;
    if (diff < 0) diff += 24 * 60; // pasa medianoche
    return +(diff / 60).toFixed(2);
  }

  return (
    <div className="reg-dd-container" id="reg-dd-container">
      <h6 className="text-acua">Registro de Datos Laborales</h6>
      <br />
      <form className="reg-dd-form" id="reg-dd-form-group">
        <div className="content-form">
          <div className="rdd-form-left" id="rdd-form-left">
            <label htmlFor="fecha">Selecciona la fecha</label>
            <input
              type="date"
              className="form-control rdd-select"
              id="fecha"
              value={selectedFecha || ""}
              onChange={(e) => setSelectedFecha(e.target.value)}
            />
            {/* <label htmlFor="rdd-turno">Selecciona el turno</label>
            <select
              id="rdd-turno"
              className="form-select form-select-sm rdd-select"
              aria-label="form-select-sm example"
              // value={turno}
            >
              <option>Mañana</option>
              <option>Tarde</option>
            </select> */}
            <label htmlFor="status_laborable">Status día laborable</label>
            <select
              id="status_laborable"
              className="form-select form-select-sm rdd-select"
              aria-label=".form-select-sm example"
              // value={status_laborable}
            >
              <option>Laborable</option>
              <option>No Laborable</option>
            </select>
            <label htmlFor="status_festivo">Status día festivo</label>
            <select
              id="status_festivo"
              className="form-select form-select-sm rdd-select"
              aria-label=".form-select-sm example"
              // value={status_festivo}
            >
              <option>No Festivo</option>
              <option>Festivo</option>
            </select>
            <div className="form-floating mb-3 rdd-input">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="datos_registrados"
                />
                <label className="form-check-label" htmlFor="pers_work">
                  Datos del día ya registrados
                </label>
              </div>
            </div>
          </div>
          <div className="rdd-form-right">
            {selectedFecha && (
              <div className="rdd-list-pers-container">
                <h6>
                  Lista del personal activo para laborar en el día seleccionado
                </h6>
                <hr />
                <div className="rdd-ul-headers">
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Personal</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Puesto</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Hora Entrada</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Hora Salida</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Horas Extras</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Pago turno</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Pago hrs extra</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Pago total día</span>
                  </div>
                </div>
                <ul className="rdd-ul-pers" id="rdd-ul-pers">
                  {listaPersoanal &&
                    Object.values(listaPersoanal)
                      .sort((a, b) => a.user_alias.localeCompare(b.user_alias))
                      .map(
                        (personal) =>
                          personal.auth && (
                            <li
                              key={personal.user_alias}
                              className="li-personal"
                            >
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={personal.activeDay}
                                  id={personal.pers_name}
                                  onChange={(e) => {
                                    handlerCheckPersonalChange(e, personal);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="pers_work"
                                >
                                  {personal.user_alias}
                                </label>
                              </div>
                              {/* Select para puesto */}
                              <select
                                className="form-select form-select-sm rdd-select-puesto"
                                name={`puesto_${personal.user_alias}`}
                                disabled={!personal.activeDay}
                              >
                                <option value="">Puesto</option>
                                <option value="Limpieza">Limpieza</option>
                                <option value="Piso">Piso</option>
                                <option value="Cocina">Cocina</option>
                                <option value="Encargado">Encargado</option>
                              </select>
                              {/* Select para hora de entrada */}
                              <select
                                className="form-select form-select-sm rdd-select-hora"
                                name={`entrada_${personal.user_alias}`}
                                disabled={!personal.activeDay}
                                value={personal.horaEntrada || ""}
                                onChange={(e) =>
                                  handleHoraEntradaChange(e, personal)
                                }
                              >
                                <option value="">Hora Entrada</option>
                                <option value="09:00">09:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                                <option value="18:00">18:00</option>
                                <option value="18:30">18:30</option>
                              </select>
                              {/* Input para hora de salida */}
                              <input
                                className="form-control"
                                type="time"
                                name={`salida_${personal.user_alias}`}
                                disabled={!personal.activeDay}
                                value={personal.horaSalida || ""}
                                onChange={(e) =>
                                  handleHoraSalidaChange(e, personal)
                                }
                              />
                              {/* Input para horas extras */}
                              <input
                                className="form-control rdd-input-text-hrext"
                                type="number"
                                name="hrsExt"
                                step={0.01}
                                disabled
                                value={personal.hrsExt || 0}
                              />
                              <input
                                className="form-control rdd-input-text-pago"
                                type="text"
                                name="pagoTurno"
                                disabled
                                value={`$${
                                  personal.pagoTurno?.toFixed(2) || "0.00"
                                }`}
                              />
                              <input
                                className="form-control rdd-input-text-pago"
                                type="text"
                                name="pagoHrsExtra"
                                disabled
                                value={`$${
                                  personal.pagoHrsExtra?.toFixed(2) || "0.00"
                                }`}
                              />
                              <input
                                className="form-control rdd-input-text-pago"
                                type="text"
                                name="pagoTotalDia"
                                disabled
                                value={`$${
                                  personal.pagoTotalDia?.toFixed(2) || "0.00"
                                }`}
                              />
                            </li>
                          )
                      )}
                </ul>
                {/* Totales generales */}
                <div className="rdd-ul-footer">
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title"></span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title"></span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title"></span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">Totales</span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">
                      {listaPersoanal
                        ? Object.values(listaPersoanal)
                            .filter((p) => p.activeDay)
                            .reduce(
                              (acc, p) => acc + (Number(p.hrsExt) || 0),
                              0
                            )
                            .toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">
                      $
                      {listaPersoanal
                        ? Object.values(listaPersoanal)
                            .filter((p) => p.activeDay)
                            .reduce(
                              (acc, p) => acc + (Number(p.pagoTurno) || 0),
                              0
                            )
                            .toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">
                      $
                      {listaPersoanal
                        ? Object.values(listaPersoanal)
                            .filter((p) => p.activeDay)
                            .reduce(
                              (acc, p) => acc + (Number(p.pagoHrsExtra) || 0),
                              0
                            )
                            .toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="rdd-ul-header">
                    <span className="rdd-header-title">
                      $
                      {listaPersoanal
                        ? Object.values(listaPersoanal)
                            .filter((p) => p.activeDay)
                            .reduce(
                              (acc, p) => acc + (Number(p.pagoTotalDia) || 0),
                              0
                            )
                            .toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rdd-form-extra" id="rdd-form-extra">
          {/* <h6>Registro fin</h6>
          <div className="rdd-fin-container">
            <div className="rdd-fin-cj">
              <div className="rdd-fin-cj-c1">
                <h6>Caja Interior</h6>
                <div className="form-floating">
                  <input
                    type="number"
                    step={1}
                    className="form-control"
                    id="floatingComandas"
                    placeholder="Comandas"
                  />
                  <label for="floatingPassword">Comandas</label>
                </div>
              </div>
              <div className="rdd-fin-cj-c1">
                <h6>Caja Exterior</h6>
              </div>
            </div>
            <div className="rdd-fin-tj">
              <h6>Tarjetas</h6>
            </div>
          </div> */}
        </div>
        <div className="btn-form-container">
          {/* <button
            type="submit"
            className="btn btn-outline-primary btn-sm reg-dd-btn"
          >
            Registrar
          </button> */}
          {/* <div
            className="rdd-results-container"
            id="rdd-results-container"
          ></div> */}
        </div>
      </form>
    </div>
  );
};

export default RegistriDirario;
