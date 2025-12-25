/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as analyzeHalal from "../analyzeHalal.js";
import type * as analyzeMaterial from "../analyzeMaterial.js";
import type * as auth from "../auth.js";
import type * as consultHalal from "../consultHalal.js";
import type * as credits from "../credits.js";
import type * as crons from "../crons.js";
import type * as eligibility from "../eligibility.js";
import type * as generateDocument from "../generateDocument.js";
import type * as halalConsultations from "../halalConsultations.js";
import type * as halalDocuments from "../halalDocuments.js";
import type * as halalScans from "../halalScans.js";
import type * as http from "../http.js";
import type * as ingredients from "../ingredients.js";
import type * as lib_llmClient from "../lib/llmClient.js";
import type * as lib_magicLink from "../lib/magicLink.js";
import type * as maintenance from "../maintenance.js";
import type * as materialScans from "../materialScans.js";
import type * as products from "../products.js";
import type * as storage from "../storage.js";
import type * as traceability from "../traceability.js";
import type * as training from "../training.js";
import type * as users from "../users.js";
import type * as voiceAudit from "../voiceAudit.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  analyzeHalal: typeof analyzeHalal;
  analyzeMaterial: typeof analyzeMaterial;
  auth: typeof auth;
  consultHalal: typeof consultHalal;
  credits: typeof credits;
  crons: typeof crons;
  eligibility: typeof eligibility;
  generateDocument: typeof generateDocument;
  halalConsultations: typeof halalConsultations;
  halalDocuments: typeof halalDocuments;
  halalScans: typeof halalScans;
  http: typeof http;
  ingredients: typeof ingredients;
  "lib/llmClient": typeof lib_llmClient;
  "lib/magicLink": typeof lib_magicLink;
  maintenance: typeof maintenance;
  materialScans: typeof materialScans;
  products: typeof products;
  storage: typeof storage;
  traceability: typeof traceability;
  training: typeof training;
  users: typeof users;
  voiceAudit: typeof voiceAudit;
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
