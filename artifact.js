import * as elems from './elems.js';

window.data = {};
fetch('data.json').then(data=>data.json()).then(json=>{
	window.data.format=json.format;
	window.data.main=json.main;
	window.data.sub=json.sub;
	window.data.en=json.en;
});
fetch('artifacts.json').then(data=>data.json()).then(json=>window.data.artifacts=json);



export class Artifact {

	set;
	piece;
	mainstat;
	substats = [];
	rarity;
	level = 0;

	constructor(opts = {}) {

		this.rarity = opts.rartity ? opts.rarity : 5;
		this.set = opts.set ? opts.set : 'emblemofseveredfate';
		this.piece = opts.piece ? opts.piece : this.randomPiece();
		this.mainstat = opts.mainstat ? opts.mainstat : this.randomMainstat();
		
		if(opts.substats) {
			this.level = opts.level ? opts.level : 0;
			this.substats = [
				{type: 'cr', value:7.8},
				{type: 'er', value: 5.2},
				{type: 'atk', value: 29},
				{type: 'def-p', value: 18.2}
			];
		} else {
			this.upgrade();
			this.upgrade();
			this.upgrade();
	
			if(Math.random() > 0.75) {
				this.upgrade();
			}

			if(opts.level) this.enhance(opts.level);
		}
	}

	render() {
		let img =  window.data.artifacts[this.set].images[this.piece];
		if(elems.image.getAttribute('src') !== img) elems.image.setAttribute('src', img);
		elems.set.innerText = window.data.artifacts[this.set].name;
		elems.name.innerText =  window.data.artifacts[this.set][this.piece].name;
		elems.piece.innerText = window.data.en[this.piece];
		elems.level.innerText = '+'+this.level;

		this.renderMainStat();
		this.renderSubstats();
		this.renderRarity();
	}

	renderMainStat() {
		let mainstat = ["anemo", "cryo", "electro", "geo", "hydro", "pyro"].includes(this.mainstat) ? 'elem' : this.mainstat;

		elems.mainstat.type.innerText = window.data.en[this.mainstat];
		let value = this.getMainstat().toFixed(window.data.format[mainstat].decimals);
		elems.mainstat.value.innerText = value + window.data.format[mainstat].suffix;
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
	
	randomPiece() {
		const types = Object.keys(data.main.rates);
		return types[Math.floor(Math.random() * types.length)];
	}

	getMainstat() {
		let mainstat = ["anemo", "cryo", "electro", "geo", "hydro", "pyro"].includes(this.mainstat) ? 'elem' : this.mainstat;
		return data.main.values[this.rarity][mainstat][this.level];
	}

	weightedRandom(rates) {
		let i;
		let sum = 0;
		let types = Object.keys(rates);
		let values = Object.values(rates);
		let total = values.reduce((partialSum, a) => partialSum + a, 0);

		let r = Math.random();

		for (i in values) {
		  sum += values[i] / total;
		  if (r <= sum) return types[i];
		}
	  }

	randomMainstat() {
		return this.weightedRandom(data.main.rates[this.piece]);
	}

	roll() {
		let values = window.data.sub.values;
		let rates = {};

		if(this.substats.length < 4) {
			for(let rate of Object.keys(data.sub.rates)) {
				if(rate === this.mainstat) continue;
				if(this.substats.filter(stat => stat.type === rate).length !== 0) continue;
				rates[rate] = data.sub.rates[rate];
			}
		} else {
			for(let stat of this.substats) {
				if(stat.type === this.mainstat) continue;
				rates[stat.type] = data.sub.rates[stat.type];
			}
		}
		let type = this.weightedRandom(rates);
		return {type: type, value: values[type][Math.floor(Math.random() * values[type].length)]};
	}


	enhance(levels) {
		if(!levels) return;
		levels = parseInt(levels);
		if(levels + this.level > 20) return;

		for(var i = 1; i <= levels; i++){
			if((this.level + i) % 4 !== 0)  continue;
			this.upgrade(true);
		}
		this.level += levels;
	}

	upgrade(levelup = false) {
		let roll = this.roll();
		if(this.substats.length < 4) {
			this.substats.push(roll);
			if(levelup) console.log(roll.type, 0, '->', roll.value.toFixed(window.data.format[roll.type].decimals ));
		} else {
			let stat = this.substats.filter(s=>s.type === roll.type);
			console.log(roll.type, stat[0].value.toFixed(window.data.format[roll.type].decimals),
			 '->' , (stat[0].value + roll.value).toFixed(window.data.format[roll.type].decimals) );
			stat[0].value += roll.value;
		}
	}
}