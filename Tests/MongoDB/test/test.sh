echo "Preparing fixtures"
rm -R ./temp/*
echo "" > temp/dumb
cp -R fixture/* temp/
run git update-index --chmod=+x test.sh

echo "Running tests"
node ../../../main.js --no-splash --fall-on-errors
