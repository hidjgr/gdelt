#!/usr/bin/bash

curl http://data.gdeltproject.org/gdeltv2/masterfilelist.txt | grep export | tail -n 96 > masterfilelist.txt
# curl http://data.gdeltproject.org/gdeltv2/masterfilelist-translation.txt | grep export | tail -n 96 > masterfilelist-translation.txt

# cat masterfilelist.txt masterfilelist-translation.txt | cut -d' ' -f3 | sort > masterfilelist-all.txt

cat masterfilelist.txt | cut -d' ' -f3 | sort > masterfilelist-all.txt
