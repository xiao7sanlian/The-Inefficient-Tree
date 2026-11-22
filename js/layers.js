addLayer("b", {
    name: "basic", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        u32time:n(0),
    }},
    color: "#1cf7f7",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Basic Points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if(hasUpgrade('b',32)) mult=mult.times(5)
        if(hasUpgrade('b',33)) mult=mult.times(upgradeEffect('b',33))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let a= new Decimal(1)
        if(hasAchievement('a',13)) a=a.times(ineffEffect()[3])
        return a
    },
    directMult(){
        let a=n(1)
        if(hasAchievement('a',13)) a=a.div(ineffEffect()[4])
        return a
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for Basic Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff){
        player.devSpeed=n(1-getClickableState(this.layer,11)).times(ineffEffect()[2])
        if(hasUpgrade('b',32)) player.b.u32time=player.b.u32time.add(diff)
    },
    passiveGeneration(){let a=n(0)
        if(hasUpgrade('b',22)) a=n(1)
        return a
    },
    clickables:{
        11: {
            title() {a="Pause"
                return a
            },
            display() {a="Click to Pause, Click Again to Resume"
                return a
            },
            canClick() {return true},
            onClick() {setClickableState(this.layer,this.id,1-getClickableState(this.layer,this.id))
            },
        },
        12: {
            title() {a="Upgrade Reset"
                return a
            },
            display() {a="Reset all upgrades in this layer, but do a reset of this layer withour reward"
                return a},
            unlocked(){return true},
            canClick() {return player.b.upgrades.length>0},
            onClick() {if(confirm("Are you sure you want to reset all upgrades in this layer?")){player.b.upgrades=[]
                player.b.u32time=n(0)
                doReset(this.layer,true)}
            },
        },
    },
    upgrades:{
        11: {title:'Many Points',
            description(){a='5x point gain<br>+'+format(this.ineffXP())+' Ineff XP when bought'
                return a
            },
            ineffXP(){a=n(1)
                return a
            },
            cost:n(1),
        },
        12: {title:'Another Point Boost',
            description(){a='5x point gain<br>+'+format(this.ineffXP())+' Ineff XP when bought'
                return a
            },
            ineffXP(){a=n(1)
                return a
            },
            cost:n(3),
        },
        13: {title:'Another Another Point Boost',
            description(){a='5x point gain<br>+'+format(this.ineffXP())+' Ineff XP when bought'
                return a
            },
            ineffXP(){a=n(1)
                return a
            },
            cost:n(5),
        },
        14: {title:'Dynamic Boost',
            description(){a='Boost point gain based on Basic Points<br>+'+format(this.ineffXP())+' Ineff XP when bought (based on points)'
                return a
            },
            effect(){a=player.b.points.add(1).pow(0.5)
                return a
            },
            effectDisplay(){a=format(this.effect())+'x'
                return a
            },
            ineffXP(){a=player.points.add(1).log(10)
                return a
            },
            unlocked(){return hasUpgrade('b',11)&&hasUpgrade('b',12)&&hasUpgrade('b',13)},
            cost:n(10),
        },
        21: {title:'Self-Boost',
            description(){a='Boost point gain based on points.<br>+'+format(this.ineffXP())+' Ineff XP when bought (based on Basic Points)'
                return a
            },
            effect(){a=player.points.add(1).pow(0.2)
                return a
            },
            effectDisplay(){a=format(this.effect())+'x'
                return a
            },
            ineffXP(){a=player.b.points.add(1).log(10)
                return a
            },
            unlocked(){return hasUpgrade('b',14)},
            cost:n(15),
        },
        22: {title:'Passive Generation',
            description(){a='Gain 100% of Basic Points on reset every second.<br>+'+format(this.ineffXP())+' Ineff XP when bought'
                return a
            },
            ineffXP(){a=n(3)
                return a
            },
            unlocked(){return hasUpgrade('b',14)},
            cost:n(35),
        },
        23: {title:'Anti-Inefficiency',
            description(){a=format(this.ineffXP())+' Ineff XP when bought'
                return a
            },
            ineffXP(){a=n(-2)
                return a
            },
            unlocked(){return hasUpgrade('b',14)},
            cost:n(50),
        },
        24: {title:'Anti-Inefficiency II',
            description(){a=format(this.ineffXP())+' Ineff XP when bought (based on upgrades bought in this layer)'
                return a
            },
            ineffXP(){a=n(player.b.upgrades.length).times(0.1).times(-1)
                return a
            },
            unlocked(){return hasUpgrade('b',21)&&hasUpgrade('b',22)&&hasUpgrade('b',23)},
            cost:n(120),
        },
        31: {title:'True Anti-Inefficiency',
            description(){a='Unlock a buyable.<br>+'+format(this.ineffXP())+' Ineff XP when bought'
                return a
            },
            ineffXP(){a=n(3)
                return a
            },
            unlocked(){return hasUpgrade('b',24)},
            cost:n(150),
        },
        32: {title:'Accumulation',
            description(){a='5x Basic Point gain<br>+'+format(this.ineffXP())+' Ineff XP when bought (based on time after buying this upgrade)'
                return a
            },
            ineffXP(){a=player.b.u32time.times(0.015)
                return a
            },
            unlocked(){return hasUpgrade('b',24)},
            cost:n(200),
        },
        33: {title:'Anti-Boost',
            description(){a='Boost Basic Point gain based on points.<br>+'+format(this.ineffXP())+' Ineff XP when bought'
                return a
            },
            effect(){a=player.points.add(1).pow(0.1)
                return a
            },
            effectDisplay(){a=format(this.effect())+'x'
                return a
            },
            ineffXP(){a=n(2.5)
                return a
            },
            unlocked(){return hasUpgrade('b',24)},
            cost:n(550),
        },
        34: {title:'The End of Test',
            description(){a='Beat the game.<br>+'+format(this.ineffXP())+' Ineff XP when bought (equal to points)'
                return a
            },
            ineffXP(){a=player.points
                return a
            },
            unlocked(){return hasUpgrade('b',31)&&hasUpgrade('b',32)&&hasUpgrade('b',33)},
            cost:n(1000),
        },
    },
    buyables: {
        11: {
            title(){text = 'Inefficiency Reducer'
                text=text+'('+formatWhole(getBuyableAmount(this.layer, this.id))
                text=text+')'
                return text
            },
            cost(x) { a= new Decimal(10).pow(x)
                    return a
             },
             base(){let a=n(1)
                return a
             },
            effect(x) {return this.base().times(x)},
            display() {let a='-'+format(this.base())+'x'+format(getBuyableAmount(this.layer, this.id),0)+'='+format(this.effect())+' Ineff XP'
                a=a+'<br>Cost: '+format(this.cost())+' points'
            return a },
            unlocked() {return hasUpgrade('b',31)},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
					if (!this.canAfford()) return;
					let target = tempBuy.plus(1).log(10).add(1).max(0).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
			},
        },
    },
})

addLayer("a", {
    name: "Achievement", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f2ff00",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "achievements", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    update(diff){player.a.points = n(player.a.achievements.length)},
    tabFormat: [
    "main-display",
    "achievements"
    ],
    achievements: {
    11: {
        name: "First Inefficiency",
        tooltip(){a='Reach Inefficiency Level 1.'
            return a
        },
        done(){return ineffLevel().gte(1)},
        textStyle: {'color': '#ffe125'},
    },
    12: {
        name: "Triple Inefficiency",
        tooltip(){a='Reach Inefficiency Level 3.'
            return a
        },
        done(){return ineffLevel().gte(3)},
        textStyle: {'color': '#ffe125'},
    },
    13: {
        name: "Accumulation",
        tooltip(){a='Buy the "Accumulation" upgrade.<br>Penalty: A new effect of Inefficiency.'
            return a
        },
        done(){return hasUpgrade('b',32)},
        textStyle: {'color': '#ff2525'},
    },
    },
})