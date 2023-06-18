/* Patron Modulo */
// bloquear el codigo

const miModulo = ( () => {
    'use strick'; // se pone jodido JS con tu codigo

    let deck = [];
    const types = ['C','D','H','S'],
          specials = ['A','J','Q','K'];
    let puntosJugadores = [];
    
    /* Referencias del html */
    const btnPedir = document.querySelector('#btnPedir'),
          btnStop = document.querySelector('#btnStop'),
          btnNew = document.querySelector('#btnNew');
          
    const divCartas = document.querySelectorAll ('.divCartas'),
          puntosHtml = document.querySelectorAll('small');
    
    /* Funciones */
    const inicializaGame = ( numPlayers = 2 ) => { // por defecto, la cantidad de jugadores es 2
        deck = crearDeck();
        puntosJugadores = [];
        for ( let i=0; i<numPlayers; i++ ) {
            puntosJugadores.push(0);
        }
        console.clear (); // limpia la consola
        puntosHtml.forEach( elem => elem.innerText=0 );
        divCartas.forEach( elem => elem.innerHTML='' );
        btnPedir.disabled = false;
        btnStop.disabled = false;
    }

    const crearDeck = () => {
        deck = [];  
        for ( let i=2; i<=10; i++ ) { // las cartas arrancan en 2 hasta 10
            for ( let type of types ) {
                deck.push ( i + type );
            }
        } 
        for ( let special of specials ) {
            for ( let type of types ) {
                deck.push ( special + type );
            }
        }
        return _.shuffle( deck );; // usa la libreria underscore
    }
    
    const pedirCarta = () => {
        // al pedir, la carta debe salir del deck
        // debo asegurarme que haya cartas en el deck
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        } // luego de esto, el programa deja de ejecutarse
        return deck.pop (); // remueve el ultimo elemento del array y lo regresa
    }
    
    const valorCarta = ( carta ) => {
        // 1er paso: extraer el 2 del 2C, por ejemplo
        const valor = carta.substring(0,carta.length-1); // siempre le quiero sacar la letra
        return ( isNaN (valor) ) ? // funcion de JS, isNotANumber
                ( valor === 'A' ) ? 11 : 10
                : valor * 1; // debo transformar el valor de string a number
    }
    
    // turno: 0 = primer jugador
    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHtml[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = ( carta, turno ) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartas[turno].append( imgCarta );
    }

    const determinarWinner = () => {
        const [ puntosMinimos, puntosComputer ] = puntosJugadores;
    // para que las alertas aparezcan en el momento correcto: (JS no es multihilo)
        setTimeout ( () => {
            if ( puntosComputer === puntosMinimos ) {
                alert ('Nadie ganó :(');
            } else if ( puntosMinimos > 21 ) {
                alert ('Perdiste, pelotudo!');
            } else if ( puntosComputer > 21 ) {
                alert ('Ganaste! :)');
            } else {
                alert ('Perdiste, pelotudo!');
            }
        }, 100); // callback: funcion que es argumento
    }

    const turnoComputer = ( puntosMinimos ) => {
        
        let puntosComputer = 0 ;
        do {
            const carta = pedirCarta();
            puntosComputer = acumularPuntos ( carta, puntosJugadores.length-1 );
            crearCarta ( carta, puntosJugadores.length-1 );
        } while ( (puntosComputer<puntosMinimos) && (puntosMinimos<=21) );
        determinarWinner ();
    }
    
    /* Eventos */
    btnPedir.addEventListener( 'click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos ( carta, 0 );
        crearCarta ( carta, 0 );
        if ( puntosJugador>21 ) {
         // console.warn ('Perdiste pelotudo');
            btnPedir.disabled = true;
            btnStop.disabled = true;
            turnoComputer(puntosJugador);
        } else if ( puntosJugador===21 ) {
         // console.warn ('21, óptimo!');
            btnPedir.disabled = true;
            btnStop.disabled = true;
            turnoComputer(puntosJugador);
        }
    } ); // callback
    
    btnStop.addEventListener( 'click', () => {
        btnPedir.disabled = true;
        btnStop.disabled = true;
        turnoComputer( puntosJugadores[0] );
    } ); 

    return { 
        newGame: inicializaGame
    };

}) (); // funcion autoinvocada