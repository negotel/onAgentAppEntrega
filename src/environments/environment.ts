// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const production = 'https://app.onlogexpress.com.br/api/app';
const development = 'https://emdesenvolvimento.onlogexpress.com.br/api/app';
const teste = 'http://localhost/onlogexpress/api/app';
// eslint-disable-next-line max-len
const tokens = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZWNyZXQiOiI1IiwicGxhY2EiOiJFSVkxNDc1Iiwibm9tZSI6IkVEU09OIENPU1RBIDIiLCJ0ZWxlZm9uZSI6IjExNTI0NTY2NjUiLCJ0aW1lIjoxNjEwNzY1MDYwfQ.hxSvWjU-CBmI4Ti2X0I8wF4I74RBFkLyIbZh2yH30ik';

export const environment = {
  production: false,
  apiUrl: teste,
  pastaFirebase: 'files/teste',
  firebaseConfig: {
    apiKey: 'AIzaSyD7HoLrSeY-wek78QOg-LKOn0n_3azV0XU',
    authDomain: 'onlogimages.firebaseapp.com',
    projectId: 'onlogimages',
    storageBucket: 'onlogimages.appspot.com',
    messagingSenderId: '523159672379',
    appId: '1:523159672379:web:3164401fbacbb974ff2e1e',
    measurementId: 'G-193XMRY3LZ'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
