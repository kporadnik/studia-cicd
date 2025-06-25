export function PrepareUpdateExpression<T extends Record<string, unknown>>(
  data: T
) {
  const attributesData = Object.entries(data).reduce(
    (prev, [key, value], index) => {
      prev[`attr${index}`] = {
        key,
        value,
      };

      return prev;
    },
    {} as Record<string, { key: string; value: any }>
  );
  const expressionQueries = Object.keys(attributesData).map((key) => {
    return `#${key} = :${key}`;
  });
  const { attributeNames, attributeValues } = Object.entries(
    attributesData
  ).reduce(
    (prev, [key, data]) => {
      prev["attributeNames"][`#${key}`] = data.key;
      prev["attributeValues"][`:${key}`] = data.value;

      return prev;
    },
    {
      attributeNames: {},
      attributeValues: {},
    } as Record<string, Record<string, any>>
  );

  const expression = `SET ${expressionQueries.join(", ")}`;

  return {
    expression,
    attributeNames,
    attributeValues,
  };
}
