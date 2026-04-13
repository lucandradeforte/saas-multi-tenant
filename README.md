# TenantFlow | Starter SaaS Multi-tenant

## Visão Geral

TenantFlow é uma base de referência para um SaaS multi-tenant orientado a produto B2B. O projeto combina um frontend em Next.js 15, uma API principal em NestJS, um serviço auxiliar em .NET 8, PostgreSQL, Redis e orquestração com Docker Compose.

Mais do que expor telas e endpoints, este repositório já incorpora preocupações típicas de sistemas reais: onboarding de tenant, segregação de dados por empresa, autenticação com rotação de refresh token, RBAC, cache com invalidação e integração entre serviços com degradação controlada.

### Stack principal

- **Frontend:** Next.js 15 App Router, React 19, TypeScript e Tailwind CSS
- **API principal:** NestJS 10, TypeORM e PostgreSQL
- **Serviço de apoio:** .NET 8 Web API
- **Cache:** Redis
- **Autenticação:** JWT com `access token` e `refresh token`
- **Containerização:** Docker Compose
- **Organização de código:** fronteiras inspiradas em Clean Architecture e DDD

## Objetivo (Para que)

Este projeto foi estruturado para servir como:

- **Base de partida** para acelerar um SaaS multi-tenant sem começar autenticação, isolamento de dados e infraestrutura do zero.
- **Referência arquitetural** para times que precisam separar frontend, API principal e serviços auxiliares com responsabilidades claras.
- **Ambiente de aprendizado prático** para discutir trade-offs reais de engenharia, não apenas um CRUD demonstrativo.
- **Template evolutivo** para adicionar migrações, testes automatizados, observabilidade, permissões mais granulares e automação operacional.

## Decisões Técnicas

### 1. Separação entre `web`, `api` e `reporting-service`

- **Por quê:** fronteiras explícitas reduzem acoplamento e permitem evoluir UX, regras de negócio e capacidades auxiliares em ritmos diferentes.
- **Para quê:** manter a API principal focada no fluxo transacional e usar o serviço .NET para enriquecer relatórios sem contaminar o domínio principal.
- **Como:** o repositório agrupa `apps/web`, `apps/api` e `apps/reporting-service`, com integração HTTP entre NestJS e o serviço de relatórios.
- **Trade-offs:** aumenta o custo de coordenação entre serviços, contratos e observabilidade distribuída.

### 2. Módulos com fronteiras de domínio na API NestJS

- **Por quê:** em sistemas multi-tenant, sem separação clara, controladores, regras de negócio e persistência se misturam cedo.
- **Para quê:** facilitar manutenção, testes e troca de infraestrutura sem reescrever casos de uso.
- **Como:** cada contexto é organizado em `domain`, `application`, `infrastructure` e `presentation`, com módulos como `auth`, `companies`, `users`, `customers`, `dashboard` e `reporting`.
- **Trade-offs:** há mais arquivos e um pouco mais de ceremony inicial do que em uma API CRUD simples.

### 3. JWT com rotação de refresh token e cookies HttpOnly no frontend

- **Por quê:** autenticação stateless simplifica escala horizontal, mas refresh token exige proteção extra para reduzir impacto de vazamento.
- **Para quê:** oferecer sessão persistente sem expor tokens ao código cliente do navegador.
- **Como:** a API emite `access token` e `refresh token`, salva apenas o hash do refresh token no backend, e o frontend grava os tokens em cookies `HttpOnly`, renovando sessão via route handlers e `middleware.ts`.
- **Trade-offs:** o fluxo de autenticação fica mais elaborado e exige cuidado extra com expiração, cookies e redirecionamentos.

### 4. Isolamento multi-tenant orientado pelo token autenticado

- **Por quê:** em SaaS B2B, vazamento de dados entre empresas é um risco funcional e reputacional crítico.
- **Para quê:** garantir que listagens, consultas, métricas e mutações operem sempre no escopo correto do tenant autenticado.
- **Como:** o `companyId` viaja no payload do JWT e é aplicado pelos casos de uso e repositórios nas queries; o RBAC complementa esse isolamento restringindo mutações ao papel `admin`.
- **Trade-offs:** todo novo endpoint precisa manter a mesma disciplina de scoping, o que exige consistência nas evoluções do código.

