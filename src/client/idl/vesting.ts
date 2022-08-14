export type VestingProgram = {
  "version": "0.1.0",
  "name": "vesting_program",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "releaseInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "amountInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "unlock",
      "accounts": [
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphrase",
          "type": "string"
        }
      ]
    },
    {
      "name": "changeDestination",
      "accounts": [
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentDstTokenAccountOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "currentDstTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDstTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphrase",
          "type": "string"
        }
      ]
    },
    {
      "name": "closeAccount",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphrase",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vestingContract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dstTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "srcTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "schedules",
            "type": {
              "vec": {
                "defined": "Schedule"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Schedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "releaseTime",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidIntervalInput",
      "msg": "Invalid releaseInterval and amountInterval. Must be the same length."
    },
    {
      "code": 6001,
      "name": "ZeroUnlockAmount",
      "msg": "No outstanding unlockable balance."
    },
    {
      "code": 6002,
      "name": "UnlockAmountFirst",
      "msg": "There are outstanding unlockable balance. Please unlock balance first"
    }
  ]
};

export const IDL: VestingProgram = {
  "version": "0.1.0",
  "name": "vesting_program",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "releaseInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "amountInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "unlock",
      "accounts": [
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphrase",
          "type": "string"
        }
      ]
    },
    {
      "name": "changeDestination",
      "accounts": [
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentDstTokenAccountOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "currentDstTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDstTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphrase",
          "type": "string"
        }
      ]
    },
    {
      "name": "closeAccount",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingContract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphrase",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vestingContract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dstTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "srcTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "schedules",
            "type": {
              "vec": {
                "defined": "Schedule"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Schedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "releaseTime",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidIntervalInput",
      "msg": "Invalid releaseInterval and amountInterval. Must be the same length."
    },
    {
      "code": 6001,
      "name": "ZeroUnlockAmount",
      "msg": "No outstanding unlockable balance."
    },
    {
      "code": 6002,
      "name": "UnlockAmountFirst",
      "msg": "There are outstanding unlockable balance. Please unlock balance first"
    }
  ]
};
