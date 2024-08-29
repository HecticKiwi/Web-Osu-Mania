import "idb";
import { DBSchema, IDBPDatabase, openDB } from "idb";

interface MyDB extends DBSchema {
  beatmapFiles: {
    key: string;
    value: {
      file: Blob;
      dateAdded: number;
    };
    indexes: {
      "by-date": number;
    };
  };
}

export class Idb {
  private db: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.init();
  }

  public init() {
    this.db = openDB<MyDB>("webOsuMania", 1, {
      upgrade(db) {
        const store = db.createObjectStore("beatmapFiles");
        store.createIndex("by-date", "dateAdded");
      },
    });
  }

  public async getBeatmapCount() {
    const db = await this.db;
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
    const db = await this.db;

    try {
      await db.put(
        "beatmapFiles",
        {
          file,
          dateAdded: Date.now(),
        },
        id.toString(),
      );
    } catch (error: any) {
      if (error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        await this.clearBeatmapSets();
        throw error;
      }
    }
  }
}
