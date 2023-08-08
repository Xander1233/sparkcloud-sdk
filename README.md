# SparkCloud SDK

The SparkCloud SDK is used to create cloud functions to be run on SparkCloud.

## Installation

Run the following command to install the SDK:

```bash
$ npm install sparkcloud-sdk
```

## Usage

```javascript
import * as functions from 'sparkcloud-sdk';

export const helloWorld = functions.https.onCall((data, context) => {
  return { message: `Hello, ${data.name}!` };
});
```

## License

All files in this repository are licensed under the MIT license. For more information, see the LICENSE file in the sparkcloud-sdk root directory.
