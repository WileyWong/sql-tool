FROM openjdk:11
WORKDIR /app
ADD https://github.com/checkstyle/checkstyle/releases/download/checkstyle-8.36.1/checkstyle-8.36.1-all.jar .
ENV JAR=/app/checkstyle-8.36.1-all.jar
COPY docker-entrypoint.sh epc_tencent_checks.xml tencent_checks.xml /app/
ENTRYPOINT /app/docker-entrypoint.sh
