import bcrypt from 'bcryptjs';

export class WorkerService {
  async processJob(job: { id: string; type: string }) {
    switch (job.type) {
      case 'calculatePrimes':
        return this.calculatePrimes(100_000);
      case 'bcryptHash':
        return this.bcryptHash('mySecretPassword', 10);
      case 'generateAndSortArray':
        return this.generateAndSortArray(100_000);
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  private calculatePrimes(limit: number): number[] {
    const primes: number[] = [];
    for (let num = 2; num <= limit; num++) {
      if (primes.every((p) => num % p !== 0)) {
        primes.push(num);
      }
    }
    return primes;
  }

  private async bcryptHash(data: string, rounds: number): Promise<string> {
    return await bcrypt.hash(data, rounds);
  }

  private generateAndSortArray(size: number): number[] {
    const arr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * size),
    );
    return arr.sort((a, b) => a - b);
  }
}
