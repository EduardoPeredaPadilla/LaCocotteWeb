import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { RegDiarioContext } from "../../context/RegDiarioContext/RegDiarioContext";

const Menu = () => {
  const { initialUserState, setUser, setLogin, setCtrlMenuView, ctrlMenuView } =
    useContext(AuthContext);

  // eslint-disable-next-line no-unused-vars
  const { selectedFecha, setSelectedFecha } = useContext(RegDiarioContext);

  const handlerSelectMenu = (e) => {
    e.preventDefault();
    const id = e.target.id;
    console.log("id ", id);

    switch (id) {
      case "img-menu1":
        setCtrlMenuView({
          regDiario: true,
          gestPersonal: false,
          gestPagos: false,
          reportes: false,
          config: false,
        });
        break;
      case "img-menu2":
        setCtrlMenuView({
          regDiario: false,
          gestPersonal: true,
          gestPagos: false,
          reportes: false,
          config: false,
        });
        break;
      case "img-menu3":
        setCtrlMenuView({
          regDiario: false,
          gestPersonal: false,
          gestPagos: true,
          reportes: false,
          config: false,
        });
        break;
      case "img-menu4":
        setCtrlMenuView({
          regDiario: false,
          gestPersonal: false,
          gestPagos: false,
          reportes: true,
          config: false,
        });
        break;
      case "img-menu6":
        setCtrlMenuView({
          regDiario: false,
          gestPersonal: false,
          gestPagos: false,
          reportes: false,
          config: true,
        });
        break;
      default:
        break;
    }
  };

  const handlerLogOut = () => {
    // localStorage.removeItem("token");
    setLogin(false);
    setCtrlMenuView({
      regDiario: false,
      gestPersonal: false,
      gestPagos: false,
      reportes: false,
    });
    setUser(initialUserState);
    setSelectedFecha(null);
  };

  return (
    <div className="menu-container">
      <div className="menu-list">
        <p>
          <a href="/reg-diario" className="menu-item">
            <img
              src="/src/img/menu1.png"
              className={
                ctrlMenuView.regDiario
                  ? "img-mini-cocotte img-menu img-menu-active"
                  : "img-mini-cocotte img-menu"
              }
              alt=""
              id="img-menu1"
              onClick={(e) => handlerSelectMenu(e)}
            />
          </a>
        </p>
        <p>
          <a href="/gest-personal" className="menu-item">
            <img
              src="/src/img/menu2.png"
              // className={`img-mini-cocotte img-menu ${ctrlMenuView.regDiario}`}
              className={
                ctrlMenuView.gestPersonal
                  ? "img-mini-cocotte img-menu img-menu-active"
                  : "img-mini-cocotte img-menu"
              }
              alt=""
              id="img-menu2"
              onClick={(e) => handlerSelectMenu(e)}
            />
          </a>
        </p>
        <p>
          <a href="#" className="menu-item">
            <img
              src="/src/img/menu3.png"
              // className="img-mini-cocotte img-menu img-menu-pagos"
              className={
                ctrlMenuView.gestPagos
                  ? "img-mini-cocotte img-menu-pagos img-menu-pagos-active"
                  : "img-mini-cocotte img-menu-pagos"
              }
              alt=""
              id="img-menu3"
              onClick={(e) => handlerSelectMenu(e)}
            />
          </a>
        </p>
        <p>
          <a href="#" className="menu-item">
            <img
              src="/src/img/menu4.png"
              className="img-mini-cocotte img-menu"
              alt=""
              id="img-menu4"
            />
          </a>
        </p>
      </div>
      <div className="menu-list">
        <p>
          <a href="#" className="menu-item">
            <img
              src="/src/img/menu6.png"
              // className="img-mini-cocotte img-menu img-menu-config"
              className={
                ctrlMenuView.config
                  ? "img-mini-cocotte img-menu img-menu-config-active"
                  : "img-mini-cocotte img-menu-config"
              }
              alt=""
              id="img-menu6"
              onClick={(e) => handlerSelectMenu(e)}
            />
          </a>
        </p>
        <p>
          <a href="#" className="menu-item">
            <img
              src="/src/img/menu5.png"
              className="img-mini-cocotte img-menu img-menu-log-out"
              alt=""
              id="img-menu5"
              onClick={handlerLogOut}
            />
          </a>
        </p>
      </div>
    </div>
  );
};

export default Menu;
