package org.hidjgr.gdeltserver.data

case class EventGridRequest(startHour: Int, endHour: Int, limits: List[((Double, Double), (Double, Double))]) extends EventRequest(startHour, endHour) {}
