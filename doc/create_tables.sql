/* 1ere table : List */

DROP TABLE IF EXISTS "list" CASCADE;

CREATE TABLE "list" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL DEFAULT '',
  "page_order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATE,
  "updatedAt" DATE
);


/* 2eme table : Card */

DROP TABLE IF EXISTS "card" CASCADE;

CREATE TABLE "card" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "color" TEXT NOT NULL DEFAULT '#FFF' ,
  "list_id" INTEGER NOT NULL DEFAULT 0,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATE,
  "updatedAt" DATE
);

/* 3eme table : Tag */

DROP TABLE IF EXISTS "tag" CASCADE;

CREATE TABLE "tag" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "color" TEXT NOT NULL DEFAULT '#FFF' ,
  "createdAt" DATE,
  "updatedAt" DATE
);

/* Table de liaison */
DROP TABLE IF EXISTS "card_has_tag" CASCADE;

CREATE TABLE "card_has_tag" (
  "card_id" INTEGER NOT NULL,
  "tag_id" INTEGER NOT NULL
);

/* Fill the tables with data */
INSERT INTO "list" ("name","createdAt","updatedAt")
VALUES ('Première liste', NOW(), NOW() );

INSERT INTO "card" ("title", "list_id","createdAt","updatedAt")
VALUES ('Carte 1', 1, NOW(), NOW() ),
       ('2ème carte', 1, NOW(), NOW() );

INSERT INTO "tag" ("title", "color", "createdAt","updatedAt")
VALUES ('Urgent', '#F00', NOW(), NOW() );

INSERT INTO "card_has_tag" ("card_id", "tag_id")
VALUES (1,1);