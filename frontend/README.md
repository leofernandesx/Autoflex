# Frontend - Sistema de Controle de Estoque e Produção

Interface web responsiva desenvolvida com React para gerenciamento de produtos, matérias-primas e visualização de produção.

## Tecnologias

- **React 18** - Biblioteca JavaScript para UI
- **Redux Toolkit** - Gerenciamento de estado
- **React Router** - Navegação SPA
- **Material-UI (MUI)** - Componentes UI
- **Axios** - Cliente HTTP
- **Jest** - Testes unitários
- **React Testing Library** - Testes de componentes
- **Cypress** - Testes E2E

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend rodando em `http://localhost:8080`

## Instalação

```bash
# Instalar dependências
npm install
```

## Executar

### Modo Desenvolvimento

```bash
npm start
```

Abre automaticamente em `http://localhost:3000`

### Build de Produção

```bash
npm run build
```

Arquivos otimizados em `build/`

## Testes

### Testes Unitários

```bash
# Executar testes
npm test

# Executar com cobertura
npm test -- --coverage
```

### Testes E2E (Cypress)

```bash
# Interface interativa
npm run cypress:open

# Modo headless
npm run cypress:run
```

**Importante:** Backend deve estar rodando antes de executar testes Cypress!

## Funcionalidades

### 1. Gestão de Produtos
- Listar produtos com código, nome e valor
- Criar, editar e excluir produtos
- Gerenciar matérias-primas associadas
- Validação de formulários

### 2. Gestão de Matérias-primas
- Listar matérias-primas com estoque
- CRUD completo
- Controle de quantidade em estoque
- Validação de valores não-negativos

### 3. Associação Produto-Matéria-prima
- Interface integrada ao cadastro de produtos
- Adicionar/remover matérias-primas necessárias
- Definir quantidade requerida por produto
- Visualização clara das associações

### 4. Cálculo de Produção
- Dashboard com resumo visual
- Tabela de produtos priorizados por valor
- Indicadores de quantidade e valor total
- Recálculo em tempo real

## Responsividade

O sistema é totalmente responsivo e funciona em:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Layout.js
│   ├── Products.js
│   ├── RawMaterials.js
│   ├── ProductRawMaterialsDialog.js
│   └── ProductionCalculation.js
├── store/               # Redux
│   ├── index.js
│   └── slices/
│       ├── productsSlice.js
│       ├── rawMaterialsSlice.js
│       ├── productRawMaterialsSlice.js
│       └── productionSlice.js
├── services/            # Integração com API
│   └── api.js
├── App.js               # Componente raiz
└── index.js             # Entry point
```

## Integração com Backend

### Configuração da API

Edite `.env`:

```env
REACT_APP_API_URL=http://localhost:8080
```

### Serviços Disponíveis

```javascript
// Produtos
productsApi.getAll()
productsApi.create(data)
productsApi.update(id, data)
productsApi.delete(id)

// Matérias-primas
rawMaterialsApi.getAll()
rawMaterialsApi.create(data)
// ...

// Produção
productionApi.calculate()
```

## Fluxo de Uso

1. **Cadastrar Matérias-primas**
   - Navegar para "Matérias-primas"
   - Clicar em "Nova Matéria-prima"
   - Preencher código, nome e quantidade em estoque

2. **Cadastrar Produtos**
   - Navegar para "Produtos"
   - Clicar em "Novo Produto"
   - Preencher código, nome e valor

3. **Associar Matérias-primas**
   - Na lista de produtos, clicar no ícone de configuração
   - Selecionar matéria-prima e quantidade necessária
   - Clicar em "Adicionar"

4. **Calcular Produção**
   - Navegar para "Cálculo de Produção"
   - Ver produtos sugeridos priorizados por valor
   - Recalcular quando necessário

## Temas e Estilos

O sistema usa Material-UI com tema customizado:

```javascript
{
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
}
```

## Troubleshooting

### Erro de CORS

Verifique se o backend está configurado para aceitar requisições do frontend:
```properties
# Backend application.properties
quarkus.http.cors.origins=http://localhost:3000
```

### Erro ao conectar com API

1. Verifique se o backend está rodando
2. Confirme a URL em `.env`
3. Verifique o console do navegador para detalhes

### Testes Cypress falhando

1. Backend deve estar rodando
2. Frontend deve estar rodando
3. Banco de dados deve estar acessível

## Estado da Aplicação (Redux)

```javascript
{
  products: {
    items: [],
    loading: false,
    error: null
  },
  rawMaterials: { ... },
  productRawMaterials: { ... },
  production: {
    calculation: null,
    loading: false,
    error: null
  }
}
```

## Deploy

### Build

```bash
npm run build
```

### Servir Estático

```bash
# Com serve
npx serve -s build -l 3000

# Com nginx
# Copiar build/ para /var/www/html
```

## Licença

Autoflex © 2024
