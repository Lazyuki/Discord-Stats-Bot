const Discord = require('discord.js');

module.exports.alias = [
	'yonde'
];

module.exports.command = (message) => {
	let embed = new Discord.RichEmbed();
	embed.title = '__ようこそ！！ :tada: このサーバーの簡単な説明__';
	embed.setImage('https://i.imgur.com/56C1pjx.png');
	embed.addField('日本語で雑談', '<#189629338142900224>', true);
	embed.addField('英語で雑談', '<#234772801716879371>', true);
	embed.addField('英語で言語交換', '<#376574779316109313>', true);
	embed.addField('英語に関する質問', '<#193959229030268938>', true);
	embed.addField('その他ルール', '<#189585230972190720> の下の方に日本語で説明があります', true);
	embed.color = 16711935;
	message.channel.send({embed});
}