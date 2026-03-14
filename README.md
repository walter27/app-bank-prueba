# App Bank Prueba

Este proyecto implementa **Screaming Architecture / Clean Architecture en Front-End**.

Referencia recomendada:
- https://the-amazing-gentleman-programming-book.vercel.app/es/book/Chapter08_Clean_Architecture_Front_End

## Estructura de carpetas

```text
src/
├─ app/
│  ├─ components/
│  │  ├─ form/
│  │  ├─ message/
│  │  ├─ modal/
│  │  └─ table/
│  ├─ models/
│  ├─ product/
│  │  ├─ adapters/
│  │  ├─ config/
│  │  ├─ models/
│  │  ├─ services/
│  │  └─ store/
│  ├─ store/
│  ├─ app.ts
│  ├─ app.routes.ts
│  └─ app.config.ts
├─ environments/
├─ styles.css
├─ main.ts
└─ main.server.ts
```

## Prerrequisitos

Instala lo siguiente en tu equipo:

1. Node.js (recomendado LTS 20+)
2. Git
3. Angular CLI
4. Bun
5. Proyecto backend Node.js llamado **`repo-interview-main`**

Comandos útiles para verificar instalación:

```bash
node -v
npm -v
git --version
ng version
bun --version
```

Instalación global de Angular CLI (si no lo tienes):

```bash
npm install -g @angular/cli
```

## Levantar backend (repo-interview-main)

1. Clona o ubica el proyecto `repo-interview-main`.
2. Entra a la carpeta del backend.
3. Instala dependencias.
4. Ejecuta el servidor.
5. Verifica que quede disponible en `http://localhost:3002` (base usada por este frontend).

Ejemplo genérico:

```bash
cd repo-interview-main
npm install
npm run start:dev
```

Nota:
- Si el backend usa otro script (`dev`, `start:dev`, etc.), usa el definido en su `package.json`.

## Levantar frontend (este proyecto Angular)

1. En una terminal nueva, entra a este proyecto.
2. Instala dependencias.
3. Ejecuta Angular.

```bash
cd app-bank-prueba
npm install
npm start
```

La aplicación debe abrir en:

- http://localhost:4200/products

## Scripts principales

```bash
npm start          # Levanta Angular en desarrollo
npm run build      # Compila la app
npm test           # Ejecuta pruebas unitarias con Jest
npm run test:watch # Ejecuta Jest en modo watch
```

## Flujo recomendado de ejecución

1. Levantar primero `repo-interview-main` (backend).
2. Levantar luego `app-bank-prueba` (frontend).
3. Abrir `http://localhost:4200/products`.

## Solución de problemas rápida

- Si falla el consumo de APIs, valida que backend esté arriba en `localhost:3002`.
- Si `ng` no existe, reinstala Angular CLI global.
- Si hay conflicto de dependencias, elimina `node_modules` y reinstala:

```bash
rm -rf node_modules package-lock.json   # Linux/Mac
# o en PowerShell:
# Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```
