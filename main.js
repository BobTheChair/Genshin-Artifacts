import * as elems from './elems.js';
import * as settings from './settings.js';
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

window.artifacts = [];

function newArtifact() {
	let opts = settings.get();
	if(elems.enhancedReroll.checked) opts.level = elems.number.value - 0;

	console.log(opts)
	window.art = new Artifact(opts);
	window.art.render();
	window.artifacts.push(window.art);
}

elems.reroll.addEventListener('click', newArtifact)

newArtifact();