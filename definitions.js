function Point(posX, posY, posZ) {
  this.x = posX;
  this.y = posY;
  this.z = posZ;
}

function Color(red, green, blue, alpha) {
  this.r = red;
  this.g = green;
  this.b = blue;
  this.a = alpha;
}

var fontFamiliesVec = [
  'font-family: Arial, sans-serif;',
  'font-family: Verdana, sans-serif;',
  'font-family: Helvetica, sans-serif',
  'font-family: Arial Black, sans-serif;',
  'font-family: Tahoma, sans-serif;',
  'font-family: Trebuchet MS, sans-serif;',
  'font-family: Impact, sans-serif;',
  'font-family: Gill Sans, serif;',
  'font-family: Times New Roman, serif;',
  'font-family: Georgia, serif;',
  'font-family: Palatino, serif;',
  'font-family: Baskerville, serif;',
  'font-family: Courier, monospace;',
  'font-family: Lucida, monospace;',
  'font-family: Monaco, monospace;',
  'font-family: Bradley Hand, cursive;',
  'font-family: Brush Script MT, cursive;',
  'font-family: Luminari, cursive;',
  'font-family: Comic Sans MS, cursive;'
];

const CAIOSMODE_DEFAULT = 0;

const DEFAULT_HEADRADIUS = 5.5;
const DEFAULT_TORSOWIDTH = 4;
const DEFAULT_TORSOHEIGHT = 10;
const DEFAULT_FEMURWIDTH = 4;
const DEFAULT_FEMURHEIGHT = 7;
const DEFAULT_TIBIAWIDTH = 4;
const DEFAULT_TIBIAHEIGHT = 7;

const DEFAULT_MAXZ = -3750;
const DEFAULT_MAXCOLOR = 190;
const DEFAULT_MINCOLOR = 120;

const MAX_GENERALROTATIONPERFRAME = 7;

const MAX_FEMURROTATION = 95;
const MAX_TIBIAROTATION = 130;
