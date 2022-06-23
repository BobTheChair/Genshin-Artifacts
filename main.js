import * as data from './data.js';
import * as elems from './elems.js';
import { Artifact } from './artifact.js';


/**
 * enfoces min/max value for manual input on a number input
 */
function numberChange(t) {
	let min = t.getAttribute('min');
	let max = t.getAttribute('max');
	console.log(min, max)
	if(t.value - 0 < min - 0) t.value = min;
	if(t.value - 0 > max - 0) t.value = max;
}

elems.number.addEventListener('change', e => numberChange(e.target));

elems.updown.addEventListener('click', e => {
	if(e.target !== elems.up && e.target !== elems.down) return;
	elems.number.value = elems.number.value - (e.target === elems.up ? -1 : 1);

	//trigger change event
	numberChange(elems.number);
});

elems.enhance.addEventListener('click', e => {
	window.art.enhance(elems.number.value - 0);
	window.art.render();
});

elems.reroll.addEventListener('click', e => {
	let opts = {};
	if(elems.enhancedReroll.checked) opts.level = elems.number.value - 0;
	for(let [setting, input] of Object.entries(elems.settings)) {
		let val = input.value(input.elem);
		opts[setting] = !val || val === 'random' ? undefined : val;
	}
	
	console.log(opts)
	window.art = new Artifact(opts);
	window.art.render();
});

elems.closeSettings.addEventListener('click', e => {
	document.querySelector('.settings').setAttribute('opened', false);
	//elems.openSettings.style.display = 'block';
});
elems.openSettings.addEventListener('click', e => {
	document.querySelector('.settings').setAttribute('opened', true);
	//elems.openSettings.style.display = 'none';
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

populateSelect(elems.settings.set.elem, Object.keys(data.artifacts), key => key, set => data.artifacts[set].name);
populateSelect(elems.settings.piece.elem, Object.keys(data.main.rates), piece => piece, piece => data.en[piece]);

//populateSelect(elems.settings.rarity.elem, [5,4,3,2,1], rarity => rarity, rarity => rarity);
populateSelect(elems.settings.mainstat.elem, Object.keys(data.main.values['5']), mainstat => mainstat, mainstat => data.en[mainstat]);

window.art = new Artifact();
window.art.render();
