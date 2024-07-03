import {EventLog} from 'web3';
import sql from './db';
import {deduplicateOwners, parseEvents, upsertTokenOwners} from './util';

jest.mock('web3');
jest.mock('./db', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Token Owner Management', () => {
  describe('parseEvents', () => {
    it('should correctly parse valid events', () => {
      const mockEvents = [
        {returnValues: {tokenId: BigInt(1), to: '0x123'}},
        {returnValues: {tokenId: BigInt(2), to: '0x456'}},
      ];

      const result = parseEvents(
        mockEvents as unknown as (string | EventLog)[]
      );

      expect(result).toEqual([
        {token_id: BigInt(1), owner_address: '0x123'},
        {token_id: BigInt(2), owner_address: '0x456'},
      ]);
    });

    it('should filter out invalid events', () => {
      const mockEvents = [
        {returnValues: {tokenId: BigInt(1), to: '0x123'}},
        'invalid event',
        {returnValues: {tokenId: 'invalid', to: '0x456'}},
      ];

      const result = parseEvents(
        mockEvents as unknown as (string | EventLog)[]
      );

      expect(result).toEqual([{token_id: BigInt(1), owner_address: '0x123'}]);
    });
  });

  describe('deduplicateOwners', () => {
    it('should deduplicate owners based on token_id', () => {
      const mockTokenOwners = [
        {token_id: BigInt(1), owner_address: '0x123'},
        {token_id: BigInt(2), owner_address: '0x456'},
        {token_id: BigInt(1), owner_address: '0x789'}, // This should overwrite the first entry
      ];

      const result = deduplicateOwners(mockTokenOwners);

      expect(result).toEqual({
        '1': {token_id: '1', owner_address: '0x789'},
        '2': {token_id: '2', owner_address: '0x456'},
      });
    });
  });

  describe('upsertTokenOwners', () => {
    it('should call sql with correct parameters', async () => {
      const mockUniqueOwners = [
        {token_id: '1', owner_address: '0x123'},
        {token_id: '2', owner_address: '0x456'},
      ];

      await upsertTokenOwners(mockUniqueOwners);

      expect(sql).toHaveBeenCalledWith(
        expect.arrayContaining(mockUniqueOwners)
      );
      expect(sql).toHaveBeenCalledTimes(2);
    });
  });
});
