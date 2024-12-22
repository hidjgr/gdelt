#!/usr/bin/bash

./get-event-list.sh
./get-event-data.sh masterfilelist-all.txt

source .env

echo $PGDB

sudo -u postgres psql << EOF
CREATE USER $PGUSER WITH PASSWORD '$PGPW';
CREATE DATABASE $PGDB WITH OWNER $PGUSER;
GRANT ALL PRIVILEGES ON DATABASE  $PGDB TO $PGUSER;
EOF


psql -U $PGUSER -d $PGDB -f createtables.sql

./load-codes.sh
psql -U $PGUSER -d $PGDB -c "\\copy Events FROM '$(realpath ./events.csv)' DELIMITER '	' CSV HEADER;"
