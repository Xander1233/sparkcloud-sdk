import { onCall } from "./providers/https";
import { schedule } from "./providers/cron";

export { region, runWith } from "./FunctionBuilder";

export const https = {
	onCall
}

export const cron = {
	schedule
} 