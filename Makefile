REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		--ui tdd \
		--watch

start-test-server:
	@NODE_ENV=test node app.js

test-performance:
	@NODE_ENV=test node ./test_performance/app.js

debug:
	node debug app

install:
	npm install

clean: 
	rm -rf node_modules

.PHONY: debug clean install test test-w
