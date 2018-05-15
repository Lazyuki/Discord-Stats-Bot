module.exports.name = 'userJoin';
module.exports.events = ['JOIN'];
let EWBF = null;
module.exports.initialize = async (json, server) => {
  server.newUsers = [];
  if (!json || !json['newUsers']) return;
  server.newUsers = json['newUsers'];
  if (server.guild.id == '189571157446492161') {
    server.invites = await server.guild.fetchInvites(); // Cleanup when saving...?
    EWBF = server.guild.channels.get('277384105245802497');
  } 
};
module.exports.isAllowed = () => {
  return true;
};

const Discord = require('discord.js');
function joinNotif(member, inv) {
  let embed = new Discord.RichEmbed();
  embed.description = `📥 **${member.user.tag}** has \`joined\` the server. (${member.id})`;
  if (inv) 
    embed.setFooter(`User Join (${member.guild.memberCount})\nLink: ${inv[0]} from ${inv[1].inviter.username}`, member.user.avatarURL);
  else
    embed.setFooter(`User Join (${member.guild.memberCount})`, member.user.avatarURL);
  embed.setTimestamp();
  embed.setColor(0x84a332);
  return embed;
}
module.exports.process = async (member, server) => {
  if (server.newUsers.unshift(member.id) > 3) server.newUsers.pop();
  if (member.guild.id == '189571157446492161') {
    let newInvites = await server.guild.fetchInvites();
    let inv = null;
    for (let [k, v] of newInvites) {
      let old = server.invites.get(k);
      if (old) {
        if (old.uses < v.uses) {
          inv = [k, v];
          break;
        }
      } else if (v.uses > 0) {
        inv = [k, v];
        break;
      }
    }
    server.invites = newInvites;
    console.log(`${member.user.username} joined with ${inv[0]}`);
    if (member.guild.members.get('270366726737231884').presence.status == 'offline') { // rybot
      let embed = joinNotif(member, inv);
      EWBF.send({embed});
    } else {
      setTimeout(async () => {
        let msgs = await EWBF.fetchMessages({limit: 20});
        for (let [, msg] of msgs) {
          if (msg.author.id == '270366726737231884' && msg.embeds.length && msg.embeds[0].description.includes(member.id)) return;
        }
        let embed = joinNotif(member, inv);
        EWBF.send({embed});
      }, 5000);
    }      
    if (member.guild.members.get('159985870458322944').presence.status == 'offline') { // mee6
      let welcome = `Welcome ${member} to the English-Japanese Language Exchange. Please read the rules first If you have any questions feel free to message one of the Mods!  Tell us what your native language is and we'll get you properly tagged with a colored name.\n\n`;
      welcome += `${member}さん、ようこそEnglish-Japanese Language Exchangeへ!\nあなたの母語を教えてください!\n質問があれば、何でも遠慮なく聞いてくださいね。このチャンネルには日本語と英語で投稿できます。よろしくお願いします！ <@&357449148405907456>`;
      member.guild.channels.get('189571157446492161').send(welcome);
    }
  }
};
