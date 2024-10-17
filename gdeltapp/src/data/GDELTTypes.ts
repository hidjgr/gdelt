export class Event {
  constructor(
    public GlobalEventID: number,
    public Day: Date,
    public MonthYear: number,
    public Year: number,
    public FractionDate: number,
    public AvgTone: number | null,
    public EventBaseCode: string,
    public EventCode: string,
    public EventRootCode: string,
    public GoldsteinScale: number | null,
    public IsRootEvent: number | null,
    public NumArticles: number | null,
    public NumMentions: number | null,
    public NumSources: number | null,
    public QuadClass: number | null,
    public Actor1Code: string,
    public Actor1CountryCode: string,
    public Actor1EthnicCode: string,
    public Actor1KnownGroupCode: string,
    public Actor1Name: string,
    public Actor1Religion1Code: string,
    public Actor1Religion2Code: string,
    public Actor1Type1Code: string,
    public Actor1Type2Code: string,
    public Actor1Type3Code: string,
    public Actor2Code: string,
    public Actor2CountryCode: string,
    public Actor2EthnicCode: string,
    public Actor2KnownGroupCode: string,
    public Actor2Name: string,
    public Actor2Religion1Code: string,
    public Actor2Religion2Code: string,
    public Actor2Type1Code: string,
    public Actor2Type2Code: string,
    public Actor2Type3Code: string,
    public ActionGeo_ADM1Code: string,
    public ActionGeo_ADM2Code: string,
    public ActionGeo_CountryCode: string,
    public ActionGeo_FeatureID: string,
    public ActionGeo_Fullname: string,
    public ActionGeo_Lat: number | null,
    public ActionGeo_Long: number | null,
    public ActionGeo_Type: number | null,
    public Actor1Geo_ADM1Code: string,
    public Actor1Geo_ADM2Code: string,
    public Actor1Geo_CountryCode: string,
    public Actor1Geo_FeatureID: string,
    public Actor1Geo_Fullname: string,
    public Actor1Geo_Lat: number | null,
    public Actor1Geo_Long: number | null,
    public Actor1Geo_Type: number | null,
    public Actor2Geo_ADM1Code: string,
    public Actor2Geo_ADM2Code: string,
    public Actor2Geo_CountryCode: string,
    public Actor2Geo_FeatureID: string,
    public Actor2Geo_Fullname: string,
    public Actor2Geo_Lat: number | null,
    public Actor2Geo_Long: number | null,
    public Actor2Geo_Type: number | null,
    public DATEADDED: string,
    public SOURCEURL: string,
  ) {}
}

export abstract class CAMEOCode {
  constructor(public code: string, public label: string) {}
}

export class CAMEO_country extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
export class CAMEO_type extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
export class CAMEO_knowngroup extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
export class CAMEO_ethnic extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
export class CAMEO_religion extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
export class CAMEO_eventcodes extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
export class CAMEO_goldsteinscale extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
export class FIPS_country extends CAMEOCode {
  constructor(public code: string, public label: string) {super(code, label);}
}
