const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command you want to reload.')
				.setRequired(true)),
	async execute(interaction) {
		if (interaction.user.id === '950091757952057385') {
			const commandName = interaction.options.getString('command', true).toLowerCase();
			const command = interaction.client.commands.get(commandName);
	
			if (!command) {
				return interaction.reply({ content: `There is no command with the name \`${commandName}\`!`, ephemeral: true });
			}
	
			delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];
	
			try {
				interaction.client.commands.delete(command.data.name);
				const newCommand = require(`../${command.category}/${command.data.name}.js`);
				interaction.client.commands.set(newCommand.data.name, newCommand);
				await interaction.reply({ content: `Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true });
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``, ephemeral: true });
			}
			return;
		}
		interaction.reply({ content: 'You do not have permission to execute this command!', ephemeral: true });
	},
};