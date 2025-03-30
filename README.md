# TisOlimpSansi11
##
 Iniciar FrontEnd

1. Redirigirse a la carpeta TisOlimSansi_FrontEND
```sh
cd TisOlimpSansi_FrontEnd
```

2. Descargar dependencias
```sh
npm install
```

3. Hacer correr el servidor FrontEnd
```sh
npm run dev
```
## 
Iniciar BackEnd

1. Redirigirse a la carpeta TisOlimSansi_FrontEND
```sh
cd TisOlimpSansi_BackEnd
```
2. Instalar composer
```sh
composer install
```
3. Habilitar php key
```sh
php artisan key:generate
```
4. Generar el archivo .env
   
5. Crear la estructura de la base de datos
```sh
php artisan migrate
```
6. Hacer correr el servidor FrontEnd
```sh
php artisan serve
```

F. Formato de migraciones
```sh
php artisan make:migration create_nombre_tabla_table
```

##
 ARREGLAR XAMPP MYSQL 3306
 
 1. Identificar procesos en cmd como administrador
```sh
netstat -ano | findstr :3306
```
2. Encontrar la lista de tareas por PID [el número del final]
```sh
tasklist | findstr [PID]
```
3. Matar el proceso cuantas veces aparezca en el comando anterior.
```sh
taskkill /F /PID [PID]
```
