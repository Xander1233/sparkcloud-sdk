import { Regions } from "../Constants";
import { RuntimeOptions } from "../FunctionBuilder";
import { Runnable } from "./base";

export function onCall(handler: (data: { body: any }, context: { auth?: { uid: string } }) => any): HTTPSFunction & Runnable {
	return onCallWithOptions(handler, { regions: [ 'europe-central1' ], runWith: { memory: "128m", timeoutSeconds: 15, cpu: 1, minimumInstances: 0, labels: [], secrets: [] } });
}

export function onCallWithOptions(handler: (data: { body: any }, context: { auth?: { uid: string } }) => any, options: { regions: Regions, runWith: RuntimeOptions }): HTTPSFunction & Runnable {
	return new HTTPSFunction(handler, options);
}

export class HTTPSFunction extends Runnable {
	public type: 'https' = 'https';
	public handler: (data: { body: any }, context: { auth?: { uid: string } }) => any;
	public options: { regions: Regions, runWith: RuntimeOptions };

	constructor(handler: (data: { body: any }, context: { auth?: { uid: string } }) => any, options: { regions: Regions, runWith: RuntimeOptions }) {
		super();
		this.handler = handler;
		this.options = options;
	}
}
