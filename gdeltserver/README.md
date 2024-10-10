# gdeltserver #

## Build & Run ##

```sh
$ sbt
> Jetty / start
> browse
```

If `browse` doesn't launch your browser, manually open [http://localhost:8080/](http://localhost:8080/) in your browser.

Requires `postgresql.service` to be started, and for deployment, `tomcat9.service`.
