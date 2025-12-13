
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.5.0
 * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
 */
Prisma.prismaVersion = {
  client: "6.5.0",
  engine: "173f8d54f8d52e692c7e27e72a88314ec7aeff60"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  password: 'password',
  bio: 'bio',
  jobTitle: 'jobTitle',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isFirstVisit: 'isFirstVisit',
  likedUsers: 'likedUsers'
};

exports.Prisma.VisitorsScalarFieldEnum = {
  id: 'id',
  visitorId: 'visitorId',
  userId: 'userId',
  createdAt: 'createdAt',
  blogId: 'blogId'
};

exports.Prisma.FavoritesScalarFieldEnum = {
  id: 'id',
  blogId: 'blogId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.BlogLikeScalarFieldEnum = {
  id: 'id',
  blogId: 'blogId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserTopicScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  topicId: 'topicId'
};

exports.Prisma.BlogScalarFieldEnum = {
  id: 'id',
  content: 'content',
  title: 'title',
  authorId: 'authorId',
  createdAt: 'createdAt',
  popularity: 'popularity',
  views_count: 'views_count',
  readingTime: 'readingTime'
};

exports.Prisma.BlogTopicsScalarFieldEnum = {
  id: 'id',
  blogId: 'blogId',
  topicId: 'topicId'
};

exports.Prisma.TopicsScalarFieldEnum = {
  id: 'id',
  label: 'label',
  createdAt: 'createdAt',
  topPosition: 'topPosition',
  numberOfFollowers: 'numberOfFollowers'
};

exports.Prisma.FollowTopicScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  topicId: 'topicId'
};

exports.Prisma.OtpCodeScalarFieldEnum = {
  id: 'id',
  code: 'code',
  expiresAt: 'expiresAt',
  email: 'email',
  createdAt: 'createdAt'
};

exports.Prisma.FollowScalarFieldEnum = {
  id: 'id',
  followerId: 'followerId',
  followeeId: 'followeeId',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  type: 'type',
  message: 'message',
  entityId: 'entityId',
  read: 'read',
  createdAt: 'createdAt',
  actorId: 'actorId',
  userId: 'userId'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  blogId: 'blogId',
  authorId: 'authorId',
  createdAt: 'createdAt'
};

exports.Prisma.CommentLikeScalarFieldEnum = {
  id: 'id',
  commentId: 'commentId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.SubscriptionsScalarFieldEnum = {
  id: 'id',
  email: 'email',
  subscribedAt: 'subscribedAt',
  createdAt: 'createdAt',
  isActive: 'isActive'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};
exports.NotificationType = exports.$Enums.NotificationType = {
  BLOG: 'BLOG',
  LIKE: 'LIKE',
  FOLLOW: 'FOLLOW',
  COMMENT: 'COMMENT',
  CommentLike: 'CommentLike'
};

exports.Format = exports.$Enums.Format = {
  jpg: 'jpg',
  png: 'png',
  webp: 'webp'
};

exports.Prisma.ModelName = {
  User: 'User',
  Visitors: 'Visitors',
  Favorites: 'Favorites',
  BlogLike: 'BlogLike',
  Account: 'Account',
  UserTopic: 'UserTopic',
  Blog: 'Blog',
  BlogTopics: 'BlogTopics',
  Topics: 'Topics',
  FollowTopic: 'FollowTopic',
  OtpCode: 'OtpCode',
  Follow: 'Follow',
  Notification: 'Notification',
  Comment: 'Comment',
  CommentLike: 'CommentLike',
  Subscriptions: 'Subscriptions'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
