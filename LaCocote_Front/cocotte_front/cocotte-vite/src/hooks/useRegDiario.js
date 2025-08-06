import { useState } from "react";
import {
  getRegDiarioPersByIdRd,
  getResumenesDiariosService,
} from "../services/RegDiarioService/regDiarioService";

const resDiarioInitialState = {
  fecha: null,
  total_personal: 0,
  personal_dia: [],
  pago_turno: 0,
  pago_hrs_ext: 0,
  id_rd: null,
  status_laborable: "Laborable",
  status_festivo: "No Festivo",
  ya_registrado: false,
};

const useRegDiario = () => {
  const [selectedFecha, setSelectedFecha] = useState(null);

  const [horariosTurnoTarde, setHorariosTurnoTarde] = useState([
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "6:30 PM",
  ]);

  const [resDiarioSelected, setResDiarioSelected] = useState(
    resDiarioInitialState
  );

  const [personalDelResumen, setPersonalDelResumen] = useState([]);

  async function getResumenesDiarios(fecha) {
    console.log("Fetching resumenes for date:", fecha);

    // try {
    //   const response = await getResumenesDiariosService();
    //   if (response && response.length > 0) {
    //     console.log("Resumenes fetched successfully:", response);
    //     Object.values(response).map((resumen) => {
    //       console.log("resumen ", resumen);
    //       const iso = resumen.fecha;
    //       const ymd = iso.slice(0, 10);
    //       if (ymd === fecha) {
    //         console.log("Resumen for selected date:", resumen);
    //         setResDiarioSelected({
    //           ...resumen,
    //           fecha: ymd,
    //           ya_registrado: true,
    //         });

    //       } else {
    //         console.log("No resumen for selected date:", fecha);
    //         setResDiarioSelected({
    //           ...resDiarioInitialState,
    //           fecha: fecha,
    //           ya_registrado: false,
    //         });
    //       }
    //     });
    //   } else {
    //     console.log("No resumenes found for the selected date.");
    //   }
    // } catch (error) {
    //   console.log("error ", error);
    // }
    try {
      const response = await getResumenesDiariosService();
      if (response && response.length > 0) {
        let encontrado = false;
        for (const resumen of response) {
          const iso = resumen.fecha;
          const ymd = iso.slice(0, 10);
          if (ymd === fecha) {
            encontrado = true;
            setResDiarioSelected({
              ...resumen,
              fecha: ymd,
              ya_registrado: true,
            });
            // Traer personal asociado a este resumen
            const pers = await getRegDiarioPersByIdRd(resumen.id_rd);
            setPersonalDelResumen(pers);
            break;
          }
        }
        if (!encontrado) {
          setResDiarioSelected({
            ...resDiarioInitialState,
            fecha: fecha,
            ya_registrado: false,
          });
          setPersonalDelResumen([]);
        }
      } else {
        setPersonalDelResumen([]);
      }
    } catch (error) {
      setPersonalDelResumen([]);
      console.log("error ", error);
    }
  }

  return {
    selectedFecha,
    setSelectedFecha,
    horariosTurnoTarde,
    setHorariosTurnoTarde,
    getResumenesDiarios,
    resDiarioSelected,
    setResDiarioSelected,
    personalDelResumen,
    setPersonalDelResumen,
  };
};

export default useRegDiario;
