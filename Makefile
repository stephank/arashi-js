RHINO ?= js
JSLINT ?= ../jslint.js

JAVA ?= java
YUICOMP ?= ../yuicompressor.jar
HTMLCOMP ?= ../htmlcompressor.jar


JSFILES := $(shell find src -iname '*.js' | grep -v '.lint.js')

usage:
	@echo "The following make targets are defined:"
	@echo "  dist: Create compressed JavaScript and CSS."
	@echo "  lint: Run JSLint on all JavaScript source files."
	@echo "  clean: Remove any files created by the above."

dist: dist/arashi.html dist/arashi.js dist/arashi.css

clean:
	-rm -f dist/arashi.html dist/arashi.js dist/arashi.css
	-find src -iname '*.lint.js' | xargs rm -f

lint:
	for i in ${JSFILES}; do \
	  echo "Linting $$i..."; \
	  cat util/lint.head.js $$i > $$i.lint.js; \
	  ${RHINO} ${JSLINT} $$i.lint.js; \
	  rm -fr $$i.lint.js; \
	  echo; \
	done

dist/arashi.html: arashi.html
	sed arashi.html \
	    -e '/script src="src\//d' \
	    -e 's/<\/head>/<script src="arashi.js"><\/script><\/head>/' \
	  | ${JAVA} -jar ${HTMLCOMP} \
	    --compress-js --compress-css \
	    --remove-intertag-spaces --remove-quotes \
	  > dist/arashi.html

dist/arashi.js: ${JSFILES}
	cat util/dist.head.js ${JSFILES} \
	  | ${JAVA} -jar ${YUICOMP} --type js \
	  > dist/arashi.js

dist/arashi.css: arashi.css
	${JAVA} -jar ${YUICOMP} --type css -o dist/arashi.css arashi.css

.PHONY: usage dist clean lint
