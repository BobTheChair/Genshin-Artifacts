import * as elems from './elems.js';

window.data = {
	artifacts: {},
	main: {},
	sub: {},
	format: {
		'hp' 		: { suffix: '',  decimals : 0 },
		'atk'		: { suffix: '',  decimals : 0 },
		'def'		: { suffix: '',  decimals : 0 },
		'hp-p' 		: { suffix: '%', decimals : 1 },
		'atk-p' 	: { suffix: '%', decimals : 1 },
		'def-p' 	: { suffix: '%', decimals : 1 },
		'em'		: { suffix: '',  decimals : 0 },
		'er'		: { suffix: '%', decimals : 1 },
		'crit-rate'	: { suffix: '%', decimals : 1 },
		'crit-dmg' 	: { suffix: '%', decimals : 1 }
	},
	en: {
		'hp' 		: 'HP',
		'atk'		: 'ATK',
		'def'		: 'DEF',
		'hp-p' 		: 'HP',
		'atk-p' 	: 'ATK',
		'def-p' 	: 'DEF',
		'em'		: 'Elemental Mastery',
		'er'		: 'Energy Recharge',
		'crit-rate'	: 'CRIT Rate',
		'crit-dmg' 	: 'CRIT DMG',
		'flower'	: 'Flower of Life',
		'plume'		: 'Plume of Death',
		'sands'		: 'Sands of Eon',
		'goblet'	: 'Goblet of Eonothem',
		'circlet'	: 'Circlet of Logos'
	}
};
fetch('data.json').then(data=>data.json()).then(json=>{window.data.main=json.main;window.data.sub=json.sub;});
fetch('artifacts.json').then(data=>data.json()).then(json=>window.data.artifacts=json);



export class Artifact {

	set;
	piece;
	mainstat;
	substats = [];
	rarity = 5;
	level = 0;

	constructor() {
		this.set = 'ocean-hued';
		this.piece = 'circlet';

		this.mainstat = {type:'atk-p', value: 46.6};

		
		this.upgrade();
		this.upgrade();
		this.upgrade();

		if(Math.random() > 0.75) {
			this.upgrade();
		}

		/*this.substats = [
			{type: 'crit-rate', value:7.8},
			{type: 'er', value: 5.2},
			{type: 'atk', value: 29},
			{type: 'def-p', value: 18.2}
		];*/

	}

	render() {
		elems.image.setAttribute('src', window.data.artifacts[this.set][this.piece].image);
		elems.set.innerText = window.data.artifacts[this.set].set.name;
		elems.name.innerText =  window.data.artifacts[this.set][this.piece].name;
		elems.piece.innerText = window.data.en[this.piece];
		elems.level.innerText = '+'+this.level;

		this.renderMainStat();
		this.renderSubstats();
		this.renderRarity();
	}

	renderMainStat() {
		elems.mainstat.type.innerText = window.data.en[this.mainstat.type];
		let value = this.mainstat.value.toFixed(window.data.format[this.mainstat.type].decimals);
		elems.mainstat.value.innerText = value + window.data.format[this.mainstat.type].suffix;
	}

	renderSubstats() {
		let str = '';
		for(let stat of this.substats) {
			console.log(stat);
			str += '<div class="stat">';
			str += window.data.en[stat.type];
			str += '+' + stat.value.toFixed(window.data.format[stat.type].decimals);
			str += window.data.format[stat.type].suffix;
			str += '</div>';
		}
		elems.substats.innerHTML = str;
	}
	renderRarity() {
		let stars = '';
		for(let i = 0; i < this.rarity; i++) {
			stars += '*';
		}
		elems.rarity.innerText = stars; 
	}
	
	roll() {
		let roll = false;
		let values = window.data.sub.values;
		const types = Object.keys(values);
		do {
			let type = types[Math.floor(Math.random() * types.length)];
			if(type !== this.mainstat.type
			&& this.substats.filter(stat=>stat.type === type).length === (this.substats.length < 4 ? 0 : 1) ) {
				roll = {type: type, value: values[type][Math.floor(Math.random() * values[type].length)]};
			}
		} while(!roll);
		return roll;
	}


	enhance(levels) {
		if(!levels) return;
		levels = parseInt(levels);
		
		for(var i = this.level; i <= this.level+levels; i+=4){
			this.upgrade(true);
		}
		this.level += levels;
		this.render();
	}

	upgrade(levelup = false) {
		let roll = this.roll();
		if(this.substats.length < 4) {
			this.substats.push(roll);
			if(levelup) console.log(roll.type, 0, '->', roll.value.toFixed(window.data.format[roll.type].decimals ));
		} else {
			let stat = this.substats.filter(s=>s.type === roll.type);
			console.log(roll.type, stat[0].value.toFixed(window.data.format[roll.type].decimals), '->',
			(stat[0].value + roll.value).toFixed(window.data.format[roll.type].decimals ));
			stat[0].value += roll.value;
		}
	}
}