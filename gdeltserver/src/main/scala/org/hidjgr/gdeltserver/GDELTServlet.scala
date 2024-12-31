package org.hidjgr.gdeltserver

import org.scalatra._
import io.getquill._
import com.zaxxer.hikari.{HikariConfig, HikariDataSource}

class GDELTServlet extends ScalatraServlet with CorsSupport {

  def connectdb() : PostgresJdbcContext[LowerCase] = {
    val pgDataSource = new org.postgresql.ds.PGSimpleDataSource()
    pgDataSource.setDatabaseName(
             sys.env.getOrElse("DBNAME", throw new RuntimeException("DBNAME not set!")))
    pgDataSource.setUser(
             sys.env.getOrElse("DBUSER", throw new RuntimeException("DBUSER not set!")))
    pgDataSource.setPassword(
             sys.env.getOrElse("DBPASSWORD", throw new RuntimeException("DBPASSWORD not set!")))

    val hikariConfig = new HikariConfig()
    hikariConfig.setDataSource(pgDataSource)

    new PostgresJdbcContext(LowerCase, new HikariDataSource(hikariConfig))
  }

  def toJSONList(queryResult: List[Record]): String = {
    "["+queryResult.map(_.toJSON()).reduceLeft(_+","+_)+"]"
  }

  get("/") {
    views.html.hello()
  }


  get("/codes") {

    val ctx = connectdb()
    import ctx._

    var jsonResult: String = "[]"

    params.get("cameo") match {
      case Some("country") => jsonResult = toJSONList(ctx.run(query[CAMEO_country]))
      case Some("type") => jsonResult = toJSONList(ctx.run(query[CAMEO_type]))
      case Some("knowngroup") => jsonResult = toJSONList(ctx.run(query[CAMEO_knowngroup]))
      case Some("ethnic") => jsonResult = toJSONList(ctx.run(query[CAMEO_ethnic]))
      case Some("religion") => jsonResult = toJSONList(ctx.run(query[CAMEO_religion]))
      case Some("eventcodes") => jsonResult = toJSONList(ctx.run(query[CAMEO_eventcodes]))
      case Some("goldsteinscale") => jsonResult = toJSONList(ctx.run(query[CAMEO_goldsteinscale]))
      case Some("f_country") => jsonResult = toJSONList(ctx.run(query[FIPS_country]))
      case _ => jsonResult = "[]"
    }

    ctx.close()
    Ok(jsonResult, Map(
    "Access-Control-Allow-Origin" -> "*",
    "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers" -> "Content-Type, Authorization",
    "Content-Type" -> "application/json"))
  }

  get("/events") {

    val ctx = connectdb()
    import ctx._


    System.out.println(params.get("hourStart"))
    System.out.println(params.get("hourEnd"))
    System.out.println(params.get("limits"))

    val jsonResult: String = toJSONList(ctx.run(query[Events].filter(
      (row:Events) => 
      ((row.ActionGeo_Lat > 34) && (row.ActionGeo_Lat < 70)) &&
      ((row.ActionGeo_Long > -11) && (row.ActionGeo_Long < 38))
    ).take(500)))

    ctx.close()

    Ok(jsonResult, Map(
    "Access-Control-Allow-Origin" -> "*",
    "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers" -> "Content-Type, Authorization",
    "Content-Type" -> "application/json"))
  }

  options("/*") {
    Ok(Map(
      "Access-Control-Allow-Origin" -> "*",
      "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers" -> "Content-Type, Authorization"
    ))
  }
}
