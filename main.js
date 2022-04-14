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
		opts[setting] = input.value;
	}
	if(elems.settings.set.value);
	window.art = new Artifact(opts);
	window.art.render();
});


for(let [key,set] of Object.entries(data.artifacts)) {
	elems.settings.set.appendChild(new Option(set.name, key))
}
for(let piece of Object.keys(data.main.rates)) {
	elems.settings.piece.appendChild(new Option(data.en[piece], piece))
}


window.art = new Artifact();
window.art.render();
