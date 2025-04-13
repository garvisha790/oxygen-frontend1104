//mongoChangeStream
 
const mongoose = require('mongoose');

const Alarm = require('../models/alarmModel');
 
// Setup change stream to monitor for new alarms

const setupAlarmChangeStream = async () => {

  try {

    console.log('Setting up MongoDB change stream for alarms collection...');

    // Get the MongoDB collection

    const collection = mongoose.connection.collection('alarms');

    // Create a change stream

    const changeStream = collection.watch();

    // Event handler for changes

    changeStream.on('change', (change) => {

      if (change.operationType === 'insert') {

        console.log('🔔 New alarm detected:', change.fullDocument);

        // Here you could implement WebSocket notifications or other real-time alerts

        // For example:

        // io.emit('new-alarm', change.fullDocument);

      }

    });

    console.log('✅ MongoDB change stream set up successfully');

  } catch (error) {

    console.error('❌ Error setting up MongoDB change stream:', error);

  }

};
 
module.exports = { setupAlarmChangeStream };
 