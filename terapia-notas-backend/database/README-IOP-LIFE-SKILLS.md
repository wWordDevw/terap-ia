# Scripts SQL Modulares para IOP Life Skills - LUNES

## Estructura Modular

Este conjunto de scripts SQL inserta las actividades de IOP para el día LUNES de manera incremental y modular.

### Plan de Ejecución

1. **Parte 1**: `iop-life-skills-monday-part1.sql` - Actividad Life Skills + Subactividad "Decision making" (párrafos 1-10)
2. **Parte 2**: `iop-life-skills-monday-part2.sql` - Subactividad "Decision making" (párrafos 11-20)
3. **Parte 3**: `iop-life-skills-monday-part3.sql` - Subactividad "Decision making" (párrafos 21-30)
4. **Parte 4**: `iop-life-skills-monday-part4.sql` - Subactividad "Decision making" (párrafos 31-40)
5. **Parte 5**: `iop-life-skills-monday-part5.sql` - Subactividad "Management of emotions" (párrafos 1-8)
6. **Parte 6**: `iop-life-skills-monday-part6.sql` - Subactividad "Daily Routines" (párrafos 1-20)
7. **Parte 7**: `iop-life-skills-monday-part7.sql` - Subactividad "Daily Routines" (párrafos 21-40)
8. **Parte 8**: `iop-life-skills-monday-part8.sql` - Subactividad "Housework Management" (párrafos 1-20)
9. **Parte 9**: `iop-life-skills-monday-part9.sql` - Subactividad "Housework Management" (párrafos 21-44)
10. **Parte 10**: `iop-life-skills-monday-part10.sql` - Subactividad "Role of the family in life skills" (párrafos 1-20)
11. **Parte 11**: `iop-life-skills-monday-part11.sql` - Subactividad "Role of the family in life skills" (párrafos 21-36)

## Cómo Ejecutar

### Opción 1: Ejecutar todos los scripts en orden
```bash
cd database
for file in iop-life-skills-monday-part*.sql; do
    psql -h localhost -U postgres -d terapia_nota_db -f "$file"
done
```

### Opción 2: Ejecutar scripts individuales
```bash
psql -h localhost -U postgres -d terapia_nota_db -f database/iop-life-skills-monday-part1.sql
psql -h localhost -U postgres -d terapia_nota_db -f database/iop-life-skills-monday-part2.sql
# ... etc
```

### Opción 3: Ejecutar desde Docker
```bash
docker exec -i terapia-nota-db psql -U postgres -d terapia_nota_db < database/iop-life-skills-monday-part1.sql
```

## Verificación

Después de ejecutar cada parte, puedes verificar con:

```sql
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'life skills'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY s.subactivity_name;
```

## Características

- **Idempotente**: Cada script verifica si los datos ya existen antes de insertarlos
- **Modular**: Cada script es independiente y puede ejecutarse por separado
- **Incremental**: Puedes ejecutar los scripts en el orden que prefieras
- **Sin duplicados**: Los scripts usan `WHERE NOT EXISTS` para evitar duplicados

## Estado Actual

- ✅ Parte 1: Creada (Decision making párrafos 1-10)
- ⏳ Parte 2-11: Pendientes de crear

## Notas

- Todos los scripts buscan o crean la actividad "Life Skills" si no existe
- Cada subactividad se crea solo si no existe
- Los párrafos se insertan solo si no existen (comparación por texto completo)
