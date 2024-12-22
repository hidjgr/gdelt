#!/usr/bin/bash

prefix='https://www.gdeltproject.org/data/lookups/'

mkfifo CAMEO_codes_pipe
mkfifo CAMEO_codes_pipe_tmp

source .env

# Get CAMEO codes and load
IFS=$'\n'
for i in "$prefix"{CAMEO.{country,type,knowngroup,ethnic,religion,eventcodes,goldsteinscale},FIPS.country}.txt; do
	echo $i
	table=$(basename -s .txt $i | tr . _)
	header=""
	if [ $table != FIPS_country ]; then
		header="HEADER"
	fi
	if [ $table == CAMEO_knowngroup ] \
	|| [ $table == CAMEO_ethnic ] \
	|| [ $table == CAMEO_type ]; then
		curl -s $i > CAMEO_codes_pipe_tmp &
		(read header < CAMEO_codes_pipe_tmp; echo $header; tail -n +2 CAMEO_codes_pipe_tmp | sort -u -k1,1) > CAMEO_codes_pipe &
	else
		curl -s $i > CAMEO_codes_pipe &
	fi
	psql -U $PGUSER -d $PGDB -c "\\copy $table FROM 'CAMEO_codes_pipe' DELIMITER '	' CSV $header;"
done

rm CAMEO_codes_pipe
rm CAMEO_codes_pipe_tmp
