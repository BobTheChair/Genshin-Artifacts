import * as elems from './elems.js';
import * as data from './data.js';

export class Artifact {

	set;
	piece;
	mainstat;
	substats = [];
	rarity;
	level = 0;

	constructor(opts = {}) {

		this.rarity = opts.rartity ? opts.rarity : 5;
		this.set = opts.set ? opts.set : this.randomSet();
		this.piece = opts.piece ? opts.piece : this.randomPiece();
		this.mainstat = opts.mainstat ? opts.mainstat : this.randomMainstat();
		
		if(opts.substats) {
			this.level = opts.level ? opts.level : 0;
			this.substats = opts.substats;
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
		console.log(this);
		let img =  data.artifacts[this.set].images[this.piece];
		if(elems.image.getAttribute('src') !== img) elems.image.setAttribute('src', img);
		elems.set.innerText = data.artifacts[this.set].name;
		elems.name.innerText =  data.artifacts[this.set][this.piece].name;
		elems.piece.innerText = data.en[this.piece];
		elems.level.innerText = '+'+this.level;

		this.renderMainStat();
		this.renderSubstats();
		this.renderRarity();
	}

	renderMainStat() {
		let mainstat = ["anemo", "cryo", "electro", "geo", "hydro", "pyro"].includes(this.mainstat) ? 'elem' : this.mainstat;

		elems.mainstat.type.innerText = data.en[this.mainstat];
		let value = this.getMainstat().toFixed(data.format[mainstat].decimals);
		elems.mainstat.value.innerText = value + data.format[mainstat].suffix;
	}

	renderSubstats() {
		let str = '';
		for(let stat of this.substats) {
			str += '<div class="stat">';
			str += data.en[stat.type];
			str += '+' + stat.value.toFixed(data.format[stat.type].decimals);
			str += data.format[stat.type].suffix;
			str += '</div>';
		}
		elems.substats.innerHTML = str;
	}
	renderRarity() {
		let stars = [];
		//google material icons star
		let star = '<span class="material-icons-round">star</span>';
		for(let i = 0; i < this.rarity; i++) {
			stars.push(star);
		}
		elems.rarity.innerHTML = stars.join(''); 
	}

	randomEntry(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
	
	randomSet() {
		let set;
		//convert to string because the json contains strings
		let rarity = (this.rarity).toString();
		do {
			set = this.randomEntry(Object.keys(data.artifacts));
		} while(!data.artifacts[set].rarity.includes(rarity))
		return set;
	}

	randomPiece() {
		return this.randomEntry(Object.keys(data.main.rates));
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
		let values = data.sub.values;
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
			if(levelup) console.log(roll.type, 0, '->', roll.value.toFixed(data.format[roll.type].decimals ));
		} else {
			let stat = this.substats.filter(s=>s.type === roll.type);
			console.log(roll.type, stat[0].value.toFixed(data.format[roll.type].decimals),
			 '->' , (stat[0].value + roll.value).toFixed(data.format[roll.type].decimals) );
			stat[0].value += roll.value;
		}
	}
}