const sqlite = require("sqlite3").verbose();

const sqliteDatabase = new sqlite.Database("sv.db");

const crypto = require("crypto");
const bcrypt = require("bcrypt");

const orbitdb = require("orbit-db");
const ipfs = require("ipfs");

const express = require("express");
var session = require('express-session');
const port = 8080;
const app = express();

app.use(session({
    secret: 'kasdoijasdoijasd123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

/*
    Global configuration (for now) 
*/
const GLOBALS = {};
GLOBALS["HashFunction"] = "sha256";
GLOBALS["HashDigestType"] = "hex";
GLOBALS["VerifyFunction"] = "sha256";

/*
    Database Structure
    ------------------
    User:
    - ID
    - Hashed Email
    - Hashed Name
    - Hashed Password
    - Authentication Token

    KeyValueStore_Links:
    - ID
    - User ID
    - KeyValueStore ID
    
    KeyValueStore:
    - ID
    - Hashed Database Name

    KeyValueStore_Keys:
    - ID
    - Public Key
    - Private KEY
*/

/*
Abstraction layer
*/
async function GetUserFromAuthenticationToken(pUserAuthenticationToken)
{

}

async function GetDatabaseIdFromName(pDatabaseNameHash) {

}

/*
Utilities Layer
*/
async function PrintErrorTrace(pError) {
    console.trace(pError);
}

/*
Register user details in the database that are linked to the database table
*/

async function RegisterUser(pUserEmailHash, pUserNameHash, pUserPasswordHash)
{
    console.log("[RegisterUser] Registering user");
    console.log("[RegisterUser] " + pUserNameHash);
    
    let registerUserQuery = `INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?);`;
    let preparedQuery = sqliteDatabase.prepare(registerUserQuery);
    preparedQuery.run(pUserEmailHash, pUserNameHash, pUserPasswordHash);
    
    console.log("[RegisterUser] Finished.");
}

/* 
Generates a token for a given user information
*/
async function Authenticate(pUserName, pUserEmail, pUserPassword)
{
    let userIdentifier = "";
    if (pUserNameHash !== undefined) {
        userIdentifier = pUserNameHash;
    }
    else if (pUserEmailHash !== undefined) {
        userIdentifier = pUserEmailHash;
    }
    else
    {
        throw "Cannot authenticate with no identifier given.";
    }

    if (pUserPasswordHash === undefined) {
        throw "Cannot authenticate with no password given.";
    }

    // check if this user is in the database.
    
    // timecheck on this select query.
    let timeStart = Date.now();

    let userSelectQuery = sqliteDatabase.prepare(`SELECT * FROM Users`);
    let userFound = false;
    await userSelectQuery.each(async (pError, pUserRow) => {
        if (pError) console.trace(pError);

        console.log("user found");
        console.log(pUserRow);

        let identifierUserNameCheck = await VerifyHash(pUserRow["Name"], userIdentifier);
        let identifierUserEmailCheck = await VerifyHash(pUserRow["Email"], userIdentifier);
        let passwordUserCheck = await VerifyHash(pUserRow["Password"], pUserPasswordHash);
        
        if (passwordUserCheck === true) {
            if (identifierUserEmailCheck === true) {
                userFound = true;
            }             
            else if (identifierUserNameCheck === true) {
                userFound = true;
            }
        }

    });

    // if this user exists.
    if (userFound) {
        // generate the authentication token.
        let userAuthToken = "";
        await crypto.randomBytes(64, (err, token) => {
            if (err) {
                PrintErrorTrace(err);
            }

            userAuthToken = token.toString("hex");
        });

        // submit it to their database row.
        let userUpdateQuery = sqliteDatabase.prepare(`UPDATE Users SET 'Authentication Token' = ?`, function(pError) {
            if (pError) PrintErrorTrace(pError);
        });
        userUpdateQuery.run(userAuthToken, function (pError) {
            if (pError) PrintErrorTrace(pError);
        });
        userUpdateQuery.finalize((pError) => {
            if (pError) PrintErrorTrace(pError);
        });

        return userAuthToken;
    }
    return "";
}

/*
    Create database encryption data in database.
*/
async function CreateDatabase(pUserAuthenticationToken, pDatabaseNameHash)
{
    sqliteDatabase.serialize(async () => {
        // create key pair in database
        let createDatabaseKeysQuery = sqliteDatabase.prepare(`INSERT INTO KeyValueStores_Keys (Public Key, Private Key) VALUES (?, ?);`);
        createDatabaseKeysQuery.run(publicKey, privateKey);

        // create information for database.
        let createDatabaseInformationQuery = sqliteDatabase.prepare(`INSERT INTO KeyValueStores_Information (Name) VALUES (?)`);
        createDatabaseInformationQuery.run(pDatabaseNameHash);

        // create link between this user and the created database.
        let authenticatedUser = await GetUserFromAuthenticationToken(pUserAuthenticationToken);
        let userId = authenticatedUser.Id;
        let dbId = await GetDatabaseIdFromName(pDatabaseNameHash);

        let createDatabaseUserLinkQuery = sqliteDatabase.prepare(`INSERT INTO KeyValueStores_Links (User Id, KeyValueStore ID) VALUES (?, ?)`);
        createDatabaseUserLinkQuery.run(userId, dbId);
        createDatabaseUserLinkQuery.finalize();
    });

    
    console.log("[Database] Create a database with name: " + pDatabaseNameHash);
}

/*
    When trying to access the dashboard page, perform this login function on the user.
*/
function Login(pUserEmailHash, pUserPasswordHash) {
    let loginQuery = `SELECT * FROM Users WHERE Name`
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

async function HashData(pData) {
    let hash = "";
    await bcrypt.hash(pData, 1000, function(err, pHash) {
        // Store hash in your password DB.
        hash = pHash;
    });

    return hash;
}

app.get("/", async (req, res) => {
    res.send("FairDB");
});

app.get("/registerUser", async (req, res) => {
    let userNameHash = req.query.userNameHash;
    let userEmailHash = req.query.userEmailHash;
    let userPasswordHash = req.query.userPasswordHash;

    await RegisterUser(userEmailHash, userPasswordHash, userNameHash);
});


app.get("/createDatabase", async (req, res) => {
    let authenticationToken = req.query.userToken;
    let databaseNameHash = req.query.databaseNameHash;

    await CreateDatabase(authenticationToken, databaseNameHash);
});

app.get("/authenticate", async (req, res) => {
    let userNameHash = req.query.userNameHash;
    let userEmailHash = req.query.userEmailHash;
    let userPasswordHash = req.query.userPasswordHash;

    await Authenticate(userNameHash, userEmailHash, userPasswordHash);
});

app.get("/dashboard", async (req, res) => {
    let userEmailHash = req.query.userEmailHash;
    let userPasswordHash = req.query.userPasswordHash;

    await Login(userEmailHash, userPasswordHash);

    // view database information.
});


app.get("/get", async (req, res) => {
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

app.get("/put", async (req, res) => {
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

app.listen(port, async () => {
    console.log("[Listen] Listening on port 8080.");

    console.log("[Listen] Creating new user");

/* Create a user.
    let emailHash = await HashData("r")
    let usernameHash = await HashData("g");
    let passwordHash = await HashData("b");

    // async function
    RegisterUser(emailHash, usernameHash, passwordHash);
*/

/* Authenticate a user */
    let emailHash = await HashData("r");
    let usernameHash = await HashData("g");
    let passwordHash = await HashData("b");

    // force to wait for auth token.
    let authenticationToken = await Authenticate(usernameHash, emailHash, passwordHash);

    console.log("[Listen] " + authenticationToken);
    console.log("[Listen] Exited main function.")
});