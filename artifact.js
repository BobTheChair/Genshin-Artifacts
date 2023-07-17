import * as elems from './elems.js';
import * as data from './data.js';

export class Artifact {

	set;
	piece;
	mainstat;
	substats = [];
	rarity;
	level = 0;
	
	static maxSubstats = 4;
	static maxLevel = 20;
	static newSubstatInterval = 4;

	constructor(opts = {}) {

		this.id = opts.id ? opts.id : this.uid(); //window.artifacts.length;
		this.rarity = opts.rartity ? opts.rarity : 5;
		this.set = opts.set ? opts.set : this.randomSet();
		this.piece = opts.piece ? opts.piece : this.randomPiece();
		this.mainstat = opts.mainstat ? opts.mainstat : this.randomMainstat();
		
		if(opts.substats) {
			this.level = opts.level ? opts.level : 0;
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
		let value = this.formatStat({type:this.mainstat, value:this.getMainstatValue()});
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

	/**
	 * @param {Array} array any normal array with 
	 * @returns random value from input array
	 */
	randomEntry(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
	
	/**
	 * @returns a random artifact set
	 */
	randomSet() {
		let set;
		//convert to string because the json object keys are strings
		let rarity = (this.rarity).toString();
		do {
			set = this.randomEntry(Object.keys(data.artifacts));
		} while(!data.artifacts[set].rarity.includes(rarity))
		return set;
	}

	/**
	 * @returns artifact's diplay piece type name
	 */
	getPiece() {
		return data.en[this.piece];
	}

	/**
	 * @returns artifact's set display name
	 */
	getSet() {
		return data.artifacts[this.set].name;
	}

	/**
	 * @returns artifact's display name 
	 */
	getName() {
		return data.artifacts[this.set][this.piece].name;
	}

	/**
	 * @returns artifacts mainstat value
	 */
	getMainstatValue() {
		return data.main.values[this.rarity][this.mainstat][this.level > 20 ? 20 : this.level];
	}

	/**
	 * @return string name of a random artifact piece type (flower, plume, sands, goblet, circlet)
	 */
	randomPiece() {
		return this.randomEntry(Object.keys(data.main.rates));
	}

	/**
	 * @returns random mainstat type dependant on artifact piece
	 */
	randomMainstat() {
		return this.weightedRandom(data.main.rates[this.piece]);
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

	formatStat(stat) {
		return stat.value.toFixed(data.format[stat.type].decimals);
	}

	roll() {
		let values = data.sub.values;
		let rates = {};

		if(this.substats.length < Artifact.maxSubstats) {
			//if at maximum substats count, select substat already on the item
			for(let rate of Object.keys(data.sub.rates)) {
				if(rate === this.mainstat) continue;
				if(this.substats.filter(stat => stat.type === rate).length !== 0) continue;
				rates[rate] = data.sub.rates[rate];
			}
		} else {
			//if not at maximum substat count, select substat not on the item
			for(let stat of this.substats) {
				if(stat.type === this.mainstat) continue;
				rates[stat.type] = data.sub.rates[stat.type];
			}
		}
		let type = this.weightedRandom(rates);
		return {type: type, value: values[type][Math.floor(Math.random() * values[type].length)]};
	}

	/**
	 * enhances item by the specified amount of levels, will add/upgrade substats if the item reaches the required levels
	 * @param levels levels to enhance artifact by
	 */
	enhance(levels) {
		if(!levels) return;
		levels = parseInt(levels);
		if(levels + this.level > Artifact.maxLevel) return;

		for(var i = 1; i <= levels; i++){
			if((this.level + i) % Artifact.newSubstatInterval !== 0)  continue;
			this.upgrade();
		}
		this.level += levels;
	}

	/**
	 * upgrades a random substat on the item, if item does not yet have maximum substats, a new one will be added instead
	 */
	upgrade() {
		let roll = this.roll();

		let change = {type:roll.type,from:0, to:roll.value};
		
		if(this.substats.length < Artifact.maxSubstats) {
			this.substats.push(roll);
		} else {
			let stat = this.substats.filter(s => s.type === roll.type)[0];
			
			change.from = stat.value;
			change.to += stat.value;

			stat.value += roll.value;
		}
		console.log(change.type, change.from.toFixed(2), '->', change.to.toFixed(2));
	}
	
	/**
	 * string a random 36 digit number, sometimes with a 0 in front, but its a string so the 0 will still be there
	 * @returns string containg a 36 digit number
	 */
	uid() {
		return Math.random().toString(36).substr(2, 10);
	}

	/**
	 * cv formula is crit damage + crit chance multiplied by 2
	 * @returns cv of the artifact
	 */
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