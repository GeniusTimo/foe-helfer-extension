FoEproxy.addHandler('ArmyUnitManagementService', 'getArmyInfo', (data, postData) => {
	Profile.Close();
});

let Profile = {
	Show: (data) => {
		if ($('#ProfileBox').length === 0) {
			HTML.Box({
				id: 'ProfileBox',
				// title: i18n('Boxes.ProfileBox.Title'),
				title: 'Spielerprofil',
				auto_close: true,
				dragdrop: true
			});

			// HTML.AddCssFile('profile');
		}


		const { other_player } = data;
		if (!other_player) return console.error('Profildaten nicht vorhanden!')
		const h = []
		h.push('<img src="' + MainParser.InnoCDN + 'assets/shared/avatars/' + MainParser.PlayerPortraits[other_player.avatar] + '.jpg" alt="Avatar von ' + other_player.name + '">')
		h.push('Stadtname: ' + other_player.city_name);
		h.push('Zeitalter: ' + i18n('Eras.' + Technologies.Eras[other_player.era]));
		h.push('Punkte: ' + other_player.score + ' | Formatiert: ' + HTML.Format(other_player.score))
		h.push('Rangliste: ' + other_player.rank)
		h.push('Online? ' + other_player.is_online + ' | Freund? ' + other_player.is_friend + ' | Nachbar?' + other_player.is_neighbor + ' | Gildenkollege? ' + other_player.is_guild_member)
		h.push('Profiltext: ' + other_player.profile_text)
		h.push('Avatar: ' + MainParser.PlayerPortraits[other_player.avatar]);
		$('#ProfileBoxBody').html(h.join('<br>'));
	},

	Close: () => {
		HTML.CloseOpenBox('ProfileBox');
	}
}
