/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { loginAuthService } from "../../services/AuthService/authService";

const Login = () => {
  const { user, setUser, login, setLogin } = useContext(AuthContext);

  const handlerInput = (e) => {
    e.preventDefault();
    console.log("Input changed:", e.target.name, e.target.value);

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const { user_name, pass } = user;

    if (user_name && pass) {
      // Aquí deberías llamar a tu servicio de autenticación
      // Por ejemplo: loginAuthService({ email: user_name, pass })
      // Simulando una respuesta exitosa
      const response = await loginAuthService({ email: user_name, pass });
      if (!response) {
        console.error("Credenciales incorrectas");
        return;
      }
      setLogin(true);
      console.log("Usuario autenticado:", user_name);
    } else {
      console.error("Por favor, completa todos los campos.");
    }
  };

  return (
    <div className="login-container" id="login-container">
      <div className="login-container-c1">
        <form id="login-form" className="login-form-c">
          <h6>Iniciar Sesión</h6>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control input-login"
              id="username"
              name="user_name"
              placeholder="Usuario"
              value={user.user_name || ""}
              onChange={(e) => handlerInput(e)}
            />
            <label htmlFor="username">Usuario</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control input-login"
              id="password"
              name="pass"
              placeholder="Password"
              value={user.pass || ""}
              onChange={(e) => handlerInput(e)}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button
            type="submit"
            className="btn btn-outline-primary btn-sm login-btn"
            onClick={(e) => handlerSubmit(e)}
          >
            Ingresar
          </button>
        </form>
        <div className="logo_index"></div>
        {/* <div
          className="login-imgs-error-container hidden"
          id="chancla-cont"
        ></div> */}
      </div>
      <div className="walda-container">
        {/* <div className="logo_index"></div> */}
        <img
          src="/src/img/walda2.png"
          className="walda-img"
          id="walda-img"
          alt=""
        />
        <img
          src="/src/img/walda3.png"
          className="walda-img2 hidden"
          id="walda-img2"
          alt=""
        />
      </div>
    </div>
  );
};

export default Login;
