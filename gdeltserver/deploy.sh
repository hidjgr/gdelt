#!/usr/bin/bash

source .env

cp --update=all target/scala-2.12/gdeltserver_2.12-0.1.0-SNAPSHOT.war $DEPLOY_DIR
