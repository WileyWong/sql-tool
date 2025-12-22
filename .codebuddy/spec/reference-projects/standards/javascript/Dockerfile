FROM node:18-alpine

# Install dependencies including Python
RUN apk add --no-cache python3 py3-pip make g++ \
    && ln -sf python3 /usr/bin/python \
    && ln -sf pip3 /usr/bin/pip

WORKDIR /eslint/

COPY . .

RUN npm i -g npm@10
RUN npm install
RUN npx browserslist@latest --update-db
RUN npm run build:eslintrc
RUN npm prune --production

# 上下两步拆开用 docker 缓存加快编译
# 这里将本项目依赖安装完成后将本项目 link 到 @tencent/eslint-config-tencent 名字上
# 然后因为 NODE_PATH 输出为当前目录的 node_modules (具体用法请参阅: https://blog.csdn.net/Ouchieve_111/article/details/70878090)
# 所以在当前项目中再 link 自己一次 (只是用了它建立软链的能力) 即可以在所有其他的 node 项目中 require 到 @tencent/eslint-config-tencent
# (无论对应项目有没有安装, 但会被对应项目自己安装的 @tencent/eslint-config-tencent 覆盖)
RUN npm link && \
    npm link @tencent/eslint-config-tencent && \
    npm i -g eslint@8.57.0 && \
    echo "finish"

ENV NODE_PATH=/eslint/node_modules

ENTRYPOINT [ "/eslint/entrypoint" ]
