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

    // console.log("user ", user);

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
      "SELECT id_user,user_name,user_alias,admin,auth,user_rol,email, fecha_ing FROM users ORDER BY user_name"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Endpoint para obtener los resumen diario
app.get("/resumen-diario", async (req, res) => {
  // Solo admin puede ver la lista
  try {
    const resumenes_diario = await db.any(
      "SELECT * FROM public.resumen_diario ORDER BY fecha DESC"
    );
    res.json(resumenes_diario);
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Endpoint para regitro resumen diario
app.post("/resumen-diario", async (req, res) => {
  const {
    fecha,
    total_personal,
    personal_dia,
    pago_turno,
    pago_hrs_ext,
    status_laborable,
    status_festivo,
  } = req.body;
  try {
    // Insertar y devolver el id_rd generado
    const result = await db.one(
      `INSERT INTO resumen_diario
        (fecha, total_personal, personal_dia, pago_turno, pago_hrs_ext, status_laborable, status_festivo)
       VALUES (
        $1::date,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      ) RETURNING id_rd`,
      [
        fecha,
        total_personal,
        personal_dia,
        pago_turno,
        pago_hrs_ext,
        status_laborable,
        status_festivo,
      ]
    );
    res.status(201).json({
      message: "Registro agregado correctamente",
      id_rd: result.id_rd,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar el registro" });
  }
});
// app.post("/resumen-diario", async (req, res) => {
//   const { fecha, total_personal, personal_dia, pago_turno, pago_hrs_ext } =
//     req.body;
//   try {
//     // fecha debe llegar como string 'YYYY-MM-DD'
//     await db.none(
//       `INSERT INTO resumen_diario
//         (fecha, total_personal, personal_dia, pago_turno, pago_hrs_ext)
//        VALUES (
//         $1::date,
//         $2,
//         $3,
//         $4,
//         $5
//       )`,
//       [fecha, total_personal, personal_dia, pago_turno, pago_hrs_ext]
//     );
//     res.status(201).json({ message: "Registro agregado correctamente" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error al agregar el registro" });
//   }
// });

// ...existing code...

app.post("/reg-diario-pers", async (req, res) => {
  const {
    id_rd,
    fecha,
    nombre,
    hr_entrada,
    hr_salida,
    hrs_extras,
    pago_turno,
    pago_hrs_ext,
  } = req.body;
  try {
    await db.none(
      `INSERT INTO reg_diario_pers
        (id_rd, fecha, nombre, hr_entrada, hr_salida, hrs_extras, pago_turno, pago_hrs_ext)
       VALUES (
        $1,
        $2::date,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )`,
      [
        id_rd,
        fecha,
        nombre,
        hr_entrada,
        hr_salida,
        hrs_extras,
        pago_turno,
        pago_hrs_ext,
      ]
    );
    res
      .status(201)
      .json({ message: "Registro de personal agregado correctamente" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al agregar el registro de personal" });
  }
});

// Obtener registros de personal por id_rd
app.get("/reg-diario-pers/:id_rd", async (req, res) => {
  const { id_rd } = req.params;
  try {
    const registros = await db.any(
      "SELECT * FROM reg_diario_pers WHERE id_rd = $1 ORDER BY nombre",
      [id_rd]
    );
    res.json(registros);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener registros de personal" });
  }
});

// Endpoint para obtener los turnos
app.get("/pagos", async (req, res) => {
  // Solo admin puede ver la lista
  try {
    const pagos = await db.any("SELECT * FROM public.pagos ORDER BY id_pago");
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Endpoint para obtener los turnos de un periodo
app.get("/pagos-by-user-period", async (req, res) => {
  const { user_alias, periodo } = req.query;
  console.log("INICIO DE PAGOS BY USER PERIOD");
  console.log("user_alias :", user_alias);
  console.log("periodo :", periodo);

  try {
    const pagos = await db.any(
      // "SELECT * FROM public.pagos ORDER BY id_pago"
      `SELECT * FROM pagos 
       WHERE nombre = $1 
         AND periodo >= $2 
       ORDER BY fecha`,
      [user_alias, periodo]
    );
    console.log("PAGOS OBTENIDOS:", pagos);
    console.log("PAGOS OBTENIDOS length:", pagos.length);
    console.log("FIN DE PAGOS BY USER PERIOD");
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Endpoint para obtener los pagos
app.get("/turnos", async (req, res) => {
  // Solo admin puede ver la lista
  try {
    const turnos = await db.any(
      "SELECT * FROM public.turnos ORDER BY id_turno"
    );
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ...existing code...
// Endpoint para reg diario de una persona
app.get("/reg-diario-pers-by-user", async (req, res) => {
  const { user_alias, fecha_inicio, fecha_fin } = req.query;
  try {
    const registros = await db.any(
      // `SELECT * FROM reg_diario_pers
      `SELECT * FROM vw_reg_diario_pers 
       WHERE nombre = $1 
         AND fecha >= $2::date 
         AND fecha <= $3::date
       ORDER BY fecha`,
      [user_alias, fecha_inicio, fecha_fin]
    );
    res.json(registros);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener registros de personal" });
  }
});

// Pagos
app.post("/pagos", async (req, res) => {
  const {
    id_user,
    fecha,
    nombre,
    periodo,
    total_dias,
    tot_fest_lab,
    tot_fest_noLab,
    total_pago_salarios,
    total_pago_hrsext,
    total_pago_primdom,
    total_pago_fest_lab,
    total_pago_fest_nolab,
    pago_total,
    observs,
  } = req.body;

  try {
    await db.none(
      `INSERT INTO pagos (
        id_user, fecha, nombre, periodo, total_dias, tot_fest_lab, tot_fest_noLab,
        total_pago_salarios, total_pago_hrsext, total_pago_primdom,
        total_pago_fest_lab, total_pago_fest_nolab, pago_total, observs
      ) VALUES (
        $1, $2::date, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )`,
      [
        id_user,
        fecha,
        nombre,
        periodo,
        total_dias,
        tot_fest_lab,
        tot_fest_noLab,
        total_pago_salarios,
        total_pago_hrsext,
        total_pago_primdom,
        total_pago_fest_lab,
        total_pago_fest_nolab,
        pago_total,
        observs,
      ]
    );
    res.status(201).json({ message: "Pago registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar el pago" });
  }
});
// ...existing code...

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
