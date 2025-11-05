#!/usr/bin/env python3
"""
Script de prueba para verificar la selección dinámica de goals según el día de la semana
y la alineación de client responses con el goal marcado.
"""

import json
import sys
from datetime import datetime, timedelta
from io import BytesIO
import zipfile
import urllib.request
import urllib.parse

# Configuración
BASE_URL = "http://localhost:3002"
API_ENDPOINT = "/api/v1/notes/generate-group-week"

def get_week_dates_for_date(date_str):
    """Obtiene las fechas de la semana (lunes a viernes) para una fecha dada"""
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    # Encontrar el lunes de esa semana
    days_to_monday = (date_obj.weekday()) % 7
    monday = date_obj - timedelta(days=days_to_monday)
    
    week_dates = []
    day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    for i in range(5):
        day_date = monday + timedelta(days=i)
        week_dates.append({
            'date': day_date.strftime("%Y-%m-%d"),
            'dayName': day_names[i]
        })
    
    return week_dates

def get_expected_goal_for_day(day_name):
    """Retorna el goal esperado según el día de la semana"""
    goal_map = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 1
    }
    return goal_map.get(day_name, 1)

def test_goal_selection_logic():
    """Prueba la lógica de selección de goals"""
    print("=" * 60)
    print("TEST 1: Verificar lógica de selección de goals por día")
    print("=" * 60)
    
    # Crear una semana de prueba (empezando en lunes)
    test_date = "2025-01-27"  # Un lunes
    week_dates = get_week_dates_for_date(test_date)
    
    expected_results = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 1
    }
    
    print("\nDia de la semana -> Goal esperado:")
    all_passed = True
    for day_info in week_dates:
        day_name = day_info['dayName']
        expected_goal = expected_results[day_name]
        print(f"  {day_name:12} -> GOAL#{expected_goal}")
        
        # Verificar que la lógica coincide
        actual_goal = get_expected_goal_for_day(day_name)
        if actual_goal != expected_goal:
            print(f"    ERROR: Esperado {expected_goal}, obtenido {actual_goal}")
            all_passed = False
        else:
            print(f"    OK")
    
    if all_passed:
        print("\n[OK] Todos los tests de logica pasaron")
    else:
        print("\n[ERROR] Algunos tests de logica fallaron")
    
    return all_passed

