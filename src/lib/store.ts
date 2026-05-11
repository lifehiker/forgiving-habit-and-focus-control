import fs from "node:fs";
import path from "node:path";

import type { AppData } from "@/lib/types";

function resolveDataFile() {
  const customDataDir = process.env.APP_DATA_DIR;

  if (customDataDir) {
    return path.join(customDataDir, "app-data.json");
  }

  // Keep the path statically scoped so standalone tracing only includes `/data`.
  return path.join(process.cwd(), "data", "app-data.json");
}

const dataFile = resolveDataFile();
const dataDir = path.dirname(dataFile);

const emptyData: AppData = {
  users: [],
  sessions: [],
  loginCodes: [],
  habits: [],
  habitCompletions: [],
  habitLapses: [],
  focusSessions: [],
  blockedDomains: [],
  subscriptions: [],
  extensionTokens: [],
  analyticsEvents: [],
  emailLogs: [],
};

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(emptyData, null, 2));
  }
}

export function readStore(): AppData {
  ensureStore();
  const raw = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(raw) as AppData;
}

export function writeStore(data: AppData) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export function mutateStore<T>(mutator: (data: AppData) => T): T {
  const data = readStore();
  const result = mutator(data);
  writeStore(data);
  return result;
}
