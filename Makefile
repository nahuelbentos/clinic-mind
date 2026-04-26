.PHONY: dev build start lint install deploy preview logs \
       db-generate db-push db-migrate db-seed db-studio db-reset setup \
       docker-up docker-down docker-build docker-setup docker-logs \
       vercel-env-pull db-push-prod db-seed-prod db-setup-prod

# --- Desarrollo local ---

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

# --- Base de datos (local) ---

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

# --- Setup local (primera vez) ---

setup: install db-generate db-push db-seed
	@echo "Setup completo. Ejecutá 'make dev' para iniciar."

# --- Docker ---

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-setup:
	docker compose --profile setup run --rm db-setup

docker-logs:
	docker compose logs -f app

# Primera vez con Docker: build + levantar + crear tablas + seed
docker-init: docker-build docker-up
	@echo "Esperando que la base de datos esté lista..."
	@sleep 3
	$(MAKE) docker-setup
	@echo "Listo. App corriendo en http://localhost:3000"

# --- Deploy (Vercel) ---

deploy:
	vercel --prod

preview:
	vercel

logs:
	vercel logs --prod

# --- Base de datos remota (Vercel/Produccion) ---

vercel-env-pull:
	vercel env pull --environment=production .env.vercel.local

db-push-prod: vercel-env-pull
	@echo "Aplicando schema a la DB de produccion..."
	env $$(grep -E '^DATABASE_URL' .env.vercel.local | tr -d '"') npx prisma db push

db-seed-prod: vercel-env-pull
	@echo "Insertando seed en la DB de produccion..."
	env $$(grep -E '^DATABASE_URL' .env.vercel.local | tr -d '"') npx tsx prisma/seed.ts

# Primera vez en produccion: push schema + seed
db-setup-prod: db-push-prod db-seed-prod
	@echo "DB de produccion lista."
