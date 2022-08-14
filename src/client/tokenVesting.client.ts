import * as anchor from '@project-serum/anchor';
import { Idl, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { VestingProgram } from './idl/vesting';
import { AccountUtils } from './common/account-utils';

export class VestingClient extends AccountUtils {
    wallet: anchor.Wallet;
    provider!: anchor.Provider;
    vestingProgram!: anchor.Program<VestingProgram>;

    constructor(conn: Connection, wallet: anchor.Wallet, idl?: Idl, programId?: PublicKey) {
        super(conn);
        this.wallet = wallet;
        this.setProvider();
        this.setVestingProgram(idl, programId);
    }

    setProvider() {
        this.provider = new AnchorProvider(this.conn, this.wallet, AnchorProvider.defaultOptions());
        anchor.setProvider(this.provider);
    }

    setVestingProgram(idl?: Idl, programId?: PublicKey) {
        //instantiating program depends on the environment
        if (idl && programId) {
            //means running in prod
            this.vestingProgram = new anchor.Program<VestingProgram>(idl as any, programId, this.provider);
        }
    }

    // --------------------------------------- fetch deserialized accounts

    async fetchVestingContract(passphrase: string) {
        const [vestingContract] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(anchor.utils.bytes.utf8.encode(passphrase))],
            this.vestingProgram.programId
        );

        const vestingContractInfo = await this.vestingProgram.account.vestingContract.fetch(vestingContract);

        return vestingContractInfo;
    }

    // --------------------------------------- find PDA addresses

    async findVestingTokenAccount(vestingContract: PublicKey, mintAddress: PublicKey) {
        const [vestingTokenAccount] = await anchor.web3.PublicKey.findProgramAddress(
            [mintAddress.toBuffer(), vestingContract.toBuffer()],
            this.vestingProgram.programId
        );

        return vestingTokenAccount;
    }

    async findVestingContractAddress(passphrase: string) {
        const [vestingContract] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(anchor.utils.bytes.utf8.encode(passphrase))],
            this.vestingProgram.programId
        );

        return vestingContract;
    }

    // --------------------------------------- find all PDA addresses

    async findAllVestingContractByManagerKey(managerTokenAccount: PublicKey) {
        const filter = [
            {
                memcmp: {
                    offset: 8 + 32, //prepend for anchor's discriminator & tokenAccount
                    bytes: managerTokenAccount.toBase58(),
                },
            },
        ];
        return this.vestingProgram.account.vestingContract.all(filter);
    }

    // --------------------------------------- vesting ixs

    async create(
        manager: PublicKey,
        employee: PublicKey,
        mintKey: PublicKey,
        releaseInterval: number[],
        amountInterval: number[],
        seedphase: string
    ) {
        const managerTokenAccount = await getAssociatedTokenAddress(mintKey, manager);
        const employeeTokenAccount = await getAssociatedTokenAddress(mintKey, employee);

        const parsedReleaseInterval = releaseInterval.map((v) => new anchor.BN(v));
        const parsedAmountInterval = amountInterval.map((v) => new anchor.BN(v));

        const vestingContract = await this.findVestingContractAddress(seedphase);

        const vestingTokenAccount = await this.findVestingTokenAccount(vestingContract, mintKey);

        const createIx = await this.vestingProgram.methods
            .create(parsedReleaseInterval, parsedAmountInterval, seedphase)
            .accounts({
                initializer: manager,
                vestingContract,
                srcTokenAccount: managerTokenAccount,
                dstTokenAccount: employeeTokenAccount,
                vestingTokenAccount,
                mintAddress: mintKey,
            })
            .instruction();

        return { createIx };
    }

    async unlock(seedphase: string) {
        const vestingContract = await this.findVestingContractAddress(seedphase);
        const vestingContractInfo = await this.fetchVestingContract(seedphase);

        const vestingTokenAccount = await this.findVestingTokenAccount(
            vestingContract,
            vestingContractInfo.mintAddress
        );

        const unlockIx = await this.vestingProgram.methods
            .unlock(seedphase)
            .accounts({
                vestingContract,
                vestingTokenAccount,
                dstTokenAccount: vestingContractInfo.dstTokenAccount,
                clock: SYSVAR_CLOCK_PUBKEY,
            })
            .instruction();

        return { unlockIx };
    }

    async changeDestination(seedphase: string, currentDestination: PublicKey, newDestination: PublicKey) {
        const vestingContract = await this.findVestingContractAddress(seedphase);
        const vestingContractInfo = await this.fetchVestingContract(seedphase);
        const newDestinationTokenAccount = await getAssociatedTokenAddress(
            vestingContractInfo.mintAddress,
            newDestination
        );

        const changeDestinationIx = await this.vestingProgram.methods
            .changeDestination(seedphase)
            .accounts({
                vestingContract,
                currentDstTokenAccount: vestingContractInfo.dstTokenAccount,
                currentDstTokenAccountOwner: currentDestination,
                newDstTokenAccount: newDestinationTokenAccount,
            })
            .instruction();

        return { changeDestinationIx };
    }

    async closeContract(callerPublicKey: PublicKey, seedphase: string) {
        const vestingContract = await this.findVestingContractAddress(seedphase);
        const vestingContractInfo = await this.fetchVestingContract(seedphase);
        const vestingTokenAccount = await this.findVestingTokenAccount(
            vestingContract,
            vestingContractInfo.mintAddress
        );

        const closeContractIx = await this.vestingProgram.methods
            .closeAccount(seedphase)
            .accounts({
                initializer: callerPublicKey,
                vestingContract,
                vestingTokenAccount,
                srcTokenAccount: vestingContractInfo.srcTokenAccount,
                clock: SYSVAR_CLOCK_PUBKEY,
            })
            .instruction();

        return { closeContractIx };
    }
}
