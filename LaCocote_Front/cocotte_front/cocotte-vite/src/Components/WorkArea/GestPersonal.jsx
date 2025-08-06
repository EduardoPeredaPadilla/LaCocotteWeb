import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { GestPersContext } from "../../context/GestPersContext/GestPersContext";

const GestPersonal = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, setUser, login, setLogin, listaPersonal, setListaPersonal } =
    useContext(AuthContext);

  const {
    ctrlGestPersView,
    setCtrlGestPersView,
    selectedPersonalToEdit,
    setSelectedPersonalToEdit,
    personalToAdd,
    setPersonalToAdd,
    personalInitialState,
    selectedPersHistorial,
    setSelectedPersHistorial,
    listaGestPersonal,
    setListaGestPersonal,
  } = useContext(GestPersContext);

  const handlerInputsChange = (e, toEdit) => {
    console.log("e.target ", e.target);
    const { id, value } = e.target;
    console.log("toEdit ", toEdit);
    console.log("id ", id);
    console.log("value ", value);
    toEdit
      ? setSelectedPersonalToEdit((prev) => ({
          ...prev,
          [id]: value,
        }))
      : setPersonalToAdd((prev) => ({
          ...prev,
          [id]: value,
        }));
  };

  const handlerLimpiarCampos = (e) => {
    e.preventDefault();
    console.log("Limpiar campos");
    setSelectedPersonalToEdit(null);
    setPersonalToAdd(personalInitialState);
    setCtrlGestPersView({
      ...ctrlGestPersView,
      addEdit: false,
      table: true,
      historial: false,
    });
  };

  useEffect(() => {
    if (listaPersonal) {
      console.log("listaPersonal ", listaPersonal);
      var listAux = [];
      Object.values(listaPersonal).forEach((pers) => {
        const iso = pers.fecha_ing;
        const ymd = iso.slice(0, 10);
        var newFecha = ymd;
        console.log("pers ", pers);
        var obj = {
          id_user: pers.id_user,
          user_name: pers.user_name,
          user_alias: pers.user_alias,
          email: pers.email,
          fecha_ing: newFecha,
          // fecha_ing: pers.fecha_ing,
          auth: pers.auth ? "Activo" : "Inactivo",
          fecha_baja: pers.fecha_baja || "N/A",
        };
        listAux.push(obj);
      });
      setListaGestPersonal(listAux);
      console.log("listAux ", listAux);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaPersonal]);

  useEffect(() => {
    if (selectedPersonalToEdit) {
      console.log("selectedPersonalToEdit ", selectedPersonalToEdit);
    }
  }, [selectedPersonalToEdit]);

  return (
    <div>
      <div className="gest-pers-container " id="gest-pers-container">
        <h6 className="text-acua">Gestión de Personal</h6>
        <div className="gest-pers-menu">
          <p>
            <a
              href="#"
              className={
                ctrlGestPersView.table
                  ? "menu-item menu-item-gest-pers-active"
                  : "menu-item menu-item-gest-pers"
              }
              // className="menu-item menu-item-gest-pers"
              id="menu-gest-pers-1"
              onClick={() =>
                setCtrlGestPersView({
                  ...ctrlGestPersView,
                  table: true,
                  addEdit: false,
                  historial: false,
                })
              }
            >
              Agregar / Editar
            </a>
          </p>
          <p>
            <a
              href="#"
              className={
                ctrlGestPersView.historial
                  ? "menu-item menu-item-gest-pers-active"
                  : "menu-item menu-item-gest-pers"
              }
              id="menu-gest-pers-2"
              onClick={() =>
                setCtrlGestPersView({
                  ...ctrlGestPersView,
                  table: false,
                  addEdit: false,
                  historial: true,
                })
              }
            >
              Historial
            </a>
          </p>
        </div>
        <div className="gest-pers-content" id="gest-pers-content">
          {ctrlGestPersView.table && (
            <div className="g-per-container">
              <div className="g-per-c1">
                <h6>Lista del personal</h6>
                <div className="g-per-c1-table">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Alias</th>
                        <th scope="col">Email</th>
                        <th scope="col">Fecha de Ingreso</th>
                        {/* <th scope="col">Salario</th> */}
                        <th scope="col">Status</th>
                        <th scope="col">Fecha de Baja</th>
                        <th scope="col">Editar</th>
                      </tr>
                    </thead>
                    <tbody className="g-per-tbody" id="g-per-tbody">
                      {listaGestPersonal &&
                        Object.values(listaGestPersonal).map((pers) => (
                          <tr key={pers.id_user}>
                            <td>{pers.user_name}</td>
                            <td>{pers.user_alias}</td>
                            <td>{pers.email}</td>
                            <td>{pers.fecha_ing}</td>
                            <td>{pers.auth ? "Activo" : "Inactivo"}</td>
                            <td>{pers.fecha_baja}</td>
                            <td>
                              <div className="table-g-pers-btn-cont">
                                <img
                                  src="/src/img/editbtn.png"
                                  className="img-mini-cocotte img-menu"
                                  alt=""
                                  id={`table-g-pers-btn-${pers.id_user}`}
                                  // id=${'table-g-pers-btn-' + pers.id_user}
                                  value={pers.id_user}
                                  onClick={() => {
                                    setCtrlGestPersView({
                                      ...ctrlGestPersView,
                                      addEdit: true,
                                      table: true,
                                      historial: false,
                                    });
                                    setSelectedPersonalToEdit(pers);
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="g-per-c1-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    id="btn-add-pers-view-form"
                    onClick={() =>
                      setCtrlGestPersView({
                        ...ctrlGestPersView,
                        addEdit: true,
                        table: true,
                        historial: false,
                      })
                    }
                  >
                    Agregar
                  </button>
                </div>
              </div>
              <div className="g-per-c2">
                {ctrlGestPersView.addEdit && (
                  <div className="g-per-c2-2 " id="g-per-c2-2">
                    <form className="g-per-add-form" id="g-per-add-form">
                      <h6>Formulario para gestiòn de personal</h6>
                      <div className="form-floating mb-3 gper-input"></div>
                      <div className="form-floating mb-3 gper-input">
                        <input
                          type="text"
                          className="form-control gper-input-text"
                          id="pers_name"
                          placeholder="Nombre"
                          // value={selectedPersonalToEdit?.user_name || ""}
                          value={
                            selectedPersonalToEdit?.user_name ||
                            personalToAdd.user_name
                          }
                          onChange={(e) => {
                            handlerInputsChange(
                              e,
                              selectedPersonalToEdit && true
                            );
                          }}
                        />
                        <label htmlFor="pers_name" className="gper-input-label">
                          Nombre
                        </label>
                      </div>
                      <div className="form-floating mb-3 gper-input">
                        <input
                          type="text"
                          className="form-control gper-input-text"
                          id="alias"
                          placeholder="Alias"
                          value={
                            selectedPersonalToEdit?.user_alias ||
                            personalToAdd.user_alias
                          }
                          onChange={(e) => {
                            handlerInputsChange(
                              e,
                              selectedPersonalToEdit && true
                            );
                          }}
                        />
                        <label htmlFor="alias" className="gper-input-label">
                          Alias
                        </label>
                      </div>
                      <div className="form-floating mb-3 gper-input">
                        <input
                          type="email"
                          className="form-control gper-input-text"
                          id="email"
                          placeholder="Email"
                          value={
                            selectedPersonalToEdit?.email || personalToAdd.email
                          }
                          onChange={(e) => {
                            handlerInputsChange(
                              e,
                              selectedPersonalToEdit && true
                            );
                          }}
                        />
                        <label htmlFor="email" className="gper-input-label">
                          Email
                        </label>
                      </div>
                      <div className="form-floating mb-3 gper-input">
                        <input
                          type="date"
                          className="form-control gper-input-text"
                          id="fecha_ing"
                          placeholder="Fecha de Ingreso"
                          value={
                            selectedPersonalToEdit?.fecha_ing ||
                            personalToAdd.fecha_ing
                          }
                          onChange={(e) => {
                            handlerInputsChange(
                              e,
                              selectedPersonalToEdit && true
                            );
                          }}
                        />
                        <label htmlFor="fecha_ing" className="gper-input-label">
                          Fecha de Ingreso
                        </label>
                      </div>

                      <div className="form-floating mb-3 gper-input">
                        <select
                          id="status"
                          className="form-select form-select-sm gper-select"
                          aria-label=".form-select-sm example"
                          placeholder="Status del personal"
                          value={
                            selectedPersonalToEdit?.auth || personalToAdd.auth
                              ? "Activo"
                              : "Inactivo"
                          }
                          onChange={(e) => {
                            handlerInputsChange(
                              e,
                              selectedPersonalToEdit && true
                            );
                          }}
                        >
                          {/* <option defaultValue="0"></option> */}
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                        <label htmlFor="status">Status del personal</label>
                      </div>

                      <div className="form-floating mb-3 gper-input">
                        <input
                          type="date"
                          className="form-control gper-input-text"
                          id="fecha_baja"
                          placeholder="Fecha de Baja"
                          // disabled={}
                        />
                        <label
                          htmlFor="fecha_baja"
                          className="gper-input-label"
                        >
                          Fecha de Baja
                        </label>
                      </div>

                      {/* <div className="form-floating mb-3 gper-input">
                        <select
                          id="pers-turno"
                          className="form-select form-select-sm gper-select"
                          aria-label=".form-select-sm example"
                          placeholder="Turno"
                        ></select>
                        <label htmlFor="pers-turno">Turno</label>
                      </div>
                      <div className="form-floating mb-3 gper-input"></div> */}

                      <div className="form-floating mb-3 g-per-rol-dias">
                        <br />
                        <h6>Días progrqamados</h6>
                        <ul className="lista-dias-rol-pers">
                          <li className="li-dia-rol">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Lunes"
                                id="dia-lunes"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="dia-lunes"
                              >
                                Lunes
                              </label>
                            </div>
                          </li>
                          <li className="li-dia-rol">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Martes"
                                id="dia-martes"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="dia-martes"
                              >
                                Martes
                              </label>
                            </div>
                          </li>
                          <li className="li-dia-rol">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Miércoles"
                                id="dia-miercoles"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="dia-miercoles"
                              >
                                Miércoles
                              </label>
                            </div>
                          </li>
                          <li className="li-dia-rol">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Jueves"
                                id="dia-jueves"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="dia-jueves"
                              >
                                Jueves
                              </label>
                            </div>
                          </li>
                          <li className="li-dia-rol">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Viernes"
                                id="dia-viernes"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="dia-viernes"
                              >
                                Viernes
                              </label>
                            </div>
                          </li>
                          <li className="li-dia-rol">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Sábado"
                                id="dia-sabado"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="dia-sabado"
                              >
                                Sábado
                              </label>
                            </div>
                          </li>
                          <li className="li-dia-rol">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Domingo"
                                id="dia-domingo"
                                placeholder="Domingo"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="dia-domingo"
                              >
                                Domingo
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="g-per-add-form-btns-cont">
                        {/* <br /> */}
                        <button
                          type="submit"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Registrar
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          id="btn-g-pers-clean"
                          onClick={(e) => handlerLimpiarCampos(e)}
                        >
                          Limpiar Campos
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm btn-g-pers-delete"
                          id="btn-g-pers-delete"
                        >
                          Eliminar
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
          {ctrlGestPersView.historial && (
            <div className="g-pers-hist-container">
              <div className="g-pers-hist-select-cont">
                <select
                  id="pers_name_hist"
                  className="form-select"
                  aria-label=".form-select-sm example"
                  onChange={(e) => {
                    console.log("e.target ", e.target);
                    console.log("e.target.value ", e.target.value);

                    const selectedId = parseInt(e.target.value);
                    if (selectedId === "0") {
                      setSelectedPersHistorial(null);
                      return;
                    }
                    var selectedPerson;
                    Object.values(listaGestPersonal).map((pers) => {
                      console.log("pers.id_user:", pers.id_user);
                      console.log("selectedId:", selectedId);
                      if (pers.id_user === selectedId) {
                        selectedPerson = pers;
                      }
                    });
                    console.log("Selected person:", selectedPerson);
                    setSelectedPersHistorial(selectedPerson);
                  }}
                >
                  <option defaultValue="0">Selecciona al personal</option>
                  {Object.values(listaGestPersonal).map((pers) => (
                    <option key={pers.id_user} value={pers.id_user}>
                      {pers.user_alias}
                    </option>
                  ))}
                </select>
              </div>
              <div className="g-pers-hist-content" id="g-pers-hist-content">
                {selectedPersHistorial && (
                  <div className="g-pers-hist-resultSelect">
                    <div className="sub-menu-g-pers-hist">
                      <a
                        href="#"
                        className="sub-menu-g-pers-item"
                        id="hist-pagos"
                      >
                        Historial de Pagos
                      </a>
                      <a href="#" className="sub-menu-g-pers-item" id="calc-ag">
                        Cálculo de Aguinaldo
                      </a>
                      <a
                        href="#"
                        className="sub-menu-g-pers-item"
                        id="calc-vac"
                      >
                        Cálculo de Vacaciones
                      </a>
                    </div>
                    <div
                      className="g-pers-hist-content"
                      id="g-pers-hist-content-submenu"
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestPersonal;
