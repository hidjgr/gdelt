# gdeltserver

## Build and run dev server

```sh
$ sbt
> Jetty / start
> browse
```

If `browse` doesn't launch your browser, manually open [http://localhost:8080/](http://localhost:8080/) in your browser.

## Build production and deploy
```sh
$ sbt package
$ ./deploy.sh # copy the generated .war file to your tomcat directory
```

The api requires `postgresql.service` to be started, and for deployment, `tomcat9.service`.
