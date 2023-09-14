import * as functions from '../../src';

describe("Https functions", () => {
	it("should create a https function with default configurations", () => {
		const httpsFunction = functions
			.https
			.onCall((data, context) => {
				return "Hello world";
			});

		expect(httpsFunction.options.regions).toEqual(["eu-central"]);
		expect(httpsFunction.options.runWith).toEqual({ memory: "128m", timeoutSeconds: 15, cpu: 1, minimumInstances: 0 });
		expect(httpsFunction.type).toEqual("https");
		expect(httpsFunction.handler).toBeDefined();
		expect(httpsFunction.handler({body:"", context:{}})).toEqual("Hello world");
		expect(httpsFunction.handler({body:"", context:{}})).toEqual("Hello world");
	});

	it("should create a https function in us-central with default runtime options", () => {
		const httpsFunction = functions
			.region("us-central")
			.https
			.onCall((data, context) => {
				return "Hello world from us-central";
			});

		expect(httpsFunction.options.regions).toEqual(["us-central"])
		expect(httpsFunction.options.runWith).toEqual({ memory: "128m", timeoutSeconds: 15, cpu: 1, minimumInstances: 0 });
		expect(httpsFunction.type).toEqual("https");
		expect(httpsFunction.handler).toBeDefined();
		expect(httpsFunction.handler({body:""}, {})).toEqual("Hello world from us-central");
		expect(httpsFunction.handler({body: ""}, {})).toEqual("Hello world from us-central");
	});

	it("should create a https function in us-central and eu-central with default runtime options", () => {
		const httpsFunction = functions
			.region("us-central", "eu-central")
			.https
			.onCall((data, context) => {
				return "Hello world from us-central and eu-central";
			});

		expect(httpsFunction.options.regions).toEqual(["us-central", "eu-central"])
		expect(httpsFunction.options.runWith).toEqual({ memory: "128m", timeoutSeconds: 15, cpu: 1, minimumInstances: 0 });
		expect(httpsFunction.type).toEqual("https");
		expect(httpsFunction.handler).toBeDefined();
		expect(httpsFunction.handler({body: ""}, {})).toEqual("Hello world from us-central and eu-central");
		expect(httpsFunction.handler({body:""}, {})).toEqual("Hello world from us-central and eu-central");
	});

	it("should create a https function with 2gb of memory, a timeout threshold of 20 seconds, 2 cpu cores, and 5 minimum instances", () => {
		const httpsFunction = functions
			.runWith({ memory: '2g', timeoutSeconds: 20, cpu: 2, minimumInstances: 5 })
			.https
			.onCall((data, context) => {
				return "Hello world";
			});

		expect(httpsFunction.options.regions).toEqual(["eu-central"])
		expect(httpsFunction.options.runWith).toEqual({ memory: "2g", timeoutSeconds: 20, cpu: 2, minimumInstances: 5 });
		expect(httpsFunction.type).toEqual("https");
		expect(httpsFunction.handler).toBeDefined();
		expect(httpsFunction.handler({ body:"" }, {})).toEqual("Hello world");
		expect(httpsFunction.handler({ body:"" }, {})).toEqual("Hello world");
	});

	it("should not create a https function", () => {
		const createFunction = () => {
			const httpsFunction = functions
			.runWith({ memory: '2g', timeoutSeconds: 9000, cpu: 20, minimumInstances: 5000 })
			.https
			.onCall((data, context) => {
				return "Hello world";
			});
		}

		expect(createFunction).toThrow();

	});
})