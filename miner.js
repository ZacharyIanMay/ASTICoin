"use strict";

let Blockchain = require('./blockchain.js');
let Client = require('./client.js');

/**
 * Miners are clients, but they also mine blocks looking for "proofs".
 */
module.exports = class Miner extends Client {

  /**
   * When a new miner is created, but the PoW search is **not** yet started.
   * The initialize method kicks things off.
   * 
   * @constructor
   * @param {Object} obj - The properties of the client.
   * @param {String} [obj.name] - The miner's name, used for debugging messages.
   * * @param {Object} net - The network that the miner will use
   *      to send messages to all other clients.
   * @param {Block} [startingBlock] - The most recently ALREADY ACCEPTED block.
   * @param {Object} [obj.keyPair] - The public private keypair for the client.
   * @param {Number} [miningRounds] - The number of rounds a miner mines before checking
   *      for messages.  (In single-threaded mode with FakeNet, this parameter can
   *      simulate miners with more or less mining power.)
   */
  constructor({name, net, startingBlock, keyPair, miningRounds=Blockchain.NUM_ROUNDS_MINING} = {}) {
    super({name, net, startingBlock, keyPair});
    this.miningRounds=miningRounds;
  }

  /**
   * Starts listeners and begins mining.
   */
  initialize() {
    this.startNewSearch();
  }

  /**
   * Sets up the miner to start searching for a new block.
   * 
   * @param {Set} [txSet] - Transactions the miner has that have not been accepted yet.
   */
  startNewSearch(txSet=new Set()) {
    // Merging txSet into the transaction queue.
    // These transactions may include transactions not already included
    // by a recently received block, but that the miner is aware of.
    txSet.forEach((tx) => this.transactions.add(tx));

    // Add queued-up transactions to block.
    this.transactions.forEach((tx) => {
      this.currentBlock.addTransaction(tx, this);
    });
    this.transactions.clear();
  }

  /**
   * Receives a block from another miner. If it is valid,
   * the block will be stored. If it is also a longer chain,
   * the miner will accept it and replace the currentBlock.
   * 
   * @param {Block | Object} b - The block
   */
  receiveBlock(s) {
    let b = super.receiveBlock(s);

    if (b === null) return null;

    // We switch over to the new chain only if it is better.
    if (this.currentBlock && b.chainLength >= this.currentBlock.chainLength) {
      this.log(`cutting over to new chain.`);
      let txSet = this.syncTransactions(b);
      this.startNewSearch(txSet);
    }

    return b;
  }

  /**
   * This function should determine what transactions
   * need to be added or deleted.  It should find a common ancestor (retrieving
   * any transactions from the rolled-back blocks), remove any transactions
   * already included in the newly accepted blocks, and add any remaining
   * transactions to the new block.
   * 
   * @param {Block} nb - The newly accepted block.
   * 
   * @returns {Set} - The set of transactions that have not yet been accepted by the new block.
   */
  syncTransactions(nb) {
    let cb = this.currentBlock;
    let cbTxs = new Set();
    let nbTxs = new Set();

    // The new block may be ahead of the old block.  We roll back the new chain
    // to the matching height, collecting any transactions.
    while (nb.chainLength > cb.chainLength) {
      nb.transactions.forEach((tx) => nbTxs.add(tx));
      nb = this.blocks.get(nb.prevBlockHash);
    }

    // Step back in sync until we hit the common ancestor.
    while (cb && cb.id !== nb.id) {
      // Store any transactions in the two chains.
      cb.transactions.forEach((tx) => cbTxs.add(tx));
      nb.transactions.forEach((tx) => nbTxs.add(tx));

      cb = this.blocks.get(cb.prevBlockHash);
      nb = this.blocks.get(nb.prevBlockHash);
    }

    // Remove all transactions that the new chain already has.
    nbTxs.forEach((tx) => cbTxs.delete(tx));

    return cbTxs;
  }

};
