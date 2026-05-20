
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Destination
 * 
 */
export type Destination = $Result.DefaultSelection<Prisma.$DestinationPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model DestinationCategory
 * 
 */
export type DestinationCategory = $Result.DefaultSelection<Prisma.$DestinationCategoryPayload>
/**
 * Model CategoryKeyword
 * 
 */
export type CategoryKeyword = $Result.DefaultSelection<Prisma.$CategoryKeywordPayload>
/**
 * Model SavedDestination
 * 
 */
export type SavedDestination = $Result.DefaultSelection<Prisma.$SavedDestinationPayload>
/**
 * Model Itinerary
 * 
 */
export type Itinerary = $Result.DefaultSelection<Prisma.$ItineraryPayload>
/**
 * Model ItineraryItem
 * 
 */
export type ItineraryItem = $Result.DefaultSelection<Prisma.$ItineraryItemPayload>
/**
 * Model Review
 * 
 */
export type Review = $Result.DefaultSelection<Prisma.$ReviewPayload>
/**
 * Model VisitedPlace
 * 
 */
export type VisitedPlace = $Result.DefaultSelection<Prisma.$VisitedPlacePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  PENGELOLA: 'PENGELOLA',
  WISATAWAN: 'WISATAWAN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Gender: {
  LAKI_LAKI: 'LAKI_LAKI',
  PEREMPUAN: 'PEREMPUAN'
};

export type Gender = (typeof Gender)[keyof typeof Gender]


export const DestinationStatus: {
  pending: 'pending',
  aktif: 'aktif',
  butuh_perbaikan: 'butuh_perbaikan',
  canceled: 'canceled'
};

