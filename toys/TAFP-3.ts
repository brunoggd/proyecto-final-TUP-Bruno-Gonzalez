interface Player {
    id: number;
    name: string;
    age: number;
}

interface Match {
    match: {
        id: number;
        players: Player[];
    }
}

interface Matches {
    matches: Match[];
}

let players_array: Player[] = [];

let matches_array: Matches = {
    matches: []
};

let stages: number[] = [];

function swap(array: Player[]): Player[] {
    const copia: Player[] = [...array];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function createPlayers(players: number, players_array: Player[]): Player[] {
    for (let index = 0; index < players; index++) {
        const player: Player = {
            id: index,
            name: `Jugador ${index + 1}`,
            age: Math.floor((Math.random() * 30) + 19)
        }

        players_array.push(player);

        players_array = swap(players_array);
    }

    return players_array;
}

function createMatches(players: number): Player[] | undefined {
    players_array = createPlayers(players, players_array);

    let i: number = 0;

    if (players_array.length % 2 === 0) {
        for (let index = 0; index < players_array.length / 2; index++) {
            let matchObj: Match = {
                match: {
                    id: 0,
                    players: []
                }
            };

            const player1: Player = players_array[i];

            i++;

            const player2: Player = players_array[i];

            i++;

            matchObj.match.id = index;
            matchObj.match.players.push(player1, player2);

            matches_array.matches.push(matchObj);
        }
    } else {
        console.log('La cantidad de jugadores ingresados debe ser PAR 😡');
        return undefined;
    }

    matches_array.matches.forEach(match => {
        console.log(`Partido ${match.match.id + 1}`, match.match.players);
    });
}

function createNextStages(totalMatches: number): number[] {
    if (totalMatches % 2 != 0) {
        console.log('La cantidad total de partidos deben ser PARES 😡');
        return [];
    };

    let stages: number[] = [totalMatches];

    for (let index = 0; totalMatches > 1; index++) {
        let stage: number | null = null;

        totalMatches = totalMatches / 2;

        stage = totalMatches;

        stages.push(stage);
    }

    return stages;
}

function updateMatches(stages: number[], matches: Matches) {
    let currentMatches = matches.matches;
    let player1Won: boolean;
    let randomNumber: number;

    for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
        let value = stages[stageIndex];
        console.log(`Etapa ${stageIndex + 1} - ${value} ${value === 1 ? 'Partido' : 'Partidos'}`);
        
        const winners: Player[] = [];

        for (let matchIndex = 0; matchIndex < currentMatches.length; matchIndex++) {
            let matches_: Matches = {
                matches: currentMatches
            }

            randomNumber = Math.floor(Math.random() * 2);

            if (randomNumber === 1) {
                player1Won = true;
            } else {
                player1Won = false;
            }

            let player: Player = setMatchWinner(matches_, matchIndex, player1Won);
            
            winners.push(player);
        }

        const nextMatches: Matches = {
            matches: []
        };

        for (let index = 0; index < winners.length; index += 2) {
            let matchObj: Match = {
                match: {
                    id: 0,
                    players: []
                }
            };

            matchObj.match.id = index / 2;

            matchObj.match.players = [winners[index], winners[index + 1]];

            nextMatches.matches.push(matchObj);
        }

        currentMatches = nextMatches.matches;

        if (winners.length === 1) {
            console.log(`Campeón: ${winners[0].name}`);
        }
    }
}

function setMatchWinner(matches: Matches, matchId: number, player1Won: boolean): Player {
    const currentMatch: Match = matches.matches[matchId];

    const player1: Player = currentMatch.match.players[0];

    const player2: Player = currentMatch.match.players[1];

    let winner: Player;
    let loser: Player;

    if (player1Won) {
        currentMatch.match.players.pop();

        winner = player1;
        loser = player2;

    } else {
        currentMatch.match.players.shift();

        winner = player2;
        loser = player1;
    }

    console.log(`Ganó el [ ${winner.name} ] y perdió el [ ${loser.name} ]`);

    return winner;
}

createMatches(8);

stages = createNextStages(4);

updateMatches(stages, matches_array);