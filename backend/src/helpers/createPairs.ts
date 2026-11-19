export interface JugadorInscripto {
    id_inscripcion: number;
    id_persona: number;
    nombre: string;
    apellido: string;
    email: string;
}

export interface MatchPair {
    player1: JugadorInscripto;
    player2: JugadorInscripto;
}

export function createPairs(players: JugadorInscripto[]): MatchPair[] {
    const pairs: MatchPair[] = [];

    for (let i = 0; i < players.length; i += 2) {
        pairs.push({player1: players[i], player2: players[i + 1]});
    }

    return pairs;
}