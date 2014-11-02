#include <stdio.h>
#include <errno.h>
#include <string.h>

#include <wiringPi.h>
#include <softPwm.h>


int main (int argc, char **argv) {
  char buf[80];
  if(argc != 4) {
    fprintf(stderr, "Invalid arguments. Usage:\npwm <pin> <range> <initial value>\n");
    exit(1);
  }
  int pin = atoi(argv[1]);
  int range = atoi(argv[2]);
  int value = atoi(argv[3]);
  if(value < 0) value = 0;
  if(value > range) value = range;
  wiringPiSetup();
  softPwmCreate(pin, 0, range);
  softPwmWrite (pin, value);
  while(fgets(buf, sizeof(buf), stdin)) {
    value = atoi(buf);
    if(value < 0) value = 0;
    if(value > range) value = range;
    softPwmWrite (pin, value);
  }
}
