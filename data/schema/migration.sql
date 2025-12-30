-- define auto update field updated_at
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $update_timestamp$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$update_timestamp$ LANGUAGE plpgsql;
-- define table products
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products ON products (name);
CREATE OR REPLACE TRIGGER products_update BEFORE
UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp();
-- define table projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    leaders VARCHAR(100) NOT NULL,
    status VARCHAR(20),
    ongoing BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects ON projects (name);
CREATE OR REPLACE TRIGGER projects_update BEFORE
UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();
-- define table versions
CREATE TABLE IF NOT EXISTS versions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_versions ON versions (name);
CREATE OR REPLACE TRIGGER versions_update BEFORE
UPDATE ON versions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
-- define table contents
CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    version_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    content VARCHAR(1000) NOT NULL,
    from_active BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contents ON contents (version_id, product_id);
CREATE OR REPLACE TRIGGER contents_update BEFORE
UPDATE ON contents FOR EACH ROW EXECUTE FUNCTION update_timestamp();
-- define table project-display-order
CREATE TABLE IF NOT EXISTS project_display (
    id SERIAL PRIMARY KEY,
    version_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    project_ids VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_project_display ON project_display (version_id, product_id);
CREATE OR REPLACE TRIGGER project_display_update BEFORE
UPDATE ON project_display FOR EACH ROW EXECUTE FUNCTION update_timestamp();