package org.hidjgr.gdeltserver

import org.json4s._
import org.json4s.jackson.JsonMethods._
import org.json4s.jackson.Serialization.write
import org.scalatra.test.scalatest._

class GDELTServletTests extends ScalatraFunSuite {

  addServlet(classOf[GDELTServlet], "/*")
  implicit val formats: Formats = DefaultFormats

  test("GET /") {
    get("/") {
      status should equal (200)
    }
  }

  test("POST /codes countries") {
    val jsonBody = write(Map("cameo" -> "country"))

    post("/codes", body = jsonBody, headers = Map("Content-Type" -> "application/json")) {
      status should equal(200)
    }
  }
  
  test("POST /events with grid") {
    val jsonBody = write(Map("startHour" -> 6, "endHour" -> 1, "limits" -> List(List(List(0,0),List(10,10)), List(List(10,10),List(20,20)))))
    post("/events", body = jsonBody, headers = Map("Content-Type" -> "application/json")) {
      status should equal(200)
    }
  }

  test("POST /events with pov") {
    val jsonBody = write(Map("startHour" -> 6, "endHour" -> 1, "povLon" -> 10, "povLat" -> 10))
    post("/events", body = jsonBody, headers = Map("Content-Type" -> "application/json")) {
      status should equal(200)
    }
  }

}



