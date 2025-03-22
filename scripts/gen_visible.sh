# sin(θ)*sin(actiongeo_long)*cos(actiongeo_lat) + sin(θ)*cos(φ)*sin(actiongeo_lat) + cos(φ)*cos(θ)*cos(actiongeo_long)*cos(actiongeo_lat)

DEG_RAD=0.01745329252
RAD_DEG=57.29577951

Theta=48.2093833
Phi=2.311555

RADIUS=5

MAX_LAT=$(( 90 - $RADIUS ))


cat << EOF > visible.sql
SELECT globaleventid,actiongeo_fullname,actiongeo_lat,actiongeo_long,nummentions FROM Events WHERE
$RAD_DEG*ASIN(
least(greatest(
     cos($DEG_RAD*$Theta)
    *sin($DEG_RAD*$Phi)
    *cos($DEG_RAD*actiongeo_lat)
    *sin($DEG_RAD*actiongeo_long)
    +cos($DEG_RAD*$Theta)
    *cos($DEG_RAD*$Phi)
    *cos($DEG_RAD*actiongeo_lat)
    *cos($DEG_RAD*actiongeo_long)
    +sin($DEG_RAD*$Theta)
    *sin($DEG_RAD*actiongeo_lat)
,-1),1)
) > $MAX_LAT ORDER BY nummentions DESC LIMIT 500;
EOF
