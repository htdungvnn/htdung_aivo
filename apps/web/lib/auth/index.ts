/**
 * Auth API client
 */
import { authClient } from "./auth-client";
import type { ApiError } from "./auth-client";

export { authClient };
export type { ApiError, AuthUser, AuthResponse, RequestOtpResponse, VerifyOtpResponse } from "./auth-client";
