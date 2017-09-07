/*jshint esversion: 6 */
/*jslint browser: true */
/* global stringToInt */
/* global replaceAll */
/*
Both races are Robot Class
*/
class Robot {
    constructor(arr) {
        //name, race, strength, intelligence, speed, endurance, rank, courage, firepower, skill
        this.name = this.cleanString(arr[0]);
        this.isAutobot = arr[1].toUpperCase();
        this.isAutobot = this.cleanString(arr[1]);
        this.isAutobot = this.isAutobot === "A";
        this.strength = stringToInt(arr[2]);
        this.intelligence = stringToInt(arr[3]);
        this.speed = stringToInt(arr[4]);
        this.endurance = stringToInt(arr[5]);
        this.rank = stringToInt(arr[6]);
        this.courage = stringToInt(arr[7]);
        this.firepower = stringToInt(arr[8]);
        this.skill = stringToInt(arr[9]);
        this.isAlive = true;
    }

    get rating() {
        return this.overallRating();
    }

    overallRating() {
        return this.strength + this.intelligence + this.speed + this.endurance + this.firepower;
    }

    cleanString(str) {
        return str.replace(/^\s+|\s+$/g, ""); //remove leading and trailing spaces  
    }
}

/*
Combatans include both races
*/
class Combatants {

    constructor(autobotName, decepticonName) {
        this.decepticons = [];
        this.decepticons.wins = 0;
        this.decepticons.maxRank = 0;
        this.decepticons.leaderName = "";
        this.autobots = [];
        this.autobots.maxRank = 0;
        this.autobots.leaderName = "";
        this.autobots.wins = 0;
        this.autobotName = autobotName;
        this.decepticonName = decepticonName;
    }

    add(newRobot) {
        if (newRobot.isAutobot) {
            this.autobots.push(newRobot);
            if (newRobot.rank > this.autobots.maxRank) {
                this.autobots.leaderName = newRobot.name; //used in the results
                this.autobots.maxRank = newRobot.rank;
            }
        } else {
            this.decepticons.push(newRobot);
            if (newRobot.rank > this.decepticons.maxRank) {
                this.decepticons.leaderName = newRobot.name;
                this.decepticons.maxRank = newRobot.rank;
            }
        }
    }

    compareByRank(a, b) { //custom sort by rank to determine fight order
        if (a.rank === b.rank) {
            return 0;
        } else {
            return (a.rank > b.rank) ? -1 : 1;
        }
    }

    sort() {
        this.decepticons.sort(this.compareByRank);
        this.autobots.sort(this.compareByRank);
    }

}


class Battle {
    constructor(army) {
        this.army = army;
        this.numBattles = 0;
        this.winningTeam = "";
        this.army.autobots.wins = 0;
        this.army.decepticons.wins = 0;
        this.everybodyDied = false;
    }

    fightAll() {
        var lenD = this.army.decepticons.length;
        var lenA = this.army.autobots.length;
        var battleNum = Math.min(lenD, lenA); // if lengths are different, excess robots don't fight
        document.getElementById("results6").innerHTML = '';
        for (var i = 0; i < battleNum; i++) {
            this.fightOne(this.army.decepticons[i], this.army.autobots[i]);
            // record result:
            if (this.army.decepticons[i].isAlive && !this.army.autobots[i].isAlive) {
                this.army.decepticons.wins++;
                document.getElementById("results6").innerHTML += this.army.decepticons[i].name + " " + this.army.decepticons[i].rating + " defeats " + this.army.autobots[i].name + " " + this.army.autobots[i].rating + "<br>";
            } else if (!this.army.decepticons[i].isAlive && this.army.autobots[i].isAlive) {
                this.army.autobots.wins++;
                document.getElementById("results6").innerHTML += this.army.autobots[i].name + " " + this.army.autobots[i].rating + " defeats " + this.army.decepticons[i].name + " " + this.army.decepticons[i].rating + "<br>";

            }
        }
    }

    fightOne(decepticon, autobot) { //as per spec
        if (this.specialRulesGameOver(decepticon, autobot))
            return;
        var courage = decepticon.courage - autobot.courage;
        var strength = decepticon.strength - autobot.strength;
        this.numBattles++;
        if (courage >= 4 && strength >= 3) {
            autobot.isAlive = false;
            document.getElementById("results6").innerHTML += "Courage/Strength win! ";
            return; //we assume if you run away you are a loser and eliminated 
        } else if (courage <= -4 && strength <= -3) {
            decepticon.isAlive = false;
            document.getElementById("results6").innerHTML += "Courage/Strength win! ";
            return; //we assume if you run away you are a loser and eliminated           
        }
        var skill = decepticon.skill - autobot.skill;
        if (skill >= 3) {
            autobot.isAlive = false;
            document.getElementById("results6").innerHTML += "Skill win! ";
            return;
        } else if (skill <= -3) {
            decepticon.isAlive = false;
            document.getElementById("results6").innerHTML += "Skill win! ";
            return;
        }
        var overall = decepticon.rating - autobot.rating;
        if (overall > 0) {
            autobot.isAlive = false;
            return;
        }
        if (overall < 0) {
            decepticon.isAlive = false;
            return;
        }
        //it is a draw
        autobot.isAlive = false; //draw = both die
        decepticon.isAlive = false;
        document.getElementById("results6").innerHTML += "Draw! ";
        return;

    }

