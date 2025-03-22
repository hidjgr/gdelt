package org.hidjgr.gdeltserver

import org.scalatra._
import io.circe.parser.decode
import io.circe.generic.auto._
import java.sql.{Connection, DriverManager, ResultSet}
import scala.collection.mutable.ListBuffer
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken



class GDELTServlet extends ScalatraServlet with CorsSupport {

  case class EventRequest(startHour: Int, endHour: Int, limits: List[((Double, Double), (Double, Double))])
  case class CameoRequest(cameo: String)

  // GET RESULT 
  def getResult(table: String, columnMap: Map[String, String], where: String, limit: String) : String = {

    // JDBC CONFIG
    Class.forName("org.postgresql.Driver")
    val con_st = s"""jdbc:postgresql://localhost:5432/gdelt?user=gdelt_u"""
    val conn = DriverManager.getConnection(con_st)

    // HIKARI CONFIG (UNUSED)
    /*pgDataSource.setDatabaseName(
             sys.env.getOrElse("DBNAME", "gdelt"))// throw new RuntimeException("DBNAME not set!")))
    pgDataSource.setUser(
             sys.env.getOrElse("DBUSER", "gdelt_u"))//throw new RuntimeException("DBUSER not set!")))
    pgDataSource.setPassword(
             sys.env.getOrElse("DBPASSWORD", "gdelt_pw"))//throw new RuntimeException("DBPASSWORD not set!")))*/


    var jsonResult = "["

    try {
      val stm = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY)

      val rs = stm.executeQuery(s"""SELECT * FROM $table $where $limit""")

      println(s"""SELECT * FROM $table $where $limit""")

      val metaData = rs.getMetaData()

      // val rows = new ListBuffer[Map[String,Any]]()

      // FORMAT ROWS TO JSON
      while (rs.next) {
        jsonResult += "{"
        val rowMap = (1 to metaData.getColumnCount()).map { i =>
          val rawColumnName = metaData.getColumnName(i)
          val columnName = columnMap.getOrElse(rawColumnName, rawColumnName)
          val rawValue = rs.getObject(i)

          // FORMAT FIELD VALUE(rawValue)
          val value = rawValue match {
            case null       => s""""""""
            case _: Number => rawValue.toString
            case other    => s""""${other.toString}""""
          }


          s""""${columnName}": $value"""
        }

        jsonResult += rowMap.mkString(", ")
        jsonResult += "},"
      }

      if (jsonResult.endsWith(",")) jsonResult = jsonResult.dropRight(1)
    } finally conn.close()

    jsonResult += "]"

