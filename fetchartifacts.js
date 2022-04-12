const genshindb = require('genshin-db');
const fs = require('fs')

fs.readFile('artifacts.json', 'utf8' , (err, data) => {
	if (err) { console.error(err); return; }
	/*
	https://github.com/theBowja/genshin-db/blob/main/src/data/url/artifacts.json
	*/
	var sets = [
		"adventurer",
		"archaicpetra",
		"berserker",
		"blizzardstrayer",
		"bloodstainedchivalry",
		"braveheart",
		"crimsonwitchofflames",
		"defenderswill",
		"gambler",
		"glacierandsnowfield",
		"gladiatorsfinale",
		"heartofdepth",
		"instructor",
		"lavawalker",
		"luckydog",
		"maidenbeloved",
		"martialartist",
		"noblesseoblige",
		"prayersfordestiny",
		"prayersforillumination",
		"prayersforwisdom",
		"prayerstospringtime",
		"prayerstothefirmament",
		"resolutionofsojourner",
		"retracingbolide",
		"scholar",
		"theexile",
		"thunderingfury",
		"thundersoother",
		"tinymiracle",
		"travelingdoctor",
		"viridescentvenerer",
		"wandererstroupe",
		"paleflame",
		"tenacityofthemillelith",
		"emblemofseveredfate",
		"shimenawasreminiscence",
		"huskofopulentdreams",
		"oceanhuedclam"
	];
	let artifacts = {};
	for(let set of sets) {
		artifacts[set] = genshindb.artifacts(set);
	}
	fs.writeFile('artifacts.json', JSON.stringify(artifacts), ()=>{});
})

