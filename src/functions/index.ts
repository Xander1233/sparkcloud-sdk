import { onCall } from "./providers/https";
import { schedule } from "./providers/pubsub";
import { HTTPError } from "./util/HTTPError";

export { region, runWith } from "./FunctionBuilder";

export const https = {
	onCall,
	HTTPError: HTTPError
}

export const pubsub = {
	schedule
}