### 5. Cache de dashboard em Redis com invalidação por tenant

- **Por quê:** dashboard combina agregações de banco e integração externa, o que aumenta latência e custo computacional.
- **Para quê:** responder rápido às leituras mais frequentes sem comprometer totalmente a consistência operacional.
- **Como:** as métricas são cacheadas no Redis por 60 segundos em `dashboard:metrics:{companyId}` e o cache é invalidado nas operações de criar, atualizar e remover clientes.
- **Trade-offs:** há uma janela curta de eventual consistency e o time precisa tratar indisponibilidade do Redis com elegância.

### 6. Integração interna com serviço de relatórios protegida por chave e com fallback local

- **Por quê:** chamadas internas entre serviços precisam de proteção mínima e não podem derrubar o dashboard por conta de uma dependência auxiliar.
- **Para quê:** enriquecer a visão operacional do tenant sem acoplar diretamente o frontend ao serviço secundário.
- **Como:** o NestJS chama `POST /api/reports/summary` com `x-internal-api-key`; se o serviço estiver indisponível, a API principal gera um resumo local e continua respondendo.
- **Trade-offs:** o fallback evita indisponibilidade total, mas oferece insights menos sofisticados que o serviço dedicado.

### 7. `DB_SYNCHRONIZE=true` em desenvolvimento

- **Por quê:** reduz fricção para subir o projeto rapidamente e validar o fluxo fim a fim.
- **Para quê:** acelerar onboarding local e iteração inicial sobre o modelo de dados.
- **Como:** o TypeORM liga `synchronize` por variável de ambiente.
- **Trade-offs:** essa estratégia não é adequada para produção; o passo seguinte natural é migrar para migrações versionadas.

## Arquitetura

### Visão de alto nível

```text
Navegador
  -> Next.js (`apps/web`)
     -> middleware e route handlers
     -> cookies HttpOnly
     -> proxy para a API principal
  -> NestJS (`apps/api`)
     -> auth, companies, users, customers, dashboard, reporting
     -> PostgreSQL
     -> Redis
     -> chamada HTTP interna para o serviço de relatórios
  -> .NET 8 (`apps/reporting-service`)
     -> POST /api/reports/summary
     -> GET /health
```

### Estrutura do repositório

```text
apps/
  api/                API principal em NestJS
  reporting-service/  Serviço auxiliar de relatórios em .NET 8
  web/                Frontend em Next.js
```

### Organização interna dos serviços

**API principal (`apps/api`)**

- `domain`: entidades e contratos de repositório
- `application`: casos de uso
- `infrastructure`: persistência TypeORM, segurança e integrações externas
- `presentation`: DTOs e controllers

Módulos principais:

- `auth`
- `companies`
- `users`
- `customers`
- `dashboard`
- `reporting`

**Serviço de relatórios (`apps/reporting-service`)**

- `ReportingService.Domain`
- `ReportingService.Application`
- `ReportingService.Infrastructure`
- `ReportingService.Api`

**Frontend (`apps/web`)**

- App Router com route groups
- páginas server-side para dashboard e customers
- `middleware.ts` para proteger rotas e renovar sessão
- route handlers para login, registro, refresh, logout e proxy autenticado da API
- componentes cliente para formulários de autenticação e mutações de clientes

### Endpoints principais

**Autenticação**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Clientes**

- `GET /api/customers`
- `GET /api/customers/:id`
- `POST /api/customers`
- `PATCH /api/customers/:id`
- `DELETE /api/customers/:id`

**Dashboard**

- `GET /api/dashboard/metrics`

**Relatórios internos**

- `POST /api/reports/summary`
- `GET /health`

## Funcionalidades

