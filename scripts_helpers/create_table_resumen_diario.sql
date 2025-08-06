SET datestyle = dmy;

-- Crear tabla
CREATE TABLE public.resumen_diario (
    id_rd           bigserial PRIMARY KEY,         -- clave primaria autoincrementable
    fecha           date        NOT NULL,          -- se mostrará/insertará como dd/mm/aaaa si usas to_date o SET datestyle=dmy
    total_personal  integer     NOT NULL,
    personal_dia    text[]      NOT NULL,          -- lista de strings (array de texto)
    pago_turno      numeric(12,2) NOT NULL,
    pago_hrs_ext    numeric(12,2) NOT NULL,
    -- Calcula automáticamente el total del día como suma de los pagos
    pago_total_dia  numeric(12,2) GENERATED ALWAYS AS (pago_turno + pago_hrs_ext) STORED
);