#!/usr/bin/bash

mkdir -p data/zipped data/extracted
wget -P data/zipped -i $1
unzip "data/zipped/*" -d data/extracted/
cat <(cut -d'	' -f-61 headers.csv) data/extracted/* > events.csv
rm -r data
