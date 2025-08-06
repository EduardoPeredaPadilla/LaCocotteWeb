-- Crear tabla
CREATE TABLE public.turnos (
    id_turno           bigserial PRIMARY KEY,         -- clave primaria autoincrementable
	turno 			text NOT NULL,
    fecha_ini           date        NOT NULL,
	fecha_fin           date        NOT NULL,        
    hrs_turno      numeric(12,2) NOT NULL,
    salario_base     numeric(12,2) NOT NULL,
    pago_hrs_ext    numeric(12,2) NOT NULL,
    coef_prim_dom    numeric(12,2) NOT NULL,
    pago_prima_dom    numeric(12,2) GENERATED ALWAYS AS (salario_base * (coef_prim_dom/100)) STORED,
    coef_fest_lab    numeric(12,2) NOT NULL,
    pago_fest_lab    numeric(12,2) GENERATED ALWAYS AS (salario_base * coef_fest_lab) STORED,
    coef_fest_nolab    numeric(12,2) NOT NULL,
    pago_fest_nolab    numeric(12,2) GENERATED ALWAYS AS (salario_base * coef_fest_nolab) STORED,
    coef_aguin    numeric(12,2) NOT NULL,
    coef_vac    numeric(12,2) NOT NULL
);