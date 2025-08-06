-- Crear tabla detalle de pagos
CREATE TABLE public.pagos (
    id_pago         bigserial PRIMARY KEY,                      -- PK autoincrementable
    id_user           bigint NOT NULL,                            
    fecha           date NOT NULL,                              -- fecha del registro
    nombre          text NOT NULL,   
	periodo			text NOT NULL,	
	total_dias		integer NOT NULL DEFAULT 0,	
	tot_fest_lab			integer NOT NULL DEFAULT 0, 
	tot_fest_noLab 			integer NOT NULL DEFAULT 0, 
	total_pago_salarios		numeric(12,2) NOT NULL DEFAULT 0,
	total_pago_hrsext		numeric(12,2) NOT NULL DEFAULT 0,
	total_pago_primdom		numeric(12,2) NOT NULL DEFAULT 0,
	total_pago_fest_lab		numeric(12,2) NOT NULL DEFAULT 0,
	total_pago_fest_nolab	numeric(12,2) NOT NULL DEFAULT 0,
	pago_total			numeric(12,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_pagos_users
        FOREIGN KEY (id_user)
        REFERENCES public.users(id_user)
);