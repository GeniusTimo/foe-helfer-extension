﻿/*
 * **************************************************************************************
 *
 * Dateiname:                 market.js
 * Projekt:                   foe-chrome
 *
 * erstellt von:              Daniel Siekiera <daniel.siekiera@gmail.com>
 * erstellt am:               17.07.20, 23:50 Uhr
 *
 * Copyright © 2020
 *
 * **************************************************************************************
 */

// Markt
FoEproxy.addHandler('TradeService', 'getTradeOffers', (data, postData) => {
    let requestMethod = postData[0]['requestMethod'];

    if (requestMethod === 'getTradeOffers' || requestMethod === 'acceptOfferById') {
        Market.Trades = data.responseData;

        if ($('#market-Btn').hasClass('hud-btn-red')) {
            $('#market-Btn').removeClass('hud-btn-red');
            $('#market-Btn-closed').remove();
        }

        if (Settings.GetSetting('ShowMarketFilter')) {
            Market.Show();
        }
    }
});

let Market = {
    Trades: [],
    Offer: 0,
    Need: 0,
    MinQuantity: 1,
    MaxResults: 100,
    OnlyAffordable: false,

    TradePartnerNeighbor : true,
    TradePartnerGuild : true,
    TradePartnerFriend: true,

    TradeForHigher: true,
    TradeForEqual: true,
    TradeForLower: true,

    TradeAdvantage: true,
    TradeFairStock: true,
    TradeFair: true,
    TradeDisadvantage: false,

    Show: () => {
        if ($('#Market').length === 0) {
            HTML.Box({
                'id': 'Market',
                'title': i18n('Boxes.Market.Title'),
                'auto_close': true,
                'dragdrop': true,
                'minimize': true
            });

            // CSS in den DOM prügeln
            HTML.AddCssFile('market');

            $('#Market').on('click', '.custom-option', function(){
                let func = $(this).closest('.custom-options').data('function'),
					val = $(this).data('value');

                Market[func] = parseInt(val);
                Market.CalcBody();
            });


            $('#Market').on('blur', '#minquantity', function () {
                Market.MinQuantity = parseFloat($('#minquantity').val());              
                Market.CalcBody();
            });

            $('#Market').on('blur', '#maxresults', function () {
                Market.MaxResults = parseFloat($('#maxresults').val());
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradepartnerneighbor', function () {
                Market.TradePartnerNeighbor = !Market.TradePartnerNeighbor;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradepartnerguild', function () {
                Market.TradePartnerGuild = !Market.TradePartnerGuild;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradepartnerfriend', function () {
                Market.TradePartnerFriend = !Market.TradePartnerFriend;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradeforhigher', function () {
                Market.TradeForHigher = !Market.TradeForHigher;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradeforequal', function () {
                Market.TradeForEqual = !Market.TradeForEqual;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradeforlower', function () {
                Market.TradeForLower = !Market.TradeForLower;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradeadvantage', function () {
                Market.TradeAdvantage = !Market.TradeAdvantage;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradefairstock', function () {
                Market.TradeFairStock = !Market.TradeFairStock;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradefair', function () {
                Market.TradeFair = !Market.TradeFair;
                Market.CalcBody();
            });

            $('#Market').on('click', '.tradedisadvantage', function () {
                Market.TradeDisadvantage = !Market.TradeDisadvantage;
                Market.CalcBody();
            });

            $('#Market').on('change', '.onlyaffordable', function () {
                Market.OnlyAffordable = !Market.OnlyAffordable;
                Market.CalcBody();
            });
        }

        Market.CalcBody();
    },


    CalcBody: () => {
        let h = [];

        //Filters
        h.push('<div class="dark-bg" style="margin-bottom: 3px;">');
        h.push('<table class="filters">');
        h.push('<thead>');
        h.push('<tr>');
        h.push('<th colspan="2"></td>');
        h.push('<th>' + i18n('Boxes.Market.TradePartner') + '</th>');
        h.push('<th>' + i18n('Boxes.Market.TradeForGoods') + '</th>');
        h.push('<th>' + i18n('Boxes.Market.Rating') + '</th>');
        h.push('</tr>');
        h.push('</thead>');

        h.push('<tr>');
        h.push('<td>' + i18n('Boxes.Market.Offer') + '</td>');

        h.push('<td>');

		let ID = 0;
		h.push(`<div class="custom-select-wrapper">
					<div class="custom-select">
						<div class="custom-select__trigger">
							<span class="trigger">${i18n('Boxes.Market.AllGoods')}</span>
							<div class="arrow"></div>
						</div>
						<div class="custom-options" data-function="Offer">
							<span class="custom-option${(Market.Offer === ID ? ' selected' : '')}" data-value="${ID}">${i18n('Boxes.Market.AllGoods')}</span>`);

							for (let era = 0; era <= Technologies.Eras.SpaceAgeAsteroidBelt - Technologies.Eras.BronzeAge; era++)
							{
								ID += 1;

								h.push(`<span class="custom-option era${(Market.Offer === ID ? ' selected' : '')}" data-value="${ID}">
											${i18n('Eras.' + (era + Technologies.Eras.BronzeAge))}
										</span>`);

								for (let i = 0; i < 5; i++) {
									ID += 1;
									h.push(`<span class="custom-option${(Market.Offer === ID ? ' selected' : '')}" data-value="${ID}">
												${GoodsList[5*era + i]['name']}
											</span>`);
								}
							}

		h.push(			`</div>
					</div>
				</div>`);

        h.push('</td>');

        h.push('<td><label class="game-cursor"><input class="tradepartnerneighbor game-cursor" ' + (Market.TradePartnerNeighbor ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradePartnerNeighbor') + '</label></td>');
        h.push('<td><label class="game-cursor"><input class="tradeforhigher game-cursor" ' + (Market.TradeForHigher ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradeForHigher') + '</label></td>');
        h.push('<td><label class="game-cursor"><input class="tradeadvantage game-cursor" ' + (Market.TradeAdvantage ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradeAdvantage') + '</label></td>');
        h.push('</tr>');

        h.push('<tr>');
        h.push(`<td>${i18n('Boxes.Market.Need')}</td>`);

        h.push('<td>');

		ID = 0;
		h.push(`<div class="custom-select-wrapper">
					<div class="custom-select">
						<div class="custom-select__trigger">
							<span class="trigger">${i18n('Boxes.Market.AllGoods')}</span>
							<div class="arrow"></div>
						</div>
						<div class="custom-options" data-function="Need">
							<span class="custom-option${(Market.Need === ID ? ' selected' : '')}" data-value="${ID}">${i18n('Boxes.Market.AllGoods')}</span>`);

							for (let era = 0; era <= Technologies.Eras.SpaceAgeAsteroidBelt - Technologies.Eras.BronzeAge; era++)
							{
								ID += 1;

								h.push(`<span class="custom-option era${(Market.Need === ID ? ' selected' : '')}" data-value="${ID}">
											${i18n('Eras.' + (era + Technologies.Eras.BronzeAge))}
										</span>`);

								for (let i = 0; i < 5; i++) {
									ID += 1;
									h.push(`<span class="custom-option${(Market.Need === ID ? ' selected' : '')}" data-value="${ID}">
												${GoodsList[5*era + i]['name']}
											</span>`);
								}
							}

		h.push(			`</div>
					</div>
				</div>`);
        h.push('</td>');

        h.push('<td><label class="game-cursor"><input class="tradepartnerguild game-cursor" ' + (Market.TradePartnerGuild ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradePartnerGuild') + '</label></td>');
        h.push('<td><label class="game-cursor"><input class="tradeforequal game-cursor" ' + (Market.TradeForEqual ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradeForEqual') + '</label></td>');
        h.push('<td><label class="game-cursor"><input class="tradefairstock game-cursor" ' + (Market.TradeFairStock ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradeFairStock') + '</label></td>');
        h.push('</tr>');

        h.push('<tr>');
        h.push('<td><label class="game-cursor" for="minquantity">' + i18n('Boxes.Market.MinQuantity') + '</label></td>');
        h.push('<td title="' + i18n('Boxes.Market.TTMinQuantity') + '"><input type="number" id="minquantity" step="1" min="0" max="1000000" value="' + Market.MinQuantity + '"></td>');
        h.push('<td><label class="game-cursor"><input class="tradepartnerfriend game-cursor" ' + (Market.TradePartnerFriend ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradePartnerFriend') + '</label></td>');
        h.push('<td><label class="game-cursor"><input class="tradeforlower game-cursor" ' + (Market.TradeForLower ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradeForLower') + '</label></td>');
        h.push('<td><label class="game-cursor"><input class="tradefair game-cursor" ' + (Market.TradeFair ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradeFair') + '</label></td>');
        h.push('</tr>');

        h.push('<tr>');
        h.push('<td><label class="game-cursor" for="maxresults">' + i18n('Boxes.Market.MaxResults') + '</label></td>');
        h.push('<td><input type="number" id="maxresults" step="1" min="1" max="1000000" value="' + Market.MaxResults + '"></td>');
        h.push('<td></td>');
        h.push('<td></td>');
        h.push('<td><label class="game-cursor"><input class="tradedisadvantage game-cursor" ' + (Market.TradeDisadvantage ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.TradeDisadvantage') + '</label></td>');
        h.push('</tr>');

        h.push('<tr>');
        h.push('<td colspan="2"><label class="game-cursor"><input class="onlyaffordable game-cursor" ' + (Market.OnlyAffordable ? 'checked' : '') + ' type="checkbox">' + i18n('Boxes.Market.OnlyAffordable') + '</label></td>');
        h.push('<td></td>');
        h.push('<td></td>');
        h.push('<td></td>');
        h.push('</tr>');

        h.push('</table>');
        h.push('</div>');

        // Table
        h.push('<table class="foe-table">');

        h.push('<thead>');
        h.push('<tr>');
        h.push('<th colspan="3">' + i18n('Boxes.Market.OfferColumn') + '</th>');
        h.push('<th colspan="3">' + i18n('Boxes.Market.NeedColumn') + '</th>');
        h.push('<th>' + i18n('Boxes.Market.RateColumn') + '</th>');
        h.push('<th>' + i18n('Boxes.Market.PlayerColumn') + '</th>');
        h.push('<th>' + i18n('Boxes.Market.PageColumn') + '</th>');
        h.push('</tr>');
        h.push('</thead>');

        let Counter = 0;
        let Pos = 0;
        for (let i = 0; i < Market.Trades.length; i++)
        {
            if (Counter >= Market.MaxResults) break;

            let Trade = Market.Trades[i];
            if (Market.TestFilter(Trade)) {
                h.push('<tr>');
                h.push('<td class="goods-image"><span class="goods-sprite-50 sm '+ GoodsData[Trade['offer']['good_id']]['id'] +'"></span></td>'); 
                h.push('<td>' + GoodsData[Trade['offer']['good_id']]['name'] + '</td>');
                h.push('<td>' + Trade['offer']['value'] + '</td>');
                h.push('<td class="goods-image"><span class="goods-sprite-50 sm '+ GoodsData[Trade['need']['good_id']]['id'] +'"></span></td>'); 
                h.push('<td>' + GoodsData[Trade['need']['good_id']]['name'] + '</td>');
                h.push('<td>' + Trade['need']['value'] + '</td>');
                h.push('<td class="text-center">' + HTML.Format(Math.round(Trade['offer']['value'] / Trade['need']['value'] * 100) / 100) + '</td>');
                h.push('<td>' + Trade['merchant']['name'] + '</td>');
                h.push('<td class="text-center">' + (Math.floor(Pos / 10 + 1)) + '-' + (Pos % 10 + 1) + '</td>');
                h.push('</tr>');

                Counter += 1;
            }

            if (!Trade['merchant']['is_self']) { //Eigene Handel rausfiltern
                Pos += 1;
            }
        }

        h.push('</table>');

        $('#MarketBody').html(h.join('')).promise().done(function(){
			HTML.Dropdown();
		});

    },


    TestFilter: (Trade) => {
        if (Trade['id'] < 0) { // 10:1 Händler immer ausblenden
            return false;
        }

        if (Trade['merchant']['is_self']) {
            return false;
        }

        //Offer
        if (!Market.TestGoodFilter(Trade['offer']['good_id'], Market.Offer)) {
            return false;
        }

        //Need
        if (!Market.TestGoodFilter(Trade['need']['good_id'], Market.Need)) {
            return false;
        }

        //MinQuantity
        if(!(Trade['merchant']['is_guild_member'] || Trade['offer']['value'] >= Market.MinQuantity)) { //ignore MinQuanity for guild members
            return false;
        }

        // only Affordable
        if (Market.OnlyAffordable && Trade.need.value > (ResourceStock[Trade.need.good_id] || 0)) {
            return false;
        }

        //Tradepartner
        if (!((Market.TradePartnerNeighbor && Trade['merchant']['is_neighbor']) || (Market.TradePartnerGuild && Trade['merchant']['is_guild_member']) || (Market.TradePartnerFriend && Trade['merchant']['is_friend']))) {
            return false;
        }

        let OfferGoodID = Trade['offer']['good_id'],
            NeedGoodID = Trade['need']['good_id'],
            OfferEra = Technologies.Eras[GoodsData[OfferGoodID]['era']],
            NeedEra = Technologies.Eras[GoodsData[NeedGoodID]['era']],
            EraDiff = OfferEra - NeedEra;

        if (EraDiff > 0 && !Market.TradeForHigher) {
            return false;
        }
        if (EraDiff === 0 && !Market.TradeForEqual) {
            return false;
        }
        if (EraDiff < 0 && !Market.TradeForLower) {
            return false;
        }

        let Rate = Trade['offer']['value'] / Trade['need']['value'];
        let Rating = Rate * Math.pow(2, EraDiff);

        if (Rating > 1 && !Market.TradeAdvantage) {
            return false;
        }
        if (Rating === 1) { // Fair
            if (ResourceStock[OfferGoodID] < ResourceStock[NeedGoodID]) { //Stock is higher
                if (!Market.TradeFairStock) {
                    return false;
                }
            }
            else { // Stock is lower or equal
                if (!Market.TradeFair) {
                    return false;
                }
            }
        }
        if (Rating < 1 && !Market.TradeDisadvantage) {
            return false;
        }

        return true;
    },


    TestGoodFilter: (TradeGood, GoodCode) => {
        if (GoodCode === 0) return true;

        GoodCode -= 1;

        let EraIndex = Math.floor(GoodCode / 6);
        let ID = GoodCode % 6;

        let AllowedGoods = [];
        if (ID === 0) {
            for (let i = 0; i < 5; i++) {
                AllowedGoods.push(GoodsList[EraIndex * 5 + i]['id']);
            }
        }
        else {
            AllowedGoods.push(GoodsList[EraIndex * 5 + ID - 1]['id']);
        }

        for (let i = 0; i < AllowedGoods.length; i++) {
            if (TradeGood === AllowedGoods[i]) return true;
        }
        return false
    },
};