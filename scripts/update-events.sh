#!/usr/bin/bash

./update-event-list.sh
./get-event-data.sh masterfilelist-update.txt

source .env

psql -U $PGUSER -d $PGDB -c "\\copy Events FROM '$(realpath ./events.csv)' DELIMITER '	' CSV HEADER;"
psql -U $PGUSER -d $PGDB -c "DELETE FROM Events WHERE DATEADDED<$(head -n1 masterfilelist-all.txt | grep -o '[0-9]\+0');"
