const accountSid = "AC4ad3a537a7681e8f714c26eac0af98f1";
const authToken = "fca2f7cde1094be152553219e23337ff";
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+17409971357',
     to: '+51946391982'
   })
  .then(message => console.log(message.sid));