CREATE TABLE IF NOT EXISTS Events (
	 GlobalEventID INT PRIMARY KEY
	,Day DATE
	,MonthYear INT
	,Year INT
	,FractionDate REAL
	,Actor1Code VARCHAR
	,Actor1Name VARCHAR
	,Actor1CountryCode VARCHAR
	,Actor1KnownGroupCode VARCHAR
	,Actor1EthnicCode VARCHAR
	,Actor1Religion1Code VARCHAR
	,Actor1Religion2Code VARCHAR
	,Actor1Type1Code VARCHAR
	,Actor1Type2Code VARCHAR
	,Actor1Type3Code VARCHAR
	,Actor2Code VARCHAR
	,Actor2Name VARCHAR
	,Actor2CountryCode VARCHAR
	,Actor2KnownGroupCode VARCHAR
	,Actor2EthnicCode VARCHAR
	,Actor2Religion1Code VARCHAR
	,Actor2Religion2Code VARCHAR
	,Actor2Type1Code VARCHAR
	,Actor2Type2Code VARCHAR
	,Actor2Type3Code VARCHAR
	,IsRootEvent INT
	,EventCode VARCHAR
	,EventBaseCode VARCHAR
	,EventRootCode VARCHAR
	,QuadClass INT
	,GoldsteinScale FLOAT(24)
	,NumMentions INT
	,NumSources INT
	,NumArticles INT
	,AvgTone FLOAT(24)
	,Actor1Geo_Type INT
	,Actor1Geo_Fullname VARCHAR
	,Actor1Geo_CountryCode VARCHAR
	,Actor1Geo_ADM1Code VARCHAR
	,Actor1Geo_ADM2Code VARCHAR
	,Actor1Geo_Lat FLOAT(24)
	,Actor1Geo_Long FLOAT(24)
	,Actor1Geo_FeatureID VARCHAR
	,Actor2Geo_Type INT
	,Actor2Geo_Fullname VARCHAR
	,Actor2Geo_CountryCode VARCHAR
	,Actor2Geo_ADM1Code VARCHAR
	,Actor2Geo_ADM2Code VARCHAR
	,Actor2Geo_Lat FLOAT(24)
	,Actor2Geo_Long FLOAT(24)
	,Actor2Geo_FeatureID VARCHAR
	,ActionGeo_Type INT
	,ActionGeo_Fullname VARCHAR
	,ActionGeo_CountryCode VARCHAR
	,ActionGeo_ADM1Code VARCHAR
	,ActionGeo_ADM2Code VARCHAR
	,ActionGeo_Lat FLOAT(24)
	,ActionGeo_Long FLOAT(24)
	,ActionGeo_FeatureID VARCHAR
	,DATEADDED BIGINT
	,SOURCEURL VARCHAR
);

CREATE TABLE IF NOT EXISTS CAMEO_country (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

CREATE TABLE IF NOT EXISTS CAMEO_type (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

CREATE TABLE IF NOT EXISTS CAMEO_knowngroup (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

CREATE TABLE IF NOT EXISTS CAMEO_ethnic (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

CREATE TABLE IF NOT EXISTS CAMEO_religion (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

CREATE TABLE IF NOT EXISTS CAMEO_eventcodes (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

CREATE TABLE IF NOT EXISTS CAMEO_goldsteinscale (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

CREATE TABLE IF NOT EXISTS FIPS_country (
	 code VARCHAR PRIMARY KEY
	,label VARCHAR
);

