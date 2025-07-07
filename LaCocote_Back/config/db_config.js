import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp("postgres://postgres:adminDev2024@localhost:5432/la_cocotte_db");

export { db };
