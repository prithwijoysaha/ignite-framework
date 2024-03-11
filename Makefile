run:
	NODE_ENV=local npm start

run-dev:
	NODE_ENV=development npm start

run-stage:
	NODE_ENV=staging npm start

run-prod:
	NODE_ENV=production npm start

docker-run:
	NODE_ENV=local docker compose -f docker-compose.yml up -d --build

docker-run-dev:
	NODE_ENV=development docker compose -f docker-compose.yml up -d --build

docker-run-stage:
	NODE_ENV=staging docker compose -f docker-compose.yml up -d --build

docker-run-prod:
	NODE_ENV=production docker compose -f docker-compose.yml up -d --build