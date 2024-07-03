import {EventLog} from 'web3';
import sql from './db';
import {RawTokenOwner, TokenOwner} from '.';

export function parseEvents(events: (string | EventLog)[]): RawTokenOwner[] {
  return events
    .filter(
      (
        event
      ): event is EventLog & {
        returnValues: {tokenId: bigint; to: string};
      } => {
        return (
          typeof event !== 'string' &&
          event.returnValues !== undefined &&
          typeof event.returnValues.tokenId === 'bigint' &&
          typeof event.returnValues.to === 'string'
        );
      }
    )
    .map(event => {
      return {
        token_id: event.returnValues.tokenId,
        owner_address: event.returnValues.to,
      };
    });
}

export async function upsertTokenOwners(uniqueOwners: TokenOwner[]) {
  await sql`
    INSERT INTO token_owners
    ${sql(uniqueOwners)}
    ON CONFLICT (token_id) DO UPDATE 
    SET owner_address = excluded.owner_address
    returning *
    `;
}

export function deduplicateOwners(tokenOwners: RawTokenOwner[]) {
  return tokenOwners.reduce(
    (acc, current) => {
      const token_id = current.token_id.toString();
      acc[token_id] = {
        token_id,
        owner_address: current.owner_address,
      };
      return acc;
    },
    {} as Record<string, TokenOwner>
  );
}
