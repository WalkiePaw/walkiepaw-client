import defaultUser from './../assets/default_user.png';

export function getProfileImage(emotionId) {
  switch(emotionId) {
    case 1: 
      return defaultUser;
    default: 
      return null;
  }
}
