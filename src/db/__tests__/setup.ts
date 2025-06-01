import { neon } from '@neondatabase/serverless';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

// Function to reset the database to a clean state
export async function resetDatabase() {
  // Create tables if they don't exist first
  await sql`
    CREATE TABLE IF NOT EXISTS families (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS units (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS family_members (
      user_id TEXT REFERENCES users_sync(id),
      family_id INTEGER REFERENCES families(id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      hf_json JSONB,
      family_id INTEGER REFERENCES families(id),
      public BOOLEAN DEFAULT false,
      image_url TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS recipe_variants (
      id SERIAL PRIMARY KEY,
      recipe_id INTEGER REFERENCES recipes(id),
      variant_name VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS steps (
      id SERIAL PRIMARY KEY,
      recipe_id INTEGER REFERENCES recipes(id),
      step_index INTEGER NOT NULL,
      instruction TEXT NOT NULL,
      image_url TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ingredients (
      id SERIAL PRIMARY KEY,
      recipe_variant_id INTEGER REFERENCES recipe_variants(id),
      product_id INTEGER REFERENCES products(id),
      unit_id INTEGER REFERENCES units(id),
      amount NUMERIC(10,2) NOT NULL,
      comment TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS meal_plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      family_id INTEGER REFERENCES families(id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS meals (
      id SERIAL PRIMARY KEY,
      meal_plan_id INTEGER REFERENCES meal_plans(id),
      recipe_variant_id INTEGER REFERENCES recipe_variants(id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS shopping (
      id SERIAL PRIMARY KEY,
      meal_plan_id INTEGER REFERENCES meal_plans(id),
      product_id INTEGER REFERENCES products(id),
      amount VARCHAR(255) NOT NULL,
      checked BOOLEAN DEFAULT false,
      deleted BOOLEAN DEFAULT false
    );
  `;

  // Now truncate all tables in correct order (respecting foreign key constraints)
  await sql`
    TRUNCATE TABLE 
      family_members,
      shopping,
      meals,
      meal_plans,
      ingredients,
      steps,
      recipe_variants,
      recipes,
      products,
      units,
      families
    CASCADE;
  `;
}
