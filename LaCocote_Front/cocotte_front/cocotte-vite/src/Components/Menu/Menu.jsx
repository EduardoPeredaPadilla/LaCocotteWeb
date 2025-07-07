import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const Menu = () => {
  const { initialUserState, setUser, setLogin, setCtrlMenuView } =
    useContext(AuthContext);

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
  };

  return (
    <div className="menu-container">
      <div className="menu-list">
        <p>
          <a href="#" className="menu-item">
            <img
              src="/src/img/menu1.png"
              className="img-mini-cocotte img-menu"
              alt=""
              id="img-menu1"
            />
          </a>
        </p>
        <p>
          <a href="#" className="menu-item">
            <img
              src="/src/img/menu2.png"
              className="img-mini-cocotte img-menu"
              alt=""
              id="img-menu2"
            />
          </a>
        </p>
        <p>
          <a href="#" className="menu-item">
            <img
              src="/src/img/menu3.png"
              className="img-mini-cocotte img-menu img-menu-pagos"
              alt=""
              id="img-menu3"
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
              className="img-mini-cocotte img-menu img-menu-config"
              alt=""
              id="img-menu6"
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
