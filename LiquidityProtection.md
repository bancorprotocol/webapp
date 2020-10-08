# Bancor V2.1

- Support of single reserve deposits on V1 pools.
- Impermanent loss insurance for long term depositors.

## Dictionary

- LP (Liquidity Provider) is an investor, generally member of the public who deposits their tokens into a pool typically in hope of a return on investment.
- Oracle is a trusted source of truth for external events being reported onto the Blockchain. E.g. Chainlink may report the latest price of `ETH` in USD for other smart contracts to utilise.
- **Pool spot rate** is the trade price between two of a pools reserves without slippage included.
- `TKN`, `TOKEN` or `Base Token` is any token part of the community often paired against `BNT`, this includes `ETH`, `REAL`, `ANT`, etc.

## Background

In today's Bancor, Liquidity Providers on V1 pools are forced to provide liquidity for all (typically 2) reserves in amounts of equal value, exposing LP's to any loss in market price of the combined value of the reserves (impermanent loss).

V2 pools were created which support two reserve tokens and enabling LP's to deposit and be mostly exposed to only one of the tokens.

Some additional overhead is required to maintain these pools are they are more complicated and require support from a Chainlink oracle in order to work.

Bancor V2.1 brings single reserve deposits to liquidity providers **without** the use of Oracles, fully functional on chain.

## The Magic

As noted above, deposits of liquidity towards a V1 pool require deposits of equal value, e.g. \$50 of `ETH` and \$50 of BNT in the `ETH/BNT` pool.

Because `BNT` is the most common token reserve across the majority of pools, Bancor V2.1 takes advantage of this by allowing dynamic minting and burning of `BNT`.

Therefore, in the case of depositing `ETH` towards the `ETH/BNT` relay, a liquidity provider need only provide `ETH` and the contract will mint and invest the same amount of value in `BNT`.

There is a bonus incentive of performing the inverse of this, depositing `BNT` instead of `ETH` to a `ETH/BNT` pool (or any other.) where the user may earn `gBNT`.

## gBNT

gBNT is Bancor's new governance unlocking powers on the Bancor DAO.

# Adding Liquidity

### Base Token

- Receive Base Token and calculate the opposing value in BNT
- Mints this amount of BNT and adds liquidity to the converter
- Half of the pool tokens are added to the 'system's global amount of pool tokens.
- Half of the remaining pool tokens are added to Liquidity Protection diary recording the time and the base token the user invested.

User receives nothing back, Liquidity is protected by this diary instance, % of his investment protected is based on how long he leaves it there.

### Network Token (BNT)

- Receive BNT and work out how much it's worth in pool tokens
- If the system does not have at least this amount in its global amount, the transaction will fail.
- Remove the pool token amount from the system's global amount.
- Add it to the protection diary recording the amount of BNT protected along with the pool token amount.
- Burn the BNT.
- Reward the user with gBNT.

It writes in the diary...

- The liquidity providers account
- Pool token and amount
- Reserve token and amount
- Reserves trade rate (Spot price/slippageless price) to buy the opposing reserve token.
- Time of trade

Globally, it writes
The total amount of the pool token it's protecting
The total amount of the reserve token it's protecting under that particular pool.

The time is recorded as the user gains more protection the longer he protects it, achieving max protection after.

If below minimum time, no protection % at all
If above maximum time 100% protection.
If in the middle, based on how far you got through.

# Removing Liquidity

This works by allowing grabbing the amount worth in pool tokens placed in, deleting the users diary entry and returning the pool tokens back into the 'system'

## Base Token

User references their diary log and % of how much they want to take out.
Destroy the diary log and add the pool token amount recorded in the diary back into the systems global amount.

_When removing a network token, destroy the LP's amount of gBNT_

Find the current trade price of the pools reserves based on a recent average.

When removing a base token, the converters `removeLiquidity` method is called, where it will dissolve an unknown amount of smart tokens and give one of the reserves proceeds to the user.

When withdrawing Token and compensated enough, destroy the BNT.
When withdrawing Token and **not** compensated enough, it will use the BNT withdrawn + mints new BNT if it needs to and compensates the user that way.

When withdrawing BNT

## Network Token (BNT)

When taking back the protected liquidity,

He goes back to the Liquidity Protection contract

And mentions which record in the database he's referring too, and how much %
wise he wants to take out.

In the case of 100%

Removes the diary instance completely.
Give itself the pool tokens back it was 'protecting', going back from the store
Burn the users gBNT
Get the current rate between the two tokens of the pool
Work out the 'factor' comparing the original rate and the current rate;
Using the factor calculating impermanent loss, mint this amount of BNT and
lockThem for 24 hours with the users name against it.

User can come back 24 hours later and claim their tokens.

If the user is removing a base token, (Not BNT) it will determine by the rates to see if

## Locking

The locking idea is designed to prevent panic liquidation.
