import { config as dotenvCfg } from "dotenv";
dotenvCfg();

import { HardhatUserConfig, task } from "hardhat/config";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";

import { NetworkUserConfig } from "hardhat/types";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

const chainIds = {
  kovan: 42,
  mainnet: 1,
};

const generateNetworkCfg = (
  network: keyof typeof chainIds
): NetworkUserConfig => {
  const apiKey: string | undefined =
    process.env[`${network.toUpperCase()}_API_KEY`];
  const privateKey: string | undefined =
    process.env[`${network.toUpperCase()}_PRIVATE_KEY`];
  if (apiKey === undefined || privateKey === undefined) {
    console.log(`Missing API/PRIVATE key for ${network}. Exiting`);
    process.exit(1);
  }
  const url: string = `https://eth-${network}.alchemyapi.io/v2/${apiKey}`;
  return {
    accounts: [`0x${privateKey}`],
    chainId: chainIds[network],
    url,
  };
};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  typechain: {
    outDir: "types",
    target: "ethers-v5",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
  },
  networks: {
    hardhat: {},
    localhost: {},
    kovan: generateNetworkCfg("kovan"),
    mainnet: generateNetworkCfg("mainnet"),
  },
};

export default config;
