/*

Crea un componente React funzionale chiamato TodoList che:

riceve una prop items come array di stringhe (es: ["compra", "studia", "corri"])

visualizza ogni voce in un <li> dentro una <ul>

include un input + un bottone per aggiungere una nuova voce (aggiornare lo state)

aggiungi una chiave (key) appropriata negli elementi della lista

*/

// Esercizio React: TodoList
// Soluzione:
//Importare react e useState
//Creare il componente TodoList
//Creare lo state per la lista attuale
//Creare lo state per la nuova lista
//Creare la funzione per aggiungere la nuova voce 
//Se il valore dell'input è vuoto, alert + return
//Aggiornare la lista con la nuova voce
//Resettare il valore dell'input

import React, { useState, useEffect } from "react";

export default function TodoList({ items }) {
    const [todos, setTodos] = useState(items); //Lo stato per la lista attuale
    const [newTodos, setNewTodos] = useState(""); //Lo stato per la nuova voce che viene scritta nell'input

    function addNewTodo() {
        //Se il campo è vuoto, inseriamo l'alert e usciamo dalla funzione
        if (newTodos.trim() === "") {
            alert("Inserisci una voce valida");
            return;
        }

        //Aggiornare la lista con la nuova voce
        setTodos([...todos, newTodos.trim()]);
        //Resettare il valore dell'input
        setNewTodos("");
    }

    return (
        <React.Fragment>
            <ul>
                {todos.map((item, index) => {
                    return <li key={index}>
                        {item}
                    </li>
                })}
            </ul>
            <input
                type="text"
                value={newTodos}
                onChange={(e) => setNewTodos(e.target.value)}
                placeholder="Scrivi un nuovo ToDo"
            />
            <button onClick={addNewTodo}>Aggiungi</button>
        </React.Fragment>
    )

}

//PRIMO COMPONENTE REACT
//Crea un componente Benvenuto che mostri:

export default function Benvenuto() {
    return (
        <React.Fragment>
            <h2>Ciao, sono un componente React!</h2>
        </React.Fragment>
    )
}

/*

Crea un componente Contatore con:
    •	Un bottone “Aggiungi” che incrementa un numero mostrato a schermo
    •	Un bottone “Reset” che riporta il numero a 0

*/

export default function Contatore() {
    const [count, setCount] = useState(0);

    function incrementa() {
        setCount(count + 1);
    }

    function resetta() {
        setCount(0);
    }

    return (
        <React.Fragment>
            <h2 style={{
                textAlign: "center",
            }}

            >Contatore: {count}</h2>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
            }}>
                <button onClick={incrementa}>+</button>
                <button onClick={resetta}>Reset</button>
            </div>
        </React.Fragment>
    )

}

/*

Crea un componente LoginStatus che mostri:
    •	"Benvenuto!" se la variabile loggedIn è true
    •	"Effettua il login" se è false

*/

export default function LoginStatus() {
    const [loggedIn, setLoggedIn] = useState(false);

    function changeLogin() {
        setLoggedIn(!loggedIn);
    }

    return (
        <React.Fragment>
            <h2 style={{ textAlign: "center" }}>Cambia lo stato del Login</h2>
            <p>
                <span style={{ fontWeight: "bold", fontSize: "20px" }}>Login: </span>
                {loggedIn ? "Benvenuto!" : "Effettua il login"}
            </p>
            <button
                onClick={changeLogin}
            >Cambia Login</button>
        </React.Fragment>
    )
}


/*

Esercizio:
Crea un componente FormNome che contenga:
    •	Un input di testo controllato (collegato allo stato nome)
    •	Un paragrafo sotto che mostri in tempo reale: "Il tuo nome è: <nome>"

*/

export default function FormNome() {
    const [nome, setNome] = useState("");

    function mioNome(e) {
        setNome(e.target.value)
    }

    return (
        <React.Fragment>
            <input
                type="text"
                value={nome}
                onChange={mioNome}
            />
            <p>Il tuo nome é: {nome}</p>
        </React.Fragment>
    )
}

