interface Player {
    id: number;
    name: string;
    age: number;
}

let players_array: Player[] = [];
const matches_array: any[] = [];

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

function createMatches(players: number) {
    players_array = createPlayers(players, players_array);
    
    let i: number = 0;

    if (players_array.length % 2 === 0) {
        for (let index = 0; index < players_array.length / 2; index++) {
            let match: Player[] = [];

            const player1: Player = players_array[i];

            i++;

            const player2: Player = players_array[i];

            i++;

            match.push(player1, player2);

            matches_array.push(match);
        }
    } else {
        console.log('La cantidad de jugadores ingresados debe ser PAR 😡')
        return;
    }

    console.log(matches_array);
}

function createNextStage(totalMatches: number, matches: Player[]) {
    for (let index = 0; index < totalMatches; index++) {
        if(totalMatches % 2 === 0){
            totalMatches = totalMatches / 2;
            matches = matches.slice(0, totalMatches);
        }

        console.log(totalMatches, matches);
    }
}

function setMatchWinners(idPlayer1: number, idPlayer2: number,matchId: number,player1Won: boolean, player2Won: boolean, matches: any[]) {
    const player1: Player = matches[matchId][idPlayer1];
    const player2: Player = matches[matchId][idPlayer2];

    console.log(player1, player2);

    // ¿Qué quiero que haga esta función?

    // Quiero que se pueda establecer el ganador de un partido, modificando el partido eliminando al perdedor y creando
    // un partido de la siguiente etapa con los ganadores, anexandolo a la lista de partidos totales de la siguiente etapa
}

function pushMatchWinners() {

}

function showMatchIds(matches: any[]): void {
    for (let index = matches.length - 1; index > 0; index--) {
        console.log(`Indice: ${index}`, matches[index]);
    }
}

console.log('========== PARTIDOS TOTALES ===============');
createMatches(8);
console.log('===========================================');

console.log('========== INSTANCIAS SIGUIENTES ==========');
createNextStage(4, matches_array);
console.log('===========================================');

// showMatchIds(matches_array);

// console.log(matches_array[0][0]);

// // Número entre 0 y 1
// Math.random()

// // Número entre 0 y 10
// Math.random() * 10

// // Número ENTERO entre 0 y 10
// Math.floor(Math.random() * 10)


// ORDEN PARA CREAR UN AVANCE DE ETAPAS CORRECTO (PORQUE LA CREACION DE PARTIDOS YA ESTA)
// FUNCION PARA DETERMINAR UN GANADOR
// CREAR LOS PARTIDOS DE LAS SIGUIENTES ETAPAS CON LOS JUGADORES QUE GANARON SUS PARTIDOS