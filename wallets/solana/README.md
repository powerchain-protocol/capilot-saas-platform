# Solana wallet registry

This directory is intentionally **public-key only**. `keypairs.json` is metadata, not a Solana secret-key file. Never commit private keys, seed phrases, mnemonics, JSON secret arrays, or signing material. Runtime signing belongs in a wallet/HSM/KMS boundary outside this repository.
