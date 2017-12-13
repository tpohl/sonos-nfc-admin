'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const request = require('request-promise-native');

const app = express();


admin.initializeApp(functions.config().firebase);

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    res.status(403).send('Unauthorized');
  });
};

app.use(authenticate);

// POST /api/device
// Create a new devide
app.post('/api/devices', (req, res) => {
  const device = req.body;
  console.log('Saving Device', device, req.user.uid);
  admin.database().ref(`/users/${req.user.uid}/devices`).push(device)
    .then(snapshot => {
      return snapshot.ref.once('value');
    }).then(snapshot => {
      console.log('saved ', snapshot);
      const val = snapshot.val();
      res.status(201).json({ device: val.device });
    }).catch(error => {
      console.log('Error saving device', error.message);
      res.sendStatus(500);
    });
});

app.get('/api/devices', (req, res) => {
  let query = admin.database().ref(`/users/${req.user.uid}/devices`);


  query.once('value').then(snapshot => {
    var devices = [];
    snapshot.forEach(childSnapshot => {
      devices.push({ key: childSnapshot.key, device: childSnapshot.val() });
    });

    return res.status(200).json(devices);
  }).catch(error => {
    console.log('Error getting messages', error.message);
    res.sendStatus(500);
  });
});

app.get('/api/devices/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  console.log('LOADING: ', deviceId, req.user.uid);
  admin.database().ref(`/users/${req.user.uid}/devices/${deviceId}`).once('value').then(snapshot => {
    if (snapshot.val() !== null) {
      // Cache details in the browser for 5 minutes
      res.set('Cache-Control', 'private, max-age=300');
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ errorCode: 404, errorMessage: `device '${deviceId}' not found` });
    }
  }).catch(error => {
    console.log('Error getting device details', deviceId, error.message);
    res.sendStatus(500);
  });
});

const token = functions.config().particle.token;
app.get('/api/devices/:deviceId/variable/:variablename', (req, res) => {
  const deviceId = req.params.deviceId;
  const variablename = req.params.variablename;

  console.log('LOADING: ', deviceId, req.user.uid);
  admin.database().ref(`/users/${req.user.uid}/devices/${deviceId}`).once('value').then(snapshot => {
    const device = snapshot.val();
    if (device !== null) {
      // Load the variable from particle
      const options = {
        uri: 'https://api.particle.io/v1/devices/' + device.deviceId + '/' + variablename,
        qs: {
          access_token: token
        },
        json: true // Automatically parses the JSON string in the response
      };
      request.get(options).then(result => {
        res.status(200).json(result).end();
      }).catch(error => {
        console.log('Error getting from Particle', deviceId, error.message);
        res.sendStatus(500).end();
      });


    } else {
      res.status(404).json({ errorCode: 404, errorMessage: `device '${deviceId}' not found` });
    }
  }).catch(error => {
    console.log('Error getting device details', deviceId, error.message);
    res.sendStatus(500).end();
  });
});

app.post('/api/devices/:deviceId/function/:functionName', (req, res) => {
  const deviceId = req.params.deviceId;
  const functionName = req.params.functionName;

  console.log('LOADING: ', deviceId, req.user.uid);
  admin.database().ref(`/users/${req.user.uid}/devices/${deviceId}`).once('value').then(snapshot => {
    const device = snapshot.val();
    if (device !== null) {
      // Load the variable from particle
      const options = {
        uri: 'https://api.particle.io/v1/devices/' + device.deviceId + '/' + functionName,
        qs: {
          access_token: token
        },
        body: req.body,
        json: true // Automatically parses the JSON string in the response
      };
      request.post(options).then(result => {
        res.status(200).json(result).end();
      }).catch(error => {
        console.log('Error Posting from Particle', deviceId, error.message);
        res.sendStatus(500).end();
      });


    } else {
      res.status(404).json({ errorCode: 404, errorMessage: `device '${deviceId}' not found` });
    }
  }).catch(error => {
    console.log('Error getting device details', deviceId, error.message);
    res.sendStatus(500).end();
  });
});

// Expose the API as a function
exports.api = functions.https.onRequest(app);
