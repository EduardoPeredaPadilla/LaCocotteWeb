import useConfig from "../../hooks/useConfig";
import { PropTypes } from "prop-types";
import { ConfigContext } from "./ConfigContext";

export function ConfigProvider({ children }) {
  const { turnos, setTurnos } = useConfig();

  return (
    <ConfigContext.Provider
      value={{
        turnos,
        setTurnos,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
