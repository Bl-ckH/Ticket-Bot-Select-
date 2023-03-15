const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const selectOptions = [
  {
    label: 'Support',
    value: 'support',
    description: 'Hilfe bei Problemen oder Fragen'
  },
  {
    label: 'Teambewerbung',
    value: 'teambewerbung',
    description: 'Bewerbung für das Team'
  },
  {
    label: 'Partnerbewerbung',
    value: 'partnerbewerbung',
    description: 'Bewerbung als Partner'
  },
  {
    label: 'Sonstiges',
    value: 'sonstiges',
    description: 'Andere Anfragen'
  }
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!ticket') {
    const selectMenu = new MessageSelectMenu()
      .setCustomId('ticket-select')
      .setPlaceholder('Wähle eine Kategorie')
      .addOptions(selectOptions);

    const row = new MessageActionRow().addComponents(selectMenu);

    const embed = new MessageEmbed()
      .setTitle('Erstelle ein Ticket')
      .setDescription('Klicke auf das Dropdown-Menü und wähle eine Kategorie aus')
      .setColor('#00ff00');

      await interaction.reply({
        content: `Dein Ticket wurde erstellt in <#${channel.id}>`,
        ephemeral: true // Setze ephemeral auf true, um die Nachricht nur für den Benutzer sichtbar zu machen
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  const value = interaction.values[0];

  const embed = new MessageEmbed()
    .setTitle(`Ticket für ${selectOptions.find((option) => option.value === value).label}`)
    .setDescription(selectOptions.find((option) => option.value === value).description)
    .setFooter('Ticket wurde erstellt')
    .setColor('#00ff00');

  const channel = await interaction.guild.channels.create(`${interaction.user.username}-${value}`, {
    type: 'text',
    parent: '1084424951085408259',
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: ['VIEW_CHANNEL'],
      },
      {
        id: interaction.user.id,
        allow: ['VIEW_CHANNEL'],
      },
      {
        id: '1084425338802684034',
        allow: ['VIEW_CHANNEL'],
      },
    ],
  });
  
  const button = new MessageButton()
    .setCustomId('close-ticket')
    .setLabel('Ticket schließen')
    .setStyle('DANGER');

  const row = new MessageActionRow().addComponents(button);

  await channel.send({ 
    content: `<@${interaction.user.id}> Ein neues Ticket wurde eröffnet!`,
    embeds: [embed], 
    components: [row] 
  }).then(async (message) => {
    const filter = (i) => i.customId === 'close-ticket';

    const collector = message.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 86400000 });

    collector.on('collect', async i => {
      await i.update({ components: [] });
      channel.permissionOverwrites.edit(interaction.user.id, { VIEW_CHANNEL: false });
      channel.delete();
    
      const closeEmbed = new MessageEmbed()
        .setTitle(`Ticket für ${selectOptions.find((option) => option.value === value).label} geschlossen`)
        .setDescription(`Das Ticket wurde von ${i.user.username} geschlossen.`)
        .setFooter({ text: 'Ticket wurde erstellt' })
        .setColor('#ff0000');
    
      await interaction.user.send({ embeds: [closeEmbed] });
    });      
  });

  const teamRole = interaction.guild.roles.cache.get('1084425338802684034');
  await channel.send(`Das Team wurde benachrichtigt: ${teamRole}`);
});

client.login('MTA4NDQyNTE1MzU5MDU5MTU0OQ.GDNKjh.h7lTmSQSHPcDrZ_mBg3DZ41VzPFf0COo_rDC1E');