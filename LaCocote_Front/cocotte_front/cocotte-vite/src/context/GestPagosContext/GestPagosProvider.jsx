import { PropTypes } from "prop-types";
import { GestPagosContext } from "./GestPagosContext";
import useGestPagos from "../../hooks/useGestPagos";

export function GestPagosProvider({ children }) {
  const {
    periodoToGest,
    setPeriodoToGest,
    handlerRegitrarPago,
    getWeeksOfMonth,
    submenuGestPagos,
    setSubmenuGestPagos,
    listPersGPagos,
    setListPersGPagos,
    initialPersState,
    persSelectedGPagos,
    setPersSelectedGPagos,
    fetchRegDiarioPersByUser,
    getRegPagosByUserHook,
  } = useGestPagos();

  return (
    <GestPagosContext.Provider
      value={{
        periodoToGest,
        setPeriodoToGest,
        handlerRegitrarPago,
        getWeeksOfMonth,
        submenuGestPagos,
        setSubmenuGestPagos,
        listPersGPagos,
        setListPersGPagos,
        initialPersState,
        persSelectedGPagos,
        setPersSelectedGPagos,
        fetchRegDiarioPersByUser,
        getRegPagosByUserHook,
      }}
    >
      {children}
    </GestPagosContext.Provider>
  );
}

GestPagosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
