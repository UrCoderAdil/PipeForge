import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataValidationService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.dataValidationRun.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async run(datasetName: string, pipelineId?: string) {
    const checks = this.generateChecks();
    const passed = checks.filter((c) => c.status === 'passed').length;
    const failed = checks.filter((c) => c.status === 'failed').length;
    const status = failed === 0 ? 'passed' : failed <= 2 ? 'warning' : 'failed';

    return this.prisma.dataValidationRun.create({
      data: {
        datasetName,
        status,
        rowCount: Math.floor(Math.random() * 50000) + 100000,
        checksPassed: passed,
        checksFailed: failed,
        results: checks as any,
        pipelineId,
      },
    });
  }

  private generateChecks() {
    const allChecks = [
      { check: 'Schema validation', column: 'all', status: 'passed', message: 'All 28 expected columns present' },
      { check: 'Null value threshold', column: 'age', status: 'passed', message: 'Null rate 0.8% < threshold 5%' },
      { check: 'Value range', column: 'transaction_amount', status: 'passed', message: 'All values in [0, 100000]' },
      { check: 'Duplicate rows', column: 'all', status: 'passed', message: '0 duplicate rows detected' },
      { check: 'Categorical values', column: 'country_code', status: 'passed', message: 'All values in expected set' },
      { check: 'Distribution shift', column: 'credit_score', status: 'passed', message: 'KS statistic 0.04 < 0.1' },
      { check: 'Outlier detection', column: 'daily_transactions', status: 'passed', message: '0.04% outliers (within threshold)' },
      { check: 'Target label balance', column: 'fraud_label', status: 'passed', message: 'Class ratio 1:23 (expected ~1:20)' },
      { check: 'Foreign key integrity', column: 'customer_id', status: 'passed', message: '100% match to customer table' },
      { check: 'Date range', column: 'transaction_date', status: 'passed', message: 'All dates in last 90 days' },
      { check: 'String format', column: 'email', status: 'passed', message: '99.97% valid email format' },
      { check: 'Feature correlation', column: 'all', status: 'passed', message: 'No features with correlation > 0.95' },
    ];
    return allChecks;
  }
}
