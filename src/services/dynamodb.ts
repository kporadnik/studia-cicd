import { PrepareUpdateExpression } from "@/utils";
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export async function get(
  tableName: string,
  primaryKey: string,
  primaryKeyValue: string
) {
  try {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        [primaryKey]: { S: primaryKeyValue },
      },
    });
    const result = await dynamoClient.send(command);

    if (!result.Item) {
      throw new Error("Item not found");
    }

    return unmarshall(result.Item) as
      | Record<string, AttributeValue>
      | undefined;
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw new Error("Could not retrieve item from DynamoDB");
  }
}

export async function create(
  tableName: string,
  data: Record<string, AttributeValue>
) {
  try {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: data,
    });

    return await dynamoClient.send(command);
  } catch (error) {
    console.error("Error creating item:", error);
    throw new Error("Could not create item in DynamoDB");
  }
}

export async function update<T extends Record<string, unknown>>(
  tableName: string,
  primaryKey: string,
  data: T
) {
  try {
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
  } catch (error) {
    console.error("Error updating item:", error);
    throw new Error("Could not update item in DynamoDB");
  }
}

export async function remove(tableName: string, primaryKey: string) {
  try {
    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: {
        primaryKey: { S: primaryKey },
      },
    });

    return await dynamoClient.send(command);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Could not delete item from DynamoDB");
  }
}
