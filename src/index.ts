import {Web3} from 'web3';
import abi from './abi';
import sql from './db';
import {contractAddress, provider} from './constants';
import {deduplicateOwners, parseEvents, upsertTokenOwners} from './util';

export type RawTokenOwner = {token_id: bigint; owner_address: string};
export type TokenOwner = {token_id: string; owner_address: string};

const main = async () => {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, contractAddress);

    const events = await contract.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest',
    });

    const tokenOwners: RawTokenOwner[] = parseEvents(events);

    const deduplicatedOwners = deduplicateOwners(tokenOwners);

    const uniqueOwners = Object.values(deduplicatedOwners);

    await upsertTokenOwners(uniqueOwners);

    const result = await sql`
    SELECT * FROM token_owners ORDER BY token_id ASC`;

    console.log(result);
  } catch (error) {
    console.error('error occured', error);
  }
};

main();
