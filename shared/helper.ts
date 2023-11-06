export const isAsyncGenerator = (generator: any): boolean => {
  return generator.constructor.name === "GeneratorFunction";
};
