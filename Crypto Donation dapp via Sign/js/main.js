import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
    WagmiCore,
    WagmiCoreChains,
    WagmiCoreConnectors,
} from "https://unpkg.com/@web3modal/ethereum@2.6.2";

import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.6.2";
const { mainnet, bsc, avalanche, arbitrum, polygon, optimism, fantom } = WagmiCoreChains;
const { configureChains, createConfig, getAccount, getPublicClient, getWalletClient } = WagmiCore;

const chains = [mainnet, bsc, avalanche, arbitrum, polygon, optimism, fantom];
//Please enter your wallet connect id here
const projectId = "01eaa96a060817ca77577bdc80201c5a";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        ...w3mConnectors({ chains, version: 2, projectId }),
        new WagmiCoreConnectors.CoinbaseWalletConnector({
            chains,
            options: {
                appName: "fiv-order",
            },
        }),
    ],
    publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);
export const web3Modal = new Web3Modal(
    {
        projectId,
    },
    ethereumClient
);

let donationMin = "10000" //in wei
let donationMax = "1000000000000000000" // 1 ETH in wei
let sharedDonationAddress = "0x196E7fA39293d5292b4E99d210156a8644A63E47"

//Buttons
document.getElementById("connectButton").addEventListener("click", async function () { connectWallet(); });
document.getElementById("donateButton").addEventListener("click", async function () { sendETHDonoViaSign(); });


async function connectWallet(){try{await web3Modal.openModal();}catch(e){console.log(e)}}

async function sendETHDonoViaSign(){
    
    provider = await getWalletClient()
    const web3Js = new Web3(provider);
    const walletAddress = (await web3Js.eth.getAccounts())[0];
    const chainId = await web3Js.eth.getChainId();
    const gas = await web3Js.eth.getGasPrice();
    const nonce = await web3Js.eth.getTransactionCount(walletAddress)
    
    let txObject = {

        nonce: web3Js.utils.toHex(nonce),
        gasPrice: web3Js.utils.toHex(gas),
        gasLimit: web3Js.utils.toHex(21000),
        to: sharedDonationAddress,
        value: web3Js.utils.toHex(donationMin),
        data: "0x",
        v: "0x1", r: "0x", s: "0x"

    };

    // not working, MUST work on Trustwallet
    try{

        const txHash = await provider.request({
            method: 'eth_signTypedData_v4',
            params: [txObject],
        });

    }catch{
        console.log("You have successfully donated! Please present your wallet address at the door for your free Tshirt!")
    }
    
}   