export type DestinationStatus = (typeof DestinationStatus)[keyof typeof DestinationStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Gender = $Enums.Gender

export const Gender: typeof $Enums.Gender

export type DestinationStatus = $Enums.DestinationStatus

export const DestinationStatus: typeof $Enums.DestinationStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.destination`: Exposes CRUD operations for the **Destination** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Destinations
    * const destinations = await prisma.destination.findMany()
    * ```
    */
  get destination(): Prisma.DestinationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.destinationCategory`: Exposes CRUD operations for the **DestinationCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DestinationCategories
    * const destinationCategories = await prisma.destinationCategory.findMany()
    * ```
    */
  get destinationCategory(): Prisma.DestinationCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.categoryKeyword`: Exposes CRUD operations for the **CategoryKeyword** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CategoryKeywords
    * const categoryKeywords = await prisma.categoryKeyword.findMany()
    * ```
    */
  get categoryKeyword(): Prisma.CategoryKeywordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.savedDestination`: Exposes CRUD operations for the **SavedDestination** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SavedDestinations
    * const savedDestinations = await prisma.savedDestination.findMany()
    * ```
    */
  get savedDestination(): Prisma.SavedDestinationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.itinerary`: Exposes CRUD operations for the **Itinerary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Itineraries
    * const itineraries = await prisma.itinerary.findMany()
    * ```
    */
  get itinerary(): Prisma.ItineraryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.itineraryItem`: Exposes CRUD operations for the **ItineraryItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItineraryItems
    * const itineraryItems = await prisma.itineraryItem.findMany()
    * ```
    */
  get itineraryItem(): Prisma.ItineraryItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **Review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.ReviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.visitedPlace`: Exposes CRUD operations for the **VisitedPlace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VisitedPlaces
    * const visitedPlaces = await prisma.visitedPlace.findMany()
    * ```
    */
  get visitedPlace(): Prisma.VisitedPlaceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Destination: 'Destination',
    Category: 'Category',
    DestinationCategory: 'DestinationCategory',
    CategoryKeyword: 'CategoryKeyword',
    SavedDestination: 'SavedDestination',
    Itinerary: 'Itinerary',
    ItineraryItem: 'ItineraryItem',
    Review: 'Review',
    VisitedPlace: 'VisitedPlace'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "destination" | "category" | "destinationCategory" | "categoryKeyword" | "savedDestination" | "itinerary" | "itineraryItem" | "review" | "visitedPlace"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Destination: {
        payload: Prisma.$DestinationPayload<ExtArgs>
        fields: Prisma.DestinationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DestinationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DestinationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>
          }
          findFirst: {
            args: Prisma.DestinationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DestinationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>
          }
          findMany: {
            args: Prisma.DestinationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>[]
          }
          create: {
            args: Prisma.DestinationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>
          }
          createMany: {
            args: Prisma.DestinationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DestinationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>[]
          }
          delete: {
            args: Prisma.DestinationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>
          }
          update: {
            args: Prisma.DestinationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>
          }
          deleteMany: {
            args: Prisma.DestinationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DestinationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DestinationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>[]
          }
          upsert: {
            args: Prisma.DestinationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>
          }
          aggregate: {
            args: Prisma.DestinationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDestination>
          }
          groupBy: {
            args: Prisma.DestinationGroupByArgs<ExtArgs>
            result: $Utils.Optional<DestinationGroupByOutputType>[]
          }
          count: {
            args: Prisma.DestinationCountArgs<ExtArgs>
            result: $Utils.Optional<DestinationCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      DestinationCategory: {
        payload: Prisma.$DestinationCategoryPayload<ExtArgs>
        fields: Prisma.DestinationCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DestinationCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DestinationCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>
          }
          findFirst: {
            args: Prisma.DestinationCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DestinationCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>
          }
          findMany: {
            args: Prisma.DestinationCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>[]
          }
          create: {
            args: Prisma.DestinationCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>
          }
          createMany: {
            args: Prisma.DestinationCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DestinationCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>[]
          }
          delete: {
            args: Prisma.DestinationCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>
          }
          update: {
            args: Prisma.DestinationCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>
          }
          deleteMany: {
            args: Prisma.DestinationCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DestinationCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DestinationCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>[]
          }
          upsert: {
            args: Prisma.DestinationCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DestinationCategoryPayload>
          }
          aggregate: {
            args: Prisma.DestinationCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDestinationCategory>
          }
          groupBy: {
            args: Prisma.DestinationCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DestinationCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DestinationCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<DestinationCategoryCountAggregateOutputType> | number
          }
        }
      }
      CategoryKeyword: {
        payload: Prisma.$CategoryKeywordPayload<ExtArgs>
        fields: Prisma.CategoryKeywordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryKeywordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryKeywordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>
          }
          findFirst: {
            args: Prisma.CategoryKeywordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryKeywordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>
          }
          findMany: {
            args: Prisma.CategoryKeywordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>[]
          }
          create: {
            args: Prisma.CategoryKeywordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>
          }
          createMany: {
            args: Prisma.CategoryKeywordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryKeywordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>[]
          }
          delete: {
            args: Prisma.CategoryKeywordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>
          }
          update: {
            args: Prisma.CategoryKeywordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>
          }
          deleteMany: {
            args: Prisma.CategoryKeywordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryKeywordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryKeywordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>[]
          }
          upsert: {
            args: Prisma.CategoryKeywordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryKeywordPayload>
          }
          aggregate: {
            args: Prisma.CategoryKeywordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategoryKeyword>
          }
          groupBy: {
            args: Prisma.CategoryKeywordGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryKeywordGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryKeywordCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryKeywordCountAggregateOutputType> | number
          }
        }
      }
      SavedDestination: {
        payload: Prisma.$SavedDestinationPayload<ExtArgs>
        fields: Prisma.SavedDestinationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SavedDestinationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SavedDestinationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>
          }
          findFirst: {
            args: Prisma.SavedDestinationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SavedDestinationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>
          }
          findMany: {
            args: Prisma.SavedDestinationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>[]
          }
          create: {
            args: Prisma.SavedDestinationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>
          }
          createMany: {
            args: Prisma.SavedDestinationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SavedDestinationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>[]
          }
          delete: {
            args: Prisma.SavedDestinationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>
          }
          update: {
            args: Prisma.SavedDestinationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>
          }
          deleteMany: {
            args: Prisma.SavedDestinationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SavedDestinationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SavedDestinationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>[]
          }
          upsert: {
            args: Prisma.SavedDestinationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedDestinationPayload>
          }
          aggregate: {
            args: Prisma.SavedDestinationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSavedDestination>
          }
          groupBy: {
            args: Prisma.SavedDestinationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SavedDestinationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SavedDestinationCountArgs<ExtArgs>
            result: $Utils.Optional<SavedDestinationCountAggregateOutputType> | number
          }
        }
      }
      Itinerary: {
        payload: Prisma.$ItineraryPayload<ExtArgs>
        fields: Prisma.ItineraryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItineraryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItineraryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          findFirst: {
            args: Prisma.ItineraryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItineraryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          findMany: {
            args: Prisma.ItineraryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>[]
          }
          create: {
            args: Prisma.ItineraryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          createMany: {
            args: Prisma.ItineraryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItineraryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>[]
          }
          delete: {
            args: Prisma.ItineraryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          update: {
            args: Prisma.ItineraryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          deleteMany: {
            args: Prisma.ItineraryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItineraryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ItineraryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>[]
          }
          upsert: {
            args: Prisma.ItineraryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          aggregate: {
            args: Prisma.ItineraryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItinerary>
          }
          groupBy: {
            args: Prisma.ItineraryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItineraryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItineraryCountArgs<ExtArgs>
            result: $Utils.Optional<ItineraryCountAggregateOutputType> | number
          }
        }
      }
      ItineraryItem: {
        payload: Prisma.$ItineraryItemPayload<ExtArgs>
        fields: Prisma.ItineraryItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItineraryItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItineraryItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>
          }
          findFirst: {
            args: Prisma.ItineraryItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItineraryItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>
          }
          findMany: {
            args: Prisma.ItineraryItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>[]
          }
          create: {
            args: Prisma.ItineraryItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>
          }
          createMany: {
            args: Prisma.ItineraryItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItineraryItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>[]
          }
          delete: {
            args: Prisma.ItineraryItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>
          }
          update: {
            args: Prisma.ItineraryItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>
          }
          deleteMany: {
            args: Prisma.ItineraryItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItineraryItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ItineraryItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>[]
          }
          upsert: {
            args: Prisma.ItineraryItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryItemPayload>
          }
          aggregate: {
            args: Prisma.ItineraryItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItineraryItem>
          }
          groupBy: {
            args: Prisma.ItineraryItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItineraryItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItineraryItemCountArgs<ExtArgs>
            result: $Utils.Optional<ItineraryItemCountAggregateOutputType> | number
          }
        }
      }
      Review: {
        payload: Prisma.$ReviewPayload<ExtArgs>
        fields: Prisma.ReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findFirst: {
            args: Prisma.ReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findMany: {
            args: Prisma.ReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          create: {
            args: Prisma.ReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          createMany: {
            args: Prisma.ReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          delete: {
            args: Prisma.ReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          update: {
            args: Prisma.ReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          deleteMany: {
            args: Prisma.ReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          upsert: {
            args: Prisma.ReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.ReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
      VisitedPlace: {
        payload: Prisma.$VisitedPlacePayload<ExtArgs>
        fields: Prisma.VisitedPlaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisitedPlaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisitedPlaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>
          }
          findFirst: {
            args: Prisma.VisitedPlaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisitedPlaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>
          }
          findMany: {
            args: Prisma.VisitedPlaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>[]
          }
          create: {
            args: Prisma.VisitedPlaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>
          }
          createMany: {
            args: Prisma.VisitedPlaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisitedPlaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>[]
          }
          delete: {
            args: Prisma.VisitedPlaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>
          }
          update: {
            args: Prisma.VisitedPlaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>
          }
          deleteMany: {
            args: Prisma.VisitedPlaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisitedPlaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VisitedPlaceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>[]
          }
          upsert: {
            args: Prisma.VisitedPlaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitedPlacePayload>
          }
          aggregate: {
            args: Prisma.VisitedPlaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisitedPlace>
          }
          groupBy: {
            args: Prisma.VisitedPlaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisitedPlaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisitedPlaceCountArgs<ExtArgs>
            result: $Utils.Optional<VisitedPlaceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    destination?: DestinationOmit
    category?: CategoryOmit
    destinationCategory?: DestinationCategoryOmit
    categoryKeyword?: CategoryKeywordOmit
    savedDestination?: SavedDestinationOmit
    itinerary?: ItineraryOmit
    itineraryItem?: ItineraryItemOmit
    review?: ReviewOmit
    visitedPlace?: VisitedPlaceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    savedDestinations: number
    itineraries: number
    reviews: number
    visitedPlaces: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedDestinations?: boolean | UserCountOutputTypeCountSavedDestinationsArgs
    itineraries?: boolean | UserCountOutputTypeCountItinerariesArgs
    reviews?: boolean | UserCountOutputTypeCountReviewsArgs
    visitedPlaces?: boolean | UserCountOutputTypeCountVisitedPlacesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSavedDestinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedDestinationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountItinerariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItineraryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVisitedPlacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitedPlaceWhereInput
  }


  /**
   * Count Type DestinationCountOutputType
   */

  export type DestinationCountOutputType = {
    categories: number
    savedBy: number
    itineraryItems: number
    reviews: number
    visitedBy: number
  }

  export type DestinationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categories?: boolean | DestinationCountOutputTypeCountCategoriesArgs
    savedBy?: boolean | DestinationCountOutputTypeCountSavedByArgs
    itineraryItems?: boolean | DestinationCountOutputTypeCountItineraryItemsArgs
    reviews?: boolean | DestinationCountOutputTypeCountReviewsArgs
    visitedBy?: boolean | DestinationCountOutputTypeCountVisitedByArgs
  }

  // Custom InputTypes
  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCountOutputType
     */
    select?: DestinationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeCountCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DestinationCategoryWhereInput
  }

  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeCountSavedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedDestinationWhereInput
  }

  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeCountItineraryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItineraryItemWhereInput
  }

  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }

  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeCountVisitedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitedPlaceWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    destinations: number
    keywords: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    destinations?: boolean | CategoryCountOutputTypeCountDestinationsArgs
    keywords?: boolean | CategoryCountOutputTypeCountKeywordsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountDestinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DestinationCategoryWhereInput
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountKeywordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryKeywordWhereInput
  }


  /**
   * Count Type ItineraryCountOutputType
   */

  export type ItineraryCountOutputType = {
    items: number
  }

  export type ItineraryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ItineraryCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * ItineraryCountOutputType without action
   */
  export type ItineraryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryCountOutputType
     */
    select?: ItineraryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItineraryCountOutputType without action
   */
  export type ItineraryCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItineraryItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    gender: $Enums.Gender | null
    domisili: string | null
    photo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    gender: $Enums.Gender | null
    domisili: string | null
    photo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    gender: number
    domisili: number
    photo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    gender?: true
    domisili?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    gender?: true
    domisili?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    gender?: true
    domisili?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string
    email: string
    password: string
    role: $Enums.Role | null
    gender: $Enums.Gender | null
    domisili: string | null
    photo: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    gender?: boolean
    domisili?: boolean
    photo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    savedDestinations?: boolean | User$savedDestinationsArgs<ExtArgs>
    itineraries?: boolean | User$itinerariesArgs<ExtArgs>
    reviews?: boolean | User$reviewsArgs<ExtArgs>
    visitedPlaces?: boolean | User$visitedPlacesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    gender?: boolean
    domisili?: boolean
    photo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    gender?: boolean
    domisili?: boolean
    photo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    gender?: boolean
    domisili?: boolean
    photo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "gender" | "domisili" | "photo" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedDestinations?: boolean | User$savedDestinationsArgs<ExtArgs>
    itineraries?: boolean | User$itinerariesArgs<ExtArgs>
    reviews?: boolean | User$reviewsArgs<ExtArgs>
    visitedPlaces?: boolean | User$visitedPlacesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      savedDestinations: Prisma.$SavedDestinationPayload<ExtArgs>[]
      itineraries: Prisma.$ItineraryPayload<ExtArgs>[]
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
      visitedPlaces: Prisma.$VisitedPlacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      password: string
      role: $Enums.Role | null
      gender: $Enums.Gender | null
      domisili: string | null
      photo: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    savedDestinations<T extends User$savedDestinationsArgs<ExtArgs> = {}>(args?: Subset<T, User$savedDestinationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    itineraries<T extends User$itinerariesArgs<ExtArgs> = {}>(args?: Subset<T, User$itinerariesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviews<T extends User$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    visitedPlaces<T extends User$visitedPlacesArgs<ExtArgs> = {}>(args?: Subset<T, User$visitedPlacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly gender: FieldRef<"User", 'Gender'>
    readonly domisili: FieldRef<"User", 'String'>
    readonly photo: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.savedDestinations
   */
  export type User$savedDestinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    where?: SavedDestinationWhereInput
    orderBy?: SavedDestinationOrderByWithRelationInput | SavedDestinationOrderByWithRelationInput[]
    cursor?: SavedDestinationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedDestinationScalarFieldEnum | SavedDestinationScalarFieldEnum[]
  }

  /**
   * User.itineraries
   */
  export type User$itinerariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    where?: ItineraryWhereInput
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    cursor?: ItineraryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * User.reviews
   */
  export type User$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * User.visitedPlaces
   */
  export type User$visitedPlacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    where?: VisitedPlaceWhereInput
    orderBy?: VisitedPlaceOrderByWithRelationInput | VisitedPlaceOrderByWithRelationInput[]
    cursor?: VisitedPlaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisitedPlaceScalarFieldEnum | VisitedPlaceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Destination
   */

  export type AggregateDestination = {
    _count: DestinationCountAggregateOutputType | null
    _avg: DestinationAvgAggregateOutputType | null
    _sum: DestinationSumAggregateOutputType | null
    _min: DestinationMinAggregateOutputType | null
    _max: DestinationMaxAggregateOutputType | null
  }

  export type DestinationAvgAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    ticketPrice: number | null
    maxPrice: number | null
    visitCount: number | null
  }

  export type DestinationSumAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    ticketPrice: number | null
    maxPrice: number | null
    visitCount: number | null
  }

  export type DestinationMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    address: string | null
    contact: string | null
    latitude: number | null
    longitude: number | null
    imageUrl: string | null
    openTime: string | null
    closeTime: string | null
    ticketPrice: number | null
    maxPrice: number | null
    website: string | null
    visitCount: number | null
    status: $Enums.DestinationStatus | null
    isDeleted: boolean | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DestinationMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    address: string | null
    contact: string | null
    latitude: number | null
    longitude: number | null
    imageUrl: string | null
    openTime: string | null
    closeTime: string | null
    ticketPrice: number | null
    maxPrice: number | null
    website: string | null
    visitCount: number | null
    status: $Enums.DestinationStatus | null
    isDeleted: boolean | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DestinationCountAggregateOutputType = {
    id: number
    name: number
    description: number
    address: number
    contact: number
    latitude: number
    longitude: number
    imageUrl: number
    openTime: number
    closeTime: number
    ticketPrice: number
    maxPrice: number
    website: number
    visitCount: number
    status: number
    isDeleted: number
    deletedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DestinationAvgAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    ticketPrice?: true
    maxPrice?: true
    visitCount?: true
  }

  export type DestinationSumAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    ticketPrice?: true
    maxPrice?: true
    visitCount?: true
  }

  export type DestinationMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    address?: true
    contact?: true
    latitude?: true
    longitude?: true
    imageUrl?: true
    openTime?: true
    closeTime?: true
    ticketPrice?: true
    maxPrice?: true
    website?: true
    visitCount?: true
    status?: true
    isDeleted?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DestinationMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    address?: true
    contact?: true
    latitude?: true
    longitude?: true
    imageUrl?: true
    openTime?: true
    closeTime?: true
    ticketPrice?: true
    maxPrice?: true
    website?: true
    visitCount?: true
    status?: true
    isDeleted?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DestinationCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    address?: true
    contact?: true
    latitude?: true
    longitude?: true
    imageUrl?: true
    openTime?: true
    closeTime?: true
    ticketPrice?: true
    maxPrice?: true
    website?: true
    visitCount?: true
    status?: true
    isDeleted?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DestinationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Destination to aggregate.
     */
    where?: DestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Destinations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Destinations
    **/
    _count?: true | DestinationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DestinationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DestinationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DestinationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DestinationMaxAggregateInputType
  }

  export type GetDestinationAggregateType<T extends DestinationAggregateArgs> = {
        [P in keyof T & keyof AggregateDestination]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDestination[P]>
      : GetScalarType<T[P], AggregateDestination[P]>
  }




  export type DestinationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DestinationWhereInput
    orderBy?: DestinationOrderByWithAggregationInput | DestinationOrderByWithAggregationInput[]
    by: DestinationScalarFieldEnum[] | DestinationScalarFieldEnum
    having?: DestinationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DestinationCountAggregateInputType | true
    _avg?: DestinationAvgAggregateInputType
    _sum?: DestinationSumAggregateInputType
    _min?: DestinationMinAggregateInputType
    _max?: DestinationMaxAggregateInputType
  }

  export type DestinationGroupByOutputType = {
    id: number
    name: string
    description: string
    address: string
    contact: string | null
    latitude: number
    longitude: number
    imageUrl: string | null
    openTime: string | null
    closeTime: string | null
    ticketPrice: number | null
    maxPrice: number | null
    website: string | null
    visitCount: number
    status: $Enums.DestinationStatus
    isDeleted: boolean
    deletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: DestinationCountAggregateOutputType | null
    _avg: DestinationAvgAggregateOutputType | null
    _sum: DestinationSumAggregateOutputType | null
    _min: DestinationMinAggregateOutputType | null
    _max: DestinationMaxAggregateOutputType | null
  }

  type GetDestinationGroupByPayload<T extends DestinationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DestinationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DestinationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DestinationGroupByOutputType[P]>
            : GetScalarType<T[P], DestinationGroupByOutputType[P]>
        }
      >
    >


  export type DestinationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    contact?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    openTime?: boolean
    closeTime?: boolean
    ticketPrice?: boolean
    maxPrice?: boolean
    website?: boolean
    visitCount?: boolean
    status?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    categories?: boolean | Destination$categoriesArgs<ExtArgs>
    savedBy?: boolean | Destination$savedByArgs<ExtArgs>
    itineraryItems?: boolean | Destination$itineraryItemsArgs<ExtArgs>
    reviews?: boolean | Destination$reviewsArgs<ExtArgs>
    visitedBy?: boolean | Destination$visitedByArgs<ExtArgs>
    _count?: boolean | DestinationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["destination"]>

  export type DestinationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    contact?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    openTime?: boolean
    closeTime?: boolean
    ticketPrice?: boolean
    maxPrice?: boolean
    website?: boolean
    visitCount?: boolean
    status?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["destination"]>

  export type DestinationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    contact?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    openTime?: boolean
    closeTime?: boolean
    ticketPrice?: boolean
    maxPrice?: boolean
    website?: boolean
    visitCount?: boolean
    status?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["destination"]>

  export type DestinationSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    contact?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    openTime?: boolean
    closeTime?: boolean
    ticketPrice?: boolean
    maxPrice?: boolean
    website?: boolean
    visitCount?: boolean
    status?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DestinationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "address" | "contact" | "latitude" | "longitude" | "imageUrl" | "openTime" | "closeTime" | "ticketPrice" | "maxPrice" | "website" | "visitCount" | "status" | "isDeleted" | "deletedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["destination"]>
  export type DestinationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categories?: boolean | Destination$categoriesArgs<ExtArgs>
    savedBy?: boolean | Destination$savedByArgs<ExtArgs>
    itineraryItems?: boolean | Destination$itineraryItemsArgs<ExtArgs>
    reviews?: boolean | Destination$reviewsArgs<ExtArgs>
    visitedBy?: boolean | Destination$visitedByArgs<ExtArgs>
    _count?: boolean | DestinationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DestinationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DestinationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DestinationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Destination"
    objects: {
      categories: Prisma.$DestinationCategoryPayload<ExtArgs>[]
      savedBy: Prisma.$SavedDestinationPayload<ExtArgs>[]
      itineraryItems: Prisma.$ItineraryItemPayload<ExtArgs>[]
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
      visitedBy: Prisma.$VisitedPlacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string
      address: string
      contact: string | null
      latitude: number
      longitude: number
      imageUrl: string | null
      openTime: string | null
      closeTime: string | null
      ticketPrice: number | null
      maxPrice: number | null
      website: string | null
      visitCount: number
      status: $Enums.DestinationStatus
      isDeleted: boolean
      deletedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["destination"]>
    composites: {}
  }

  type DestinationGetPayload<S extends boolean | null | undefined | DestinationDefaultArgs> = $Result.GetResult<Prisma.$DestinationPayload, S>

  type DestinationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DestinationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DestinationCountAggregateInputType | true
    }

  export interface DestinationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Destination'], meta: { name: 'Destination' } }
    /**
     * Find zero or one Destination that matches the filter.
     * @param {DestinationFindUniqueArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DestinationFindUniqueArgs>(args: SelectSubset<T, DestinationFindUniqueArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Destination that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DestinationFindUniqueOrThrowArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DestinationFindUniqueOrThrowArgs>(args: SelectSubset<T, DestinationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Destination that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationFindFirstArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DestinationFindFirstArgs>(args?: SelectSubset<T, DestinationFindFirstArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Destination that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationFindFirstOrThrowArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DestinationFindFirstOrThrowArgs>(args?: SelectSubset<T, DestinationFindFirstOrThrowArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Destinations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Destinations
     * const destinations = await prisma.destination.findMany()
     * 
     * // Get first 10 Destinations
     * const destinations = await prisma.destination.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const destinationWithIdOnly = await prisma.destination.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DestinationFindManyArgs>(args?: SelectSubset<T, DestinationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Destination.
     * @param {DestinationCreateArgs} args - Arguments to create a Destination.
     * @example
     * // Create one Destination
     * const Destination = await prisma.destination.create({
     *   data: {
     *     // ... data to create a Destination
     *   }
     * })
     * 
     */
    create<T extends DestinationCreateArgs>(args: SelectSubset<T, DestinationCreateArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Destinations.
     * @param {DestinationCreateManyArgs} args - Arguments to create many Destinations.
     * @example
     * // Create many Destinations
     * const destination = await prisma.destination.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DestinationCreateManyArgs>(args?: SelectSubset<T, DestinationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Destinations and returns the data saved in the database.
     * @param {DestinationCreateManyAndReturnArgs} args - Arguments to create many Destinations.
     * @example
     * // Create many Destinations
     * const destination = await prisma.destination.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Destinations and only return the `id`
     * const destinationWithIdOnly = await prisma.destination.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DestinationCreateManyAndReturnArgs>(args?: SelectSubset<T, DestinationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Destination.
     * @param {DestinationDeleteArgs} args - Arguments to delete one Destination.
     * @example
     * // Delete one Destination
     * const Destination = await prisma.destination.delete({
     *   where: {
     *     // ... filter to delete one Destination
     *   }
     * })
     * 
     */
    delete<T extends DestinationDeleteArgs>(args: SelectSubset<T, DestinationDeleteArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Destination.
     * @param {DestinationUpdateArgs} args - Arguments to update one Destination.
     * @example
     * // Update one Destination
     * const destination = await prisma.destination.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DestinationUpdateArgs>(args: SelectSubset<T, DestinationUpdateArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Destinations.
     * @param {DestinationDeleteManyArgs} args - Arguments to filter Destinations to delete.
     * @example
     * // Delete a few Destinations
     * const { count } = await prisma.destination.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DestinationDeleteManyArgs>(args?: SelectSubset<T, DestinationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Destinations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Destinations
     * const destination = await prisma.destination.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DestinationUpdateManyArgs>(args: SelectSubset<T, DestinationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Destinations and returns the data updated in the database.
     * @param {DestinationUpdateManyAndReturnArgs} args - Arguments to update many Destinations.
     * @example
     * // Update many Destinations
     * const destination = await prisma.destination.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Destinations and only return the `id`
     * const destinationWithIdOnly = await prisma.destination.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DestinationUpdateManyAndReturnArgs>(args: SelectSubset<T, DestinationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Destination.
     * @param {DestinationUpsertArgs} args - Arguments to update or create a Destination.
     * @example
     * // Update or create a Destination
     * const destination = await prisma.destination.upsert({
     *   create: {
     *     // ... data to create a Destination
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Destination we want to update
     *   }
     * })
     */
    upsert<T extends DestinationUpsertArgs>(args: SelectSubset<T, DestinationUpsertArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Destinations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCountArgs} args - Arguments to filter Destinations to count.
     * @example
     * // Count the number of Destinations
     * const count = await prisma.destination.count({
     *   where: {
     *     // ... the filter for the Destinations we want to count
     *   }
     * })
    **/
    count<T extends DestinationCountArgs>(
      args?: Subset<T, DestinationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DestinationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Destination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DestinationAggregateArgs>(args: Subset<T, DestinationAggregateArgs>): Prisma.PrismaPromise<GetDestinationAggregateType<T>>

    /**
     * Group by Destination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DestinationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DestinationGroupByArgs['orderBy'] }
        : { orderBy?: DestinationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DestinationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDestinationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Destination model
   */
  readonly fields: DestinationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Destination.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DestinationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categories<T extends Destination$categoriesArgs<ExtArgs> = {}>(args?: Subset<T, Destination$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    savedBy<T extends Destination$savedByArgs<ExtArgs> = {}>(args?: Subset<T, Destination$savedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    itineraryItems<T extends Destination$itineraryItemsArgs<ExtArgs> = {}>(args?: Subset<T, Destination$itineraryItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviews<T extends Destination$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Destination$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    visitedBy<T extends Destination$visitedByArgs<ExtArgs> = {}>(args?: Subset<T, Destination$visitedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Destination model
   */
  interface DestinationFieldRefs {
    readonly id: FieldRef<"Destination", 'Int'>
    readonly name: FieldRef<"Destination", 'String'>
    readonly description: FieldRef<"Destination", 'String'>
    readonly address: FieldRef<"Destination", 'String'>
    readonly contact: FieldRef<"Destination", 'String'>
    readonly latitude: FieldRef<"Destination", 'Float'>
    readonly longitude: FieldRef<"Destination", 'Float'>
    readonly imageUrl: FieldRef<"Destination", 'String'>
    readonly openTime: FieldRef<"Destination", 'String'>
    readonly closeTime: FieldRef<"Destination", 'String'>
    readonly ticketPrice: FieldRef<"Destination", 'Int'>
    readonly maxPrice: FieldRef<"Destination", 'Int'>
    readonly website: FieldRef<"Destination", 'String'>
    readonly visitCount: FieldRef<"Destination", 'Int'>
    readonly status: FieldRef<"Destination", 'DestinationStatus'>
    readonly isDeleted: FieldRef<"Destination", 'Boolean'>
    readonly deletedAt: FieldRef<"Destination", 'DateTime'>
    readonly createdAt: FieldRef<"Destination", 'DateTime'>
    readonly updatedAt: FieldRef<"Destination", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Destination findUnique
   */
  export type DestinationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * Filter, which Destination to fetch.
     */
    where: DestinationWhereUniqueInput
  }

  /**
   * Destination findUniqueOrThrow
   */
  export type DestinationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * Filter, which Destination to fetch.
     */
    where: DestinationWhereUniqueInput
  }

  /**
   * Destination findFirst
   */
  export type DestinationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * Filter, which Destination to fetch.
     */
    where?: DestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Destinations.
     */
    cursor?: DestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Destinations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Destinations.
     */
    distinct?: DestinationScalarFieldEnum | DestinationScalarFieldEnum[]
  }

  /**
   * Destination findFirstOrThrow
   */
  export type DestinationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * Filter, which Destination to fetch.
     */
    where?: DestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Destinations.
     */
    cursor?: DestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Destinations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Destinations.
     */
    distinct?: DestinationScalarFieldEnum | DestinationScalarFieldEnum[]
  }

  /**
   * Destination findMany
   */
  export type DestinationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * Filter, which Destinations to fetch.
     */
    where?: DestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Destinations.
     */
    cursor?: DestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Destinations.
     */
    skip?: number
    distinct?: DestinationScalarFieldEnum | DestinationScalarFieldEnum[]
  }

  /**
   * Destination create
   */
  export type DestinationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * The data needed to create a Destination.
     */
    data: XOR<DestinationCreateInput, DestinationUncheckedCreateInput>
  }

  /**
   * Destination createMany
   */
  export type DestinationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Destinations.
     */
    data: DestinationCreateManyInput | DestinationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Destination createManyAndReturn
   */
  export type DestinationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * The data used to create many Destinations.
     */
    data: DestinationCreateManyInput | DestinationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Destination update
   */
  export type DestinationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * The data needed to update a Destination.
     */
    data: XOR<DestinationUpdateInput, DestinationUncheckedUpdateInput>
    /**
     * Choose, which Destination to update.
     */
    where: DestinationWhereUniqueInput
  }

  /**
   * Destination updateMany
   */
  export type DestinationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Destinations.
     */
    data: XOR<DestinationUpdateManyMutationInput, DestinationUncheckedUpdateManyInput>
    /**
     * Filter which Destinations to update
     */
    where?: DestinationWhereInput
    /**
     * Limit how many Destinations to update.
     */
    limit?: number
  }

  /**
   * Destination updateManyAndReturn
   */
  export type DestinationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * The data used to update Destinations.
     */
    data: XOR<DestinationUpdateManyMutationInput, DestinationUncheckedUpdateManyInput>
    /**
     * Filter which Destinations to update
     */
    where?: DestinationWhereInput
    /**
     * Limit how many Destinations to update.
     */
    limit?: number
  }

  /**
   * Destination upsert
   */
  export type DestinationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * The filter to search for the Destination to update in case it exists.
     */
    where: DestinationWhereUniqueInput
    /**
     * In case the Destination found by the `where` argument doesn't exist, create a new Destination with this data.
     */
    create: XOR<DestinationCreateInput, DestinationUncheckedCreateInput>
    /**
     * In case the Destination was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DestinationUpdateInput, DestinationUncheckedUpdateInput>
  }

  /**
   * Destination delete
   */
  export type DestinationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
    /**
     * Filter which Destination to delete.
     */
    where: DestinationWhereUniqueInput
  }

  /**
   * Destination deleteMany
   */
  export type DestinationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Destinations to delete
     */
    where?: DestinationWhereInput
    /**
     * Limit how many Destinations to delete.
     */
    limit?: number
  }

  /**
   * Destination.categories
   */
  export type Destination$categoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    where?: DestinationCategoryWhereInput
    orderBy?: DestinationCategoryOrderByWithRelationInput | DestinationCategoryOrderByWithRelationInput[]
    cursor?: DestinationCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DestinationCategoryScalarFieldEnum | DestinationCategoryScalarFieldEnum[]
  }

  /**
   * Destination.savedBy
   */
  export type Destination$savedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    where?: SavedDestinationWhereInput
    orderBy?: SavedDestinationOrderByWithRelationInput | SavedDestinationOrderByWithRelationInput[]
    cursor?: SavedDestinationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedDestinationScalarFieldEnum | SavedDestinationScalarFieldEnum[]
  }

  /**
   * Destination.itineraryItems
   */
  export type Destination$itineraryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    where?: ItineraryItemWhereInput
    orderBy?: ItineraryItemOrderByWithRelationInput | ItineraryItemOrderByWithRelationInput[]
    cursor?: ItineraryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItineraryItemScalarFieldEnum | ItineraryItemScalarFieldEnum[]
  }

  /**
   * Destination.reviews
   */
  export type Destination$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Destination.visitedBy
   */
  export type Destination$visitedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    where?: VisitedPlaceWhereInput
    orderBy?: VisitedPlaceOrderByWithRelationInput | VisitedPlaceOrderByWithRelationInput[]
    cursor?: VisitedPlaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisitedPlaceScalarFieldEnum | VisitedPlaceScalarFieldEnum[]
  }

  /**
   * Destination without action
   */
  export type DestinationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    createdAt: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    destinations?: boolean | Category$destinationsArgs<ExtArgs>
    keywords?: boolean | Category$keywordsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    destinations?: boolean | Category$destinationsArgs<ExtArgs>
    keywords?: boolean | Category$keywordsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      destinations: Prisma.$DestinationCategoryPayload<ExtArgs>[]
      keywords: Prisma.$CategoryKeywordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      createdAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    destinations<T extends Category$destinationsArgs<ExtArgs> = {}>(args?: Subset<T, Category$destinationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    keywords<T extends Category$keywordsArgs<ExtArgs> = {}>(args?: Subset<T, Category$keywordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.destinations
   */
  export type Category$destinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    where?: DestinationCategoryWhereInput
    orderBy?: DestinationCategoryOrderByWithRelationInput | DestinationCategoryOrderByWithRelationInput[]
    cursor?: DestinationCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DestinationCategoryScalarFieldEnum | DestinationCategoryScalarFieldEnum[]
  }

  /**
   * Category.keywords
   */
  export type Category$keywordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    where?: CategoryKeywordWhereInput
    orderBy?: CategoryKeywordOrderByWithRelationInput | CategoryKeywordOrderByWithRelationInput[]
    cursor?: CategoryKeywordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryKeywordScalarFieldEnum | CategoryKeywordScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model DestinationCategory
   */

  export type AggregateDestinationCategory = {
    _count: DestinationCategoryCountAggregateOutputType | null
    _avg: DestinationCategoryAvgAggregateOutputType | null
    _sum: DestinationCategorySumAggregateOutputType | null
    _min: DestinationCategoryMinAggregateOutputType | null
    _max: DestinationCategoryMaxAggregateOutputType | null
  }

  export type DestinationCategoryAvgAggregateOutputType = {
    id: number | null
    destinationId: number | null
    categoryId: number | null
  }

  export type DestinationCategorySumAggregateOutputType = {
    id: number | null
    destinationId: number | null
    categoryId: number | null
  }

  export type DestinationCategoryMinAggregateOutputType = {
    id: number | null
    destinationId: number | null
    categoryId: number | null
  }

  export type DestinationCategoryMaxAggregateOutputType = {
    id: number | null
    destinationId: number | null
    categoryId: number | null
  }

  export type DestinationCategoryCountAggregateOutputType = {
    id: number
    destinationId: number
    categoryId: number
    _all: number
  }


  export type DestinationCategoryAvgAggregateInputType = {
    id?: true
    destinationId?: true
    categoryId?: true
  }

  export type DestinationCategorySumAggregateInputType = {
    id?: true
    destinationId?: true
    categoryId?: true
  }

  export type DestinationCategoryMinAggregateInputType = {
    id?: true
    destinationId?: true
    categoryId?: true
  }

  export type DestinationCategoryMaxAggregateInputType = {
    id?: true
    destinationId?: true
    categoryId?: true
  }

  export type DestinationCategoryCountAggregateInputType = {
    id?: true
    destinationId?: true
    categoryId?: true
    _all?: true
  }

  export type DestinationCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DestinationCategory to aggregate.
     */
    where?: DestinationCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DestinationCategories to fetch.
     */
    orderBy?: DestinationCategoryOrderByWithRelationInput | DestinationCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DestinationCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DestinationCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DestinationCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DestinationCategories
    **/
    _count?: true | DestinationCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DestinationCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DestinationCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DestinationCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DestinationCategoryMaxAggregateInputType
  }

  export type GetDestinationCategoryAggregateType<T extends DestinationCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateDestinationCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDestinationCategory[P]>
      : GetScalarType<T[P], AggregateDestinationCategory[P]>
  }




  export type DestinationCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DestinationCategoryWhereInput
    orderBy?: DestinationCategoryOrderByWithAggregationInput | DestinationCategoryOrderByWithAggregationInput[]
    by: DestinationCategoryScalarFieldEnum[] | DestinationCategoryScalarFieldEnum
    having?: DestinationCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DestinationCategoryCountAggregateInputType | true
    _avg?: DestinationCategoryAvgAggregateInputType
    _sum?: DestinationCategorySumAggregateInputType
    _min?: DestinationCategoryMinAggregateInputType
    _max?: DestinationCategoryMaxAggregateInputType
  }

  export type DestinationCategoryGroupByOutputType = {
    id: number
    destinationId: number
    categoryId: number
    _count: DestinationCategoryCountAggregateOutputType | null
    _avg: DestinationCategoryAvgAggregateOutputType | null
    _sum: DestinationCategorySumAggregateOutputType | null
    _min: DestinationCategoryMinAggregateOutputType | null
    _max: DestinationCategoryMaxAggregateOutputType | null
  }

  type GetDestinationCategoryGroupByPayload<T extends DestinationCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DestinationCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DestinationCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DestinationCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], DestinationCategoryGroupByOutputType[P]>
        }
      >
    >


  export type DestinationCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    destinationId?: boolean
    categoryId?: boolean
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["destinationCategory"]>

  export type DestinationCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    destinationId?: boolean
    categoryId?: boolean
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["destinationCategory"]>

  export type DestinationCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    destinationId?: boolean
    categoryId?: boolean
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["destinationCategory"]>

  export type DestinationCategorySelectScalar = {
    id?: boolean
    destinationId?: boolean
    categoryId?: boolean
  }

  export type DestinationCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "destinationId" | "categoryId", ExtArgs["result"]["destinationCategory"]>
  export type DestinationCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }
  export type DestinationCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }
  export type DestinationCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }

  export type $DestinationCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DestinationCategory"
    objects: {
      destination: Prisma.$DestinationPayload<ExtArgs>
      category: Prisma.$CategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      destinationId: number
      categoryId: number
    }, ExtArgs["result"]["destinationCategory"]>
    composites: {}
  }

  type DestinationCategoryGetPayload<S extends boolean | null | undefined | DestinationCategoryDefaultArgs> = $Result.GetResult<Prisma.$DestinationCategoryPayload, S>

  type DestinationCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DestinationCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DestinationCategoryCountAggregateInputType | true
    }

  export interface DestinationCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DestinationCategory'], meta: { name: 'DestinationCategory' } }
    /**
     * Find zero or one DestinationCategory that matches the filter.
     * @param {DestinationCategoryFindUniqueArgs} args - Arguments to find a DestinationCategory
     * @example
     * // Get one DestinationCategory
     * const destinationCategory = await prisma.destinationCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DestinationCategoryFindUniqueArgs>(args: SelectSubset<T, DestinationCategoryFindUniqueArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DestinationCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DestinationCategoryFindUniqueOrThrowArgs} args - Arguments to find a DestinationCategory
     * @example
     * // Get one DestinationCategory
     * const destinationCategory = await prisma.destinationCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DestinationCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, DestinationCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DestinationCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCategoryFindFirstArgs} args - Arguments to find a DestinationCategory
     * @example
     * // Get one DestinationCategory
     * const destinationCategory = await prisma.destinationCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DestinationCategoryFindFirstArgs>(args?: SelectSubset<T, DestinationCategoryFindFirstArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DestinationCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCategoryFindFirstOrThrowArgs} args - Arguments to find a DestinationCategory
     * @example
     * // Get one DestinationCategory
     * const destinationCategory = await prisma.destinationCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DestinationCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, DestinationCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DestinationCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DestinationCategories
     * const destinationCategories = await prisma.destinationCategory.findMany()
     * 
     * // Get first 10 DestinationCategories
     * const destinationCategories = await prisma.destinationCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const destinationCategoryWithIdOnly = await prisma.destinationCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DestinationCategoryFindManyArgs>(args?: SelectSubset<T, DestinationCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DestinationCategory.
     * @param {DestinationCategoryCreateArgs} args - Arguments to create a DestinationCategory.
     * @example
     * // Create one DestinationCategory
     * const DestinationCategory = await prisma.destinationCategory.create({
     *   data: {
     *     // ... data to create a DestinationCategory
     *   }
     * })
     * 
     */
    create<T extends DestinationCategoryCreateArgs>(args: SelectSubset<T, DestinationCategoryCreateArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DestinationCategories.
     * @param {DestinationCategoryCreateManyArgs} args - Arguments to create many DestinationCategories.
     * @example
     * // Create many DestinationCategories
     * const destinationCategory = await prisma.destinationCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DestinationCategoryCreateManyArgs>(args?: SelectSubset<T, DestinationCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DestinationCategories and returns the data saved in the database.
     * @param {DestinationCategoryCreateManyAndReturnArgs} args - Arguments to create many DestinationCategories.
     * @example
     * // Create many DestinationCategories
     * const destinationCategory = await prisma.destinationCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DestinationCategories and only return the `id`
     * const destinationCategoryWithIdOnly = await prisma.destinationCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DestinationCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, DestinationCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DestinationCategory.
     * @param {DestinationCategoryDeleteArgs} args - Arguments to delete one DestinationCategory.
     * @example
     * // Delete one DestinationCategory
     * const DestinationCategory = await prisma.destinationCategory.delete({
     *   where: {
     *     // ... filter to delete one DestinationCategory
     *   }
     * })
     * 
     */
    delete<T extends DestinationCategoryDeleteArgs>(args: SelectSubset<T, DestinationCategoryDeleteArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DestinationCategory.
     * @param {DestinationCategoryUpdateArgs} args - Arguments to update one DestinationCategory.
     * @example
     * // Update one DestinationCategory
     * const destinationCategory = await prisma.destinationCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DestinationCategoryUpdateArgs>(args: SelectSubset<T, DestinationCategoryUpdateArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DestinationCategories.
     * @param {DestinationCategoryDeleteManyArgs} args - Arguments to filter DestinationCategories to delete.
     * @example
     * // Delete a few DestinationCategories
     * const { count } = await prisma.destinationCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DestinationCategoryDeleteManyArgs>(args?: SelectSubset<T, DestinationCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DestinationCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DestinationCategories
     * const destinationCategory = await prisma.destinationCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DestinationCategoryUpdateManyArgs>(args: SelectSubset<T, DestinationCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DestinationCategories and returns the data updated in the database.
     * @param {DestinationCategoryUpdateManyAndReturnArgs} args - Arguments to update many DestinationCategories.
     * @example
     * // Update many DestinationCategories
     * const destinationCategory = await prisma.destinationCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DestinationCategories and only return the `id`
     * const destinationCategoryWithIdOnly = await prisma.destinationCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DestinationCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, DestinationCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DestinationCategory.
     * @param {DestinationCategoryUpsertArgs} args - Arguments to update or create a DestinationCategory.
     * @example
     * // Update or create a DestinationCategory
     * const destinationCategory = await prisma.destinationCategory.upsert({
     *   create: {
     *     // ... data to create a DestinationCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DestinationCategory we want to update
     *   }
     * })
     */
    upsert<T extends DestinationCategoryUpsertArgs>(args: SelectSubset<T, DestinationCategoryUpsertArgs<ExtArgs>>): Prisma__DestinationCategoryClient<$Result.GetResult<Prisma.$DestinationCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DestinationCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCategoryCountArgs} args - Arguments to filter DestinationCategories to count.
     * @example
     * // Count the number of DestinationCategories
     * const count = await prisma.destinationCategory.count({
     *   where: {
     *     // ... the filter for the DestinationCategories we want to count
     *   }
     * })
    **/
    count<T extends DestinationCategoryCountArgs>(
      args?: Subset<T, DestinationCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DestinationCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DestinationCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DestinationCategoryAggregateArgs>(args: Subset<T, DestinationCategoryAggregateArgs>): Prisma.PrismaPromise<GetDestinationCategoryAggregateType<T>>

    /**
     * Group by DestinationCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DestinationCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DestinationCategoryGroupByArgs['orderBy'] }
        : { orderBy?: DestinationCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DestinationCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDestinationCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DestinationCategory model
   */
  readonly fields: DestinationCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DestinationCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DestinationCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    destination<T extends DestinationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DestinationDefaultArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DestinationCategory model
   */
  interface DestinationCategoryFieldRefs {
    readonly id: FieldRef<"DestinationCategory", 'Int'>
    readonly destinationId: FieldRef<"DestinationCategory", 'Int'>
    readonly categoryId: FieldRef<"DestinationCategory", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * DestinationCategory findUnique
   */
  export type DestinationCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * Filter, which DestinationCategory to fetch.
     */
    where: DestinationCategoryWhereUniqueInput
  }

  /**
   * DestinationCategory findUniqueOrThrow
   */
  export type DestinationCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * Filter, which DestinationCategory to fetch.
     */
    where: DestinationCategoryWhereUniqueInput
  }

  /**
   * DestinationCategory findFirst
   */
  export type DestinationCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * Filter, which DestinationCategory to fetch.
     */
    where?: DestinationCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DestinationCategories to fetch.
     */
    orderBy?: DestinationCategoryOrderByWithRelationInput | DestinationCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DestinationCategories.
     */
    cursor?: DestinationCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DestinationCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DestinationCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DestinationCategories.
     */
    distinct?: DestinationCategoryScalarFieldEnum | DestinationCategoryScalarFieldEnum[]
  }

  /**
   * DestinationCategory findFirstOrThrow
   */
  export type DestinationCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * Filter, which DestinationCategory to fetch.
     */
    where?: DestinationCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DestinationCategories to fetch.
     */
    orderBy?: DestinationCategoryOrderByWithRelationInput | DestinationCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DestinationCategories.
     */
    cursor?: DestinationCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DestinationCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DestinationCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DestinationCategories.
     */
    distinct?: DestinationCategoryScalarFieldEnum | DestinationCategoryScalarFieldEnum[]
  }

  /**
   * DestinationCategory findMany
   */
  export type DestinationCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * Filter, which DestinationCategories to fetch.
     */
    where?: DestinationCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DestinationCategories to fetch.
     */
    orderBy?: DestinationCategoryOrderByWithRelationInput | DestinationCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DestinationCategories.
     */
    cursor?: DestinationCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DestinationCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DestinationCategories.
     */
    skip?: number
    distinct?: DestinationCategoryScalarFieldEnum | DestinationCategoryScalarFieldEnum[]
  }

  /**
   * DestinationCategory create
   */
  export type DestinationCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a DestinationCategory.
     */
    data: XOR<DestinationCategoryCreateInput, DestinationCategoryUncheckedCreateInput>
  }

  /**
   * DestinationCategory createMany
   */
  export type DestinationCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DestinationCategories.
     */
    data: DestinationCategoryCreateManyInput | DestinationCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DestinationCategory createManyAndReturn
   */
  export type DestinationCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many DestinationCategories.
     */
    data: DestinationCategoryCreateManyInput | DestinationCategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DestinationCategory update
   */
  export type DestinationCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a DestinationCategory.
     */
    data: XOR<DestinationCategoryUpdateInput, DestinationCategoryUncheckedUpdateInput>
    /**
     * Choose, which DestinationCategory to update.
     */
    where: DestinationCategoryWhereUniqueInput
  }

  /**
   * DestinationCategory updateMany
   */
  export type DestinationCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DestinationCategories.
     */
    data: XOR<DestinationCategoryUpdateManyMutationInput, DestinationCategoryUncheckedUpdateManyInput>
    /**
     * Filter which DestinationCategories to update
     */
    where?: DestinationCategoryWhereInput
    /**
     * Limit how many DestinationCategories to update.
     */
    limit?: number
  }

  /**
   * DestinationCategory updateManyAndReturn
   */
  export type DestinationCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * The data used to update DestinationCategories.
     */
    data: XOR<DestinationCategoryUpdateManyMutationInput, DestinationCategoryUncheckedUpdateManyInput>
    /**
     * Filter which DestinationCategories to update
     */
    where?: DestinationCategoryWhereInput
    /**
     * Limit how many DestinationCategories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DestinationCategory upsert
   */
  export type DestinationCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the DestinationCategory to update in case it exists.
     */
    where: DestinationCategoryWhereUniqueInput
    /**
     * In case the DestinationCategory found by the `where` argument doesn't exist, create a new DestinationCategory with this data.
     */
    create: XOR<DestinationCategoryCreateInput, DestinationCategoryUncheckedCreateInput>
    /**
     * In case the DestinationCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DestinationCategoryUpdateInput, DestinationCategoryUncheckedUpdateInput>
  }

  /**
   * DestinationCategory delete
   */
  export type DestinationCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
    /**
     * Filter which DestinationCategory to delete.
     */
    where: DestinationCategoryWhereUniqueInput
  }

  /**
   * DestinationCategory deleteMany
   */
  export type DestinationCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DestinationCategories to delete
     */
    where?: DestinationCategoryWhereInput
    /**
     * Limit how many DestinationCategories to delete.
     */
    limit?: number
  }

  /**
   * DestinationCategory without action
   */
  export type DestinationCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DestinationCategory
     */
    select?: DestinationCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DestinationCategory
     */
    omit?: DestinationCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationCategoryInclude<ExtArgs> | null
  }


  /**
   * Model CategoryKeyword
   */

  export type AggregateCategoryKeyword = {
    _count: CategoryKeywordCountAggregateOutputType | null
    _avg: CategoryKeywordAvgAggregateOutputType | null
    _sum: CategoryKeywordSumAggregateOutputType | null
    _min: CategoryKeywordMinAggregateOutputType | null
    _max: CategoryKeywordMaxAggregateOutputType | null
  }

  export type CategoryKeywordAvgAggregateOutputType = {
    id: number | null
    categoryId: number | null
  }

  export type CategoryKeywordSumAggregateOutputType = {
    id: number | null
    categoryId: number | null
  }

  export type CategoryKeywordMinAggregateOutputType = {
    id: number | null
    keyword: string | null
    categoryId: number | null
    createdAt: Date | null
  }

  export type CategoryKeywordMaxAggregateOutputType = {
    id: number | null
    keyword: string | null
    categoryId: number | null
    createdAt: Date | null
  }

  export type CategoryKeywordCountAggregateOutputType = {
    id: number
    keyword: number
    categoryId: number
    createdAt: number
    _all: number
  }


  export type CategoryKeywordAvgAggregateInputType = {
    id?: true
    categoryId?: true
  }

  export type CategoryKeywordSumAggregateInputType = {
    id?: true
    categoryId?: true
  }

  export type CategoryKeywordMinAggregateInputType = {
    id?: true
    keyword?: true
    categoryId?: true
    createdAt?: true
  }

  export type CategoryKeywordMaxAggregateInputType = {
    id?: true
    keyword?: true
    categoryId?: true
    createdAt?: true
  }

  export type CategoryKeywordCountAggregateInputType = {
    id?: true
    keyword?: true
    categoryId?: true
    createdAt?: true
    _all?: true
  }

  export type CategoryKeywordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryKeyword to aggregate.
     */
    where?: CategoryKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryKeywords to fetch.
     */
    orderBy?: CategoryKeywordOrderByWithRelationInput | CategoryKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CategoryKeywords
    **/
    _count?: true | CategoryKeywordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryKeywordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategoryKeywordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryKeywordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryKeywordMaxAggregateInputType
  }

  export type GetCategoryKeywordAggregateType<T extends CategoryKeywordAggregateArgs> = {
        [P in keyof T & keyof AggregateCategoryKeyword]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoryKeyword[P]>
      : GetScalarType<T[P], AggregateCategoryKeyword[P]>
  }




  export type CategoryKeywordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryKeywordWhereInput
    orderBy?: CategoryKeywordOrderByWithAggregationInput | CategoryKeywordOrderByWithAggregationInput[]
    by: CategoryKeywordScalarFieldEnum[] | CategoryKeywordScalarFieldEnum
    having?: CategoryKeywordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryKeywordCountAggregateInputType | true
    _avg?: CategoryKeywordAvgAggregateInputType
    _sum?: CategoryKeywordSumAggregateInputType
    _min?: CategoryKeywordMinAggregateInputType
    _max?: CategoryKeywordMaxAggregateInputType
  }

  export type CategoryKeywordGroupByOutputType = {
    id: number
    keyword: string
    categoryId: number
    createdAt: Date
    _count: CategoryKeywordCountAggregateOutputType | null
    _avg: CategoryKeywordAvgAggregateOutputType | null
    _sum: CategoryKeywordSumAggregateOutputType | null
    _min: CategoryKeywordMinAggregateOutputType | null
    _max: CategoryKeywordMaxAggregateOutputType | null
  }

  type GetCategoryKeywordGroupByPayload<T extends CategoryKeywordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryKeywordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryKeywordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryKeywordGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryKeywordGroupByOutputType[P]>
        }
      >
    >


  export type CategoryKeywordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keyword?: boolean
    categoryId?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categoryKeyword"]>

  export type CategoryKeywordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keyword?: boolean
    categoryId?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categoryKeyword"]>

  export type CategoryKeywordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keyword?: boolean
    categoryId?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categoryKeyword"]>

  export type CategoryKeywordSelectScalar = {
    id?: boolean
    keyword?: boolean
    categoryId?: boolean
    createdAt?: boolean
  }

  export type CategoryKeywordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "keyword" | "categoryId" | "createdAt", ExtArgs["result"]["categoryKeyword"]>
  export type CategoryKeywordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }
  export type CategoryKeywordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }
  export type CategoryKeywordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }

  export type $CategoryKeywordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CategoryKeyword"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      keyword: string
      categoryId: number
      createdAt: Date
    }, ExtArgs["result"]["categoryKeyword"]>
    composites: {}
  }

  type CategoryKeywordGetPayload<S extends boolean | null | undefined | CategoryKeywordDefaultArgs> = $Result.GetResult<Prisma.$CategoryKeywordPayload, S>

  type CategoryKeywordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryKeywordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryKeywordCountAggregateInputType | true
    }

  export interface CategoryKeywordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CategoryKeyword'], meta: { name: 'CategoryKeyword' } }
    /**
     * Find zero or one CategoryKeyword that matches the filter.
     * @param {CategoryKeywordFindUniqueArgs} args - Arguments to find a CategoryKeyword
     * @example
     * // Get one CategoryKeyword
     * const categoryKeyword = await prisma.categoryKeyword.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryKeywordFindUniqueArgs>(args: SelectSubset<T, CategoryKeywordFindUniqueArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CategoryKeyword that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryKeywordFindUniqueOrThrowArgs} args - Arguments to find a CategoryKeyword
     * @example
     * // Get one CategoryKeyword
     * const categoryKeyword = await prisma.categoryKeyword.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryKeywordFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryKeywordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryKeyword that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryKeywordFindFirstArgs} args - Arguments to find a CategoryKeyword
     * @example
     * // Get one CategoryKeyword
     * const categoryKeyword = await prisma.categoryKeyword.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryKeywordFindFirstArgs>(args?: SelectSubset<T, CategoryKeywordFindFirstArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryKeyword that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryKeywordFindFirstOrThrowArgs} args - Arguments to find a CategoryKeyword
     * @example
     * // Get one CategoryKeyword
     * const categoryKeyword = await prisma.categoryKeyword.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryKeywordFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryKeywordFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CategoryKeywords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryKeywordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CategoryKeywords
     * const categoryKeywords = await prisma.categoryKeyword.findMany()
     * 
     * // Get first 10 CategoryKeywords
     * const categoryKeywords = await prisma.categoryKeyword.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryKeywordWithIdOnly = await prisma.categoryKeyword.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryKeywordFindManyArgs>(args?: SelectSubset<T, CategoryKeywordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CategoryKeyword.
     * @param {CategoryKeywordCreateArgs} args - Arguments to create a CategoryKeyword.
     * @example
     * // Create one CategoryKeyword
     * const CategoryKeyword = await prisma.categoryKeyword.create({
     *   data: {
     *     // ... data to create a CategoryKeyword
     *   }
     * })
     * 
     */
    create<T extends CategoryKeywordCreateArgs>(args: SelectSubset<T, CategoryKeywordCreateArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CategoryKeywords.
     * @param {CategoryKeywordCreateManyArgs} args - Arguments to create many CategoryKeywords.
     * @example
     * // Create many CategoryKeywords
     * const categoryKeyword = await prisma.categoryKeyword.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryKeywordCreateManyArgs>(args?: SelectSubset<T, CategoryKeywordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CategoryKeywords and returns the data saved in the database.
     * @param {CategoryKeywordCreateManyAndReturnArgs} args - Arguments to create many CategoryKeywords.
     * @example
     * // Create many CategoryKeywords
     * const categoryKeyword = await prisma.categoryKeyword.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CategoryKeywords and only return the `id`
     * const categoryKeywordWithIdOnly = await prisma.categoryKeyword.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryKeywordCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryKeywordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CategoryKeyword.
     * @param {CategoryKeywordDeleteArgs} args - Arguments to delete one CategoryKeyword.
     * @example
     * // Delete one CategoryKeyword
     * const CategoryKeyword = await prisma.categoryKeyword.delete({
     *   where: {
     *     // ... filter to delete one CategoryKeyword
     *   }
     * })
     * 
     */
    delete<T extends CategoryKeywordDeleteArgs>(args: SelectSubset<T, CategoryKeywordDeleteArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CategoryKeyword.
     * @param {CategoryKeywordUpdateArgs} args - Arguments to update one CategoryKeyword.
     * @example
     * // Update one CategoryKeyword
     * const categoryKeyword = await prisma.categoryKeyword.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryKeywordUpdateArgs>(args: SelectSubset<T, CategoryKeywordUpdateArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CategoryKeywords.
     * @param {CategoryKeywordDeleteManyArgs} args - Arguments to filter CategoryKeywords to delete.
     * @example
     * // Delete a few CategoryKeywords
     * const { count } = await prisma.categoryKeyword.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryKeywordDeleteManyArgs>(args?: SelectSubset<T, CategoryKeywordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoryKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryKeywordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CategoryKeywords
     * const categoryKeyword = await prisma.categoryKeyword.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryKeywordUpdateManyArgs>(args: SelectSubset<T, CategoryKeywordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoryKeywords and returns the data updated in the database.
     * @param {CategoryKeywordUpdateManyAndReturnArgs} args - Arguments to update many CategoryKeywords.
     * @example
     * // Update many CategoryKeywords
     * const categoryKeyword = await prisma.categoryKeyword.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CategoryKeywords and only return the `id`
     * const categoryKeywordWithIdOnly = await prisma.categoryKeyword.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryKeywordUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryKeywordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CategoryKeyword.
     * @param {CategoryKeywordUpsertArgs} args - Arguments to update or create a CategoryKeyword.
     * @example
     * // Update or create a CategoryKeyword
     * const categoryKeyword = await prisma.categoryKeyword.upsert({
     *   create: {
     *     // ... data to create a CategoryKeyword
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CategoryKeyword we want to update
     *   }
     * })
     */
    upsert<T extends CategoryKeywordUpsertArgs>(args: SelectSubset<T, CategoryKeywordUpsertArgs<ExtArgs>>): Prisma__CategoryKeywordClient<$Result.GetResult<Prisma.$CategoryKeywordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CategoryKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryKeywordCountArgs} args - Arguments to filter CategoryKeywords to count.
     * @example
     * // Count the number of CategoryKeywords
     * const count = await prisma.categoryKeyword.count({
     *   where: {
     *     // ... the filter for the CategoryKeywords we want to count
     *   }
     * })
    **/
    count<T extends CategoryKeywordCountArgs>(
      args?: Subset<T, CategoryKeywordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryKeywordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CategoryKeyword.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryKeywordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryKeywordAggregateArgs>(args: Subset<T, CategoryKeywordAggregateArgs>): Prisma.PrismaPromise<GetCategoryKeywordAggregateType<T>>

    /**
     * Group by CategoryKeyword.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryKeywordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryKeywordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryKeywordGroupByArgs['orderBy'] }
        : { orderBy?: CategoryKeywordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryKeywordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryKeywordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CategoryKeyword model
   */
  readonly fields: CategoryKeywordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CategoryKeyword.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryKeywordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CategoryKeyword model
   */
  interface CategoryKeywordFieldRefs {
    readonly id: FieldRef<"CategoryKeyword", 'Int'>
    readonly keyword: FieldRef<"CategoryKeyword", 'String'>
    readonly categoryId: FieldRef<"CategoryKeyword", 'Int'>
    readonly createdAt: FieldRef<"CategoryKeyword", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CategoryKeyword findUnique
   */
  export type CategoryKeywordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * Filter, which CategoryKeyword to fetch.
     */
    where: CategoryKeywordWhereUniqueInput
  }

  /**
   * CategoryKeyword findUniqueOrThrow
   */
  export type CategoryKeywordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * Filter, which CategoryKeyword to fetch.
     */
    where: CategoryKeywordWhereUniqueInput
  }

  /**
   * CategoryKeyword findFirst
   */
  export type CategoryKeywordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * Filter, which CategoryKeyword to fetch.
     */
    where?: CategoryKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryKeywords to fetch.
     */
    orderBy?: CategoryKeywordOrderByWithRelationInput | CategoryKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryKeywords.
     */
    cursor?: CategoryKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryKeywords.
     */
    distinct?: CategoryKeywordScalarFieldEnum | CategoryKeywordScalarFieldEnum[]
  }

  /**
   * CategoryKeyword findFirstOrThrow
   */
  export type CategoryKeywordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * Filter, which CategoryKeyword to fetch.
     */
    where?: CategoryKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryKeywords to fetch.
     */
    orderBy?: CategoryKeywordOrderByWithRelationInput | CategoryKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryKeywords.
     */
    cursor?: CategoryKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryKeywords.
     */
    distinct?: CategoryKeywordScalarFieldEnum | CategoryKeywordScalarFieldEnum[]
  }

  /**
   * CategoryKeyword findMany
   */
  export type CategoryKeywordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * Filter, which CategoryKeywords to fetch.
     */
    where?: CategoryKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryKeywords to fetch.
     */
    orderBy?: CategoryKeywordOrderByWithRelationInput | CategoryKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CategoryKeywords.
     */
    cursor?: CategoryKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryKeywords.
     */
    skip?: number
    distinct?: CategoryKeywordScalarFieldEnum | CategoryKeywordScalarFieldEnum[]
  }

  /**
   * CategoryKeyword create
   */
  export type CategoryKeywordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * The data needed to create a CategoryKeyword.
     */
    data: XOR<CategoryKeywordCreateInput, CategoryKeywordUncheckedCreateInput>
  }

  /**
   * CategoryKeyword createMany
   */
  export type CategoryKeywordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CategoryKeywords.
     */
    data: CategoryKeywordCreateManyInput | CategoryKeywordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CategoryKeyword createManyAndReturn
   */
  export type CategoryKeywordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * The data used to create many CategoryKeywords.
     */
    data: CategoryKeywordCreateManyInput | CategoryKeywordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CategoryKeyword update
   */
  export type CategoryKeywordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * The data needed to update a CategoryKeyword.
     */
    data: XOR<CategoryKeywordUpdateInput, CategoryKeywordUncheckedUpdateInput>
    /**
     * Choose, which CategoryKeyword to update.
     */
    where: CategoryKeywordWhereUniqueInput
  }

  /**
   * CategoryKeyword updateMany
   */
  export type CategoryKeywordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CategoryKeywords.
     */
    data: XOR<CategoryKeywordUpdateManyMutationInput, CategoryKeywordUncheckedUpdateManyInput>
    /**
     * Filter which CategoryKeywords to update
     */
    where?: CategoryKeywordWhereInput
    /**
     * Limit how many CategoryKeywords to update.
     */
    limit?: number
  }

  /**
   * CategoryKeyword updateManyAndReturn
   */
  export type CategoryKeywordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * The data used to update CategoryKeywords.
     */
    data: XOR<CategoryKeywordUpdateManyMutationInput, CategoryKeywordUncheckedUpdateManyInput>
    /**
     * Filter which CategoryKeywords to update
     */
    where?: CategoryKeywordWhereInput
    /**
     * Limit how many CategoryKeywords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CategoryKeyword upsert
   */
  export type CategoryKeywordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * The filter to search for the CategoryKeyword to update in case it exists.
     */
    where: CategoryKeywordWhereUniqueInput
    /**
     * In case the CategoryKeyword found by the `where` argument doesn't exist, create a new CategoryKeyword with this data.
     */
    create: XOR<CategoryKeywordCreateInput, CategoryKeywordUncheckedCreateInput>
    /**
     * In case the CategoryKeyword was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryKeywordUpdateInput, CategoryKeywordUncheckedUpdateInput>
  }

  /**
   * CategoryKeyword delete
   */
  export type CategoryKeywordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
    /**
     * Filter which CategoryKeyword to delete.
     */
    where: CategoryKeywordWhereUniqueInput
  }

  /**
   * CategoryKeyword deleteMany
   */
  export type CategoryKeywordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryKeywords to delete
     */
    where?: CategoryKeywordWhereInput
    /**
     * Limit how many CategoryKeywords to delete.
     */
    limit?: number
  }

  /**
   * CategoryKeyword without action
   */
  export type CategoryKeywordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryKeyword
     */
    select?: CategoryKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryKeyword
     */
    omit?: CategoryKeywordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryKeywordInclude<ExtArgs> | null
  }


  /**
   * Model SavedDestination
   */

  export type AggregateSavedDestination = {
    _count: SavedDestinationCountAggregateOutputType | null
    _avg: SavedDestinationAvgAggregateOutputType | null
    _sum: SavedDestinationSumAggregateOutputType | null
    _min: SavedDestinationMinAggregateOutputType | null
    _max: SavedDestinationMaxAggregateOutputType | null
  }

  export type SavedDestinationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
  }

  export type SavedDestinationSumAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
  }

  export type SavedDestinationMinAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    createdAt: Date | null
  }

  export type SavedDestinationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    createdAt: Date | null
  }

  export type SavedDestinationCountAggregateOutputType = {
    id: number
    userId: number
    destinationId: number
    createdAt: number
    _all: number
  }


  export type SavedDestinationAvgAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
  }

  export type SavedDestinationSumAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
  }

  export type SavedDestinationMinAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    createdAt?: true
  }

  export type SavedDestinationMaxAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    createdAt?: true
  }

  export type SavedDestinationCountAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    createdAt?: true
    _all?: true
  }

  export type SavedDestinationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedDestination to aggregate.
     */
    where?: SavedDestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedDestinations to fetch.
     */
    orderBy?: SavedDestinationOrderByWithRelationInput | SavedDestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SavedDestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedDestinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedDestinations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SavedDestinations
    **/
    _count?: true | SavedDestinationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SavedDestinationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SavedDestinationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SavedDestinationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SavedDestinationMaxAggregateInputType
  }

  export type GetSavedDestinationAggregateType<T extends SavedDestinationAggregateArgs> = {
        [P in keyof T & keyof AggregateSavedDestination]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSavedDestination[P]>
      : GetScalarType<T[P], AggregateSavedDestination[P]>
  }




  export type SavedDestinationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedDestinationWhereInput
    orderBy?: SavedDestinationOrderByWithAggregationInput | SavedDestinationOrderByWithAggregationInput[]
    by: SavedDestinationScalarFieldEnum[] | SavedDestinationScalarFieldEnum
    having?: SavedDestinationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SavedDestinationCountAggregateInputType | true
    _avg?: SavedDestinationAvgAggregateInputType
    _sum?: SavedDestinationSumAggregateInputType
    _min?: SavedDestinationMinAggregateInputType
    _max?: SavedDestinationMaxAggregateInputType
  }

  export type SavedDestinationGroupByOutputType = {
    id: number
    userId: number
    destinationId: number
    createdAt: Date
    _count: SavedDestinationCountAggregateOutputType | null
    _avg: SavedDestinationAvgAggregateOutputType | null
    _sum: SavedDestinationSumAggregateOutputType | null
    _min: SavedDestinationMinAggregateOutputType | null
    _max: SavedDestinationMaxAggregateOutputType | null
  }

  type GetSavedDestinationGroupByPayload<T extends SavedDestinationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SavedDestinationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SavedDestinationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SavedDestinationGroupByOutputType[P]>
            : GetScalarType<T[P], SavedDestinationGroupByOutputType[P]>
        }
      >
    >


  export type SavedDestinationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedDestination"]>

  export type SavedDestinationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedDestination"]>

  export type SavedDestinationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedDestination"]>

  export type SavedDestinationSelectScalar = {
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    createdAt?: boolean
  }

  export type SavedDestinationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "destinationId" | "createdAt", ExtArgs["result"]["savedDestination"]>
  export type SavedDestinationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type SavedDestinationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type SavedDestinationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }

  export type $SavedDestinationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SavedDestination"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      destination: Prisma.$DestinationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      destinationId: number
      createdAt: Date
    }, ExtArgs["result"]["savedDestination"]>
    composites: {}
  }

  type SavedDestinationGetPayload<S extends boolean | null | undefined | SavedDestinationDefaultArgs> = $Result.GetResult<Prisma.$SavedDestinationPayload, S>

  type SavedDestinationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SavedDestinationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SavedDestinationCountAggregateInputType | true
    }

  export interface SavedDestinationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SavedDestination'], meta: { name: 'SavedDestination' } }
    /**
     * Find zero or one SavedDestination that matches the filter.
     * @param {SavedDestinationFindUniqueArgs} args - Arguments to find a SavedDestination
     * @example
     * // Get one SavedDestination
     * const savedDestination = await prisma.savedDestination.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SavedDestinationFindUniqueArgs>(args: SelectSubset<T, SavedDestinationFindUniqueArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SavedDestination that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SavedDestinationFindUniqueOrThrowArgs} args - Arguments to find a SavedDestination
     * @example
     * // Get one SavedDestination
     * const savedDestination = await prisma.savedDestination.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SavedDestinationFindUniqueOrThrowArgs>(args: SelectSubset<T, SavedDestinationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedDestination that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedDestinationFindFirstArgs} args - Arguments to find a SavedDestination
     * @example
     * // Get one SavedDestination
     * const savedDestination = await prisma.savedDestination.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SavedDestinationFindFirstArgs>(args?: SelectSubset<T, SavedDestinationFindFirstArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedDestination that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedDestinationFindFirstOrThrowArgs} args - Arguments to find a SavedDestination
     * @example
     * // Get one SavedDestination
     * const savedDestination = await prisma.savedDestination.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SavedDestinationFindFirstOrThrowArgs>(args?: SelectSubset<T, SavedDestinationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SavedDestinations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedDestinationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SavedDestinations
     * const savedDestinations = await prisma.savedDestination.findMany()
     * 
     * // Get first 10 SavedDestinations
     * const savedDestinations = await prisma.savedDestination.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const savedDestinationWithIdOnly = await prisma.savedDestination.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SavedDestinationFindManyArgs>(args?: SelectSubset<T, SavedDestinationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SavedDestination.
     * @param {SavedDestinationCreateArgs} args - Arguments to create a SavedDestination.
     * @example
     * // Create one SavedDestination
     * const SavedDestination = await prisma.savedDestination.create({
     *   data: {
     *     // ... data to create a SavedDestination
     *   }
     * })
     * 
     */
    create<T extends SavedDestinationCreateArgs>(args: SelectSubset<T, SavedDestinationCreateArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SavedDestinations.
     * @param {SavedDestinationCreateManyArgs} args - Arguments to create many SavedDestinations.
     * @example
     * // Create many SavedDestinations
     * const savedDestination = await prisma.savedDestination.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SavedDestinationCreateManyArgs>(args?: SelectSubset<T, SavedDestinationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SavedDestinations and returns the data saved in the database.
     * @param {SavedDestinationCreateManyAndReturnArgs} args - Arguments to create many SavedDestinations.
     * @example
     * // Create many SavedDestinations
     * const savedDestination = await prisma.savedDestination.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SavedDestinations and only return the `id`
     * const savedDestinationWithIdOnly = await prisma.savedDestination.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SavedDestinationCreateManyAndReturnArgs>(args?: SelectSubset<T, SavedDestinationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SavedDestination.
     * @param {SavedDestinationDeleteArgs} args - Arguments to delete one SavedDestination.
     * @example
     * // Delete one SavedDestination
     * const SavedDestination = await prisma.savedDestination.delete({
     *   where: {
     *     // ... filter to delete one SavedDestination
     *   }
     * })
     * 
     */
    delete<T extends SavedDestinationDeleteArgs>(args: SelectSubset<T, SavedDestinationDeleteArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SavedDestination.
     * @param {SavedDestinationUpdateArgs} args - Arguments to update one SavedDestination.
     * @example
     * // Update one SavedDestination
     * const savedDestination = await prisma.savedDestination.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SavedDestinationUpdateArgs>(args: SelectSubset<T, SavedDestinationUpdateArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SavedDestinations.
     * @param {SavedDestinationDeleteManyArgs} args - Arguments to filter SavedDestinations to delete.
     * @example
     * // Delete a few SavedDestinations
     * const { count } = await prisma.savedDestination.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SavedDestinationDeleteManyArgs>(args?: SelectSubset<T, SavedDestinationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedDestinations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedDestinationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SavedDestinations
     * const savedDestination = await prisma.savedDestination.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SavedDestinationUpdateManyArgs>(args: SelectSubset<T, SavedDestinationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedDestinations and returns the data updated in the database.
     * @param {SavedDestinationUpdateManyAndReturnArgs} args - Arguments to update many SavedDestinations.
     * @example
     * // Update many SavedDestinations
     * const savedDestination = await prisma.savedDestination.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SavedDestinations and only return the `id`
     * const savedDestinationWithIdOnly = await prisma.savedDestination.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SavedDestinationUpdateManyAndReturnArgs>(args: SelectSubset<T, SavedDestinationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SavedDestination.
     * @param {SavedDestinationUpsertArgs} args - Arguments to update or create a SavedDestination.
     * @example
     * // Update or create a SavedDestination
     * const savedDestination = await prisma.savedDestination.upsert({
     *   create: {
     *     // ... data to create a SavedDestination
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SavedDestination we want to update
     *   }
     * })
     */
    upsert<T extends SavedDestinationUpsertArgs>(args: SelectSubset<T, SavedDestinationUpsertArgs<ExtArgs>>): Prisma__SavedDestinationClient<$Result.GetResult<Prisma.$SavedDestinationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SavedDestinations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedDestinationCountArgs} args - Arguments to filter SavedDestinations to count.
     * @example
     * // Count the number of SavedDestinations
     * const count = await prisma.savedDestination.count({
     *   where: {
     *     // ... the filter for the SavedDestinations we want to count
     *   }
     * })
    **/
    count<T extends SavedDestinationCountArgs>(
      args?: Subset<T, SavedDestinationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SavedDestinationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SavedDestination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedDestinationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SavedDestinationAggregateArgs>(args: Subset<T, SavedDestinationAggregateArgs>): Prisma.PrismaPromise<GetSavedDestinationAggregateType<T>>

    /**
     * Group by SavedDestination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedDestinationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SavedDestinationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SavedDestinationGroupByArgs['orderBy'] }
        : { orderBy?: SavedDestinationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SavedDestinationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedDestinationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SavedDestination model
   */
  readonly fields: SavedDestinationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SavedDestination.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SavedDestinationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    destination<T extends DestinationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DestinationDefaultArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SavedDestination model
   */
  interface SavedDestinationFieldRefs {
    readonly id: FieldRef<"SavedDestination", 'Int'>
    readonly userId: FieldRef<"SavedDestination", 'Int'>
    readonly destinationId: FieldRef<"SavedDestination", 'Int'>
    readonly createdAt: FieldRef<"SavedDestination", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SavedDestination findUnique
   */
  export type SavedDestinationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * Filter, which SavedDestination to fetch.
     */
    where: SavedDestinationWhereUniqueInput
  }

  /**
   * SavedDestination findUniqueOrThrow
   */
  export type SavedDestinationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * Filter, which SavedDestination to fetch.
     */
    where: SavedDestinationWhereUniqueInput
  }

  /**
   * SavedDestination findFirst
   */
  export type SavedDestinationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * Filter, which SavedDestination to fetch.
     */
    where?: SavedDestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedDestinations to fetch.
     */
    orderBy?: SavedDestinationOrderByWithRelationInput | SavedDestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedDestinations.
     */
    cursor?: SavedDestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedDestinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedDestinations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedDestinations.
     */
    distinct?: SavedDestinationScalarFieldEnum | SavedDestinationScalarFieldEnum[]
  }

  /**
   * SavedDestination findFirstOrThrow
   */
  export type SavedDestinationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * Filter, which SavedDestination to fetch.
     */
    where?: SavedDestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedDestinations to fetch.
     */
    orderBy?: SavedDestinationOrderByWithRelationInput | SavedDestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedDestinations.
     */
    cursor?: SavedDestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedDestinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedDestinations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedDestinations.
     */
    distinct?: SavedDestinationScalarFieldEnum | SavedDestinationScalarFieldEnum[]
  }

  /**
   * SavedDestination findMany
   */
  export type SavedDestinationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * Filter, which SavedDestinations to fetch.
     */
    where?: SavedDestinationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedDestinations to fetch.
     */
    orderBy?: SavedDestinationOrderByWithRelationInput | SavedDestinationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SavedDestinations.
     */
    cursor?: SavedDestinationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedDestinations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedDestinations.
     */
    skip?: number
    distinct?: SavedDestinationScalarFieldEnum | SavedDestinationScalarFieldEnum[]
  }

  /**
   * SavedDestination create
   */
  export type SavedDestinationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * The data needed to create a SavedDestination.
     */
    data: XOR<SavedDestinationCreateInput, SavedDestinationUncheckedCreateInput>
  }

  /**
   * SavedDestination createMany
   */
  export type SavedDestinationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SavedDestinations.
     */
    data: SavedDestinationCreateManyInput | SavedDestinationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SavedDestination createManyAndReturn
   */
  export type SavedDestinationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * The data used to create many SavedDestinations.
     */
    data: SavedDestinationCreateManyInput | SavedDestinationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SavedDestination update
   */
  export type SavedDestinationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * The data needed to update a SavedDestination.
     */
    data: XOR<SavedDestinationUpdateInput, SavedDestinationUncheckedUpdateInput>
    /**
     * Choose, which SavedDestination to update.
     */
    where: SavedDestinationWhereUniqueInput
  }

  /**
   * SavedDestination updateMany
   */
  export type SavedDestinationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SavedDestinations.
     */
    data: XOR<SavedDestinationUpdateManyMutationInput, SavedDestinationUncheckedUpdateManyInput>
    /**
     * Filter which SavedDestinations to update
     */
    where?: SavedDestinationWhereInput
    /**
     * Limit how many SavedDestinations to update.
     */
    limit?: number
  }

  /**
   * SavedDestination updateManyAndReturn
   */
  export type SavedDestinationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * The data used to update SavedDestinations.
     */
    data: XOR<SavedDestinationUpdateManyMutationInput, SavedDestinationUncheckedUpdateManyInput>
    /**
     * Filter which SavedDestinations to update
     */
    where?: SavedDestinationWhereInput
    /**
     * Limit how many SavedDestinations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SavedDestination upsert
   */
  export type SavedDestinationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * The filter to search for the SavedDestination to update in case it exists.
     */
    where: SavedDestinationWhereUniqueInput
    /**
     * In case the SavedDestination found by the `where` argument doesn't exist, create a new SavedDestination with this data.
     */
    create: XOR<SavedDestinationCreateInput, SavedDestinationUncheckedCreateInput>
    /**
     * In case the SavedDestination was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SavedDestinationUpdateInput, SavedDestinationUncheckedUpdateInput>
  }

  /**
   * SavedDestination delete
   */
  export type SavedDestinationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
    /**
     * Filter which SavedDestination to delete.
     */
    where: SavedDestinationWhereUniqueInput
  }

  /**
   * SavedDestination deleteMany
   */
  export type SavedDestinationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedDestinations to delete
     */
    where?: SavedDestinationWhereInput
    /**
     * Limit how many SavedDestinations to delete.
     */
    limit?: number
  }

  /**
   * SavedDestination without action
   */
  export type SavedDestinationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedDestination
     */
    select?: SavedDestinationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedDestination
     */
    omit?: SavedDestinationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedDestinationInclude<ExtArgs> | null
  }


  /**
   * Model Itinerary
   */

  export type AggregateItinerary = {
    _count: ItineraryCountAggregateOutputType | null
    _avg: ItineraryAvgAggregateOutputType | null
    _sum: ItinerarySumAggregateOutputType | null
    _min: ItineraryMinAggregateOutputType | null
    _max: ItineraryMaxAggregateOutputType | null
  }

  export type ItineraryAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    totalDistance: number | null
    estimatedTime: number | null
    estimatedCost: number | null
  }

  export type ItinerarySumAggregateOutputType = {
    id: number | null
    userId: number | null
    totalDistance: number | null
    estimatedTime: number | null
    estimatedCost: number | null
  }

  export type ItineraryMinAggregateOutputType = {
    id: number | null
    userId: number | null
    title: string | null
    totalDistance: number | null
    estimatedTime: number | null
    estimatedCost: number | null
    isAiGenerated: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItineraryMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    title: string | null
    totalDistance: number | null
    estimatedTime: number | null
    estimatedCost: number | null
    isAiGenerated: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItineraryCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    totalDistance: number
    estimatedTime: number
    estimatedCost: number
    isAiGenerated: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ItineraryAvgAggregateInputType = {
    id?: true
    userId?: true
    totalDistance?: true
    estimatedTime?: true
    estimatedCost?: true
  }

  export type ItinerarySumAggregateInputType = {
    id?: true
    userId?: true
    totalDistance?: true
    estimatedTime?: true
    estimatedCost?: true
  }

  export type ItineraryMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    totalDistance?: true
    estimatedTime?: true
    estimatedCost?: true
    isAiGenerated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItineraryMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    totalDistance?: true
    estimatedTime?: true
    estimatedCost?: true
    isAiGenerated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItineraryCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    totalDistance?: true
    estimatedTime?: true
    estimatedCost?: true
    isAiGenerated?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ItineraryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Itinerary to aggregate.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Itineraries
    **/
    _count?: true | ItineraryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItineraryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItinerarySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItineraryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItineraryMaxAggregateInputType
  }

  export type GetItineraryAggregateType<T extends ItineraryAggregateArgs> = {
        [P in keyof T & keyof AggregateItinerary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItinerary[P]>
      : GetScalarType<T[P], AggregateItinerary[P]>
  }




  export type ItineraryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItineraryWhereInput
    orderBy?: ItineraryOrderByWithAggregationInput | ItineraryOrderByWithAggregationInput[]
    by: ItineraryScalarFieldEnum[] | ItineraryScalarFieldEnum
    having?: ItineraryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItineraryCountAggregateInputType | true
    _avg?: ItineraryAvgAggregateInputType
    _sum?: ItinerarySumAggregateInputType
    _min?: ItineraryMinAggregateInputType
    _max?: ItineraryMaxAggregateInputType
  }

  export type ItineraryGroupByOutputType = {
    id: number
    userId: number
    title: string
    totalDistance: number | null
    estimatedTime: number | null
    estimatedCost: number | null
    isAiGenerated: boolean
    createdAt: Date
    updatedAt: Date
    _count: ItineraryCountAggregateOutputType | null
    _avg: ItineraryAvgAggregateOutputType | null
    _sum: ItinerarySumAggregateOutputType | null
    _min: ItineraryMinAggregateOutputType | null
    _max: ItineraryMaxAggregateOutputType | null
  }

  type GetItineraryGroupByPayload<T extends ItineraryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItineraryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItineraryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItineraryGroupByOutputType[P]>
            : GetScalarType<T[P], ItineraryGroupByOutputType[P]>
        }
      >
    >


  export type ItinerarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    totalDistance?: boolean
    estimatedTime?: boolean
    estimatedCost?: boolean
    isAiGenerated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | Itinerary$itemsArgs<ExtArgs>
    _count?: boolean | ItineraryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itinerary"]>

  export type ItinerarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    totalDistance?: boolean
    estimatedTime?: boolean
    estimatedCost?: boolean
    isAiGenerated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itinerary"]>

  export type ItinerarySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    totalDistance?: boolean
    estimatedTime?: boolean
    estimatedCost?: boolean
    isAiGenerated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itinerary"]>

  export type ItinerarySelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    totalDistance?: boolean
    estimatedTime?: boolean
    estimatedCost?: boolean
    isAiGenerated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ItineraryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "totalDistance" | "estimatedTime" | "estimatedCost" | "isAiGenerated" | "createdAt" | "updatedAt", ExtArgs["result"]["itinerary"]>
  export type ItineraryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | Itinerary$itemsArgs<ExtArgs>
    _count?: boolean | ItineraryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ItineraryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ItineraryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ItineraryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Itinerary"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      items: Prisma.$ItineraryItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      title: string
      totalDistance: number | null
      estimatedTime: number | null
      estimatedCost: number | null
      isAiGenerated: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["itinerary"]>
    composites: {}
  }

  type ItineraryGetPayload<S extends boolean | null | undefined | ItineraryDefaultArgs> = $Result.GetResult<Prisma.$ItineraryPayload, S>

  type ItineraryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItineraryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItineraryCountAggregateInputType | true
    }

  export interface ItineraryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Itinerary'], meta: { name: 'Itinerary' } }
    /**
     * Find zero or one Itinerary that matches the filter.
     * @param {ItineraryFindUniqueArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItineraryFindUniqueArgs>(args: SelectSubset<T, ItineraryFindUniqueArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Itinerary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItineraryFindUniqueOrThrowArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItineraryFindUniqueOrThrowArgs>(args: SelectSubset<T, ItineraryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Itinerary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryFindFirstArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItineraryFindFirstArgs>(args?: SelectSubset<T, ItineraryFindFirstArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Itinerary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryFindFirstOrThrowArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItineraryFindFirstOrThrowArgs>(args?: SelectSubset<T, ItineraryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Itineraries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Itineraries
     * const itineraries = await prisma.itinerary.findMany()
     * 
     * // Get first 10 Itineraries
     * const itineraries = await prisma.itinerary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itineraryWithIdOnly = await prisma.itinerary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItineraryFindManyArgs>(args?: SelectSubset<T, ItineraryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Itinerary.
     * @param {ItineraryCreateArgs} args - Arguments to create a Itinerary.
     * @example
     * // Create one Itinerary
     * const Itinerary = await prisma.itinerary.create({
     *   data: {
     *     // ... data to create a Itinerary
     *   }
     * })
     * 
     */
    create<T extends ItineraryCreateArgs>(args: SelectSubset<T, ItineraryCreateArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Itineraries.
     * @param {ItineraryCreateManyArgs} args - Arguments to create many Itineraries.
     * @example
     * // Create many Itineraries
     * const itinerary = await prisma.itinerary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItineraryCreateManyArgs>(args?: SelectSubset<T, ItineraryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Itineraries and returns the data saved in the database.
     * @param {ItineraryCreateManyAndReturnArgs} args - Arguments to create many Itineraries.
     * @example
     * // Create many Itineraries
     * const itinerary = await prisma.itinerary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Itineraries and only return the `id`
     * const itineraryWithIdOnly = await prisma.itinerary.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItineraryCreateManyAndReturnArgs>(args?: SelectSubset<T, ItineraryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Itinerary.
     * @param {ItineraryDeleteArgs} args - Arguments to delete one Itinerary.
     * @example
     * // Delete one Itinerary
     * const Itinerary = await prisma.itinerary.delete({
     *   where: {
     *     // ... filter to delete one Itinerary
     *   }
     * })
     * 
     */
    delete<T extends ItineraryDeleteArgs>(args: SelectSubset<T, ItineraryDeleteArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Itinerary.
     * @param {ItineraryUpdateArgs} args - Arguments to update one Itinerary.
     * @example
     * // Update one Itinerary
     * const itinerary = await prisma.itinerary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItineraryUpdateArgs>(args: SelectSubset<T, ItineraryUpdateArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Itineraries.
     * @param {ItineraryDeleteManyArgs} args - Arguments to filter Itineraries to delete.
     * @example
     * // Delete a few Itineraries
     * const { count } = await prisma.itinerary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItineraryDeleteManyArgs>(args?: SelectSubset<T, ItineraryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Itineraries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Itineraries
     * const itinerary = await prisma.itinerary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItineraryUpdateManyArgs>(args: SelectSubset<T, ItineraryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Itineraries and returns the data updated in the database.
     * @param {ItineraryUpdateManyAndReturnArgs} args - Arguments to update many Itineraries.
     * @example
     * // Update many Itineraries
     * const itinerary = await prisma.itinerary.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Itineraries and only return the `id`
     * const itineraryWithIdOnly = await prisma.itinerary.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ItineraryUpdateManyAndReturnArgs>(args: SelectSubset<T, ItineraryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Itinerary.
     * @param {ItineraryUpsertArgs} args - Arguments to update or create a Itinerary.
     * @example
     * // Update or create a Itinerary
     * const itinerary = await prisma.itinerary.upsert({
     *   create: {
     *     // ... data to create a Itinerary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Itinerary we want to update
     *   }
     * })
     */
    upsert<T extends ItineraryUpsertArgs>(args: SelectSubset<T, ItineraryUpsertArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Itineraries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryCountArgs} args - Arguments to filter Itineraries to count.
     * @example
     * // Count the number of Itineraries
     * const count = await prisma.itinerary.count({
     *   where: {
     *     // ... the filter for the Itineraries we want to count
     *   }
     * })
    **/
    count<T extends ItineraryCountArgs>(
      args?: Subset<T, ItineraryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItineraryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Itinerary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ItineraryAggregateArgs>(args: Subset<T, ItineraryAggregateArgs>): Prisma.PrismaPromise<GetItineraryAggregateType<T>>

    /**
     * Group by Itinerary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ItineraryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItineraryGroupByArgs['orderBy'] }
        : { orderBy?: ItineraryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ItineraryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItineraryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Itinerary model
   */
  readonly fields: ItineraryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Itinerary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItineraryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends Itinerary$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Itinerary$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Itinerary model
   */
  interface ItineraryFieldRefs {
    readonly id: FieldRef<"Itinerary", 'Int'>
    readonly userId: FieldRef<"Itinerary", 'Int'>
    readonly title: FieldRef<"Itinerary", 'String'>
    readonly totalDistance: FieldRef<"Itinerary", 'Float'>
    readonly estimatedTime: FieldRef<"Itinerary", 'Int'>
    readonly estimatedCost: FieldRef<"Itinerary", 'Int'>
    readonly isAiGenerated: FieldRef<"Itinerary", 'Boolean'>
    readonly createdAt: FieldRef<"Itinerary", 'DateTime'>
    readonly updatedAt: FieldRef<"Itinerary", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Itinerary findUnique
   */
  export type ItineraryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary findUniqueOrThrow
   */
  export type ItineraryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary findFirst
   */
  export type ItineraryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Itineraries.
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Itineraries.
     */
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * Itinerary findFirstOrThrow
   */
  export type ItineraryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Itineraries.
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Itineraries.
     */
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * Itinerary findMany
   */
  export type ItineraryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itineraries to fetch.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Itineraries.
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * Itinerary create
   */
  export type ItineraryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * The data needed to create a Itinerary.
     */
    data: XOR<ItineraryCreateInput, ItineraryUncheckedCreateInput>
  }

  /**
   * Itinerary createMany
   */
  export type ItineraryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Itineraries.
     */
    data: ItineraryCreateManyInput | ItineraryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Itinerary createManyAndReturn
   */
  export type ItineraryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * The data used to create many Itineraries.
     */
    data: ItineraryCreateManyInput | ItineraryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Itinerary update
   */
  export type ItineraryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * The data needed to update a Itinerary.
     */
    data: XOR<ItineraryUpdateInput, ItineraryUncheckedUpdateInput>
    /**
     * Choose, which Itinerary to update.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary updateMany
   */
  export type ItineraryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Itineraries.
     */
    data: XOR<ItineraryUpdateManyMutationInput, ItineraryUncheckedUpdateManyInput>
    /**
     * Filter which Itineraries to update
     */
    where?: ItineraryWhereInput
    /**
     * Limit how many Itineraries to update.
     */
    limit?: number
  }

  /**
   * Itinerary updateManyAndReturn
   */
  export type ItineraryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * The data used to update Itineraries.
     */
    data: XOR<ItineraryUpdateManyMutationInput, ItineraryUncheckedUpdateManyInput>
    /**
     * Filter which Itineraries to update
     */
    where?: ItineraryWhereInput
    /**
     * Limit how many Itineraries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Itinerary upsert
   */
  export type ItineraryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * The filter to search for the Itinerary to update in case it exists.
     */
    where: ItineraryWhereUniqueInput
    /**
     * In case the Itinerary found by the `where` argument doesn't exist, create a new Itinerary with this data.
     */
    create: XOR<ItineraryCreateInput, ItineraryUncheckedCreateInput>
    /**
     * In case the Itinerary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItineraryUpdateInput, ItineraryUncheckedUpdateInput>
  }

  /**
   * Itinerary delete
   */
  export type ItineraryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter which Itinerary to delete.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary deleteMany
   */
  export type ItineraryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Itineraries to delete
     */
    where?: ItineraryWhereInput
    /**
     * Limit how many Itineraries to delete.
     */
    limit?: number
  }

  /**
   * Itinerary.items
   */
  export type Itinerary$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    where?: ItineraryItemWhereInput
    orderBy?: ItineraryItemOrderByWithRelationInput | ItineraryItemOrderByWithRelationInput[]
    cursor?: ItineraryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItineraryItemScalarFieldEnum | ItineraryItemScalarFieldEnum[]
  }

  /**
   * Itinerary without action
   */
  export type ItineraryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Itinerary
     */
    omit?: ItineraryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
  }


  /**
   * Model ItineraryItem
   */

  export type AggregateItineraryItem = {
    _count: ItineraryItemCountAggregateOutputType | null
    _avg: ItineraryItemAvgAggregateOutputType | null
    _sum: ItineraryItemSumAggregateOutputType | null
    _min: ItineraryItemMinAggregateOutputType | null
    _max: ItineraryItemMaxAggregateOutputType | null
  }

  export type ItineraryItemAvgAggregateOutputType = {
    id: number | null
    itineraryId: number | null
    destinationId: number | null
    order: number | null
  }

  export type ItineraryItemSumAggregateOutputType = {
    id: number | null
    itineraryId: number | null
    destinationId: number | null
    order: number | null
  }

  export type ItineraryItemMinAggregateOutputType = {
    id: number | null
    itineraryId: number | null
    destinationId: number | null
    order: number | null
    visitTime: string | null
    createdAt: Date | null
  }

  export type ItineraryItemMaxAggregateOutputType = {
    id: number | null
    itineraryId: number | null
    destinationId: number | null
    order: number | null
    visitTime: string | null
    createdAt: Date | null
  }

  export type ItineraryItemCountAggregateOutputType = {
    id: number
    itineraryId: number
    destinationId: number
    order: number
    visitTime: number
    createdAt: number
    _all: number
  }


  export type ItineraryItemAvgAggregateInputType = {
    id?: true
    itineraryId?: true
    destinationId?: true
    order?: true
  }

  export type ItineraryItemSumAggregateInputType = {
    id?: true
    itineraryId?: true
    destinationId?: true
    order?: true
  }

  export type ItineraryItemMinAggregateInputType = {
    id?: true
    itineraryId?: true
    destinationId?: true
    order?: true
    visitTime?: true
    createdAt?: true
  }

  export type ItineraryItemMaxAggregateInputType = {
    id?: true
    itineraryId?: true
    destinationId?: true
    order?: true
    visitTime?: true
    createdAt?: true
  }

  export type ItineraryItemCountAggregateInputType = {
    id?: true
    itineraryId?: true
    destinationId?: true
    order?: true
    visitTime?: true
    createdAt?: true
    _all?: true
  }

  export type ItineraryItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItineraryItem to aggregate.
     */
    where?: ItineraryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItineraryItems to fetch.
     */
    orderBy?: ItineraryItemOrderByWithRelationInput | ItineraryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItineraryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItineraryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItineraryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ItineraryItems
    **/
    _count?: true | ItineraryItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItineraryItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItineraryItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItineraryItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItineraryItemMaxAggregateInputType
  }

  export type GetItineraryItemAggregateType<T extends ItineraryItemAggregateArgs> = {
        [P in keyof T & keyof AggregateItineraryItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItineraryItem[P]>
      : GetScalarType<T[P], AggregateItineraryItem[P]>
  }




  export type ItineraryItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItineraryItemWhereInput
    orderBy?: ItineraryItemOrderByWithAggregationInput | ItineraryItemOrderByWithAggregationInput[]
    by: ItineraryItemScalarFieldEnum[] | ItineraryItemScalarFieldEnum
    having?: ItineraryItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItineraryItemCountAggregateInputType | true
    _avg?: ItineraryItemAvgAggregateInputType
    _sum?: ItineraryItemSumAggregateInputType
    _min?: ItineraryItemMinAggregateInputType
    _max?: ItineraryItemMaxAggregateInputType
  }

  export type ItineraryItemGroupByOutputType = {
    id: number
    itineraryId: number
    destinationId: number
    order: number
    visitTime: string | null
    createdAt: Date
    _count: ItineraryItemCountAggregateOutputType | null
    _avg: ItineraryItemAvgAggregateOutputType | null
    _sum: ItineraryItemSumAggregateOutputType | null
    _min: ItineraryItemMinAggregateOutputType | null
    _max: ItineraryItemMaxAggregateOutputType | null
  }

  type GetItineraryItemGroupByPayload<T extends ItineraryItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItineraryItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItineraryItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItineraryItemGroupByOutputType[P]>
            : GetScalarType<T[P], ItineraryItemGroupByOutputType[P]>
        }
      >
    >


  export type ItineraryItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itineraryId?: boolean
    destinationId?: boolean
    order?: boolean
    visitTime?: boolean
    createdAt?: boolean
    itinerary?: boolean | ItineraryDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itineraryItem"]>

  export type ItineraryItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itineraryId?: boolean
    destinationId?: boolean
    order?: boolean
    visitTime?: boolean
    createdAt?: boolean
    itinerary?: boolean | ItineraryDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itineraryItem"]>

  export type ItineraryItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itineraryId?: boolean
    destinationId?: boolean
    order?: boolean
    visitTime?: boolean
    createdAt?: boolean
    itinerary?: boolean | ItineraryDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itineraryItem"]>

  export type ItineraryItemSelectScalar = {
    id?: boolean
    itineraryId?: boolean
    destinationId?: boolean
    order?: boolean
    visitTime?: boolean
    createdAt?: boolean
  }

  export type ItineraryItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itineraryId" | "destinationId" | "order" | "visitTime" | "createdAt", ExtArgs["result"]["itineraryItem"]>
  export type ItineraryItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itinerary?: boolean | ItineraryDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type ItineraryItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itinerary?: boolean | ItineraryDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type ItineraryItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itinerary?: boolean | ItineraryDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }

  export type $ItineraryItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItineraryItem"
    objects: {
      itinerary: Prisma.$ItineraryPayload<ExtArgs>
      destination: Prisma.$DestinationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      itineraryId: number
      destinationId: number
      order: number
      visitTime: string | null
      createdAt: Date
    }, ExtArgs["result"]["itineraryItem"]>
    composites: {}
  }

  type ItineraryItemGetPayload<S extends boolean | null | undefined | ItineraryItemDefaultArgs> = $Result.GetResult<Prisma.$ItineraryItemPayload, S>

  type ItineraryItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItineraryItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItineraryItemCountAggregateInputType | true
    }

  export interface ItineraryItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ItineraryItem'], meta: { name: 'ItineraryItem' } }
    /**
     * Find zero or one ItineraryItem that matches the filter.
     * @param {ItineraryItemFindUniqueArgs} args - Arguments to find a ItineraryItem
     * @example
     * // Get one ItineraryItem
     * const itineraryItem = await prisma.itineraryItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItineraryItemFindUniqueArgs>(args: SelectSubset<T, ItineraryItemFindUniqueArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ItineraryItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItineraryItemFindUniqueOrThrowArgs} args - Arguments to find a ItineraryItem
     * @example
     * // Get one ItineraryItem
     * const itineraryItem = await prisma.itineraryItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItineraryItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ItineraryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItineraryItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryItemFindFirstArgs} args - Arguments to find a ItineraryItem
     * @example
     * // Get one ItineraryItem
     * const itineraryItem = await prisma.itineraryItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItineraryItemFindFirstArgs>(args?: SelectSubset<T, ItineraryItemFindFirstArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItineraryItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryItemFindFirstOrThrowArgs} args - Arguments to find a ItineraryItem
     * @example
     * // Get one ItineraryItem
     * const itineraryItem = await prisma.itineraryItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItineraryItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ItineraryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ItineraryItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItineraryItems
     * const itineraryItems = await prisma.itineraryItem.findMany()
     * 
     * // Get first 10 ItineraryItems
     * const itineraryItems = await prisma.itineraryItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itineraryItemWithIdOnly = await prisma.itineraryItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItineraryItemFindManyArgs>(args?: SelectSubset<T, ItineraryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ItineraryItem.
     * @param {ItineraryItemCreateArgs} args - Arguments to create a ItineraryItem.
     * @example
     * // Create one ItineraryItem
     * const ItineraryItem = await prisma.itineraryItem.create({
     *   data: {
     *     // ... data to create a ItineraryItem
     *   }
     * })
     * 
     */
    create<T extends ItineraryItemCreateArgs>(args: SelectSubset<T, ItineraryItemCreateArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ItineraryItems.
     * @param {ItineraryItemCreateManyArgs} args - Arguments to create many ItineraryItems.
     * @example
     * // Create many ItineraryItems
     * const itineraryItem = await prisma.itineraryItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItineraryItemCreateManyArgs>(args?: SelectSubset<T, ItineraryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ItineraryItems and returns the data saved in the database.
     * @param {ItineraryItemCreateManyAndReturnArgs} args - Arguments to create many ItineraryItems.
     * @example
     * // Create many ItineraryItems
     * const itineraryItem = await prisma.itineraryItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ItineraryItems and only return the `id`
     * const itineraryItemWithIdOnly = await prisma.itineraryItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItineraryItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ItineraryItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ItineraryItem.
     * @param {ItineraryItemDeleteArgs} args - Arguments to delete one ItineraryItem.
     * @example
     * // Delete one ItineraryItem
     * const ItineraryItem = await prisma.itineraryItem.delete({
     *   where: {
     *     // ... filter to delete one ItineraryItem
     *   }
     * })
     * 
     */
    delete<T extends ItineraryItemDeleteArgs>(args: SelectSubset<T, ItineraryItemDeleteArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ItineraryItem.
     * @param {ItineraryItemUpdateArgs} args - Arguments to update one ItineraryItem.
     * @example
     * // Update one ItineraryItem
     * const itineraryItem = await prisma.itineraryItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItineraryItemUpdateArgs>(args: SelectSubset<T, ItineraryItemUpdateArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ItineraryItems.
     * @param {ItineraryItemDeleteManyArgs} args - Arguments to filter ItineraryItems to delete.
     * @example
     * // Delete a few ItineraryItems
     * const { count } = await prisma.itineraryItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItineraryItemDeleteManyArgs>(args?: SelectSubset<T, ItineraryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItineraryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItineraryItems
     * const itineraryItem = await prisma.itineraryItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItineraryItemUpdateManyArgs>(args: SelectSubset<T, ItineraryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItineraryItems and returns the data updated in the database.
     * @param {ItineraryItemUpdateManyAndReturnArgs} args - Arguments to update many ItineraryItems.
     * @example
     * // Update many ItineraryItems
     * const itineraryItem = await prisma.itineraryItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ItineraryItems and only return the `id`
     * const itineraryItemWithIdOnly = await prisma.itineraryItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ItineraryItemUpdateManyAndReturnArgs>(args: SelectSubset<T, ItineraryItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ItineraryItem.
     * @param {ItineraryItemUpsertArgs} args - Arguments to update or create a ItineraryItem.
     * @example
     * // Update or create a ItineraryItem
     * const itineraryItem = await prisma.itineraryItem.upsert({
     *   create: {
     *     // ... data to create a ItineraryItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItineraryItem we want to update
     *   }
     * })
     */
    upsert<T extends ItineraryItemUpsertArgs>(args: SelectSubset<T, ItineraryItemUpsertArgs<ExtArgs>>): Prisma__ItineraryItemClient<$Result.GetResult<Prisma.$ItineraryItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ItineraryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryItemCountArgs} args - Arguments to filter ItineraryItems to count.
     * @example
     * // Count the number of ItineraryItems
     * const count = await prisma.itineraryItem.count({
     *   where: {
     *     // ... the filter for the ItineraryItems we want to count
     *   }
     * })
    **/
    count<T extends ItineraryItemCountArgs>(
      args?: Subset<T, ItineraryItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItineraryItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ItineraryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ItineraryItemAggregateArgs>(args: Subset<T, ItineraryItemAggregateArgs>): Prisma.PrismaPromise<GetItineraryItemAggregateType<T>>

    /**
     * Group by ItineraryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ItineraryItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItineraryItemGroupByArgs['orderBy'] }
        : { orderBy?: ItineraryItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ItineraryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItineraryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ItineraryItem model
   */
  readonly fields: ItineraryItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItineraryItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItineraryItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    itinerary<T extends ItineraryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItineraryDefaultArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    destination<T extends DestinationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DestinationDefaultArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ItineraryItem model
   */
  interface ItineraryItemFieldRefs {
    readonly id: FieldRef<"ItineraryItem", 'Int'>
    readonly itineraryId: FieldRef<"ItineraryItem", 'Int'>
    readonly destinationId: FieldRef<"ItineraryItem", 'Int'>
    readonly order: FieldRef<"ItineraryItem", 'Int'>
    readonly visitTime: FieldRef<"ItineraryItem", 'String'>
    readonly createdAt: FieldRef<"ItineraryItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ItineraryItem findUnique
   */
  export type ItineraryItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * Filter, which ItineraryItem to fetch.
     */
    where: ItineraryItemWhereUniqueInput
  }

  /**
   * ItineraryItem findUniqueOrThrow
   */
  export type ItineraryItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * Filter, which ItineraryItem to fetch.
     */
    where: ItineraryItemWhereUniqueInput
  }

  /**
   * ItineraryItem findFirst
   */
  export type ItineraryItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * Filter, which ItineraryItem to fetch.
     */
    where?: ItineraryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItineraryItems to fetch.
     */
    orderBy?: ItineraryItemOrderByWithRelationInput | ItineraryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItineraryItems.
     */
    cursor?: ItineraryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItineraryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItineraryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItineraryItems.
     */
    distinct?: ItineraryItemScalarFieldEnum | ItineraryItemScalarFieldEnum[]
  }

  /**
   * ItineraryItem findFirstOrThrow
   */
  export type ItineraryItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * Filter, which ItineraryItem to fetch.
     */
    where?: ItineraryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItineraryItems to fetch.
     */
    orderBy?: ItineraryItemOrderByWithRelationInput | ItineraryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItineraryItems.
     */
    cursor?: ItineraryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItineraryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItineraryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItineraryItems.
     */
    distinct?: ItineraryItemScalarFieldEnum | ItineraryItemScalarFieldEnum[]
  }

  /**
   * ItineraryItem findMany
   */
  export type ItineraryItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * Filter, which ItineraryItems to fetch.
     */
    where?: ItineraryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItineraryItems to fetch.
     */
    orderBy?: ItineraryItemOrderByWithRelationInput | ItineraryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ItineraryItems.
     */
    cursor?: ItineraryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItineraryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItineraryItems.
     */
    skip?: number
    distinct?: ItineraryItemScalarFieldEnum | ItineraryItemScalarFieldEnum[]
  }

  /**
   * ItineraryItem create
   */
  export type ItineraryItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ItineraryItem.
     */
    data: XOR<ItineraryItemCreateInput, ItineraryItemUncheckedCreateInput>
  }

  /**
   * ItineraryItem createMany
   */
  export type ItineraryItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ItineraryItems.
     */
    data: ItineraryItemCreateManyInput | ItineraryItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ItineraryItem createManyAndReturn
   */
  export type ItineraryItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * The data used to create many ItineraryItems.
     */
    data: ItineraryItemCreateManyInput | ItineraryItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ItineraryItem update
   */
  export type ItineraryItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ItineraryItem.
     */
    data: XOR<ItineraryItemUpdateInput, ItineraryItemUncheckedUpdateInput>
    /**
     * Choose, which ItineraryItem to update.
     */
    where: ItineraryItemWhereUniqueInput
  }

  /**
   * ItineraryItem updateMany
   */
  export type ItineraryItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ItineraryItems.
     */
    data: XOR<ItineraryItemUpdateManyMutationInput, ItineraryItemUncheckedUpdateManyInput>
    /**
     * Filter which ItineraryItems to update
     */
    where?: ItineraryItemWhereInput
    /**
     * Limit how many ItineraryItems to update.
     */
    limit?: number
  }

  /**
   * ItineraryItem updateManyAndReturn
   */
  export type ItineraryItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * The data used to update ItineraryItems.
     */
    data: XOR<ItineraryItemUpdateManyMutationInput, ItineraryItemUncheckedUpdateManyInput>
    /**
     * Filter which ItineraryItems to update
     */
    where?: ItineraryItemWhereInput
    /**
     * Limit how many ItineraryItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ItineraryItem upsert
   */
  export type ItineraryItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ItineraryItem to update in case it exists.
     */
    where: ItineraryItemWhereUniqueInput
    /**
     * In case the ItineraryItem found by the `where` argument doesn't exist, create a new ItineraryItem with this data.
     */
    create: XOR<ItineraryItemCreateInput, ItineraryItemUncheckedCreateInput>
    /**
     * In case the ItineraryItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItineraryItemUpdateInput, ItineraryItemUncheckedUpdateInput>
  }

  /**
   * ItineraryItem delete
   */
  export type ItineraryItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
    /**
     * Filter which ItineraryItem to delete.
     */
    where: ItineraryItemWhereUniqueInput
  }

  /**
   * ItineraryItem deleteMany
   */
  export type ItineraryItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItineraryItems to delete
     */
    where?: ItineraryItemWhereInput
    /**
     * Limit how many ItineraryItems to delete.
     */
    limit?: number
  }

  /**
   * ItineraryItem without action
   */
  export type ItineraryItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItineraryItem
     */
    select?: ItineraryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItineraryItem
     */
    omit?: ItineraryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryItemInclude<ExtArgs> | null
  }


  /**
   * Model Review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    rating: number | null
    helpfulCount: number | null
  }

  export type ReviewSumAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    rating: number | null
    helpfulCount: number | null
  }

  export type ReviewMinAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    rating: number | null
    comment: string | null
    photoUrl: string | null
    helpfulCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    rating: number | null
    comment: string | null
    photoUrl: string | null
    helpfulCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    userId: number
    destinationId: number
    rating: number
    comment: number
    photoUrl: number
    helpfulCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReviewAvgAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    rating?: true
    helpfulCount?: true
  }

  export type ReviewSumAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    rating?: true
    helpfulCount?: true
  }

  export type ReviewMinAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    rating?: true
    comment?: true
    photoUrl?: true
    helpfulCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    rating?: true
    comment?: true
    photoUrl?: true
    helpfulCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    rating?: true
    comment?: true
    photoUrl?: true
    helpfulCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Review to aggregate.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type ReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithAggregationInput | ReviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: ReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _avg?: ReviewAvgAggregateInputType
    _sum?: ReviewSumAggregateInputType
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: number
    userId: number
    destinationId: number
    rating: number
    comment: string | null
    photoUrl: string | null
    helpfulCount: number
    createdAt: Date
    updatedAt: Date
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type ReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    rating?: boolean
    comment?: boolean
    photoUrl?: boolean
    helpfulCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    rating?: boolean
    comment?: boolean
    photoUrl?: boolean
    helpfulCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    rating?: boolean
    comment?: boolean
    photoUrl?: boolean
    helpfulCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectScalar = {
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    rating?: boolean
    comment?: boolean
    photoUrl?: boolean
    helpfulCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "destinationId" | "rating" | "comment" | "photoUrl" | "helpfulCount" | "createdAt" | "updatedAt", ExtArgs["result"]["review"]>
  export type ReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }

  export type $ReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Review"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      destination: Prisma.$DestinationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      destinationId: number
      rating: number
      comment: string | null
      photoUrl: string | null
      helpfulCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = $Result.GetResult<Prisma.$ReviewPayload, S>

  type ReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface ReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Review'], meta: { name: 'Review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {ReviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewFindUniqueArgs>(args: SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewFindFirstArgs>(args?: SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewFindManyArgs>(args?: SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Review.
     * @param {ReviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends ReviewCreateArgs>(args: SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reviews.
     * @param {ReviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewCreateManyArgs>(args?: SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {ReviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Review.
     * @param {ReviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends ReviewDeleteArgs>(args: SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Review.
     * @param {ReviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewUpdateArgs>(args: SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reviews.
     * @param {ReviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewDeleteManyArgs>(args?: SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewUpdateManyArgs>(args: SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews and returns the data updated in the database.
     * @param {ReviewUpdateManyAndReturnArgs} args - Arguments to update many Reviews.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, ReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Review.
     * @param {ReviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends ReviewUpsertArgs>(args: SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends ReviewCountArgs>(
      args?: Subset<T, ReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewGroupByArgs['orderBy'] }
        : { orderBy?: ReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Review model
   */
  readonly fields: ReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    destination<T extends DestinationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DestinationDefaultArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Review model
   */
  interface ReviewFieldRefs {
    readonly id: FieldRef<"Review", 'Int'>
    readonly userId: FieldRef<"Review", 'Int'>
    readonly destinationId: FieldRef<"Review", 'Int'>
    readonly rating: FieldRef<"Review", 'Int'>
    readonly comment: FieldRef<"Review", 'String'>
    readonly photoUrl: FieldRef<"Review", 'String'>
    readonly helpfulCount: FieldRef<"Review", 'Int'>
    readonly createdAt: FieldRef<"Review", 'DateTime'>
    readonly updatedAt: FieldRef<"Review", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Review findUnique
   */
  export type ReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findUniqueOrThrow
   */
  export type ReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findFirst
   */
  export type ReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findFirstOrThrow
   */
  export type ReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findMany
   */
  export type ReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Reviews to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review create
   */
  export type ReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a Review.
     */
    data: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
  }

  /**
   * Review createMany
   */
  export type ReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review createManyAndReturn
   */
  export type ReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review update
   */
  export type ReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a Review.
     */
    data: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
    /**
     * Choose, which Review to update.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review updateMany
   */
  export type ReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
  }

  /**
   * Review updateManyAndReturn
   */
  export type ReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review upsert
   */
  export type ReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the Review to update in case it exists.
     */
    where: ReviewWhereUniqueInput
    /**
     * In case the Review found by the `where` argument doesn't exist, create a new Review with this data.
     */
    create: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
    /**
     * In case the Review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
  }

  /**
   * Review delete
   */
  export type ReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter which Review to delete.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review deleteMany
   */
  export type ReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviews to delete
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to delete.
     */
    limit?: number
  }

  /**
   * Review without action
   */
  export type ReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
  }


  /**
   * Model VisitedPlace
   */

  export type AggregateVisitedPlace = {
    _count: VisitedPlaceCountAggregateOutputType | null
    _avg: VisitedPlaceAvgAggregateOutputType | null
    _sum: VisitedPlaceSumAggregateOutputType | null
    _min: VisitedPlaceMinAggregateOutputType | null
    _max: VisitedPlaceMaxAggregateOutputType | null
  }

  export type VisitedPlaceAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
  }

  export type VisitedPlaceSumAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
  }

  export type VisitedPlaceMinAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    visitedAt: Date | null
    checkedIn: boolean | null
  }

  export type VisitedPlaceMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    destinationId: number | null
    visitedAt: Date | null
    checkedIn: boolean | null
  }

  export type VisitedPlaceCountAggregateOutputType = {
    id: number
    userId: number
    destinationId: number
    visitedAt: number
    checkedIn: number
    _all: number
  }


  export type VisitedPlaceAvgAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
  }

  export type VisitedPlaceSumAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
  }

  export type VisitedPlaceMinAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    visitedAt?: true
    checkedIn?: true
  }

  export type VisitedPlaceMaxAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    visitedAt?: true
    checkedIn?: true
  }

  export type VisitedPlaceCountAggregateInputType = {
    id?: true
    userId?: true
    destinationId?: true
    visitedAt?: true
    checkedIn?: true
    _all?: true
  }

  export type VisitedPlaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisitedPlace to aggregate.
     */
    where?: VisitedPlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitedPlaces to fetch.
     */
    orderBy?: VisitedPlaceOrderByWithRelationInput | VisitedPlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisitedPlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitedPlaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitedPlaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VisitedPlaces
    **/
    _count?: true | VisitedPlaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VisitedPlaceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VisitedPlaceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisitedPlaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisitedPlaceMaxAggregateInputType
  }

  export type GetVisitedPlaceAggregateType<T extends VisitedPlaceAggregateArgs> = {
        [P in keyof T & keyof AggregateVisitedPlace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisitedPlace[P]>
      : GetScalarType<T[P], AggregateVisitedPlace[P]>
  }




  export type VisitedPlaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitedPlaceWhereInput
    orderBy?: VisitedPlaceOrderByWithAggregationInput | VisitedPlaceOrderByWithAggregationInput[]
    by: VisitedPlaceScalarFieldEnum[] | VisitedPlaceScalarFieldEnum
    having?: VisitedPlaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisitedPlaceCountAggregateInputType | true
    _avg?: VisitedPlaceAvgAggregateInputType
    _sum?: VisitedPlaceSumAggregateInputType
    _min?: VisitedPlaceMinAggregateInputType
    _max?: VisitedPlaceMaxAggregateInputType
  }

  export type VisitedPlaceGroupByOutputType = {
    id: number
    userId: number
    destinationId: number
    visitedAt: Date
    checkedIn: boolean
    _count: VisitedPlaceCountAggregateOutputType | null
    _avg: VisitedPlaceAvgAggregateOutputType | null
    _sum: VisitedPlaceSumAggregateOutputType | null
    _min: VisitedPlaceMinAggregateOutputType | null
    _max: VisitedPlaceMaxAggregateOutputType | null
  }

  type GetVisitedPlaceGroupByPayload<T extends VisitedPlaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisitedPlaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisitedPlaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisitedPlaceGroupByOutputType[P]>
            : GetScalarType<T[P], VisitedPlaceGroupByOutputType[P]>
        }
      >
    >


  export type VisitedPlaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    visitedAt?: boolean
    checkedIn?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitedPlace"]>

  export type VisitedPlaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    visitedAt?: boolean
    checkedIn?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitedPlace"]>

  export type VisitedPlaceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    visitedAt?: boolean
    checkedIn?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitedPlace"]>

  export type VisitedPlaceSelectScalar = {
    id?: boolean
    userId?: boolean
    destinationId?: boolean
    visitedAt?: boolean
    checkedIn?: boolean
  }

  export type VisitedPlaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "destinationId" | "visitedAt" | "checkedIn", ExtArgs["result"]["visitedPlace"]>
  export type VisitedPlaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type VisitedPlaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }
  export type VisitedPlaceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    destination?: boolean | DestinationDefaultArgs<ExtArgs>
  }

  export type $VisitedPlacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VisitedPlace"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      destination: Prisma.$DestinationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      destinationId: number
      visitedAt: Date
      checkedIn: boolean
    }, ExtArgs["result"]["visitedPlace"]>
    composites: {}
  }

  type VisitedPlaceGetPayload<S extends boolean | null | undefined | VisitedPlaceDefaultArgs> = $Result.GetResult<Prisma.$VisitedPlacePayload, S>

  type VisitedPlaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VisitedPlaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VisitedPlaceCountAggregateInputType | true
    }

  export interface VisitedPlaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VisitedPlace'], meta: { name: 'VisitedPlace' } }
    /**
     * Find zero or one VisitedPlace that matches the filter.
     * @param {VisitedPlaceFindUniqueArgs} args - Arguments to find a VisitedPlace
     * @example
     * // Get one VisitedPlace
     * const visitedPlace = await prisma.visitedPlace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisitedPlaceFindUniqueArgs>(args: SelectSubset<T, VisitedPlaceFindUniqueArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VisitedPlace that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VisitedPlaceFindUniqueOrThrowArgs} args - Arguments to find a VisitedPlace
     * @example
     * // Get one VisitedPlace
     * const visitedPlace = await prisma.visitedPlace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisitedPlaceFindUniqueOrThrowArgs>(args: SelectSubset<T, VisitedPlaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VisitedPlace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitedPlaceFindFirstArgs} args - Arguments to find a VisitedPlace
     * @example
     * // Get one VisitedPlace
     * const visitedPlace = await prisma.visitedPlace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisitedPlaceFindFirstArgs>(args?: SelectSubset<T, VisitedPlaceFindFirstArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VisitedPlace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitedPlaceFindFirstOrThrowArgs} args - Arguments to find a VisitedPlace
     * @example
     * // Get one VisitedPlace
     * const visitedPlace = await prisma.visitedPlace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisitedPlaceFindFirstOrThrowArgs>(args?: SelectSubset<T, VisitedPlaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VisitedPlaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitedPlaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VisitedPlaces
     * const visitedPlaces = await prisma.visitedPlace.findMany()
     * 
     * // Get first 10 VisitedPlaces
     * const visitedPlaces = await prisma.visitedPlace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visitedPlaceWithIdOnly = await prisma.visitedPlace.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisitedPlaceFindManyArgs>(args?: SelectSubset<T, VisitedPlaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VisitedPlace.
     * @param {VisitedPlaceCreateArgs} args - Arguments to create a VisitedPlace.
     * @example
     * // Create one VisitedPlace
     * const VisitedPlace = await prisma.visitedPlace.create({
     *   data: {
     *     // ... data to create a VisitedPlace
     *   }
     * })
     * 
     */
    create<T extends VisitedPlaceCreateArgs>(args: SelectSubset<T, VisitedPlaceCreateArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VisitedPlaces.
     * @param {VisitedPlaceCreateManyArgs} args - Arguments to create many VisitedPlaces.
     * @example
     * // Create many VisitedPlaces
     * const visitedPlace = await prisma.visitedPlace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisitedPlaceCreateManyArgs>(args?: SelectSubset<T, VisitedPlaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VisitedPlaces and returns the data saved in the database.
     * @param {VisitedPlaceCreateManyAndReturnArgs} args - Arguments to create many VisitedPlaces.
     * @example
     * // Create many VisitedPlaces
     * const visitedPlace = await prisma.visitedPlace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VisitedPlaces and only return the `id`
     * const visitedPlaceWithIdOnly = await prisma.visitedPlace.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisitedPlaceCreateManyAndReturnArgs>(args?: SelectSubset<T, VisitedPlaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VisitedPlace.
     * @param {VisitedPlaceDeleteArgs} args - Arguments to delete one VisitedPlace.
     * @example
     * // Delete one VisitedPlace
     * const VisitedPlace = await prisma.visitedPlace.delete({
     *   where: {
     *     // ... filter to delete one VisitedPlace
     *   }
     * })
     * 
     */
    delete<T extends VisitedPlaceDeleteArgs>(args: SelectSubset<T, VisitedPlaceDeleteArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VisitedPlace.
     * @param {VisitedPlaceUpdateArgs} args - Arguments to update one VisitedPlace.
     * @example
     * // Update one VisitedPlace
     * const visitedPlace = await prisma.visitedPlace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisitedPlaceUpdateArgs>(args: SelectSubset<T, VisitedPlaceUpdateArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VisitedPlaces.
     * @param {VisitedPlaceDeleteManyArgs} args - Arguments to filter VisitedPlaces to delete.
     * @example
     * // Delete a few VisitedPlaces
     * const { count } = await prisma.visitedPlace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisitedPlaceDeleteManyArgs>(args?: SelectSubset<T, VisitedPlaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisitedPlaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitedPlaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VisitedPlaces
     * const visitedPlace = await prisma.visitedPlace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisitedPlaceUpdateManyArgs>(args: SelectSubset<T, VisitedPlaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisitedPlaces and returns the data updated in the database.
     * @param {VisitedPlaceUpdateManyAndReturnArgs} args - Arguments to update many VisitedPlaces.
     * @example
     * // Update many VisitedPlaces
     * const visitedPlace = await prisma.visitedPlace.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VisitedPlaces and only return the `id`
     * const visitedPlaceWithIdOnly = await prisma.visitedPlace.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VisitedPlaceUpdateManyAndReturnArgs>(args: SelectSubset<T, VisitedPlaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VisitedPlace.
     * @param {VisitedPlaceUpsertArgs} args - Arguments to update or create a VisitedPlace.
     * @example
     * // Update or create a VisitedPlace
     * const visitedPlace = await prisma.visitedPlace.upsert({
     *   create: {
     *     // ... data to create a VisitedPlace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VisitedPlace we want to update
     *   }
     * })
     */
    upsert<T extends VisitedPlaceUpsertArgs>(args: SelectSubset<T, VisitedPlaceUpsertArgs<ExtArgs>>): Prisma__VisitedPlaceClient<$Result.GetResult<Prisma.$VisitedPlacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VisitedPlaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitedPlaceCountArgs} args - Arguments to filter VisitedPlaces to count.
     * @example
     * // Count the number of VisitedPlaces
     * const count = await prisma.visitedPlace.count({
     *   where: {
     *     // ... the filter for the VisitedPlaces we want to count
     *   }
     * })
    **/
    count<T extends VisitedPlaceCountArgs>(
      args?: Subset<T, VisitedPlaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisitedPlaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VisitedPlace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitedPlaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VisitedPlaceAggregateArgs>(args: Subset<T, VisitedPlaceAggregateArgs>): Prisma.PrismaPromise<GetVisitedPlaceAggregateType<T>>

    /**
     * Group by VisitedPlace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitedPlaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VisitedPlaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisitedPlaceGroupByArgs['orderBy'] }
        : { orderBy?: VisitedPlaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VisitedPlaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisitedPlaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VisitedPlace model
   */
  readonly fields: VisitedPlaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VisitedPlace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisitedPlaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    destination<T extends DestinationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DestinationDefaultArgs<ExtArgs>>): Prisma__DestinationClient<$Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VisitedPlace model
   */
  interface VisitedPlaceFieldRefs {
    readonly id: FieldRef<"VisitedPlace", 'Int'>
    readonly userId: FieldRef<"VisitedPlace", 'Int'>
    readonly destinationId: FieldRef<"VisitedPlace", 'Int'>
    readonly visitedAt: FieldRef<"VisitedPlace", 'DateTime'>
    readonly checkedIn: FieldRef<"VisitedPlace", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * VisitedPlace findUnique
   */
  export type VisitedPlaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * Filter, which VisitedPlace to fetch.
     */
    where: VisitedPlaceWhereUniqueInput
  }

  /**
   * VisitedPlace findUniqueOrThrow
   */
  export type VisitedPlaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * Filter, which VisitedPlace to fetch.
     */
    where: VisitedPlaceWhereUniqueInput
  }

  /**
   * VisitedPlace findFirst
   */
  export type VisitedPlaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * Filter, which VisitedPlace to fetch.
     */
    where?: VisitedPlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitedPlaces to fetch.
     */
    orderBy?: VisitedPlaceOrderByWithRelationInput | VisitedPlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisitedPlaces.
     */
    cursor?: VisitedPlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitedPlaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitedPlaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisitedPlaces.
     */
    distinct?: VisitedPlaceScalarFieldEnum | VisitedPlaceScalarFieldEnum[]
  }

  /**
   * VisitedPlace findFirstOrThrow
   */
  export type VisitedPlaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * Filter, which VisitedPlace to fetch.
     */
    where?: VisitedPlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitedPlaces to fetch.
     */
    orderBy?: VisitedPlaceOrderByWithRelationInput | VisitedPlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisitedPlaces.
     */
    cursor?: VisitedPlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitedPlaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitedPlaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisitedPlaces.
     */
    distinct?: VisitedPlaceScalarFieldEnum | VisitedPlaceScalarFieldEnum[]
  }

  /**
   * VisitedPlace findMany
   */
  export type VisitedPlaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * Filter, which VisitedPlaces to fetch.
     */
    where?: VisitedPlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitedPlaces to fetch.
     */
    orderBy?: VisitedPlaceOrderByWithRelationInput | VisitedPlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VisitedPlaces.
     */
    cursor?: VisitedPlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitedPlaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitedPlaces.
     */
    skip?: number
    distinct?: VisitedPlaceScalarFieldEnum | VisitedPlaceScalarFieldEnum[]
  }

  /**
   * VisitedPlace create
   */
  export type VisitedPlaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * The data needed to create a VisitedPlace.
     */
    data: XOR<VisitedPlaceCreateInput, VisitedPlaceUncheckedCreateInput>
  }

  /**
   * VisitedPlace createMany
   */
  export type VisitedPlaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VisitedPlaces.
     */
    data: VisitedPlaceCreateManyInput | VisitedPlaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VisitedPlace createManyAndReturn
   */
  export type VisitedPlaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * The data used to create many VisitedPlaces.
     */
    data: VisitedPlaceCreateManyInput | VisitedPlaceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VisitedPlace update
   */
  export type VisitedPlaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * The data needed to update a VisitedPlace.
     */
    data: XOR<VisitedPlaceUpdateInput, VisitedPlaceUncheckedUpdateInput>
    /**
     * Choose, which VisitedPlace to update.
     */
    where: VisitedPlaceWhereUniqueInput
  }

  /**
   * VisitedPlace updateMany
   */
  export type VisitedPlaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VisitedPlaces.
     */
    data: XOR<VisitedPlaceUpdateManyMutationInput, VisitedPlaceUncheckedUpdateManyInput>
    /**
     * Filter which VisitedPlaces to update
     */
    where?: VisitedPlaceWhereInput
    /**
     * Limit how many VisitedPlaces to update.
     */
    limit?: number
  }

  /**
   * VisitedPlace updateManyAndReturn
   */
  export type VisitedPlaceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * The data used to update VisitedPlaces.
     */
    data: XOR<VisitedPlaceUpdateManyMutationInput, VisitedPlaceUncheckedUpdateManyInput>
    /**
     * Filter which VisitedPlaces to update
     */
    where?: VisitedPlaceWhereInput
    /**
     * Limit how many VisitedPlaces to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VisitedPlace upsert
   */
  export type VisitedPlaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * The filter to search for the VisitedPlace to update in case it exists.
     */
    where: VisitedPlaceWhereUniqueInput
    /**
     * In case the VisitedPlace found by the `where` argument doesn't exist, create a new VisitedPlace with this data.
     */
    create: XOR<VisitedPlaceCreateInput, VisitedPlaceUncheckedCreateInput>
    /**
     * In case the VisitedPlace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisitedPlaceUpdateInput, VisitedPlaceUncheckedUpdateInput>
  }

  /**
   * VisitedPlace delete
   */
  export type VisitedPlaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
    /**
     * Filter which VisitedPlace to delete.
     */
    where: VisitedPlaceWhereUniqueInput
  }

  /**
   * VisitedPlace deleteMany
   */
  export type VisitedPlaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisitedPlaces to delete
     */
    where?: VisitedPlaceWhereInput
    /**
     * Limit how many VisitedPlaces to delete.
     */
    limit?: number
  }

  /**
   * VisitedPlace without action
   */
  export type VisitedPlaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitedPlace
     */
    select?: VisitedPlaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisitedPlace
     */
    omit?: VisitedPlaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitedPlaceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    gender: 'gender',
    domisili: 'domisili',
    photo: 'photo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DestinationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    address: 'address',
    contact: 'contact',
    latitude: 'latitude',
    longitude: 'longitude',
    imageUrl: 'imageUrl',
    openTime: 'openTime',
    closeTime: 'closeTime',
    ticketPrice: 'ticketPrice',
    maxPrice: 'maxPrice',
    website: 'website',
    visitCount: 'visitCount',
    status: 'status',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DestinationScalarFieldEnum = (typeof DestinationScalarFieldEnum)[keyof typeof DestinationScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const DestinationCategoryScalarFieldEnum: {
    id: 'id',
    destinationId: 'destinationId',
    categoryId: 'categoryId'
  };

  export type DestinationCategoryScalarFieldEnum = (typeof DestinationCategoryScalarFieldEnum)[keyof typeof DestinationCategoryScalarFieldEnum]


  export const CategoryKeywordScalarFieldEnum: {
    id: 'id',
    keyword: 'keyword',
    categoryId: 'categoryId',
    createdAt: 'createdAt'
  };

  export type CategoryKeywordScalarFieldEnum = (typeof CategoryKeywordScalarFieldEnum)[keyof typeof CategoryKeywordScalarFieldEnum]


  export const SavedDestinationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    destinationId: 'destinationId',
    createdAt: 'createdAt'
  };

  export type SavedDestinationScalarFieldEnum = (typeof SavedDestinationScalarFieldEnum)[keyof typeof SavedDestinationScalarFieldEnum]


  export const ItineraryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    totalDistance: 'totalDistance',
    estimatedTime: 'estimatedTime',
    estimatedCost: 'estimatedCost',
    isAiGenerated: 'isAiGenerated',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ItineraryScalarFieldEnum = (typeof ItineraryScalarFieldEnum)[keyof typeof ItineraryScalarFieldEnum]


  export const ItineraryItemScalarFieldEnum: {
    id: 'id',
    itineraryId: 'itineraryId',
    destinationId: 'destinationId',
    order: 'order',
    visitTime: 'visitTime',
    createdAt: 'createdAt'
  };

  export type ItineraryItemScalarFieldEnum = (typeof ItineraryItemScalarFieldEnum)[keyof typeof ItineraryItemScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    destinationId: 'destinationId',
    rating: 'rating',
    comment: 'comment',
    photoUrl: 'photoUrl',
    helpfulCount: 'helpfulCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const VisitedPlaceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    destinationId: 'destinationId',
    visitedAt: 'visitedAt',
    checkedIn: 'checkedIn'
  };

  export type VisitedPlaceScalarFieldEnum = (typeof VisitedPlaceScalarFieldEnum)[keyof typeof VisitedPlaceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Gender'
   */
  export type EnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender'>
    


  /**
   * Reference to a field of type 'Gender[]'
   */
  export type ListEnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DestinationStatus'
   */
  export type EnumDestinationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DestinationStatus'>
    


  /**
   * Reference to a field of type 'DestinationStatus[]'
   */
  export type ListEnumDestinationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DestinationStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleNullableFilter<"User"> | $Enums.Role | null
    gender?: EnumGenderNullableFilter<"User"> | $Enums.Gender | null
    domisili?: StringNullableFilter<"User"> | string | null
    photo?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    savedDestinations?: SavedDestinationListRelationFilter
    itineraries?: ItineraryListRelationFilter
    reviews?: ReviewListRelationFilter
    visitedPlaces?: VisitedPlaceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    domisili?: SortOrderInput | SortOrder
    photo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    savedDestinations?: SavedDestinationOrderByRelationAggregateInput
    itineraries?: ItineraryOrderByRelationAggregateInput
    reviews?: ReviewOrderByRelationAggregateInput
    visitedPlaces?: VisitedPlaceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleNullableFilter<"User"> | $Enums.Role | null
    gender?: EnumGenderNullableFilter<"User"> | $Enums.Gender | null
    domisili?: StringNullableFilter<"User"> | string | null
    photo?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    savedDestinations?: SavedDestinationListRelationFilter
    itineraries?: ItineraryListRelationFilter
    reviews?: ReviewListRelationFilter
    visitedPlaces?: VisitedPlaceListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    domisili?: SortOrderInput | SortOrder
    photo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleNullableWithAggregatesFilter<"User"> | $Enums.Role | null
    gender?: EnumGenderNullableWithAggregatesFilter<"User"> | $Enums.Gender | null
    domisili?: StringNullableWithAggregatesFilter<"User"> | string | null
    photo?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type DestinationWhereInput = {
    AND?: DestinationWhereInput | DestinationWhereInput[]
    OR?: DestinationWhereInput[]
    NOT?: DestinationWhereInput | DestinationWhereInput[]
    id?: IntFilter<"Destination"> | number
    name?: StringFilter<"Destination"> | string
    description?: StringFilter<"Destination"> | string
    address?: StringFilter<"Destination"> | string
    contact?: StringNullableFilter<"Destination"> | string | null
    latitude?: FloatFilter<"Destination"> | number
    longitude?: FloatFilter<"Destination"> | number
    imageUrl?: StringNullableFilter<"Destination"> | string | null
    openTime?: StringNullableFilter<"Destination"> | string | null
    closeTime?: StringNullableFilter<"Destination"> | string | null
    ticketPrice?: IntNullableFilter<"Destination"> | number | null
    maxPrice?: IntNullableFilter<"Destination"> | number | null
    website?: StringNullableFilter<"Destination"> | string | null
    visitCount?: IntFilter<"Destination"> | number
    status?: EnumDestinationStatusFilter<"Destination"> | $Enums.DestinationStatus
    isDeleted?: BoolFilter<"Destination"> | boolean
    deletedAt?: DateTimeNullableFilter<"Destination"> | Date | string | null
    createdAt?: DateTimeFilter<"Destination"> | Date | string
    updatedAt?: DateTimeFilter<"Destination"> | Date | string
    categories?: DestinationCategoryListRelationFilter
    savedBy?: SavedDestinationListRelationFilter
    itineraryItems?: ItineraryItemListRelationFilter
    reviews?: ReviewListRelationFilter
    visitedBy?: VisitedPlaceListRelationFilter
  }

  export type DestinationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    contact?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    openTime?: SortOrderInput | SortOrder
    closeTime?: SortOrderInput | SortOrder
    ticketPrice?: SortOrderInput | SortOrder
    maxPrice?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    visitCount?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    categories?: DestinationCategoryOrderByRelationAggregateInput
    savedBy?: SavedDestinationOrderByRelationAggregateInput
    itineraryItems?: ItineraryItemOrderByRelationAggregateInput
    reviews?: ReviewOrderByRelationAggregateInput
    visitedBy?: VisitedPlaceOrderByRelationAggregateInput
  }

  export type DestinationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DestinationWhereInput | DestinationWhereInput[]
    OR?: DestinationWhereInput[]
    NOT?: DestinationWhereInput | DestinationWhereInput[]
    name?: StringFilter<"Destination"> | string
    description?: StringFilter<"Destination"> | string
    address?: StringFilter<"Destination"> | string
    contact?: StringNullableFilter<"Destination"> | string | null
    latitude?: FloatFilter<"Destination"> | number
    longitude?: FloatFilter<"Destination"> | number
    imageUrl?: StringNullableFilter<"Destination"> | string | null
    openTime?: StringNullableFilter<"Destination"> | string | null
    closeTime?: StringNullableFilter<"Destination"> | string | null
    ticketPrice?: IntNullableFilter<"Destination"> | number | null
    maxPrice?: IntNullableFilter<"Destination"> | number | null
    website?: StringNullableFilter<"Destination"> | string | null
    visitCount?: IntFilter<"Destination"> | number
    status?: EnumDestinationStatusFilter<"Destination"> | $Enums.DestinationStatus
    isDeleted?: BoolFilter<"Destination"> | boolean
    deletedAt?: DateTimeNullableFilter<"Destination"> | Date | string | null
    createdAt?: DateTimeFilter<"Destination"> | Date | string
    updatedAt?: DateTimeFilter<"Destination"> | Date | string
    categories?: DestinationCategoryListRelationFilter
    savedBy?: SavedDestinationListRelationFilter
    itineraryItems?: ItineraryItemListRelationFilter
    reviews?: ReviewListRelationFilter
    visitedBy?: VisitedPlaceListRelationFilter
  }, "id">

  export type DestinationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    contact?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    openTime?: SortOrderInput | SortOrder
    closeTime?: SortOrderInput | SortOrder
    ticketPrice?: SortOrderInput | SortOrder
    maxPrice?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    visitCount?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DestinationCountOrderByAggregateInput
    _avg?: DestinationAvgOrderByAggregateInput
    _max?: DestinationMaxOrderByAggregateInput
    _min?: DestinationMinOrderByAggregateInput
    _sum?: DestinationSumOrderByAggregateInput
  }

  export type DestinationScalarWhereWithAggregatesInput = {
    AND?: DestinationScalarWhereWithAggregatesInput | DestinationScalarWhereWithAggregatesInput[]
    OR?: DestinationScalarWhereWithAggregatesInput[]
    NOT?: DestinationScalarWhereWithAggregatesInput | DestinationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Destination"> | number
    name?: StringWithAggregatesFilter<"Destination"> | string
    description?: StringWithAggregatesFilter<"Destination"> | string
    address?: StringWithAggregatesFilter<"Destination"> | string
    contact?: StringNullableWithAggregatesFilter<"Destination"> | string | null
    latitude?: FloatWithAggregatesFilter<"Destination"> | number
    longitude?: FloatWithAggregatesFilter<"Destination"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"Destination"> | string | null
    openTime?: StringNullableWithAggregatesFilter<"Destination"> | string | null
    closeTime?: StringNullableWithAggregatesFilter<"Destination"> | string | null
    ticketPrice?: IntNullableWithAggregatesFilter<"Destination"> | number | null
    maxPrice?: IntNullableWithAggregatesFilter<"Destination"> | number | null
    website?: StringNullableWithAggregatesFilter<"Destination"> | string | null
    visitCount?: IntWithAggregatesFilter<"Destination"> | number
    status?: EnumDestinationStatusWithAggregatesFilter<"Destination"> | $Enums.DestinationStatus
    isDeleted?: BoolWithAggregatesFilter<"Destination"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Destination"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Destination"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Destination"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    createdAt?: DateTimeFilter<"Category"> | Date | string
    destinations?: DestinationCategoryListRelationFilter
    keywords?: CategoryKeywordListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    destinations?: DestinationCategoryOrderByRelationAggregateInput
    keywords?: CategoryKeywordOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    createdAt?: DateTimeFilter<"Category"> | Date | string
    destinations?: DestinationCategoryListRelationFilter
    keywords?: CategoryKeywordListRelationFilter
  }, "id" | "name">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type DestinationCategoryWhereInput = {
    AND?: DestinationCategoryWhereInput | DestinationCategoryWhereInput[]
    OR?: DestinationCategoryWhereInput[]
    NOT?: DestinationCategoryWhereInput | DestinationCategoryWhereInput[]
    id?: IntFilter<"DestinationCategory"> | number
    destinationId?: IntFilter<"DestinationCategory"> | number
    categoryId?: IntFilter<"DestinationCategory"> | number
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }

  export type DestinationCategoryOrderByWithRelationInput = {
    id?: SortOrder
    destinationId?: SortOrder
    categoryId?: SortOrder
    destination?: DestinationOrderByWithRelationInput
    category?: CategoryOrderByWithRelationInput
  }

  export type DestinationCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    destinationId_categoryId?: DestinationCategoryDestinationIdCategoryIdCompoundUniqueInput
    AND?: DestinationCategoryWhereInput | DestinationCategoryWhereInput[]
    OR?: DestinationCategoryWhereInput[]
    NOT?: DestinationCategoryWhereInput | DestinationCategoryWhereInput[]
    destinationId?: IntFilter<"DestinationCategory"> | number
    categoryId?: IntFilter<"DestinationCategory"> | number
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }, "id" | "destinationId_categoryId">

  export type DestinationCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    destinationId?: SortOrder
    categoryId?: SortOrder
    _count?: DestinationCategoryCountOrderByAggregateInput
    _avg?: DestinationCategoryAvgOrderByAggregateInput
    _max?: DestinationCategoryMaxOrderByAggregateInput
    _min?: DestinationCategoryMinOrderByAggregateInput
    _sum?: DestinationCategorySumOrderByAggregateInput
  }

  export type DestinationCategoryScalarWhereWithAggregatesInput = {
    AND?: DestinationCategoryScalarWhereWithAggregatesInput | DestinationCategoryScalarWhereWithAggregatesInput[]
    OR?: DestinationCategoryScalarWhereWithAggregatesInput[]
    NOT?: DestinationCategoryScalarWhereWithAggregatesInput | DestinationCategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DestinationCategory"> | number
    destinationId?: IntWithAggregatesFilter<"DestinationCategory"> | number
    categoryId?: IntWithAggregatesFilter<"DestinationCategory"> | number
  }

  export type CategoryKeywordWhereInput = {
    AND?: CategoryKeywordWhereInput | CategoryKeywordWhereInput[]
    OR?: CategoryKeywordWhereInput[]
    NOT?: CategoryKeywordWhereInput | CategoryKeywordWhereInput[]
    id?: IntFilter<"CategoryKeyword"> | number
    keyword?: StringFilter<"CategoryKeyword"> | string
    categoryId?: IntFilter<"CategoryKeyword"> | number
    createdAt?: DateTimeFilter<"CategoryKeyword"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }

  export type CategoryKeywordOrderByWithRelationInput = {
    id?: SortOrder
    keyword?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
  }

  export type CategoryKeywordWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    categoryId_keyword?: CategoryKeywordCategoryIdKeywordCompoundUniqueInput
    AND?: CategoryKeywordWhereInput | CategoryKeywordWhereInput[]
    OR?: CategoryKeywordWhereInput[]
    NOT?: CategoryKeywordWhereInput | CategoryKeywordWhereInput[]
    keyword?: StringFilter<"CategoryKeyword"> | string
    categoryId?: IntFilter<"CategoryKeyword"> | number
    createdAt?: DateTimeFilter<"CategoryKeyword"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }, "id" | "categoryId_keyword">

  export type CategoryKeywordOrderByWithAggregationInput = {
    id?: SortOrder
    keyword?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    _count?: CategoryKeywordCountOrderByAggregateInput
    _avg?: CategoryKeywordAvgOrderByAggregateInput
    _max?: CategoryKeywordMaxOrderByAggregateInput
    _min?: CategoryKeywordMinOrderByAggregateInput
    _sum?: CategoryKeywordSumOrderByAggregateInput
  }

  export type CategoryKeywordScalarWhereWithAggregatesInput = {
    AND?: CategoryKeywordScalarWhereWithAggregatesInput | CategoryKeywordScalarWhereWithAggregatesInput[]
    OR?: CategoryKeywordScalarWhereWithAggregatesInput[]
    NOT?: CategoryKeywordScalarWhereWithAggregatesInput | CategoryKeywordScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CategoryKeyword"> | number
    keyword?: StringWithAggregatesFilter<"CategoryKeyword"> | string
    categoryId?: IntWithAggregatesFilter<"CategoryKeyword"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CategoryKeyword"> | Date | string
  }

  export type SavedDestinationWhereInput = {
    AND?: SavedDestinationWhereInput | SavedDestinationWhereInput[]
    OR?: SavedDestinationWhereInput[]
    NOT?: SavedDestinationWhereInput | SavedDestinationWhereInput[]
    id?: IntFilter<"SavedDestination"> | number
    userId?: IntFilter<"SavedDestination"> | number
    destinationId?: IntFilter<"SavedDestination"> | number
    createdAt?: DateTimeFilter<"SavedDestination"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }

  export type SavedDestinationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    destination?: DestinationOrderByWithRelationInput
  }

  export type SavedDestinationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_destinationId?: SavedDestinationUserIdDestinationIdCompoundUniqueInput
    AND?: SavedDestinationWhereInput | SavedDestinationWhereInput[]
    OR?: SavedDestinationWhereInput[]
    NOT?: SavedDestinationWhereInput | SavedDestinationWhereInput[]
    userId?: IntFilter<"SavedDestination"> | number
    destinationId?: IntFilter<"SavedDestination"> | number
    createdAt?: DateTimeFilter<"SavedDestination"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }, "id" | "userId_destinationId">

  export type SavedDestinationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    createdAt?: SortOrder
    _count?: SavedDestinationCountOrderByAggregateInput
    _avg?: SavedDestinationAvgOrderByAggregateInput
    _max?: SavedDestinationMaxOrderByAggregateInput
    _min?: SavedDestinationMinOrderByAggregateInput
    _sum?: SavedDestinationSumOrderByAggregateInput
  }

  export type SavedDestinationScalarWhereWithAggregatesInput = {
    AND?: SavedDestinationScalarWhereWithAggregatesInput | SavedDestinationScalarWhereWithAggregatesInput[]
    OR?: SavedDestinationScalarWhereWithAggregatesInput[]
    NOT?: SavedDestinationScalarWhereWithAggregatesInput | SavedDestinationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SavedDestination"> | number
    userId?: IntWithAggregatesFilter<"SavedDestination"> | number
    destinationId?: IntWithAggregatesFilter<"SavedDestination"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SavedDestination"> | Date | string
  }

  export type ItineraryWhereInput = {
    AND?: ItineraryWhereInput | ItineraryWhereInput[]
    OR?: ItineraryWhereInput[]
    NOT?: ItineraryWhereInput | ItineraryWhereInput[]
    id?: IntFilter<"Itinerary"> | number
    userId?: IntFilter<"Itinerary"> | number
    title?: StringFilter<"Itinerary"> | string
    totalDistance?: FloatNullableFilter<"Itinerary"> | number | null
    estimatedTime?: IntNullableFilter<"Itinerary"> | number | null
    estimatedCost?: IntNullableFilter<"Itinerary"> | number | null
    isAiGenerated?: BoolFilter<"Itinerary"> | boolean
    createdAt?: DateTimeFilter<"Itinerary"> | Date | string
    updatedAt?: DateTimeFilter<"Itinerary"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: ItineraryItemListRelationFilter
  }

  export type ItineraryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    totalDistance?: SortOrderInput | SortOrder
    estimatedTime?: SortOrderInput | SortOrder
    estimatedCost?: SortOrderInput | SortOrder
    isAiGenerated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    items?: ItineraryItemOrderByRelationAggregateInput
  }

  export type ItineraryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ItineraryWhereInput | ItineraryWhereInput[]
    OR?: ItineraryWhereInput[]
    NOT?: ItineraryWhereInput | ItineraryWhereInput[]
    userId?: IntFilter<"Itinerary"> | number
    title?: StringFilter<"Itinerary"> | string
    totalDistance?: FloatNullableFilter<"Itinerary"> | number | null
    estimatedTime?: IntNullableFilter<"Itinerary"> | number | null
    estimatedCost?: IntNullableFilter<"Itinerary"> | number | null
    isAiGenerated?: BoolFilter<"Itinerary"> | boolean
    createdAt?: DateTimeFilter<"Itinerary"> | Date | string
    updatedAt?: DateTimeFilter<"Itinerary"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: ItineraryItemListRelationFilter
  }, "id">

  export type ItineraryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    totalDistance?: SortOrderInput | SortOrder
    estimatedTime?: SortOrderInput | SortOrder
    estimatedCost?: SortOrderInput | SortOrder
    isAiGenerated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ItineraryCountOrderByAggregateInput
    _avg?: ItineraryAvgOrderByAggregateInput
    _max?: ItineraryMaxOrderByAggregateInput
    _min?: ItineraryMinOrderByAggregateInput
    _sum?: ItinerarySumOrderByAggregateInput
  }

  export type ItineraryScalarWhereWithAggregatesInput = {
    AND?: ItineraryScalarWhereWithAggregatesInput | ItineraryScalarWhereWithAggregatesInput[]
    OR?: ItineraryScalarWhereWithAggregatesInput[]
    NOT?: ItineraryScalarWhereWithAggregatesInput | ItineraryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Itinerary"> | number
    userId?: IntWithAggregatesFilter<"Itinerary"> | number
    title?: StringWithAggregatesFilter<"Itinerary"> | string
    totalDistance?: FloatNullableWithAggregatesFilter<"Itinerary"> | number | null
    estimatedTime?: IntNullableWithAggregatesFilter<"Itinerary"> | number | null
    estimatedCost?: IntNullableWithAggregatesFilter<"Itinerary"> | number | null
    isAiGenerated?: BoolWithAggregatesFilter<"Itinerary"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Itinerary"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Itinerary"> | Date | string
  }

  export type ItineraryItemWhereInput = {
    AND?: ItineraryItemWhereInput | ItineraryItemWhereInput[]
    OR?: ItineraryItemWhereInput[]
    NOT?: ItineraryItemWhereInput | ItineraryItemWhereInput[]
    id?: IntFilter<"ItineraryItem"> | number
    itineraryId?: IntFilter<"ItineraryItem"> | number
    destinationId?: IntFilter<"ItineraryItem"> | number
    order?: IntFilter<"ItineraryItem"> | number
    visitTime?: StringNullableFilter<"ItineraryItem"> | string | null
    createdAt?: DateTimeFilter<"ItineraryItem"> | Date | string
    itinerary?: XOR<ItineraryScalarRelationFilter, ItineraryWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }

  export type ItineraryItemOrderByWithRelationInput = {
    id?: SortOrder
    itineraryId?: SortOrder
    destinationId?: SortOrder
    order?: SortOrder
    visitTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    itinerary?: ItineraryOrderByWithRelationInput
    destination?: DestinationOrderByWithRelationInput
  }

  export type ItineraryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    itineraryId_order?: ItineraryItemItineraryIdOrderCompoundUniqueInput
    AND?: ItineraryItemWhereInput | ItineraryItemWhereInput[]
    OR?: ItineraryItemWhereInput[]
    NOT?: ItineraryItemWhereInput | ItineraryItemWhereInput[]
    itineraryId?: IntFilter<"ItineraryItem"> | number
    destinationId?: IntFilter<"ItineraryItem"> | number
    order?: IntFilter<"ItineraryItem"> | number
    visitTime?: StringNullableFilter<"ItineraryItem"> | string | null
    createdAt?: DateTimeFilter<"ItineraryItem"> | Date | string
    itinerary?: XOR<ItineraryScalarRelationFilter, ItineraryWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }, "id" | "itineraryId_order">

  export type ItineraryItemOrderByWithAggregationInput = {
    id?: SortOrder
    itineraryId?: SortOrder
    destinationId?: SortOrder
    order?: SortOrder
    visitTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ItineraryItemCountOrderByAggregateInput
    _avg?: ItineraryItemAvgOrderByAggregateInput
    _max?: ItineraryItemMaxOrderByAggregateInput
    _min?: ItineraryItemMinOrderByAggregateInput
    _sum?: ItineraryItemSumOrderByAggregateInput
  }

  export type ItineraryItemScalarWhereWithAggregatesInput = {
    AND?: ItineraryItemScalarWhereWithAggregatesInput | ItineraryItemScalarWhereWithAggregatesInput[]
    OR?: ItineraryItemScalarWhereWithAggregatesInput[]
    NOT?: ItineraryItemScalarWhereWithAggregatesInput | ItineraryItemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ItineraryItem"> | number
    itineraryId?: IntWithAggregatesFilter<"ItineraryItem"> | number
    destinationId?: IntWithAggregatesFilter<"ItineraryItem"> | number
    order?: IntWithAggregatesFilter<"ItineraryItem"> | number
    visitTime?: StringNullableWithAggregatesFilter<"ItineraryItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ItineraryItem"> | Date | string
  }

  export type ReviewWhereInput = {
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    id?: IntFilter<"Review"> | number
    userId?: IntFilter<"Review"> | number
    destinationId?: IntFilter<"Review"> | number
    rating?: IntFilter<"Review"> | number
    comment?: StringNullableFilter<"Review"> | string | null
    photoUrl?: StringNullableFilter<"Review"> | string | null
    helpfulCount?: IntFilter<"Review"> | number
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }

  export type ReviewOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    rating?: SortOrder
    comment?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    helpfulCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    destination?: DestinationOrderByWithRelationInput
  }

  export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_destinationId?: ReviewUserIdDestinationIdCompoundUniqueInput
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    userId?: IntFilter<"Review"> | number
    destinationId?: IntFilter<"Review"> | number
    rating?: IntFilter<"Review"> | number
    comment?: StringNullableFilter<"Review"> | string | null
    photoUrl?: StringNullableFilter<"Review"> | string | null
    helpfulCount?: IntFilter<"Review"> | number
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }, "id" | "userId_destinationId">

  export type ReviewOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    rating?: SortOrder
    comment?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    helpfulCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReviewCountOrderByAggregateInput
    _avg?: ReviewAvgOrderByAggregateInput
    _max?: ReviewMaxOrderByAggregateInput
    _min?: ReviewMinOrderByAggregateInput
    _sum?: ReviewSumOrderByAggregateInput
  }

  export type ReviewScalarWhereWithAggregatesInput = {
    AND?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    OR?: ReviewScalarWhereWithAggregatesInput[]
    NOT?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Review"> | number
    userId?: IntWithAggregatesFilter<"Review"> | number
    destinationId?: IntWithAggregatesFilter<"Review"> | number
    rating?: IntWithAggregatesFilter<"Review"> | number
    comment?: StringNullableWithAggregatesFilter<"Review"> | string | null
    photoUrl?: StringNullableWithAggregatesFilter<"Review"> | string | null
    helpfulCount?: IntWithAggregatesFilter<"Review"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
  }

  export type VisitedPlaceWhereInput = {
    AND?: VisitedPlaceWhereInput | VisitedPlaceWhereInput[]
    OR?: VisitedPlaceWhereInput[]
    NOT?: VisitedPlaceWhereInput | VisitedPlaceWhereInput[]
    id?: IntFilter<"VisitedPlace"> | number
    userId?: IntFilter<"VisitedPlace"> | number
    destinationId?: IntFilter<"VisitedPlace"> | number
    visitedAt?: DateTimeFilter<"VisitedPlace"> | Date | string
    checkedIn?: BoolFilter<"VisitedPlace"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }

  export type VisitedPlaceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    visitedAt?: SortOrder
    checkedIn?: SortOrder
    user?: UserOrderByWithRelationInput
    destination?: DestinationOrderByWithRelationInput
  }

  export type VisitedPlaceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_destinationId?: VisitedPlaceUserIdDestinationIdCompoundUniqueInput
    AND?: VisitedPlaceWhereInput | VisitedPlaceWhereInput[]
    OR?: VisitedPlaceWhereInput[]
    NOT?: VisitedPlaceWhereInput | VisitedPlaceWhereInput[]
    userId?: IntFilter<"VisitedPlace"> | number
    destinationId?: IntFilter<"VisitedPlace"> | number
    visitedAt?: DateTimeFilter<"VisitedPlace"> | Date | string
    checkedIn?: BoolFilter<"VisitedPlace"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>
  }, "id" | "userId_destinationId">

  export type VisitedPlaceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    visitedAt?: SortOrder
    checkedIn?: SortOrder
    _count?: VisitedPlaceCountOrderByAggregateInput
    _avg?: VisitedPlaceAvgOrderByAggregateInput
    _max?: VisitedPlaceMaxOrderByAggregateInput
    _min?: VisitedPlaceMinOrderByAggregateInput
    _sum?: VisitedPlaceSumOrderByAggregateInput
  }

  export type VisitedPlaceScalarWhereWithAggregatesInput = {
    AND?: VisitedPlaceScalarWhereWithAggregatesInput | VisitedPlaceScalarWhereWithAggregatesInput[]
    OR?: VisitedPlaceScalarWhereWithAggregatesInput[]
    NOT?: VisitedPlaceScalarWhereWithAggregatesInput | VisitedPlaceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"VisitedPlace"> | number
    userId?: IntWithAggregatesFilter<"VisitedPlace"> | number
    destinationId?: IntWithAggregatesFilter<"VisitedPlace"> | number
    visitedAt?: DateTimeWithAggregatesFilter<"VisitedPlace"> | Date | string
    checkedIn?: BoolWithAggregatesFilter<"VisitedPlace"> | boolean
  }

  export type UserCreateInput = {
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    reviews?: ReviewCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    reviews?: ReviewUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DestinationCreateInput = {
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemCreateNestedManyWithoutDestinationInput
    reviews?: ReviewCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceCreateNestedManyWithoutDestinationInput
  }

  export type DestinationUncheckedCreateInput = {
    id?: number
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryUncheckedCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationUncheckedCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemUncheckedCreateNestedManyWithoutDestinationInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceUncheckedCreateNestedManyWithoutDestinationInput
  }

  export type DestinationUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUpdateManyWithoutDestinationNestedInput
  }

  export type DestinationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUncheckedUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUncheckedUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUncheckedUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUncheckedUpdateManyWithoutDestinationNestedInput
  }

  export type DestinationCreateManyInput = {
    id?: number
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DestinationUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DestinationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    name: string
    createdAt?: Date | string
    destinations?: DestinationCategoryCreateNestedManyWithoutCategoryInput
    keywords?: CategoryKeywordCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    createdAt?: Date | string
    destinations?: DestinationCategoryUncheckedCreateNestedManyWithoutCategoryInput
    keywords?: CategoryKeywordUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    destinations?: DestinationCategoryUpdateManyWithoutCategoryNestedInput
    keywords?: CategoryKeywordUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    destinations?: DestinationCategoryUncheckedUpdateManyWithoutCategoryNestedInput
    keywords?: CategoryKeywordUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    createdAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DestinationCategoryCreateInput = {
    destination: DestinationCreateNestedOneWithoutCategoriesInput
    category: CategoryCreateNestedOneWithoutDestinationsInput
  }

  export type DestinationCategoryUncheckedCreateInput = {
    id?: number
    destinationId: number
    categoryId: number
  }

  export type DestinationCategoryUpdateInput = {
    destination?: DestinationUpdateOneRequiredWithoutCategoriesNestedInput
    category?: CategoryUpdateOneRequiredWithoutDestinationsNestedInput
  }

  export type DestinationCategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
  }

  export type DestinationCategoryCreateManyInput = {
    id?: number
    destinationId: number
    categoryId: number
  }

  export type DestinationCategoryUpdateManyMutationInput = {

  }

  export type DestinationCategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
  }

  export type CategoryKeywordCreateInput = {
    keyword: string
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutKeywordsInput
  }

  export type CategoryKeywordUncheckedCreateInput = {
    id?: number
    keyword: string
    categoryId: number
    createdAt?: Date | string
  }

  export type CategoryKeywordUpdateInput = {
    keyword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutKeywordsNestedInput
  }

  export type CategoryKeywordUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    keyword?: StringFieldUpdateOperationsInput | string
    categoryId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryKeywordCreateManyInput = {
    id?: number
    keyword: string
    categoryId: number
    createdAt?: Date | string
  }

  export type CategoryKeywordUpdateManyMutationInput = {
    keyword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryKeywordUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    keyword?: StringFieldUpdateOperationsInput | string
    categoryId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedDestinationCreateInput = {
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSavedDestinationsInput
    destination: DestinationCreateNestedOneWithoutSavedByInput
  }

  export type SavedDestinationUncheckedCreateInput = {
    id?: number
    userId: number
    destinationId: number
    createdAt?: Date | string
  }

  export type SavedDestinationUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedDestinationsNestedInput
    destination?: DestinationUpdateOneRequiredWithoutSavedByNestedInput
  }

  export type SavedDestinationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedDestinationCreateManyInput = {
    id?: number
    userId: number
    destinationId: number
    createdAt?: Date | string
  }

  export type SavedDestinationUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedDestinationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryCreateInput = {
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutItinerariesInput
    items?: ItineraryItemCreateNestedManyWithoutItineraryInput
  }

  export type ItineraryUncheckedCreateInput = {
    id?: number
    userId: number
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ItineraryItemUncheckedCreateNestedManyWithoutItineraryInput
  }

  export type ItineraryUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutItinerariesNestedInput
    items?: ItineraryItemUpdateManyWithoutItineraryNestedInput
  }

  export type ItineraryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ItineraryItemUncheckedUpdateManyWithoutItineraryNestedInput
  }

  export type ItineraryCreateManyInput = {
    id?: number
    userId: number
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItineraryUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryItemCreateInput = {
    order: number
    visitTime?: string | null
    createdAt?: Date | string
    itinerary: ItineraryCreateNestedOneWithoutItemsInput
    destination: DestinationCreateNestedOneWithoutItineraryItemsInput
  }

  export type ItineraryItemUncheckedCreateInput = {
    id?: number
    itineraryId: number
    destinationId: number
    order: number
    visitTime?: string | null
    createdAt?: Date | string
  }

  export type ItineraryItemUpdateInput = {
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itinerary?: ItineraryUpdateOneRequiredWithoutItemsNestedInput
    destination?: DestinationUpdateOneRequiredWithoutItineraryItemsNestedInput
  }

  export type ItineraryItemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    itineraryId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryItemCreateManyInput = {
    id?: number
    itineraryId: number
    destinationId: number
    order: number
    visitTime?: string | null
    createdAt?: Date | string
  }

  export type ItineraryItemUpdateManyMutationInput = {
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryItemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    itineraryId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateInput = {
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutReviewsInput
    destination: DestinationCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateInput = {
    id?: number
    userId: number
    destinationId: number
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateInput = {
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReviewsNestedInput
    destination?: DestinationUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyInput = {
    id?: number
    userId: number
    destinationId: number
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewUpdateManyMutationInput = {
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitedPlaceCreateInput = {
    visitedAt?: Date | string
    checkedIn?: boolean
    user: UserCreateNestedOneWithoutVisitedPlacesInput
    destination: DestinationCreateNestedOneWithoutVisitedByInput
  }

  export type VisitedPlaceUncheckedCreateInput = {
    id?: number
    userId: number
    destinationId: number
    visitedAt?: Date | string
    checkedIn?: boolean
  }

  export type VisitedPlaceUpdateInput = {
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutVisitedPlacesNestedInput
    destination?: DestinationUpdateOneRequiredWithoutVisitedByNestedInput
  }

  export type VisitedPlaceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VisitedPlaceCreateManyInput = {
    id?: number
    userId: number
    destinationId: number
    visitedAt?: Date | string
    checkedIn?: boolean
  }

  export type VisitedPlaceUpdateManyMutationInput = {
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VisitedPlaceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableFilter<$PrismaModel> | $Enums.Role | null
  }

  export type EnumGenderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableFilter<$PrismaModel> | $Enums.Gender | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SavedDestinationListRelationFilter = {
    every?: SavedDestinationWhereInput
    some?: SavedDestinationWhereInput
    none?: SavedDestinationWhereInput
  }

  export type ItineraryListRelationFilter = {
    every?: ItineraryWhereInput
    some?: ItineraryWhereInput
    none?: ItineraryWhereInput
  }

  export type ReviewListRelationFilter = {
    every?: ReviewWhereInput
    some?: ReviewWhereInput
    none?: ReviewWhereInput
  }

  export type VisitedPlaceListRelationFilter = {
    every?: VisitedPlaceWhereInput
    some?: VisitedPlaceWhereInput
    none?: VisitedPlaceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SavedDestinationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ItineraryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VisitedPlaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    gender?: SortOrder
    domisili?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    gender?: SortOrder
    domisili?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    gender?: SortOrder
    domisili?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.Role | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumRoleNullableFilter<$PrismaModel>
  }

  export type EnumGenderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableWithAggregatesFilter<$PrismaModel> | $Enums.Gender | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGenderNullableFilter<$PrismaModel>
    _max?: NestedEnumGenderNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumDestinationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DestinationStatus | EnumDestinationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDestinationStatusFilter<$PrismaModel> | $Enums.DestinationStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DestinationCategoryListRelationFilter = {
    every?: DestinationCategoryWhereInput
    some?: DestinationCategoryWhereInput
    none?: DestinationCategoryWhereInput
  }

  export type ItineraryItemListRelationFilter = {
    every?: ItineraryItemWhereInput
    some?: ItineraryItemWhereInput
    none?: ItineraryItemWhereInput
  }

  export type DestinationCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ItineraryItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DestinationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    contact?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    ticketPrice?: SortOrder
    maxPrice?: SortOrder
    website?: SortOrder
    visitCount?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DestinationAvgOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    ticketPrice?: SortOrder
    maxPrice?: SortOrder
    visitCount?: SortOrder
  }

  export type DestinationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    contact?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    ticketPrice?: SortOrder
    maxPrice?: SortOrder
    website?: SortOrder
    visitCount?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DestinationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    contact?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    ticketPrice?: SortOrder
    maxPrice?: SortOrder
    website?: SortOrder
    visitCount?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DestinationSumOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    ticketPrice?: SortOrder
    maxPrice?: SortOrder
    visitCount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumDestinationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DestinationStatus | EnumDestinationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDestinationStatusWithAggregatesFilter<$PrismaModel> | $Enums.DestinationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDestinationStatusFilter<$PrismaModel>
    _max?: NestedEnumDestinationStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type CategoryKeywordListRelationFilter = {
    every?: CategoryKeywordWhereInput
    some?: CategoryKeywordWhereInput
    none?: CategoryKeywordWhereInput
  }

  export type CategoryKeywordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DestinationScalarRelationFilter = {
    is?: DestinationWhereInput
    isNot?: DestinationWhereInput
  }

  export type CategoryScalarRelationFilter = {
    is?: CategoryWhereInput
    isNot?: CategoryWhereInput
  }

  export type DestinationCategoryDestinationIdCategoryIdCompoundUniqueInput = {
    destinationId: number
    categoryId: number
  }

  export type DestinationCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    destinationId?: SortOrder
    categoryId?: SortOrder
  }

  export type DestinationCategoryAvgOrderByAggregateInput = {
    id?: SortOrder
    destinationId?: SortOrder
    categoryId?: SortOrder
  }

  export type DestinationCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    destinationId?: SortOrder
    categoryId?: SortOrder
  }

  export type DestinationCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    destinationId?: SortOrder
    categoryId?: SortOrder
  }

  export type DestinationCategorySumOrderByAggregateInput = {
    id?: SortOrder
    destinationId?: SortOrder
    categoryId?: SortOrder
  }

  export type CategoryKeywordCategoryIdKeywordCompoundUniqueInput = {
    categoryId: number
    keyword: string
  }

  export type CategoryKeywordCountOrderByAggregateInput = {
    id?: SortOrder
    keyword?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryKeywordAvgOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
  }

  export type CategoryKeywordMaxOrderByAggregateInput = {
    id?: SortOrder
    keyword?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryKeywordMinOrderByAggregateInput = {
    id?: SortOrder
    keyword?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryKeywordSumOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SavedDestinationUserIdDestinationIdCompoundUniqueInput = {
    userId: number
    destinationId: number
  }

  export type SavedDestinationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    createdAt?: SortOrder
  }

  export type SavedDestinationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
  }

  export type SavedDestinationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    createdAt?: SortOrder
  }

  export type SavedDestinationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    createdAt?: SortOrder
  }

  export type SavedDestinationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ItineraryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    totalDistance?: SortOrder
    estimatedTime?: SortOrder
    estimatedCost?: SortOrder
    isAiGenerated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItineraryAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalDistance?: SortOrder
    estimatedTime?: SortOrder
    estimatedCost?: SortOrder
  }

  export type ItineraryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    totalDistance?: SortOrder
    estimatedTime?: SortOrder
    estimatedCost?: SortOrder
    isAiGenerated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItineraryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    totalDistance?: SortOrder
    estimatedTime?: SortOrder
    estimatedCost?: SortOrder
    isAiGenerated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItinerarySumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalDistance?: SortOrder
    estimatedTime?: SortOrder
    estimatedCost?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ItineraryScalarRelationFilter = {
    is?: ItineraryWhereInput
    isNot?: ItineraryWhereInput
  }

  export type ItineraryItemItineraryIdOrderCompoundUniqueInput = {
    itineraryId: number
    order: number
  }

  export type ItineraryItemCountOrderByAggregateInput = {
    id?: SortOrder
    itineraryId?: SortOrder
    destinationId?: SortOrder
    order?: SortOrder
    visitTime?: SortOrder
    createdAt?: SortOrder
  }

  export type ItineraryItemAvgOrderByAggregateInput = {
    id?: SortOrder
    itineraryId?: SortOrder
    destinationId?: SortOrder
    order?: SortOrder
  }

  export type ItineraryItemMaxOrderByAggregateInput = {
    id?: SortOrder
    itineraryId?: SortOrder
    destinationId?: SortOrder
    order?: SortOrder
    visitTime?: SortOrder
    createdAt?: SortOrder
  }

  export type ItineraryItemMinOrderByAggregateInput = {
    id?: SortOrder
    itineraryId?: SortOrder
    destinationId?: SortOrder
    order?: SortOrder
    visitTime?: SortOrder
    createdAt?: SortOrder
  }

  export type ItineraryItemSumOrderByAggregateInput = {
    id?: SortOrder
    itineraryId?: SortOrder
    destinationId?: SortOrder
    order?: SortOrder
  }

  export type ReviewUserIdDestinationIdCompoundUniqueInput = {
    userId: number
    destinationId: number
  }

  export type ReviewCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    photoUrl?: SortOrder
    helpfulCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    rating?: SortOrder
    helpfulCount?: SortOrder
  }

  export type ReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    photoUrl?: SortOrder
    helpfulCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    photoUrl?: SortOrder
    helpfulCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReviewSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    rating?: SortOrder
    helpfulCount?: SortOrder
  }

  export type VisitedPlaceUserIdDestinationIdCompoundUniqueInput = {
    userId: number
    destinationId: number
  }

  export type VisitedPlaceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    visitedAt?: SortOrder
    checkedIn?: SortOrder
  }

  export type VisitedPlaceAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
  }

  export type VisitedPlaceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    visitedAt?: SortOrder
    checkedIn?: SortOrder
  }

  export type VisitedPlaceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
    visitedAt?: SortOrder
    checkedIn?: SortOrder
  }

  export type VisitedPlaceSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    destinationId?: SortOrder
  }

  export type SavedDestinationCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedDestinationCreateWithoutUserInput, SavedDestinationUncheckedCreateWithoutUserInput> | SavedDestinationCreateWithoutUserInput[] | SavedDestinationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutUserInput | SavedDestinationCreateOrConnectWithoutUserInput[]
    createMany?: SavedDestinationCreateManyUserInputEnvelope
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
  }

  export type ItineraryCreateNestedManyWithoutUserInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
  }

  export type ReviewCreateNestedManyWithoutUserInput = {
    create?: XOR<ReviewCreateWithoutUserInput, ReviewUncheckedCreateWithoutUserInput> | ReviewCreateWithoutUserInput[] | ReviewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutUserInput | ReviewCreateOrConnectWithoutUserInput[]
    createMany?: ReviewCreateManyUserInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type VisitedPlaceCreateNestedManyWithoutUserInput = {
    create?: XOR<VisitedPlaceCreateWithoutUserInput, VisitedPlaceUncheckedCreateWithoutUserInput> | VisitedPlaceCreateWithoutUserInput[] | VisitedPlaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutUserInput | VisitedPlaceCreateOrConnectWithoutUserInput[]
    createMany?: VisitedPlaceCreateManyUserInputEnvelope
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
  }

  export type SavedDestinationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedDestinationCreateWithoutUserInput, SavedDestinationUncheckedCreateWithoutUserInput> | SavedDestinationCreateWithoutUserInput[] | SavedDestinationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutUserInput | SavedDestinationCreateOrConnectWithoutUserInput[]
    createMany?: SavedDestinationCreateManyUserInputEnvelope
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
  }

  export type ItineraryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReviewCreateWithoutUserInput, ReviewUncheckedCreateWithoutUserInput> | ReviewCreateWithoutUserInput[] | ReviewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutUserInput | ReviewCreateOrConnectWithoutUserInput[]
    createMany?: ReviewCreateManyUserInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type VisitedPlaceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<VisitedPlaceCreateWithoutUserInput, VisitedPlaceUncheckedCreateWithoutUserInput> | VisitedPlaceCreateWithoutUserInput[] | VisitedPlaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutUserInput | VisitedPlaceCreateOrConnectWithoutUserInput[]
    createMany?: VisitedPlaceCreateManyUserInputEnvelope
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableEnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role | null
  }

  export type NullableEnumGenderFieldUpdateOperationsInput = {
    set?: $Enums.Gender | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SavedDestinationUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedDestinationCreateWithoutUserInput, SavedDestinationUncheckedCreateWithoutUserInput> | SavedDestinationCreateWithoutUserInput[] | SavedDestinationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutUserInput | SavedDestinationCreateOrConnectWithoutUserInput[]
    upsert?: SavedDestinationUpsertWithWhereUniqueWithoutUserInput | SavedDestinationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedDestinationCreateManyUserInputEnvelope
    set?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    disconnect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    delete?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    update?: SavedDestinationUpdateWithWhereUniqueWithoutUserInput | SavedDestinationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedDestinationUpdateManyWithWhereWithoutUserInput | SavedDestinationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedDestinationScalarWhereInput | SavedDestinationScalarWhereInput[]
  }

  export type ItineraryUpdateManyWithoutUserNestedInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    upsert?: ItineraryUpsertWithWhereUniqueWithoutUserInput | ItineraryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    set?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    disconnect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    delete?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    update?: ItineraryUpdateWithWhereUniqueWithoutUserInput | ItineraryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ItineraryUpdateManyWithWhereWithoutUserInput | ItineraryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
  }

  export type ReviewUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReviewCreateWithoutUserInput, ReviewUncheckedCreateWithoutUserInput> | ReviewCreateWithoutUserInput[] | ReviewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutUserInput | ReviewCreateOrConnectWithoutUserInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutUserInput | ReviewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReviewCreateManyUserInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutUserInput | ReviewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutUserInput | ReviewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type VisitedPlaceUpdateManyWithoutUserNestedInput = {
    create?: XOR<VisitedPlaceCreateWithoutUserInput, VisitedPlaceUncheckedCreateWithoutUserInput> | VisitedPlaceCreateWithoutUserInput[] | VisitedPlaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutUserInput | VisitedPlaceCreateOrConnectWithoutUserInput[]
    upsert?: VisitedPlaceUpsertWithWhereUniqueWithoutUserInput | VisitedPlaceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VisitedPlaceCreateManyUserInputEnvelope
    set?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    disconnect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    delete?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    update?: VisitedPlaceUpdateWithWhereUniqueWithoutUserInput | VisitedPlaceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VisitedPlaceUpdateManyWithWhereWithoutUserInput | VisitedPlaceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VisitedPlaceScalarWhereInput | VisitedPlaceScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SavedDestinationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedDestinationCreateWithoutUserInput, SavedDestinationUncheckedCreateWithoutUserInput> | SavedDestinationCreateWithoutUserInput[] | SavedDestinationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutUserInput | SavedDestinationCreateOrConnectWithoutUserInput[]
    upsert?: SavedDestinationUpsertWithWhereUniqueWithoutUserInput | SavedDestinationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedDestinationCreateManyUserInputEnvelope
    set?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    disconnect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    delete?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    update?: SavedDestinationUpdateWithWhereUniqueWithoutUserInput | SavedDestinationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedDestinationUpdateManyWithWhereWithoutUserInput | SavedDestinationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedDestinationScalarWhereInput | SavedDestinationScalarWhereInput[]
  }

  export type ItineraryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    upsert?: ItineraryUpsertWithWhereUniqueWithoutUserInput | ItineraryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    set?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    disconnect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    delete?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    update?: ItineraryUpdateWithWhereUniqueWithoutUserInput | ItineraryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ItineraryUpdateManyWithWhereWithoutUserInput | ItineraryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReviewCreateWithoutUserInput, ReviewUncheckedCreateWithoutUserInput> | ReviewCreateWithoutUserInput[] | ReviewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutUserInput | ReviewCreateOrConnectWithoutUserInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutUserInput | ReviewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReviewCreateManyUserInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutUserInput | ReviewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutUserInput | ReviewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type VisitedPlaceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<VisitedPlaceCreateWithoutUserInput, VisitedPlaceUncheckedCreateWithoutUserInput> | VisitedPlaceCreateWithoutUserInput[] | VisitedPlaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutUserInput | VisitedPlaceCreateOrConnectWithoutUserInput[]
    upsert?: VisitedPlaceUpsertWithWhereUniqueWithoutUserInput | VisitedPlaceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VisitedPlaceCreateManyUserInputEnvelope
    set?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    disconnect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    delete?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    update?: VisitedPlaceUpdateWithWhereUniqueWithoutUserInput | VisitedPlaceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VisitedPlaceUpdateManyWithWhereWithoutUserInput | VisitedPlaceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VisitedPlaceScalarWhereInput | VisitedPlaceScalarWhereInput[]
  }

  export type DestinationCategoryCreateNestedManyWithoutDestinationInput = {
    create?: XOR<DestinationCategoryCreateWithoutDestinationInput, DestinationCategoryUncheckedCreateWithoutDestinationInput> | DestinationCategoryCreateWithoutDestinationInput[] | DestinationCategoryUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutDestinationInput | DestinationCategoryCreateOrConnectWithoutDestinationInput[]
    createMany?: DestinationCategoryCreateManyDestinationInputEnvelope
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
  }

  export type SavedDestinationCreateNestedManyWithoutDestinationInput = {
    create?: XOR<SavedDestinationCreateWithoutDestinationInput, SavedDestinationUncheckedCreateWithoutDestinationInput> | SavedDestinationCreateWithoutDestinationInput[] | SavedDestinationUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutDestinationInput | SavedDestinationCreateOrConnectWithoutDestinationInput[]
    createMany?: SavedDestinationCreateManyDestinationInputEnvelope
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
  }

  export type ItineraryItemCreateNestedManyWithoutDestinationInput = {
    create?: XOR<ItineraryItemCreateWithoutDestinationInput, ItineraryItemUncheckedCreateWithoutDestinationInput> | ItineraryItemCreateWithoutDestinationInput[] | ItineraryItemUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutDestinationInput | ItineraryItemCreateOrConnectWithoutDestinationInput[]
    createMany?: ItineraryItemCreateManyDestinationInputEnvelope
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
  }

  export type ReviewCreateNestedManyWithoutDestinationInput = {
    create?: XOR<ReviewCreateWithoutDestinationInput, ReviewUncheckedCreateWithoutDestinationInput> | ReviewCreateWithoutDestinationInput[] | ReviewUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDestinationInput | ReviewCreateOrConnectWithoutDestinationInput[]
    createMany?: ReviewCreateManyDestinationInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type VisitedPlaceCreateNestedManyWithoutDestinationInput = {
    create?: XOR<VisitedPlaceCreateWithoutDestinationInput, VisitedPlaceUncheckedCreateWithoutDestinationInput> | VisitedPlaceCreateWithoutDestinationInput[] | VisitedPlaceUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutDestinationInput | VisitedPlaceCreateOrConnectWithoutDestinationInput[]
    createMany?: VisitedPlaceCreateManyDestinationInputEnvelope
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
  }

  export type DestinationCategoryUncheckedCreateNestedManyWithoutDestinationInput = {
    create?: XOR<DestinationCategoryCreateWithoutDestinationInput, DestinationCategoryUncheckedCreateWithoutDestinationInput> | DestinationCategoryCreateWithoutDestinationInput[] | DestinationCategoryUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutDestinationInput | DestinationCategoryCreateOrConnectWithoutDestinationInput[]
    createMany?: DestinationCategoryCreateManyDestinationInputEnvelope
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
  }

  export type SavedDestinationUncheckedCreateNestedManyWithoutDestinationInput = {
    create?: XOR<SavedDestinationCreateWithoutDestinationInput, SavedDestinationUncheckedCreateWithoutDestinationInput> | SavedDestinationCreateWithoutDestinationInput[] | SavedDestinationUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutDestinationInput | SavedDestinationCreateOrConnectWithoutDestinationInput[]
    createMany?: SavedDestinationCreateManyDestinationInputEnvelope
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
  }

  export type ItineraryItemUncheckedCreateNestedManyWithoutDestinationInput = {
    create?: XOR<ItineraryItemCreateWithoutDestinationInput, ItineraryItemUncheckedCreateWithoutDestinationInput> | ItineraryItemCreateWithoutDestinationInput[] | ItineraryItemUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutDestinationInput | ItineraryItemCreateOrConnectWithoutDestinationInput[]
    createMany?: ItineraryItemCreateManyDestinationInputEnvelope
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutDestinationInput = {
    create?: XOR<ReviewCreateWithoutDestinationInput, ReviewUncheckedCreateWithoutDestinationInput> | ReviewCreateWithoutDestinationInput[] | ReviewUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDestinationInput | ReviewCreateOrConnectWithoutDestinationInput[]
    createMany?: ReviewCreateManyDestinationInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type VisitedPlaceUncheckedCreateNestedManyWithoutDestinationInput = {
    create?: XOR<VisitedPlaceCreateWithoutDestinationInput, VisitedPlaceUncheckedCreateWithoutDestinationInput> | VisitedPlaceCreateWithoutDestinationInput[] | VisitedPlaceUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutDestinationInput | VisitedPlaceCreateOrConnectWithoutDestinationInput[]
    createMany?: VisitedPlaceCreateManyDestinationInputEnvelope
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumDestinationStatusFieldUpdateOperationsInput = {
    set?: $Enums.DestinationStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DestinationCategoryUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<DestinationCategoryCreateWithoutDestinationInput, DestinationCategoryUncheckedCreateWithoutDestinationInput> | DestinationCategoryCreateWithoutDestinationInput[] | DestinationCategoryUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutDestinationInput | DestinationCategoryCreateOrConnectWithoutDestinationInput[]
    upsert?: DestinationCategoryUpsertWithWhereUniqueWithoutDestinationInput | DestinationCategoryUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: DestinationCategoryCreateManyDestinationInputEnvelope
    set?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    disconnect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    delete?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    update?: DestinationCategoryUpdateWithWhereUniqueWithoutDestinationInput | DestinationCategoryUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: DestinationCategoryUpdateManyWithWhereWithoutDestinationInput | DestinationCategoryUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: DestinationCategoryScalarWhereInput | DestinationCategoryScalarWhereInput[]
  }

  export type SavedDestinationUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<SavedDestinationCreateWithoutDestinationInput, SavedDestinationUncheckedCreateWithoutDestinationInput> | SavedDestinationCreateWithoutDestinationInput[] | SavedDestinationUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutDestinationInput | SavedDestinationCreateOrConnectWithoutDestinationInput[]
    upsert?: SavedDestinationUpsertWithWhereUniqueWithoutDestinationInput | SavedDestinationUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: SavedDestinationCreateManyDestinationInputEnvelope
    set?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    disconnect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    delete?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    update?: SavedDestinationUpdateWithWhereUniqueWithoutDestinationInput | SavedDestinationUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: SavedDestinationUpdateManyWithWhereWithoutDestinationInput | SavedDestinationUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: SavedDestinationScalarWhereInput | SavedDestinationScalarWhereInput[]
  }

  export type ItineraryItemUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<ItineraryItemCreateWithoutDestinationInput, ItineraryItemUncheckedCreateWithoutDestinationInput> | ItineraryItemCreateWithoutDestinationInput[] | ItineraryItemUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutDestinationInput | ItineraryItemCreateOrConnectWithoutDestinationInput[]
    upsert?: ItineraryItemUpsertWithWhereUniqueWithoutDestinationInput | ItineraryItemUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: ItineraryItemCreateManyDestinationInputEnvelope
    set?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    disconnect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    delete?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    update?: ItineraryItemUpdateWithWhereUniqueWithoutDestinationInput | ItineraryItemUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: ItineraryItemUpdateManyWithWhereWithoutDestinationInput | ItineraryItemUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: ItineraryItemScalarWhereInput | ItineraryItemScalarWhereInput[]
  }

  export type ReviewUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<ReviewCreateWithoutDestinationInput, ReviewUncheckedCreateWithoutDestinationInput> | ReviewCreateWithoutDestinationInput[] | ReviewUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDestinationInput | ReviewCreateOrConnectWithoutDestinationInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutDestinationInput | ReviewUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: ReviewCreateManyDestinationInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutDestinationInput | ReviewUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutDestinationInput | ReviewUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type VisitedPlaceUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<VisitedPlaceCreateWithoutDestinationInput, VisitedPlaceUncheckedCreateWithoutDestinationInput> | VisitedPlaceCreateWithoutDestinationInput[] | VisitedPlaceUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutDestinationInput | VisitedPlaceCreateOrConnectWithoutDestinationInput[]
    upsert?: VisitedPlaceUpsertWithWhereUniqueWithoutDestinationInput | VisitedPlaceUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: VisitedPlaceCreateManyDestinationInputEnvelope
    set?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    disconnect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    delete?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    update?: VisitedPlaceUpdateWithWhereUniqueWithoutDestinationInput | VisitedPlaceUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: VisitedPlaceUpdateManyWithWhereWithoutDestinationInput | VisitedPlaceUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: VisitedPlaceScalarWhereInput | VisitedPlaceScalarWhereInput[]
  }

  export type DestinationCategoryUncheckedUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<DestinationCategoryCreateWithoutDestinationInput, DestinationCategoryUncheckedCreateWithoutDestinationInput> | DestinationCategoryCreateWithoutDestinationInput[] | DestinationCategoryUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutDestinationInput | DestinationCategoryCreateOrConnectWithoutDestinationInput[]
    upsert?: DestinationCategoryUpsertWithWhereUniqueWithoutDestinationInput | DestinationCategoryUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: DestinationCategoryCreateManyDestinationInputEnvelope
    set?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    disconnect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    delete?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    update?: DestinationCategoryUpdateWithWhereUniqueWithoutDestinationInput | DestinationCategoryUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: DestinationCategoryUpdateManyWithWhereWithoutDestinationInput | DestinationCategoryUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: DestinationCategoryScalarWhereInput | DestinationCategoryScalarWhereInput[]
  }

  export type SavedDestinationUncheckedUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<SavedDestinationCreateWithoutDestinationInput, SavedDestinationUncheckedCreateWithoutDestinationInput> | SavedDestinationCreateWithoutDestinationInput[] | SavedDestinationUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: SavedDestinationCreateOrConnectWithoutDestinationInput | SavedDestinationCreateOrConnectWithoutDestinationInput[]
    upsert?: SavedDestinationUpsertWithWhereUniqueWithoutDestinationInput | SavedDestinationUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: SavedDestinationCreateManyDestinationInputEnvelope
    set?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    disconnect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    delete?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    connect?: SavedDestinationWhereUniqueInput | SavedDestinationWhereUniqueInput[]
    update?: SavedDestinationUpdateWithWhereUniqueWithoutDestinationInput | SavedDestinationUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: SavedDestinationUpdateManyWithWhereWithoutDestinationInput | SavedDestinationUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: SavedDestinationScalarWhereInput | SavedDestinationScalarWhereInput[]
  }

  export type ItineraryItemUncheckedUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<ItineraryItemCreateWithoutDestinationInput, ItineraryItemUncheckedCreateWithoutDestinationInput> | ItineraryItemCreateWithoutDestinationInput[] | ItineraryItemUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutDestinationInput | ItineraryItemCreateOrConnectWithoutDestinationInput[]
    upsert?: ItineraryItemUpsertWithWhereUniqueWithoutDestinationInput | ItineraryItemUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: ItineraryItemCreateManyDestinationInputEnvelope
    set?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    disconnect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    delete?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    update?: ItineraryItemUpdateWithWhereUniqueWithoutDestinationInput | ItineraryItemUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: ItineraryItemUpdateManyWithWhereWithoutDestinationInput | ItineraryItemUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: ItineraryItemScalarWhereInput | ItineraryItemScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<ReviewCreateWithoutDestinationInput, ReviewUncheckedCreateWithoutDestinationInput> | ReviewCreateWithoutDestinationInput[] | ReviewUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDestinationInput | ReviewCreateOrConnectWithoutDestinationInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutDestinationInput | ReviewUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: ReviewCreateManyDestinationInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutDestinationInput | ReviewUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutDestinationInput | ReviewUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type VisitedPlaceUncheckedUpdateManyWithoutDestinationNestedInput = {
    create?: XOR<VisitedPlaceCreateWithoutDestinationInput, VisitedPlaceUncheckedCreateWithoutDestinationInput> | VisitedPlaceCreateWithoutDestinationInput[] | VisitedPlaceUncheckedCreateWithoutDestinationInput[]
    connectOrCreate?: VisitedPlaceCreateOrConnectWithoutDestinationInput | VisitedPlaceCreateOrConnectWithoutDestinationInput[]
    upsert?: VisitedPlaceUpsertWithWhereUniqueWithoutDestinationInput | VisitedPlaceUpsertWithWhereUniqueWithoutDestinationInput[]
    createMany?: VisitedPlaceCreateManyDestinationInputEnvelope
    set?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    disconnect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    delete?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    connect?: VisitedPlaceWhereUniqueInput | VisitedPlaceWhereUniqueInput[]
    update?: VisitedPlaceUpdateWithWhereUniqueWithoutDestinationInput | VisitedPlaceUpdateWithWhereUniqueWithoutDestinationInput[]
    updateMany?: VisitedPlaceUpdateManyWithWhereWithoutDestinationInput | VisitedPlaceUpdateManyWithWhereWithoutDestinationInput[]
    deleteMany?: VisitedPlaceScalarWhereInput | VisitedPlaceScalarWhereInput[]
  }

  export type DestinationCategoryCreateNestedManyWithoutCategoryInput = {
    create?: XOR<DestinationCategoryCreateWithoutCategoryInput, DestinationCategoryUncheckedCreateWithoutCategoryInput> | DestinationCategoryCreateWithoutCategoryInput[] | DestinationCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutCategoryInput | DestinationCategoryCreateOrConnectWithoutCategoryInput[]
    createMany?: DestinationCategoryCreateManyCategoryInputEnvelope
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
  }

  export type CategoryKeywordCreateNestedManyWithoutCategoryInput = {
    create?: XOR<CategoryKeywordCreateWithoutCategoryInput, CategoryKeywordUncheckedCreateWithoutCategoryInput> | CategoryKeywordCreateWithoutCategoryInput[] | CategoryKeywordUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryKeywordCreateOrConnectWithoutCategoryInput | CategoryKeywordCreateOrConnectWithoutCategoryInput[]
    createMany?: CategoryKeywordCreateManyCategoryInputEnvelope
    connect?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
  }

  export type DestinationCategoryUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<DestinationCategoryCreateWithoutCategoryInput, DestinationCategoryUncheckedCreateWithoutCategoryInput> | DestinationCategoryCreateWithoutCategoryInput[] | DestinationCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutCategoryInput | DestinationCategoryCreateOrConnectWithoutCategoryInput[]
    createMany?: DestinationCategoryCreateManyCategoryInputEnvelope
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
  }

  export type CategoryKeywordUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<CategoryKeywordCreateWithoutCategoryInput, CategoryKeywordUncheckedCreateWithoutCategoryInput> | CategoryKeywordCreateWithoutCategoryInput[] | CategoryKeywordUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryKeywordCreateOrConnectWithoutCategoryInput | CategoryKeywordCreateOrConnectWithoutCategoryInput[]
    createMany?: CategoryKeywordCreateManyCategoryInputEnvelope
    connect?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
  }

  export type DestinationCategoryUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<DestinationCategoryCreateWithoutCategoryInput, DestinationCategoryUncheckedCreateWithoutCategoryInput> | DestinationCategoryCreateWithoutCategoryInput[] | DestinationCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutCategoryInput | DestinationCategoryCreateOrConnectWithoutCategoryInput[]
    upsert?: DestinationCategoryUpsertWithWhereUniqueWithoutCategoryInput | DestinationCategoryUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: DestinationCategoryCreateManyCategoryInputEnvelope
    set?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    disconnect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    delete?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    update?: DestinationCategoryUpdateWithWhereUniqueWithoutCategoryInput | DestinationCategoryUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: DestinationCategoryUpdateManyWithWhereWithoutCategoryInput | DestinationCategoryUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: DestinationCategoryScalarWhereInput | DestinationCategoryScalarWhereInput[]
  }

  export type CategoryKeywordUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<CategoryKeywordCreateWithoutCategoryInput, CategoryKeywordUncheckedCreateWithoutCategoryInput> | CategoryKeywordCreateWithoutCategoryInput[] | CategoryKeywordUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryKeywordCreateOrConnectWithoutCategoryInput | CategoryKeywordCreateOrConnectWithoutCategoryInput[]
    upsert?: CategoryKeywordUpsertWithWhereUniqueWithoutCategoryInput | CategoryKeywordUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: CategoryKeywordCreateManyCategoryInputEnvelope
    set?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    disconnect?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    delete?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    connect?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    update?: CategoryKeywordUpdateWithWhereUniqueWithoutCategoryInput | CategoryKeywordUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: CategoryKeywordUpdateManyWithWhereWithoutCategoryInput | CategoryKeywordUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: CategoryKeywordScalarWhereInput | CategoryKeywordScalarWhereInput[]
  }

  export type DestinationCategoryUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<DestinationCategoryCreateWithoutCategoryInput, DestinationCategoryUncheckedCreateWithoutCategoryInput> | DestinationCategoryCreateWithoutCategoryInput[] | DestinationCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: DestinationCategoryCreateOrConnectWithoutCategoryInput | DestinationCategoryCreateOrConnectWithoutCategoryInput[]
    upsert?: DestinationCategoryUpsertWithWhereUniqueWithoutCategoryInput | DestinationCategoryUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: DestinationCategoryCreateManyCategoryInputEnvelope
    set?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    disconnect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    delete?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    connect?: DestinationCategoryWhereUniqueInput | DestinationCategoryWhereUniqueInput[]
    update?: DestinationCategoryUpdateWithWhereUniqueWithoutCategoryInput | DestinationCategoryUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: DestinationCategoryUpdateManyWithWhereWithoutCategoryInput | DestinationCategoryUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: DestinationCategoryScalarWhereInput | DestinationCategoryScalarWhereInput[]
  }

  export type CategoryKeywordUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<CategoryKeywordCreateWithoutCategoryInput, CategoryKeywordUncheckedCreateWithoutCategoryInput> | CategoryKeywordCreateWithoutCategoryInput[] | CategoryKeywordUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryKeywordCreateOrConnectWithoutCategoryInput | CategoryKeywordCreateOrConnectWithoutCategoryInput[]
    upsert?: CategoryKeywordUpsertWithWhereUniqueWithoutCategoryInput | CategoryKeywordUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: CategoryKeywordCreateManyCategoryInputEnvelope
    set?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    disconnect?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    delete?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    connect?: CategoryKeywordWhereUniqueInput | CategoryKeywordWhereUniqueInput[]
    update?: CategoryKeywordUpdateWithWhereUniqueWithoutCategoryInput | CategoryKeywordUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: CategoryKeywordUpdateManyWithWhereWithoutCategoryInput | CategoryKeywordUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: CategoryKeywordScalarWhereInput | CategoryKeywordScalarWhereInput[]
  }

  export type DestinationCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<DestinationCreateWithoutCategoriesInput, DestinationUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutCategoriesInput
    connect?: DestinationWhereUniqueInput
  }

  export type CategoryCreateNestedOneWithoutDestinationsInput = {
    create?: XOR<CategoryCreateWithoutDestinationsInput, CategoryUncheckedCreateWithoutDestinationsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutDestinationsInput
    connect?: CategoryWhereUniqueInput
  }

  export type DestinationUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<DestinationCreateWithoutCategoriesInput, DestinationUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutCategoriesInput
    upsert?: DestinationUpsertWithoutCategoriesInput
    connect?: DestinationWhereUniqueInput
    update?: XOR<XOR<DestinationUpdateToOneWithWhereWithoutCategoriesInput, DestinationUpdateWithoutCategoriesInput>, DestinationUncheckedUpdateWithoutCategoriesInput>
  }

  export type CategoryUpdateOneRequiredWithoutDestinationsNestedInput = {
    create?: XOR<CategoryCreateWithoutDestinationsInput, CategoryUncheckedCreateWithoutDestinationsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutDestinationsInput
    upsert?: CategoryUpsertWithoutDestinationsInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutDestinationsInput, CategoryUpdateWithoutDestinationsInput>, CategoryUncheckedUpdateWithoutDestinationsInput>
  }

  export type CategoryCreateNestedOneWithoutKeywordsInput = {
    create?: XOR<CategoryCreateWithoutKeywordsInput, CategoryUncheckedCreateWithoutKeywordsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutKeywordsInput
    connect?: CategoryWhereUniqueInput
  }

  export type CategoryUpdateOneRequiredWithoutKeywordsNestedInput = {
    create?: XOR<CategoryCreateWithoutKeywordsInput, CategoryUncheckedCreateWithoutKeywordsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutKeywordsInput
    upsert?: CategoryUpsertWithoutKeywordsInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutKeywordsInput, CategoryUpdateWithoutKeywordsInput>, CategoryUncheckedUpdateWithoutKeywordsInput>
  }

  export type UserCreateNestedOneWithoutSavedDestinationsInput = {
    create?: XOR<UserCreateWithoutSavedDestinationsInput, UserUncheckedCreateWithoutSavedDestinationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedDestinationsInput
    connect?: UserWhereUniqueInput
  }

  export type DestinationCreateNestedOneWithoutSavedByInput = {
    create?: XOR<DestinationCreateWithoutSavedByInput, DestinationUncheckedCreateWithoutSavedByInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutSavedByInput
    connect?: DestinationWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSavedDestinationsNestedInput = {
    create?: XOR<UserCreateWithoutSavedDestinationsInput, UserUncheckedCreateWithoutSavedDestinationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedDestinationsInput
    upsert?: UserUpsertWithoutSavedDestinationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSavedDestinationsInput, UserUpdateWithoutSavedDestinationsInput>, UserUncheckedUpdateWithoutSavedDestinationsInput>
  }

  export type DestinationUpdateOneRequiredWithoutSavedByNestedInput = {
    create?: XOR<DestinationCreateWithoutSavedByInput, DestinationUncheckedCreateWithoutSavedByInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutSavedByInput
    upsert?: DestinationUpsertWithoutSavedByInput
    connect?: DestinationWhereUniqueInput
    update?: XOR<XOR<DestinationUpdateToOneWithWhereWithoutSavedByInput, DestinationUpdateWithoutSavedByInput>, DestinationUncheckedUpdateWithoutSavedByInput>
  }

  export type UserCreateNestedOneWithoutItinerariesInput = {
    create?: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutItinerariesInput
    connect?: UserWhereUniqueInput
  }

  export type ItineraryItemCreateNestedManyWithoutItineraryInput = {
    create?: XOR<ItineraryItemCreateWithoutItineraryInput, ItineraryItemUncheckedCreateWithoutItineraryInput> | ItineraryItemCreateWithoutItineraryInput[] | ItineraryItemUncheckedCreateWithoutItineraryInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutItineraryInput | ItineraryItemCreateOrConnectWithoutItineraryInput[]
    createMany?: ItineraryItemCreateManyItineraryInputEnvelope
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
  }

  export type ItineraryItemUncheckedCreateNestedManyWithoutItineraryInput = {
    create?: XOR<ItineraryItemCreateWithoutItineraryInput, ItineraryItemUncheckedCreateWithoutItineraryInput> | ItineraryItemCreateWithoutItineraryInput[] | ItineraryItemUncheckedCreateWithoutItineraryInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutItineraryInput | ItineraryItemCreateOrConnectWithoutItineraryInput[]
    createMany?: ItineraryItemCreateManyItineraryInputEnvelope
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutItinerariesNestedInput = {
    create?: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutItinerariesInput
    upsert?: UserUpsertWithoutItinerariesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutItinerariesInput, UserUpdateWithoutItinerariesInput>, UserUncheckedUpdateWithoutItinerariesInput>
  }

  export type ItineraryItemUpdateManyWithoutItineraryNestedInput = {
    create?: XOR<ItineraryItemCreateWithoutItineraryInput, ItineraryItemUncheckedCreateWithoutItineraryInput> | ItineraryItemCreateWithoutItineraryInput[] | ItineraryItemUncheckedCreateWithoutItineraryInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutItineraryInput | ItineraryItemCreateOrConnectWithoutItineraryInput[]
    upsert?: ItineraryItemUpsertWithWhereUniqueWithoutItineraryInput | ItineraryItemUpsertWithWhereUniqueWithoutItineraryInput[]
    createMany?: ItineraryItemCreateManyItineraryInputEnvelope
    set?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    disconnect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    delete?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    update?: ItineraryItemUpdateWithWhereUniqueWithoutItineraryInput | ItineraryItemUpdateWithWhereUniqueWithoutItineraryInput[]
    updateMany?: ItineraryItemUpdateManyWithWhereWithoutItineraryInput | ItineraryItemUpdateManyWithWhereWithoutItineraryInput[]
    deleteMany?: ItineraryItemScalarWhereInput | ItineraryItemScalarWhereInput[]
  }

  export type ItineraryItemUncheckedUpdateManyWithoutItineraryNestedInput = {
    create?: XOR<ItineraryItemCreateWithoutItineraryInput, ItineraryItemUncheckedCreateWithoutItineraryInput> | ItineraryItemCreateWithoutItineraryInput[] | ItineraryItemUncheckedCreateWithoutItineraryInput[]
    connectOrCreate?: ItineraryItemCreateOrConnectWithoutItineraryInput | ItineraryItemCreateOrConnectWithoutItineraryInput[]
    upsert?: ItineraryItemUpsertWithWhereUniqueWithoutItineraryInput | ItineraryItemUpsertWithWhereUniqueWithoutItineraryInput[]
    createMany?: ItineraryItemCreateManyItineraryInputEnvelope
    set?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    disconnect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    delete?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    connect?: ItineraryItemWhereUniqueInput | ItineraryItemWhereUniqueInput[]
    update?: ItineraryItemUpdateWithWhereUniqueWithoutItineraryInput | ItineraryItemUpdateWithWhereUniqueWithoutItineraryInput[]
    updateMany?: ItineraryItemUpdateManyWithWhereWithoutItineraryInput | ItineraryItemUpdateManyWithWhereWithoutItineraryInput[]
    deleteMany?: ItineraryItemScalarWhereInput | ItineraryItemScalarWhereInput[]
  }

  export type ItineraryCreateNestedOneWithoutItemsInput = {
    create?: XOR<ItineraryCreateWithoutItemsInput, ItineraryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ItineraryCreateOrConnectWithoutItemsInput
    connect?: ItineraryWhereUniqueInput
  }

  export type DestinationCreateNestedOneWithoutItineraryItemsInput = {
    create?: XOR<DestinationCreateWithoutItineraryItemsInput, DestinationUncheckedCreateWithoutItineraryItemsInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutItineraryItemsInput
    connect?: DestinationWhereUniqueInput
  }

  export type ItineraryUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<ItineraryCreateWithoutItemsInput, ItineraryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ItineraryCreateOrConnectWithoutItemsInput
    upsert?: ItineraryUpsertWithoutItemsInput
    connect?: ItineraryWhereUniqueInput
    update?: XOR<XOR<ItineraryUpdateToOneWithWhereWithoutItemsInput, ItineraryUpdateWithoutItemsInput>, ItineraryUncheckedUpdateWithoutItemsInput>
  }

  export type DestinationUpdateOneRequiredWithoutItineraryItemsNestedInput = {
    create?: XOR<DestinationCreateWithoutItineraryItemsInput, DestinationUncheckedCreateWithoutItineraryItemsInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutItineraryItemsInput
    upsert?: DestinationUpsertWithoutItineraryItemsInput
    connect?: DestinationWhereUniqueInput
    update?: XOR<XOR<DestinationUpdateToOneWithWhereWithoutItineraryItemsInput, DestinationUpdateWithoutItineraryItemsInput>, DestinationUncheckedUpdateWithoutItineraryItemsInput>
  }

  export type UserCreateNestedOneWithoutReviewsInput = {
    create?: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewsInput
    connect?: UserWhereUniqueInput
  }

  export type DestinationCreateNestedOneWithoutReviewsInput = {
    create?: XOR<DestinationCreateWithoutReviewsInput, DestinationUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutReviewsInput
    connect?: DestinationWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewsInput
    upsert?: UserUpsertWithoutReviewsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewsInput, UserUpdateWithoutReviewsInput>, UserUncheckedUpdateWithoutReviewsInput>
  }

  export type DestinationUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<DestinationCreateWithoutReviewsInput, DestinationUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutReviewsInput
    upsert?: DestinationUpsertWithoutReviewsInput
    connect?: DestinationWhereUniqueInput
    update?: XOR<XOR<DestinationUpdateToOneWithWhereWithoutReviewsInput, DestinationUpdateWithoutReviewsInput>, DestinationUncheckedUpdateWithoutReviewsInput>
  }

  export type UserCreateNestedOneWithoutVisitedPlacesInput = {
    create?: XOR<UserCreateWithoutVisitedPlacesInput, UserUncheckedCreateWithoutVisitedPlacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVisitedPlacesInput
    connect?: UserWhereUniqueInput
  }

  export type DestinationCreateNestedOneWithoutVisitedByInput = {
    create?: XOR<DestinationCreateWithoutVisitedByInput, DestinationUncheckedCreateWithoutVisitedByInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutVisitedByInput
    connect?: DestinationWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutVisitedPlacesNestedInput = {
    create?: XOR<UserCreateWithoutVisitedPlacesInput, UserUncheckedCreateWithoutVisitedPlacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVisitedPlacesInput
    upsert?: UserUpsertWithoutVisitedPlacesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVisitedPlacesInput, UserUpdateWithoutVisitedPlacesInput>, UserUncheckedUpdateWithoutVisitedPlacesInput>
  }

  export type DestinationUpdateOneRequiredWithoutVisitedByNestedInput = {
    create?: XOR<DestinationCreateWithoutVisitedByInput, DestinationUncheckedCreateWithoutVisitedByInput>
    connectOrCreate?: DestinationCreateOrConnectWithoutVisitedByInput
    upsert?: DestinationUpsertWithoutVisitedByInput
    connect?: DestinationWhereUniqueInput
    update?: XOR<XOR<DestinationUpdateToOneWithWhereWithoutVisitedByInput, DestinationUpdateWithoutVisitedByInput>, DestinationUncheckedUpdateWithoutVisitedByInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableFilter<$PrismaModel> | $Enums.Role | null
  }

  export type NestedEnumGenderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableFilter<$PrismaModel> | $Enums.Gender | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.Role | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumRoleNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumGenderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGenderNullableWithAggregatesFilter<$PrismaModel> | $Enums.Gender | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGenderNullableFilter<$PrismaModel>
    _max?: NestedEnumGenderNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDestinationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DestinationStatus | EnumDestinationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDestinationStatusFilter<$PrismaModel> | $Enums.DestinationStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDestinationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DestinationStatus | EnumDestinationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DestinationStatus[] | ListEnumDestinationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDestinationStatusWithAggregatesFilter<$PrismaModel> | $Enums.DestinationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDestinationStatusFilter<$PrismaModel>
    _max?: NestedEnumDestinationStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type SavedDestinationCreateWithoutUserInput = {
    createdAt?: Date | string
    destination: DestinationCreateNestedOneWithoutSavedByInput
  }

  export type SavedDestinationUncheckedCreateWithoutUserInput = {
    id?: number
    destinationId: number
    createdAt?: Date | string
  }

  export type SavedDestinationCreateOrConnectWithoutUserInput = {
    where: SavedDestinationWhereUniqueInput
    create: XOR<SavedDestinationCreateWithoutUserInput, SavedDestinationUncheckedCreateWithoutUserInput>
  }

  export type SavedDestinationCreateManyUserInputEnvelope = {
    data: SavedDestinationCreateManyUserInput | SavedDestinationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ItineraryCreateWithoutUserInput = {
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ItineraryItemCreateNestedManyWithoutItineraryInput
  }

  export type ItineraryUncheckedCreateWithoutUserInput = {
    id?: number
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ItineraryItemUncheckedCreateNestedManyWithoutItineraryInput
  }

  export type ItineraryCreateOrConnectWithoutUserInput = {
    where: ItineraryWhereUniqueInput
    create: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput>
  }

  export type ItineraryCreateManyUserInputEnvelope = {
    data: ItineraryCreateManyUserInput | ItineraryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReviewCreateWithoutUserInput = {
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    destination: DestinationCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateWithoutUserInput = {
    id?: number
    destinationId: number
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewCreateOrConnectWithoutUserInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutUserInput, ReviewUncheckedCreateWithoutUserInput>
  }

  export type ReviewCreateManyUserInputEnvelope = {
    data: ReviewCreateManyUserInput | ReviewCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type VisitedPlaceCreateWithoutUserInput = {
    visitedAt?: Date | string
    checkedIn?: boolean
    destination: DestinationCreateNestedOneWithoutVisitedByInput
  }

  export type VisitedPlaceUncheckedCreateWithoutUserInput = {
    id?: number
    destinationId: number
    visitedAt?: Date | string
    checkedIn?: boolean
  }

  export type VisitedPlaceCreateOrConnectWithoutUserInput = {
    where: VisitedPlaceWhereUniqueInput
    create: XOR<VisitedPlaceCreateWithoutUserInput, VisitedPlaceUncheckedCreateWithoutUserInput>
  }

  export type VisitedPlaceCreateManyUserInputEnvelope = {
    data: VisitedPlaceCreateManyUserInput | VisitedPlaceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SavedDestinationUpsertWithWhereUniqueWithoutUserInput = {
    where: SavedDestinationWhereUniqueInput
    update: XOR<SavedDestinationUpdateWithoutUserInput, SavedDestinationUncheckedUpdateWithoutUserInput>
    create: XOR<SavedDestinationCreateWithoutUserInput, SavedDestinationUncheckedCreateWithoutUserInput>
  }

  export type SavedDestinationUpdateWithWhereUniqueWithoutUserInput = {
    where: SavedDestinationWhereUniqueInput
    data: XOR<SavedDestinationUpdateWithoutUserInput, SavedDestinationUncheckedUpdateWithoutUserInput>
  }

  export type SavedDestinationUpdateManyWithWhereWithoutUserInput = {
    where: SavedDestinationScalarWhereInput
    data: XOR<SavedDestinationUpdateManyMutationInput, SavedDestinationUncheckedUpdateManyWithoutUserInput>
  }

  export type SavedDestinationScalarWhereInput = {
    AND?: SavedDestinationScalarWhereInput | SavedDestinationScalarWhereInput[]
    OR?: SavedDestinationScalarWhereInput[]
    NOT?: SavedDestinationScalarWhereInput | SavedDestinationScalarWhereInput[]
    id?: IntFilter<"SavedDestination"> | number
    userId?: IntFilter<"SavedDestination"> | number
    destinationId?: IntFilter<"SavedDestination"> | number
    createdAt?: DateTimeFilter<"SavedDestination"> | Date | string
  }

  export type ItineraryUpsertWithWhereUniqueWithoutUserInput = {
    where: ItineraryWhereUniqueInput
    update: XOR<ItineraryUpdateWithoutUserInput, ItineraryUncheckedUpdateWithoutUserInput>
    create: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput>
  }

  export type ItineraryUpdateWithWhereUniqueWithoutUserInput = {
    where: ItineraryWhereUniqueInput
    data: XOR<ItineraryUpdateWithoutUserInput, ItineraryUncheckedUpdateWithoutUserInput>
  }

  export type ItineraryUpdateManyWithWhereWithoutUserInput = {
    where: ItineraryScalarWhereInput
    data: XOR<ItineraryUpdateManyMutationInput, ItineraryUncheckedUpdateManyWithoutUserInput>
  }

  export type ItineraryScalarWhereInput = {
    AND?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
    OR?: ItineraryScalarWhereInput[]
    NOT?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
    id?: IntFilter<"Itinerary"> | number
    userId?: IntFilter<"Itinerary"> | number
    title?: StringFilter<"Itinerary"> | string
    totalDistance?: FloatNullableFilter<"Itinerary"> | number | null
    estimatedTime?: IntNullableFilter<"Itinerary"> | number | null
    estimatedCost?: IntNullableFilter<"Itinerary"> | number | null
    isAiGenerated?: BoolFilter<"Itinerary"> | boolean
    createdAt?: DateTimeFilter<"Itinerary"> | Date | string
    updatedAt?: DateTimeFilter<"Itinerary"> | Date | string
  }

  export type ReviewUpsertWithWhereUniqueWithoutUserInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutUserInput, ReviewUncheckedUpdateWithoutUserInput>
    create: XOR<ReviewCreateWithoutUserInput, ReviewUncheckedCreateWithoutUserInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutUserInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutUserInput, ReviewUncheckedUpdateWithoutUserInput>
  }

  export type ReviewUpdateManyWithWhereWithoutUserInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutUserInput>
  }

  export type ReviewScalarWhereInput = {
    AND?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    OR?: ReviewScalarWhereInput[]
    NOT?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    id?: IntFilter<"Review"> | number
    userId?: IntFilter<"Review"> | number
    destinationId?: IntFilter<"Review"> | number
    rating?: IntFilter<"Review"> | number
    comment?: StringNullableFilter<"Review"> | string | null
    photoUrl?: StringNullableFilter<"Review"> | string | null
    helpfulCount?: IntFilter<"Review"> | number
    createdAt?: DateTimeFilter<"Review"> | Date | string
    updatedAt?: DateTimeFilter<"Review"> | Date | string
  }

  export type VisitedPlaceUpsertWithWhereUniqueWithoutUserInput = {
    where: VisitedPlaceWhereUniqueInput
    update: XOR<VisitedPlaceUpdateWithoutUserInput, VisitedPlaceUncheckedUpdateWithoutUserInput>
    create: XOR<VisitedPlaceCreateWithoutUserInput, VisitedPlaceUncheckedCreateWithoutUserInput>
  }

  export type VisitedPlaceUpdateWithWhereUniqueWithoutUserInput = {
    where: VisitedPlaceWhereUniqueInput
    data: XOR<VisitedPlaceUpdateWithoutUserInput, VisitedPlaceUncheckedUpdateWithoutUserInput>
  }

  export type VisitedPlaceUpdateManyWithWhereWithoutUserInput = {
    where: VisitedPlaceScalarWhereInput
    data: XOR<VisitedPlaceUpdateManyMutationInput, VisitedPlaceUncheckedUpdateManyWithoutUserInput>
  }

  export type VisitedPlaceScalarWhereInput = {
    AND?: VisitedPlaceScalarWhereInput | VisitedPlaceScalarWhereInput[]
    OR?: VisitedPlaceScalarWhereInput[]
    NOT?: VisitedPlaceScalarWhereInput | VisitedPlaceScalarWhereInput[]
    id?: IntFilter<"VisitedPlace"> | number
    userId?: IntFilter<"VisitedPlace"> | number
    destinationId?: IntFilter<"VisitedPlace"> | number
    visitedAt?: DateTimeFilter<"VisitedPlace"> | Date | string
    checkedIn?: BoolFilter<"VisitedPlace"> | boolean
  }

  export type DestinationCategoryCreateWithoutDestinationInput = {
    category: CategoryCreateNestedOneWithoutDestinationsInput
  }

  export type DestinationCategoryUncheckedCreateWithoutDestinationInput = {
    id?: number
    categoryId: number
  }

  export type DestinationCategoryCreateOrConnectWithoutDestinationInput = {
    where: DestinationCategoryWhereUniqueInput
    create: XOR<DestinationCategoryCreateWithoutDestinationInput, DestinationCategoryUncheckedCreateWithoutDestinationInput>
  }

  export type DestinationCategoryCreateManyDestinationInputEnvelope = {
    data: DestinationCategoryCreateManyDestinationInput | DestinationCategoryCreateManyDestinationInput[]
    skipDuplicates?: boolean
  }

  export type SavedDestinationCreateWithoutDestinationInput = {
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSavedDestinationsInput
  }

  export type SavedDestinationUncheckedCreateWithoutDestinationInput = {
    id?: number
    userId: number
    createdAt?: Date | string
  }

  export type SavedDestinationCreateOrConnectWithoutDestinationInput = {
    where: SavedDestinationWhereUniqueInput
    create: XOR<SavedDestinationCreateWithoutDestinationInput, SavedDestinationUncheckedCreateWithoutDestinationInput>
  }

  export type SavedDestinationCreateManyDestinationInputEnvelope = {
    data: SavedDestinationCreateManyDestinationInput | SavedDestinationCreateManyDestinationInput[]
    skipDuplicates?: boolean
  }

  export type ItineraryItemCreateWithoutDestinationInput = {
    order: number
    visitTime?: string | null
    createdAt?: Date | string
    itinerary: ItineraryCreateNestedOneWithoutItemsInput
  }

  export type ItineraryItemUncheckedCreateWithoutDestinationInput = {
    id?: number
    itineraryId: number
    order: number
    visitTime?: string | null
    createdAt?: Date | string
  }

  export type ItineraryItemCreateOrConnectWithoutDestinationInput = {
    where: ItineraryItemWhereUniqueInput
    create: XOR<ItineraryItemCreateWithoutDestinationInput, ItineraryItemUncheckedCreateWithoutDestinationInput>
  }

  export type ItineraryItemCreateManyDestinationInputEnvelope = {
    data: ItineraryItemCreateManyDestinationInput | ItineraryItemCreateManyDestinationInput[]
    skipDuplicates?: boolean
  }

  export type ReviewCreateWithoutDestinationInput = {
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateWithoutDestinationInput = {
    id?: number
    userId: number
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewCreateOrConnectWithoutDestinationInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutDestinationInput, ReviewUncheckedCreateWithoutDestinationInput>
  }

  export type ReviewCreateManyDestinationInputEnvelope = {
    data: ReviewCreateManyDestinationInput | ReviewCreateManyDestinationInput[]
    skipDuplicates?: boolean
  }

  export type VisitedPlaceCreateWithoutDestinationInput = {
    visitedAt?: Date | string
    checkedIn?: boolean
    user: UserCreateNestedOneWithoutVisitedPlacesInput
  }

  export type VisitedPlaceUncheckedCreateWithoutDestinationInput = {
    id?: number
    userId: number
    visitedAt?: Date | string
    checkedIn?: boolean
  }

  export type VisitedPlaceCreateOrConnectWithoutDestinationInput = {
    where: VisitedPlaceWhereUniqueInput
    create: XOR<VisitedPlaceCreateWithoutDestinationInput, VisitedPlaceUncheckedCreateWithoutDestinationInput>
  }

  export type VisitedPlaceCreateManyDestinationInputEnvelope = {
    data: VisitedPlaceCreateManyDestinationInput | VisitedPlaceCreateManyDestinationInput[]
    skipDuplicates?: boolean
  }

  export type DestinationCategoryUpsertWithWhereUniqueWithoutDestinationInput = {
    where: DestinationCategoryWhereUniqueInput
    update: XOR<DestinationCategoryUpdateWithoutDestinationInput, DestinationCategoryUncheckedUpdateWithoutDestinationInput>
    create: XOR<DestinationCategoryCreateWithoutDestinationInput, DestinationCategoryUncheckedCreateWithoutDestinationInput>
  }

  export type DestinationCategoryUpdateWithWhereUniqueWithoutDestinationInput = {
    where: DestinationCategoryWhereUniqueInput
    data: XOR<DestinationCategoryUpdateWithoutDestinationInput, DestinationCategoryUncheckedUpdateWithoutDestinationInput>
  }

  export type DestinationCategoryUpdateManyWithWhereWithoutDestinationInput = {
    where: DestinationCategoryScalarWhereInput
    data: XOR<DestinationCategoryUpdateManyMutationInput, DestinationCategoryUncheckedUpdateManyWithoutDestinationInput>
  }

  export type DestinationCategoryScalarWhereInput = {
    AND?: DestinationCategoryScalarWhereInput | DestinationCategoryScalarWhereInput[]
    OR?: DestinationCategoryScalarWhereInput[]
    NOT?: DestinationCategoryScalarWhereInput | DestinationCategoryScalarWhereInput[]
    id?: IntFilter<"DestinationCategory"> | number
    destinationId?: IntFilter<"DestinationCategory"> | number
    categoryId?: IntFilter<"DestinationCategory"> | number
  }

  export type SavedDestinationUpsertWithWhereUniqueWithoutDestinationInput = {
    where: SavedDestinationWhereUniqueInput
    update: XOR<SavedDestinationUpdateWithoutDestinationInput, SavedDestinationUncheckedUpdateWithoutDestinationInput>
    create: XOR<SavedDestinationCreateWithoutDestinationInput, SavedDestinationUncheckedCreateWithoutDestinationInput>
  }

  export type SavedDestinationUpdateWithWhereUniqueWithoutDestinationInput = {
    where: SavedDestinationWhereUniqueInput
    data: XOR<SavedDestinationUpdateWithoutDestinationInput, SavedDestinationUncheckedUpdateWithoutDestinationInput>
  }

  export type SavedDestinationUpdateManyWithWhereWithoutDestinationInput = {
    where: SavedDestinationScalarWhereInput
    data: XOR<SavedDestinationUpdateManyMutationInput, SavedDestinationUncheckedUpdateManyWithoutDestinationInput>
  }

  export type ItineraryItemUpsertWithWhereUniqueWithoutDestinationInput = {
    where: ItineraryItemWhereUniqueInput
    update: XOR<ItineraryItemUpdateWithoutDestinationInput, ItineraryItemUncheckedUpdateWithoutDestinationInput>
    create: XOR<ItineraryItemCreateWithoutDestinationInput, ItineraryItemUncheckedCreateWithoutDestinationInput>
  }

  export type ItineraryItemUpdateWithWhereUniqueWithoutDestinationInput = {
    where: ItineraryItemWhereUniqueInput
    data: XOR<ItineraryItemUpdateWithoutDestinationInput, ItineraryItemUncheckedUpdateWithoutDestinationInput>
  }

  export type ItineraryItemUpdateManyWithWhereWithoutDestinationInput = {
    where: ItineraryItemScalarWhereInput
    data: XOR<ItineraryItemUpdateManyMutationInput, ItineraryItemUncheckedUpdateManyWithoutDestinationInput>
  }

  export type ItineraryItemScalarWhereInput = {
    AND?: ItineraryItemScalarWhereInput | ItineraryItemScalarWhereInput[]
    OR?: ItineraryItemScalarWhereInput[]
    NOT?: ItineraryItemScalarWhereInput | ItineraryItemScalarWhereInput[]
    id?: IntFilter<"ItineraryItem"> | number
    itineraryId?: IntFilter<"ItineraryItem"> | number
    destinationId?: IntFilter<"ItineraryItem"> | number
    order?: IntFilter<"ItineraryItem"> | number
    visitTime?: StringNullableFilter<"ItineraryItem"> | string | null
    createdAt?: DateTimeFilter<"ItineraryItem"> | Date | string
  }

  export type ReviewUpsertWithWhereUniqueWithoutDestinationInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutDestinationInput, ReviewUncheckedUpdateWithoutDestinationInput>
    create: XOR<ReviewCreateWithoutDestinationInput, ReviewUncheckedCreateWithoutDestinationInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutDestinationInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutDestinationInput, ReviewUncheckedUpdateWithoutDestinationInput>
  }

  export type ReviewUpdateManyWithWhereWithoutDestinationInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutDestinationInput>
  }

  export type VisitedPlaceUpsertWithWhereUniqueWithoutDestinationInput = {
    where: VisitedPlaceWhereUniqueInput
    update: XOR<VisitedPlaceUpdateWithoutDestinationInput, VisitedPlaceUncheckedUpdateWithoutDestinationInput>
    create: XOR<VisitedPlaceCreateWithoutDestinationInput, VisitedPlaceUncheckedCreateWithoutDestinationInput>
  }

  export type VisitedPlaceUpdateWithWhereUniqueWithoutDestinationInput = {
    where: VisitedPlaceWhereUniqueInput
    data: XOR<VisitedPlaceUpdateWithoutDestinationInput, VisitedPlaceUncheckedUpdateWithoutDestinationInput>
  }

  export type VisitedPlaceUpdateManyWithWhereWithoutDestinationInput = {
    where: VisitedPlaceScalarWhereInput
    data: XOR<VisitedPlaceUpdateManyMutationInput, VisitedPlaceUncheckedUpdateManyWithoutDestinationInput>
  }

  export type DestinationCategoryCreateWithoutCategoryInput = {
    destination: DestinationCreateNestedOneWithoutCategoriesInput
  }

  export type DestinationCategoryUncheckedCreateWithoutCategoryInput = {
    id?: number
    destinationId: number
  }

  export type DestinationCategoryCreateOrConnectWithoutCategoryInput = {
    where: DestinationCategoryWhereUniqueInput
    create: XOR<DestinationCategoryCreateWithoutCategoryInput, DestinationCategoryUncheckedCreateWithoutCategoryInput>
  }

  export type DestinationCategoryCreateManyCategoryInputEnvelope = {
    data: DestinationCategoryCreateManyCategoryInput | DestinationCategoryCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type CategoryKeywordCreateWithoutCategoryInput = {
    keyword: string
    createdAt?: Date | string
  }

  export type CategoryKeywordUncheckedCreateWithoutCategoryInput = {
    id?: number
    keyword: string
    createdAt?: Date | string
  }

  export type CategoryKeywordCreateOrConnectWithoutCategoryInput = {
    where: CategoryKeywordWhereUniqueInput
    create: XOR<CategoryKeywordCreateWithoutCategoryInput, CategoryKeywordUncheckedCreateWithoutCategoryInput>
  }

  export type CategoryKeywordCreateManyCategoryInputEnvelope = {
    data: CategoryKeywordCreateManyCategoryInput | CategoryKeywordCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type DestinationCategoryUpsertWithWhereUniqueWithoutCategoryInput = {
    where: DestinationCategoryWhereUniqueInput
    update: XOR<DestinationCategoryUpdateWithoutCategoryInput, DestinationCategoryUncheckedUpdateWithoutCategoryInput>
    create: XOR<DestinationCategoryCreateWithoutCategoryInput, DestinationCategoryUncheckedCreateWithoutCategoryInput>
  }

  export type DestinationCategoryUpdateWithWhereUniqueWithoutCategoryInput = {
    where: DestinationCategoryWhereUniqueInput
    data: XOR<DestinationCategoryUpdateWithoutCategoryInput, DestinationCategoryUncheckedUpdateWithoutCategoryInput>
  }

  export type DestinationCategoryUpdateManyWithWhereWithoutCategoryInput = {
    where: DestinationCategoryScalarWhereInput
    data: XOR<DestinationCategoryUpdateManyMutationInput, DestinationCategoryUncheckedUpdateManyWithoutCategoryInput>
  }

  export type CategoryKeywordUpsertWithWhereUniqueWithoutCategoryInput = {
    where: CategoryKeywordWhereUniqueInput
    update: XOR<CategoryKeywordUpdateWithoutCategoryInput, CategoryKeywordUncheckedUpdateWithoutCategoryInput>
    create: XOR<CategoryKeywordCreateWithoutCategoryInput, CategoryKeywordUncheckedCreateWithoutCategoryInput>
  }

  export type CategoryKeywordUpdateWithWhereUniqueWithoutCategoryInput = {
    where: CategoryKeywordWhereUniqueInput
    data: XOR<CategoryKeywordUpdateWithoutCategoryInput, CategoryKeywordUncheckedUpdateWithoutCategoryInput>
  }

  export type CategoryKeywordUpdateManyWithWhereWithoutCategoryInput = {
    where: CategoryKeywordScalarWhereInput
    data: XOR<CategoryKeywordUpdateManyMutationInput, CategoryKeywordUncheckedUpdateManyWithoutCategoryInput>
  }

  export type CategoryKeywordScalarWhereInput = {
    AND?: CategoryKeywordScalarWhereInput | CategoryKeywordScalarWhereInput[]
    OR?: CategoryKeywordScalarWhereInput[]
    NOT?: CategoryKeywordScalarWhereInput | CategoryKeywordScalarWhereInput[]
    id?: IntFilter<"CategoryKeyword"> | number
    keyword?: StringFilter<"CategoryKeyword"> | string
    categoryId?: IntFilter<"CategoryKeyword"> | number
    createdAt?: DateTimeFilter<"CategoryKeyword"> | Date | string
  }

  export type DestinationCreateWithoutCategoriesInput = {
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedBy?: SavedDestinationCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemCreateNestedManyWithoutDestinationInput
    reviews?: ReviewCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceCreateNestedManyWithoutDestinationInput
  }

  export type DestinationUncheckedCreateWithoutCategoriesInput = {
    id?: number
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedBy?: SavedDestinationUncheckedCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemUncheckedCreateNestedManyWithoutDestinationInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceUncheckedCreateNestedManyWithoutDestinationInput
  }

  export type DestinationCreateOrConnectWithoutCategoriesInput = {
    where: DestinationWhereUniqueInput
    create: XOR<DestinationCreateWithoutCategoriesInput, DestinationUncheckedCreateWithoutCategoriesInput>
  }

  export type CategoryCreateWithoutDestinationsInput = {
    name: string
    createdAt?: Date | string
    keywords?: CategoryKeywordCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutDestinationsInput = {
    id?: number
    name: string
    createdAt?: Date | string
    keywords?: CategoryKeywordUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutDestinationsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutDestinationsInput, CategoryUncheckedCreateWithoutDestinationsInput>
  }

  export type DestinationUpsertWithoutCategoriesInput = {
    update: XOR<DestinationUpdateWithoutCategoriesInput, DestinationUncheckedUpdateWithoutCategoriesInput>
    create: XOR<DestinationCreateWithoutCategoriesInput, DestinationUncheckedCreateWithoutCategoriesInput>
    where?: DestinationWhereInput
  }

  export type DestinationUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: DestinationWhereInput
    data: XOR<DestinationUpdateWithoutCategoriesInput, DestinationUncheckedUpdateWithoutCategoriesInput>
  }

  export type DestinationUpdateWithoutCategoriesInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedBy?: SavedDestinationUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUpdateManyWithoutDestinationNestedInput
  }

  export type DestinationUncheckedUpdateWithoutCategoriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedBy?: SavedDestinationUncheckedUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUncheckedUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUncheckedUpdateManyWithoutDestinationNestedInput
  }

  export type CategoryUpsertWithoutDestinationsInput = {
    update: XOR<CategoryUpdateWithoutDestinationsInput, CategoryUncheckedUpdateWithoutDestinationsInput>
    create: XOR<CategoryCreateWithoutDestinationsInput, CategoryUncheckedCreateWithoutDestinationsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutDestinationsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutDestinationsInput, CategoryUncheckedUpdateWithoutDestinationsInput>
  }

  export type CategoryUpdateWithoutDestinationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    keywords?: CategoryKeywordUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutDestinationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    keywords?: CategoryKeywordUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateWithoutKeywordsInput = {
    name: string
    createdAt?: Date | string
    destinations?: DestinationCategoryCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutKeywordsInput = {
    id?: number
    name: string
    createdAt?: Date | string
    destinations?: DestinationCategoryUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutKeywordsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutKeywordsInput, CategoryUncheckedCreateWithoutKeywordsInput>
  }

  export type CategoryUpsertWithoutKeywordsInput = {
    update: XOR<CategoryUpdateWithoutKeywordsInput, CategoryUncheckedUpdateWithoutKeywordsInput>
    create: XOR<CategoryCreateWithoutKeywordsInput, CategoryUncheckedCreateWithoutKeywordsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutKeywordsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutKeywordsInput, CategoryUncheckedUpdateWithoutKeywordsInput>
  }

  export type CategoryUpdateWithoutKeywordsInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    destinations?: DestinationCategoryUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutKeywordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    destinations?: DestinationCategoryUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type UserCreateWithoutSavedDestinationsInput = {
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    reviews?: ReviewCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSavedDestinationsInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSavedDestinationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSavedDestinationsInput, UserUncheckedCreateWithoutSavedDestinationsInput>
  }

  export type DestinationCreateWithoutSavedByInput = {
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemCreateNestedManyWithoutDestinationInput
    reviews?: ReviewCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceCreateNestedManyWithoutDestinationInput
  }

  export type DestinationUncheckedCreateWithoutSavedByInput = {
    id?: number
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryUncheckedCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemUncheckedCreateNestedManyWithoutDestinationInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceUncheckedCreateNestedManyWithoutDestinationInput
  }

  export type DestinationCreateOrConnectWithoutSavedByInput = {
    where: DestinationWhereUniqueInput
    create: XOR<DestinationCreateWithoutSavedByInput, DestinationUncheckedCreateWithoutSavedByInput>
  }

  export type UserUpsertWithoutSavedDestinationsInput = {
    update: XOR<UserUpdateWithoutSavedDestinationsInput, UserUncheckedUpdateWithoutSavedDestinationsInput>
    create: XOR<UserCreateWithoutSavedDestinationsInput, UserUncheckedCreateWithoutSavedDestinationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSavedDestinationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSavedDestinationsInput, UserUncheckedUpdateWithoutSavedDestinationsInput>
  }

  export type UserUpdateWithoutSavedDestinationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    reviews?: ReviewUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSavedDestinationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DestinationUpsertWithoutSavedByInput = {
    update: XOR<DestinationUpdateWithoutSavedByInput, DestinationUncheckedUpdateWithoutSavedByInput>
    create: XOR<DestinationCreateWithoutSavedByInput, DestinationUncheckedCreateWithoutSavedByInput>
    where?: DestinationWhereInput
  }

  export type DestinationUpdateToOneWithWhereWithoutSavedByInput = {
    where?: DestinationWhereInput
    data: XOR<DestinationUpdateWithoutSavedByInput, DestinationUncheckedUpdateWithoutSavedByInput>
  }

  export type DestinationUpdateWithoutSavedByInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUpdateManyWithoutDestinationNestedInput
  }

  export type DestinationUncheckedUpdateWithoutSavedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUncheckedUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUncheckedUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUncheckedUpdateManyWithoutDestinationNestedInput
  }

  export type UserCreateWithoutItinerariesInput = {
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationCreateNestedManyWithoutUserInput
    reviews?: ReviewCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutItinerariesInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationUncheckedCreateNestedManyWithoutUserInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutItinerariesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
  }

  export type ItineraryItemCreateWithoutItineraryInput = {
    order: number
    visitTime?: string | null
    createdAt?: Date | string
    destination: DestinationCreateNestedOneWithoutItineraryItemsInput
  }

  export type ItineraryItemUncheckedCreateWithoutItineraryInput = {
    id?: number
    destinationId: number
    order: number
    visitTime?: string | null
    createdAt?: Date | string
  }

  export type ItineraryItemCreateOrConnectWithoutItineraryInput = {
    where: ItineraryItemWhereUniqueInput
    create: XOR<ItineraryItemCreateWithoutItineraryInput, ItineraryItemUncheckedCreateWithoutItineraryInput>
  }

  export type ItineraryItemCreateManyItineraryInputEnvelope = {
    data: ItineraryItemCreateManyItineraryInput | ItineraryItemCreateManyItineraryInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutItinerariesInput = {
    update: XOR<UserUpdateWithoutItinerariesInput, UserUncheckedUpdateWithoutItinerariesInput>
    create: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutItinerariesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutItinerariesInput, UserUncheckedUpdateWithoutItinerariesInput>
  }

  export type UserUpdateWithoutItinerariesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUpdateManyWithoutUserNestedInput
    reviews?: ReviewUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutItinerariesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUncheckedUpdateManyWithoutUserNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ItineraryItemUpsertWithWhereUniqueWithoutItineraryInput = {
    where: ItineraryItemWhereUniqueInput
    update: XOR<ItineraryItemUpdateWithoutItineraryInput, ItineraryItemUncheckedUpdateWithoutItineraryInput>
    create: XOR<ItineraryItemCreateWithoutItineraryInput, ItineraryItemUncheckedCreateWithoutItineraryInput>
  }

  export type ItineraryItemUpdateWithWhereUniqueWithoutItineraryInput = {
    where: ItineraryItemWhereUniqueInput
    data: XOR<ItineraryItemUpdateWithoutItineraryInput, ItineraryItemUncheckedUpdateWithoutItineraryInput>
  }

  export type ItineraryItemUpdateManyWithWhereWithoutItineraryInput = {
    where: ItineraryItemScalarWhereInput
    data: XOR<ItineraryItemUpdateManyMutationInput, ItineraryItemUncheckedUpdateManyWithoutItineraryInput>
  }

  export type ItineraryCreateWithoutItemsInput = {
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutItinerariesInput
  }

  export type ItineraryUncheckedCreateWithoutItemsInput = {
    id?: number
    userId: number
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItineraryCreateOrConnectWithoutItemsInput = {
    where: ItineraryWhereUniqueInput
    create: XOR<ItineraryCreateWithoutItemsInput, ItineraryUncheckedCreateWithoutItemsInput>
  }

  export type DestinationCreateWithoutItineraryItemsInput = {
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationCreateNestedManyWithoutDestinationInput
    reviews?: ReviewCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceCreateNestedManyWithoutDestinationInput
  }

  export type DestinationUncheckedCreateWithoutItineraryItemsInput = {
    id?: number
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryUncheckedCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationUncheckedCreateNestedManyWithoutDestinationInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceUncheckedCreateNestedManyWithoutDestinationInput
  }

  export type DestinationCreateOrConnectWithoutItineraryItemsInput = {
    where: DestinationWhereUniqueInput
    create: XOR<DestinationCreateWithoutItineraryItemsInput, DestinationUncheckedCreateWithoutItineraryItemsInput>
  }

  export type ItineraryUpsertWithoutItemsInput = {
    update: XOR<ItineraryUpdateWithoutItemsInput, ItineraryUncheckedUpdateWithoutItemsInput>
    create: XOR<ItineraryCreateWithoutItemsInput, ItineraryUncheckedCreateWithoutItemsInput>
    where?: ItineraryWhereInput
  }

  export type ItineraryUpdateToOneWithWhereWithoutItemsInput = {
    where?: ItineraryWhereInput
    data: XOR<ItineraryUpdateWithoutItemsInput, ItineraryUncheckedUpdateWithoutItemsInput>
  }

  export type ItineraryUpdateWithoutItemsInput = {
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutItinerariesNestedInput
  }

  export type ItineraryUncheckedUpdateWithoutItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DestinationUpsertWithoutItineraryItemsInput = {
    update: XOR<DestinationUpdateWithoutItineraryItemsInput, DestinationUncheckedUpdateWithoutItineraryItemsInput>
    create: XOR<DestinationCreateWithoutItineraryItemsInput, DestinationUncheckedCreateWithoutItineraryItemsInput>
    where?: DestinationWhereInput
  }

  export type DestinationUpdateToOneWithWhereWithoutItineraryItemsInput = {
    where?: DestinationWhereInput
    data: XOR<DestinationUpdateWithoutItineraryItemsInput, DestinationUncheckedUpdateWithoutItineraryItemsInput>
  }

  export type DestinationUpdateWithoutItineraryItemsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUpdateManyWithoutDestinationNestedInput
  }

  export type DestinationUncheckedUpdateWithoutItineraryItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUncheckedUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUncheckedUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUncheckedUpdateManyWithoutDestinationNestedInput
  }

  export type UserCreateWithoutReviewsInput = {
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReviewsInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    visitedPlaces?: VisitedPlaceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReviewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
  }

  export type DestinationCreateWithoutReviewsInput = {
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceCreateNestedManyWithoutDestinationInput
  }

  export type DestinationUncheckedCreateWithoutReviewsInput = {
    id?: number
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryUncheckedCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationUncheckedCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemUncheckedCreateNestedManyWithoutDestinationInput
    visitedBy?: VisitedPlaceUncheckedCreateNestedManyWithoutDestinationInput
  }

  export type DestinationCreateOrConnectWithoutReviewsInput = {
    where: DestinationWhereUniqueInput
    create: XOR<DestinationCreateWithoutReviewsInput, DestinationUncheckedCreateWithoutReviewsInput>
  }

  export type UserUpsertWithoutReviewsInput = {
    update: XOR<UserUpdateWithoutReviewsInput, UserUncheckedUpdateWithoutReviewsInput>
    create: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewsInput, UserUncheckedUpdateWithoutReviewsInput>
  }

  export type UserUpdateWithoutReviewsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    visitedPlaces?: VisitedPlaceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DestinationUpsertWithoutReviewsInput = {
    update: XOR<DestinationUpdateWithoutReviewsInput, DestinationUncheckedUpdateWithoutReviewsInput>
    create: XOR<DestinationCreateWithoutReviewsInput, DestinationUncheckedCreateWithoutReviewsInput>
    where?: DestinationWhereInput
  }

  export type DestinationUpdateToOneWithWhereWithoutReviewsInput = {
    where?: DestinationWhereInput
    data: XOR<DestinationUpdateWithoutReviewsInput, DestinationUncheckedUpdateWithoutReviewsInput>
  }

  export type DestinationUpdateWithoutReviewsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUpdateManyWithoutDestinationNestedInput
  }

  export type DestinationUncheckedUpdateWithoutReviewsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUncheckedUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUncheckedUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUncheckedUpdateManyWithoutDestinationNestedInput
    visitedBy?: VisitedPlaceUncheckedUpdateManyWithoutDestinationNestedInput
  }

  export type UserCreateWithoutVisitedPlacesInput = {
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    reviews?: ReviewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVisitedPlacesInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.Role | null
    gender?: $Enums.Gender | null
    domisili?: string | null
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    savedDestinations?: SavedDestinationUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVisitedPlacesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVisitedPlacesInput, UserUncheckedCreateWithoutVisitedPlacesInput>
  }

  export type DestinationCreateWithoutVisitedByInput = {
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemCreateNestedManyWithoutDestinationInput
    reviews?: ReviewCreateNestedManyWithoutDestinationInput
  }

  export type DestinationUncheckedCreateWithoutVisitedByInput = {
    id?: number
    name: string
    description: string
    address: string
    contact?: string | null
    latitude: number
    longitude: number
    imageUrl?: string | null
    openTime?: string | null
    closeTime?: string | null
    ticketPrice?: number | null
    maxPrice?: number | null
    website?: string | null
    visitCount?: number
    status?: $Enums.DestinationStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: DestinationCategoryUncheckedCreateNestedManyWithoutDestinationInput
    savedBy?: SavedDestinationUncheckedCreateNestedManyWithoutDestinationInput
    itineraryItems?: ItineraryItemUncheckedCreateNestedManyWithoutDestinationInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutDestinationInput
  }

  export type DestinationCreateOrConnectWithoutVisitedByInput = {
    where: DestinationWhereUniqueInput
    create: XOR<DestinationCreateWithoutVisitedByInput, DestinationUncheckedCreateWithoutVisitedByInput>
  }

  export type UserUpsertWithoutVisitedPlacesInput = {
    update: XOR<UserUpdateWithoutVisitedPlacesInput, UserUncheckedUpdateWithoutVisitedPlacesInput>
    create: XOR<UserCreateWithoutVisitedPlacesInput, UserUncheckedCreateWithoutVisitedPlacesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVisitedPlacesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVisitedPlacesInput, UserUncheckedUpdateWithoutVisitedPlacesInput>
  }

  export type UserUpdateWithoutVisitedPlacesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    reviews?: ReviewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVisitedPlacesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    gender?: NullableEnumGenderFieldUpdateOperationsInput | $Enums.Gender | null
    domisili?: NullableStringFieldUpdateOperationsInput | string | null
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedDestinations?: SavedDestinationUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DestinationUpsertWithoutVisitedByInput = {
    update: XOR<DestinationUpdateWithoutVisitedByInput, DestinationUncheckedUpdateWithoutVisitedByInput>
    create: XOR<DestinationCreateWithoutVisitedByInput, DestinationUncheckedCreateWithoutVisitedByInput>
    where?: DestinationWhereInput
  }

  export type DestinationUpdateToOneWithWhereWithoutVisitedByInput = {
    where?: DestinationWhereInput
    data: XOR<DestinationUpdateWithoutVisitedByInput, DestinationUncheckedUpdateWithoutVisitedByInput>
  }

  export type DestinationUpdateWithoutVisitedByInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUpdateManyWithoutDestinationNestedInput
  }

  export type DestinationUncheckedUpdateWithoutVisitedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    openTime?: NullableStringFieldUpdateOperationsInput | string | null
    closeTime?: NullableStringFieldUpdateOperationsInput | string | null
    ticketPrice?: NullableIntFieldUpdateOperationsInput | number | null
    maxPrice?: NullableIntFieldUpdateOperationsInput | number | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    status?: EnumDestinationStatusFieldUpdateOperationsInput | $Enums.DestinationStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: DestinationCategoryUncheckedUpdateManyWithoutDestinationNestedInput
    savedBy?: SavedDestinationUncheckedUpdateManyWithoutDestinationNestedInput
    itineraryItems?: ItineraryItemUncheckedUpdateManyWithoutDestinationNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutDestinationNestedInput
  }

  export type SavedDestinationCreateManyUserInput = {
    id?: number
    destinationId: number
    createdAt?: Date | string
  }

  export type ItineraryCreateManyUserInput = {
    id?: number
    title?: string
    totalDistance?: number | null
    estimatedTime?: number | null
    estimatedCost?: number | null
    isAiGenerated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReviewCreateManyUserInput = {
    id?: number
    destinationId: number
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitedPlaceCreateManyUserInput = {
    id?: number
    destinationId: number
    visitedAt?: Date | string
    checkedIn?: boolean
  }

  export type SavedDestinationUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    destination?: DestinationUpdateOneRequiredWithoutSavedByNestedInput
  }

  export type SavedDestinationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedDestinationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryUpdateWithoutUserInput = {
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ItineraryItemUpdateManyWithoutItineraryNestedInput
  }

  export type ItineraryUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ItineraryItemUncheckedUpdateManyWithoutItineraryNestedInput
  }

  export type ItineraryUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    totalDistance?: NullableFloatFieldUpdateOperationsInput | number | null
    estimatedTime?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCost?: NullableIntFieldUpdateOperationsInput | number | null
    isAiGenerated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUpdateWithoutUserInput = {
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    destination?: DestinationUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitedPlaceUpdateWithoutUserInput = {
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    destination?: DestinationUpdateOneRequiredWithoutVisitedByNestedInput
  }

  export type VisitedPlaceUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VisitedPlaceUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DestinationCategoryCreateManyDestinationInput = {
    id?: number
    categoryId: number
  }

  export type SavedDestinationCreateManyDestinationInput = {
    id?: number
    userId: number
    createdAt?: Date | string
  }

  export type ItineraryItemCreateManyDestinationInput = {
    id?: number
    itineraryId: number
    order: number
    visitTime?: string | null
    createdAt?: Date | string
  }

  export type ReviewCreateManyDestinationInput = {
    id?: number
    userId: number
    rating: number
    comment?: string | null
    photoUrl?: string | null
    helpfulCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitedPlaceCreateManyDestinationInput = {
    id?: number
    userId: number
    visitedAt?: Date | string
    checkedIn?: boolean
  }

  export type DestinationCategoryUpdateWithoutDestinationInput = {
    category?: CategoryUpdateOneRequiredWithoutDestinationsNestedInput
  }

  export type DestinationCategoryUncheckedUpdateWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
  }

  export type DestinationCategoryUncheckedUpdateManyWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
  }

  export type SavedDestinationUpdateWithoutDestinationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedDestinationsNestedInput
  }

  export type SavedDestinationUncheckedUpdateWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedDestinationUncheckedUpdateManyWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryItemUpdateWithoutDestinationInput = {
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itinerary?: ItineraryUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ItineraryItemUncheckedUpdateWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    itineraryId?: IntFieldUpdateOperationsInput | number
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryItemUncheckedUpdateManyWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    itineraryId?: IntFieldUpdateOperationsInput | number
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUpdateWithoutDestinationInput = {
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    helpfulCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitedPlaceUpdateWithoutDestinationInput = {
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutVisitedPlacesNestedInput
  }

  export type VisitedPlaceUncheckedUpdateWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VisitedPlaceUncheckedUpdateManyWithoutDestinationInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DestinationCategoryCreateManyCategoryInput = {
    id?: number
    destinationId: number
  }

  export type CategoryKeywordCreateManyCategoryInput = {
    id?: number
    keyword: string
    createdAt?: Date | string
  }

  export type DestinationCategoryUpdateWithoutCategoryInput = {
    destination?: DestinationUpdateOneRequiredWithoutCategoriesNestedInput
  }

  export type DestinationCategoryUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
  }

  export type DestinationCategoryUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
  }

  export type CategoryKeywordUpdateWithoutCategoryInput = {
    keyword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryKeywordUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    keyword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryKeywordUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    keyword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryItemCreateManyItineraryInput = {
    id?: number
    destinationId: number
    order: number
    visitTime?: string | null
    createdAt?: Date | string
  }

  export type ItineraryItemUpdateWithoutItineraryInput = {
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    destination?: DestinationUpdateOneRequiredWithoutItineraryItemsNestedInput
  }

  export type ItineraryItemUncheckedUpdateWithoutItineraryInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItineraryItemUncheckedUpdateManyWithoutItineraryInput = {
    id?: IntFieldUpdateOperationsInput | number
    destinationId?: IntFieldUpdateOperationsInput | number
    order?: IntFieldUpdateOperationsInput | number
    visitTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}