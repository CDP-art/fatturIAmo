// * Scrivi una variabile nome con il valore "Mario" e una eta con il valore 30. Stampa in console:
// Mi chiamo Mario e ho 30 anni

let nome = "Mario";
let eta = 30;

//console.log("Ciao, mi chiamo " + nome + " e ho " + eta + " anni.");
console.log("+++++++++++++++++++++++++++++++++++++");

// * Scrivi un ciclo for che stampi in console i numeri da 1 a 10.

for (let i = 1; i <= 10; i++) {
    console.log(i);
}

console.log("+++++++++++++++++++++++++++++++++++++");

// * Crea un oggetto auto con proprietà:
// * •	marca: "Fiat"
// * •	modello: "Panda"
// * •	anno: 2020
// * Stampa in console solo il modello


let auto = {
    marca: "Fiat",
    modello: "Panda",
    anno: 2020
};
//console.log(auto.modello);
//console.log("+++++++++++++++++++++++++++++++++++++");

// Dato un array di numeri, Usa map per creare un nuovo array che contiene i numeri raddoppiati.

const numeri = [1, 2, 3, 4, 5];

const numeriRaddoppiati = numeri.map((n) => n * 2);

//console.log(numeriRaddoppiati);
//console.log("+++++++++++++++++++++++++++++++++++++");

// * Crea una classe Animale con un costruttore che prende nome.
// * Aggiungi un metodo parla() che stampa in console: <nome> fa un verso
// * Crea un’istanza con new Animale("Cane") e chiama parla().

class Animale {
    constructor(nome) {
        this.nome = nome;
    }
    parla() {
        console.log(this.nome + " fa un verso");
    }
}

const cane = new Animale("Cane");
//cane.parla();
//console.log("+++++++++++++++++++++++++++++++++++++");


// *  Scrivi una funzione che divide due numeri. 
// * Se il divisore è 0, lancia un errore. 
// * Usa try...catch per gestire l’errore e stampare "Divisione per zero non permessa".

function dividi(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        console.log("I parametri devono essere numeri");
        return;
    }
    try {
        if (b === 0) {
            throw new Error("Divisione per zero non permessa");
        } else {
            const risultato = a / b;
            console.log("Il risultato è: " + risultato);
        }
    } catch (err) {
        console.log("Questo è l'errore " + err.message);
    }
}

//dividi("ciao", 2);
//dividi(4, 0);
//dividi(4, 2);
console.log("+++++++++++++++++++++++++++++++++++++");

// * scrivere una funzione chiamata countVowels che
// * data una stringa in ingresso
// * ritorni il numero di vocali presenti nella stringa

// Creare la funzione
//Creare un contatore per le vocali
//Creare un ciclo per iterare la stringa

//Se true incremento il contatore
//Ritorno il contatore

function countVowels(stringa) {
    if (typeof stringa !== "string") {
        console.log("Il parametro deve essere una stringa");
        return;
    }
    if (stringa.length === 0) {
        console.log("La stringa non può essere vuota");
        return;
    }

    let contatore = 0;

    if (stringa.length > 0) {
        for (let i = 0; i < stringa.length; i++) {
            const carattere = stringa[i].toLowerCase();
            if ("aeiou".includes(carattere)) {
                contatore++
            }
        }
    }
    return contatore;
}
console.log(countVowels("Il parametro deve essere una stringa"));
countVowels("");
countVowels(1);
console.log("+++++++++++++++++++++++++++++++++++++");

// * // scrivere una funzione chiamata between che
// * dati due numeri a e b in ingresso
// * ritorni un array che contiene tutti i numeri compresi tra a e b, estremi esclusi

//Creare la funzione
//Verificare se i paremetri sono corretti
//Creare l'array nuovo per i numeri
//Creare il ciclo per iterare tra gli estremi
//Per ogni numero push dentro all'array nuovo
//Eliminare i numeri estremi con pop e shift
//Ritornare l'array nuovo

function between(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        console.log("Devi inserire dei numeri");
        return;
    }
    if (a >= b) {
        console.log("Il primo numero deve essere minore del secondo");
        return;
    }
    const numeriNuovi = [];

    for (let i = a; i <= b; i++) {
        numeriNuovi.push(i);
    }

    numeriNuovi.pop();
    numeriNuovi.shift();
    return numeriNuovi;
}

console.log(between(2, 10));
between(10, 2);
between("ciao", 2);
console.log("+++++++++++++++++++++++++++++++++++++");
