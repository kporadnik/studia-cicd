import "aws-sdk-client-mock-jest";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
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
  const validUser = {
    user_id: mockedUUID,
    first_name: "Jan",
    last_name: "Kowalski",
    email: "root@gmail.com",
  };
  // AWS database needs other format
  const validUserAWS = {
    user_id: { S: mockedUUID },
    first_name: { S: validUser.first_name },
    last_name: { S: validUser.last_name },
    email: { S: validUser.email },
  };
  const validEvent = {
    body: {
      first_name: validUser.first_name,
      last_name: validUser.last_name,
      email: validUser.email,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dynamoMock.reset();

    process.env = { ...process.env, ...environment };
  });

  it("should create a user and return 200", async () => {
    dynamoMock.on(QueryCommand).resolves({
      Items: [],
    });
    dynamoMock.on(PutItemCommand).resolves({
      Attributes: validUserAWS,
    });
    dynamoMock.on(GetItemCommand).resolves({
      Item: {
        user_id: { S: mockedUUID },
        first_name: { S: "Jan" },
        last_name: { S: "Kowalski" },
        email: { S: "root@gmail.com" },
      },
    });

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(parsed.user).toEqual(validUser);
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

  it("should return error when user with email already exists", async () => {
    dynamoMock.on(QueryCommand).resolves({
      Items: [validUserAWS],
    });

    const response = await handler(validEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe(
      `User with email ${validUser.email} already exists`
    );
  });

  it("should return error when required fields are missing", async () => {
    const invalidEvent = {
      body: JSON.stringify({ first_name: "Jan" }),
    };

    const response = await handler(invalidEvent as any, mockContext);
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(parsed.message).toBe("Missing required fields");
  });
});
