/**
 * Type definitions for Steam Cloud Bridge
 */

export interface SteamClient {
  cloud?: {
    isEnabledForApp(): boolean;
    isEnabledForAccount(): boolean;
    writeFile(filename: string, buffer: Buffer): boolean;
    readFile(filename: string): Buffer | null;
    isFileExists(filename: string): boolean;
    deleteFile(filename: string): boolean;
    getFileCount(): number;
    getFileNameAndSize(index: number): { name: string; size: number };
    getQuota(): { totalBytes: number; availableBytes: number };
  } | null;
}

export interface SaveResult {
  success: boolean;
  filename?: string;
  error?: string;
}

export interface LoadResult {
  success: boolean;
  data: string | null;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface CloudFile {
  key: string;
  filename: string;
  size: number;
}

export interface ListFilesResult {
  success: boolean;
  files: CloudFile[];
  error?: string;
}

export interface QuotaResult {
  success: boolean;
  totalBytes?: number;
  availableBytes?: number;
  error?: string;
}

export const CLOUD_SAVE_PREFIX: string;

export function initialize(client: SteamClient | null): void;
export function isAvailable(): boolean;
export function save(key: string, data: string): SaveResult;
export function load(key: string): LoadResult;
export function deleteFile(key: string): DeleteResult;
export function listFiles(): ListFilesResult;
export function getQuota(): QuotaResult;
