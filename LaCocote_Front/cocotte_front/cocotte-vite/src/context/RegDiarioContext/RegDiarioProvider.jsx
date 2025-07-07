import useRegDiario from "../../hooks/useRegDiario";
import { RegDiarioContext } from "./RegDiarioContext";
import { PropTypes } from "prop-types";

export function RegDiarioProvider({ children }) {
  const {
    selectedFecha,
    setSelectedFecha,
    horariosTurnoTarde,
    setHorariosTurnoTarde,
  } = useRegDiario();

  return (
    <RegDiarioContext.Provider
      value={{
        selectedFecha,
        setSelectedFecha,
        horariosTurnoTarde,
        setHorariosTurnoTarde,
      }}
    >
      {children}
    </RegDiarioContext.Provider>
  );
}

RegDiarioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
