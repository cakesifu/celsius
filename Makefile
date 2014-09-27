NPM_BIN=./node_modules/.bin
LOG_PARSER=| $(NPM_BIN)/bunyan

build:
	$(NPM_BIN)/gulp build

server:
	$(NPM_BIN)/nodemon index.js --env=development $(LOG_PARSER)

client:
	$(NPM_BIN)/gulp watch

configure:
	npm install
	bower install
	mkdir -p .data

db_migrate:
	./scripts/db.js migrate

db_rollback:
	./scripts/db.js rollback

db_reset:
	./scripts/db.js drop

db_create:
	./scripts/db.js create

db_setup: db_reset db_create db_migrate

migration:
	$(NPM_BIN)/sequelize -c "$(NAME)"


.PHONY: server client build configure deploy db_migrate db_rollback db_reset migration db_setup db_create
