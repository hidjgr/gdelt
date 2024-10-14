package org.hidjgr.gdeltserver

import org.scalatra._
import io.getquill._
import com.zaxxer.hikari.{HikariConfig, HikariDataSource}

class GDELTServlet extends ScalatraServlet {

  def connectdb() : PostgresJdbcContext[LowerCase] = {
    val pgDataSource = new org.postgresql.ds.PGSimpleDataSource()
    pgDataSource.setDatabaseName("gdelt")
    pgDataSource.setUser("gdelt_u")
    pgDataSource.setPassword("gdelt_pw")

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
    Ok(jsonResult, Map("Access-Control-Allow-Origin" -> "*", "Content-Type" -> "application/json"))
  }

  get("/events") {

    val ctx = connectdb()
    import ctx._

    val jsonResult: String = toJSONList(ctx.run(query[Events].take(500)))

    ctx.close()

    Ok(jsonResult, Map(
    "Access-Control-Allow-Origin" -> "*",
    "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers" -> "Content-Type, Authorization",
    "Content-Type" -> "application/json"))
  }

  options("/events") {
    Ok(Map(
      "Access-Control-Allow-Origin" -> "*",
      "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers" -> "Content-Type, Authorization"
    ))
  }
}
