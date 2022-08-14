import { useConnection } from '@solana/wallet-adapter-react';
import { AnchorWallet } from '@solana/wallet-adapter-react/lib/types/useAnchorWallet';
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    createMintToInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
} from '@solana/spl-token';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { VestingClient } from '../client/tokenVesting.client';

export const signAndSendTransaction = async (
    transaction: Transaction,
    wallet: AnchorWallet,
    connection: Connection,
    partialSign = false,
    signer: Keypair | null = null
) => {
    transaction.recentBlockhash = (await connection.getLatestBlockhash('singleGossip')).blockhash;
    transaction.feePayer = wallet.publicKey;

    if (partialSign && signer) transaction.partialSign(signer);

    const signedTx = await wallet.signTransaction(transaction);
    const rawTransaction = signedTx.serialize();
    const txSig = await connection.sendRawTransaction(rawTransaction);
    return txSig;
};

export const handleCreateMint = async (
    mintAmount: number,
    wallet: AnchorWallet | undefined,
    connection: Connection,
    setLatestTx: React.Dispatch<React.SetStateAction<string>>,
    setMintKey: React.Dispatch<React.SetStateAction<string>>
) => {
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

        const txSig = await signAndSendTransaction(transaction, wallet, connection, true, mint);

        setMintKey(mint.publicKey.toString());
        setLatestTx(txSig);
        console.log('txSig', txSig);
    }
};

export const handleSubmit = async (
    client: VestingClient | null,
    wallet: AnchorWallet | undefined,
    connection: Connection,
    mintKey: string,
    destination: string,
    seedPhrase: string,
    setLatestTx: React.Dispatch<React.SetStateAction<string>>
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

        const txSig = await signAndSendTransaction(transaction, wallet, connection);
        setLatestTx(txSig);

        console.log('Create txSig: ', txSig);
    }
};

export const handleUnlock = async (
    client: VestingClient | null,
    wallet: AnchorWallet | undefined,
    connection: Connection,
    mintKey: string,
    destination: string,
    seedPhrase: string,
    setLatestTx: React.Dispatch<React.SetStateAction<string>>
) => {
    if (client && wallet && mintKey && destination) {
        const { unlockIx } = await client.unlock(seedPhrase);
        const transaction = new Transaction().add(unlockIx);

        const txSig = await signAndSendTransaction(transaction, wallet, connection);
        setLatestTx(txSig);

        console.log('Unlock txSig: ', txSig);
    }
};

export const handleClose = async (
    client: VestingClient | null,
    wallet: AnchorWallet | undefined,
    connection: Connection,
    mintKey: string,
    destination: string,
    seedPhrase: string,
    setLatestTx: React.Dispatch<React.SetStateAction<string>>
) => {
    if (client && wallet && mintKey && destination) {
        const walletTokenAccount = await getAssociatedTokenAddress(new PublicKey(mintKey), wallet.publicKey);
        const { closeContractIx } = await client.closeContract(walletTokenAccount, seedPhrase);

        const transaction = new Transaction().add(closeContractIx);

        const txSig = await signAndSendTransaction(transaction, wallet, connection);
        setLatestTx(txSig);
        console.log('Close Contract txSig: ', txSig);
    }
};
