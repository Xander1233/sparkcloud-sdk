import { onCall } from "./providers/https";
import { schedule } from "./providers/pubsub";

export { region, runWith } from "./FunctionBuilder";

export const https = {
	onCall
}

export const pubsub = {
	schedule
}