/*

Esercizio:
Crea un componente Timer che:
    •	Mostri quanti secondi sono passati da quando il componente è stato montato
    •	Usi useEffect e setInterval

*/
//creare la funzione timer
//creare lo state per i secondi
//usare useEffect per il setInterval
//creare la costante interval che aggiorna i secondi ogni secondo
//ritornare il numero di secondi
//pulire l'interval quando il componente viene smontato

export default function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        function cleanup() {
            clearInterval(interval);
        }
        return cleanup;
    }, []);

    return (
        <React.Fragment>
            <h2 style={{ textAlign: "center" }}>Timer</h2>
            <p>Secondi trascorsi: {seconds}</p>
        </React.Fragment>
    )
}



/*

Esercizio finale:
Crea un piccolo layout con 3 componenti:
    •	Header → Mostra il titolo "FatturIAmo App"
    •	Main → Mostra un testo "Genera e gestisci fatture"
    •	Footer → Mostra "© 2025 - Tutti i diritti riservati"
Poi componili dentro un componente App che li visualizza in ordine.

*/

export function Header() {
    return (
        <>
            <header>
                <h1>FatturIAmo App</h1>
            </header>
        </>
    )
}

export function Main() {
    return (
        <>
            <main>
                <p>Genera e gestisci fatture</p>
            </main>
        </>
    )
}

export function Footer() {
    return (
        <>
            <footer>
                <p>© 2025 - Tutti i diritti riservati</p>
            </footer>
        </>
    )
}


export default function App() {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    )
}



// *  Crea un componente InputNome con un campo di testo. 
// * Ogni volta che scrivi, deve mostrare sotto il valore attuale dell’input.

export default function InputNome() {

    const [nome, setNome] = useState("mario");

    return (
        <>
            <input
                type="text"
                placeholder="Il tuo nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />
            <p><span style={{ fontWeight: "bold" }}>Il tuo nome è:</span> {nome}</p>
        </>
    )
}

// * Crea un componente che aggiorna il titolo della scheda del browser con document.title = "Nuovo titolo" quando viene montato.

export default function TitoloSheda() {

    useEffect(() => {
        document.title = "Nuovo titolo";
    }, []);

    return (
        <>
            <h2>Titolo della scheda {document.title}</h2>
        </>
    )
}

// *  Crea un componente ContatoreStep che ha due pulsanti + e -. 
// * A ogni click incrementa o decrementa di 2 lo state count.

export default function ContatoreStep() {
    const [count, setCount] = useState(0);

    function incrementa2() {
        setCount(count + 2);
    }

    const decrementa2 = () => {
        setCount(count - 2);
    }

    return (
        <>
            <h2>Contatore: {count}</h2>
            <button onClick={incrementa2}>+</button>
            <button onClick={decrementa2}>-</button>
        </>
    )
}

// * Crea un componente che mostra/nascondi un testo quando premi un bottone "Mostra/Nascondi".

export default function MostraNascondi() {
    const [mostra, setMostra] = useState(true);

    function cambiaStato() {
        setMostra(!mostra);
    }

    return (
        <>
            <h2>Qui sotto c'è un testo da mostrare o nascondere</h2>
            <p>{mostra ? "Ciao Mondo" : null}</p>
            <button onClick={cambiaStato}>{mostra ? "Nascondi" : "Mostra"}</button>
        </>
    )
}


// * Crea un componente FormEmail con un campo email e un pulsante submit. 
// * Quando premi invia, stampa in console "Email inviata: <valore>".

export default function FormEmail() {
    const [messaggio, setMessaggio] = useState("");

    function pulsanteInvia() {
        console.log(`Email inviata: ${messaggio}`);
    }

    return (
        <>
            <form>
                <input placeholder="E-mail" type="email"></input>
                <input placeholder="N. di telefono" type="tel"></input>
                <textarea
                    placeholder="Messaggio"
                    type="text"
                    value={messaggio}
                    onChange={(e) => setMessaggio(e.target.value)}
                ></textarea>
                <button type="submit" onClick={pulsanteInvia}>Invia</button>
            </form>
        </>
    )
}