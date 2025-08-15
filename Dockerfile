FROM node:lts-alpine
ENV TZ=Asia/Shanghai
RUN echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v$(cat /etc/alpine-release | cut -d'.' -f1-2)/main" > /etc/apk/repositories && \
    echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v$(cat /etc/alpine-release | cut -d'.' -f1-2)/community" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache docker
WORKDIR /app
EXPOSE  8001
COPY . /app
ENV TIME_ZONE Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime
CMD  npm run dev
