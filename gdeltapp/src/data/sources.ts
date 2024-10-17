import { Event, CAMEOCode, CAMEO_country, CAMEO_type, CAMEO_ethnic, CAMEO_religion, CAMEO_eventcodes, CAMEO_knowngroup, CAMEO_goldsteinscale, FIPS_country } from './GDELTTypes';

abstract class Source {
  protected mapEvents(jsonData: any[]): Event[] {
    return jsonData.map(eventData => new Event(
      Number(eventData.GlobalEventID),
      new Date(eventData.Day),
      Number(eventData.MonthYear),
      Number(eventData.Year),
      Number(eventData.FractionDate),
      eventData.AvgTone ? Number(eventData.AvgTone) : null,
      eventData.EventBaseCode,
      eventData.EventCode,
      eventData.EventRootCode,
      eventData.GoldsteinScale ? Number(eventData.GoldsteinScale) : null,
      eventData.IsRootEvent ? Number(eventData.IsRootEvent) : null,
      eventData.NumArticles ? Number(eventData.NumArticles) : null,
      eventData.NumMentions ? Number(eventData.NumMentions) : null,
      eventData.NumSources ? Number(eventData.NumSources) : null,
      eventData.QuadClass ? Number(eventData.QuadClass) : null,
      eventData.Actor1Code,
      eventData.Actor1CountryCode,
      eventData.Actor1EthnicCode,
      eventData.Actor1KnownGroupCode,
      eventData.Actor1Name,
      eventData.Actor1Religion1Code,
      eventData.Actor1Religion2Code,
      eventData.Actor1Type1Code,
      eventData.Actor1Type2Code,
      eventData.Actor1Type3Code,
      eventData.Actor2Code,
      eventData.Actor2CountryCode,
      eventData.Actor2EthnicCode,
      eventData.Actor2KnownGroupCode,
      eventData.Actor2Name,
      eventData.Actor2Religion1Code,
      eventData.Actor2Religion2Code,
      eventData.Actor2Type1Code,
      eventData.Actor2Type2Code,
      eventData.Actor2Type3Code,
      eventData.ActionGeo_ADM1Code,
      eventData.ActionGeo_ADM2Code,
      eventData.ActionGeo_CountryCode,
      eventData.ActionGeo_FeatureID,
      eventData.ActionGeo_Fullname,
      eventData.ActionGeo_Lat ? Number(eventData.ActionGeo_Lat) : null,
      eventData.ActionGeo_Long ? Number(eventData.ActionGeo_Long) : null,
      eventData.ActionGeo_Type ? Number(eventData.ActionGeo_Type) : null,
      eventData.Actor1Geo_ADM1Code,
      eventData.Actor1Geo_ADM2Code,
      eventData.Actor1Geo_CountryCode,
      eventData.Actor1Geo_FeatureID,
      eventData.Actor1Geo_Fullname,
      eventData.Actor1Geo_Lat ? Number(eventData.Actor1Geo_Lat) : null,
      eventData.Actor1Geo_Long ? Number(eventData.Actor1Geo_Long) : null,
      eventData.Actor1Geo_Type ? Number(eventData.Actor1Geo_Type) : null,
      eventData.Actor2Geo_ADM1Code,
      eventData.Actor2Geo_ADM2Code,
      eventData.Actor2Geo_CountryCode,
      eventData.Actor2Geo_FeatureID,
      eventData.Actor2Geo_Fullname,
      eventData.Actor2Geo_Lat ? Number(eventData.Actor2Geo_Lat) : null,
      eventData.Actor2Geo_Long ? Number(eventData.Actor2Geo_Long) : null,
      eventData.Actor2Geo_Type ? Number(eventData.Actor2Geo_Type) : null,
      eventData.DATEADDED,
      eventData.SOURCEURL,
    ));
  }

  protected mapCAMEOCodes(jsonData: any[], type: string): CAMEOCode[] {
    return jsonData.map(codeData => {
      switch (type) {
        case 'country':
          return new CAMEO_country(codeData.code, codeData.label);
        case 'type':
          return new CAMEO_type(codeData.code, codeData.label);
        case 'knowngroup':
          return new CAMEO_knowngroup(codeData.code, codeData.label);
        case 'ethnic':
          return new CAMEO_ethnic(codeData.code, codeData.label);
        case 'religion':
          return new CAMEO_religion(codeData.code, codeData.label);
        case 'eventcodes':
          return new CAMEO_eventcodes(codeData.code, codeData.label);
        case 'goldsteinscale':
          return new CAMEO_goldsteinscale(codeData.code, codeData.label);
        case 'f_country':
          return new FIPS_country(codeData.code, codeData.label);
        default:
          throw new Error('Unknown CAMEO code type');
      }
    });
  }

  abstract fetchEvents(startDate:Date, endDate:Date): Promise<Event[]>;
  abstract fetchCodes(cameoType:string): Promise<CAMEOCode[]>;
}

class ScalatraSource extends Source {
  
  async fetchEvents(startDate: Date, endDate: Date): Promise<Event[]> {
    try {
      const response = await fetch(`http://localhost/gdelt/api/events`);
      if (!response.ok) {
        throw new Error(`Error fetching events: ${response.statusText}`);
      }
      const data = await response.json();
      return this.mapEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  async fetchCodes(cameoType: string): Promise<CAMEOCode[]> {
    try {
      const response = await fetch(`http://localhost/gdelt/api/codes?cameo=${cameoType}`);
      if (!response.ok) {
        throw new Error(`Error fetching CAMEO codes: ${response.statusText}`);
      }
      const data = await response.json();
      return this.mapCAMEOCodes(data, cameoType);
    } catch (error) {
      console.error('Failed to fetch CAMEO codes:', error);
      throw error;
    }
  }
}

/*class SampleSource extends Source {
  async fetchEvents(startDate:Date, endDate:Date) {
    return null;
  }
  async fetchCodes() {
    return null;
  }
}

class ZipSource extends Source {
  async fetchEvents(startDate:Date, endDate:Date) {
    return null;
  }
  async fetchCodes() {
    return null;
  }
}

class BigQuerySource extends Source {
  async fetchEvents(startDate:Date, endDate:Date) {
    return null;
  }
  async fetchCodes() {
    return null;
  }
}*/

export function getSource(source: string): Source {
  switch (source) {
    case 'scalatra':
      return new ScalatraSource();
    /*case "sample":
      return new SampleSource();
    case "zip":
      return new ZipSource();
    case "bigquery":
      return new BigQuerySource();*/
    default:
      throw new Error('Unknown source type');
  }
}
