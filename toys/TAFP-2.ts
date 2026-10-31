interface Player {
    id: number;
    name: string;
    age: number;
}

interface Match {
    match: Player[] | undefined;
}

interface Matches {
    matches: Match[]
}

let players_array: Player[] = [];

let matches_array: Matches = {
    matches: [
        {
            match: [
                { id: 0, name: 'Jugador 1', age: 19 },
                { id: 1, name: 'Jugador 2', age: 19 }
            ]
        },
        {
            match: [
                { id: 2, name: 'Jugador 3', age: 19 },
                { id: 3, name: 'Jugador 4', age: 19 }
            ]
        },
        {
            match: [
                { id: 4, name: 'Jugador 5', age: 19 },
                { id: 5, name: 'Jugador 6', age: 19 }
            ]
        },
        {
            match: [
                { id: 6, name: 'Jugador 7', age: 19 },
                { id: 7, name: 'Jugador 8', age: 19 }
            ]
        }
    ]
};

let stages: number[] | null = [];

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
                match: []
            }

            const player1: Player = players_array[i];

            i++;

            const player2: Player = players_array[i];

            i++;

            matchObj.match?.push(player1, player2);

            matches_array.matches.push(matchObj);
        }
    } else {
        console.log('La cantidad de jugadores ingresados debe ser PAR 😡')
        return undefined;
    }

    console.log(matches_array.matches);
    matches_array.matches.forEach(match => {
        console.log(`Partido:`, match);
    });
}

function createNextStages(totalMatches: number): number[] | null {
    if (totalMatches % 2 != 0) {
        console.log('La cantidad total de partidos deben ser PARES 😡');
        return null;
    };

    let stages: number[] = [];

    for (let index = 0; totalMatches > 1; index++) {
        let stage: number | null = null;
        
        totalMatches = totalMatches / 2;

        stage = totalMatches;
        
        stages.push(stage);
    }

    return stages;
}

function updateMatches(stages: number[] | null, matches: Matches) {
    matches.matches.forEach(match => {
        setMatchWinner(matches, 1, true);
    });
}

function setMatchWinner(matches: Matches, matchId: number, player1Won: boolean) {
    const currentMatch: Match = matches.matches[matchId];

    const player1: Player | undefined = currentMatch.match?.at(0);

    const player2: Player | undefined = currentMatch.match?.at(1);

    let winner: Player | undefined;
    let loser: Player | undefined;

    if (player1Won) {
        currentMatch.match?.pop();

        winner = player1;
        loser = player2;
    } else {
        currentMatch.match?.shift();

        winner = player2;
        loser = player1;
    }

    console.log('Ganador:', winner);
    console.log('Perdedor:', loser);
}

function showMatchIds(matches: Matches): void {
    for (let index = 0; index < matches.matches.length; index++) {
        console.log(`Indice: ${index}`, matches.matches[index]);
    }
}

// console.log('========== PARTIDOS TOTALES ===============');
// createMatches(8);
// console.log('===========================================');

stages = createNextStages(4);

console.log('========== INSTANCIAS SIGUIENTES ==========');
stages?.forEach(stage => {
    console.log(stage);
})
console.log('===========================================');

// matches_array.matches.forEach(match => {
//     console.log(match);
// })

updateMatches(stages, matches_array);

// showMatchIds(matches_array);

// console.log(matches_array.matches[0]);

// matches_array.matches.forEach(match => {
//     console.log(match);
// });

// setMatchWinner(matches_array, 0, false);

// console.log(matches_array.matches[0].match?.at(0));