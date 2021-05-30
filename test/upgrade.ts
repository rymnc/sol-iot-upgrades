import { deployments, ethers, getNamedAccounts } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Upgrade } from "../types";

chai.use(chaiAsPromised);

const { expect } = chai;

let sampleHash: string = ethers.utils.formatBytes32String("foobar");
let manager: string;
let deviceOne: string;
let aux: string;
let contract: Upgrade;

describe("Upgrade", () => {
  before(async () => {
    ({ manager, deviceOne, aux } = await getNamedAccounts());
  });

  beforeEach(async () => {
    await deployments.fixture("Upgrade");
    contract = (await ethers.getContract("Upgrade", manager)) as Upgrade;
  });

  it("Should bump version", async () => {
    expect(await contract.getVersion(1)).to.equal(0);
    await contract.newUpgrade(1, sampleHash);
    expect(await contract.getVersion(1)).to.equal(1);
  });

  it("Should return the ipfs hash", async () => {
    await contract.newUpgrade(1, sampleHash);
    expect(await contract.getHash(1, 1)).to.eql(sampleHash);
  });

  it("Should emit the newUpgrade event", async () => {
    expect(await contract.newUpgrade(0, sampleHash))
      .to.emit(contract, "NewUpgrade")
      .withArgs(0, sampleHash);
  });

  it("Should add to allowList", async () => {
    expect(await contract.isAllowed(aux)).to.eql(false);
    await contract.addToAllowlist(aux);
    expect(await contract.isAllowed(aux)).to.eql(true);
  });

  it("Should add a device", async () => {
    expect(await contract.isDevice(deviceOne)).to.eql(false);
    await contract.addDevice(deviceOne, sampleHash);
    expect(await contract.isDevice(deviceOne)).to.eql(true);
  });

  it("Should return the correct hash", async () => {
    await contract.newUpgrade(0, sampleHash);
    const sampleHash2 = ethers.utils.formatBytes32String("footext");
    await contract.newUpgrade(0, sampleHash2);
    expect(await contract.getLatestHash(0)).to.eql(sampleHash2);
    expect(await contract.getVersion(0)).to.eql(2);
    expect(await contract.getHash(0, 1)).to.eql(sampleHash);
  });
});
