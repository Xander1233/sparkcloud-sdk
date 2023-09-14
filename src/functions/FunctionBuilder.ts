import { VALID_MEMORY_OPTIONS, MAX_TIMEOUT_SECONDS, MIN_TIMEOUT_SECONDS, Regions, MIN_CPU_COUNTS, MAX_CPU_COUNTS, MIN_MINIMUM_INSTANCES, MAX_MINIMUM_INSTANCES } from './Constants';
import { scheduleWithOptions } from './providers/cron';
import { onCall, onCallWithOptions } from "./providers/https";

export interface RuntimeOptions {
	memory?: typeof VALID_MEMORY_OPTIONS[number];
	timeoutSeconds?: number;
	cpu?: number;
	minimumInstances?: number;
};

interface FunctionBuilderOptions {
	runWith?: RuntimeOptions;
	regions?: Regions;
}

function assertRunWithOptions(options: RuntimeOptions): boolean {
	if (options && typeof options !== "object") {
		console.log("options is not an object");
		return false;
	}

	if (options && options.memory && typeof options.memory !== "string") {
		console.log("options.memory is not a string");
		return false;
	}

	if (options && options.timeoutSeconds && typeof options.timeoutSeconds !== "number") {
		console.log("options.timeoutSeconds is not a number");
		return false;
	}

	if (options && options.memory && !VALID_MEMORY_OPTIONS.includes(options.memory)) {
		console.log("options.memory is not a valid memory option");
		return false;
	}

	if (!options || (!options.memory && !options.timeoutSeconds)) {
		console.log("options is empty");
		return false;
	}

	if (options && options.timeoutSeconds && (options.timeoutSeconds < MIN_TIMEOUT_SECONDS || options.timeoutSeconds > MAX_TIMEOUT_SECONDS)) {
		console.log("options.timeoutSeconds is not a valid timeout option");
		return false;
	}

	if (options && options.cpu && (options.cpu < MIN_CPU_COUNTS || options.cpu > MAX_CPU_COUNTS)) {
		console.log("options.cpu is not a valid cpu option");
		return false;
	}

	if (options && options.minimumInstances && (options.minimumInstances < MIN_MINIMUM_INSTANCES || options.minimumInstances > MAX_MINIMUM_INSTANCES)) {
		console.log("options.minimumInstances is not a valid minimumInstances option");
		return false;
	}

	return true;
}

function assertRegionOptions(regions: Regions): boolean {
	if (!Array.isArray(regions)) {
		console.log("regions is not an array");
		return false;
	}

	if (regions.length === 0) {
		console.log("regions is empty");
		return false;
	}

	return true;
}

export function region(...regions: Regions) {
	if (assertRegionOptions(regions)) {
		return new FunctionBuilder({ regions });
	}
}

export function runWith(runtimeOptions: RuntimeOptions) {
	if (assertRunWithOptions(runtimeOptions)) {
		return new FunctionBuilder({ runWith: runtimeOptions });
	}
}

export class FunctionBuilder {

	private _regions: Regions = [ "eu-central" ];
	private _runtimeOptions: RuntimeOptions = {
		memory: "128m",
		timeoutSeconds: 15,
		cpu: 1,
		minimumInstances: 0
	};

	constructor(options: FunctionBuilderOptions) {
		if (options.regions) {
			this._regions = options.regions;
		}

		if (options.runWith) {
			this._runtimeOptions = options.runWith;
		}
	}

	public region(...regions: Regions) {
		if (assertRegionOptions(regions)) {
			this._regions = regions;
			return this;
		}
		throw new Error("Invalid regions");
	}

	public runWith(runtimeOptions: RuntimeOptions) {
		if (assertRunWithOptions(runtimeOptions)) {
			this._runtimeOptions = runtimeOptions;
			return this;
		}
		throw new Error("Invalid runtime options");
	}

	public get https() {
		return {
			onCall: (handler: (data: { body: any }, context: { auth?: { uid: string } }) => any) => {
				return onCallWithOptions(handler, { regions: this.regions, runWith: this.runtimeOptions });
			}
		}
	}

	public get cron() {
		return {
			schedule: (cron: string) => {
				return scheduleWithOptions(cron, { regions: this.regions, runWith: this.runtimeOptions });
			}
		}
	}

	public get regions() {
		return this._regions;
	}

	public get runtimeOptions() {
		return this._runtimeOptions;
	}
}