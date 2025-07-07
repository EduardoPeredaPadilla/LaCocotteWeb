import express from "express";
// import multer from "multer";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { db } from "./config/db_config.js"; // Asegúrate de que este archivo exporte tu configuración de base de datos
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // Asegúrate de que el servidor pueda parsear JSON

// PETICIONES PARA EL LOGIN

// login
app.post("/auth/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const userResult = await db.any("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userResult.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const user = userResult[0];

    // Nueva validación: si auth es false, rechaza el acceso
    if (!user.auth) {
      return res
        .status(403)
        .json({ message: "Usuario no autorizado para ingresar" });
    }

    console.log("user ", user);

    // Compara la contraseña usando bcrypt
    const valid = await bcrypt.compare(pass, user.pass);
    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Estructura de usuario como en tu frontend
    const userFrontend = {
      id_user: user.id_user,
      user_name: user.user_name,
      user_alias: user.user_alias,
      user_rol: user.user_rol,
      email: user.email,
      auth: user.auth,
      isAdmin: user.admin,
    };

    // Si es admin, trae todos los usuarios
    let usersList = [];
    // if (user.is_admin) {
    //   const allUsers = await db.any("SELECT * FROM users");
    //   usersList = await Promise.all(
    //     allUsers.map(async (u) => {
    //       const appsResult = await db.any(
    //         `SELECT a.app_key, a.app_type, a.label, ua.enabled
    //          FROM user_apps ua
    //          JOIN apps a ON ua.id_app = a.id_app
    //          WHERE ua.id_user = $1`,
    //         [u.id_user]
    //       );
    //       const appsByType = {};
    //       appsResult.forEach((app) => {
    //         if (!appsByType[app.app_type]) appsByType[app.app_type] = {};
    //         appsByType[app.app_type][app.app_key] = app.enabled;
    //       });
    //       return {
    //         id_user: u.id_user,
    //         user_name: u.user_name,
    //         email: u.email,
    //         auth: u.auth,
    //         isAdmin: u.is_admin,
    //         orgOper: u.org_oper,
    //         userType: u.user_type,
    //         area: u.area,
    //         puesto: u.puesto,
    //         appsCalc: appsByType.appsCalc || {},
    //         appsAvs: appsByType.appsAvs || {},
    //         monitor: appsByType.monitor || {},
    //         monitorEjec: appsByType.monitorEjec || {},
    //       };
    //     })
    //   );
    // }

    // Genera el JWT
    const token = jwt.sign(
      { id_user: user.id_user, email: user.email, isAdmin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Devuelve usersList solo si es admin
    res.json({ user: userFrontend, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Lista de personal
// Middleware para verificar el token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Endpoint protegido para traer la lista de usuarios
// app.get("/users", authenticateToken, async (req, res) => {
//   // Solo admin puede ver la lista
//   if (!req.user.isAdmin) {
//     return res.status(403).json({ message: "No autorizado" });
//   }
//   try {
//     const users = await db.any("SELECT * FROM users");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Error en el servidor" });
//   }
// });
app.get("/users", async (req, res) => {
  // Solo admin puede ver la lista
  try {
    const users = await db.any(
      "SELECT id_user,user_name,user_alias,admin,auth,user_rol,email FROM users"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
