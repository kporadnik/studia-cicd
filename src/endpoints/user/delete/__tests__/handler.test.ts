import "aws-sdk-client-mock-jest";
import {
  DynamoDBClient,
  DeleteItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../handler";

const mockedDate = new Date("2020-01-01T00:00:00.000Z");
const mockedUUID = "123e4567-e89b-12d3-a456-426614174000";
const dynamoMock = mockClient(DynamoDBClient);

const environment = {
  USERS_TABLE_NAME: "users-db",
};

describe("Delete user lambda", () => {
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

  it("should delete a user and return 200", async () => {
    dynamoMock.on(GetItemCommand).resolves({
      Item: {
        user_id: {
          S: mockedUUID,
        },
        first_name: { S: "Jan" },
        last_name: { S: "Kowalski" },
        email: { S: "root@gmail.com" },
        created_at: { S: mockedDate.toISOString() },
      },
    });
    dynamoMock.on(DeleteItemCommand).resolves({});

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(parsed.message).toBe("User has been deleted successfully");
    expect(dynamoMock).toHaveReceivedCommandWith(DeleteItemCommand, {
      TableName: environment.USERS_TABLE_NAME,
      Key: {
        user_id: { S: userId },
      },
    });
  });

  it("should return error if userId is missing", async () => {
    const event = { pathParameters: {} };

    const response = await handler(event as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe("User ID is required");
  });

  it("should return 500 on DynamoDB error", async () => {
    dynamoMock.on(DeleteItemCommand).rejects(new Error("Dynamo error"));

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toContain(
      "Error retrieving user with ID abc-123: Could not retrieve item from DynamoDB"
    );
  });
});
