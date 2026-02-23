# My Portfolio — React + TypeScript + Docker

A personal portfolio website built with React (Vite + TypeScript) and containerized with Docker. Supports local and Docker-based development, with a production-ready Nginx setup.

This project demonstrates a real-world workflow: **development → containerization → production build**.

---

## Tech Stack

- **React + TypeScript** (Vite)
- **Docker**
- **Nginx** (Production)
- **Git & GitHub**

---

## Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

---

## Getting Started

Choose **one** of the methods below.

---

### Method 1 — Local Development

> Recommended for daily coding.

**1. Install dependencies** *(first time only)*

```bash
npm install
```

---

## OpenAI / ChatGPT Integration

This project can optionally query the OpenAI Chat Completions API for free-form replies when the rule-based engine has no match.

- Create a `.env` at the project root (don't commit it) and set `VITE_OPENAI_KEY`.
- Example: copy `.env.example` → `.env` and fill your key.

WARNING: placing an API key in the frontend exposes it to end users. For production, use a server-side proxy to keep the key secret.


**2. Start the development server**

```bash
npm run dev
```

**3. Open in browser:** [http://localhost:5173](http://localhost:5173)

---

### Method 2 — Docker Development

> Runs the app inside a Docker container.

**1. Start the Docker dev container**

```bash
docker compose up --build
```

**2. Open in browser:** [http://localhost:5173](http://localhost:5173)
