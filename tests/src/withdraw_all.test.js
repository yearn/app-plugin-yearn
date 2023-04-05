import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models } from './test.fixture';
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";

const BASE_SCREENS_S = 5
const BASE_SCREENS_X = 5

nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] Withdraw all Tokens', zemu(model, async (sim, eth) => {
    const contractAddr = "0x5f18c75abdae578b483e5f43f12a39cf75b973a9";
    const contract = new ethers.Contract(contractAddr, ['function withdraw()']);
    const {data} = await contract.populateTransaction.withdraw();

    let unsignedTx = genericTx;
    unsignedTx.to = contractAddr;
    unsignedTx.data = data;
    unsignedTx.value = parseEther("0.1");
    const serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);
    const tx = eth.signTransaction("44'/60'/0'/0", serializedTx);
    const right_clicks = model.letter === 'S' ? BASE_SCREENS_S : BASE_SCREENS_X;
    await waitForAppScreen(sim);
    await sim.navigateAndCompareSnapshots('.', model.name + '_withdraw_all', [right_clicks, 0]);
    await tx;
  }));
});
