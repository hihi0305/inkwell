\## Definition of Done



A backlog item is Done when:

\- \[ ] Code is committed with a descriptive message

\- \[ ] It runs locally per the relevant lecture's Code Walkthrough

\- \[ ] It does not break previously-passing verification steps

\- \[ ] New setup steps are documented here



\## Process



Inkwell follows an incremental process: one lecture, one increment.

See docs/BACKLOG.md for the current product backlog.


## Getting Started

### Prerequisites
- Node.js >= 22 (see server/package.json's engines field)
- Docker (for local PostgreSQL)

### Database

```
docker run --name inkwell-postgres \
  -e POSTGRES_USER=inkwell \
  -e POSTGRES_PASSWORD=inkwell \
  -e POSTGRES_DB=inkwell_dev \
  -p 5432:5432 \
  -d postgres:16
```

Already created this container once? Use `docker start inkwell-postgres` instead.

### Server

```
cd server
npm install
cp .env.example .env	# DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_dev"
npx prisma migrate deploy
npx prisma generate
npm run dev
# → Inkwell API listening on port 4000
```

### Client

```
cd client
npm install
npm run dev
# → Local: http://localhost:5173
```

### Running the tests

The integration tests run against a separate inkwell_test database (never the dev one), created once:

```
docker exec inkwell-postgres psql -U inkwell -d inkwell_dev -c "CREATE DATABASE inkwell_test;"
cd server && DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_test" npx prisma migrate deploy
```

Before running server tests, create `server/.env.test`
and configure it to use the test database:

```env
DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_test"
NODE_ENV=test
```

On Windows CMD, create the file with:

```cmd
cd server
copy .env.example .env.test
```

Then update the `DATABASE_URL` value in `.env.test`
to point to `inkwell_test`.

```
cd server && npm test				# Jest: unit + integration
cd client && npx vitest run			# Vitest: component tests
npx playwright test					# Playwright: E2E (needs both dev servers running)
```

