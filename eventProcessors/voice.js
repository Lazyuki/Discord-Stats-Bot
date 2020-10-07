module.exports.name = 'voiceStateChange';
module.exports.events = ['VOICE'];

function isVC(voiceMember) {
  return (
    voiceMember &&
    voiceMember.voice.channelID &&
    voiceMember.voice.channelID !== voiceMember.guild.afkChannelID &&
    !voiceMember.voice.deaf
  );
}
module.exports.initialize = (json, server) => {
  server.tempvc = {};
  for (let [, vc] of server.guild.channels.cache.filter(
    (c) => c.type === 'voice'
  )) {
    for (let [, mem] of vc.members) {
      if (mem.user.bot) continue; // ignore bots
      if (isVC(mem.voice)) server.tempvc[mem.id] = new Date().getTime();
    }
  }
};
module.exports.isAllowed = () => {
  return true;
};

let UserRecord = require('../classes/UserRecord.js');
module.exports.process = async (oldMember, newMember, server) => {
  let id = newMember.id || oldMember.id;
  if (!isVC(oldMember) && isVC(newMember)) {
    server.tempvc[id] = new Date().getTime();
  } else if (isVC(oldMember) && !isVC(newMember)) {
    if (!server.users[id]) {
      server.users[id] = new UserRecord();
    }
    if (!server.tempvc[id]) return;
    server.users[id].addVoiceTime(
      server.today,
      new Date().getTime() - server.tempvc[id]
    ); // millisecond
    delete server.tempvc[id];
  }
  if (server.unmuteQ.includes(id)) {
    // Unmutes people who are in the unmute queue
    await newMember.setMute(false);
    let index = server.unmuteQ.indexOf(id);
    server.unmuteQ.splice(index, 1);
  }
};

// called when restarting/shutting down the bot
module.exports.end = (server) => {
  for (let id in server.tempvc) {
    if (!server.users[id]) {
      server.users[id] = new UserRecord();
    }
    server.users[id].addVoiceTime(
      server.today,
      new Date().getTime() - server.tempvc[id]
    ); // millisecond
  }
  delete server.tempvc;
};
