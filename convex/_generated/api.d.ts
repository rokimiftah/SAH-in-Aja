/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analyzeHalal from "../analyzeHalal.js";
import type * as consultHalal from "../consultHalal.js";
import type * as generateDocument from "../generateDocument.js";
import type * as halalConsultations from "../halalConsultations.js";
import type * as halalDocuments from "../halalDocuments.js";
import type * as halalScans from "../halalScans.js";
import type * as lib_nvidia from "../lib/nvidia.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analyzeHalal: typeof analyzeHalal;
  consultHalal: typeof consultHalal;
  generateDocument: typeof generateDocument;
  halalConsultations: typeof halalConsultations;
  halalDocuments: typeof halalDocuments;
  halalScans: typeof halalScans;
  "lib/nvidia": typeof lib_nvidia;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
