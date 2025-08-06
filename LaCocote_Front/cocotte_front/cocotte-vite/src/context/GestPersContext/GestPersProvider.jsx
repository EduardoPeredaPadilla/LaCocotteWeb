import useGestPersonal from "../../hooks/useGestPersonal";
import { GestPersContext } from "./GestPersContext";
import { PropTypes } from "prop-types";

export function GestPersProvider({ children }) {
  const {
    ctrlGestPersView,
    setCtrlGestPersView,
    selectedPersonalToEdit,
    setSelectedPersonalToEdit,
    personalToAdd,
    setPersonalToAdd,
    personalInitialState,
    listaGestPersonal,
    setListaGestPersonal,
    selectedPersHistorial,
    setSelectedPersHistorial,
  } = useGestPersonal();

  return (
    <GestPersContext.Provider
      value={{
        ctrlGestPersView,
        setCtrlGestPersView,
        selectedPersonalToEdit,
        setSelectedPersonalToEdit,
        personalToAdd,
        setPersonalToAdd,
        personalInitialState,
        listaGestPersonal,
        setListaGestPersonal,
        selectedPersHistorial,
        setSelectedPersHistorial,
      }}
    >
      {children}
    </GestPersContext.Provider>
  );
}

GestPersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
