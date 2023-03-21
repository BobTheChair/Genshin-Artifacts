let data = await fetch('data.json').then(data=>data.json());
let format = data.format;
let main = data.main;
let sub = data.sub;
let en = data.en;
let enShort = data.enShort;
let artifacts = await fetch('artifacts.json').then(data=>data.json());

export {artifacts, format, main, sub, en, enShort}