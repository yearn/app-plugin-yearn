import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models } from './test.fixture';
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";

const BASE_SCREENS_S = 8
const BASE_SCREENS_X = 6

nano_models.forEach(function(model) {
  test('[Nano ' + model.letter + '] Withdraw Tokens with Recipient 6 decimals', zemu(model, async (sim, eth) => {
    const contractAddr = "0x5f18c75abdae578b483e5f43f12a39cf75b973a9";
    const contract = new ethers.Contract(contractAddr, ['function withdraw(uint256, address)']);
    const recipient = "0xB8c93dF4E1e6b1097889554D9294Dfb42814063a"; //Never use this address for anything other than tests - compromised
    const amountToDeposit = '60000000'; // 60
    const {data} = await contract.populateTransaction.withdraw(amountToDeposit, recipient);

    let unsignedTx = genericTx;
    unsignedTx.to = contractAddr;
    unsignedTx.data = data;
    unsignedTx.value = parseEther("0.1");
    const serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);
    const tx = eth.signTransaction("44'/60'/0'/0", serializedTx);
    const right_clicks = model.letter === 'S' ? BASE_SCREENS_S : BASE_SCREENS_X;
    await waitForAppScreen(sim);
    await sim.navigateAndCompareSnapshots('.', model.name + '_withdraw_recipient_6', [right_clicks, 0]);
    await tx;
  }));
});
