let currentLat = null;
let currentLon = null;

/* =========================
MODE SWITCH
========================= */

document
.getElementById('mode')

.addEventListener('change', function(){

if(this.value==='decimal'){

document.getElementById('decimalCard')
.style.display='block';

document.getElementById('utmCard')
.style.display='none';

}

else{

document.getElementById('decimalCard')
.style.display='none';

document.getElementById('utmCard')
.style.display='block';

}

});

/* =========================
SYSTEM HINTS
========================= */

document
.getElementById('coordinateSystem')

.addEventListener('change', function(){

const hint =
document.getElementById('systemHint');

if(this.value==='wgs84'){

hint.innerHTML=`

Used for:
GPS, Google Maps,
Modern GIS Systems

`;

}

if(this.value==='redbelt'){

hint.innerHTML=`

Used for:
Minya,
Central Egypt,
Quarries,
Survey Projects

`;

}

if(this.value==='purplebelt'){

hint.innerHTML=`

Used for:
Eastern Egypt,
Legacy Survey Systems,
Old CAD Files

`;

}

});

/* =========================
PROJECTIONS
========================= */

proj4.defs(

"EPSG:22992",

"+proj=tmerc +lat_0=30 +lon_0=31 +k=0.99985 +x_0=615000 +y_0=810000 +ellps=intl +units=m +no_defs"

);

proj4.defs(

"EPSG:22993",

"+proj=tmerc +lat_0=30 +lon_0=31 +k=0.99985 +x_0=615000 +y_0=810000 +ellps=intl +units=m +no_defs"

);

/* =========================
GET PROJECTION
========================= */

function getProjection(){

const system =
document.getElementById('coordinateSystem').value;

if(system==='wgs84'){

return{

proj:
'+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs',

name:'WGS84 / UTM 36N'

};

}

if(system==='redbelt'){

return{

proj:'EPSG:22992',

name:'Egypt Red Belt'

};

}

if(system==='purplebelt'){

return{

proj:'EPSG:22993',

name:'Egypt Purple Belt'

};

}

}

/* =========================
DECIMAL TO DMS
========================= */

function decimalToDMS(decimal){

const absolute =
Math.abs(decimal);

const degrees =
Math.floor(absolute);

const minutesNotTruncated =
(absolute-degrees)*60;

const minutes =
Math.floor(minutesNotTruncated);

const seconds =
(
(minutesNotTruncated-minutes)*60
).toFixed(2);

return{

degrees,
minutes,
seconds

};

}

/* =========================
SHOW DMS
========================= */

function showDMS(lat,lon){

const latDMS =
decimalToDMS(lat);

const lonDMS =
decimalToDMS(lon);

document.getElementById('dmsLatDeg')
.value =
latDMS.degrees;

document.getElementById('dmsLatMin')
.value =
latDMS.minutes;

document.getElementById('dmsLatSec')
.value =
latDMS.seconds;

document.getElementById('dmsLatDir')
.value =
lat>=0?'N':'S';

document.getElementById('dmsLonDeg')
.value =
lonDMS.degrees;

document.getElementById('dmsLonMin')
.value =
lonDMS.minutes;

document.getElementById('dmsLonSec')
.value =
lonDMS.seconds;

document.getElementById('dmsLonDir')
.value =
lon>=0?'E':'W';

}

/* =========================
LAT/LON TO UTM
========================= */

function convertDecimalToUTM(){

const lat =
parseFloat(
document.getElementById('lat').value
);

const lon =
parseFloat(
document.getElementById('lon').value
);

if(isNaN(lat)||isNaN(lon)){

alert('Invalid Coordinates');

return;

}

currentLat = lat;
currentLon = lon;

const system =
getProjection();

const result =

proj4(

'EPSG:4326',

system.proj,

[lon,lat]

);

document.getElementById('zone')
.innerText =
system.name;

document.getElementById('easting')
.innerText =
result[0].toFixed(3);

document.getElementById('northing')
.innerText =
result[1].toFixed(3);

document.getElementById('resultLat')
.innerText =
lat.toFixed(8);

document.getElementById('resultLon')
.innerText =
lon.toFixed(8);

showDMS(lat,lon);

}

/* =========================
UTM TO LAT/LON
========================= */

function convertUTMToLatLon(){

const easting =

parseFloat(
document.getElementById('utmEasting')
.value
);

const northing =

parseFloat(
document.getElementById('utmNorthing')
.value
);

if(
isNaN(easting)||
isNaN(northing)
){

alert('Invalid Coordinates');

return;

}

const system =
getProjection();

const result =

proj4(

system.proj,

'EPSG:4326',

[easting,northing]

);

currentLat = result[1];
currentLon = result[0];

document.getElementById('zone')
.innerText =
system.name;

document.getElementById('easting')
.innerText =
easting.toFixed(3);

document.getElementById('northing')
.innerText =
northing.toFixed(3);

document.getElementById('resultLat')
.innerText =
result[1].toFixed(8);

document.getElementById('resultLon')
.innerText =
result[0].toFixed(8);

showDMS(result[1],result[0]);

}

/* =========================
COPY RESULTS
========================= */

function copyResults(){

const text = `

System:
${document.getElementById('zone').innerText}

Easting:
${document.getElementById('easting').innerText}

Northing:
${document.getElementById('northing').innerText}

Latitude:
${document.getElementById('resultLat').innerText}

Longitude:
${document.getElementById('resultLon').innerText}

`;

navigator.clipboard
.writeText(text);

alert('Results Copied');

}

/* =========================
OPEN MAP
========================= */

function openMap(){

if(
currentLat===null||
currentLon===null
){

alert('No Coordinates');

return;

}

window.open(

`https://www.google.com/maps?q=${currentLat},${currentLon}`,

'_blank'

);

}