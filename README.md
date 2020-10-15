# Bancor Web App

## About

Open Source Token Swap and Pool Liquidity Portal

## House keeping

_All times in UTC_

### Development Team

Daily standups

- 8:00 am
- 10:00 pm

#### Weekday work times

|                 | City                                                                 | Start   | End     |
| --------------- | -------------------------------------------------------------------- | ------- | ------- |
| John Williamson | [Brisbane](https://www.timeanddate.com/worldclock/australia/)        | 10:00pm | 8:00am  |
| Jan Langheimer  | [Freiburg](https://www.timeanddate.com/worldclock/germany/freiburg)  | 7:00am  | 4:00pm  |
| Dmitry          | [Dnipro](https://www.timeanddate.com/worldclock/ukraine/dnipro)      | 12:00pm | 10:00pm |
| Gury            | [Jerusalem](https://www.timeanddate.com/worldclock/israel/jerusalem) |         |         |

### Git Strategy

Please create new features in new branches forked from `staging` and submit work at the end of your session as a Drafted PR towards staging.

![DraftPR](https://github.com/bancorprotocol/webapp/raw/master/docs/media/draftPr.png)

## Project setup

Node Version: `12.18.2`

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn start
```

### Compiles and minifies for production

```
yarn build
```

## House keeping

_All times in UTC_

### Development Team

Daily standups

- 7:15 am

#### Weekday work times

|                 | City                                                                   | Status                 |
| --------------- | ---------------------------------------------------------------------- | ---------------------- |
| John Williamson | [Brisbane](https://www.timeanddate.com/worldclock/australia/brisbane/) | Full Time              |
| Jan Lghr        | [Stuttgart](https://www.timeanddate.com/worldclock/germany/stuttgart)  | Full Time              |
| Sebastian       | [Berlin](https://www.timeanddate.com/worldclock/germany/berlin)        | Full Time              |
| Gury            | [Jerusalem](https://www.timeanddate.com/worldclock/israel/jerusalem)   | 2 days throughout week |

### Git Strategy

Please create new features in new branches forked from `staging` and submit work at the end of your session as a Drafted PR towards staging.

## Liquidity Protection Terminology

Single Reserve Token Staking / Single mode: Protecting a bare reserve token, either reserve tokens of a pool. BNT or ETH or Whatever.

Pool Token Staking / Double mode: Protecting pool tokens for a pool.

Whitelisted pools support both single mode and double mode.

- Most cases the user will wanna single mode.
- But if the user is already holding pool tokens, they might still want to stake them to a whitelisted pool, which 'Protect My Token' needs to go to.

Non-whitelisted pools only support double mode.
