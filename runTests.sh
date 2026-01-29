#!/usr/bin/env bash

echo -e "Running tests...\n\n\n"

echo "Test Puppeteer works on your enviroment ..."
if [[ ! -f /usr/bin/chromium  ]]; then
  machine_arch=$(arch)
  if [[ "$machine_arch" == *"arm"* ]] || [[ "$machine_arch" == *"aarch"* ]]; then
    echo "If you using raspberrypi or android please install Chromium using:"
    echo "$ apt install chromium"
    echo "$ apk add chromium"
    echo "etc"
    echo "Expected path for chromium is /usr/bin/chromium"
  else
    echo "using local chrome/chromium installed in node_modules by npm i puppeteer"
    echo "if puppeteer test fails make sure you run '$ npm install' before running the tests".
  fi
fi
node test/e2e/puppeteer.working.js


echo -e "\n\n\nTesting whois module ..."
node test/autopwn_modules/recon/whois/whois.test.js


