module.exports.name = 'voiceStateChange';
module.exports.events = ['VOICE'];

module.exports.initialize = (json, server) => {
  server.tempvc = {};
  for (let [id, vc] of server.guild.channels.filter(c => {return c.type == 'voice';})) {    
    for (let [memid, mem] of vc.members) {
      server.tempvc[mem.id] = new Date().getTime();
    }
  }
};
module.exports.isAllowed = () => {
  return true;
};

function isVC(member) {
  return member.voiceChannel && member.voiceChannel.id != member.guild.afkChannelID && !member.deaf;
}

let UserRecord = require('../classes/UserRecord.js');
module.exports.process = async (oldMember, newMember, server) => {
  let id = oldMember.id;
  if (!isVC(oldMember) && isVC(newMember)) {
    server.tempvc[id] = new Date().getTime();
  } else if (isVC(oldMember) && !isVC(newMember)) {
    if (!server.users[id]) {
      server.users[id] = new UserRecord();
    }
    if (!server.tempvc[id]) return;
    console.log(`---- Normal Add For ${id} ----`); 
    server.users[id].addVoiceTime(server.today, new Date().getTime() - server.tempvc[id]); // millisecond
    delete server.tempvc[id];    
  }
};

module.exports.end = (server) => {
  for (let id in server.tempvc) {
    if (!server.users[id]) {
      server.users[id] = new UserRecord();
    }
    console.log(`---- Left Over Add For ${id} ----`);    
    server.users[id].addVoiceTime(server.today, new Date().getTime() - server.tempvc[id]); // millisecond
  }
  delete server.tempvc;
};
