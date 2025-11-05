# IOP: Self-Esteem - LUNES (Plan de Inserción Modular)

## Objetivo
Insertar la actividad "Self-Esteem" para IOP del día LUNES con todas sus subactividades y párrafos.

## Estructura de la Actividad

### Actividad: Self-Esteem
**Descripción:** Self-Esteem activities for IOP groups - Monday

### Subactividades:

1. **Self-Esteem** (50 párrafos)
   - Understanding and developing self-esteem

2. **Identify Triggers to Low** (40 párrafos)
   - Identifying triggers that lower self-esteem

3. **Building Self-Confidence** (60 párrafos)
   - Developing self-confidence skills

4. **Practice Self-Care** (50 párrafos)
   - Self-care practices for self-esteem

5. **Daily Accomplishments** (40 párrafos)
   - Recognizing daily accomplishments

## Plan de Ejecución

Dado el tamaño total (~240 párrafos), se crearán scripts modulares:

1. **Parte 1:** Crear actividad + Subactividad 1 (Self-Esteem) - 50 párrafos
2. **Parte 2:** Subactividad 2 (Identify Triggers to Low) - 40 párrafos
3. **Parte 3:** Subactividad 3 (Building Self-Confidence) - 60 párrafos
4. **Parte 4:** Subactividad 4 (Practice Self-Care) - 50 párrafos
5. **Parte 5:** Subactividad 5 (Daily Accomplishments) - 40 párrafos

## Archivos

- `iop-self-esteem-monday-part1.sql` - Actividad + Subactividad 1
- `iop-self-esteem-monday-part2.sql` - Subactividad 2
- `iop-self-esteem-monday-part3.sql` - Subactividad 3
- `iop-self-esteem-monday-part4.sql` - Subactividad 4
- `iop-self-esteem-monday-part5.sql` - Subactividad 5

## Ejecución

```bash
# Ejecutar cada parte en orden
docker exec -i terapia-nota-db psql -U postgres -d terapia_nota_db < database/iop-self-esteem-monday-part1.sql
docker exec -i terapia-nota-db psql -U postgres -d terapia_nota_db < database/iop-self-esteem-monday-part2.sql
docker exec -i terapia-nota-db psql -U postgres -d terapia_nota_db < database/iop-self-esteem-monday-part3.sql
docker exec -i terapia-nota-db psql -U postgres -d terapia_nota_db < database/iop-self-esteem-monday-part4.sql
docker exec -i terapia-nota-db psql -U postgres -d terapia_nota_db < database/iop-self-esteem-monday-part5.sql
```

## Verificación

```sql
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'self-esteem'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY s.subactivity_name;
```

## Nota Importante

⚠️ Estos scripts **NO eliminan** actividades existentes. Solo añaden la actividad "Self-Esteem" a la base de datos.
