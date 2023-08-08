import { Regions } from "../Constants";
import { RuntimeOptions } from "../FunctionBuilder";
import { Runnable } from "./base";

export function schedule(cron: string): ScheduleBuilder {
	return scheduleWithOptions(cron, { regions: [ "eu-central" ], runWith: { memory: "128m", timeoutSeconds: 15, cpu: 1, minimumInstances: 0 } });
}

export function scheduleWithOptions(cron: string, options: { regions: Regions, runWith: RuntimeOptions }): ScheduleBuilder {
	return new ScheduleBuilder(cron, options);
}

class ScheduleBuilder {
	
	private regions: Regions = [ "eu-central" ];
	private runtimeOptions: RuntimeOptions = {
		memory: "128m",
		timeoutSeconds: 15,
		cpu: 1,
		minimumInstances: 0
	};
	private cron: string;
	
	constructor(trigger: string, options: { regions: Regions, runWith: RuntimeOptions }) {
		this.cron = trigger;
		
		if (options.regions) {
			this.regions = options.regions;
		}

		if (options.runWith) {
			this.runtimeOptions = options.runWith;
		}
	}

	public onRun(handler: () => any): Runnable {
		return new CRONFunction(handler, { regions: this.regions, runWith: this.runtimeOptions }, { cron: this.cron });
	}
}

export class CRONFunction extends Runnable {
	public type: 'schedule' = 'schedule';
	public handler: () => any;
	public options: { regions: Regions, runWith: RuntimeOptions };
	public trigger: { cron: string };

	constructor(handler: () => any, options: { regions: Regions, runWith: RuntimeOptions }, trigger: { cron: string }) {
		super();
		this.handler = handler;
		this.options = options;
		this.trigger = trigger;
	}
}