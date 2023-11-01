export function HTTPError(status: HTTPErrorStatus, message: string, details?: unknown) {
	throw new HTTPErrorObject(status, message, details);
}

export class HTTPErrorObject extends Error {
	public code: number;
	public status: string;
	public details?: unknown;

	constructor(status: HTTPErrorStatus, message: string, details?: unknown) {
		super(message);

		const { code, statusName } = STATUS_TO_ERROR_OBJ[status];

		this.code = code;
		this.status = statusName;
		this.details = details;
	}

	public toJSON() {
		return {
			code: this.code,
			status: this.status,
			details: this.details,
			message: this.message
		};
	}
}

export type HTTPErrorStatus = "ok" | "cancelled" | "unknown" | "invalid-argument" | "deadline-exceeded" | "not-found" | "already-exists" | "permission-denied" | "resource-exhausted" | "failed-precondition" | "aborted" | "out-of-range" | "unimplemented" | "internal" | "unavailable" | "data-loss" | "unauthenticated";

export const STATUS_TO_ERROR_OBJ: Record<HTTPErrorStatus, { code: number, statusName: string }> = {
	"ok": { code: 200, statusName: "OK" },
	"cancelled": { code: 499, statusName: "CANCELLED" },
	"unknown": { code: 500, statusName: "UNKNOWN" },
	"invalid-argument": { code: 400, statusName: "INVALID_ARGUMENT" },
	"deadline-exceeded": { code: 504, statusName: "DEADLINE_EXCEEDED" },
	"not-found": { code: 404, statusName: "NOT_FOUND" },
	"already-exists": { code: 409, statusName: "ALREADY_EXISTS" },
	"permission-denied": { code: 403, statusName: "PERMISSION_DENIED" },
	"resource-exhausted": { code: 429, statusName: "RESOURCE_EXHAUSTED" },
	"failed-precondition": { code: 400, statusName: "FAILED_PRECONDITION" },
	"aborted": { code: 409, statusName: "ABORTED" },
	"out-of-range": { code: 400, statusName: "OUT_OF_RANGE" },
	"unimplemented": { code: 501, statusName: "UNIMPLEMENTED" },
	"internal": { code: 500, statusName: "INTERNAL" },
	"unavailable": { code: 503, statusName: "UNAVAILABLE" },
	"data-loss": { code: 500, statusName: "DATA_LOSS" },
	"unauthenticated": { code: 401, statusName: "UNAUTHENTICATED" }
};
