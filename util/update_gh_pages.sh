#!/bin/sh

# Updates gh-pages branch with distributables from the current HEAD.

if [ ! -f arashi.html ]; then
  echo "Execute from the project root!"
  exit 1
fi

echo "Uncommitted changes will be lost!"
echo "Press Ctrl+C to abort, or Enter to continue."
read dummy

TEMPTAR="/tmp/arashi-gh-pages.tar"

set -e
set -x

REVISION=`git rev-parse HEAD`

make dist
(
  set -e
  cd dist
  mv arashi.html index.html
  find . -iname 'placeholder' | xargs rm -f
  tar -cf ${TEMPTAR} *
)

git reset --hard
git clean -fdx
git checkout gh-pages

tar -xf ${TEMPTAR}
rm -f ${TEMPTAR}

git add -A
git commit -a -m "Updating from revision ${REVISION}"
git push origin gh-pages

git checkout master
