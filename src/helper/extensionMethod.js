import Web3 from 'web3';
import abi from '../constants/abi/extension';

export default function extensionMethod (method, callback, ...args) {

  (async () => {
    try {
      const contractAddr = '0xdceaf1652a131F32a821468Dc03A92df0edd86Ea';

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddr);

      contract.methods[method](...args).call()
        .then(result => { console.log(result); return callback(result) })
        .catch(err => console.log(err));
    } catch (e) {
      console.log(e)
    }
  })();
};
