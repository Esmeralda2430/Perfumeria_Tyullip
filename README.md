# API REST Perfumería Tyullip (Con Soporte de Imágenes)

## Carga de Archivos
- Las imágenes se cargan mediante peticiones `form-data` utilizando la clave `imagen`.
- Las imágenes se organizan dinámicamente en:
  - `/uploads/productos/`
  - `/uploads/clientes/`
- Servidas de manera estática a través de `http://localhost:3000/uploads/[entidad]/[archivo]`.