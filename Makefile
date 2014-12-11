NPM_BIN=./node_modules/.bin
LOG_PARSER=| $(NPM_BIN)/bunyan

build: configure
	$(NPM_BIN)/gulp build

dist: configure
	$(NPM_BIN)/gulp dist

server:
	$(NPM_BIN)/nodemon index.js --env=development $(LOG_PARSER)

client:
	$(NPM_BIN)/gulp watch

configure:
	mkdir -p .data
	npm install
	$(NPM_BIN)/bower install --config.interactive=false -q

db_migrate:
	./scripts/db.js migrate

db_rollback:
	./scripts/db.js rollback

.PHONY: server client dist build configure deploy db_migrate db_rollback
