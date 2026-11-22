let modInfo = {
	name: "The Inefficient Tree",
	author: "DeFe308",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours

	allowSmall: true,
}

// Set your version in num and name
let VERSION = {
	num: "0.00001",
	name: "Test",
	pre:'',
	beta: '',
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.00001 - Test 2026/11/22</h3><br>
		- Added things in the first layer.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

function ineffExp(){
	let a = n(1)
	for(i=1; i<=4; i++){
		for(j=1; j<=5; j++){
			if(hasUpgrade('b',i*10+j)) a=a.add(layers.b.upgrades[i*10+j].ineffXP())
		}}
	if(hasUpgrade('b',31)) {a=a.sub(buyableEffect('b',11))}
	return a
}

function ineffLevel(){
	let a= ineffExp().max(1).log(2)
	return a
}

function ineffEffect(){let a=n(1).sub(ineffLevel().div(1000))
        if(ineffLevel().gte(500)) a=n(0.5).pow(ineffLevel().div(500))//pt power
        let b=n(2).pow(ineffLevel().pow(1.5))//pt div
		let c=n(0.5).pow(ineffLevel().div(100))//speed
		let d=n(1).sub(ineffLevel().div(200))
		if(ineffLevel().gte(150)) d=n(0.25).pow(ineffLevel().div(150))//BP power
		let e=n(1.5).pow(ineffLevel())//BP div
        return [a,b,c,d,e]
    }

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('b',11)) gain=gain.times(5)
	if(hasUpgrade('b',12)) gain=gain.times(5)
	if(hasUpgrade('b',13)) gain=gain.times(5)
	if(hasUpgrade('b',14)) gain=gain.times(upgradeEffect('b',14))
	if(hasUpgrade('b',21)) gain=gain.times(upgradeEffect('b',21))

	gain=gain.pow(ineffEffect()[0]).div(ineffEffect()[1])
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	devSpeed:n(1),
}}

// Display extra things at the top of the page
var displayThings = [
	function(){a='Current Inefficiency Level: '+format(ineffLevel())+'<br>(Inefficiency XP: '+format(ineffExp())+')'
		a=a+'<br>Effects: Point gain ^'+format(ineffEffect()[0],3)+' then /'+format(ineffEffect()[1])
		a=a+'<br>Game speed x'+format(ineffEffect()[2],3)
		if(hasAchievement('a',13)) a=a+'<br>Basic Point gain ^'+format(ineffEffect()[3],3)+' then /'+format(ineffEffect()[4])
		return a
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

//fast definition
function n(x){return new Decimal(x)}