import * as Artifact from './artifact.js';
import * as elems from './elems.js';

window.onload = e => {

	/**
	 * enfoces min/max value for manual input on a number input
	 */
	function numberChange(target) {
		let min = target.getAttribute('min');
		let max = target.getAttribute('max');
		if(target.value - 0 < min - 0) target.value = min;
		if(target.value - 0 > max - 0) target.value = max;
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
	});

	setTimeout(()=>{
		window.art = new Artifact.Artifact();
		console.log(window.art);
		window.art.render();
	}, 500);
}