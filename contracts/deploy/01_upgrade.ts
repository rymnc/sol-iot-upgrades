import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { manager } = await getNamedAccounts();
  await deploy("Upgrade", {
    from: manager,
    args: [manager, 0, 0],
    log: true,
  });
};

export default func;
func.tags = ["Upgrade"];
