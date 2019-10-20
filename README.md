# FairDB
"Charitable key-value databases as a service."

Our dream is to be a non-profit organisation that starts here to change the way we pay for services.

## How to use
Please open the index.html in this root directory to view our message!

## Project Status
This is a prototype program and used mainly for researching into encryption, ipfs and orbitdb.
The part that we have at a version 1 is the main homepage /index.html/, and we believe that it conveys our message correctly.
The sub programs for the "orbitdb node" and "fairdb server" are very WIP and are not building, however the main design for the database, routes, user storyboard are complete.

# Tech

## Technologies Used
- IPFS
- OrbitDB
- NodeJS
- Arduino

## Design
1. Run a nodejs server that operates a REST API to OrbitDB/IPFS interface.
2. Run multiple IPFS/OrbitDB nodes on small environmentally friendly computers at local businesses.
3. Developers pay a fee for a REST API and the money made goes to selected charities.

## FairDB Serverside Program
This nodejs program will run on a server hosted by us, and will provide an interface to the OrbitDB through a REST API. When a user submits the data they wish to store, we cryptographically encrypt the data using PGP techniques so that the data given to the OrbitDB is secure to a millitary grade.

## FairDB OrbitDB Node Program
This project will run on arduino/MCU electronics (low power), and will host the database content using IPFS and OrbitDB. It will only provide the orbitdb content we assign to it, and will prevent any other programs to be distributed through it.

# NOTE
This project was added late in the hackerthon, please see original repo here https://github.com/Bambofy/FairDB

# Legal
How will the legal structure work?
We will create a legal framework that allows users to upload their data to the orbitdb while not incurring any liability for such data.


