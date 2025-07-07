import { db } from "../config/db_config.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

async function hashPasswords() {
  const users = await db.any("SELECT id_user, pass FROM users");
  for (const user of users) {
    // Solo hashea si la contraseña no está hasheada (ejemplo simple)
    if (user.pass.length < 20) {
      const hashed = await bcrypt.hash(user.pass, saltRounds);
      await db.none("UPDATE users SET pass = $1 WHERE id_user = $2", [
        hashed,
        user.id_user,
      ]);
      console.log(`Usuario ${user.id_user} actualizado`);
    }
  }
  console.log("Contraseñas actualizadas.");
  process.exit();
}

hashPasswords();
