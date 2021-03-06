module.exports.name = 'guide';

module.exports.alias = ['guide', 'start', 'g'];

module.exports.isAllowed = (message, server) => {
  return server.guild.id == '189571157446492161';
};

module.exports.help =
  '`,g [ guides | kana | kanji | grammar | vocab | IME | dictionary | anki | pronunciation | learn | ]` Japanese learning guide';

const Discord = require('discord.js');
const externalLink = '<:externallink:438354612379189268>';

module.exports.command = (message, content) => {
  let embed = new Discord.MessageEmbed();
  content = content.toLowerCase();
  if (content == 'guides') {
    embed.title = `__**Guides ${externalLink}**__`;
    embed.url =
      'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#beginner-guide';
    embed.description = 'All beginners should read one of the below guides';
    embed.addField(
      "r/LearnJapanese's guide",
      'https://www.reddit.com/r/LearnJapanese/wiki/index/startersguide',
      false
    );
    embed.addField(
      'A well written DJT guide',
      'https://djtguide.neocities.org/guide.html',
      false
    );
    embed.addField(
      'Guide for beginners written by Bonyari Boy',
      'https://docs.google.com/document/d/19FEIOJWbLhJQ-AmepxFBMC2ebhJJr9RBUMfMeatYuq8/edit?usp=sharing',
      false
    );
  } else if (
    content.includes('kana') ||
    content === 'hiragana' ||
    content === 'first'
  ) {
    embed.title = `__**Kana ${externalLink}**__`;
    embed.url =
      'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#hiragana-and-katakana';
    embed.description = 'The first step is learning Hiragana and Katakana. ';
    embed.addField(
      'Tofugu Hiragana guide',
      'https://www.tofugu.com/japanese/learn-hiragana/',
      false
    );
    embed.addField(
      'Tofugu Katakana guide',
      'https://www.tofugu.com/japanese/learn-katakana/',
      false
    );
  } else if (content === 'kanji') {
    embed.title = `__**Kanji ${externalLink}**__`;
    embed.url =
      'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#kanji';
    embed.description = "After you've got your kana down, you need Kanji.";
    embed.addField(
      'Anki decks',
      'https://djtguide.neocities.org/anki.html',
      true
    );
    embed.addField('Wanikani ($)', 'https://www.wanikani.com/', true);
    embed.addField('Kanji Koohi', 'https://kanji.koohii.com/', true);
    embed.addField(
      'Kanji Damage',
      'http://www.kanjidamage.com/introduction',
      true
    );
  } else if (content == 'grammar') {
    embed.title = `__**Grammar ${externalLink}**__`;
    embed.url =
      'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#grammar';
    embed.description =
      'You can either use a structured textbook or a more free-form online grammar guide like Tae-Kim. Either one works, try one or both and stick with the one you like the best.';
    embed.addField(
      'Genki: Beginner textbook',
      'http://genki.japantimes.co.jp/index_en',
      false
    );
    embed.addField(
      'Tobira: Intermediate textbook',
      'http://tobiraweb.9640.jp/',
      false
    );
    embed.addField(
      'Tae-Kim: Online guide',
      'http://www.guidetojapanese.org/learn/grammar',
      false
    );
  } else if (content == 'vocab') {
    embed.title = `__**Vocabulary ${externalLink}**__`;
    embed.url =
      'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#vocabulary';
    embed.description = 'For vocabulary, three nice options are: ';
    embed.addField('Wanikani ($)', 'https://www.wanikani.com/', true);
    embed.addField('Memrise', 'https://www.memrise.com/', true);
    embed.addField('Anki', 'http://ankisrs.net/', true);
  } else if (content == 'ime' || content == 'type') {
    embed.title = `__**Keyboard ${externalLink}**__`;
    embed.url =
      'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#software';
    embed.description =
      'You need to have a special program (IME) to type in Japanese';
    embed.addField(
      'Installing a Japanese Keyboard',
      'https://www.tofugu.com/japanese/how-to-install-japanese-keyboard/',
      false
    );
    embed.addField(
      'Typing Guide',
      'https://www.tofugu.com/japanese/how-to-type-in-japanese/',
      false
    );
  } else if (content.includes('dict')) {
    embed.title = `__**Dictionaries ${externalLink}**__`;
    embed.url =
      'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#dictionary';
    embed.description =
      'For translating, avoid using Google Translate. Instead use one of these:';
    embed.addField('Jisho.org', 'http://jisho.org/', true);
    embed.addField('Tangorin', 'http://tangorin.com/', true);
    embed.addField('Weblio', 'http://www.weblio.jp/', true);
  } else if (content === 'anki') {
    embed.title = `__**Anki ${externalLink}**__`;
    embed.url = 'https://itazuraneko.neocities.org/learn/anki.html';
    embed.description =
      'Anki is a free and open-source flashcard program that utilizes spaced repetition.';
  } else if (content === 'audio' || content === 'pronunciation') {
    embed.title = `__**Pronunciation**__`;
    embed.description = 'Look up pronunciations';
    embed.addField(
      'Forvo: Pronunciation audio examples given by native speakers',
      'https://forvo.com/languages/ja/',
      true
    );
    embed.addField(
      'YouGlish: Search YouTube videos for instances of words',
      'https://youglish.com/japanese',
      true
    );
  } else if (content.includes('bon') || content === 'learn') {
    embed.title = `**How to learn Japanese efficiently** ${externalLink}`;
    embed.url =
      'https://docs.google.com/document/d/19FEIOJWbLhJQ-AmepxFBMC2ebhJJr9RBUMfMeatYuq8/edit?usp=sharing';
    embed.setFooter(`Written by Bonyari Boy`);
  } else {
    // embed.title = `__**New to Japanese? Start here! ${externalLink}**__`;
    // embed.url = 'https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#beginner-guide';
    embed.description = `__**[New to Japanese? Start here! ${externalLink}](https://github.com/ryry013/Awesome-Japanese/blob/master/readme.md#beginner-guide)**__`;
  }
  embed.color = 8843151;
  message.channel.send({ embed });
};
