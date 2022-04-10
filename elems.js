var container = document.getElementsByClassName('container')[0];
var name = container.getElementsByClassName('name')[0];
var image = container.getElementsByClassName('image')[0];
var piece = container.getElementsByClassName('piece')[0];
var mainstat = {
	type: container.querySelector('.mainstat .type'),
	value: container.querySelector('.mainstat .value')
};
var rarity = container.getElementsByClassName('rarity')[0];
var set = container.getElementsByClassName('set')[0];
var level = container.getElementsByClassName('level')[0];
var substats = container.getElementsByClassName('substats')[0];
var reroll = document.getElementById("reroll");
var enhance = document.getElementById("enhance");
var number = document.getElementById("number");
var up = document.querySelector('.levelup .up')
var down = document.querySelector('.levelup .down');
var updown = document.querySelector('.levelup .updown');

export { container,name,image,piece,mainstat,rarity,set,level,substats,reroll,enhance,number,up,down,updown };