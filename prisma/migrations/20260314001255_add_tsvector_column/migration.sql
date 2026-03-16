-- migration.sql

-- Add the generated tsvector column
ALTER TABLE "Stores" ADD COLUMN "search_vector" TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('simple',
    coalesce(code,'') || ' ' ||
    coalesce(name,'') || ' ' ||
    coalesce(country,'') || ' ' ||
    coalesce(client,''))
) STORED;

-- Create a GIN index for efficient full-text search
CREATE INDEX "stores_search_vector_idx" ON "Stores" USING GIN ("search_vector");
