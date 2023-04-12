# ASTICoin
project for cs168

# ASTICoin

### Authors:

Zachary Ian May
Aravind Rokkam

## Goal

We plan to create a Proof-of-Activity cryptocurrency from the base of Spartan Gold. It will be implemented in Javascript. With the final product having resistance to the last actor and grinding attacks.

## Proof-of-Activity Model

We plan to implement our cryptocurrency using an Ouroboros style Proof-of-Activity model. Ouroboros is a secure, efficient, and scalable PoS consensus algorithm used by Cardano blockchain. The algorithm operates by randomly choosing a set of validators to take part in the consensus process for an epoch(predetermined amount of time). During the epoch, validators perform two major activities - block production and validation. The Ouroboros protocol is meant to reward validators with cryptocurrency in exchange for carrying out these tasks honestly and correctly. Our model will implement a distributed random number generation(dRNG) method which is resistant to the Last actor problem.
Each user will have a chance to produce a block based on the number of ASTICoin they possess. In order to determine which user will be the block producer, each user will be entered into an array a number of times equal to their number of coins, this array’s entries will be the address of the user. The addresses entered into any particular index will be determined using the previous block’s set of balances, and going through the users in insertion order and adding their address to the array. After this has been done, the population of users will be divided into equally sized groups based on the hash of the previous block(for our demonstration the size of these groups will be 3 users, however in a production environment the group size should be increased to decrease the likelihood that group decision making can be corrupted). Each group will then work together to generate a random number via each involved user creating their own random number, then XOR’ing with each of the other users numbers. Once the group has created their number, they will then each create a block which includes fields for the random number, the selected block creator, the users involved in creating the random number, the timestamp, and the block number being generated(this number is essentially an incrementing id, starting with the origin being block 0). Each user will then add transactions for their share of the coinbase and send out their block, and the earliest block with the correct round number will be used to determine who the block producer will be. This user will then take the selected block, add their coinbase transaction and fill in any incoming transactions. From here the cycle repeats.

### Important Model Rules:

The selected block creator for any block may not include any of the members of the group which originally generated that block and its random number.
Each block creates 20 ASTICoins to be distributed evenly to the block creator and all members of the group involved in generating the block. (In our example, this would be 5 coins to each users, as we have 3 group members, and the block creator)
Each stage of this process should have a timeout period(roughly 10 seconds) to prevent an inactive user from stopping the network.

### Model Diagram:

## Expected Results

### Minimum Viable Product

The minimum requirements we will meet are a fully operable Proof of Activity based cryptocurrency at a similar level of functionality to Spartan Gold when run locally on one terminal.
This minimum stage of completion  will use a centralized random beacon as its source for random numbers. This approach is the most vulnerable to denial-of-service (DoS) attacks if deployed, since an attacker can focus their efforts on disrupting the centralized entity generating the random numbers. It is also the least distributed of the planned methods. This stage will additionally work as a test of all our non-dRNG related systems. By focusing on the other aspects of the system that do not rely on the distributed random number generation, we can identify and fix any issues before moving on to a more distributed approach to generating random numbers.

### Expected Outcome of Project

The currency we are creating should be fully decentralized, as such we expect to be able to implement a decentralized random number generation method. Our plan for this method is to give an allotted period of time for members to generate a random number from a seed using a specified generation function, and to then share that seed, after which each actors random number will be XOR’d with each other to determine the number which is used to determine the block producer. This method of random number generation is vulnerable to the last actor problem, as well as DoS should the selected producer’s anonymity be compromised.
This stage will be primarily the implementation and testing of our dRNG system, and ensuring that it is capable of resisting extended grinding attacks via limiting the amount of time available to an attacker to find a seed which correctly manipulates the generated random number.
This random number will then be used to determine the address of the user via taking its remainder mod the length of the created array.



### Ideal Final Result

Ideally our final product would be resistant to the last actor problem via implementation of the algorithm presented in this paper[https://eprint.iacr.org/2016/228.pdf]. This algorithm provides resistance against the last actor problem of (n/2)-1 bad actors. This method would be more difficult to implement as it relies on another random seed which is sufficiently random, the main question we have is what constitutes a sufficiently random number. One idea we had was to implement this solution with a seed based on the previous block's hash, however this implementation makes group formation vulnerable to attack from the previous blocks creator and could threaten the implementation of the dRNG method selected. Another method may be available, and more research would be required to create an implementation that allows a sufficiently random seed to be generated.

## Expected Schedule

### Week 1:

Set up the project environment and develop a basic understanding of Spartan Gold.
Begin developing the Proof-of-Activity model using the Ouroboros algorithm.
Implement the initial version of the block production and validation process.

### Week 2:

Test the Proof-of-Activity model and improve its performance.
Develop a distributed random number generation method.
Implement the proposed method for the generation of a random number to determine the block producer.

### Week 3:

Test the distributed random number generation method and ensure that it is resistant to grinding attacks.
Improve the dRNG method by considering alternative seed generation functions.
Develop a timeout mechanism to prevent inactive users from stopping the network.

### Week 4:

Refine the Proof-of-Activity model and dRNG method.
Conduct a comprehensive security audit to identify and address any vulnerabilities.

### Week 5:

Test the entire system and address any issues that arise.
Implement a decentralized random number generation method.
Verify the decentralized method's resistance to the last actor problem.

### Week 6:

Evaluate the project's success and identify areas for future improvement.
Create user documentation and provide instructions for setting up a local node.
Consider future developments for the project.

Please note that this is just an expected schedule and may be subject to change depending on the progress made during the development process.
