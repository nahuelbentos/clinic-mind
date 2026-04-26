.PHONY: dev build start lint install deploy preview logs \
       db-generate db-push db-migrate db-seed db-studio db-reset \
       setup

# --- Desarrollo ---

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

install:
	npm install

# --- Base de datos ---

db-generate:
	npx prisma generate

db-push:
	npx prisma db push

db-migrate:
	npx prisma migrate dev

db-seed:
	npx tsx prisma/seed.ts

db-studio:
	npx prisma studio

db-reset:
	npx prisma migrate reset

# --- Setup inicial (primera vez) ---

setup: install db-generate db-push db-seed
	@echo "Setup completo. Ejecutá 'make dev' para iniciar."

# --- Deploy (Vercel) ---

deploy:
	vercel --prod

preview:
	vercel

logs:
	vercel logs --prod
