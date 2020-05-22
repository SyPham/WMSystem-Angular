// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const lineConfig = {
  authorizeUrl: 'https://notify-bot.line.me/oauth/authorize',
  client_id: 'zFiiSbHKIIZhQ7Q9Op0os8',
  redirect_uri: 'http://10.4.0.76:96/api/LineNotify/Callback',
  state: 'NO_STATE',
};
export const environment = {
  production: false,
  // apiUrl: 'https://localhost:1000/api/',
  // hub: 'https://localhost:1000/working-management-hub',
  // imagePath: 'https://localhost:1000/images/',
   apiUrl: 'http://10.4.4.224:106/api/',
   // tslint:disable-next-line:max-line-length
   redirectLineAuthorize: `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=HF6qOCM9xL4lXFsqOLPzhJ&redirect_uri=http://10.4.4.224:106/api/LineNotify/Callback&scope=notify&state=NO_STATE`,
   hub: 'http://10.4.4.224:106/working-management-hub',
  imagePath: 'http://10.4.4.224:106/images/',
  //  apiUrl: 'http://10.4.0.76:96/api/',
  //  hub: 'http://10.4.0.76:96/working-management-hub'
  // tslint:disable-next-line:max-line-length
  ineAuthorize: `${lineConfig.authorizeUrl}?response_type=code&client_id=${lineConfig.client_id}&redirect_uri=${lineConfig.redirect_uri}&scope=notify&state=NO_STATE`,
  // imagePath: 'http://10.4.0.76:96/images/',
  // apiUrl: 'http://10.4.0.76:96/api/',
  // hub: 'http://10.4.0.76:96/working-management-hub',
  //    // tslint:disable-next-line:max-line-length
  // test: `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=zFiiSbHKIIZhQ7Q9Op0os8&redirect_uri=http://10.4.0.76:96/api/LineNotify/Callback&scope=notify&state=NO_STATE`,
  // redirectLineAuthorize: `${lineConfig.authorizeUrl}?response_type=code&client_id=${lineConfig.client_id}&redirect_uri=${lineConfig.redirect_uri}&scope=notify&state=NO_STATE`

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
