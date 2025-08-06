import { useEffect, useState } from "react";
import { getTurnosService } from "../services/ConfigService/configService";

const useConfig = () => {
  const [turnos, setTurnos] = useState(null);

  async function getTurnosHook() {
    try {
      const response = await getTurnosService();
      console.log(response);
      setTurnos(response);
    } catch (error) {
      console.log("error ", error);
    }
  }

  useEffect(() => {
    getTurnosHook();
  }, []);

  return {
    turnos,
    setTurnos,
  };
};

export default useConfig;
