.PHONY: dev build start lint install deploy logs

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

deploy:
	vercel --prod

preview:
	vercel

logs:
	vercel logs --prod
