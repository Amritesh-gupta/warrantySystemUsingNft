import { ethers } from "ethers";
import { abi } from "./abi.json";
import detectEthereumProvider from "@metamask/detect-provider";




async function connect() {

  try {
    const account = await window.ethereum.request({ method: "eth_requestAccounts" })
    handleAccountsChanged(account)
  }
  catch (err) {
    if (err.code === 4001) {
      throw new Error("Please connect to MetaMask.");
    } else {
      throw new Error(err);
    }
  }
}

let currentAccount = null,
  currAddr = null;


const isMetaMaskInstalled = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    console.log("installed");
  } else {
    throw new Error("Please install MetaMask!");
  }
};

function handleChainChanged(_chainId) {
  window.location.reload();
}

function handleAccountsChanged(accounts) {
  currentAccount = accounts;
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    throw new Error("Please connect to MetaMask.");
  } else if (accounts[0] !== currentAccount) {
    currAddr = accounts[0];
  }
  console.log(currAddr)
}

const createInstance = () => {
  const ethersProvider = new ethers.providers.Web3Provider(
    window.ethereum,
    "any"
  );
  const con = new ethers.Contract(
    "0xfAcCd6aF93A9C9094B32f4B32F8529A0AE1e45A7",
    abi,
    ethersProvider.getSigner()
  );
  return con;
}

export const mint = async (itemsArray) => {
  try {
    await preCheck();
    let mycon = createInstance();
    let a = await mycon.createProduct(itemsArray, currAddr);
    a = await a.wait();
    console.log(a);
  }
  catch (err) {
    alert(err.message)
    return null;
  }
  return currAddr;
}

export const checkBalance = async (address) => {
  try {
    await preCheck();
    let mycon = createInstance();
    let balance = await mycon.balanceOf(address);
    return balance;
  }
  catch (err) {
    alert(err.message)
    return null;
  }
}

export const getAllIds = async (address) => {
  try {
    let mycon = createInstance();
    let balance = await mycon.getIds(address);
    return balance;
  }
  catch (err) {
    alert(err.message)
    return null;
  }
}

export const getAllNftDetails = async (nftId) => {
  try {
    let mycon = createInstance();
    let details = await mycon.getProductDetails(nftId);
    return details;
  }
  catch (err) {
    alert(err.message)
    return null;
  }
}

export const getAddress = async () => {
  try {
    await preCheck();
    return currAddr;
  }
  catch (err) {
    alert(err.message)
    return null;
  }
}

export const transferNft = async(from,to,id,name)=>{
  try{
    await preCheck();
    let mycon = createInstance();
    let a = await mycon.transferWarrantyOwnership(from,to,id,name);
    a = await a.wait();
    return 1;
  }
  catch(err){
    alert(err.message)
    return null;
  }
}

const preCheck = async () => {
  await isMetaMaskInstalled()
  await connect();
}
