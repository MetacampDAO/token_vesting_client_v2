import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillDownCircle, AiFillRightCircle } from 'react-icons/ai';
import Input from '../common/Input';
import { Keypair } from '@solana/web3.js';
import { ImCross } from 'react-icons/im';

const CreateContract = () => {
    const [displayMintForm, setDisplayMintForm] = useState<boolean>(false);
    const [mintAmount, setMintAmount] = useState<string>('');
    const [decimal, setDecimal] = useState<string>('');
    const [mintAddress, setMintAddress] = useState<string>('');
    const [contractId, setContractId] = useState<string>('');
    const [releaseInterval, setReleaseInterval] = useState<number[]>([]);
    const [amountInterval, setAmountInterval] = useState<number[]>([]);

    const generateRandomKey = () => {
        const { publicKey } = Keypair.generate();
        setContractId(publicKey.toString());
    };

    // Input Mint Address (Option to create mint)
    // -- Dropdown {mint supply, decimal, freeze}
    // Destination address
    // Input contract ID (Option to generate key)
    // Input value and release_time (DDMMYY)
    // AiFillDownCircle

    return (
        <div className="flex flex-col pt-6 px-6">
            <h3>Input Mint Address</h3>
            <div className="w-full md:w-7/12 flex justify-between items-center">
                <p>Wallet must be the authority of mint address</p>

                <div
                    onClick={() => setDisplayMintForm(!displayMintForm)}
                    className="flex justify-evenly cursor-pointer w-1/4 text-center md:w-1/6 inline-block items-center rounded-lg bg-sky-300 py-2.5 px-3 ml-2 text-sm font-semibold text-slate-900 hover:bg-sky-200 active:bg-sky-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50"
                >
                    {displayMintForm ? (
                        <>
                            <p className="mr-1 text-black">Close Form</p>
                            <AiFillDownCircle size={20} />
                        </>
                    ) : (
                        <>
                            <p className="mr-1 text-black">Create New Mint</p>
                            <AiFillRightCircle size={20} />
                        </>
                    )}
                </div>
            </div>
            <div
                className={`w-full md:w-7/12 flex items-center ${
                    displayMintForm ? 'h-100 mt-6' : 'h-0 overflow-hidden'
                }`}
            >
                <div className="flex w-full mr-5 md:w-7/12 flex items-center">
                    <Input handleChange={setMintAmount} value={mintAmount} placeholder="Mint supply" />
                </div>
                <div className="w-3/5 md:w-7/12 mr-5 flex items-center">
                    <Input handleChange={setDecimal} value={decimal} placeholder="Decimal" />
                </div>
                <div
                    onClick={() => setDisplayMintForm(!displayMintForm)}
                    className="w-1/5 md:w-7/12 text-center inline-block items-center rounded-lg bg-sky-300 py-2.5 px-3 ml-2 text-sm font-semibold text-slate-900 hover:bg-sky-200 active:bg-sky-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50"
                >
                    <p className="mr-1 text-black">Create Mint</p>
                </div>
            </div>
            <div className="border-t border-gray-400 w-full md:w-7/12 p-2 mt-6" />
            <div className="w-full md:w-7/12 flex items-center mt-2">
                <Input handleChange={setMintAddress} value={mintAddress} placeholder="Mint Address" />
            </div>
            <div className="w-full md:w-7/12 flex items-center mt-6">
                <Input handleChange={setContractId} value={contractId} placeholder="Contract ID" />
                <div
                    onClick={generateRandomKey}
                    className="w-full md:w-3/12 text-center inline-block items-center rounded-lg bg-sky-300 py-2.5 px-3 ml-2 text-sm font-semibold text-slate-900 hover:bg-sky-200 active:bg-sky-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50"
                >
                    <p className="mr-1 text-black">Generate ID</p>
                </div>
            </div>

            <div className="w-full md:w-7/12 flex items-center mt-6 justify-between">
                <Input
                    handleChange={setReleaseInterval}
                    value={releaseInterval[-1]}
                    placeholder="Release Date"
                    style="md:w-5/12"
                />
                <Input
                    handleChange={setAmountInterval}
                    value={amountInterval[-1]}
                    placeholder="Release Amount"
                    style="md:w-5/12"
                />
                <ImCross className="md:w-1/12" />
            </div>
        </div>
    );
};

export default CreateContract;
