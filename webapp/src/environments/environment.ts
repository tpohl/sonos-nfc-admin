// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDrhFlupOo8-ZhMUtti-_eUmBztEUIpJlg',
    authDomain: 'sonos-nfc-admin.firebaseapp.com',
    databaseURL: 'https://sonos-nfc-admin.firebaseio.com',
    projectId: 'sonos-nfc-admin',
    storageBucket: 'sonos-nfc-admin.appspot.com',
    messagingSenderId: '371668208503'
 }
};
