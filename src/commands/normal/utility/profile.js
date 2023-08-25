const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, Image } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { request } = require('undici');
const { get } = require('axios');

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Shows an image of (target) user details')
        .addUserOption(option =>
            option.setName("target")
                .setDescription("A diffrent user you want to make their profile for"))
		.addAttachmentOption(option => 
			option.setName("backgroundimage")
				.setDescription("A custom background image (700x250 recomended)"))
		.addStringOption(option => 
			option.setName("imageurl")
				.setDescription("The url of a background image (700x250 recomended)"))
		.addStringOption(option => 
			option.setName("backgroundcolor")
			.setDescription("A hex you want for the background color"))
		.addStringOption(option => 
			option.setName("textcolor")
			.setDescription("If the background makes the text less readable, input a hex color code here")),
	async execute(interaction) {
        const member = interaction.options.getMember("target") ?? interaction.member;
		const image = interaction.options.getAttachment("backgroundimage");
		const imageurl = interaction.options.getString("imageurl");
		const backgroundcolor = interaction.options.getString("backgroundcolor");
		const textcolor = interaction.options.getString("textcolor") ?? "#ffffff";

		if (image && imageurl) {
			return interaction.reply("You can't input multiple backgrounds");
		}
		
		if (image) {
			const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
			if (!allowedImageTypes.includes(image.contentType)) {
				return interaction.reply("Unsupported image type. Please upload a valid image file.");
			}
		}

		const canvas = createCanvas(700, 250);
		const context = canvas.getContext('2d');

		const backgroundImage = new Image();

		if (imageurl) {
			try {
				const response = await get(imageurl, { responseType: 'arraybuffer' });
				const buffer = Buffer.from(response.data);
				backgroundImage.src = buffer;
			} catch (error) {
				console.error('Error fetching image:', error);
			}
			context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
		} 
		else if (image) {
			try {
				const response = await get(image.url, { responseType: 'arraybuffer' });
				const buffer = Buffer.from(response.data);
				backgroundImage.src = buffer;
			} catch (error) {
				console.error('Error fetching image:', error);
			}
			context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
		}
		else if (backgroundcolor) {
			context.fillStyle = `#${backgroundcolor.replace("#", "")}`;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
		else {
			const background = await readFile('./src/background.png');
			backgroundImage.src = background;
			context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
		}

		context.font = '28px sans-serif';
		context.fillStyle = `#${textcolor.replace("#", "")}`;
		context.fillText('Profile', canvas.width / 2.5, canvas.height / 5);

		context.font = applyText(canvas, `${member.displayName}!`);
		context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 2.3);
		
		const joinDate = member.joinedAt

		context.font = applyText(canvas, `${joinDate.getDate()}/${joinDate.getMonth() + 1}/${joinDate.getFullYear()}`);
		context.fillText(`${joinDate.getDate()}/${joinDate.getMonth() + 1}/${joinDate.getFullYear()}`, canvas.width / 2.5, canvas.height / 1.4);
		
		context.font = applyText(canvas, "Powered by ratterscanner.com");
		context.fillText('Powered by ratterscanner.com', canvas.width / 2.5, canvas.height / 1.15);

		context.beginPath();
		context.arc(125, 125, 100, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();

		const { body } = await request(member.displayAvatarURL({ format: 'jpg' }));
		const avatar = new Image();
		avatar.src = Buffer.from(await body.arrayBuffer());
		context.drawImage(avatar, 25, 25, 200, 200);

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: `${member.displayName}-profile.png` });

		interaction.reply({ files: [attachment] });
	}
};