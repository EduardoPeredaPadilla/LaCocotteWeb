import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import Login from "../Login/Login";
import RegistriDirario from "./RegistriDirario";
import GestPersonal from "./GestPersonal";
import GestPagos from "./GestPagos";
import Config from "./Config";

const WorkArea = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, setUser, login, setLogin, ctrlMenuView, setCtrlMenuView } =
    useContext(AuthContext);

  return (
    <>
      <div className="work-area-container" id="work-area-container">
        {!login ? (
          <Login />
        ) : ctrlMenuView.regDiario ? (
          <RegistriDirario />
        ) : ctrlMenuView.gestPersonal ? (
          <GestPersonal />
        ) : ctrlMenuView.gestPagos ? (
          <GestPagos />
        ) : (
          ctrlMenuView.config && <Config />
        )}
      </div>
    </>
  );
};

export default WorkArea;
