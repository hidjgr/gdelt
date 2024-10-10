package org.hidjgr.gdeltserver

import org.scalatra.test.scalatest._

class GDELTServletTests extends ScalatraFunSuite {

  addServlet(classOf[GDELTServlet], "/*")

  test("GET / on GDELTServlet should return status 200") {
    get("/") {
      status should equal (200)
    }
  }

}
