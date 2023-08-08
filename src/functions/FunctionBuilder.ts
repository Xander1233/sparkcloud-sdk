import { VALID_MEMORY_OPTIONS, MAX_TIMEOUT_SECONDS, MIN_TIMEOUT_SECONDS, Regions, MIN_CPU_COUNTS, MAX_CPU_COUNTS, MIN_MINIMUM_INSTANCES, MAX_MINIMUM_INSTANCES } from './Constants';
export interface RuntimeOptions {
	memory?: typeof VALID_MEMORY_OPTIONS[number];
	timeoutSeconds?: number;
	cpu?: number;
	minimumInstances?: number;
};
