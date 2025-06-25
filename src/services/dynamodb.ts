import { PrepareUpdateExpression } from "@/utils";
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export async function get(tableName: string, primaryKey: string) {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: {
      primaryKey: { S: primaryKey },
    },
  });

  return await dynamoClient.send(command);
}

export async function create(
  tableName: string,
  data: Record<string, AttributeValue>
) {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: data,
  });

  return await dynamoClient.send(command);
}

export async function update<T extends Record<string, unknown>>(
  tableName: string,
  primaryKey: string,
  data: T
) {
  const { expression, attributeNames, attributeValues } =
    PrepareUpdateExpression(data);

  const command = new UpdateItemCommand({
    TableName: tableName,
    Key: {
      primaryKey: { S: primaryKey },
    },
    UpdateExpression: expression,
    ExpressionAttributeNames: attributeNames,
    ExpressionAttributeValues: attributeValues,
  });

  return await dynamoClient.send(command);
}

export async function remove(tableName: string, primaryKey: string) {
  const command = new DeleteItemCommand({
    TableName: tableName,
    Key: {
      primaryKey: { S: primaryKey },
    },
  });

  return await dynamoClient.send(command);
}
