import { Review, Toilet } from "@/models/toilet";
import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null;

// Get database instance
const getDatabase = () => {
  if (!database) {
    try {
      database = SQLite.openDatabaseSync("skibidigo.db");
      console.log("Database connection established");
    } catch (error) {
      console.error("Error opening database:", error);
      throw error;
    }
  }
  return database;
};

// Check if column exists in a table
const columnExists = (tableName: string, columnName: string): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(`PRAGMA table_info(${tableName})`);
    const result = statement.executeSync();
    const columns = result.getAllSync();
    statement.finalizeSync();
    return columns.some((col: any) => col.name === columnName);
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists:`, error);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = () => {
  try {
    const db = getDatabase();

    // Create saved_toilets table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS saved_toilets (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        type TEXT NOT NULL,
        gender TEXT NOT NULL,
        features TEXT,
        hasFee INTEGER,
        waterLaser INTEGER,
        rating REAL,
        reviewCount INTEGER,
        distance REAL,
        operatingHours TEXT,
        savedAt TEXT NOT NULL
      );
    `);

    // Create comments table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        toiletId INTEGER NOT NULL,
        userName TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `);

    // Add userId column if it doesn't exist (migration)
    if (!columnExists("comments", "userId")) {
      console.log("Adding userId column to comments table...");
      db.execSync(`ALTER TABLE comments ADD COLUMN userId TEXT;`);
      console.log("userId column added successfully");
    }

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Save a toilet to the database
export const saveToilet = (toilet: Toilet): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(`
      INSERT OR REPLACE INTO saved_toilets 
      (id, name, address, latitude, longitude, type, gender, features, hasFee, waterLaser, rating, reviewCount, distance, operatingHours, savedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.executeSync([
      toilet.id,
      toilet.name,
      toilet.address || "",
      toilet.coordinates.latitude,
      toilet.coordinates.longitude,
      toilet.type,
      toilet.gender,
      JSON.stringify(toilet.features),
      toilet.hasFee ? 1 : 0,
      toilet.waterLaser ? 1 : 0,
      toilet.rating,
      toilet.reviewCount,
      toilet.distance,
      JSON.stringify(toilet.operatingHours),
      new Date().toISOString(),
    ]);

    statement.finalizeSync();
    return result.changes > 0;
  } catch (error) {
    console.error("Error saving toilet:", error);
    return false;
  }
};

// Remove a saved toilet
export const removeSavedToilet = (toiletId: number): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync("DELETE FROM saved_toilets WHERE id = ?");
    const result = statement.executeSync([toiletId]);
    statement.finalizeSync();
    return result.changes > 0;
  } catch (error) {
    console.error("Error removing saved toilet:", error);
    return false;
  }
};

// Check if toilet is saved
export const isToiletSaved = (toiletId: number): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT id FROM saved_toilets WHERE id = ?"
    );
    const result = statement.executeSync([toiletId]);
    const rows = result.getAllSync();
    statement.finalizeSync();
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking if toilet is saved:", error);
    return false;
  }
};

