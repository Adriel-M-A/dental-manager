# Dental Manager 🦷

Sistema de gestión de escritorio para consultorios odontológicos. Diseñado para ser una solución eficiente, rápida y local para la administración de pacientes, turnos y finanzas.

> **Estado:** En desarrollo (v1.0.0)
> **Arquitectura:** Electron + React + TypeScript + SQLite

## 🎯 Objetivo del Proyecto (v1.0.0)

Crear una aplicación de escritorio para un único usuario (el odontólogo/a) que permita gestionar el flujo diario del consultorio sin depender de conexión a internet.

### Funcionalidades Principales

1.  **Gestión de Pacientes (CRUD):**
    - Alta de pacientes con datos personales y médicos (alergias).
    - Historial clínico y de tratamientos.
2.  **Agenda de Turnos:**
    - Visualización de citas.
    - Estados de turno: Pendiente, Completado, Cancelado, Ausente.
3.  **Control de Caja:**
    - Registro de pagos (Efectivo/Transferencia).
    - Reporte de ingresos.
4.  **Catálogo de Tratamientos:**
    - Lista de precios base para agilizar la carga.

---

## 🛠️ Stack Tecnológico

- **Core:** [Electron](https://www.electronjs.org/) (Motor de escritorio)
- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Tipado estricto)
- **Base de Datos:** [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) (Local y síncrona)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Manejo de Fechas:** [date-fns](https://date-fns.org/)

---

## 🗄️ Esquema de Base de Datos

La aplicación utiliza una base de datos relacional SQLite local (`dental.db`).

### Tablas Principales

- **`patients`**: Información personal, DNI, contacto y notas médicas.
- **`appointments`**: Turnos asociados a un paciente (Fecha, Hora, Estado).
- **`treatments`**: Catálogo de prestaciones y precios base.
- **`clinical_records`**: Historial de lo realizado en cada sesión (Evolución).
- **`payments`**: Registro de ingresos monetarios.

---

## 🚀 Instalación y Desarrollo

### Requisitos previos

- Node.js (Recomendado v20 o superior)
- Git

### Pasos para iniciar

1.  **Clonar el repositorio:**

    ```bash
    git clone [https://github.com/tu-usuario/dental-manager.git](https://github.com/tu-usuario/dental-manager.git)
    cd dental-manager
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Compilar dependencias nativas (SQLite):**
    Si cambias de sistema operativo o versión de Node, ejecuta:

    ```bash
    npm run postinstall
    ```

4.  **Iniciar en modo desarrollo:**
    ```bash
    npm run dev
    ```
