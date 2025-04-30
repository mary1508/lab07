# Proyecto Inscripción de Cursos usando Node.js y Express, con SQLite

## Instrucciones para clonar y ejecutar el proyecto

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/JhosepLS/iw-grupo-a.git
   cd iw-grupo-a/lab07
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Crear el directorio para la base de datos** (si no existiera):
   ```bash
   mkdir -p db
   ```

4. **Iniciar la aplicación**:
   ```bash
   npm run dev  # Para desarrollo con recarga automática
   # o
   npm start    # Para ejecución normal
   ```

5. **Acceder a la aplicación**:
   - Entrar a: http://localhost:3000

## Algunos problemas comunes que pudiera haber

- **Error "Cannot find module"**: Asegurarse que se haya ejecutado `npm install` y todas las dependencias se hayan instalado correctamente.
- **Error de base de datos**: Verifica que exista el directorio `db` en la raíz del proyecto.
```
