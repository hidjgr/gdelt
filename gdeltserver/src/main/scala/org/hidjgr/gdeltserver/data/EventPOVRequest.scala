package org.hidjgr.gdeltserver.data

case class EventPOVRequest(startHour: Int, endHour: Int, povLat: Int, povLon: Int) extends EventRequest(startHour, endHour) {}
