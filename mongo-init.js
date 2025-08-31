// Initialize MongoDB with application user
db = db.getSiblingDB('highway_delite');

db.createUser({
  user: 'highway_user',
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'highway_delite'
    }
  ]
});

// Create initial collections if needed
db.createCollection('users');
db.createCollection('notes');
db.createCollection('otps');
