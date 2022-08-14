import { Connection, PublicKey } from '@solana/web3.js';
import { VestingClient } from './tokenVesting.client';
import * as idl from './idl/vesting.json';
import { Wallet } from '@project-serum/anchor';

const VESTING_PROG_ID = new PublicKey('EdP6kpjnqzx4edy6L1VLHtuBJxhze5Kv4uewFKCmSj5p');

export const conn: Connection = new Connection('https://api.devnet.solana.com');

export async function initVestingClient(wallet: Wallet) {
    return new VestingClient(conn, wallet, idl as any, VESTING_PROG_ID);
}
