package org.hidjgr.gdeltserver

import slick.jdbc.PostgresProfile.api._
import slick.collection.heterogeneous._
import slick.collection.heterogeneous.syntax._

final case class GDELT_Event(
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
  DATEADDED: Long,
  SOURCEURL: String,
) 

class GDELT_Events(tag: Tag) extends Table[GDELT_Event](tag, "Events") {
  def GlobalEventID = column[Int]("GlobalEventID")
  def Day = column[java.time.LocalDate]("Day")
  def MonthYear = column[Int]("MonthYear")
  def Year = column[Int]("Year")
  def FractionDate = column[Float]("FractionDate")
  def Actor1Code = column[String]("Actor1Code")
  def Actor1Name = column[String]("Actor1Name")
  def Actor1CountryCode = column[String]("Actor1CountryCode")
  def Actor1KnownGroupCode = column[String]("Actor1KnownGroupCode")
  def Actor1EthnicCode = column[String]("Actor1EthnicCode")
  def Actor1Religion1Code = column[String]("Actor1Religion1Code")
  def Actor1Religion2Code = column[String]("Actor1Religion2Code")
  def Actor1Type1Code = column[String]("Actor1Type1Code")
  def Actor1Type2Code = column[String]("Actor1Type2Code")
  def Actor1Type3Code = column[String]("Actor1Type3Code")
  def Actor2Code = column[String]("Actor2Code")
  def Actor2Name = column[String]("Actor2Name")
  def Actor2CountryCode = column[String]("Actor2CountryCode")
  def Actor2KnownGroupCode = column[String]("Actor2KnownGroupCode")
  def Actor2EthnicCode = column[String]("Actor2EthnicCode")
  def Actor2Religion1Code = column[String]("Actor2Religion1Code")
  def Actor2Religion2Code = column[String]("Actor2Religion2Code")
  def Actor2Type1Code = column[String]("Actor2Type1Code")
  def Actor2Type2Code = column[String]("Actor2Type2Code")
  def Actor2Type3Code = column[String]("Actor2Type3Code")
  def IsRootEvent = column[Int]("IsRootEvent")
  def EventCode = column[String]("EventCode")
  def EventBaseCode = column[String]("EventBaseCode")
  def EventRootCode = column[String]("EventRootCode")
  def QuadClass = column[Int]("QuadClass")
  def GoldsteinScale = column[Double]("GoldsteinScale")
  def NumMentions = column[Int]("NumMentions")
  def NumSources = column[Int]("NumSources")
  def NumArticles = column[Int]("NumArticles")
  def AvgTone = column[Double]("AvgTone")
  def Actor1Geo_Type = column[Int]("Actor1Geo_Type")
  def Actor1Geo_Fullname = column[String]("Actor1Geo_Fullname")
  def Actor1Geo_CountryCode = column[String]("Actor1Geo_CountryCode")
  def Actor1Geo_ADM1Code = column[String]("Actor1Geo_ADM1Code")
  def Actor1Geo_ADM2Code = column[String]("Actor1Geo_ADM2Code")
  def Actor1Geo_Lat = column[Double]("Actor1Geo_Lat")
  def Actor1Geo_Long = column[Double]("Actor1Geo_Long")
  def Actor1Geo_FeatureID = column[String]("Actor1Geo_FeatureID")
  def Actor2Geo_Type = column[Int]("Actor2Geo_Type")
  def Actor2Geo_Fullname = column[String]("Actor2Geo_Fullname")
  def Actor2Geo_CountryCode = column[String]("Actor2Geo_CountryCode")
  def Actor2Geo_ADM1Code = column[String]("Actor2Geo_ADM1Code")
  def Actor2Geo_ADM2Code = column[String]("Actor2Geo_ADM2Code")
  def Actor2Geo_Lat = column[Double]("Actor2Geo_Lat")
  def Actor2Geo_Long = column[Double]("Actor2Geo_Long")
  def Actor2Geo_FeatureID = column[String]("Actor2Geo_FeatureID")
  def ActionGeo_Type = column[Int]("ActionGeo_Type")
  def ActionGeo_Fullname = column[String]("ActionGeo_Fullname")
  def ActionGeo_CountryCode = column[String]("ActionGeo_CountryCode")
  def ActionGeo_ADM1Code = column[String]("ActionGeo_ADM1Code")
  def ActionGeo_ADM2Code = column[String]("ActionGeo_ADM2Code")
  def ActionGeo_Lat = column[Double]("ActionGeo_Lat")
  def ActionGeo_Long = column[Double]("ActionGeo_Long")
  def ActionGeo_FeatureID = column[String]("ActionGeo_FeatureID")
  def DATEADDED = column[Long]("DATEADDED")
  def SOURCEURL = column[String]("SOURCEURL")

  def * = (GlobalEventID :: Day :: MonthYear :: Year :: FractionDate :: Actor1Code :: Actor1Name :: Actor1CountryCode :: Actor1KnownGroupCode :: Actor1EthnicCode :: Actor1Religion1Code :: Actor1Religion2Code :: Actor1Type1Code :: Actor1Type2Code :: Actor1Type3Code :: Actor2Code :: Actor2Name :: Actor2CountryCode :: Actor2KnownGroupCode :: Actor2EthnicCode :: Actor2Religion1Code :: Actor2Religion2Code :: Actor2Type1Code :: Actor2Type2Code :: Actor2Type3Code :: IsRootEvent :: EventCode :: EventBaseCode :: EventRootCode :: QuadClass :: GoldsteinScale :: NumMentions :: NumSources :: NumArticles :: AvgTone :: Actor1Geo_Type :: Actor1Geo_Fullname :: Actor1Geo_CountryCode :: Actor1Geo_ADM1Code :: Actor1Geo_ADM2Code :: Actor1Geo_Lat :: Actor1Geo_Long :: Actor1Geo_FeatureID :: Actor2Geo_Type :: Actor2Geo_Fullname :: Actor2Geo_CountryCode :: Actor2Geo_ADM1Code :: Actor2Geo_ADM2Code :: Actor2Geo_Lat :: Actor2Geo_Long :: Actor2Geo_FeatureID :: ActionGeo_Type :: ActionGeo_Fullname :: ActionGeo_CountryCode :: ActionGeo_ADM1Code :: ActionGeo_ADM2Code :: ActionGeo_Lat :: ActionGeo_Long :: ActionGeo_FeatureID :: DATEADDED :: SOURCEURL :: HNil).mapTo[GDELT_Event]
}

final case class CAMEOCode(code: String ,label: String)

class CAMEO_country(tag: Tag) extends Table[CAMEOCode](tag, "cameo_country") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
class CAMEO_type(tag: Tag) extends Table[CAMEOCode](tag, "cameo_type") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
class CAMEO_knowngroup(tag: Tag) extends Table[CAMEOCode](tag, "cameo_knowngroup") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
class CAMEO_ethnic(tag: Tag) extends Table[CAMEOCode](tag, "cameo_ethnic") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
class CAMEO_religion(tag: Tag) extends Table[CAMEOCode](tag, "cameo_religion") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
class CAMEO_eventcodes(tag: Tag) extends Table[CAMEOCode](tag, "cameo_eventcodes") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
class CAMEO_goldsteinscale(tag: Tag) extends Table[CAMEOCode](tag, "cameo_goldsteinscale") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
class FIPS_country(tag: Tag) extends Table[CAMEOCode](tag,"fips_country") {
  def code = column[String]("code")
  def label = column[String]("label")
  def * = (code :: label :: HNil).mapTo[CAMEOCode]
}
