-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'running',
    "modelType" TEXT NOT NULL DEFAULT 'xgboost',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "params" JSONB NOT NULL DEFAULT '{}',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "duration" INTEGER,
    "pipelineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelVersion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'staging',
    "framework" TEXT NOT NULL DEFAULT 'xgboost',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "artifactPath" TEXT,
    "description" TEXT,
    "experimentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promotedAt" TIMESTAMP(3),

    CONSTRAINT "ModelVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataValidationRun" (
    "id" TEXT NOT NULL,
    "datasetName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'passed',
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "checksPassed" INTEGER NOT NULL DEFAULT 0,
    "checksFailed" INTEGER NOT NULL DEFAULT 0,
    "results" JSONB NOT NULL DEFAULT '[]',
    "pipelineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataValidationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriftAlert" (
    "id" TEXT NOT NULL,
    "alertType" TEXT NOT NULL DEFAULT 'data',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "feature" TEXT,
    "psiScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "threshold" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "status" TEXT NOT NULL DEFAULT 'open',
    "modelName" TEXT,
    "description" TEXT,
    "autoRetrain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "DriftAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "valueType" TEXT NOT NULL DEFAULT 'float',
    "description" TEXT,
    "source" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_key" ON "Feature"("name");
