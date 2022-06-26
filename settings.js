import * as data from './data.js';
import * as elems from './elems.js';

var settings = {
	set: {
		elem: document.querySelector('.setting .set'), 
		value: elem => elem.querySelector('.radios :checked').id.split('-')[1]
	},
	piece: {
		elem: document.querySelector('.setting .piece'),
		value: elem => elem.querySelector('.radios :checked').id.split('-')[1]
	},
	/*rarity: {
		elem: document.querySelector('.setting .rarity'),
		value: elem => elem.querySelector('.radios :checked').id.split('-')[1]
	},*/
	mainstat: {
		elem: document.querySelector('.setting .mainstat'),
		value: elem => elem.querySelector('.radios :checked').id.replace('mainstat-', '')
	}
}


elems.closeSettings.addEventListener('click', e => {
	elems.settings.setAttribute('opened', false);
});
elems.openSettings.addEventListener('click', e => {
	elems.settings.setAttribute('opened', true);
});

function populateSelect(elem, content, value, text) {
	console.log(elem)
	let ul = elem.querySelector('ul');
	let radios = elem.querySelector('.radios');
	let name = radios.querySelector('input').getAttribute('name');
	for(let c of content) {

		let radio = document.createElement('input');
		radio.setAttribute('type', 'radio');
		radio.setAttribute('name', name);
		radio.setAttribute('title', text(c));
		radio.id = name + '-' + value(c);

		radios.appendChild(radio);
		let label = document.createElement('label');
		let li = document.createElement('li');;
		li.innerText = text(c),
		label.setAttribute('for', name + '-' + value(c))
		label.appendChild(li)
		ul.appendChild(label);
	}
}

populateSelect(settings.set.elem, Object.keys(data.artifacts), key => key, set => data.artifacts[set].name);
populateSelect(settings.piece.elem, Object.keys(data.main.rates), piece => piece, piece => data.en[piece]);

//populateSelect(elems.settings.rarity.elem, [5,4,3,2,1], rarity => rarity, rarity => rarity);
populateSelect(settings.mainstat.elem, Object.keys(data.main.values['5']), mainstat => mainstat, mainstat => data.en[mainstat]);


export {settings}