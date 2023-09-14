import { Regions } from "../Constants";
import { RuntimeOptions } from "../FunctionBuilder";
import { Runnable } from "./base";

export function schedule(schedule: string): PubsubBuilder {
	return scheduleWithOptions(schedule, { regions: [ "eu-central" ], runWith: { memory: "128m", timeoutSeconds: 15, cpu: 1, minimumInstances: 0 } });
}

export function scheduleWithOptions(schedule: string, options: { regions: Regions, runWith: RuntimeOptions }): PubsubBuilder {
	return new PubsubBuilder(schedule, options);
}

class PubsubBuilder {
	
	public regions: Regions = [ "eu-central" ];
	public runtimeOptions: RuntimeOptions = {
		memory: "128m",
		timeoutSeconds: 15,
		cpu: 1,
		minimumInstances: 0
	};
	public schedule: string;
	
	constructor(trigger: string, options: { regions: Regions, runWith: RuntimeOptions }) {
		this.schedule = trigger;
		
		if (options.regions) {
			this.regions = options.regions;
		}

		if (options.runWith) {
			this.runtimeOptions = options.runWith;
		}
	}

	public onRun(handler: () => any): Runnable {
		return new CRONFunction(handler, { regions: this.regions, runWith: this.runtimeOptions }, { schedule: this.schedule });
	}
}

export class CRONFunction extends Runnable {
	public type: 'schedule' = 'schedule';
	public handler: () => any;
	public options: { regions: Regions, runWith: RuntimeOptions };
	public trigger: { schedule: string };

	constructor(handler: () => any, options: { regions: Regions, runWith: RuntimeOptions }, trigger: { schedule: string }) {
		super();
		this.handler = handler;
		this.options = options;
		this.trigger = trigger;
	}
}