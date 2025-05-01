# 基础构建阶段
FROM node:20-alpine AS base
RUN npm install -g pnpm
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 依赖安装阶段
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成Prisma客户端
RUN pnpm prisma generate

# 构建应用 - 修改构建命令，添加 --no-lint 选项跳过 lint 检查
RUN pnpm build --no-lint

# 生产运行阶段
FROM base AS runner
ENV NODE_ENV=production

# 创建非root用户运行应用
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# 拷贝构建结果和依赖
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