    jsonResult

  }

  get("/") {
    views.html.hello()
  }


  post("/codes") {

    decode[CameoRequest](request.body) match {
      case Right(requestData) =>

        // CAMEO CODE NAME MAP
        val tableMap = Map("type" -> "CAMEO_type", "ethnic" -> "CAMEO_ethnic", "country" -> "CAMEO_country",
          "religion" -> "CAMEO_religion", "f_country" -> "FIPS_country", "knowngroup" -> "CAMEO_knowngroup",
          "eventcodes" -> "CAMEO_eventcodes", "goldsteinscale" -> "CAMEO_goldsteinscale")

        val jsonResult = getResult(tableMap.getOrElse(requestData.cameo, ""), Map(), "", "")

        // CAMEO CODE RESPONSE
        Ok(jsonResult, Map(
        "Access-Control-Allow-Origin" -> "*",
        "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers" -> "Content-Type, Authorization",
        "Content-Type" -> "application/json"))

      case Left(error) =>
        BadRequest(s"Invalid JSON: ${error.getMessage}")
    }
  }


  post("/events") {

    decode[EventRequest](request.body) match {
      case Right(requestData) =>

        // GRID VISIBILITY CONDITION
        val whereLimits = (if (requestData.limits.size > 0) "WHERE " else "") + requestData.limits.map {
          case ((llLong: Double, llLat: Double), (urLong: Double, urLat: Double)) =>
            s"(((ActionGeo_Long >= $llLong) AND (ActionGeo_Lat >= $llLat)) AND ((ActionGeo_Long <= $urLong) AND (ActionGeo_Lat <= $urLat)))"
        }.mkString(" OR ")

        // EVENT COLUMN MAP
        val columnMap = Map("globaleventid" -> "GlobalEventID", "day" -> "Day", "monthyear" -> "MonthYear", "year" -> "Year", "fractiondate" -> "FractionDate",
          "actor1code" -> "Actor1Code", "actor1name" -> "Actor1Name", "actor1countrycode" -> "Actor1CountryCode", "actor1knowngroupcode" -> "Actor1KnownGroupCode",
          "actor1ethniccode" -> "Actor1EthnicCode", "actor1religion1code" -> "Actor1Religion1Code", "actor1religion2code" -> "Actor1Religion2Code",
          "actor1type1code" -> "Actor1Type1Code", "actor1type2code" -> "Actor1Type2Code", "actor1type3code" -> "Actor1Type3Code", "actor2code" -> "Actor2Code",
          "actor2name" -> "Actor2Name", "actor2countrycode" -> "Actor2CountryCode", "actor2knowngroupcode" -> "Actor2KnownGroupCode",
          "actor2ethniccode" -> "Actor2EthnicCode", "actor2religion1code" -> "Actor2Religion1Code", "actor2religion2code" -> "Actor2Religion2Code",
          "actor2type1code" -> "Actor2Type1Code", "actor2type2code" -> "Actor2Type2Code", "actor2type3code" -> "Actor2Type3Code", "isrootevent" -> "IsRootEvent",
          "eventcode" -> "EventCode", "eventbasecode" -> "EventBaseCode", "eventrootcode" -> "EventRootCode", "quadclass" -> "QuadClass",
          "goldsteinscale" -> "GoldsteinScale", "nummentions" -> "NumMentions", "numsources" -> "NumSources", "numarticles" -> "NumArticles",
          "avgtone" -> "AvgTone", "actor1geo_type" -> "Actor1Geo_Type", "actor1geo_fullname" -> "Actor1Geo_Fullname",
          "actor1geo_countrycode" -> "Actor1Geo_CountryCode", "actor1geo_adm1code" -> "Actor1Geo_ADM1Code", "actor1geo_adm2code" -> "Actor1Geo_ADM2Code",
          "actor1geo_lat" -> "Actor1Geo_Lat", "actor1geo_long" -> "Actor1Geo_Long", "actor1geo_featureid" -> "Actor1Geo_FeatureID",
          "actor2geo_type" -> "Actor2Geo_Type", "actor2geo_fullname" -> "Actor2Geo_Fullname", "actor2geo_countrycode" -> "Actor2Geo_CountryCode",
          "actor2geo_adm1code" -> "Actor2Geo_ADM1Code", "actor2geo_adm2code" -> "Actor2Geo_ADM2Code", "actor2geo_lat" -> "Actor2Geo_Lat",
          "actor2geo_long" -> "Actor2Geo_Long", "actor2geo_featureid" -> "Actor2Geo_FeatureID", "actiongeo_type" -> "ActionGeo_Type",
          "actiongeo_fullname" -> "ActionGeo_Fullname", "actiongeo_countrycode" -> "ActionGeo_CountryCode", "actiongeo_adm1code" -> "ActionGeo_ADM1Code",
          "actiongeo_adm2code" -> "ActionGeo_ADM2Code", "actiongeo_lat" -> "ActionGeo_Lat", "actiongeo_long" -> "ActionGeo_Long",
          "actiongeo_featureid" -> "ActionGeo_FeatureID", "dateadded" -> "DATEADDED", "sourceurl" -> "SOURCEURL")

        val jsonResult = getResult("Events", columnMap, whereLimits, "LIMIT 500")

        // EVENTS RESPONSE
        Ok(jsonResult, Map(
          "Access-Control-Allow-Origin" -> "*",
          "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers" -> "Content-Type, Authorization",
          "Content-Type" -> "application/json"))

      case Left(error) =>
        BadRequest(s"Invalid JSON: ${error}")
    }
  }

  options("/*") {
    Ok(Map(
      "Access-Control-Allow-Origin" -> "*",
      "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers" -> "Content-Type, Authorization"
    ))
  }
}
