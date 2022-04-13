import * as Artifact from './artifact.js';
import * as elems from './elems.js';

window.Artifact = Artifact.Artifact;

window.onload = e => {

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
		opts.set = 'blizzardstrayer';
		window.art = new Artifact.Artifact(opts);
		window.art.render();
	});

	setTimeout(()=>{
		window.art = new Artifact.Artifact();
		window.art.render();
	}, 500);
}