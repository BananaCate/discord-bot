const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apacheconfig')
		.setDescription('Send a message with the apporpriate code inn-it')
        .addStringOption(option =>
            option.setName("directoryname")
                .setDescription("The thing after /var/www/")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("url")
                .setDescription("subdomain.domain")
                .setRequired(true)),
	async execute(interaction) {
        const directoryname = interaction.options.getString("directoryname");
        const url = interaction.options.getString("url");
		interaction.reply(`
        \`\`\`
        <VirtualHost *:80>
            ServerName ${url}
            DocumentRoot /var/www/${directoryname}

            <Directory /var/www/${directoryname}>
                Options Indexes FollowSymLinks
                AllowOverride All
                Require all granted
            </Directory>

            ErrorLog \${APACHE_LOG_DIR}/${url}-error.log
            CustomLog \${APACHE_LOG_DIR}/${url}-access.log combined
        </VirtualHost>

        <VirtualHost *:443>
            ServerName ${url}
            DocumentRoot /var/www/${directoryname}
            SSLEngine on
            SSLCertificateFile /etc/letsencrypt/live/${url}/fullchain.pem
            SSLCertificateKeyFile /etc/letsencrypt/live/${url}/privkey.pem

            <Directory /var/www/${directoryname}>
                Options Indexes FollowSymLinks
                AllowOverride All
                Require all granted
            </Directory>

            ErrorLog \${APACHE_LOG_DIR}/${url}-error.log
            CustomLog \${APACHE_LOG_DIR}/${url}-access.log combined
        </VirtualHost>
        \`\`\`
        `);
	},
};