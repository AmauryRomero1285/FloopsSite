@echo off
title Estructurador de Proyecto Floops Supermarket
echo Configurando carpetas para Floops...

:: 1. RECURSOS ESTÁTICOS (Accesibles desde el navegador)
mkdir "public\assets\images\products" 2>nul
mkdir "public\assets\images\banners" 2>nul
mkdir "public\assets\icons" 2>nul

:: 2. INFRAESTRUCTURA COMPARTIDA (Carpeta COMMON dentro de SRC)
mkdir "src\common\css" 2>nul
mkdir "src\common\js" 2>nul
mkdir "src\common\components" 2>nul
mkdir "src\common\utils" 2>nul

:: 3. VISTAS Y LÓGICA DE NEGOCIO (Dentro de APP)
:: Categorías de Productos
mkdir "src\app\frutas-y-verduras" 2>nul
mkdir "src\app\carnes-y-pescados" 2>nul
mkdir "src\app\lacteos-y-huevos" 2>nul
mkdir "src\app\panaderia-y-reposteria" 2>nul
mkdir "src\app\bebidas" 2>nul
mkdir "src\app\limpieza-y-hogar" 2>nul
mkdir "src\app\cuidado-personal" 2>nul
mkdir "src\app\dental" 2>nul

:: Flujo de Compra
mkdir "src\app\carrito" 2>nul
mkdir "src\app\checkout" 2>nul

:: 4. ARCHIVOS BASE INICIALES (Para evitar que las carpetas esten vacias)
echo /* Estilos globales y scrollbar */ > "src\common\css\global.css"
echo // Logica de modo oscuro y temas > "src\common\js\theme.js"
echo // Funciones de ayuda > "src\common\utils\helpers.js"

echo.
echo ---------------------------------------------------
echo  Estructura Floops generada con exito.
echo  Ubicacion: src/app (Categorias) + src/common (Shared)
echo ---------------------------------------------------
pause
