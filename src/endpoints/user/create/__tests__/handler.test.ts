import "aws-sdk-client-mock-jest";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../handler";

const mockedDate = new Date("2020-01-01T00:00:00.000Z");
const mockedUUID = "123e4567-e89b-12d3-a456-426614174000";
const dynamoMock = mockClient(DynamoDBClient);

jest.mock("uuid", () => ({
  v4: jest.fn(() => mockedUUID),
}));
jest.useFakeTimers().setSystemTime(mockedDate);

const environment = {
  USERS_TABLE_NAME: "users-db",
};

describe("Create user lambda", () => {
  const mockContext = {} as any;
  const validEvent = {
    body: {
      firstName: "Jan",
      lastName: "Kowalski",
      email: "root@gmail.com",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dynamoMock.reset();

    process.env = { ...process.env, ...environment };
  });

  it("should create a user and return 200", async () => {
    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(parsed.message).toBe("User has been created successfully");
    expect(dynamoMock).toHaveReceivedCommandWith(PutItemCommand, {
      TableName: environment.USERS_TABLE_NAME,
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
  });

  it("should return error when required fields are missing", async () => {
    const invalidEvent = {
      body: JSON.stringify({ firstName: "Jan" }),
    };

    const response = await handler(invalidEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe("Missing required fields");
  });
});
