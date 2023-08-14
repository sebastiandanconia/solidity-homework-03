
import { ethers } from "ethers";
import { MyToken, MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = 50000000000000000000n;
//const MINT_VALUE = ethers.parseUnits("1");

async function start_election() {


}

async function main() {

    //const [deployer, acc1, acc2] = await ethers.getSigners();

    /////////////////////////////////////////////////////////
    // Rewriting for sepolia
    ////////////////////////////////////////////////////////

    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    console.log(`Using address ${wallet.address}`);

    const TOKEN_ADDRESS="0xF6FB4AaAdc94450f0Eb23f0eD5CECFac25F57725";

    const contractFactory = new MyToken__factory(wallet);
    ///////////////////////////////////////////////
    // Deploy Token Contract only once
/*
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`Token contract deployed at ${contractAddress}\n`);
*/
    ///////////////////////////////////////////////
    // Mint tokens a limited number of times

/*
    // Mint some tokens
    const contract = contractFactory.attach(TOKEN_ADDRESS) as MyToken;
    const mintTx = await contract.mint(wallet.address, MINT_VALUE);
    await mintTx.wait();
    console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${wallet.address}\n`
    );
    const balanceBN = await contract.balanceOf(wallet.address);
    console.log(
    `Account ${
        wallet.address
    } has ${balanceBN.toString()} decimal units of MyToken\n`
    );*/

    /////////////////////////////////////////////////////
    // Deploy Voting Contract only once
    const PROPOSALS = ["Plato", "Aristotle", "Marcus Aurelius" ];
    const TARGET_BLOCK=4083000n;
    const votingContractFactory = new TokenizedBallot__factory(wallet);
    const votingContract = await votingContractFactory.deploy(
        PROPOSALS.map(ethers.encodeBytes32String),
        TOKEN_ADDRESS,
        TARGET_BLOCK
    );
    await votingContract.waitForDeployment();
    const votingContractAddress = await votingContract.getAddress();
    console.log(`Voting contract deployed at ${votingContractAddress}\n`);

/*

constructor(
    bytes32[] memory proposalNames,
    address _tokenContract,
    uint256 _targetBlockNumber
) {
*/

/*
    // Self delegate
    const delegateTx = await contract.connect(acc1).delegate(acc1.address);
    await delegateTx.wait();

    // Check the voting power
    const votes = await contract.getVotes(acc1.address);
    console.log(
    `Account ${acc1.address} has ${votes.toString()} units of voting power`
    );


    // Transfer tokens
    const transferTx = await contract
    .connect(acc1)
    .transfer(acc2.address, MINT_VALUE / 2n);
    await transferTx.wait();

    // Check the voting power
    const votes1AfterTransfer = await contract.getVotes(acc1.address);
    console.log(
    `Account ${
      acc1.address
    } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
    );
    const votes2AfterTransfer = await contract.getVotes(acc2.address);
    console.log(
        `Account ${
        acc2.address
        } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
    );


    // Check past voting power
    const lastBlock = await ethers.provider.getBlock("latest");
    const lastBlockNumber = lastBlock?.number ?? 0;

    for (let index = lastBlockNumber - 1; index > 0; index--) {
      const pastVotes = await contract.getPastVotes(
        acc1.address,
        index
        );
        console.log(
            `Account ${
            acc1.address
            } had ${pastVotes.toString()} units of voting power at block ${index}\n`
        );
    }
*/

}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

/*
main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})*/