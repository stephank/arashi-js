RHINO ?= js
JSLINT ?= ../jslint.js

JAVA ?= java
YUICOMP ?= ../yuicompressor.jar


JSFILES := $(shell find src -iname '*.js' | grep -v '.lint.js')

usage:
	@echo "The following make targets are defined:"
	@echo "  dist: Create compressed JavaScript and CSS."
	@echo "  lint: Run JSLint on all JavaScript source files."
	@echo "  clean: Remove any files created by the above."

dist: dist/arashi.js dist/arashi.css

clean:
	-rm -f dist/arashi.js dist/arashi.css
	-find src -iname '*.lint.js' | xargs rm -f

lint:
	for i in ${JSFILES}; do \
	  echo "Linting $$i..."; \
	  cat util/lint.head.js $$i > $$i.lint.js; \
	  ${RHINO} ${JSLINT} $$i.lint.js; \
	  rm -fr $$i.lint.js; \
	  echo; \
	done

dist/arashi.js:
	cat util/dist.head.js ${JSFILES} \
	  | ${JAVA} -jar ${YUICOMP} --type js \
	  > dist/arashi.js

dist/arashi.css:
	${JAVA} -jar ${YUICOMP} --type css -o dist/arashi.css stylesheet.css

.PHONY: usage dist clean lint
