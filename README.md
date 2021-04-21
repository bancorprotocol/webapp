# Bancor Web App

## About

Open Source Token Swap and Pool Liquidity Portal

## House keeping

_All times in UTC_

### Development Team

Daily standups

- 7:45 am

#### Weekday work times

|                 | City                                                                |
| --------------- | ------------------------------------------------------------------- |
| John Williamson | [Brisbane](https://www.timeanddate.com/worldclock/australia/)       |
| Jan Langheimer  | [Freiburg](https://www.timeanddate.com/worldclock/germany/freiburg) |
| Ran Cohen       | [Tel Aviv](https://www.timeanddate.com/worldclock/israel/tel-aviv)  |

### Git Strategy

Please create new features as Pull Requests in new branches forked from `master` and be sure any work in progress is marked as a **Draft**.

![DraftPR](https://github.com/bancorprotocol/webapp/raw/master/docs/media/draftPr.png)

- Always link new PRs to their original issue.
- Every branch is a feature branch, If the feature is a large change and needs to be splitted into smaller branches, we branch from said feature branch instead of master and return to it when the work is done.
- Assign Asaf as a reviewer and tag the Bancor v2 project for anything to be reviewed prior to going into production.

## Project setup

Node Version: `14.16.0`

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
