import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { RegDiarioContext } from "../../context/RegDiarioContext/RegDiarioContext";
import {
  registrarRegDiarioPers,
  registrarResumenDiario,
} from "../../services/RegDiarioService/regDiarioService";
import { ConfigContext } from "../../context/ConfigContext/ConfigContext";

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
  const { user, setUser, login, setLogin, listaPersonal, setListaPersonal } =
    useContext(AuthContext);

  const { turnos } = useContext(ConfigContext);

  const [listaPersonalInicial, setListaPersonalInicial] = useState(null);

  const {
    selectedFecha,
    setSelectedFecha,
    getResumenesDiarios,
    resDiarioSelected,
    setResDiarioSelected,
    personalDelResumen,
    // eslint-disable-next-line no-unused-vars
    setPersonalDelResumen,
  } = useContext(RegDiarioContext);

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
    setListaPersonal((prevLista) =>
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

    const pagoTurno = 0; // fijo
    // const pagoTurno = 280; // fijo
    const pagoHrsExtra = 0; // al seleccionar entrada, aún no hay extras
    const pagoTotalDia = pagoTurno + pagoHrsExtra;

    setListaPersonal((prevLista) =>
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
  //   setListaPersonal((prevLista) =>
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

    var pagoTurno = 0;
    var pagoPorHoraExtra = 0;
    var pagoHrsExtra = 0;
    var pagoTotalDia = 0;

    var turnoPers = null;
    personal.horaEntrada === "09:00" && (turnoPers = "Diurno");
    personal.horaEntrada === "15:00" && (turnoPers = "Mixto");
    personal.horaEntrada === "16:00" && (turnoPers = "Mixto");
    personal.horaEntrada === "17:00" && (turnoPers = "Mixto");
    personal.horaEntrada === "17:30" && (turnoPers = "Nocturno");
    personal.horaEntrada === "18:00" && (turnoPers = "Nocturno");
    personal.horaEntrada === "18:30" && (turnoPers = "Nocturno");

    console.log("selectedFecha ", selectedFecha);
    console.log("turnoPers ", turnoPers);
    // Verifica si selectedFecha es domingo
    const esDomingo = selectedFecha
      ? new Date(selectedFecha).getDay() === 6
      : // ? new Date(selectedFecha).getDay() === 0
        false;

    // Uso:
    if (esDomingo) {
      console.log("¡Es domingo!");
      console.log("¡Es domingo!", new Date(selectedFecha).getDay());
    } else {
      console.log("¡No es domingo!", new Date(selectedFecha).getDay());
    }

    Object.values(turnos).map((turn) => {
      console.log("turn ", turn);
      console.log("hrsExt ", hrsExt);
      if (turnoPers === turn.turno) {
        console.log("turn ", turn);
        console.log("resDiarioSelected ", resDiarioSelected);

        if (resDiarioSelected.status_festivo === "No Festivo") {
          pagoTurno = esDomingo
            ? turn.salario_base + turn.pago_prima_dom
            : turn.salario_base;
          pagoPorHoraExtra = turn.pago_hrs_ext;
          pagoHrsExtra = +(hrsExt * pagoPorHoraExtra).toFixed(2);
          pagoTotalDia = +(pagoTurno + pagoHrsExtra).toFixed(2);
        } else if (resDiarioSelected.status_festivo === "Festivo") {
          if (resDiarioSelected.status_laborable === "Laborable") {
            var pgTrn = turn.salario_base * turn.coef_fest_lab;
            pagoTurno = esDomingo ? pgTrn + turn.pago_prima_dom : pgTrn;
            pagoPorHoraExtra = turn.pago_hrs_ext;
            pagoHrsExtra = +(hrsExt * pagoPorHoraExtra).toFixed(2);
            pagoTotalDia = +(pagoTurno + pagoHrsExtra).toFixed(2);
          } else if (resDiarioSelected.status_laborable === "No Laborable") {
            var pgTrn2 = turn.salario_base * turn.coef_fest_nolab;
            pagoTurno = esDomingo ? pgTrn2 + turn.pago_prima_dom : pgTrn2;
            pagoPorHoraExtra = turn.pago_hrs_ext;
            pagoHrsExtra = +(hrsExt * pagoPorHoraExtra).toFixed(2);
            pagoTotalDia = +(pagoTurno + pagoHrsExtra).toFixed(2);
          }
        }
      }
    });

    // const pagoTurno = 280;
    // const pagoPorHoraExtra = 70;
    // const pagoHrsExtra = +(hrsExt * pagoPorHoraExtra).toFixed(2);
    // const pagoTotalDia = +(pagoTurno + pagoHrsExtra).toFixed(2);

    setListaPersonal((prevLista) =>
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

  async function handlerRegDiario(e) {
    console.log("INICIA EL handlerRegDiario");
    console.log("e ", e);
    console.log("listaPersonal ", listaPersonal);
    console.log("resDiarioSelected ", resDiarioSelected);

    var listAux = [];
    var totPers = 0;
    var activePers = [];
    var pagoTurno = 0;
    var pagoHrsExtra = 0;
    var st_Lab = resDiarioSelected.status_laborable;
    var st_Fest = resDiarioSelected.status_festivo;
    Object.values(listaPersonal).map((pers) => {
      if (pers.activeDay) {
        listAux.push(pers);
        totPers++;
        activePers.push(pers.user_alias);
        pagoTurno += pers.pagoTurno || 0;
        pagoHrsExtra += pers.pagoHrsExtra || 0;
      }
    });
    console.log("listAux ", listAux);
    console.log("selectedFecha ", selectedFecha);
    console.log("totPers ", totPers);
    console.log("activePers ", activePers);
    console.log("pagoTurno ", pagoTurno);
    console.log("pagoHrsExtra ", pagoHrsExtra);
    console.log("st_Lab ", st_Lab);
    console.log("st_Fest ", st_Fest);

    const data = {
      fecha: selectedFecha,
      total_personal: totPers,
      personal_dia: activePers, // ajusta según lo que espera tu backend
      pago_turno: pagoTurno,
      pago_hrs_ext: pagoHrsExtra,
      status_laborable: st_Lab,
      status_festivo: st_Fest,
    };

    try {
      // 1. Registrar resumen y obtener id_rd
      const res = await registrarResumenDiario(data);
      const id_rd = res.id_rd;

      // 2. Registrar cada personal activo
      const registros = listAux.map((pers) => {
        return registrarRegDiarioPers({
          id_rd,
          fecha: selectedFecha,
          nombre: pers.user_alias,
          hr_entrada: pers.horaEntrada,
          hr_salida: pers.horaSalida,
          hrs_extras: pers.hrsExt,
          pago_turno: pers.pagoTurno,
          pago_hrs_ext: pers.pagoHrsExtra,
        });
      });

      await Promise.all(registros);
      setResDiarioSelected({
        ...resDiarioSelected,
        id_rd,
        fecha: selectedFecha,
        total_personal: totPers,
        personal_dia: activePers,
        pago_turno: pagoTurno,
        pago_hrs_ext: pagoHrsExtra,
        ya_registrado: true,
      });

      alert("Resumen y personal registrados correctamente");
    } catch (err) {
      console.log("error ", err);

      alert("Error al registrar: " + err.message);
    }
  }

  const handlerStatusChange = (e) => {
    console.log("e.target ", e.target);
    console.log("e.target.value ", e.target.value);
    console.log("e.target.id ", e.target.id);
    const status = e.target.value;
    const statusType = e.target.id;

    setResDiarioSelected({
      ...resDiarioSelected,
      [statusType]: status,
    });

    // switch (statusType) {
    //   case "status_labrable":
    //     setResDiarioSelected({
    //       ...resDiarioSelected,
    //       status_laborable: status,
    //     });
    //     break;
    //   case "status_festivo":
    //     setResDiarioSelected({
    //       ...resDiarioSelected,
    //       status_festivo: status,
    //     });
    //     break;

    //   default:
    //     break;
    // }
  };

  useEffect(() => {
    console.log("resDiarioSelected :", resDiarioSelected);
  }, [resDiarioSelected]);

  useEffect(() => {
    if (listaPersonal && listaPersonalInicial === null) {
      console.log("listaPersonal :", listaPersonal);
      setListaPersonalInicial(listaPersonal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaPersonal]);

  useEffect(() => {
    console.log("INICIA EL USEEFFECT de personalDelResumen");
    console.log("personalDelResumen ", personalDelResumen);
    console.log("listaPersonal ", listaPersonal);
    console.log("listaPersonalInicial ", listaPersonalInicial);

    if (
      personalDelResumen &&
      personalDelResumen.length > 0 &&
      Array.isArray(listaPersonal) &&
      listaPersonal.length > 0
    ) {
      const nuevaLista = listaPersonal.map((pers) => {
        const encontrado = personalDelResumen.find(
          (p) => p.nombre === pers.user_alias
        );
        if (encontrado) {
          const pagoTurno = Number(encontrado.pago_turno) || 0;
          const pagoHrsExtra = Number(encontrado.pago_hrs_ext) || 0;
          const hrsExt = Number(encontrado.hrs_extras) || 0;
          return {
            ...pers,
            activeDay: true,
            horaEntrada: encontrado.hr_entrada,
            horaSalida: encontrado.hr_salida,
            horaSalidaEsperada: "",
            hrsExt,
            pagoTurno,
            pagoHrsExtra,
            pagoTotalDia: pagoTurno + pagoHrsExtra,
          };
        } else {
          return {
            ...pers,
            activeDay: false,
            horaEntrada: "",
            horaSalida: "",
            horaSalidaEsperada: "",
            hrsExt: 0,
            pagoTurno: 0,
            pagoHrsExtra: 0,
            pagoTotalDia: 0,
          };
        }
      });
      setListaPersonal(nuevaLista);
    } else if (
      personalDelResumen &&
      personalDelResumen.length === 0 &&
      listaPersonalInicial
    ) {
      // Si NO hay resumen, restaura el estado inicial
      console.log("retorna estado inicial listapersonal");
      console.log("listaPersonalInicial ", listaPersonalInicial);

      setListaPersonal(listaPersonalInicial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalDelResumen, listaPersonal?.length, setListaPersonal]);

  useEffect(() => {
    console.log("INICIA UseEffect RegDiario");
    console.log("turnos ", turnos);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              onChange={(e) => {
                console.log("e ", e);
                console.log("e.target ", e.target);
                console.log("e.target.value ", e.target.value);
                setSelectedFecha(e.target.value);
                getResumenesDiarios(e.target.value);
              }}
            />
            {selectedFecha && (
              <>
                <label htmlFor="status_laborable">Status día laborable</label>
                <select
                  id="status_laborable"
                  className="form-select form-select-sm rdd-select"
                  aria-label=".form-select-sm example"
                  value={resDiarioSelected.status_laborable}
                  onChange={(e) => {
                    handlerStatusChange(e);
                  }}
                >
                  <option value="Laborable">Laborable</option>
                  <option value="No Laborable">No Laborable</option>
                </select>
                <label htmlFor="status_festivo">Status día festivo</label>
                <select
                  id="status_festivo"
                  className="form-select form-select-sm rdd-select"
                  aria-label=".form-select-sm example"
                  value={resDiarioSelected.status_festivo}
                  onChange={(e) => {
                    handlerStatusChange(e);
                  }}
                >
                  <option value="No Festivo">No Festivo</option>
                  <option value="Festivo">Festivo</option>
                </select>
                <div className="form-floating mb-3 rdd-input">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={resDiarioSelected.ya_registrado}
                      id="datos_registrados"
                      readOnly
                    />
                    <label className="form-check-label" htmlFor="pers_work">
                      Datos del día ya registrados
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="rdd-form-right">
            {selectedFecha && (
              <>
                <div className="rdd-list-pers-container">
                  <h6>
                    Lista del personal activo para laborar en el día
                    seleccionado
                  </h6>
                  <hr />
                  <div className="rdd-ul-headers">
                    <div className="rdd-ul-header">
                      <span className="rdd-header-title">Personal</span>
                    </div>
                    {/* <div className="rdd-ul-header">
                      <span className="rdd-header-title">Puesto</span>
                    </div> */}
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
                    {listaPersonal &&
                      Object.values(listaPersonal)
                        .sort((a, b) =>
                          a.user_alias.localeCompare(b.user_alias)
                        )
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
                                  <option value="17:30">17:30</option>
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
                        {listaPersonal
                          ? Object.values(listaPersonal)
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
                        {listaPersonal
                          ? Object.values(listaPersonal)
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
                        {listaPersonal
                          ? Object.values(listaPersonal)
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
                        {listaPersonal
                          ? Object.values(listaPersonal)
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
                <div className="btn-reg-dd-container">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => {
                      handlerRegDiario(e);
                    }}
                  >
                    Registrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistriDirario;
