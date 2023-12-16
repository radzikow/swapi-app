app=$(shell docker ps -a -q -f "name=swapi-app")

build:
	@docker-compose -f docker-compose.yml build

run:
	@docker-compose -f docker-compose.yml up

stop:
	@docker-compose -f docker-compose.yml stop

rm:
	@docker rm -f $(app)

restart: stop run

rebuild: stop rm build run

logs:
	@docker logs --since 30s -f $(app)

bash:
	@docker exec -it $(app) sh
