-- Trabajar con fechas dd/mm/aaaa en esta sesión
SET datestyle = dmy;

-- Crear tabla detalle de personal por día
CREATE TABLE public.reg_diario_pers (
    id_rdp          bigserial PRIMARY KEY,                      -- PK autoincrementable
    id_rd           bigint NOT NULL,                            -- FK a resumen_diario.id_rd
    fecha           date NOT NULL,                              -- fecha del registro
    nombre          text NOT NULL,                              -- nombre del trabajador
    hr_entrada      text NOT NULL,                              -- string (p.ej. "07:00")
    hr_salida       text NOT NULL,                              -- string (p.ej. "15:00")
    hrs_extras      integer NOT NULL DEFAULT 0,                 -- horas extra
    pago_turno      numeric(12,2) NOT NULL,
    pago_hrs_ext    numeric(12,2) NOT NULL,
    pago_total_dia  numeric(12,2) GENERATED ALWAYS AS           -- suma automática
                     (pago_turno + pago_hrs_ext) STORED,
    CONSTRAINT fk_reg_diario_pers_rd
        FOREIGN KEY (id_rd)
        REFERENCES public.resumen_diario(id_rd)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);