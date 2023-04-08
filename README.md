## Usage

Use package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) to install dependencies.

```bash
yarn install
# npm install
```

## Configure

Create file config/default.ts in the root of the app. Containing the following properties:

```javascript
export default {
  port: 1331,
  host: '',
  dbUri: '',
  saltWorkFactor: 10,
  accessTokenTtl: '15m',
  refreshTokenTtl: '1y',
  jsonWebTokenSecretOrPrivateKey: ``,
};
```
