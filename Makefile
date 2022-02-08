# Makefile

install:
	npm ci

lint:
	npx eslint . --ext .js,.jsx

lint-fix:
	npx eslint . --ext .js,.jsx --fix 

start:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon bin/book.js

start-frontend:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack --mode production

