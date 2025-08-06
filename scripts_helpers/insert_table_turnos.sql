INSERT INTO public.turnos(
	turno,
	fecha_ini,
	fecha_fin,
	hrs_turno,
	salario_base,
	pago_hrs_ext, 
	coef_prim_dom,
	coef_fest_lab,
	coef_fest_nolab,
	coef_aguin,
	coef_vac)
	VALUES (
		'Nocturno',
		DATE '2025-01-01',
		DATE '2025-12-31',
		7,
		280,
		70,
		25,
		3,
		2,
		1,
		1);