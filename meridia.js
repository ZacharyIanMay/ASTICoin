"use strict";

let Blockchain = require('./blockchain.js');
let Miner = require('./miner.js');

const CAP = 1000000;

/**
 * Miners are clients, but they also mine blocks looking for "proofs".
 */
module.exports = class Meridia extends Miner {

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
  }

  /**
   * Starts listeners and begins mining.
   */
  initialize() {
    let temp = this.createTemplate(createRand());
    this.postTemplate(temp);
    super.initialize();
  }

  receiveBlock(block) {
    super.receiveBlock(block);
    let b = this.createTemplate(createRand());
    this.postTemplate(b);
  }

  createRand()
  {
    let found = false;
    let r;
    while(!found)
    {
        r = Math.random() * CAP;
        let arr = this.makeFTSArr(block.prevBlock.balances);
        if(arr[block.rand] !== this.address)
        {
            found = true;
        }
    }
    return r;
  }

  postTemplate(block)
  {
    this.net.broadcast(Blockchain.TEMPLATE_MADE, block)
  }

};
