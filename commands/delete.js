const Discord = require('discord.js');
const Util = require('../classes/Util.js');
module.exports.name = 'delete';

module.exports.alias = [
  'delete',
  'del'
];

module.exports.isAllowed = (message, server) => {
  return server.guild.id == '189571157446492161' && (message.member.hasPermission('ADMINISTRATOR') || message.member.roles.has('543721608506900480'));
};

module.exports.help = '__Mods Only__ `,del [message_ids] [num_of_messages_to_delete=1(max=25)] [@mentions] [ has:link|file|"word" ]`\nDeletes messages by either specifying the IDs, or by searching.\n e.g. `,del 543252928496926722 542576315115634688` `,del 3 @geralt has:link` `,del 5 has:"mods suck"`\nAdmins can use `-n` to skip logging';

module.exports.command = async (message, content, bot, server) => {
  const delmsgs = [];
  const channel = message.channel;
  const users = message.mentions.users.keyArray();
  content = content.replace(Util.REGEX_USER, '');
  const message_ids = content.match(Util.REGEX_RAW_ID);
  let num_of_messages = (() => { const n = parseInt(content.split(' ')[0]); if (n && n > 0 && n <= 25) return n; else return 1;})();

  const link = /has:link/.test(content);
  const file = /has:file/.test(content);
  const word = (() => {const m = /has:"(.*)"/.exec(content); if (m) return m[1]; else return null;})();
  content = content.replace(/has:(link|file|".+")/g, '');

  if (message_ids) {
    for (let id of message_ids) {
      const msg = await channel.messages.fetch(id);
      if (msg) {
        delmsgs.push(msg);
      } else {
        channel.send(`Failed to find a message with the ID ${id} in this channel.`);
      }
    }
  } else {
    let MAX_LOOP = 5;
    let remaining = num_of_messages;
    let before = message.id;
    while (MAX_LOOP-- > 0 && remaining > 0) {
      let msgs = await channel.messages.fetch({limit:100, before});
      for (let msg of msgs.values()) {
        before = msg.id;
        if (users.length && !users.includes(msg.author.id)) continue;
        if (link && !Util.REGEX_URL.test(msg.content)) continue;
        if (file && msg.attachments.size == 0) continue;
        if (word && !msg.content.includes(word)) continue;
        delmsgs.push(msg);
        if (--remaining == 0) break;
      }
    }
  }
  if (delmsgs.length == 0) {
    channel.send('No messages to delete.');
    return;
  } 
  
  if (!(content.includes('-n') && message.member.hasPermission('ADMINISTRATOR'))) {
    const ewbf = server.guild.channels.get('277384105245802497');
    let embed = new Discord.MessageEmbed();
    let date = new Date();
    embed.setAuthor(`${message.author.tag}`,message.author.avatarURL());
    embed.title = 'Message Delete';
    embed.color = Number('0xff283a');
    embed.setFooter(`In #${message.channel.name}`);
    embed.timestamp = date;
  
    let imgCount = 1;
    for (let msg of delmsgs) {
      if (msg.attachments.size) {
        await ewbf.send(`File ${imgCount}: ${msg.attachments.first().url}`);
        ++imgCount;
      }
      embed.addField(`Message by ${msg.author.tag}:`, `**Content**: ${msg.attachments.size ? `File ${imgCount - 1} ${msg.content}` : msg.content}`, false);
    }
    
    ewbf.send({embed});
  }
  
  message.delete();
  if (delmsgs.length == 1) {
    delmsgs[0].delete();
    let msg = await channel.send('✅ Deleted 1 message.');
    msg.delete({timeout:5000});
  } else {
    channel.bulkDelete(delmsgs);
    let msg = await channel.send(`✅ Deleted ${delmsgs.length} messages.`);
    msg.delete({timeout:5000});
  }
};
