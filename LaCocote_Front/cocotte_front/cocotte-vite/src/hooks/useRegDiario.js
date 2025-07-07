import { useState } from "react";

const useRegDiario = () => {
  const [selectedFecha, setSelectedFecha] = useState(null);

  const [horariosTurnoTarde, setHorariosTurnoTarde] = useState([
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "6:30 PM",
  ]);

  return {
    selectedFecha,
    setSelectedFecha,
    horariosTurnoTarde,
    setHorariosTurnoTarde,
  };
};

export default useRegDiario;
