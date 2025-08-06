CREATE VIEW public.vw_reg_diario_pers AS
SELECT
    rdp.*,
    rd.status_laborable,
    rd.status_festivo
FROM
    public.reg_diario_pers rdp
JOIN
    public.resumen_diario rd ON rdp.id_rd = rd.id_rd;
