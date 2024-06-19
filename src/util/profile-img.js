import emotion1 from './../assets/emotion1.png';

export function getProfileImage (emotionId) {
  switch(emotionId) {
    case 1: 
      return emotion1;
    default: 
      return null;
  }
 }