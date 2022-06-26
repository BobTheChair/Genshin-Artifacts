var container = document.getElementsByClassName('artifact-container')[0];
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
var enhancedReroll = document.getElementById("enhancedReroll");
var enhance = document.getElementById("enhance");
var number = document.getElementById("number");
var up = document.querySelector('.levelup .up')
var down = document.querySelector('.levelup .down');
var updown = document.querySelector('.levelup .updown');

var closeSettings = document.querySelector('.close-settings');
var openSettings = document.querySelector('.open-settings');
var settings = document.querySelector('.settings');

export { container,name,image,piece,mainstat,rarity,set,level,substats,reroll,enhance,enhancedReroll,number,up,down,updown,closeSettings,openSettings,settings };