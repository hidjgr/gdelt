SELECT globaleventid,actiongeo_fullname,actiongeo_lat,actiongeo_long,nummentions FROM Events WHERE
57.29577951*ASIN(
least(greatest(
     cos(0.01745329252*48.2093833)
    *sin(0.01745329252*2.311555)
    *cos(0.01745329252*actiongeo_lat)
    *sin(0.01745329252*actiongeo_long)
    +cos(0.01745329252*48.2093833)
    *cos(0.01745329252*2.311555)
    *cos(0.01745329252*actiongeo_lat)
    *cos(0.01745329252*actiongeo_long)
    +sin(0.01745329252*48.2093833)
    *sin(0.01745329252*actiongeo_lat)
,-1),1)
) > 85 ORDER BY nummentions DESC LIMIT 500;
