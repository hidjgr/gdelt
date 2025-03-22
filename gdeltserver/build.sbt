val ScalatraVersion = "2.8.2"

ThisBuild / scalaVersion := "2.12.18"
ThisBuild / organization := "org.hidjgr"

lazy val hello = (project in file("."))
  .settings(
    name := "gdeltserver",
    version := "0.1.0-SNAPSHOT",
    libraryDependencies ++= Seq(
      "org.scalatra" %% "scalatra" % ScalatraVersion,
      "org.scalatra" %% "scalatra-scalatest" % ScalatraVersion % "test",
      "com.zaxxer" % "HikariCP" % "5.0.1",
      "com.lihaoyi" %% "upickle" % "3.1.2",
      "com.typesafe.slick" %% "slick" % "3.4.1",
      "com.typesafe.slick" %% "slick-hikaricp" % "3.4.1",
      "org.postgresql" % "postgresql" % "42.2.5",
      "com.google.cloud" % "google-cloud-bigquery" % "2.27.1",
      "com.google.code.gson" % "gson" % "2.11.0",
      "ch.qos.logback" % "logback-classic" % "1.2.3" % "runtime",
      "org.eclipse.jetty" % "jetty-webapp" % "9.4.43.v20210629" % "container",
      "org.eclipse.jetty" % "jetty-servlet" % "9.4.43.v20210629" % "container",
      "javax.servlet" % "javax.servlet-api" % "3.1.0" % "provided",
      "io.circe" %% "circe-core" % "0.15.0-M1",
      "io.circe" %% "circe-generic" % "0.15.0-M1",
      "io.circe" %% "circe-parser" % "0.15.0-M1",
      "org.json4s" %% "json4s-core" % "4.1.0-M8",
      "org.json4s" %% "json4s-jackson" % "4.1.0-M8",
    ),

  )

enablePlugins(SbtTwirl)
enablePlugins(JettyPlugin)
