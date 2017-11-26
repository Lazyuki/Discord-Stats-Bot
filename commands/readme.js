const Discord = require('discord.js');

module.exports.alias = [
	'readme'
];

module.exports.command = (message) => {
	let embed = new Discord.RichEmbed();
	embed.title = '__**WELCOME!! :tada: READ ME!**__';
	embed.setImage('https://i.imgur.com/snInv3M.png');
	embed.addField('Ask Japanese Questions', '<#189601264424714241>', true);
	embed.addField('Beginner Japanese Chat', '<#208118574974238721>', true);
	embed.addField('Answer English Questions', '<#193959229030268938>', true);
	embed.addField('Language Exchange', '<#376574779316109313>', true);
	embed.addField('Server Rules', 'Please read <#189585230972190720> for more info', true);
	embed.color = 16711935;
	message.channel.send({embed});
};
