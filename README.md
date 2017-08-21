# sm-808-time

A CLI drum machine written in JavaScript.

[Link to Original Requirements](https://github.com/splicers/sm-808)

![Gif of CLI running](http://g.recordit.co/palDcZVK3B.gif)

## Running Locally

- Pull down this repository: `git clone git@github.com:rrgayhart/sm-808-time.git`
- Install dependencies: `npm install`
- To run the script: `npm start`
- To run the tests: `npm test`
- To run the linter: `npm run lint` or `npm run lintf` (note: you will need [eslint](https://www.npmjs.com/package/eslint) installed globally)

## Implementation Notes

In an effort to limit dependencies, the following tools were used:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com) for package management
- [mocha](https://www.npmjs.com/package/mocha) for testing
- [chai](https://www.npmjs.com/package/chai) for testing assertions
- [eslint](https://www.npmjs.com/package/eslint) during development

JavaScript ES5 syntax was used so as to not introduce [Babel](https://babeljs.io/)

## Resources Used

[The Original Requirements](https://github.com/splicers/sm-808) contained many helpful tips - including an interval calculation that was referenced.

Colors used in the commandline interface were pulled from [bodi0's](https://stackoverflow.com/users/632524/bodi0) [Stack Overflow response](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color)

The [heartbeats](https://github.com/arjunmehta/heartbeats) repo was a helpful reference for thinking about creating a pulse in node!

## Creating a New Song

![new song](sm-808-time/docs/new.png?raw=true )

## Using a Sample Song

![sample song](sm-808-time/docs/sample.png?raw=true )

## Warning Messages

![warning](sm-808-time/docs/warning.png?raw=true )

## Patterns pad up to 8, 16 or 32

![showing paddern padding](sm-808-time/docs/error-padding.png?raw=true )
