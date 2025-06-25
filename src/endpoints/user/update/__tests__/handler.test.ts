import "aws-sdk-client-mock-jest";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../handler";

const mockedDate = new Date("2020-01-01T00:00:00.000Z");
const mockedUUID = "123e4567-e89b-12d3-a456-426614174000";
const dynamoMock = mockClient(DynamoDBClient);

const environment = {
  USERS_TABLE_NAME: "users-db",
};

describe("Update user lambda", () => {
  const mockContext = {} as any;
  const userId = "abc-123";
  const validEvent = {
    pathParameters: { userId },
    body: {
      first_name: "Janek",
      last_name: "Nowak",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dynamoMock.reset();
    process.env = { ...process.env, ...environment };
  });

  it("should update a user and return 200", async () => {
    dynamoMock.on(UpdateItemCommand).resolves({});
    dynamoMock.on(GetItemCommand).resolves({
      Item: {
        user_id: { S: mockedUUID },
        first_name: { S: "Janek" },
        last_name: { S: "Nowak" },
        email: { S: "root@gmail.com" },
        created_at: { S: mockedDate.toISOString() },
      },
    });

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(parsed.user).toBeDefined();
    expect(parsed.user.first_name).toBe("Janek");
  });

  it("should throw error if userId is missing", async () => {
    const response = await handler(
      { pathParameters: {}, body: {} } as any,
      mockContext
    );
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe("User ID is required");
  });

  it("should throw error if user not found after update", async () => {
    dynamoMock.on(UpdateItemCommand).resolves({});
    dynamoMock.on(GetItemCommand).resolves({});

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe(
      "Error retrieving user with ID abc-123: Could not retrieve item from DynamoDB"
    );
  });

  it("should throw error on DynamoDB error", async () => {
    dynamoMock.on(UpdateItemCommand).rejects(new Error("Dynamo error"));

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toContain("Error retrieving user with ID abc-123");
  });
});
