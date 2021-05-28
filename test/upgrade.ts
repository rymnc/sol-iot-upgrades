import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers } from "hardhat";
import { Upgrade, Upgrade__factory } from "../types";

chai.use(chaiAsPromised);

const { expect } = chai;

let testOwnableF: Upgrade__factory;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let owner: SignerWithAddress;
let contract: Upgrade;

let sampleHash: string = ethers.utils.formatBytes32String("foobar");

describe("Upgrade", () => {
  beforeEach(async () => {
    testOwnableF = (await ethers.getContractFactory(
      "Upgrade"
    )) as Upgrade__factory;
    [owner, addr1, addr2] = await ethers.getSigners();
    contract = await testOwnableF.deploy(owner.address, 0, 0);
  });

  afterEach(() => {
    contract.off("NewUpgrade", () => {});
  });

  it("Should bump version", async () => {
    expect(await contract.getVersion(1)).to.equal(0);
    await contract.newUpgrade(1, sampleHash);
    expect(await contract.getVersion(1)).to.equal(1);
  });

  it("Should return the ipfs hash", async () => {
    await contract.newUpgrade(1, sampleHash);
    expect(await contract.getHash(1)).to.eql(sampleHash);
  });

  it("Should emit the newUpgrade event", async () => {
    expect(await contract.newUpgrade(0, sampleHash))
      .to.emit(contract, "NewUpgrade")
      .withArgs(0, sampleHash);
  });

  it("Should add to allowList", async () => {
    const auxAddress = addr1.address;
    expect(await contract.isAllowed(auxAddress)).to.eql(false);
    await contract.addToAllowlist(auxAddress);
    expect(await contract.isAllowed(auxAddress)).to.eql(true);
  });

  it("Should add a device", async () => {
    const deviceAddress = addr2.address;
    expect(await contract.isDevice(deviceAddress)).to.eql(false);
    await contract.addDevice(deviceAddress, sampleHash);
    expect(await contract.isDevice(deviceAddress)).to.eql(true);
  });
});
