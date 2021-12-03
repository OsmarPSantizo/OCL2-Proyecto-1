# Proyecto 1 Guía
---
En la carpeta src/ts se estará trabajando lo que es el interpréte utilizando TypeScript.

Para utilizar el demon (actualización automática por cualquier cambio), se deben de instalar los módulos de node definidos en el package.json de la siguiente manera:

```bash
    >> npm install
```
Posteriormente, el comando para correr la aplicación en un ambiente de desarrollo es el siguiente:

```bash
    >> npm run dev
```

De último, se transpilan los archivos .ts con el siguiente comando:
```bash
    >> tsc --build
```
O su forma abreviada,
```bash
    >> tsc -b
```

Los archivos .js que genera este comando se almacenarán en **src/build**.
