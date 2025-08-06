import useRegDiario from "../../hooks/useRegDiario";
import { RegDiarioContext } from "./RegDiarioContext";
import { PropTypes } from "prop-types";

export function RegDiarioProvider({ children }) {
  const {
    selectedFecha,
    setSelectedFecha,
    horariosTurnoTarde,
    setHorariosTurnoTarde,
    getResumenesDiarios,
    resDiarioSelected,
    setResDiarioSelected,
    personalDelResumen,
    setPersonalDelResumen,
  } = useRegDiario();

  return (
    <RegDiarioContext.Provider
      value={{
        selectedFecha,
        setSelectedFecha,
        horariosTurnoTarde,
        setHorariosTurnoTarde,
        getResumenesDiarios,
        resDiarioSelected,
        setResDiarioSelected,
        personalDelResumen,
        setPersonalDelResumen,
      }}
    >
      {children}
    </RegDiarioContext.Provider>
  );
}

RegDiarioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
