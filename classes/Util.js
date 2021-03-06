const Discord = require('discord.js');
// 3040-309F : hiragana
// 30A0-30FF : katakana
// FF66-FF9D : half-width katakana
// 4E00-9FAF : common and uncommon kanji
exports.REGEX_JPN = /[\u3040-\u30FF]|[\uFF66-\uFF9D]|[\u4E00-\u9FAF]/;
exports.REGEX_ENG = /[a-vx-zA-VX-Z]|[ａ-ｖｘ-ｚＡ-ＶＸ-Ｚ]/;
exports.REGEX_URL = /https?:\/\/(www\.)?\S{2,256}\.[a-z]{2,6}\S*/g;

exports.REGEX_CUSTOM_EMOTES = /(<a?:[^:]+:[0-9]+>)/g;
exports.REGEX_EMOJIS = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
exports.REGEX_USER = /<@!?\d+>/g;
exports.REGEX_CHAN = /<#\d+>/g;
exports.REGEX_ROLE = /<@&\d+>/g;
exports.REGEX_ID = /<(@!?|#|@&|a?:[\S]+:)\d+>/g;
exports.REGEX_RAW_ID = /(\d{17,21})/g;
exports.REGEX_MESSAGE_ID = /(?:\d{17,21}\/)?(\d{17,21}(?:[-/]\d{17,21})?)/g;

exports.searchUser = function (message, content, server, bot) {
  let mentions = message.mentions.users;
  content = content.trim();
  if (mentions.size != 0) {
    // Get mention
    return mentions.first();
  } else if (content != '') {
    // search name
    let regex = content[0] == '*';
    if (regex) {
      let r = new RegExp(content.substr(1, content.length), 'i');
      for (let id in server.users) {
        let u = server.guild.members.cache.get(id); // TODO change to fetch?
        if (u == undefined) continue; // if left
        if (r.test(u.user.tag) || r.test(u.nickname)) {
          return u.user;
        }
      }
      for (let [, mem] of server.guild.members.cache) {
        if (r.test(mem.user.tag) || r.test(mem.nickname)) {
          return mem.user;
        }
      }
    } else {
      content = content.toLowerCase();
      for (let id in server.users) {
        let u = server.guild.members.cache.get(id);
        if (id == content) {
          return bot.users.fetch(id); // This returns a Promise
        }
        if (u == undefined) continue; // user left
        if (
          u.user.tag.toLowerCase().startsWith(content) ||
          (u.nickname && u.nickname.toLowerCase().startsWith(content))
        ) {
          return u.user;
        }
      }
      for (let [id, mem] of server.guild.members.cache) {
        if (id == content) {
          return mem.user;
        }
        if (
          mem.user.tag.toLowerCase().startsWith(content) ||
          (mem.nickname && mem.nickname.toLowerCase().startsWith(content))
        ) {
          return mem.user;
        }
      }
    }
  }
  return null;
};

exports.LANG = Object.freeze({
  ENG: 1,
  JPN: 1 << 1,
  OTH: 1 << 2,
  ESC: 1 << 3,
});

exports.lang = function (content) {
  let jpCount = 0;
  let enCount = 0;
  let other = 0;
  let result = 0;
  content = content.replace(exports.REGEX_URL, '');
  content = content.replace(exports.REGEX_ID, '');
  content = content.replace(/o.o/i, '');
  for (let l of content) {
    if (l == '*' || l == '＊') {
      result |= exports.LANG.ESC;
    }
    if (exports.REGEX_JPN.test(l)) {
      jpCount++;
    } else if (exports.REGEX_ENG.test(l)) {
      enCount++;
    } else if (!/[\sw]/i.test(l)) {
      other++;
    }
  }
  if (jpCount == enCount) {
    return result | exports.LANG.OTH;
  }

  if (jpCount < 3 && enCount < 3 && other > 0) return result | exports.LANG.OTH; // it's probably a face
  return jpCount * 1.7 > enCount
    ? result | exports.LANG.JPN
    : result | exports.LANG.ENG;
};

exports.postLogs = function (msg, server) {
  let embed = new Discord.MessageEmbed();
  let date = new Date(msg.time);
  embed.setAuthor(`${msg.atag} ID: ${msg.aid}`, msg.apfp);
  if (msg.del) {
    // message was deleted
    embed.title = `Message Deleted after ${msg.dur} seconds`;
    embed.description = msg.con;
    embed.color = Number('0xDB3C3C');
  } else {
    // message was edited
    embed.title = `Message Edited after ${msg.dur} seconds`;
    embed.addField('Before:', `${msg.con}`, false);
    embed.addField('After:', `${msg.acon}`, false);
    embed.color = Number('0xff9933');
  }
  embed.setFooter(`#${msg.ch}`);
  embed.timestamp = date;
  if (msg.img != '') {
    // if != null
    embed.addField('imgur link', msg.img, false);
    embed.setThumbnail(msg.img);
  }
  let chan = server.guild.channels.cache.get(server.modLog); // #mod_log
  if (!chan) return;
  chan.send({ embed });
};

exports.paginate = async function (channel, title, list, perPage, authorID) {
  const maxPageNum = Math.ceil(list.length / perPage) - 1;
  let currPage = 0;

  function getEmbed() {
    let description = '';
    for (let i = 0; i < perPage; i++) {
      const actualIndex = i + currPage * perPage;
      if (actualIndex >= list.length) break;
      description += list[actualIndex] + '\n';
    }
    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setFooter(`${currPage + 1}/${maxPageNum + 1}`)
      .setColor('0x3A8EDB')
      .setDescription(description || 'Empty');
    return embed;
  }
  const message = await channel.send({ embed: getEmbed() });

  if (maxPageNum > 0) {
    await message.react('◀');
    await message.react('▶');

    const filter = (reaction, user) => reaction.me && user.id === authorID;
    const collector = message.createReactionCollector(filter, {
      time: 60 * 1000,
    }); // 1 mintue
    collector.on('collect', (r) => {
      switch (r.emoji.name) {
        case '▶':
          if (currPage < maxPageNum) {
            ++currPage;
            message.edit({ embed: getEmbed() });
          }
          r.users.remove(authorID);
          collector.empty();
          break;
        case '◀':
          if (currPage > 0) {
            --currPage;
            message.edit({ embed: getEmbed() });
          }
          r.users.remove(authorID);
          collector.empty();
          break;
      }
    });
    collector.on('end', () => {
      message.reactions.removeAll();
    });
  }
};

exports.userLeaderboard = async function (
  channel,
  embed,
  list,
  authorID,
  searchUser,
  format,
  bot
) {
  let foundRank = false;
  for (let i in list) {
    let [key, val] = list[i];
    let rank = parseInt(i) + 1;
    if (rank > 25) {
      if (foundRank) break;
      if (key == searchUser.id) {
        foundRank = rank;
        break;
      } else {
        continue;
      }
    } else {
      let user = await bot.users.fetch(key);
      if (!user) continue;
      list[i][2] = user.username;
      if (key == searchUser.id) foundRank = rank;
      embed.addField(rank + ') ' + user.username, format(val), true);
    }
  }
  if (foundRank)
    embed.setFooter(
      `${foundRank}) ${searchUser.username}: ${format(list[foundRank - 1][1])}`
    );

  const msg = await channel.send({ embed });
  let reloadingNum = 0;
  async function reload(pageNum) {
    let myReloadingNum = ++reloadingNum;
    for (let i = 0; i < 25; i++) {
      let rank = i + pageNum * 25;
      if (list[rank]) {
        let [key, val, username] = list[rank];
        if (!username) {
          let user = await bot.users.fetch(key);
          if (!user) continue;
          username = user.username;
          list[rank][2] = username;
        }
        if (reloadingNum == myReloadingNum)
          embed.fields[i] = {
            name: `${rank + 1}) ${username}`,
            value: format(val),
            inline: true,
          };
        else break;
      } else {
        embed.fields.length = i;
        break;
      }
    }
    msg.edit({ embed });
  }
  paginate(msg, list, authorID, foundRank, reload);
};

const runAt = (date, func) => {
  const now = new Date().getTime();
  const then = date.getTime();
  const diff = Math.max(then - now, 0);
  if (diff > 0x7fffffff)
    setTimeout(function () {
      runAt(date, func);
    }, 0x7fffffff);
  else setTimeout(func, diff);
};

exports.runAt = runAt;
