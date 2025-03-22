#!/usr/bin/bash

case $1 in
	events)
		curl -X POST http://localhost/gdelt/api/events -H "Content-Type: application/json" -d '{"startHour": 6, "endHour": 1, "limits": [[[-90,-90],[90,90]]]}'
		;;
	codes)
		curl -X POST http://localhost/gdelt/api/codes -H "Content-Type: application/json" -d '{"cameo": "country"}'
		;;
	tcodes)
		curl -X POST http://127.0.0.1:8080/gdeltserver_2.12-0.1.0-SNAPSHOT/codes -H "Content-Type: application/json" -d '{"cameo": "country"}'
		;;
	jcodes)
		curl -X POST http://127.0.0.1:8080/codes -H "Content-Type: application/json" -d '{"cameo": "country"}'
		;;
	*)
		;;
esac
