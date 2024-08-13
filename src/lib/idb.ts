import { DBSchema, IDBPDatabase, openDB } from "idb";

interface MyDB extends DBSchema {
  beatmapFiles: {
    key: string;
    value: {
      file: Blob;
      dateAdded: number;
    };
  };
}

export class Idb {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.init();
  }

  public init() {
    this.dbPromise = openDB<MyDB>("webOsuMania", 1, {
      upgrade(db) {
        db.createObjectStore("beatmapFiles");
      },
    });
  }

  public async getBeatmap(id: number) {
    const db = await this.dbPromise;
    const file = await db.get("beatmapFiles", id.toString());

    return file;
  }

  public async putBeatmapSet(id: number, file: Blob) {
    const db = await this.dbPromise;
    await db.put(
      "beatmapFiles",
      {
        file,
        dateAdded: Date.now(),
      },
      id.toString(),
    );
  }
}
