export interface ResultadoSet {
    numero_set: number;
    games_jugador1: number;
    games_jugador2: number;
}

function ganadorDelSet(set: ResultadoSet): 1 | 2 | null {
    const g1 = set.games_jugador1;
    const g2 = set.games_jugador2;

    if (g1 === 7 && g2 === 6) return 1;
    if (g2 === 7 && g1 === 6) return 2;

    if (g1 >= 6 && g1 - g2 >= 2) return 1;
    if (g2 >= 6 && g2 - g1 >= 2) return 2;

    return null;
}

export function determinarGanadorPartido(sets: ResultadoSet[], idJugador1: number, idJugador2: number): number | null {
    let setsJugador1 = 0;
    let setsJugador2 = 0;

    const ordenados = [...sets].sort((a, b) => a.numero_set - b.numero_set);

    for (const set of ordenados) {
        if (setsJugador1 === 2 || setsJugador2 === 2) {
            break
        };

        const ganador = ganadorDelSet(set);

        if (ganador === 1) {
            setsJugador1++;
        }

        if (ganador === 2) {
            setsJugador2++;
        }
    }

    if (setsJugador1 === 2) {
        return idJugador1;
    }
    
    if (setsJugador2 === 2) {
        return idJugador2;
    }

    return null;
}