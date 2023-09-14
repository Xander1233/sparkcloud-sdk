import { VALID_MEMORY_OPTIONS, MAX_TIMEOUT_SECONDS, MIN_TIMEOUT_SECONDS, Regions, MIN_CPU_COUNTS, MAX_CPU_COUNTS, MIN_MINIMUM_INSTANCES, MAX_MINIMUM_INSTANCES } from './Constants';
import { scheduleWithOptions } from './providers/pubsub';
import { HTTPSFunction, onCallWithOptions } from "./providers/https";

export interface RuntimeOptions {
	memory?: typeof VALID_MEMORY_OPTIONS[number];
	timeoutSeconds?: number;
	cpu?: number;
	minimumInstances?: number;
	labels?: string[];
	secrets?: string[];
};

export interface FunctionBuilderOptions {
	runWith?: RuntimeOptions;
	regions?: Regions;
}

function assertRunWithOptions(options: RuntimeOptions): boolean {
	if (options && typeof options !== "object") {
		throw new Error("options is not an object");
	}

	if (options && options.memory && typeof options.memory !== "string") {
		throw new Error("options.memory is not a string");
	}
	if (options && options.memory && !VALID_MEMORY_OPTIONS.includes(options.memory)) {
		throw new Error("options.memory is not a valid memory option");
	}
	if (!options || (!options.memory && !options.timeoutSeconds)) {
		throw new Error("options is empty");
	}

	if (options && options.timeoutSeconds && typeof options.timeoutSeconds !== "number") {
		throw new Error("options.timeoutSeconds is not a number");
	}
	if (options && options.timeoutSeconds && (options.timeoutSeconds < MIN_TIMEOUT_SECONDS || options.timeoutSeconds > MAX_TIMEOUT_SECONDS)) {
		throw new Error("options.timeoutSeconds is not a valid timeout option");
	}

	if (options && options.cpu && (options.cpu < MIN_CPU_COUNTS || options.cpu > MAX_CPU_COUNTS)) {
		throw new Error("options.cpu is not a valid cpu option");
	}

	if (options && options.minimumInstances && (options.minimumInstances < MIN_MINIMUM_INSTANCES || options.minimumInstances > MAX_MINIMUM_INSTANCES)) {
		throw new Error("options.minimumInstances is not a valid minimumInstances option");
	}

	const labelsRegex = /^[a-z_\-\/]{1,64}$/g;
	const invalidLabels = (options.labels ?? []).filter(label => !labelsRegex.test(label));
	if (options && options.labels && invalidLabels.length > 0) {
		throw new Error(`Invalid labels: ${invalidLabels.join(", ")}. Labels can only contain lowercase letters, underscores, dashes, and forward slashes.`);
	}

	const secretsRegex = /^[A-Za-z_\-\/]{1,64}$/g;
	const invalidSecrets = (options.secrets ?? []).filter(secret => !secretsRegex.test(secret));
	if (options && options.secrets && invalidSecrets.length > 0) {
		throw new Error(`Invalid secrets: ${invalidSecrets.join(", ")}. Secrets can only contain uppercase letters, lowercase letters, underscores, dashes, and forward slashes.`);
	}

	return true;
}

function assertRegionOptions(regions: Regions): boolean {
	if (!Array.isArray(regions)) {
		throw new Error("regions is not an array");
	}

	if (regions.length === 0) {
		throw new Error("regions is empty");
	}

	return true;
}

export function region(...regions: Regions): FunctionBuilder {
	if (assertRegionOptions(regions)) {
		return new FunctionBuilder({ regions });
	}
}

export function runWith(runtimeOptions: RuntimeOptions): FunctionBuilder {
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

	public region(...regions: Regions): this {
		if (assertRegionOptions(regions)) {
			this._regions = regions;
			return this;
		}
	}

	public runWith(runtimeOptions: RuntimeOptions): this {
		if (assertRunWithOptions(runtimeOptions)) {
			this._runtimeOptions = runtimeOptions;
			return this;
		}
	}

	public get https() {
		return {
			onCall: (handler: (data: { body: any }, context: { auth?: { uid: string } }) => any): HTTPSFunction => {
				return onCallWithOptions(handler, { regions: this.regions, runWith: this.runtimeOptions });
			}
		}
	}

	public get pubsub() {
		return {
			schedule: (schedule: string) => {
				return scheduleWithOptions(schedule, { regions: this.regions, runWith: this.runtimeOptions });
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