    specialRulesGameOver(decepticon, autobot) {
        if ((decepticon.name === "Predaking") && (autobot.name === "Optimus Prime")) { //all competitors destroyed
            this.numBattles = 1; //an assumption, hard to know how many battles there were
            this.killAll();
            return true;
        }
        if ((autobot.name == "Optimus Prime")) { //we assume he can't be a Decepticon
            decepticon.isAlive = false;
            document.getElementById("results6").innerHTML += "Special win ";
            //document.getElementById("results6").innerHTML += autobot.name + " defeats " + decepticon.name + "<br>";
        }
        if ((decepticon.name == "Predaking")) { //we assume he can't be an Autobot 
            autobot.isAlive = false;
            document.getElementById("results6").innerHTML += "Special win ";
            //document.getElementById("results6").innerHTML += decepticon.name + " defeats " + autobot.name + "<br>";
        }
        return false;

    }

    killAll() {
        var lenD = this.army.decepticons.length;
        for (var i = 0; i < lenD; i++)
            this.army.decepticons[i].isAlive = false;

        var lenA = this.army.autobots.length;
        for (i = 0; i < lenA; i++)
            this.army.autobots[i].isAlive = false;
        document.getElementById("results6").innerHTML += "Everybody dies ";
        this.everybodyDied = false;
    }

    result() {
        var winningTeam;
        var losingTeam;
        var survivors = [];
        var leader;
        var len, i;
        if (this.army.autobots.wins < this.army.decepticons.wins) {
            winningTeam = this.army.decepticonName;
            losingTeam = this.army.autobotName;
            leader = this.army.decepticons.leaderName;
            len = this.army.autobots.length;
            for (i = 0; i < len; i++) { //Autobot survivors
                if (this.army.autobots[i].isAlive)
                    survivors.push(this.army.autobots[i].name);
            }
        } else if (this.army.autobots.wins > this.army.decepticons.wins) {
            winningTeam = this.army.autobotName;
            losingTeam = this.army.decepticonName;
            leader = this.army.autobots.leaderName;
            len = this.army.decepticons.length;
            for (i = 0; i < len; i++) { //Decepticon survivors
                if (this.army.decepticons[i].isAlive)
                    survivors.push(this.army.decepticons[i].name);
            }

        } else {
            winningTeam = "None";
            if (this.army.decepticons.wins > 0) { //score draw
                leader = "Draw";
                losingTeam = "No Losers";
            } else if (this.everybodyDied) {
                losingTeam = "None";
                leader = "All are destroyed";
            } else { //no score draw
                losingTeam = "None";
                leader = "No Fights occurred";
            }
        }

        var survivorStr;
        if (survivors.length === 0) {
            survivorStr = "None";
        } else {
            len = survivors.length;
            for (i = 0; i < len; i++) {
                survivorStr = survivors[i];
                if (i != len - 1) {
                    survivorStr += ", ";
                }
            }
        }

        if (this.numBattles == 1)
            document.getElementById("results1").innerHTML = "1 battle";
        else
            document.getElementById("results1").innerHTML = this.numBattles + " battles";
        document.getElementById("results2").innerHTML = "WinningTeam (" + winningTeam + "): " + leader;
        document.getElementById("results3").innerHTML = "Survivors from the losing team (" + losingTeam + ") " + survivorStr;

    }
}

function startBattle() {
    var robotStringArray = document.getElementById('myTextarea');
    robotStringArray = robotStringArray.value.split('\n');

    var len = robotStringArray.length;
    var myCombatants = new Combatants("Autobots", "Decepticons");

    for (var i = 0; i < len; i++) {
        var thisRobot = robotStringArray[i];
        thisRobot = replaceAll(thisRobot, ":", ","); //as per example
        thisRobot = thisRobot.split(',');

        if (thisRobot.length == 10) {
            var robo = new Robot(thisRobot);
            myCombatants.add(robo);
        }
    }
    myCombatants.sort();
    var myBattle = new Battle(myCombatants);
    myBattle.fightAll();
    myBattle.result();
}

function moreInfo() {
    if (document.getElementById('rollCallCheck').checked) {
        document.getElementById('results6').style.display = 'block';
    } else {
        document.getElementById('results6').style.display = 'none';
    }
}
