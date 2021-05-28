import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers } from "hardhat";
import { Greeter, Greeter__factory } from "../types";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const GreeterFactory = (await ethers.getContractFactory(
      "Greeter"
    )) as Greeter__factory;
    const greeter = (await GreeterFactory.deploy("Hello, world!")) as Greeter;

    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
