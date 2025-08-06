import { useEffect, useState } from "react";
import { getUsersListService } from "../services/AuthService/authService";

const initialUserState = {
  id_user: null,
  user_name: null,
  user_alias: null,
  user_rol: null,
  email: null,
  pass: null,
  auth: null,
  isAdmin: null,
};

const useAuth = () => {
  const [user, setUser] = useState(initialUserState);
  const [login, setLogin] = useState(false);

  const [ctrlMenuView, setCtrlMenuView] = useState({
    regDiario: false,
    gestPersonal: false,
    gestPagos: false,
    reportes: false,
    config: false,
  });

  const [listaPersonal, setListaPersonal] = useState(null);

  async function obtenerUsuarios() {
    try {
      const response = await getUsersListService();
      console.log("response ", response);
      if (response && response.length > 0) {
        setListaPersonal(response);
      } else {
        setListaPersonal([]);
      }
    } catch (error) {
      console.log("====================================");
      console.log("error ", error);
      console.log("====================================");
    }
  }

  useEffect(() => {
    if (login) {
      setCtrlMenuView({
        ...ctrlMenuView,
        regDiario: true,
      });
      obtenerUsuarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  return {
    initialUserState,
    user,
    setUser,
    login,
    setLogin,
    ctrlMenuView,
    setCtrlMenuView,
    listaPersonal,
    setListaPersonal,
    obtenerUsuarios,
  };
};

export default useAuth;
