import useAuth from "../../hooks/useAuth";
import { AuthContext } from "./AuthContext";
import { PropTypes } from "prop-types";

export function AuthProvider({ children }) {
  const {
    initialUserState,
    user,
    setUser,
    login,
    setLogin,
    ctrlMenuView,
    setCtrlMenuView,
    listaPersoanal,
    setListaPersoanal,
    obtenerUsuarios,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        initialUserState,
        user,
        setUser,
        login,
        setLogin,
        ctrlMenuView,
        setCtrlMenuView,
        listaPersoanal,
        setListaPersoanal,
        obtenerUsuarios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
