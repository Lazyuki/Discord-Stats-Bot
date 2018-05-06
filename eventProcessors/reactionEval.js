
module.exports.name = 'reactionEval';
module.exports.events = ['REACT'];

module.exports.isAllowed = (message, server, bot) => {
  return message.author.id == bot.owner_ID; // Myself
};

const Discord = require('discord.js');

module.exports.process = async (reaction, user, added, server, bot) => {
  if (user.id != bot.owner_ID || reaction.emoji.toString() != '▶') return;
  let message = reaction.message;
  message.react(reaction.emoji);
  let codeBlockRegex = /```\S*\n([\s\S]*?)```/g;
  let content = message.content;
  let match = codeBlockRegex.exec(content);
  if (match) {
    let code = match[1];
    let send = (str) => message.channel.send(str);
    try {
      code = `try { ${code} } catch (e) { send(e.message) }`;
      let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      let embed = new Discord.RichEmbed();
      let func = new AsyncFunction('message', 'content', 'server', 'bot', 'send', 'embed', code);
      func(message, content, server, bot, send, embed);
    } catch (e) {
      send(e.message);
    }
  }
};