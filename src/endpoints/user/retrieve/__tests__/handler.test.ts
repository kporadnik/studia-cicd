import "aws-sdk-client-mock-jest";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../handler";

const mockedDate = new Date("2020-01-01T00:00:00.000Z");
const mockedUUID = "123e4567-e89b-12d3-a456-426614174000";
const dynamoMock = mockClient(DynamoDBClient);

const environment = {
  USERS_TABLE_NAME: "users-db",
};

describe("Get user lambda", () => {
  const mockContext = {} as any;
  const userId = "abc-123";
  const validEvent = {
    pathParameters: { userId },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dynamoMock.reset();
    process.env = { ...process.env, ...environment };
  });

  it("should get a user and return 200", async () => {
    dynamoMock.on(GetItemCommand).resolves({
      Item: {
        user_id: { S: mockedUUID },
        first_name: { S: "Jan" },
        last_name: { S: "Kowalski" },
        email: { S: "root@gmail.com" },
        created_at: { S: mockedDate.toISOString() },
      },
    });

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(parsed.user).toBeDefined();
    expect(parsed.user.user_id).toBe(mockedUUID);
  });

  it("should throw error when userId is missing", async () => {
    const response = await handler({ pathParameters: {} } as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe("User ID is required");
  });

  it("should throw error when user not found", async () => {
    dynamoMock.on(GetItemCommand).resolves({});

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe(
      "Error retrieving user with ID abc-123: Could not retrieve item from DynamoDB"
    );
  });

  it("should throw error on DynamoDB error", async () => {
    dynamoMock.on(GetItemCommand).rejects(new Error("Dynamo error"));

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toContain(
      "Error retrieving user with ID abc-123: Could not retrieve item from DynamoDB"
    );
  });
});
