# Autoflex

Sistema de controle de estoque e produção. Permite cadastrar produtos e matérias-primas, associar os materiais necessários para cada produto e calcular quanto é possível produzir com o estoque disponível, priorizando por valor.

## O que o sistema faz

O fluxo é bem direto: você cadastra as matérias-primas (código, nome e quantidade em estoque), cadastra os produtos (código, nome e valor de venda) e depois define quais matérias-primas e quantidades cada produto precisa. Na tela de cálculo de produção, o sistema mostra quanto você consegue produzir de cada produto com o estoque atual, priorizando os que geram mais valor.

## Tecnologias

O backend é uma API REST em Java com Quarkus, usando Hibernate Panache e H2 em memória por padrão (ou PostgreSQL se você configurar). O frontend é React com Redux para o estado, Material-UI para a interface e React Router para navegação. Os testes incluem JUnit e REST Assured no backend, e Jest e Cypress no frontend.

## Acesso em produção (VPS)

O sistema está disponível em:

- **Aplicação:** http://157.245.185.151:3000
- **API (Swagger):** http://157.245.185.151:3000/swagger-ui
- **API base:** http://157.245.185.151:3000/api

O banco está populado com dados de demonstração para avaliação.

## Como rodar

### Opção 1: Desenvolvimento local (mais rápido)

O backend já vem configurado para usar H2 em memória, então não precisa instalar banco de dados para começar.

**Backend**

```bash
cd backend
./mvnw quarkus:dev
```

A API sobe em http://localhost:8080. A documentação Swagger fica em http://localhost:8080/swagger-ui.

**Frontend**

Em outro terminal:

```bash
cd frontend
npm install
npm start
```

O frontend abre em http://localhost:3000. Ele aponta para o backend em http://localhost:8080 por padrão. Se precisar mudar, crie um arquivo `.env` na pasta frontend com:

```
REACT_APP_API_URL=http://localhost:8080
```

### Opção 2: Docker Compose

Se quiser subir tudo junto com PostgreSQL:

```bash
docker-compose up --build
```

Isso sobe o banco, o backend e o frontend. O frontend fica em http://localhost:3000 e o backend em http://localhost:8080. Você precisa ajustar o `REACT_APP_API_URL` no docker-compose se o frontend for acessar o backend por outro endereço (por exemplo, em produção).

### Opção 3: Usar PostgreSQL no desenvolvimento

Se preferir rodar localmente com PostgreSQL em vez de H2, siga as instruções do README na pasta `backend` para criar o banco e alterar o `application.properties`.

## Testes

**Backend**

```bash
cd backend
./mvnw test
```

Os testes usam H2 em memória, então não depende de PostgreSQL rodando.

**Frontend**

```bash
cd frontend
npm test
```

Para os testes E2E com Cypress:

```bash
npm run cypress:run
```

O backend precisa estar rodando para os testes E2E funcionarem.

## Estrutura do projeto

```
Autoflex/
  backend/     API em Quarkus (Java)
  frontend/    Interface em React
```

Cada pasta tem seu próprio README com mais detalhes sobre configuração, endpoints e estrutura interna.

## API

Os principais recursos são produtos (`/api/products`), matérias-primas (`/api/raw-materials`) e associações produto-matéria-prima (`/api/product-raw-materials`). O cálculo de produção está em `GET /api/production/calculate`. A documentação completa está disponível no Swagger quando o backend está rodando.

## Licença

Autoflex - Projeto desenvolvido para fins de avaliação técnica.
