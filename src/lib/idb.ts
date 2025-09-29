import { ReplayData } from "@/osuMania/systems/replayRecorder";
import { compressSync } from "fflate";
import { DBSchema, IDBPDatabase, openDB } from "idb";

export type IdbFile = {
  file: Blob;
  dateAdded: number;
};

export type StoreName = "beatmapFiles" | "replayFiles";

interface MyDB extends DBSchema {
  beatmapFiles: {
    key: string;
    value: IdbFile;
    indexes: {
      "by-date": number;
    };
  };
  replayFiles: {
    key: string;
    value: IdbFile;
    indexes: {
      "by-date": number;
    };
  };
}

class Idb {
  private db: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    if (typeof window === "undefined") {
      return;
    }

    this.init();
  }

  public init() {
    this.db = openDB<MyDB>("webOsuMania", 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const beatmapStore = db.createObjectStore("beatmapFiles");
          beatmapStore.createIndex("by-date", "dateAdded");
        }

        if (oldVersion < 2) {
          const replayStore = db.createObjectStore("replayFiles");
          replayStore.createIndex("by-date", "dateAdded");
        }
      },
    });
  }

  public async getStoreKeys(storeName: StoreName) {
    const db = await this.db;
    const keys = await db.getAllKeys(storeName);

    return keys;
  }

  public async getStoreValue(storeName: StoreName, id: string) {
    const db = await this.db;
    const file = await db.get(storeName, id.toString());

    return file;
  }

  public async saveToStore(
    storeName: StoreName,
    blob: Blob,
    id: string,
    dateAdded: number,
  ) {
    const db = await this.db;

    await db.put(
      storeName,
      {
        file: blob,
        dateAdded,
      },
      id,
    );
  }

  public async getBeatmapCount() {
    const db = await this.db;

    if (!db) {
      return 0;
    }

    const count = await db.count("beatmapFiles");

    return count;
  }

  public async getBeatmap(id: number) {
    const db = await this.db;
    const file = await db.get("beatmapFiles", id.toString());

    return file;
  }

  public async deleteBeatmap(id: number) {
    const db = await this.db;
    await db.delete("beatmapFiles", id.toString());
  }

  public async clearBeatmapSets() {
    try {
      const db = await this.db;
      db.clear("beatmapFiles");
    } catch (error: any) {
      console.warn(error.name);
    }
  }

  public async putBeatmapSet(id: number, file: Blob) {
    try {
      this.saveToStore("beatmapFiles", file, id.toString(), Date.now());
    } catch (error: any) {
      if (error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        await this.clearBeatmapSets();
        throw error;
      }
    }
  }

  public async saveReplay(replayData: ReplayData, id: string): Promise<string> {
    const db = await this.db;

    const replayDataString = JSON.stringify(replayData);
    const encoded = new TextEncoder().encode(replayDataString);
    const compressed = compressSync(encoded);
    const file = new Blob([compressed as BlobPart], {
      type: "application/octet-stream",
    });

    try {
      await this.saveToStore("replayFiles", file, id, Date.now());
    } catch (error: any) {
      if (error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        await db.clear("replayFiles");
        throw error;
      }
    }

    return id;
  }

  public async deleteReplay(id: string): Promise<void> {
    const db = await this.db;
    await db.delete("replayFiles", id);
  }

  public async getReplay(id: string) {
    const db = await this.db;
    const result = await db.get("replayFiles", id);

    return result;
  }

  public async clearReplays(): Promise<void> {
    const db = await this.db;
    await db.clear("replayFiles");
  }
}

export const idb = new Idb();
