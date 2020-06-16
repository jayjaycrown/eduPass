CREATE TABLE IF NOT EXISTS savedLists(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,description TEXT);
INSERT or IGNORE INTO savedLists VALUES (1, 'School List', 'My school List');
INSERT or IGNORE INTO savedLists VALUES (2, 'Office List','My Office List');
INSERT or IGNORE INTO savedLists VALUES (3, 'Home List', 'List for home');

CREATE TABLE IF NOT EXISTS savedItems(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, listId INTEGER);
INSERT or IGNORE INTO savedItems(id, content, listId) VALUES (1, 'Scanned 1 content', 1);
INSERT or IGNORE INTO savedItems(id, content, listId) VALUES (2,  'Scanned 2 content', 3);
INSERT or IGNORE INTO savedItems(id,content, listId) VALUES (3,  'Scanned 3 content', 2);