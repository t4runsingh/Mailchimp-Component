/**
 * Auto-generated trigger file for "Mailchimp Marketing API" API.
 *
 * Generated at: 2021-05-20T15:00:33.664Z
 * Mass generator version: 1.0.0
 *
 * : Mailchimp-Component
 * Copyright © 2020,  AG
 *
 * All files of this connector are licensed under the Apache 2.0 License. For details
 * see the file LICENSE on the toplevel directory.
 *
 *
 * Operation: 'getCampaignFolders'
 * Endpoint Path: '/campaign-folders'
 * Method: 'get'
 *
 */

 const Swagger = require('swagger-client');
 const spec = require('../spec.json');
 
 // this wrapers offers a simplified emitData(data) function
 module.exports = {process: processTrigger};
 
 // parameter names for this call
 const PARAMETERS = [
    "fields",
    "exclude_fields",
    "count",
    "offset"
];
 
 // mappings from connector field names to API field names
 const FIELD_MAP = {
    "fields": "fields",
    "exclude_fields": "exclude_fields",
    "count": "count",
    "offset": "offset"
};
 
 function processTrigger(msg, cfg) {
     var isVerbose = process.env.debug || cfg.verbose;
 
     console.log("msg:",msg);
     console.log("cfg:",cfg)
 
     if (isVerbose) {
         console.log(`---MSG: ${JSON.stringify(msg)}`);
         console.log(`---CFG: ${JSON.stringify(cfg)}`);
         console.log(`---ENV: ${JSON.stringify(process.env)}`);
     }
 
     const contentType = undefined;
 
     const body = msg.data;
     mapFieldNames(body);
 
     let parameters = {};
     for(let param of PARAMETERS) {
         parameters[param] = body[param];
     }
 
     const oihUid = msg.metadata !== undefined && msg.metadata.oihUid !== undefined
     ? msg.metadata.oihUid
     : 'oihUid not set yet';
   const recordUid = msg.metadata !== undefined && msg.metadata.recordUid !== undefined
     ? msg.metadata.recordUid
     : undefined;
   const applicationUid = msg.metadata !== undefined && msg.metadata.applicationUid !== undefined
     ? msg.metadata.applicationUid
     : undefined;
 
     const newElement = {};
     const oihMeta = {
       applicationUid,
       oihUid,
       recordUid,
     };
     
     // credentials for this operation
     let securities = {};
    securities['basicAuth'] = {username: cfg.auth_username, password: cfg.auth_password};;
 
     if(cfg.otherServer){
         if(!spec.servers){
             spec.servers = [];
         }
         spec.servers.push({"url":cfg.otherServer})
     }
     
     
     let callParams = {
         spec: spec,
         operationId: 'getCampaignFolders',
         pathName: '/campaign-folders',
         method: 'get',
         parameters: parameters,
         requestContentType: contentType,
         requestBody: body,
         securities: {authorized: securities},
         server: spec.servers[cfg.server] || cfg.otherServer,
     };
         if(callParams.method === 'get'){
             delete callParams.requestBody;
         }
     
 
     if (isVerbose) {
         let out = Object.assign({}, callParams);
         out.spec = '[omitted]';
         console.log(`--SWAGGER CALL: ${JSON.stringify(out)}`);
     }
 
     // Call operation via Swagger client
     return Swagger.execute(callParams).then(data => {
         // emit a single message with data
         // console.log("swagger data:",data);
         delete data.uid;
         newElement.metadata = oihMeta;
         newElement.data = data.data
         this.emit("data",newElement);
 
         // if the response contains an array of entities, you can emit them one by one:
 
         // data.obj.someItems.forEach((item) => {
         //     this.emitData(item);
         // }
     });
 }
 
 function mapFieldNames(obj) {
     if(Array.isArray(obj)) {
         obj.forEach(mapFieldNames);
     }
     else if(typeof obj === 'object' && obj) {
         Object.keys(obj).forEach(key => {
             mapFieldNames(obj[key]);
 
             let goodKey = FIELD_MAP[key];
             if(goodKey && goodKey !== key) {
                 obj[goodKey] = obj[key];
                 delete obj[key];
             }
         });
     }
 }