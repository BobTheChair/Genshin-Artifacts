import * as data from './data.js';
import * as elems from './elems.js';
import * as settings from './settings.js';
import { Artifact } from './artifact.js';


/**
 * enfoces min/max value for manual input on a number input
 */
function numberChange(t) {
	let min = t.getAttribute('min');
	let max = t.getAttribute('max');
	//console.log(min, max)
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

	let elem = elems.artifacts.querySelector('[artifact="'+window.art.id+'"]')
	
	elem.innerHTML = '<span class="delete material-icons-round">delete</span>' + window.art.getShortText();
	
	sessionStorage.setItem('artifacts', JSON.stringify(window.artifacts));
});

elems.artifacts.addEventListener('click', e => {
	if(e.target instanceof HTMLElement) {
		if(e.target.className.split(' ').indexOf('delete') > -1) {
			deleteArtifact(e.target.parentElement.getAttribute('artifact'));
		} else if(e.target.getAttribute('artifact')) {
			selectArtifact(e.target.getAttribute('artifact'))
		}
	}
})

function addToList(artifact) {
	let elem = document.createElement('div');
	elem.setAttribute('artifact', artifact.id);
	elem.innerHTML = '<span class="delete material-icons-round">delete</span>' + artifact.getShortText();
	elems.artifacts.appendChild(elem);

}
window.artifacts = {};
function getStorage() {
	let storage = sessionStorage.getItem('artifacts');
	if(storage) {
		let artifacts = {}; 
		for(var obj of Object.values(JSON.parse(storage))) {
			let artifact = new Artifact(obj);
			artifacts[artifact.id] = artifact;
			addToList(artifact);
		}
		return artifacts;
	}
	return {};
}
window.artifacts = getStorage();

function newArtifact() {
	let opts = settings.get();
	if(elems.enhancedReroll.checked) opts.level = elems.number.value - 0;

	window.art = new Artifact(opts);
	window.art.render();

	window.artifacts[window.art.id] = window.art;
	sessionStorage.setItem('artifacts', JSON.stringify(window.artifacts));

	addToList(window.art);
}

elems.reroll.addEventListener('click', newArtifact)

newArtifact();

function selectArtifact(key) {
	window.art = window.artifacts[key];

	window.art.render();
}
window.selectArtifact = selectArtifact;

function deleteArtifact(key) {
	
	console.log(key, window.artifacts[key] !== undefined);
	if(window.artifacts[key] !== undefined)	delete window.artifacts[key];
	elems.artifacts.querySelector('[artifact="'+key+'"]').remove();
	sessionStorage.setItem('artifacts', JSON.stringify(window.artifacts))
}