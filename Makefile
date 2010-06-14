RHINO ?= js
JSLINT ?= ../jslint.js

JAVA ?= java
YUICOMP ?= ../yuicompressor.jar
HTMLCOMP ?= ../htmlcompressor.jar

OGGENC ?= oggenc


JSFILES := $(shell grep 'script src="src/' arashi.html | sed \
    -e 's/^.\+\? src="//' -e 's/".\+//')
WAVFILES := $(shell find snd -iname '*.wav')
OGGFILES := $(WAVFILES:%.wav=%.ogg)
DISTSOUNDS := $(WAVFILES:snd/%=dist/snd/%) $(OGGFILES:snd/%=dist/snd/%)

usage:
	@echo "The following make targets are defined:"
	@echo "  dist: Create compressed JavaScript and CSS."
	@echo "  lint: Run JSLint on all JavaScript source files."
	@echo "  clean: Remove any files created by the above."

dist: dist/arashi.html dist/arashi.js dist/arashi.css ${DISTSOUNDS}

clean:
	-rm -f dist/arashi.html dist/arashi.js dist/arashi.css ${DISTSOUNDS}
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
	    -e 's/jquery\.js/jquery.min.js/' \
	    -e '/arashi_devmode/d' \
	  | ${JAVA} -jar ${HTMLCOMP} \
	    --compress-js --compress-css \
	    --remove-intertag-spaces --remove-quotes \
	  > dist/arashi.html

dist/arashi.js: ${JSFILES} util/dist.head.js
	cat util/dist.head.js ${JSFILES} \
	  | ${JAVA} -jar ${YUICOMP} --type js \
	  > dist/arashi.js

dist/arashi.css: arashi.css
	${JAVA} -jar ${YUICOMP} --type css -o dist/arashi.css arashi.css

dist/snd/%.wav: snd/%.wav
	cp $< $@

dist/snd/%.ogg: dist/snd/%.wav
	${OGGENC} -o $@ -Q $<

.PHONY: usage dist clean lint
