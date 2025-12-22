FROM golangci/golangci-lint:v1.64.8
ENV GOSUMDB="sum.woa.com+643d7a06+Ac5f5VOC4N8NUXdmhbm8pZSXIWfhek5JSmWdWrq7pLX4"
ENV GOPROXY="https://goproxy.woa.com"
COPY . /code
WORKDIR /code/docker
RUN golangci-lint custom -v

FROM golangci/golangci-lint:v1.64.8
COPY .golangci.yml /
COPY --chmod=0755 docker/docker-entrypoint.sh /
COPY --from=0 --chmod=0755 /code/docker/custom-gcl /usr/bin
ENV GOSUMDB="sum.woa.com+643d7a06+Ac5f5VOC4N8NUXdmhbm8pZSXIWfhek5JSmWdWrq7pLX4"
ENV GOPROXY="https://goproxy.woa.com"

ENTRYPOINT ["/docker-entrypoint.sh"]
