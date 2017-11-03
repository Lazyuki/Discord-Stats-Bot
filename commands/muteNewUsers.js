module.exports.alias = [
	'mutenew'
];

module.exports.command = async (message, content, bot, server) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return;
	let nu = server.guild.roles.get('249695630606336000'); // New User
	if (nu.hasPermission('SEND_MESSAGES')) { // Get rid of all permissions.
		nu.setPermissions(['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']);
		server.guild.defaultRole.setPermissions(['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']);
		message.channel.send('New Users are now *muted*. Please type the same command again once the raid is done.');
	} else { // restore the old state
		nu.setPermissions(['ADD_REACTIONS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES',
		'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'CHANGE_NICKNAME']);
		server.guild.defaultRole.setPermissions(['ADD_REACTIONS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES',
		'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'CHANGE_NICKNAME']);
		message.channel.send('New Users are now *unmuted*.');
	}
};
