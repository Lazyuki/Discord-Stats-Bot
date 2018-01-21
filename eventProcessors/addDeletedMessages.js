module.exports.name = 'addDeletedMessages';
module.exports.events = ['DELETE'];


const SimpleMsg = require('../classes/SimpleMessage.js');
const Util = require('../classes/Util.js');

module.exports.initialize = (json, server) => {
  server.deletedMessages = [];
  if (!json || !json['deletedMessages']) return;
  for (var msg in json['deletedMessages']) {
    let dm = json['deletedMessages'][msg];
    server.deletedMessages.push(new SimpleMsg({simple:dm}));
  }
};
module.exports.isAllowed = () => {
  return true;
};

module.exports.process = async function(message, server) {
  let con = message.content;
  var imageURL = '';
  if (message.attachments.size > 0) {
    imageURL = message.attachments.first().url;
    message.content += `\n{Attachment (expired): ${imageURL} }`;
  } else if (message.content.length < 3) {
    return;
  }
  var simple = new SimpleMsg({message : message, del : true});
  var arr;
  if (server.watchedUsers.includes(message.author.id)) {
    let timeout = 0;
    if (simple.dur < 5) {
      timeout = 5 - simple.dur * 1000;
    }
    setTimeout(function() {
      let index = server.watchedImagesID.indexOf(message.id);
      if (index != -1) {
        simple.img = server.watchedImagesLink[index];
      }
      Util.postLogs(simple, server);
    }, timeout);
  } else {
    if (con.startsWith('.') || con.startsWith('t!') ||
        con.startsWith(',') || con.startsWith('k!') ||
        con.startsWith('&') || con.startsWith('!')) return; // no bot messages
    arr = server.deletedMessages;
    // Move the next two outside of the brackets if you don't want to post.
    arr.push(simple);
    if (arr.length > 30) arr.shift();
  }
  if (message.mentions.members.size > 20) { // SPAM alert!
    let chan = server.guild.channels.get('366692441442615306'); // #mod_log
    if (chan == undefined) return;
    if (server.watchedUsers.includes(message.author.id)) {
      message.member.addRole('259181555803619329'); // muted role
      chan.send(`**USER MUTED** ${message.author} has been muted. <@&240647591770062848> if server was a mistake, unmute them by removing the mute tag. If not, BAN THEM!`);
    } else {
      server.watchedUsers.push(message.author.id);
      chan.send(`**POSSIBLE SPAM ALERT** (deleting a message with 20+ mentions) by ${message.author} in ${message.channel} ! Automatically added to the watchlist`);
    }
  }
};