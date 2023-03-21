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

		this.id = opts.id ? opts.id : this.uid(); //window.artifacts.length;
		this.rarity = opts.rartity ? opts.rarity : 5;
		this.set = opts.set ? opts.set : this.randomSet();
		this.piece = opts.piece ? opts.piece : this.randomPiece();
		this.mainstat = opts.mainstat ? opts.mainstat : this.randomMainstat();
		this.level = opts.level ? opts.level : 0;

		if(opts.substats) {
			this.substats = opts.substats;
		} else {
			//get first 3 substats
			this.upgrade();
			this.upgrade();
			this.upgrade();
			
			//25% chance to get the last 4th substat
			if(Math.random() > 0.75) {
				this.upgrade();
			}

			//if levels is set, enhance to level
			if(opts.level) this.enhance(opts.level);
		}
	}

	getShortText() {
		console.log(data.enShort)
		return 'Lvl ' +  this.level + ' ' + data.enShort[this.mainstat] + ' ' + data.enShort[this.piece] + ' CV' +this.calcCV() +' - ' + this.getSet();
	}

	render() {
		console.log('CV:', this.calcCV(), this);
		let img =  data.artifacts[this.set].images[this.piece];
		if(elems.image.getAttribute('src') !== img) elems.image.setAttribute('src', img);
		elems.set.innerText = this.getSet();
		elems.name.innerText =  this.getName();
		elems.piece.innerText = this.getPiece();
		elems.level.innerText = '+'+this.level;

		this.renderMainStat();
		this.renderSubstats();
		this.renderRarity();
	}

	renderMainStat() {
		elems.mainstat.type.innerText = data.en[this.mainstat];
		let value = this.formatStat({type:this.mainstat, value:this.getMainstat()});
		elems.mainstat.value.innerText = value + data.format[this.mainstat].suffix;
	}

	renderSubstats() {
		let str = '';
		for(let stat of this.substats) {
			str += '<div class="stat">';
			str += data.en[stat.type];
			str += '+' + this.formatStat(stat);
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
		//convert to string because the json object keys are strings
		let rarity = (this.rarity).toString();
		do {
			set = this.randomEntry(Object.keys(data.artifacts));
		} while(!data.artifacts[set].rarity.includes(rarity))
		return set;
	}

	getPiece() {
		return data.en[this.piece];
	}

	getSet() {
		return data.artifacts[this.set].name;
	}

	getName() {
		return data.artifacts[this.set][this.piece].name;
	}

	randomPiece() {
		return this.randomEntry(Object.keys(data.main.rates));
	}

	getMainstat() {
		return data.main.values[this.rarity][this.mainstat][this.level];
	}

	weightedRandom(rates) {
		let i;
		let sum = 0;
		
		//object keys contain the "values" we are rolling for
		let types = Object.keys(rates);

		//object values contain the weight for its key
		let weight = Object.values(rates);

		//calculate the total weight
		let total = weight.reduce((partialSum, a) => partialSum + a, 0);

		let r = Math.random();

		for (i in weight) {
			sum += weight[i] / total;
			if (r <= sum) return types[i];
		}
	}

	randomMainstat() {
		return this.weightedRandom(data.main.rates[this.piece]);
	}

	formatStat(stat) {
		return stat.value.toFixed(data.format[stat.type].decimals);
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
			if(levelup) console.log(roll.type, 0, '->', this.formatStat(roll));
		} else {
			let stat = this.substats.filter(s => s.type === roll.type);
			console.log(roll.type, this.formatStat(stat[0]), '->', this.formatStat({type:roll.type, value: roll.value + stat[0].value}));
			stat[0].value += roll.value;
		}
	}
	
	uid() {
		return Math.random().toString(36).substr(2, 10);
	}

	calcCV() {
		let cr = 0;
		let cd = 0;
		for(let stat of this.substats) {
			if(stat.type === 'cr') cr = this.formatStat(stat);
			if(stat.type === 'cd') cd = this.formatStat(stat);
		}
		return cd*1 + cr*2;
	}
}