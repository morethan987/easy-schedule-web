ALTER TABLE "Document" ADD COLUMN "chatId" uuid NOT NULL REFERENCES "Chat" ("id");