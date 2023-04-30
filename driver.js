"use strict";

let Blockchain = require('./blockchain.js');
let Block = require('./block.js');
let Client = require('./client.js');
let Miner = require('./miner.js');
let Meridia = require('./meridia.js');
let Transaction = require('./transaction.js');

let FakeNet = require('./fake-net.js');

console.log("Starting simulation.  This may take a moment...");


let fakeNet = new FakeNet();

// Clients
let alice = new Client({name: "Alice", net: fakeNet});//lets assume we are making alice as beacon client
let bob = new Client({name: "Bob", net: fakeNet});
let charlie = new Client({name: "Charlie", net: fakeNet});
let minnie = new Client({name: "Minnie", net: fakeNet});
let mickey = new Client({name: "Mickey", net: fakeNet});

// Miners
// let minnie = new Miner({name: "Minnie", net: fakeNet});
// let mickey = new Miner({name: "Mickey", net: fakeNet});
// as this version doesn't use miners, we don't need these declarations right now.

// Creating genesis block
let genesis = Blockchain.makeGenesis({
  blockClass: Block,
  transactionClass: Transaction,
  clientBalanceMap: new Map([
    [alice, 233],
    [bob, 99],
    [charlie, 67],
    [minnie, 400],
    [mickey, 300],
  ]),
});

let meridia = new Meridia({name:"Meridia", net: fakeNet, startingBlock: genesis});

// Late miner - Donald has more mining power, represented by the miningRounds.
// (Mickey and Minnie have the default of 2000 rounds).
//let donald = new Miner({name: "Donald", net: fakeNet, startingBlock: genesis, miningRounds: 3000});

function showBalances(client) {
  console.log(`Alice has ${client.lastBlock.balanceOf(alice.address)} gold.`);
  console.log(`Bob has ${client.lastBlock.balanceOf(bob.address)} gold.`);
  console.log(`Charlie has ${client.lastBlock.balanceOf(charlie.address)} gold.`);
  console.log(`Minnie has ${client.lastBlock.balanceOf(minnie.address)} gold.`);
  console.log(`Mickey has ${client.lastBlock.balanceOf(mickey.address)} gold.`);
  // console.log(`Donald has ${client.lastBlock.balanceOf(donald.address)} gold.`);
}

// Showing the initial balances from Alice's perspective, for no particular reason.
console.log("Initial balances:");
showBalances(meridia);

fakeNet.register(alice, bob, charlie, minnie, mickey, meridia);

// Miners start mining.
meridia.initialize();



// Alice transfers some money to Bob.
console.log(`Alice is transferring 40 gold to ${bob.address}`);
alice.postTransaction([{ amount: 40, address: bob.address }]);

setTimeout(() => {
  console.log();
  console.log("Balances .5 second after Alice's transaction (Alice's perspective):");
  showBalances(alice);
  console.log();
}, 500);

// setTimeout(() => {
//   console.log();
//   console.log("***Starting a late-to-the-party miner***");
//   console.log();
//   fakeNet.register(donald);
//   donald.initialize();
// }, 2000);

// Print out the final balances after it has been running for some time.
setTimeout(() => {
  console.log();
  console.log(`Minnie has a chain of length ${minnie.lastBlock.chainLength}:`);

  console.log();
  console.log(`Mickey has a chain of length ${mickey.lastBlock.chainLength}:`);

  // console.log();
  // console.log(`Donald has a chain of length ${donald.currentBlock.chainLength}:`);

  console.log();
  console.log("Final balances (Minnie's perspective):");
  showBalances(minnie);

  console.log();
  console.log("Final balances (Alice's perspective):");
  showBalances(alice);

  // console.log();
  // console.log("Final balances (Donald's perspective):");
  // showBalances(donald);

  process.exit(0);
}, 5000);
