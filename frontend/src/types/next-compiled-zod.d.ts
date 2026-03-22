declare module 'next/dist/compiled/zod' {
  export const z: {
    object: <T extends Record<string, unknown>>(shape: T) => any;
    string: () => any;
    number: () => any;
    boolean: () => any;
    enum: <T extends readonly [string, ...string[]] | readonly string[]>(values: T) => any;
    coerce: {
      number: () => any;
    };
  };
}
