-- ============================================================
-- Neon 数据库 Schema 迁移 SQL
-- 生成时间: 2026-06-10
-- 原因: Neon 免费额度超限，Prisma db push 无法执行
-- 执行方式: psql "$DATABASE_URL" -f neon-schema-migration.sql
-- ============================================================

-- 1. Vehicle 表新增字段（如果不存在则添加）
-- 这些字段对应 Prisma schema 中 Vehicle model 的扩展字段

-- specId: 关联 VehicleSpec 表
DO $$ BEGIN
  ALTER TABLE "Vehicle" ADD COLUMN "specId" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- specsJson: 存储匹配到的规格 JSON
DO $$ BEGIN
  ALTER TABLE "Vehicle" ADD COLUMN "specsJson" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 扩展字段（来自 xlsx 自动填充）
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "batteryType" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "bodyStyle" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "compatibleModels" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "displacement" DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "displacementCc" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "engineModel" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "engineNo" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "equipmentType" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "exteriorColor" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "fuelType" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "interiorColor" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "keyCount" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "loadCapacityTons" DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "motorPowerKw" DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "motorcycleType" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "originalPrice" DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "partCategory" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "partCondition" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "quantity" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "rangeKm" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "seatCount" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "series" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "sourceId" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "sourceSite" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "tonnage" DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "vehicleLengthM" DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "workingHours" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "driveType" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "doorCount" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "wheelbase" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "curbWeight" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "fuelConsumption" DOUBLE PRECISION; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "maxTorqueNm" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "maxHorsepower" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "fuelTankCapacity" INTEGER; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Vehicle" ADD COLUMN "fuelGrade" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 2. 添加外键约束（如果不存在）
DO $$ BEGIN
  ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_specId_fkey"
    FOREIGN KEY ("specId") REFERENCES "VehicleSpec"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. 添加索引
CREATE INDEX IF NOT EXISTS "Vehicle_specId_idx" ON "Vehicle"("specId");
CREATE INDEX IF NOT EXISTS "Vehicle_sourceId_idx" ON "Vehicle"("sourceId");
CREATE INDEX IF NOT EXISTS "Vehicle_sourceSite_idx" ON "Vehicle"("sourceSite");

-- 4. VehicleSpec 表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS "VehicleSpec" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "yearRange" TEXT NOT NULL DEFAULT '2016-2026',
    "manufacturer" TEXT,
    "vehicleType" TEXT,
    "releaseDate" TEXT,
    "energyType" TEXT,
    "specs" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleSpec_pkey" PRIMARY KEY ("id")
);

-- 5. VehicleSpec 唯一约束
DO $$ BEGIN
  ALTER TABLE "VehicleSpec" ADD CONSTRAINT "VehicleSpec_brand_model_key" UNIQUE ("brand", "model");
EXCEPTION WHEN duplicate_table THEN NULL; WHEN duplicate_object THEN NULL;
END $$;

-- 6. UnmatchedSpec 表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS "UnmatchedSpec" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "vehicleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnmatchedSpec_pkey" PRIMARY KEY ("id")
);

-- 验证
SELECT 'Migration check complete' AS status;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Vehicle' AND column_name IN ('specId', 'specsJson', 'bodyStyle', 'engineModel', 'fuelType', 'series', 'seatCount', 'displacement', 'motorPowerKw', 'vehicleLengthM') ORDER BY column_name;
