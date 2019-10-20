const sqlite = require("sqlite3").verbose();

const sqliteDatabase = new sqlite.Database("sv.db");

const crypto = require("crypto");

const orbitdb = require("orbit-db");
const ipfs = require("ipfs");

const express = require("express");
const port = 8080;
const app = express();

/*
    Database Structure
    ------------------

    User:
    - ID
    - Public Key
    - Private Key
    - Hashed Name
    - Hashed Password

    KeyValueStore_Links:
    - ID
    - User ID
    - KeyValueStore ID
    
    KeyValueStore:
    - ID
    - Public Key
    - Private Key

*/
function Register(pUserEmailHash, pUserPasswordHash, pDatabaseNameHash, pDatabasePasswordHash) {
}

function Login(pUserEmailHash, pUserPasswordHash) {

}

function EncryptData(pDatabaseNameHash, pDatabasePasswordHash, pData) {
    // to encrypt data we need:
    //  1 - the databases private key. (decrypt)
    //  2 - the servers public key. (hash and sign)
}

function DecryptData(pDatabaseNameHash, pDatabasePasswordHash, pData) {
    // to decrypt the data we need:
    //  1 - the databases public key. (decrypt)
    //  2 - the server's private key. (hash and sign)
}

app.get("/", (req, res) => {
    res.send("FairDB");
});

app.get("/register", (req, res) => {
    let userEmailHash = req.query.userEmailHash;
    let userPasswordHash = req.query.userPasswordHash;
    let databaseNameHash = req.query.databaseNameHash;
    let databasePasswordHash = req.query.databasePasswordHash;

    Register(userEmailHash, userPasswordHash, databaseNameHash, databasePasswordHash);
});

app.get("/dashboard", (req, res) => {
    let userEmailHash = req.query.userEmailHash;
    let userPasswordHash = req.query.userPasswordHash;

    Login(userEmailHash, userPasswordHash);

    // view database information.
});


app.get("/get", (req, res) => {
    let databaseNameHash = req.query.databaseNameHash;
    let databasePasswordHash = req.query.databasePasswordHash;

    let queryKey = req.query.key;

    // to get a value from their database...


    // open the orbit-db for their databaseNameHash.
    //  1 - Iterate through their database entries.
    //  2 - Decrypt the database key.
    //  3 - Compare it with the given key.
    //  IF KEY PRESENT
    //  4 - Decrypt the value and send to client.
    //  IF KEY NOT PRESENT
    //  4 - send nothing to the client.
});

app.get("/put", (req, res) => {
    let databaseNameHash = req.query.databaseNameHash;
    let databasePasswordHash = req.query.databasePasswordHash;

    let queryKey = req.query.key;
    let queryValue = req.query.value;

    // to put a value in their database.

    // open their orbit-db instance.
    //  1 - Iterate through the database with a decrypted query key to find present value.
    //  IF KEY PRESENT
    //  2 - Encrypt the new query value and update the entry.
    // IF KEY NOT PRESENT
    //  2 - Encrypt the new query value and query key and add to the database.
});

app.listen(port, () => {
    console.log("Listening on port 8080.");
});