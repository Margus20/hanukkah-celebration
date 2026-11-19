// ====== DATOS DE JANUCÁ ======

// Noches 1..8 de Janucá 2026 (fecha gregoriana de cada noche)
const NOCHES = [
  {y:2026,m:12,d:4},
  {y:2026,m:12,d:5},
  {y:2026,m:12,d:6},
  {y:2026,m:12,d:7},
  {y:2026,m:12,d:8},
  {y:2026,m:12,d:9},
  {y:2026,m:12,d:10},
  {y:2026,m:12,d:11}
];

// Posiciones porcentuales (x, y) de las 8 velas + shamash
// AJÚSTALAS si las velas en tus imágenes están en otras posiciones
// Índices: 0-3 velas izquierda, 4 shamash, 5-8 velas derecha
const POS = [
  {x:14, y:62},   // vela 1 (extremo izquierdo)
  {x:24, y:62},   // vela 2
  {x:34, y:62},   // vela 3
  {x:44, y:62},   // vela 4
  {x:50, y:46},   // shamash (centro, más alto)
  {x:56, y:62},   // vela 5
  {x:66, y:62},   // vela 6
  {x:76, y:62},   // vela 7
  {x:86, y:62}    // vela 8 (extremo derecho)
];

// Ciudades con coordenadas y zona horaria
const CIUDADES = {
  caracas:     {lat:10.49,  lng:-66.90, tz:'America/Caracas'},
  maracaibo:   {lat:10.64,  lng:-71.63, tz:'America/Caracas'},
  valencia:    {lat:10.16,  lng:-68.00, tz:'America/Caracas'},
  bogota:      {lat:4.71,   lng:-74.07, tz:'America/Bogota'},
  lima:        {lat:-12.05, lng:-77.04, tz:'America/Lima'},
  buenosaires: {lat:-34.60, lng:-58.38, tz:'America/Argentina/Buenos_Aires'},
  santiago:    {lat:-33.45, lng:-70.66, tz:'America/Santiago'},
  mexico:      {lat:19.43,  lng:-99.13, tz:'America/Mexico_City'},
  madrid:      {lat:40.42,  lng:-3.70,  tz:'Europe/Madrid'},
  nyc:         {lat:40.71,  lng:-74.00, tz:'America/New_York'},
  jerusalen:   {lat:31.77,  lng:35.21,  tz:'Asia/Jerusalem'}
};
