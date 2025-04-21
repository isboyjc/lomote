This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 数据库命令

本项目使用 Prisma ORM 连接数据库。以下是可用的数据库相关命令：

### Prisma 基础命令

```bash
# 验证 schema 文件格式是否正确
pnpm prisma:validate

# 格式化 schema 文件
pnpm prisma:format

# 生成 Prisma 客户端
pnpm prisma:generate

# 启动 Prisma Studio 可视化管理界面
pnpm prisma:studio
```

### 数据库同步命令

```bash
# 直接将 schema 变更推送到数据库（不创建迁移记录，适用于开发阶段）
pnpm prisma:push
```

### 迁移相关命令

```bash
# 创建新的迁移并应用（开发环境使用）
# 例如：pnpm prisma:migrate:dev --name add_products_table
pnpm prisma:migrate:dev --name 迁移名称

# 应用待处理的迁移（生产环境使用）
pnpm prisma:migrate:deploy

# 检查迁移状态
pnpm prisma:migrate:status

# 重置数据库并重新应用所有迁移（谨慎使用）
pnpm prisma:migrate:reset
```

### 数据填充命令

```bash
# 运行种子脚本，填充测试数据
pnpm db:seed
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
