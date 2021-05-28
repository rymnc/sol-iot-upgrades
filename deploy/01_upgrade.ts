import { ethers } from "hardhat";
import { Upgrade, Upgrade__factory } from "../types";

async function main() {
  const UpgradeFactory = (await ethers.getContractFactory(
    "Upgrade"
  )) as Upgrade__factory;
  const [owner] = await ethers.getSigners();
  const upgrade = (await UpgradeFactory.deploy(owner.address, 0, 0)) as Upgrade;

  await upgrade.deployed();

  console.log("Upgrade deployed to:", upgrade.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
