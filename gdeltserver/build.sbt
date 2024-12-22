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
      "io.getquill" %% "quill-jdbc" % "4.6.1",
      "com.lihaoyi" %% "upickle" % "3.1.2",
      "org.postgresql" % "postgresql" % "42.6.0",
      "com.google.cloud" % "google-cloud-bigquery" % "2.27.1",
      "ch.qos.logback" % "logback-classic" % "1.2.3" % "runtime",
      "org.eclipse.jetty" % "jetty-webapp" % "9.4.43.v20210629" % "container",
      "org.eclipse.jetty" % "jetty-servlet" % "9.4.43.v20210629" % "container",
      "javax.servlet" % "javax.servlet-api" % "3.1.0" % "provided",
    ),

  )

enablePlugins(SbtTwirl)
enablePlugins(JettyPlugin)