// Post a comment for a toilet
export const postComment = (comment: {
  toiletId: number;
  userName: string;
  rating: number;
  comment: string;
  userId?: string;
}): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(`
      INSERT INTO comments (toiletId, userName, rating, comment, timestamp, userId)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = statement.executeSync([
      comment.toiletId,
      comment.userName,
      comment.rating,
      comment.comment,
      new Date().toISOString(),
      comment.userId || null,
    ]);

    statement.finalizeSync();
    return result.changes > 0;
  } catch (error) {
    console.error("Error posting comment:", error);
    return false;
  }
};

// Fetch saved toilets
export const fetchSavedToilets = (): Toilet[] => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT * FROM saved_toilets ORDER BY savedAt DESC"
    );
    const result = statement.executeSync();
    const rows = result.getAllSync();
    statement.finalizeSync();

    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      coordinates: {
        latitude: row.latitude,
        longitude: row.longitude,
      },
      type: row.type,
      gender: row.gender,
      features: JSON.parse(row.features || "[]"),
      hasFee: row.hasFee === 1,
      waterLaser: row.waterLaser === 1,
      rating: row.rating,
      reviewCount: row.reviewCount,
      distance: row.distance,
      operatingHours: JSON.parse(row.operatingHours || "{}"),
      reviews: [], // Comments will be loaded separately
    }));
  } catch (error) {
    console.error("Error fetching saved toilets:", error);
    return [];
  }
};

// Get total number of saved toilets
export const getSavedToiletsCount = (): number => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT COUNT(*) as count FROM saved_toilets"
    );
    const result = statement.executeSync();
    const rows = result.getAllSync();
    statement.finalizeSync();
    return (rows[0] as any)?.count || 0;
  } catch (error) {
    console.error("Error getting saved toilets count:", error);
    return 0;
  }
};

// Clear all saved toilets (utility function)
export const clearAllSavedToilets = (): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync("DELETE FROM saved_toilets");
    const result = statement.executeSync();
    statement.finalizeSync();
    return result.changes > 0;
  } catch (error) {
    console.error("Error clearing saved toilets:", error);
    return false;
  }
};

// Update a comment
export const updateComment = (
  commentId: number,
  rating: number,
  comment: string
): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(`
      UPDATE comments 
      SET rating = ?, comment = ?, timestamp = ?
      WHERE id = ?
    `);

    const result = statement.executeSync([
      rating,
      comment,
      new Date().toISOString(),
      commentId,
    ]);

    statement.finalizeSync();
    return result.changes > 0;
  } catch (error) {
    console.error("Error updating comment:", error);
    return false;
  }
};

// Delete a comment
export const deleteComment = (commentId: number): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync("DELETE FROM comments WHERE id = ?");
    const result = statement.executeSync([commentId]);
    statement.finalizeSync();
    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};

// Fetch comments for a toilet with user info
export const fetchComments = (toiletId: number): Review[] => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT * FROM comments WHERE toiletId = ? ORDER BY timestamp DESC"
    );
    const result = statement.executeSync([toiletId]);
    const rows = result.getAllSync();
    statement.finalizeSync();

    return rows.map((row: any) => ({
      id: row.id,
      userName: row.userName,
      rating: row.rating,
      comment: row.comment,
      timestamp: row.timestamp,
      userId: row.userId,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

// Get total comment count for a toilet (including dummy data)
export const getCommentCount = (
  toiletId: number,
  dummyReviews: Review[] = []
): number => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT COUNT(*) as count FROM comments WHERE toiletId = ?"
    );
    const result = statement.executeSync([toiletId]);
    const rows = result.getAllSync();
    statement.finalizeSync();

    const dbCount = (rows[0] as any)?.count || 0;
    return dbCount + dummyReviews.length;
  } catch (error) {
    console.error("Error getting comment count:", error);
    return dummyReviews.length;
  }
};

// Calculate average rating including user reviews
export const calculateAverageRating = (
  toiletId: number,
  originalRating: number,
  originalCount: number
): number => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT AVG(rating) as avgRating, COUNT(*) as count FROM comments WHERE toiletId = ?"
    );
    const result = statement.executeSync([toiletId]);
    const rows = result.getAllSync();
    statement.finalizeSync();

    const dbData = rows[0] as any;
    const userAvg = dbData?.avgRating || 0;
    const userCount = dbData?.count || 0;

    if (userCount === 0) return originalRating;

    // Combine original rating with user ratings
    const totalRating = originalRating * originalCount + userAvg * userCount;
    const totalCount = originalCount + userCount;

    return Math.round((totalRating / totalCount) * 10) / 10;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return originalRating;
  }
};

export const getUserReviews = (toiletId: number, userId: string): Review[] => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT * FROM comments WHERE toiletId = ? AND userId = ? ORDER BY timestamp DESC"
    );
    const result = statement.executeSync([toiletId, userId]);
    const rows = result.getAllSync();
    statement.finalizeSync();

    return rows.map((row: any) => ({
      id: row.id,
      userName: row.userName,
      rating: row.rating,
      comment: row.comment,
      timestamp: row.timestamp,
      userId: row.userId,
    }));
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
};

export const hasUserReviewed = (toiletId: number, userId: string): boolean => {
  try {
    const db = getDatabase();
    const statement = db.prepareSync(
      "SELECT COUNT(*) as count FROM comments WHERE toiletId = ? AND userId = ?"
    );
    const result = statement.executeSync([toiletId, userId]);
    const rows = result.getAllSync();
    statement.finalizeSync();

    return ((rows[0] as any)?.count || 0) > 0;
  } catch (error) {
    console.error("Error checking user review:", error);
    return false;
  }
};
