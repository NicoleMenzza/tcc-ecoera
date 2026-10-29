# EcoEra Backend

API REST (Spring Boot 4 + SQL Server) do EcoEra.

## Rodar
1. Suba o SQL Server e crie o banco: `CREATE DATABASE ecoera_db;`
2. Ajuste `src/main/resources/application.properties` (ou use as variaveis DB_URL, DB_USER, DB_PASSWORD).
3. `./mvnw spring-boot:run` -> http://localhost:8080

## Endpoints
- GET /api/home
- /api/pontos, /api/materiais, /api/recompensas, /api/trocas, /api/v1/produtos
