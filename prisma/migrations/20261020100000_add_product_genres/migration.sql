-- Add music genres to the product catalog.
ALTER TABLE "products"
  ADD COLUMN "genre" TEXT,
  ADD COLUMN "otherGenre" TEXT;
