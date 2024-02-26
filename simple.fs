precision highp float;
uniform vec4 uColor;
varying vec2 fragPosition;

uniform vec4 startColor;
uniform vec4 endColor;

uniform int colorAmount;

const int MAX_ITER = 1000;

int MandelbrotTest(float cr, float ci)
{
    int count = 0;

    float zr = 0.;
    float zi = 0.;
    float zrsqr = 0.;
    float zisqr = 0.;

    for (int i=0; i<MAX_ITER; i++){
      zi = zr * zi;
      zi += zi;
      zi += ci;
      zr = zrsqr - zisqr + cr;
      zrsqr = zr * zr;
      zisqr = zi * zi;
		
      //the fewer iterations it takes to diverge, the farther from the set
      if (zrsqr + zisqr > 4.0) 
        break;
      count++;
    }

    return count;
}

void main()
{
    int count = MandelbrotTest(fragPosition[0], fragPosition[1]);

    float red = float(count);
    red = red * 2.5;
    red = red / 1000.;

    float blue = float(count);
    blue = blue / 100.;
    blue = blue - 1.;
    blue = blue * -1.;

    float green = 0.1;

    if (red > 1.0) {
      red = 1.0;
    }

    if (blue > 1.0) {
      blue = 1.0;
    }
 
    gl_FragColor = vec4(
      red,
      green,
      blue,
      1.
    );
}
