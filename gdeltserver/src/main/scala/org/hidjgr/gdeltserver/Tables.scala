package org.hidjgr.gdeltserver

import upickle.default._

abstract class Record() {
  def toJSON(): String
}

case class Events(
  GlobalEventID: Int,
  Day: java.time.LocalDate,
  MonthYear: Int,
  Year: Int,
  FractionDate: Float,
  Actor1Code: String,
  Actor1Name: String,
  Actor1CountryCode: String,
  Actor1KnownGroupCode: String,
  Actor1EthnicCode: String,
  Actor1Religion1Code: String,
  Actor1Religion2Code: String,
  Actor1Type1Code: String,
  Actor1Type2Code: String,
  Actor1Type3Code: String,
  Actor2Code: String,
  Actor2Name: String,
  Actor2CountryCode: String,
  Actor2KnownGroupCode: String,
  Actor2EthnicCode: String,
  Actor2Religion1Code: String,
  Actor2Religion2Code: String,
  Actor2Type1Code: String,
  Actor2Type2Code: String,
  Actor2Type3Code: String,
  IsRootEvent: Int,
  EventCode: String,
  EventBaseCode: String,
  EventRootCode: String,
  QuadClass: Int,
  GoldsteinScale: Double,
  NumMentions: Int,
  NumSources: Int,
  NumArticles: Int,
  AvgTone: Double,
  Actor1Geo_Type: Int,
  Actor1Geo_Fullname: String,
  Actor1Geo_CountryCode: String,
  Actor1Geo_ADM1Code: String,
  Actor1Geo_ADM2Code: String,
  Actor1Geo_Lat: Double,
  Actor1Geo_Long: Double,
  Actor1Geo_FeatureID: String,
  Actor2Geo_Type: Int,
  Actor2Geo_Fullname: String,
  Actor2Geo_CountryCode: String,
  Actor2Geo_ADM1Code: String,
  Actor2Geo_ADM2Code: String,
  Actor2Geo_Lat: Double,
  Actor2Geo_Long: Double,
  Actor2Geo_FeatureID: String,
  ActionGeo_Type: Int,
  ActionGeo_Fullname: String,
  ActionGeo_CountryCode: String,
  ActionGeo_ADM1Code: String,
  ActionGeo_ADM2Code: String,
  ActionGeo_Lat: Double,
  ActionGeo_Long: Double,
  ActionGeo_FeatureID: String,
  DATEADDED: String,
  SOURCEURL: String,
) extends Record() {
  override def toJSON(): String = {
    s"""{
       |"GlobalEventID": "$GlobalEventID",
       |"Day": "$Day",
       |"MonthYear": "$MonthYear",
       |"Year": "$Year",
       |"FractionDate": "$FractionDate",
       |"Actor1Code": "${if (Actor1Code != null) Actor1Code else ""}",
       |"Actor1Name": "${if (Actor1Name != null) Actor1Name else ""}",
       |"Actor1CountryCode": "${if (Actor1CountryCode != null) Actor1CountryCode else ""}",
       |"Actor1KnownGroupCode": "${if (Actor1KnownGroupCode != null) Actor1KnownGroupCode else ""}",
       |"Actor1EthnicCode": "${if (Actor1EthnicCode != null) Actor1EthnicCode else ""}",
       |"Actor1Religion1Code": "${if (Actor1Religion1Code != null) Actor1Religion1Code else ""}",
       |"Actor1Religion2Code": "${if (Actor1Religion2Code != null) Actor1Religion2Code else ""}",
       |"Actor1Type1Code": "${if (Actor1Type1Code != null) Actor1Type1Code else ""}",
       |"Actor1Type2Code": "${if (Actor1Type2Code != null) Actor1Type2Code else ""}",
       |"Actor1Type3Code": "${if (Actor1Type3Code != null) Actor1Type3Code else ""}",
       |"Actor2Code": "${if (Actor2Code != null) Actor2Code else ""}",
       |"Actor2Name": "${if (Actor2Name != null) Actor2Name else ""}",
       |"Actor2CountryCode": "${if (Actor2CountryCode != null) Actor2CountryCode else ""}",
       |"Actor2KnownGroupCode": "${if (Actor2KnownGroupCode != null) Actor2KnownGroupCode else ""}",
       |"Actor2EthnicCode": "${if (Actor2EthnicCode != null) Actor2EthnicCode else ""}",
       |"Actor2Religion1Code": "${if (Actor2Religion1Code != null) Actor2Religion1Code else ""}",
       |"Actor2Religion2Code": "${if (Actor2Religion2Code != null) Actor2Religion2Code else ""}",
       |"Actor2Type1Code": "${if (Actor2Type1Code != null) Actor2Type1Code else ""}",
       |"Actor2Type2Code": "${if (Actor2Type2Code != null) Actor2Type2Code else ""}",
       |"Actor2Type3Code": "${if (Actor2Type3Code != null) Actor2Type3Code else ""}",
       |"IsRootEvent": "$IsRootEvent",
       |"EventCode": "$EventCode",
       |"EventBaseCode": "$EventBaseCode",
       |"EventRootCode": "$EventRootCode",
       |"QuadClass": "$QuadClass",
       |"GoldsteinScale": "$GoldsteinScale",
       |"NumMentions": "$NumMentions",
       |"NumSources": "$NumSources",
       |"NumArticles": "$NumArticles",
       |"AvgTone": "$AvgTone",
       |"Actor1Geo_Type": "$Actor1Geo_Type",
       |"Actor1Geo_Fullname": "${if (Actor1Geo_Fullname != null) Actor1Geo_Fullname else ""}",
       |"Actor1Geo_CountryCode": "${if (Actor1Geo_CountryCode != null) Actor1Geo_CountryCode else ""}",
       |"Actor1Geo_ADM1Code": "${if (Actor1Geo_ADM1Code != null) Actor1Geo_ADM1Code else ""}",
       |"Actor1Geo_ADM2Code": "${if (Actor1Geo_ADM2Code != null) Actor1Geo_ADM2Code else ""}",
       |"Actor1Geo_Lat": "$Actor1Geo_Lat",
       |"Actor1Geo_Long": "$Actor1Geo_Long",
       |"Actor1Geo_FeatureID": "${if (Actor1Geo_FeatureID != null) Actor1Geo_FeatureID else ""}",
       |"Actor2Geo_Type": "$Actor2Geo_Type",
       |"Actor2Geo_Fullname": "${if (Actor2Geo_Fullname != null) Actor2Geo_Fullname else ""}",
       |"Actor2Geo_CountryCode": "${if (Actor2Geo_CountryCode != null) Actor2Geo_CountryCode else ""}",
       |"Actor2Geo_ADM1Code": "${if (Actor2Geo_ADM1Code != null) Actor2Geo_ADM1Code else ""}",
       |"Actor2Geo_ADM2Code": "${if (Actor2Geo_ADM2Code != null) Actor2Geo_ADM2Code else ""}",
       |"Actor2Geo_Lat": "$Actor2Geo_Lat",
       |"Actor2Geo_Long": "$Actor2Geo_Long",
       |"Actor2Geo_FeatureID": "${if (Actor2Geo_FeatureID != null) Actor2Geo_FeatureID else ""}",
       |"ActionGeo_Type": "$ActionGeo_Type",
       |"ActionGeo_Fullname": "${if (ActionGeo_Fullname != null) ActionGeo_Fullname else ""}",
       |"ActionGeo_CountryCode": "${if (ActionGeo_CountryCode != null) ActionGeo_CountryCode else ""}",
       |"ActionGeo_ADM1Code": "${if (ActionGeo_ADM1Code != null) ActionGeo_ADM1Code else ""}",
       |"ActionGeo_ADM2Code": "${if (ActionGeo_ADM2Code != null) ActionGeo_ADM2Code else ""}",
       |"ActionGeo_Lat": "$ActionGeo_Lat",
       |"ActionGeo_Long": "$ActionGeo_Long",
       |"ActionGeo_FeatureID": "${if (ActionGeo_FeatureID != null) ActionGeo_FeatureID else ""}",
       |"DATEADDED": "$DATEADDED",
       |"SOURCEURL": "$SOURCEURL"
       |}""".stripMargin('|')
  }
}

abstract class CAMEOCode(code: String ,label: String) extends Record {
  override def toJSON(): String = {
    s"""{"code": "$code", "label":"$label"}"""
  }
}

case class CAMEO_country(code: String, label: String) extends CAMEOCode(code,label)
case class CAMEO_type(code: String, label: String) extends CAMEOCode(code,label)
case class CAMEO_knowngroup(code: String, label: String) extends CAMEOCode(code,label)
case class CAMEO_ethnic(code: String, label: String) extends CAMEOCode(code,label)
case class CAMEO_religion(code: String, label: String) extends CAMEOCode(code,label)
case class CAMEO_eventcodes(code: String, label: String) extends CAMEOCode(code,label)
case class CAMEO_goldsteinscale(code: String, label: String) extends CAMEOCode(code,label)
case class FIPS_country(code: String, label: String) extends CAMEOCode(code,label)
