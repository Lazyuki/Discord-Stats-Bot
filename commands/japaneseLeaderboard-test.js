const Discord = require('discord.js');
const BST = require('../classes/BST.js');
const Util = require('../classes/Util.js');

module.exports.name = 'japaneseLeaderboard';

module.exports.alias = ['jpl-test'];

module.exports.isAllowed = (message, server) => {
  return false;
};

module.exports.help =
  '`,jpl [username (default = invoker)] [-n number (default = 1000)]` Japanese Usage Leaderboard for this server.\ne.g. `,jpl Geralt -n 500`';

module.exports.command = async (message, content, bot, server) => {
  let num = /-n (\d+)/.exec(content);
  if (num) {
    num = num[1];
    content = content.replace(/-n \d+/, '').trim();
  } else {
    num = 1000;
  }
  let searchUser =
    content == ''
      ? message.author
      : await Util.searchUser(message, content, server, bot);
  if (!searchUser) {
    message.react('❓');
    return;
  }
  let users = server.users;
  let result = [];
  for (let user in users) {
    let record = users[user];
    let total = record.totalStats();
    if (total >= num) {
      let mem = server.guild.members.cache.get(user);
      if (!mem) {
        try {
          mem = await server.guild.member(user);
          if (!mem) continue;
        } catch (e) {
          continue;
        }
      }
      if (!mem.roles.cache.has('196765998706196480')) {
        let jpUsage = (record.jp / (record.jp + record.en)) * 100;
        if (!jpUsage) continue;
        result.push([user, jpUsage]);
      }
    }
  }
  result = result.sort((a, b) => {
    return b[1] - a[1];
  });
  let embed = new Discord.MessageEmbed();
  embed.title = 'Japanese Usage Leaderboard-test';
  embed.description = 'For the last 30 days (UTC time)';
  embed.color = Number('0x3A8EDB');

  let format = (val) => val.toFixed(2) + '%';
  Util.userLeaderboard(
    message.channel,
    embed,
    result,
    message.author.id,
    searchUser,
    format,
    bot
  );
};
