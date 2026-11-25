// ====== DATOS DE JANUCÁ ======

// Noches 1..8 de Janucá 2026
const NOCHES = [
  {y:2026,m:12,d:4},{y:2026,m:12,d:5},{y:2026,m:12,d:6},{y:2026,m:12,d:7},
  {y:2026,m:12,d:8},{y:2026,m:12,d:9},{y:2026,m:12,d:10},{y:2026,m:12,d:11}
];

// Coordenadas de la BASE de cada vela (donde está el portavelas)
// Las velas crecen HACIA ARRIBA desde aquí
// Orden: vela1, vela2, vela3, vela4, shamash, vela5, vela6, vela7, vela8
const WICK_POSITIONS = [
  {x:150, y:330},   // vela 1 - base
  {x:200, y:320},   // vela 2
  {x:250, y:310},   // vela 3
  {x:290, y:300},   // vela 4
  {x:350, y:290},   // shamash (base más baja pero vela más larga)
  {x:410, y:300},   // vela 5
  {x:450, y:310},   // vela 6
  {x:500, y:320},   // vela 7
  {x:550, y:330}    // vela 8
];

// Longitud de las velas (hacia arriba desde la base)
const CANDLE_LENGTH = 70;
const SHAMASH_LENGTH = 110;

// Ciudades con coordenadas y zona horaria
const CIUDADES = {
  caracas:     {lat:10.49, lng:-66.90, tz:'America/Caracas'},
  cumana:      {lat:10.46, lng:-64.18, tz:'America/Caracas'}, // <-- Cumaná, Estado Sucre agregada
  maracaibo:   {lat:10.64, lng:-71.63, tz:'America/Caracas'},
  valencia:    {lat:10.16, lng:-68.00, tz:'America/Caracas'},
  bogota:      {lat:4.71,  lng:-74.07, tz:'America/Bogota'},
  lima:        {lat:-12.05,lng:-77.04, tz:'America/Lima'},
  buenosaires: {lat:-34.60,lng:-58.38, tz:'America/Argentina/Buenos_Aires'},
  santiago:    {lat:-33.45,lng:-70.66, tz:'America/Santiago'},
  mexico:      {lat:19.43, lng:-99.13, tz:'America/Mexico_City'},
  madrid:      {lat:40.42, lng:-3.70,  tz:'Europe/Madrid'},
  nyc:         {lat:40.71, lng:-74.00, tz:'America/New_York'},
  jerusalen:   {lat:31.77, lng:35.21,  tz:'Asia/Jerusalem'}
};
