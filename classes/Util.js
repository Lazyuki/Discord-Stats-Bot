
  // 3040-309F : hiragana
  // 30A0-30FF : katakana
  // FF66-FF9D : half-width katakana
  // 4E00-9FAF : common and uncommon kanji
exports.REGEX_JPN = /[\u3040-\u30FF]|[\uFF66-\uFF9D]|[\u4E00-\u9FAF]/;
exports.REGEX_ENG = /[a-vx-zA-VX-Z]|[ａ-ｖｘ-ｚＡ-ＶＸ-Ｚ]/;
exports.REGEX_URL = /https?:\/\/(www\.)?\S{2,256}\.[a-z]{2,6}\S*/g;
exports.REGEX_REACT = /<:[\S]+:\d+>/g;
exports.REGEX_USER = /<@!?\d+>/g;
exports.REGEX_CHAN = /<#\d+>/g;
exports.REGEX_ROLE = /<@&\d+>/g;
exports.REGEX_ID = /(<@!?|#|@&|:[\S]+:)\d+>/g;

exports.searchUser = function(message, content, server) {
  let mentions = message.mentions.users;
  content = content.trim();
  let user = null;
  if (mentions.size != 0) {
    return mentions.first();
  } else if (content != '') { // search name
    let regex = content[0] == '*';
    if (regex) {
      let r = new RegExp(content.substr(1, content.length), 'i');
      for (var id in server.users) {
        let u = server.guild.members.get(id); // TODO change to fetch?
        if (u == undefined) continue; // if left
        if (r.test(u.user.tag) || r.test(u.nickname)) {
          return u.user;
        }
      }
    } else {
      content = content.toLowerCase();
      for (var id in server.users) {
        if (id == content) { // ID search
          server.guild.fetchMember(id).then((member) => {
            return member ? member.user : null;
          });
        }
        let u = server.guild.members.get(id); // TODO change to fetch?
        if (u == undefined) continue; // if left
        if (u.user.tag.toLowerCase().startsWith(content) || (u.nickname && u.nickname.toLowerCase().startsWith(content))) {
          return u.user;
        }
      }
    }
  }
  return null;
}

exports.LANG = Object.freeze({
  ENG : 0,
  JPN : 1,
  OTH : 2,
  ESC : 3
});

exports.lang = function(content, escapeStar=true) {
  let jpCount = 0;
  let enCount = 0;
  let other = 0
  content = content.replace(exports.REGEX_URL, '');
  content = content.replace(exports.REGEX_ID, '');
  content = content.replace(/o.o/i, '');
  for (var l of content) {
    if (l == '*' || l == '＊') {
      if (escapeStar) return exports.LANG.ESC;
    }
    if (exports.REGEX_JPN.test(l)) {
      jpCount++;
    } else if (exports.REGEX_ENG.test(l)) {
      enCount++;
    } else if (!/[\sw]/i.test(l)){
      other++;
    }
  }
  if (jpCount == enCount) return exports.LANG.OTH;
  if (jpCount < 3 && enCount < 3 && other > 0) return exports.LANG.OTH; // it's probably a face
  return  jpCount * 1.7 > enCount ? exports.LANG.JPN : exports.LANG.ENG;
}