- Onboarding de tenant com criação da empresa e do primeiro usuário administrador no fluxo de registro.
- Login, logout e renovação de sessão com `access token` e `refresh token`.
- Armazenamento de tokens em cookies `HttpOnly`, reduzindo exposição no browser.
- Controle de acesso por perfil com papéis `admin` e `user`.
- CRUD de clientes isolado por tenant.
- Status de cliente com estados `lead`, `active` e `inactive`.
- Dashboard com contagem de usuários, administradores, clientes totais, clientes ativos e crescimento dos últimos 30 dias.
- Cache do dashboard em Redis com TTL curto e invalidação por tenant nas mutações de clientes.
- Integração com serviço de relatórios em .NET 8 protegida por `x-internal-api-key`.
- Fallback local na API principal quando o serviço de relatórios estiver indisponível.
- Validação global de payloads com transformação, whitelist e rejeição de campos não permitidos.
- Proteção de rotas do frontend para `/dashboard`, `/customers` e `/api/proxy`.

## Como executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js
- npm
- .NET 8 SDK

### 1. Configurar variáveis de ambiente

Na raiz do projeto:

```bash
cp .env.example .env
```

Revise portas, segredos e URLs antes de executar. Há exemplos específicos para cada serviço em:

- `apps/api/.env.example`
- `apps/web/.env.example`
- `apps/reporting-service/.env.example`

### 2. Executar com Docker Compose

```bash
docker compose up --build
```

Serviços disponíveis:

- Frontend: `http://localhost:3000`
- API NestJS: `http://localhost:4000/api`
- Serviço de relatórios: `http://localhost:5050`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

Após subir o ambiente, acesse `http://localhost:3000/register` para criar o primeiro tenant administrador.

### 3. Executar localmente sem containerizar tudo

Suba a infraestrutura compartilhada:

```bash
docker compose up postgres redis reporting-service
```

Instale as dependências JavaScript:

```bash
cd apps/api && npm install
```

```bash
cd apps/web && npm install
```

Em terminais separados, a partir da raiz do repositório, execute:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Para rodar o serviço .NET manualmente:

```bash
cd apps/reporting-service/src/ReportingService.Api && dotnet run
```

### Observações operacionais

- `DB_SYNCHRONIZE=true` está habilitado por conveniência em desenvolvimento.
- Em produção, substitua `synchronize` por migrações versionadas.
- O Redis é opcional do ponto de vista funcional; sem `REDIS_URL`, a aplicação continua operando sem cache.
- O serviço de relatórios também é opcional em runtime; se estiver fora do ar, a API principal devolve um resumo local.

## Melhorias futuras

- Adotar migrações de banco para a API NestJS e remover dependência de `synchronize`.
- Cobrir autenticação, renovação de sessão, RBAC, CRUD de clientes e métricas com testes automatizados.
- Tornar o onboarding de tenant transacional ou compensável para evitar inconsistências parciais em falhas intermediárias.
- Evoluir RBAC para permissões granulares por recurso e ação.
- Adicionar observabilidade com logs estruturados, tracing e métricas de integração entre serviços.
- Introduzir CI/CD com validação de build, lint e testes antes de deploy.
- Considerar um gateway ou BFF mais explícito caso a orquestração entre serviços cresça.
- Avaliar processamento assíncrono para relatórios mais pesados.

## Diferenciais técnicos

- O isolamento multi-tenant não fica só na UI; ele é propagado do token até as queries de repositório.
- O refresh token não é persistido em texto puro; a aplicação armazena apenas o hash no backend.
- O frontend usa route handlers e cookies `HttpOnly`, reduzindo acoplamento entre sessão e componentes cliente.
- O dashboard foi desenhado com desempenho e resiliência em mente: cache por tenant, invalidação em mutações e fallback quando dependências falham.
- A integração entre NestJS e .NET é pequena, objetiva e protegida por chave interna, o que facilita evolução sem contaminar o core transacional.
- A organização por casos de uso deixa a base preparada para crescer sem transformar controllers em pontos centrais de regra de negócio.
