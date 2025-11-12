import express from 'express';
const app = express();
import fs from "fs";
import mongoose from "mongoose";
app.use(express.json());

const PORT = 8000;

/*
* Crea un semplice endpoint Express (ad es. /api/users) che:
    * •	risponde a GET /api/users con un array di utenti (nome + id)
    * •	risponde a POST /api/users aggiungendo un nuovo utente passato nel body JSON { "name": "Mario" }
    * •	gestisce errori (es: body mancante) con codice HTTP appropriato

*/

//TODO Pseudo-codice:
//TODO Creare array di oggetti con nome e id
//TODO Creare l'endpoint GET /api/users app.get
//TODO Creare l'endpoint POST /api/users app.post
//TODO Gestire gli errori
//TODO app.listen(8000)

let users = [
    {
        id: 1,
        name: "Mario Rossi"
    },
    {
        id: 2,
        name: "Luigi Bianchi"
    },
    {
        id: 3,
        name: "Anna Verdi"
    }
];

//Endpoint GET
app.get("/api/users", (req, res) => {
    res.json(users);
})

//Endpoint POST
app.post("/api/users", (req, res) => {
    const { name } = req.body;
    if (name) {
        const newUser = {
            id: users.length + 1,
            name
        }
        users.push(newUser);
        res.status(201)
            .json(newUser);
    } else {
        res.status(400)
            .json({ error: "Nome mancante" })
    }
})

app.listen(PORT, () => {
    console.log(`Server attivo sulla porta http://localhost:${PORT}`);
})


// *Scrivi uno script Node.js che stampi "Hello, Node.js!" sulla console.
console.log("Hello, Node.js!");

// * Crea uno script che legga il contenuto di un file testo.txt e lo stampi in console. Se il file non esiste, gestisci l’errore.

// * Usa il modulo nativo http per creare un server che risponde "Ciao dal server Node!" a tutte le richieste sulla porta 3000.

app.listen(3000, () => {
    console.log("Ciao dal server Node!");
})

// * 👉 Crea un piccolo server Express che espone l’endpoint /saluto, e risponde con JSON:
// { "messaggio": "Ciao dal server Express" }

app.get("/saluto", (req, res) => {
    res.json({ "messaggio": "Ciao dal server Express" })
})

/*

*  Crea un server Express con un array users.
* Implementa 3 endpoint:
    * •	GET /users → restituisce tutti gli utenti
    * •	POST /users → aggiunge un utente (body JSON con name)
    * •	DELETE /users/:id → elimina un utente per id

*/

// TODO Creare un array users di oggetti con id e name
// TODO Creare l'endpoint GET /users
// TODO Creare l'endpoint POST /users
// TODO Creare l'endpoint DELETE /users/:id

let users2 = [];

app.get("/users2", (req, res) => {
    if (users2.length === 0) {
        res
            .status(404)
            .json({ message: "Nessun utente presente" });
    } else {
        res
            .status(200)
            .json(users2);
    }
})

app.post("/users2", (req, res) => {
    const { name } = req.body;

    if (name) {
        const newUser = {
            id: users2.length + 1,
            name
        }
        users2.push(newUser);
    } else {
        res
            .status(400)
            .json({ error: "Nome mancante" });
    }
})

app.delete("/users2/:id", (req, res) => {
    const { id } = req.params;
    res
        .json({ message: `Utente con id ${id} eliminato` });
})

/*

* Crea un middleware che intercetta gli errori e risponde con codice 500 e JSON:
{ "error": "Qualcosa è andato storto" }

*/

//TODO Creare il middleware
//TODO Usare app.use per il middleware
// TODO Forzare un errore in un endpoint per testare il middleware

function errorHandler(req, res, err) {

    let myAge = 30

    try {
        if (myAge < 18) {
            console.log("Sei minorenne");
        }
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json(
                {
                    error: "Qualcosa è andato storto",
                    details: err
                }
            );
    }
}

app.use(errorHandler);

// * Scrivi uno script che si connette a un database MongoDB locale miodb e definisce uno schema User con campo name: String.


mongoose.connect("mongodb://localhost:27017/miodb")
    .then(() => console.log("✅ Connesso a MongoDB"))
    .catch(err => console.error("Errore di connessione", err));

const userSchema = mongoose.Schema({
    name: String
})

const User = mongoose.model("User", userSchema);


/*

* 👉 Crea un’app Express che:
    * •	Connette a MongoDB
    * •	Ha un modello Todo { titolo: String, completato: Boolean }
    * •	Espone endpoint per:
    * •	GET /todos → lista todos
    * •	POST /todos → aggiungi un nuovo todo
    * •	PATCH /todos/:id → aggiorna completato
    * •	DELETE /todos/:id → elimina un todo

*/

//TODO Connessione a MongoDB
//TODO Definire lo schema e il modello Todo
//TODO Creare gli endpoint GET, POST, PATCH, DELETE

const todoSchema = mongoose.Schema({
    titolo: String,
    completato: Boolean
})

const Todo = mongoose.model("Todo", todoSchema);

// GET
app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
})

// POST
app.post("/todos", async (req, res) => {
    const { titolo } = req.body;
    if (titolo) {
        const newTodo = new Todo({
            titolo: req.body.titolo,
            completato: false
        });
        await newTodo.save();
        res
            .status(201)
            .json(newTodo);
    } else {
        res
            .status(400)
            .json({ error: "Titolo mancante" });
    }
})


// PATCH
app.patch("/todos/:id", async (req, res) => {
    const { id } = req.params;

    const todo = await Todo.findById(id);
    if (todo) {
        todo.completato = req.body.completato;
        await todo.save();
        res
            .status(200)
            .json(todo);
    } else {
        res
            .status(404)
            .json({ error: "Todo non trovato" });
    }
})

// DELETE
app.delete("/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res
        .status(204)
        .send();
})

app.listen(4000, () => {
    console.log("Server attivo sulla porta http://localhost:4000");
});