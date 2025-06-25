export function CreateLambdaResponse<T>(
  statusCode: number,
  body: T
): {
  statusCode: number;
  body: string;
} {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
