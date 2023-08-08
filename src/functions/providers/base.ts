import { Regions } from "../Constants";
import { RuntimeOptions } from "../FunctionBuilder";

export abstract class Runnable {
	public abstract type: 'schedule' | 'https';
	public abstract handler: (...args: any[]) => any;
	public abstract options: { regions: Regions, runWith: RuntimeOptions };
}