export var container = document.getElementsByClassName('container')[0];
export var name = container.getElementsByClassName('name')[0];
export var image = container.getElementsByClassName('image')[0];
export var piece = container.getElementsByClassName('piece')[0];
export var mainstat = {
	type: container.querySelector('.mainstat .type'),
	value: container.querySelector('.mainstat .value')
};
export var rarity = container.getElementsByClassName('rarity')[0];
export var set = container.getElementsByClassName('set')[0];
export var level = container.getElementsByClassName('level')[0];
export var substats = container.getElementsByClassName('substats')[0];

export var enhance = document.getElementById("enhance");
export var number = document.getElementById("number");
export var up = document.querySelector('.levelup .up')
export var down = document.querySelector('.levelup .down');
export var updown = document.querySelector('.levelup .updown');