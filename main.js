let data = {
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
fetch('data.json').then(data=>data.json()).then(json=>{data.main=json.main;data.sub=json.sub;});
fetch('artifacts.json').then(data=>data.json()).then(json=>data.artifacts=json);

const elems = {};

class Artifact {

	set;
	piece;
	mainstat;
	substats = [];
	rarity = 5;
	level = 0;

	render() {
		elems.image.setAttribute('src', data.artifacts[this.set][this.piece].image);
		elems.set.innerText = data.artifacts[this.set].set.name;
		elems.name.innerText =  data.artifacts[this.set][this.piece].name;
		elems.piece.innerText = data.en[this.piece];
		elems.level.innerText = '+'+this.level;

		this.renderMainStat();
		this.renderSubstats();
		this.renderRarity();
	}

	renderMainStat() {
		elems.mainstat.type.innerText = data.en[this.mainstat.type];
		let value = this.mainstat.value.toFixed(data.format[this.mainstat.type].decimals);
		elems.mainstat.value.innerText = value + data.format[this.mainstat.type].suffix;
	}

	renderSubstats() {
		let str = '';
		for(let stat of this.substats) {
			console.log(stat);
			str += '<div class="stat">';
			str += data.en[stat.type];
			str += '+' + stat.value.toFixed(data.format[stat.type].decimals);
			str += data.format[stat.type].suffix;
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
		let values = data.sub.values;
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

	upgrade() {
		let roll = this.roll();
		if(this.substats.length < 4) {
			this.substats.push(roll);
			console.log(roll);
		} else {
			this.level += 4;
			let stat = this.substats.filter(s=>s.type === roll.type);
			console.log(roll.type, stat[0].value.toFixed(data.format[roll.type].decimals), '->', (stat[0].value + roll.value).toFixed(data.format[roll.type].decimals ));
			stat[0].value += roll.value;
		}
	}
}

let art = new Artifact();
window.onload = (e) =>{
	elems.container = document.getElementsByClassName('container')[0];
	elems.name = elems.container.getElementsByClassName('name')[0];
	elems.image = elems.container.getElementsByClassName('image')[0];
	elems.piece = elems.container.getElementsByClassName('piece')[0];
	elems.mainstat = {
		type: elems.container.querySelector('.mainstat .type'),
		value: elems.container.querySelector('.mainstat .value')
	};
	elems.rarity = elems.container.getElementsByClassName('rarity')[0],
	elems.set = elems.container.getElementsByClassName('set')[0],
	elems.level = elems.container.getElementsByClassName('level')[0],
	elems.substats = elems.container.getElementsByClassName('substats')[0],

	setTimeout(()=>{
	
		art.set = 'ocean-hued';
		art.piece = 'circlet';

		art.mainstat = {type:'atk-p', value: 46.6};

		art.upgrade();
		art.upgrade();
		art.upgrade();

		if(Math.random() > 0.75) {
			art.upgrade();
		}


		/*
		art.level = 20;

		art.substats = [
			{type: 'crit-rate', value:7.8},
			{type: 'er', value: 5.2},
			{type: 'atk', value: 29},
			{type: 'def-p', value: 18.2}
		];
		*/
		console.log(art);
		art.render();
	}, 500)
};


