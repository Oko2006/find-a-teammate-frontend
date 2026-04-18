import { PlannerResult } from "../types";
import { apiService } from "./api";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateProjectPlan(input: string, file?: File): Promise<PlannerResult> {
  const createResponse = await apiService.planner.create(input, file);
  const requestId = createResponse.data.id as number;
  let attempt = 0;

  while (attempt < 10) {
    const statusResponse = await apiService.planner.get(requestId);
    if (statusResponse.data.status === 'complete') {
      return statusResponse.data.result as PlannerResult;
    }
    if (statusResponse.data.status === 'failed') {
      throw new Error(statusResponse.data.error_message || 'Planner failed');
    }
    attempt += 1;
    await sleep(800);
  }

  throw new Error('Planner is taking longer than expected. Please refresh later.');
}
