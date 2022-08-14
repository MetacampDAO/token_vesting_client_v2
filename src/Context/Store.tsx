import React, { useContext, useEffect, useState, createContext } from 'react';
import { Connection } from '@solana/web3.js';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorWallet } from '@solana/wallet-adapter-react/lib/types/useAnchorWallet';
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    createInitializeMintInstruction,
    MINT_SIZE,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
} from '@solana/spl-token';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { VestingClient } from '../client/tokenVesting.client';
import { initVestingClient } from '../client/init';
import { Wallet } from '@project-serum/anchor';

interface StoreConfig {
    latestTx: string;
}

const StoreContext = createContext<StoreConfig>({
    latestTx: '',
});

export function StoreProvider({ children }: { children: any }) {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [client, setClient] = useState<VestingClient | null>(null);
    const [mintAmount, setMintAmount] = useState(0);
    const [destination, setDestination] = useState('');
    const [mintKey, setMintKey] = useState('');
    const [seedPhrase, setSeedPhrase] = useState('');
    const [latestTx, setLatestTx] = useState('');

    useEffect(() => {
        (async () => {
            if (wallet) {
                try {
                    const vestingClient = await initVestingClient(wallet as Wallet);
                    setClient(vestingClient);
                } catch (err) {
                    console.log(err);
                }
            }
        })();
    }, [wallet]);

    const signAndSendTransaction = async (
        transaction: Transaction,
        partialSign = false,
        signer: Keypair | null = null
    ) => {
        if (wallet) {
            transaction.recentBlockhash = (await connection.getLatestBlockhash('singleGossip')).blockhash;
            transaction.feePayer = wallet.publicKey;

            if (partialSign && signer) transaction.partialSign(signer);

            const signedTx = await wallet.signTransaction(transaction);
            const rawTransaction = signedTx.serialize();
            const txSig = await connection.sendRawTransaction(rawTransaction);
            return txSig;
        }
    };

    const handleCreateMint = async (mintAmount: number) => {
        if (wallet && mintAmount > 1000000) {
            const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
            const mint = Keypair.generate();
            const walletTokenAccount = await getAssociatedTokenAddress(mint.publicKey, wallet.publicKey);
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMintInstruction(mint.publicKey, 6, wallet.publicKey, wallet.publicKey),
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    walletTokenAccount,
                    wallet.publicKey,
                    mint.publicKey
                ),
                createMintToInstruction(mint.publicKey, walletTokenAccount, wallet.publicKey, mintAmount)
            );

            const txSig = await signAndSendTransaction(transaction, true, mint);

            setMintKey(mint.publicKey.toString());
            if (txSig) setLatestTx(txSig);
            console.log('txSig', txSig);
        }
    };

    const handleSubmit = async (
        client: VestingClient | null,
        mintKey: string,
        destination: string,
        seedPhrase: string
    ) => {
        if (client && wallet && mintKey && destination) {
            const to = new PublicKey(destination);
            const mintPub = new PublicKey(mintKey);
            const { createIx } = await client.create(wallet.publicKey, to, mintPub, [1, 2, 3], [1, 2, 3], seedPhrase);
            const destinationTokenAccount = await getAssociatedTokenAddress(mintPub, to);
            const transaction = new Transaction().add(
                createAssociatedTokenAccountInstruction(wallet.publicKey, destinationTokenAccount, to, mintPub),
                createIx
            );

            const txSig = await signAndSendTransaction(transaction);
            if (txSig) setLatestTx(txSig);

            console.log('Create txSig: ', txSig);
        }
    };

    const handleUnlock = async (
        client: VestingClient | null,
        mintKey: string,
        destination: string,
        seedPhrase: string
    ) => {
        if (client && wallet && mintKey && destination) {
            const { unlockIx } = await client.unlock(seedPhrase);
            const transaction = new Transaction().add(unlockIx);

            const txSig = await signAndSendTransaction(transaction);
            if (txSig) setLatestTx(txSig);

            console.log('Unlock txSig: ', txSig);
        }
    };

    const handleClose = async (
        client: VestingClient | null,
        mintKey: string,
        destination: string,
        seedPhrase: string
    ) => {
        if (client && wallet && mintKey && destination) {
            const walletTokenAccount = await getAssociatedTokenAddress(new PublicKey(mintKey), wallet.publicKey);
            const { closeContractIx } = await client.closeContract(walletTokenAccount, seedPhrase);

            const transaction = new Transaction().add(closeContractIx);

            const txSig = await signAndSendTransaction(transaction);
            if (txSig) setLatestTx(txSig);
            console.log('Close Contract txSig: ', txSig);
        }
    };

    return <StoreContext.Provider value={{ latestTx }}>{children}</StoreContext.Provider>;
}

export const useStoreContext = () => {
    const context = useContext(StoreContext);

    return {
        latestTx: context.latestTx,
    };
};