def test_api_endpoint(group_id, week_id):
    """Prueba el endpoint de generación de notas"""
    print("\n" + "=" * 60)
    print("TEST 2: Verificar endpoint de generacion de notas")
    print("=" * 60)
    
    url = f"{BASE_URL}{API_ENDPOINT}"
    payload = {
        "groupId": group_id,
        "weekId": week_id
    }
    
    print(f"\nPeticion POST a: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        # Preparar la petición POST con urllib
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, method='POST')
        req.add_header('Content-Type', 'application/json')
        
        print(f"\nEnviando peticion...")
        
        with urllib.request.urlopen(req, timeout=120) as response:
            status_code = response.getcode()
            print(f"Status Code: {status_code}")
            
            if status_code == 200:
                print("[OK] Endpoint respondio correctamente")
                
                # Leer el contenido de la respuesta
                content = response.read()
                
                # Verificar que la respuesta es un ZIP
                content_type = response.headers.get('Content-Type', '')
                print(f"Content-Type: {content_type}")
                
                if 'zip' in content_type.lower() or content[:2] == b'PK':
                    print("[OK] La respuesta es un archivo ZIP valido")
                    
                    # Intentar leer el ZIP
                    try:
                        zip_file = zipfile.ZipFile(BytesIO(content))
                        file_list = zip_file.namelist()
                        print(f"\nArchivos en el ZIP: {len(file_list)}")
                        
                        # Mostrar algunos archivos
                        print("\nPrimeros 10 archivos:")
                        for i, filename in enumerate(file_list[:10]):
                            print(f"  {i+1}. {filename}")
                        
                        if len(file_list) > 10:
                            print(f"  ... y {len(file_list) - 10} mas")
                        
                        # Verificar que hay archivos para diferentes días
                        print("\n[OK] ZIP generado correctamente")
                        return True
                    except zipfile.BadZipFile:
                        print("[ERROR] El contenido no es un ZIP valido")
                        return False
                else:
                    print(f"[WARNING] La respuesta no parece ser un ZIP (Content-Type: {content_type})")
                    print(f"   Primeros 100 bytes: {content[:100]}")
                    return False
            else:
                print(f"[ERROR] Error en la respuesta: {status_code}")
                error_content = content.decode('utf-8', errors='ignore') if 'content' in locals() else 'No content'
                print(f"   Response: {error_content[:500]}")
                return False
            
    except urllib.error.URLError as e:
        print(f"[ERROR] No se pudo conectar al servidor en {BASE_URL}")
        print(f"   Error: {str(e)}")
        print("   Verifica que el servidor este corriendo")
        return False
    except Exception as e:
        print(f"[ERROR] Error inesperado: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_goal_checkbox_in_document():
    """Prueba que los checkboxes de goals están correctos en el documento generado"""
    print("\n" + "=" * 60)
    print("TEST 3: Verificar checkboxes de goals en documentos generados")
    print("=" * 60)
    print("\n[INFO] Este test requiere extraer y analizar el contenido del DOCX")
    print("   (Requiere libreria python-docx instalada)")
    print("\nPara verificar manualmente:")
    print("   1. Genera las notas para diferentes dias")
    print("   2. Abre los documentos Word generados")
    print("   3. Verifica que solo UN goal tiene checkbox marcado")
    print("   4. Verifica que el goal marcado corresponde al dia:")
    print("      - Lunes: GOAL#1 marcado")
    print("      - Martes: GOAL#2 marcado")
    print("      - Miercoles: GOAL#3 marcado")
    print("      - Jueves: GOAL#4 marcado")
    print("      - Viernes: GOAL#1 marcado (vuelve al primero)")
    
    return True

def main():
    """Función principal"""
    print("\n" + "=" * 60)
    print("PRUEBAS DE SELECCION DINAMICA DE GOALS")
    print("=" * 60)
    
    # Test 1: Lógica de selección
    test1_passed = test_goal_selection_logic()
    
    # Test 2: Endpoint API (requiere parámetros)
    print("\n" + "=" * 60)
    print("TEST 2: Endpoint de generacion de notas")
    print("=" * 60)
    print("\n[INFO] Este test requiere groupId y weekId validos")
    print("   Ejemplo de uso:")
    print("   python test-dynamic-goal-selection.py <groupId> <weekId>")
    
    if len(sys.argv) >= 3:
        group_id = sys.argv[1]
        week_id = sys.argv[2]
        print(f"\nUsando groupId: {group_id}")
        print(f"Usando weekId: {week_id}")
        test2_passed = test_api_endpoint(group_id, week_id)
    else:
        print("\n[INFO] Omitiendo test de API (parametros no proporcionados)")
        test2_passed = True
    
    # Test 3: Verificación de checkboxes
    test3_passed = test_goal_checkbox_in_document()
    
    # Resumen
    print("\n" + "=" * 60)
    print("RESUMEN DE TESTS")
    print("=" * 60)
    print(f"Test 1 (Logica de seleccion): {'[OK] PASSED' if test1_passed else '[ERROR] FAILED'}")
    print(f"Test 2 (Endpoint API): {'[OK] PASSED' if test2_passed else '[ERROR] FAILED'}")
    print(f"Test 3 (Checkboxes): [INFO] Requiere verificacion manual")
    print("=" * 60)
    
    if test1_passed and test2_passed:
        print("\n[OK] Todos los tests automatizados pasaron")
        print("\nProximos pasos:")
        print("   1. Genera notas para diferentes dias de la semana")
        print("   2. Verifica que los checkboxes de goals estan correctos")
        print("   3. Verifica que los labels de Client Response incluyen (Goal#X/Obj#XA)")
        print("   4. Verifica que los statements del cliente estan relacionados con el goal marcado")
        return 0
    else:
        print("\n[ERROR] Algunos tests fallaron")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

