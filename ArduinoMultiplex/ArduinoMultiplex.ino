/*
 * Authors: Rohan Deshpande and Anne Lee
 * Class: ENGR 40M, Project 3b
 * Date: 11/11/2018
 */


String incoming = "";

const byte ANODE_PINS[8] = {13, 12, 11, 10, 9, 8, 7, 6};
const byte CATHODE_PINS[8] = {A3, A2, A1, A0, 5, 4, 3, 2};
byte pattern[8][8] = {
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0}
};

void setup() {
  // Configure pins
  
  for(int i = 0; i<8; i++){
    pinMode(ANODE_PINS[i], OUTPUT);
    digitalWrite(ANODE_PINS[i], HIGH);
  }
  for(int i = 0; i<8; i++){
    pinMode(CATHODE_PINS[i], OUTPUT);
    digitalWrite(CATHODE_PINS[i], HIGH);
  }
  
  Serial.begin(9600);
}


// display byte pattern using multiplexing
void display() {
  for(int i = 0; i<8; i++){
    for(int j = 0; j<8;j++){
      if(pattern[i][j]){
        digitalWrite(CATHODE_PINS[j],LOW);
      }
      else{
        digitalWrite(CATHODE_PINS[j],HIGH);
      }
    }
    digitalWrite(ANODE_PINS[i], LOW);
    delayMicroseconds(100);
    digitalWrite(ANODE_PINS[i], HIGH);
  }
}


void loop() {
  if (Serial.available() > 0) {
      incoming = Serial.readString();
      if(incoming == ","){
        for(int i = 0; i<8; i++){             // set everything to 0 (blank screen) for space character
          for(int j = 0; j<8; j++){
              pattern[i][j] = 0;
          }
        }
      }
      else{
        int prevIndex = 0;
        while(incoming.indexOf(',') != -1){
          int index = incoming.indexOf(',');
          int val = incoming.substring(0,index).toInt();
          for(int t = prevIndex; t<val; t++){           // set old pixels to 0
            int i = t/8;
            int j = t%8;
            pattern[i][j] = 0;
          }
          int i = val/8;
          int j = val%8;
          pattern[i][j] = 1;                            // set new pixel to 1
          display();
          prevIndex = val+1;
          incoming = incoming.substring(index+1);
        }
        for(int t = prevIndex; t<64; t++){              // set remaining pixels to 0
          int i = t/8;
          int j = t%8;
          pattern[i][j] = 0;
        } 
      }
  }
  display();
}
