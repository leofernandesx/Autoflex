# Backend - API de Controle de Estoque e Produção

API REST desenvolvida com Quarkus para gerenciamento de produtos, matérias-primas e cálculo de produção.

## 🚀 Tecnologias

- **Quarkus 3.6.4** - Framework Java supersônico
- **Hibernate ORM with Panache** - ORM simplificado
- **PostgreSQL** - Banco de dados relacional
- **RESTEasy Reactive** - Endpoints REST reativos
- **SmallRye OpenAPI** - Documentação Swagger
- **JUnit 5** - Testes unitários
- **REST Assured** - Testes de integração

## 📋 Pré-requisitos

- Java 17 ou superior
- Maven 3.8+
- PostgreSQL 14+

## 🔧 Configuração

### 1. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE autoflex;

# Criar usuário (opcional)
CREATE USER autoflex_user WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE autoflex TO autoflex_user;
```

### 2. Configurar application.properties

Edite `src/main/resources/application.properties` se necessário:

```properties
quarkus.datasource.username=postgres
quarkus.datasource.password=postgres
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/autoflex
```

## ▶️ Executar

### Modo Desenvolvimento (com hot reload)

```bash
./mvnw quarkus:dev
```

A API estará disponível em `http://localhost:8080`

### Modo Produção

```bash
# Compilar
./mvnw package

# Executar
java -jar target/quarkus-app/quarkus-run.jar
```

## 🧪 Testes

```bash
# Executar todos os testes
./mvnw test

# Executar testes com cobertura
./mvnw test jacoco:report
```

## 📚 Documentação da API

### Swagger UI

Acesse: `http://localhost:8080/swagger-ui`

### OpenAPI Spec

Acesse: `http://localhost:8080/swagger`

## 🔗 Endpoints Principais

### Produtos
- `GET /api/products` - Listar todos
- `GET /api/products/{id}` - Buscar por ID
- `POST /api/products` - Criar novo
- `PUT /api/products/{id}` - Atualizar
- `DELETE /api/products/{id}` - Excluir

### Matérias-primas
- `GET /api/raw-materials` - Listar todos
- `GET /api/raw-materials/{id}` - Buscar por ID
- `POST /api/raw-materials` - Criar novo
- `PUT /api/raw-materials/{id}` - Atualizar
- `DELETE /api/raw-materials/{id}` - Excluir

### Associações Produto-Matéria-prima
- `GET /api/product-raw-materials` - Listar todos
- `GET /api/product-raw-materials/product/{productId}` - Por produto
- `POST /api/product-raw-materials` - Criar associação
- `PUT /api/product-raw-materials/{id}` - Atualizar
- `DELETE /api/product-raw-materials/{id}` - Excluir

### Cálculo de Produção
- `GET /api/production/calculate` - Calcular produção possível

## 🏗️ Estrutura do Projeto

```
src/main/java/com/autoflex/
├── entity/              # Entidades JPA
│   ├── Product.java
│   ├── RawMaterial.java
│   └── ProductRawMaterial.java
├── dto/                 # Data Transfer Objects
│   ├── ProductDTO.java
│   ├── RawMaterialDTO.java
│   ├── ProductRawMaterialDTO.java
│   └── ProductionCalculationDTO.java
├── service/             # Lógica de negócio
│   ├── ProductService.java
│   ├── RawMaterialService.java
│   ├── ProductRawMaterialService.java
│   └── ProductionService.java
├── resource/            # Endpoints REST
│   ├── ProductResource.java
│   ├── RawMaterialResource.java
│   ├── ProductRawMaterialResource.java
│   └── ProductionResource.java
└── exception/           # Tratamento de exceções
    ├── ErrorResponse.java
    └── GlobalExceptionHandler.java
```

## 🧮 Algoritmo de Cálculo de Produção

O `ProductionService` implementa um algoritmo guloso (greedy) que:

1. Ordena produtos por valor (decrescente)
2. Para cada produto:
   - Calcula quantidade máxima baseada no estoque disponível
   - Aloca matérias-primas para produção
   - Atualiza estoque virtual
3. Retorna lista priorizada com valor total

**Complexidade:** O(n × m) onde n = produtos, m = matérias-primas

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

Verifique se o PostgreSQL está rodando:
```bash
sudo systemctl status postgresql
```

### Porta 8080 já em uso

Mude a porta em `application.properties`:
```properties
quarkus.http.port=8081
```

### Testes falhando

Os testes usam H2 in-memory. Não é necessário PostgreSQL para testes.

## 📄 Licença

Autoflex © 2024
