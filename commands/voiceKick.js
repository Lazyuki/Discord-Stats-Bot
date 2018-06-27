

module.exports.name = 'voiceKick';
module.exports.alias = [
  'voicekick',
  'vk'
];
module.exports.isAllowed = async () => {
  return true;
};

module.exports.help = 'Kick yourself from a voice channel in N minutes. `,vk [number of minutes]`\nOr for mods, kick someone instantly `,vk <@someone>`';


async function removeFromVoice(guild, members) {
  let afk = guild.afkChannel;
  let newChan;
  if (afk && afk.parent) newChan = await guild.channels.create('/dev/null', {type:'voice', parent: afk.parent});
  else newChan = await guild.channels.create('/dev/null', {type:'voice'});
  for (let member of members) {
    member = await guild.member(member.user);
    if (!member || !member.voiceChannel) continue;
    await member.setVoiceChannel(newChan);
  }
  newChan.delete();
}
module.exports.command = async (message, content) => {
  if (!message.guild.me.hasPermission(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) {
    message.channel.send('I need the Mangae Channels and Move Members permissions.');
    return;
  }
  let mentions = message.mentions.members;
  if (mentions.size) {
    if (message.member.hasPermission('MUTE_MEMBERS')) {
      await removeFromVoice(message.guild, mentions.array());
    } else {
      message.channel.send('You cannot kick others');
    }
    return;
  }
  if (!message.member.voiceChannel) {
    message.channel.send('You need to be in a voice channel');
    return;
  }
  let minutes = parseInt(content);  
  if (isNaN(minutes) || minutes > 1440 || minutes < 0) minutes = 0;
  message.channel.send(`Kicking you from vc in ${minutes} minutes`);
  setTimeout(() => {
    removeFromVoice(message.guild, [message.member]);
  }, minutes * 60 * 1000);
};
