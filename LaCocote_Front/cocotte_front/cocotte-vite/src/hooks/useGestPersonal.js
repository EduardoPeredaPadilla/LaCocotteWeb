import { useState } from "react";

const personalInitialState = {
  id_user: null,
  user_name: "",
  user_alias: "",
  user_rol: "",
  email: "",
  pass: "",
  auth: false,
  isAdmin: false,
};

const useGestPersonal = () => {
  const [ctrlGestPersView, setCtrlGestPersView] = useState({
    table: false,
    addEdit: false,
    historial: false,
  });

  const [listaGestPersonal, setListaGestPersonal] = useState(null);
  const [selectedPersonalToEdit, setSelectedPersonalToEdit] = useState(null);
  const [personalToAdd, setPersonalToAdd] = useState(personalInitialState);

  const [selectedPersHistorial, setSelectedPersHistorial] = useState(null);

  return {
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
  };
};

export default useGestPersonal;
