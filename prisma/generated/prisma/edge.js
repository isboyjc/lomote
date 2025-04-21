
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  full_name: 'full_name',
  user_name: 'user_name',
  avatar_url: 'avatar_url',
  email: 'email',
  bio: 'bio',
  gender: 'gender',
  birthday: 'birthday',
  status: 'status',
  is_deleted: 'is_deleted',
  deletion_date: 'deletion_date',
  last_login_at: 'last_login_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  parent_id: 'parent_id',
  type: 'type',
  description: 'description',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  is_system: 'is_system',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  id: 'id',
  role_id: 'role_id',
  permission_id: 'permission_id',
  created_at: 'created_at'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  role_id: 'role_id',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.UserStatus = exports.$Enums.UserStatus = {
  active: 'active',
  pending: 'pending',
  restricted: 'restricted',
  banned: 'banned',
  inactive: 'inactive'
};

exports.GenderType = exports.$Enums.GenderType = {
  male: 'male',
  female: 'female',
  other: 'other',
  prefer_not_to_say: 'prefer_not_to_say'
};

exports.PermissionType = exports.$Enums.PermissionType = {
  system: 'system',
  page: 'page',
  module: 'module',
  operation: 'operation',
  data: 'data'
};

exports.Prisma.ModelName = {
  User: 'User',
  Permission: 'Permission',
  Role: 'Role',
  RolePermission: 'RolePermission',
  UserRole: 'UserRole'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/lijianchao/isboyjc/remote/lomote/prisma/generated/prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/Users/lijianchao/isboyjc/remote/lomote/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"./generated/prisma\"\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n  directUrl = env(\"DATABASE_URL\")\n}\n\n// 用户状态枚举\nenum UserStatus {\n  active // 活跃状态\n  pending // 待处理状态\n  restricted // 受限状态\n  banned // 封禁状态\n  inactive // 非活跃状态\n}\n\n// 性别枚举\nenum GenderType {\n  male // 男性\n  female // 女性\n  other // 其他\n  prefer_not_to_say // 不愿透露\n}\n\n// 权限类型枚举\nenum PermissionType {\n  system // 系统级权限\n  page // 页面级权限\n  module // 模块级权限\n  operation // 操作级权限\n  data // 数据级权限\n}\n\n// 用户表 - 扩展自 Supabase Auth\nmodel User {\n  id            String      @id @db.Uuid /// 用户唯一标识，与Supabase Auth用户ID保持一致\n  full_name     String? /// 用户全名\n  user_name     String? /// 用户名\n  avatar_url    String? /// 头像URL\n  email         String? /// 电子邮箱\n  bio           String? /// 个人简介\n  gender        GenderType? /// 性别\n  birthday      DateTime?   @db.Date /// 生日\n  status        UserStatus  @default(active) /// 用户状态，默认为活跃\n  is_deleted    Boolean     @default(false) /// 是否已删除，软删除标记\n  deletion_date DateTime?   @db.Timestamptz() /// 删除日期\n  last_login_at DateTime?   @db.Timestamptz() /// 最后登录时间\n  created_at    DateTime    @default(now()) @db.Timestamptz() /// 创建时间\n  updated_at    DateTime    @default(now()) @db.Timestamptz() /// 更新时间\n\n  // 关系\n  user_roles UserRole[] /// 用户角色关联\n\n  @@map(\"users\")\n}\n\n// 权限表\nmodel Permission {\n  id          Int            @id @default(autoincrement()) @db.Integer /// 权限ID，自增主键\n  name        String /// 权限名称\n  code        String         @unique /// 权限编码，唯一标识\n  parent_id   Int? /// 父权限ID\n  type        PermissionType /// 权限类型\n  description String? /// 权限描述\n  created_at  DateTime       @default(now()) @db.Timestamptz() /// 创建时间\n  updated_at  DateTime       @default(now()) @db.Timestamptz() /// 更新时间\n\n  // 自关联关系\n  parent   Permission?  @relation(\"PermissionToPermission\", fields: [parent_id], references: [id]) /// 父权限\n  children Permission[] @relation(\"PermissionToPermission\") /// 子权限\n\n  // 关系\n  role_permissions RolePermission[] /// 角色权限关联\n\n  @@map(\"permissions\")\n}\n\n// 角色表\nmodel Role {\n  id          Int      @id @default(autoincrement()) @db.Integer /// 角色ID，自增主键\n  name        String   @unique /// 角色名称，唯一\n  description String? /// 角色描述\n  is_system   Boolean  @default(false) /// 是否为系统角色\n  created_at  DateTime @default(now()) @db.Timestamptz() /// 创建时间\n  updated_at  DateTime @default(now()) @db.Timestamptz() /// 更新时间\n\n  // 关系\n  role_permissions RolePermission[] /// 角色权限关联\n  user_roles       UserRole[] /// 用户角色关联\n\n  @@map(\"roles\")\n}\n\n// 角色权限关联表\nmodel RolePermission {\n  id            Int      @id @default(autoincrement()) @db.Integer /// 关联ID，自增主键\n  role_id       Int /// 角色ID\n  permission_id Int /// 权限ID\n  created_at    DateTime @default(now()) @db.Timestamptz() /// 创建时间\n\n  // 关系\n  role       Role       @relation(fields: [role_id], references: [id]) /// 角色\n  permission Permission @relation(fields: [permission_id], references: [id]) /// 权限\n\n  @@unique([role_id, permission_id]) /// 确保角色和权限的组合唯一\n  @@map(\"role_permissions\")\n}\n\n// 用户角色关联表\nmodel UserRole {\n  id         Int      @id @default(autoincrement()) @db.Integer /// 关联ID，自增主键\n  user_id    String   @db.Uuid /// 用户ID\n  role_id    Int /// 角色ID\n  created_at DateTime @default(now()) @db.Timestamptz() /// 创建时间\n\n  // 关系\n  user User @relation(fields: [user_id], references: [id], onDelete: Cascade) /// 用户，级联删除\n  role Role @relation(fields: [role_id], references: [id]) /// 角色\n\n  @@unique([user_id, role_id]) /// 确保用户和角色的组合唯一\n  @@map(\"user_roles\")\n}\n",
  "inlineSchemaHash": "60a39c3054c2ac82526756a80f8e6c6b0de1692cee1fb5859a7343bce695b206",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Uuid\",[]],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户唯一标识，与Supabase Auth用户ID保持一致\"},{\"name\":\"full_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户全名\"},{\"name\":\"user_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户名\"},{\"name\":\"avatar_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"头像URL\"},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"电子邮箱\"},{\"name\":\"bio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"个人简介\"},{\"name\":\"gender\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GenderType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"性别\"},{\"name\":\"birthday\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Date\",[]],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"生日\"},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserStatus\",\"nativeType\":null,\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户状态，默认为活跃\"},{\"name\":\"is_deleted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"是否已删除，软删除标记\"},{\"name\":\"deletion_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"删除日期\"},{\"name\":\"last_login_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"最后登录时间\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"创建时间\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"更新时间\"},{\"name\":\"user_roles\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserRole\",\"nativeType\":null,\"relationName\":\"UserToUserRole\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户角色关联\"}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Permission\":{\"dbName\":\"permissions\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":[\"Integer\",[]],\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"权限ID，自增主键\"},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"权限名称\"},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"权限编码，唯一标识\"},{\"name\":\"parent_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"父权限ID\"},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PermissionType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"权限类型\"},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"权限描述\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"创建时间\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"更新时间\"},{\"name\":\"parent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Permission\",\"nativeType\":null,\"relationName\":\"PermissionToPermission\",\"relationFromFields\":[\"parent_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"父权限\"},{\"name\":\"children\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Permission\",\"nativeType\":null,\"relationName\":\"PermissionToPermission\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"子权限\"},{\"name\":\"role_permissions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RolePermission\",\"nativeType\":null,\"relationName\":\"PermissionToRolePermission\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色权限关联\"}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Role\":{\"dbName\":\"roles\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":[\"Integer\",[]],\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色ID，自增主键\"},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色名称，唯一\"},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色描述\"},{\"name\":\"is_system\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"是否为系统角色\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"创建时间\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"更新时间\"},{\"name\":\"role_permissions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RolePermission\",\"nativeType\":null,\"relationName\":\"RoleToRolePermission\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色权限关联\"},{\"name\":\"user_roles\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserRole\",\"nativeType\":null,\"relationName\":\"RoleToUserRole\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户角色关联\"}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RolePermission\":{\"dbName\":\"role_permissions\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":[\"Integer\",[]],\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"关联ID，自增主键\"},{\"name\":\"role_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色ID\"},{\"name\":\"permission_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"权限ID\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"创建时间\"},{\"name\":\"role\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"nativeType\":null,\"relationName\":\"RoleToRolePermission\",\"relationFromFields\":[\"role_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色\"},{\"name\":\"permission\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Permission\",\"nativeType\":null,\"relationName\":\"PermissionToRolePermission\",\"relationFromFields\":[\"permission_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"权限\"}],\"primaryKey\":null,\"uniqueFields\":[[\"role_id\",\"permission_id\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"role_id\",\"permission_id\"]}],\"isGenerated\":false},\"UserRole\":{\"dbName\":\"user_roles\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":[\"Integer\",[]],\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"关联ID，自增主键\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Uuid\",[]],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户ID\"},{\"name\":\"role_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色ID\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":[\"Timestamptz\",[]],\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"创建时间\"},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"UserToUserRole\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"用户，级联删除\"},{\"name\":\"role\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"nativeType\":null,\"relationName\":\"RoleToUserRole\",\"relationFromFields\":[\"role_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"角色\"}],\"primaryKey\":null,\"uniqueFields\":[[\"user_id\",\"role_id\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"user_id\",\"role_id\"]}],\"isGenerated\":false}},\"enums\":{\"UserStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"pending\",\"dbName\":null},{\"name\":\"restricted\",\"dbName\":null},{\"name\":\"banned\",\"dbName\":null},{\"name\":\"inactive\",\"dbName\":null}],\"dbName\":null},\"GenderType\":{\"values\":[{\"name\":\"male\",\"dbName\":null},{\"name\":\"female\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null},{\"name\":\"prefer_not_to_say\",\"dbName\":null}],\"dbName\":null},\"PermissionType\":{\"values\":[{\"name\":\"system\",\"dbName\":null},{\"name\":\"page\",\"dbName\":null},{\"name\":\"module\",\"dbName\":null},{\"name\":\"operation\",\"dbName\":null},{\"name\":\"data\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

