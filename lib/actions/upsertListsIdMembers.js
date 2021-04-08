/**
 * Auto-generated action file for "Mailchimp Marketing API" API.
 *
 * Generated at: 2021-03-12T16:21:15.232Z
 * Mass generator version: 1.0.0
 *
 * : mailchimp
 * Copyright © 2020,  AG
 *
 * All files of this connector are licensed under the Apache 2.0 License. For details
 * see the file LICENSE on the toplevel directory.
 *
 *
 * Operation: 'postListsIdMembers'
 * Endpoint Path: '/lists/{list_id}/members'
 * Method: 'post'
 *
 */



 // how to pass the transformation function... no need
 // pass the meta data
 // create a new Object
 // emit the message with the new emit function

 // securities and auth methods
 // check how to make the new ferryman and its transform functions functional // no need

const Swagger = require('swagger-client');
const processWrapper = require('../services/process-wrapper');
const spec = require('../spec.json');
const uuid = require("uuid");

// this wrapers offers a simplified emitData(data) function
module.exports = {process: processAction};

// parameter names for this call
const PARAMETERS = [
    "list_id",
    "skip_merge_validation"
];

// mappings from connector field names to API field names
const FIELD_MAP = {
    "list_id": "list_id",
    "skip_merge_validation": "skip_merge_validation",
    "email_address": "email_address",
    "email_type": "email_type",
    "status": "status",
    "merge_fields": "merge_fields",
    "interests": "interests",
    "language": "language",
    "vip": "vip",
    "latitude": "latitude",
    "longitude": "longitude",
    "location": "location",
    "marketing_permissions": "marketing_permissions",
    "ip_signup": "ip_signup",
    "timestamp_signup": "timestamp_signup",
    "ip_opt": "ip_opt",
    "timestamp_opt": "timestamp_opt",
    "tags": "tags",
    "requestBody": "requestBody"
};

function newMessage(body) {
    const msg = {
      id: uuid.v4(),
      attachments: {},
      body,
      headers: {},
      metadata: {},
    };

    return msg;
  }

function processAction(msg, cfg) {
    var isVerbose = process.env.debug || cfg.verbose;

    console.log("msg:",msg);
    console.log("cfg:",cfg)

    if (isVerbose) {
        console.log(`---MSG: ${JSON.stringify(msg)}`);
        console.log(`---CFG: ${JSON.stringify(cfg)}`);
        console.log(`---ENV: ${JSON.stringify(process.env)}`);
    }

    const contentType = 'application/json';

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

    if(cfg.accessToken) {
      securities = { BearerAuth: cfg.accessToken };
    } else {
      securities['basicAuth'] = {username: cfg.auth_username, password: cfg.auth_password};;
    }

    if(cfg.otherServer){
        if(!spec.servers){
            spec.servers = [];
        }
        spec.servers.push({"url":cfg.otherServer})
    }

    let callParams;
    if (recordUid) {
      console.log('Updating entry', recordUid);

      callParams = {
          spec: spec,
          operationId: 'patchListsIdMembersId',
          pathName: '/lists/{list_id}/members/{subscriber_hash}',
          method: 'patch',
          parameters: parameters,
          requestContentType: contentType,
          requestBody: body,
          securities: {authorized: securities},
          server: spec.servers[cfg.server] || cfg.otherServer,
      };

      callParams['parameters']['subscriber_hash'] = recordUid;
    } else {
      console.log('Creating new entry');
      callParams = {
          spec: spec,
          operationId: 'postListsIdMembers',
          pathName: '/lists/{list_id}/members',
          method: 'post',
          parameters: parameters,
          requestContentType: contentType,
          requestBody: body,
          securities: {authorized: securities},
          server: spec.servers[cfg.server] || cfg.otherServer,
      };
    }

    if(callParams.method === 'get'){
        delete callParams.requestBody;
    }

    // Get all lists
    let listsCallParams = {
        spec: spec,
        operationId: 'getLists',
        pathName: '/lists',
        method: 'get',
        parameters: {},
        requestContentType: contentType,
        securities: {authorized: securities},
        server: spec.servers[cfg.server] || cfg.otherServer,
    };

    const response = await Swagger.execute(listsCallParams)

    console.log('All lists:', response.body);

    if(!('lists' in response.body)) {
      console.log('No lists found aborting...');
      return;
    }

    let index;
    const listNameLower = (cfg.listName)? cfg.listName.trim().toLowerCase() :  false;
    for(index in response.body['lists']) {
      // web_id name
      if(cfg.listId && cfg.listId === `${response.body['lists'][index].web_id}`) {
        callParams['parameters']['list_id'] = response.body['lists'][index].id;
      } else if(listNameLower && listNameLower === response.body['lists'][index].name.trim().toLowerCase()) {
        callParams['parameters']['list_id'] = response.body['lists'][index].id;
      }
    }

    if(!('list_id' in callParams['parameters'])) {
      console.log('No list id or name found. Aborting');
      console.log(cfg.listId, cfg.listName);
      return;
    }




    if (isVerbose) {
        let out = Object.assign({}, callParams);
        out.spec = '[omitted]';
        console.log(`--SWAGGER CALL: ${JSON.stringify(out)}`);
    }

    // Call operation via Swagger client
    return Swagger.execute(callParams).then(data => {
        // emit a single message with data
        console.log("swagger data:",data);
        delete data.uid;
        newElement.metadata = oihMeta;
        newElement.data = data.data
        this.emit("data",newMessage(newElement));

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
