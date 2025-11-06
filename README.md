
# 🎬 **CineReview**

> Plataforma  para avaliação e discussão de filmes, construída com **Next.js**, **TypeScript**, **Prisma** e **Tailwind CSS**.

O **CineReview** é uma aplicação web que permite aos usuários **explorar filmes**, **avaliar produções**, **escrever reviews** e **interagir com a comunidade**.
A aplicação consome dados da **API do The Movie Database (TMDB)** e oferece uma experiência fluida e responsiva com um design moderno e intuitivo.

---

## 📚 **Sumário**

* [Visão Geral](#-visão-geral)
* [Principais Funcionalidades](#-principais-funcionalidades)
* [Arquitetura do Projeto](#-arquitetura-do-projeto)
* [Tecnologias e Ferramentas](#-tecnologias-e-ferramentas)
* [Instalação e Configuração](#-instalação-e-configuração)
* [Rotas e Endpoints](#-rotas-e-endpoints)
* [Modelagem de Dados (Prisma)](#-modelagem-de-dados-prisma)
* [Melhorias Futuras](#-melhorias-futuras)
* [Autor](#-autor)

---

## 🧩 **Visão Geral**

O projeto busca criar uma experiência imersiva para cinéfilos, permitindo a análise e o compartilhamento de opiniões sobre filmes, além de interações dentro de uma comunidade temática.

**Principais objetivos:**

* 🔐 Sistema de autenticação seguro (login e registro)
* 💬 Criação e gerenciamento de reviews personalizados
* 🌟 Exibição de filmes populares e lançamentos recentes (API TMDB)
* 🧠 Cálculo automático da média de avaliações
* 👥 Área de comunidade interativa com posts e votos
* 📱 Interface totalmente responsiva

---

## ⚙️ **Principais Funcionalidades**

| Categoria           | Descrição                                                     |
| ------------------- | ------------------------------------------------------------- |
| **Autenticação**    | Registro e login com criptografia de senha (bcrypt)           |
| **Filmes**          | Listagem de filmes populares, recentes e detalhes individuais |
| **Avaliações**      | Criação, edição de avaliações com notas de 0 a 5   |
| **Comunidade**      | Criação de posts, busca e sistema de votos (up/down)          |
| **Perfil**          | Exibição das informações básicas do usuário                   |
| **Integração TMDB** | Consumo de dados externos com tratamento e persistência local |

---

## 🏗️ **Arquitetura do Projeto**

```
cinereview/
├── prisma/
│   ├── schema.prisma          # Definição do modelo de dados
│   └── migrations/            # Migrações do banco SQLite
│
├── src/
│   ├── app/
│   │   ├── api/               # Endpoints da API (Next.js App Router)
│   │   ├── community/         # Página da comunidade
│   │   ├── movies/            # Páginas de filmes
│   │   ├── auth/              # Login e registro
│   │   ├── profile/           # Página de perfil
│   │   ├── layout.tsx         # Layout global
│   │   └── page.tsx           # Página inicial
│   │
│   ├── components/            # Componentes reutilizáveis (UI e lógicos)
│   ├── lib/                   # Prisma e integrações com TMDB
│   └── types/                 # Tipagens TypeScript
│
├── public/                    # Arquivos estáticos (ícones e imagens)
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🧰 **Tecnologias e Ferramentas**

| Camada             | Stack                                            |
| ------------------ | ------------------------------------------------ |
| **Front-end**      | Next.js 15+, React, TypeScript, Tailwind CSS     |
| **Back-end**       | Next.js API Routes, Prisma ORM                   |
| **Banco de Dados** | SQLite (desenvolvimento) / PostgreSQL (produção) |
| **Autenticação**   | Cookies HTTP-only + bcryptjs                     |
| **Integrações**    | The Movie Database (TMDB API)                    |
| **UI/UX**          | ShadCN UI, Lucide Icons                          |
| **Ambiente**       | Node.js 20+, npm ou pnpm                         |

---

## 🧩 **Instalação e Configuração**

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/Liedson1/CineReview.git
cd CineReview
```

### 🔹 2. Instalar dependências

```bash
npm install
# ou
pnpm install
```

### 🔹 3. Configurar variáveis de ambiente

Crie um arquivo **`.env`** na raiz do projeto e adicione:

```bash
TMDB_API_KEY=YOUR_TMDB_API_KEY
DATABASE_URL="file:./prisma/dev.db"
```

> 🔑 Obtenha sua chave TMDB em:
> [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### 🔹 4. Rodar as migrações do banco

```bash
npx prisma migrate dev
```

### 🔹 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🌐 **Rotas e Endpoints**

| Rota                     | Método          | Descrição                           |
| ------------------------ | --------------- | ----------------------------------- |
| `/api/auth/register`     | `POST`          | Criação de novo usuário             |
| `/api/auth/login`        | `POST`          | Login e criação de cookie de sessão |
| `/api/movies/popular`    | `GET`           | Lista filmes populares (TMDB)       |
| `/api/movies/recent`     | `GET`           | Lista lançamentos recentes          |
| `/api/movies/[id]`       | `GET`           | Detalhes e avaliações de um filme   |
| `/api/reviews`           | `POST / DELETE` | Cria, edita ou remove avaliações    |
| `/api/reviews/top-rated` | `GET`           | Filmes mais bem avaliados           |

---

## 🧬 **Modelagem de Dados (Prisma)**

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  reviews   Review[]
}

model Movie {
  id            Int       @id
  title         String
  year          String?
  plot          String?
  poster        String?
  backdrop      String?
  runtime       Int?
  genres        String?
  rating        Float?
  voteCount     Int?
  releaseDate   String?
  originalTitle String?
  language      String?
  createdAt     DateTime  @default(now())
  reviews       Review[]
}

model Review {
  id        String   @id @default(cuid())
  rating    Float
  comment   String?
  userId    String
  movieId   Int
  user      User     @relation(fields: [userId], references: [id])
  movie     Movie    @relation(fields: [movieId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, movieId])
}
```

---

## 🚀 **Melhorias Futuras**

* 🔄 Autenticação via **JWT + Refresh Tokens**
* 🗄️ Migração completa para **PostgreSQL**
* 💬 Threads e respostas em posts da comunidade
* 🧠 Sistema de recomendação baseado em IA
* 📱 PWA com suporte offline
* 🌍 Internacionalização (i18n)

---

## 👨‍💻 **Autor**

**Liedson Santos**
Desenvolvedor Back-End
🔗 [GitHub: Liedson1](https://github.com/Liedson1)

---
