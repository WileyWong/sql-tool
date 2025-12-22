# Elasticsearch Comprehensive Guide

## Introduction

Elasticsearch is a distributed search and analytics engine, scalable data store, and vector database optimized for speed and relevance on production-scale workloads. Built on Apache Lucene, it serves as the foundation of Elastic's open Stack platform, providing near real-time search over massive datasets, vector searches for AI applications, and comprehensive data analytics capabilities.

## Table of Contents

1. [Client Installation & Setup](#client-installation--setup)
2. [REST API Operations](#rest-api-operations)
3. [Multi-Language Client Examples](#multi-language-client-examples)
4. [Advanced Features](#advanced-features)
5. [Configuration & Deployment](#configuration--deployment)
6. [Code Generation Templates](#code-generation-templates)

---

## Client Installation & Setup

### Java Client

#### Maven Installation

```xml
<project>
  <dependencies>
    <dependency>
      <groupId>co.elastic.clients</groupId>
      <artifactId>elasticsearch-java</artifactId>
      <version>9.0.1</version>
    </dependency>
  </dependencies>
</project>
```

#### Gradle Installation

```groovy
dependencies {
    implementation 'co.elastic.clients:elasticsearch-java:9.0.1'
}
```

#### Connection Setup

```java
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;

// Create the low-level client
RestClient restClient = RestClient.builder(
    new HttpHost("localhost", 9200, "http")
).build();

// Create the transport with a Jackson mapper
ElasticsearchTransport transport = new RestClientTransport(
    restClient, 
    new JacksonJsonpMapper()
);

// Create the API client
ElasticsearchClient client = new ElasticsearchClient(transport);

// Cloud connection
ElasticsearchClient cloudClient = new ElasticsearchClient(
    "<CLOUD_ID>", 
    new ApiKey("<API_KEY>")
);
```

### Python Client

#### Installation

```bash
python -m pip install elasticsearch
```

#### Connection Setup

```python
from elasticsearch import Elasticsearch
import os

# Local connection
client = Elasticsearch(
    "http://localhost:9200",
    basic_auth=("elastic", os.getenv('ES_LOCAL_PASSWORD')),
    request_timeout=30,
    max_retries=3,
    retry_on_timeout=True
)

# Cloud connection
cloud_client = Elasticsearch(
    cloud_id="<CloudID>",
    api_key="<ApiKey>"
)

# Verify connection
print(client.info())
```

### JavaScript Client

#### Installation

```bash
npm install @elastic/elasticsearch
```

#### Connection Setup

```javascript
const { Client } = require('@elastic/elasticsearch');

// Local connection
const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: process.env.ES_PASSWORD
  }
});

// Cloud connection
const cloudClient = new Client({
  cloud: { id: '<cloud-id>' },
  auth: { apiKey: 'base64EncodedKey' }
});

// Test connection
await client.info();
```

### Go Client

#### Installation

```bash
go get github.com/elastic/go-elasticsearch/v9@latest
```

#### Connection Setup

```go
package main

import (
    "log"
    "context"
    "github.com/elastic/go-elasticsearch/v9"
)

func main() {
    // Default connection
    client, err := elasticsearch.NewDefaultClient()
    if err != nil {
        log.Fatal(err)
    }
    
    log.Println(elasticsearch.Version)
    log.Println(client.Info())
    
    // Cloud connection
    cloudClient, err := elasticsearch.NewClient(elasticsearch.Config{
        CloudID: "<CloudID>",
        APIKey:  "<ApiKey>",
    })
}
```

### .NET Client

#### Installation

```bash
dotnet add package Elastic.Clients.Elasticsearch
```

#### Connection Setup

```csharp
using Elastic.Clients.Elasticsearch;

// Local connection
var settings = new ElasticsearchClientSettings(new Uri("http://localhost:9200"))
    .Authentication(new BasicAuthentication("elastic", "password"));
var client = new ElasticsearchClient(settings);

// Cloud connection
var cloudClient = new ElasticsearchClient("<CLOUD_ID>", new ApiKey("<API_KEY>"));
```

### Ruby Client

#### Installation

```bash
gem install elasticsearch
```

#### Connection Setup

```ruby
require 'elasticsearch'

# Local connection
client = Elasticsearch::Client.new(
  hosts: ['http://localhost:9200'],
  user: 'elastic',
  password: ENV['ES_PASSWORD']
)

# Cloud connection
cloud_client = Elasticsearch::Client.new(
  cloud_id: '<CloudID>',
  api_key: '<ApiKey>'
)

# Test connection
puts client.info
```

---

## REST API Operations

### Index Management

#### Create Index

```bash
# Basic index creation
curl -X PUT "http://localhost:9200/products" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "settings": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "name": {
          "type": "text",
          "analyzer": "standard"
        },
        "price": {
          "type": "float"
        },
        "created_at": {
          "type": "date"
        },
        "tags": {
          "type": "keyword"
        }
      }
    }
  }'
```

### Document Operations

#### Index a Document

```bash
# Index with automatic ID
curl -X POST "http://localhost:9200/customer/_doc?refresh=true" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "firstname": "Jennifer",
    "lastname": "Walters",
    "age": 32,
    "city": "Los Angeles"
  }'

# Index with explicit ID
curl -X PUT "http://localhost:9200/customer/_doc/1" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "firstname": "Monica",
    "lastname": "Rambeau"
  }'
```

#### Get Document

```bash
# Get by ID
curl -X GET "http://localhost:9200/customer/_doc/1" \
  -u elastic:$ES_LOCAL_PASSWORD

# Get with source filtering
curl -X GET "http://localhost:9200/customer/_doc/1?_source=firstname,lastname" \
  -u elastic:$ES_LOCAL_PASSWORD

# Check if exists
curl -I -X HEAD "http://localhost:9200/customer/_doc/1" \
  -u elastic:$ES_LOCAL_PASSWORD
```

#### Update Document

```bash
# Partial update
curl -X POST "http://localhost:9200/customer/_update/1" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "doc": {
      "age": 33
    }
  }'
```

#### Delete Document

```bash
# Simple delete
curl -X DELETE "http://localhost:9200/customer/_doc/1" \
  -u elastic:$ES_LOCAL_PASSWORD

# Delete with version control
curl -X DELETE "http://localhost:9200/customer/_doc/1?if_seq_no=5&if_primary_term=1" \
  -u elastic:$ES_LOCAL_PASSWORD
```

#### Bulk Operations

```bash
curl -X POST "http://localhost:9200/_bulk?refresh=true" \
  -H 'Content-Type: application/x-ndjson' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '
{ "index": { "_index": "customer", "_id": "1" } }
{ "firstname": "Monica", "lastname": "Rambeau", "age": 35 }
{ "index": { "_index": "customer", "_id": "2" } }
{ "firstname": "Carol", "lastname": "Danvers", "age": 38 }
{ "update": { "_index": "customer", "_id": "1" } }
{ "doc": { "age": 36 } }
{ "delete": { "_index": "customer", "_id": "old-doc-1" } }
'
```

### Search Operations

#### Basic Search

```bash
# Simple match query
curl -X GET "http://localhost:9200/customer/_search" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "query": {
      "match": {
        "firstname": "Jennifer"
      }
    }
  }'
```

#### Advanced Search

```bash
# Complex query with filtering, sorting, pagination
curl -X GET "http://localhost:9200/customer/_search" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "query": {
      "bool": {
        "must": [
          { "match": { "city": "Los Angeles" } }
        ],
        "filter": [
          { "range": { "age": { "gte": 25, "lte": 40 } } }
        ]
      }
    },
    "_source": ["firstname", "lastname", "age"],
    "sort": [
      { "age": { "order": "desc" } }
    ],
    "size": 10,
    "from": 0
  }'
```

#### Aggregations

```bash
# Multi-level aggregation
curl -X GET "http://localhost:9200/sales/_search" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "size": 0,
    "aggs": {
      "sales_by_region": {
        "terms": {
          "field": "region.keyword",
          "size": 10
        },
        "aggs": {
          "total_revenue": {
            "sum": {
              "field": "amount"
            }
          },
          "avg_sale": {
            "avg": {
              "field": "amount"
            }
          }
        }
      }
    }
  }'
```

---

## Multi-Language Client Examples

### Java Client Operations

#### Create Index

```java
esClient.indices().create(c -> c
    .index("products")
);
```

#### Index Document

```java
Product product = new Product("bk-1", "City bike", 123.0);

IndexResponse response = esClient.index(i -> i
    .index("products")
    .id(product.getSku())
    .document(product)
);

logger.info("Indexed with version " + response.version());
```

#### Get Document

```java
GetResponse<Product> response = esClient.get(g -> g
    .index("products")
    .id("bk-1"),
    Product.class     
);

if (response.found()) {
    Product product = response.source();
    logger.info("Product name " + product.getName());
} else {
    logger.info("Product not found");
}
```

#### Update Document

```java
Product product = new Product("bk-1", "City bike", 123.0);

esClient.update(u -> u
    .index("products")
    .id("bk-1")
    .upsert(product),
    Product.class
);
```

#### Search Documents

```java
String searchText = "bike";

SearchResponse<Product> response = esClient.search(s -> s
    .index("products")
    .query(q -> q
        .match(t -> t
            .field("name")
            .query(searchText)
        )
    ),
    Product.class
);

for (Hit<Product> hit : response.hits().hits()) {
    Product product = hit.source();
    logger.info("Found product: " + product.getName());
}
```

### Python Client Operations

#### Create Index

```python
client.indices.create(
    index="products",
    body={
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            "properties": {
                "name": {"type": "text"},
                "price": {"type": "float"}
            }
        }
    }
)
```

#### Index Document

```python
doc = {
    "name": "City bike",
    "price": 123.0,
    "category": "bicycles"
}

response = client.index(
    index="products",
    id="bk-1",
    document=doc,
    refresh=True
)

print(f"Document indexed: {response['result']}")
```

#### Get Document

```python
doc = client.get(index="products", id="bk-1")
print(f"Retrieved: {doc['_source']}")
```

#### Update Document

```python
client.update(
    index="products",
    id="bk-1",
    doc={"price": 150.0, "updated": True},
    refresh=True
)
```

#### Search Documents

```python
response = client.search(
    index="products",
    body={
        "query": {
            "match": {
                "name": "bike"
            }
        },
        "size": 10
    }
)

for hit in response['hits']['hits']:
    print(f"ID: {hit['_id']}, Source: {hit['_source']}")
```

#### Bulk Operations

```python
from elasticsearch.helpers import bulk

documents = [
    {"_index": "products", "_id": "1", "_source": {"name": "Product 1", "price": 10.0}},
    {"_index": "products", "_id": "2", "_source": {"name": "Product 2", "price": 20.0}},
    {"_index": "products", "_id": "3", "_source": {"name": "Product 3", "price": 30.0}},
]

success, failed = bulk(client, documents, refresh=True)
print(f"Bulk indexed {success} documents, {failed} failed")
```

### JavaScript Client Operations

#### Create Index

```javascript
await client.indices.create({ index: 'products' });
```

#### Index Document

```javascript
const document = {
  name: 'City bike',
  price: 123.0
};

await client.index({
  index: 'products',
  id: 'bk-1',
  document
});
```

#### Get Document

```javascript
const result = await client.get({
  index: 'products',
  id: 'bk-1'
});

console.log(result._source);
```

#### Update Document

```javascript
await client.update({
  index: 'products',
  id: 'bk-1',
  doc: {
    price: 150.0
  }
});
```

#### Search Documents

```javascript
const result = await client.search({
  index: 'products',
  query: {
    match: { name: 'bike' }
  }
});

result.hits.hits.forEach(hit => {
  console.log(hit._source);
});
```

### Go Client Operations

#### Create Index

```go
// Low-level API
client.Indices.Create("products")

// Typed API
typedClient.Indices.Create("products").Do(context.TODO())
```

#### Index Document

```go
// Low-level API
document := struct {
    Name  string  `json:"name"`
    Price float64 `json:"price"`
}{"City bike", 123.0}

data, _ := json.Marshal(document)
client.Index("products", bytes.NewReader(data))

// Typed API
typedClient.Index("products").
    Id("bk-1").
    Request(document).
    Do(context.TODO())
```

#### Update Document

```go
// Low-level API
client.Update("products", "bk-1", strings.NewReader(`{"doc": {"price": 150.0}}`))

// Typed API
typedClient.Update("products", "bk-1").
    Request(&update.Request{
        Doc: json.RawMessage(`{"price": 150.0}`),
    }).Do(context.TODO())
```

### .NET Client Operations

#### Create Index

```csharp
var response = await client.Indices.CreateAsync("products");
```

#### Index Document

```csharp
var doc = new Product
{
    Id = "bk-1",
    Name = "City bike",
    Price = 123.0
};

var response = await client.IndexAsync(doc, x => x.Index("products"));
```

#### Get Document

```csharp
var response = await client.GetAsync<Product>("products", "bk-1");

if (response.IsValidResponse)
{
    var doc = response.Source;
}
```

#### Update Document

```csharp
doc.Price = 150.0;

var response = await client.UpdateAsync<Product, Product>("products", "bk-1", u => u
    .Doc(doc)
);
```

#### Search Documents

```csharp
var response = await client.SearchAsync<Product>(s => s
    .Indices("products")
    .From(0)
    .Size(10)
    .Query(q => q
        .Match(m => m
            .Field(f => f.Name)
            .Query("bike")
        )
    )
);

if (response.IsValidResponse)
{
    foreach (var doc in response.Documents)
    {
        Console.WriteLine(doc.Name);
    }
}
```

### Ruby Client Operations

#### Create Index

```ruby
client.indices.create(index: 'products')
```

#### Index Document

```ruby
doc = {
  name: 'City bike',
  price: 123.0
}

client.index(index: 'products', id: 'bk-1', body: doc)
```

#### Get Document

```ruby
result = client.get(index: 'products', id: 'bk-1')
puts result['_source']
```

#### Update Document

```ruby
client.update(
  index: 'products',
  id: 'bk-1',
  body: { doc: { price: 150.0 } }
)
```

#### Search Documents

```ruby
result = client.search(
  index: 'products',
  body: {
    query: {
      match: { name: 'bike' }
    }
  }
)

result['hits']['hits'].each do |hit|
  puts hit['_source']
end
```

---

## Advanced Features

### Index Templates

```bash
curl -X PUT "http://localhost:9200/_index_template/products_template" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "index_patterns": ["products-*"],
    "template": {
      "settings": {
        "number_of_shards": 2,
        "number_of_replicas": 1
      },
      "mappings": {
        "properties": {
          "name": { "type": "text" },
          "price": { "type": "float" },
          "timestamp": { "type": "date" }
        }
      }
    }
  }'
```

### Aliases

```bash
# Create alias
curl -X POST "http://localhost:9200/_aliases" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "actions": [
      {
        "add": {
          "index": "products",
          "alias": "products_alias"
        }
      }
    ]
  }'
```

### Reindex

```bash
curl -X POST "http://localhost:9200/_reindex" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "source": {
      "index": "old_products"
    },
    "dest": {
      "index": "new_products"
    }
  }'
```

### Snapshot and Restore

```bash
# Create repository
curl -X PUT "http://localhost:9200/_snapshot/my_backup" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "type": "fs",
    "settings": {
      "location": "/mount/backups/my_backup"
    }
  }'

# Create snapshot
curl -X PUT "http://localhost:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD

# Restore snapshot
curl -X POST "http://localhost:9200/_snapshot/my_backup/snapshot_1/_restore" \
  -H 'Content-Type: application/json' \
  -u elastic:$ES_LOCAL_PASSWORD
```

---

## Configuration & Deployment

### Elasticsearch Configuration (elasticsearch.yml)

```yaml
# Cluster configuration
cluster.name: my-elasticsearch-cluster
node.name: node-1

# Node roles
node.roles: [ master, data, ingest, ml ]

# Network settings
network.host: 0.0.0.0
http.port: 9200
transport.port: 9300

# Discovery
discovery.seed_hosts: ["host1:9300", "host2:9300"]
cluster.initial_master_nodes: ["node-1", "node-2"]

# Paths
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch

# Memory
bootstrap.memory_lock: true

# Thread pools
thread_pool.write.queue_size: 500
thread_pool.search.queue_size: 1000
```

### JVM Options (jvm.options)

```bash
# Heap size
-Xms4g
-Xmx4g

# Garbage collection
-XX:+UseG1GC
-XX:G1ReservePercent=25
-XX:InitiatingHeapOccupancyPercent=30

# GC logging
-Xlog:gc*,gc+age=trace:file=/var/log/elasticsearch/gc.log:utctime,pid,tags:filecount=32,filesize=64m

# Heap dump on OOM
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/lib/elasticsearch
```

### Docker Compose Deployment

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.0
    container_name: elasticsearch
    environment:
      - node.name=es-node-1
      - cluster.name=es-docker-cluster
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=changeme
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - elastic

  kibana:
    image: docker.elastic.co/kibana/kibana:8.15.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_USERNAME=elastic
      - ELASTICSEARCH_PASSWORD=changeme
    ports:
      - "5601:5601"
    networks:
      - elastic
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
    driver: local

networks:
  elastic:
    driver: bridge
```

---

## Code Generation Templates

### Java Spring Boot Service Template

```java
package com.example.elasticsearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.*;
import com.example.elasticsearch.entity.Product;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ElasticsearchClient client;

    public ProductService(ElasticsearchClient client) {
        this.client = client;
    }

    public Product save(Product product) throws IOException {
        IndexResponse response = client.index(i -> i
            .index("products")
            .id(product.getId())
            .document(product)
        );
        return product;
    }

    public Product findById(String id) throws IOException {
        GetResponse<Product> response = client.get(g -> g
            .index("products")
            .id(id),
            Product.class
        );
        return response.found() ? response.source() : null;
    }

    public List<Product> search(String searchText) throws IOException {
        SearchResponse<Product> response = client.search(s -> s
            .index("products")
            .query(q -> q
                .match(m -> m
                    .field("name")
                    .query(searchText)
                )
            ),
            Product.class
        );

        return response.hits().hits().stream()
            .map(hit -> hit.source())
            .collect(Collectors.toList());
    }

    public void delete(String id) throws IOException {
        client.delete(d -> d
            .index("products")
            .id(id)
        );
    }

    public void bulkIndex(List<Product> products) throws IOException {
        BulkRequest.Builder br = new BulkRequest.Builder();

        for (Product product : products) {
            br.operations(op -> op
                .index(idx -> idx
                    .index("products")
                    .id(product.getId())
                    .document(product)
                )
            );
        }

        BulkResponse result = client.bulk(br.build());
        
        if (result.errors()) {
            throw new RuntimeException("Bulk indexing had errors");
        }
    }
}
```

### Python Service Template

```python
from elasticsearch import Elasticsearch, helpers
from typing import List, Dict, Optional
import os

class ProductService:
    def __init__(self):
        self.client = Elasticsearch(
            "http://localhost:9200",
            basic_auth=("elastic", os.getenv('ES_PASSWORD')),
            request_timeout=30
        )
        self.index = "products"

    def create_index(self):
        """Create index with mappings"""
        self.client.indices.create(
            index=self.index,
            body={
                "settings": {
                    "number_of_shards": 1,
                    "number_of_replicas": 0
                },
                "mappings": {
                    "properties": {
                        "name": {"type": "text"},
                        "price": {"type": "float"},
                        "category": {"type": "keyword"},
                        "created_at": {"type": "date"}
                    }
                }
            },
            ignore=400  # Ignore error if index exists
        )

    def save(self, product: Dict) -> Dict:
        """Index a single product"""
        response = self.client.index(
            index=self.index,
            id=product.get('id'),
            document=product,
            refresh=True
        )
        return response

    def find_by_id(self, product_id: str) -> Optional[Dict]:
        """Get product by ID"""
        try:
            doc = self.client.get(index=self.index, id=product_id)
            return doc['_source']
        except:
            return None

    def search(self, query_text: str, size: int = 10) -> List[Dict]:
        """Search products"""
        response = self.client.search(
            index=self.index,
            body={
                "query": {
                    "multi_match": {
                        "query": query_text,
                        "fields": ["name", "category"]
                    }
                },
                "size": size
            }
        )
        return [hit['_source'] for hit in response['hits']['hits']]

    def delete(self, product_id: str):
        """Delete product by ID"""
        self.client.delete(index=self.index, id=product_id, refresh=True)

    def bulk_index(self, products: List[Dict]):
        """Bulk index products"""
        actions = [
            {
                "_index": self.index,
                "_id": product.get('id'),
                "_source": product
            }
            for product in products
        ]
        
        success, failed = helpers.bulk(self.client, actions, refresh=True)
        return {"success": success, "failed": failed}

    def aggregate_by_category(self) -> Dict:
        """Get aggregation by category"""
        response = self.client.search(
            index=self.index,
            body={
                "size": 0,
                "aggs": {
                    "categories": {
                        "terms": {
                            "field": "category",
                            "size": 10
                        },
                        "aggs": {
                            "avg_price": {
                                "avg": {
                                    "field": "price"
                                }
                            }
                        }
                    }
                }
            }
        )
        return response['aggregations']
```

### Node.js Service Template

```javascript
const { Client } = require('@elastic/elasticsearch');

class ProductService {
    constructor() {
        this.client = new Client({
            node: process.env.ES_URL || 'http://localhost:9200',
            auth: {
                username: 'elastic',
                password: process.env.ES_PASSWORD
            }
        });
        this.index = 'products';
    }

    async createIndex() {
        try {
            await this.client.indices.create({
                index: this.index,
                body: {
                    settings: {
                        number_of_shards: 1,
                        number_of_replicas: 0
                    },
                    mappings: {
                        properties: {
                            name: { type: 'text' },
                            price: { type: 'float' },
                            category: { type: 'keyword' },
                            created_at: { type: 'date' }
                        }
                    }
                }
            });
        } catch (error) {
            if (error.meta?.statusCode !== 400) {
                throw error;
            }
        }
    }

    async save(product) {
        const response = await this.client.index({
            index: this.index,
            id: product.id,
            document: product,
            refresh: true
        });
        return response;
    }

    async findById(id) {
        try {
            const result = await this.client.get({
                index: this.index,
                id: id
            });
            return result._source;
        } catch (error) {
            if (error.meta?.statusCode === 404) {
                return null;
            }
            throw error;
        }
    }

    async search(queryText, size = 10) {
        const result = await this.client.search({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query: queryText,
                        fields: ['name', 'category']
                    }
                },
                size: size
            }
        });

        return result.hits.hits.map(hit => hit._source);
    }

    async delete(id) {
        await this.client.delete({
            index: this.index,
            id: id,
            refresh: true
        });
    }

    async bulkIndex(products) {
        const body = products.flatMap(product => [
            { index: { _index: this.index, _id: product.id } },
            product
        ]);

        const response = await this.client.bulk({
            body: body,
            refresh: true
        });

        return {
            success: response.items.filter(item => !item.index.error).length,
            failed: response.items.filter(item => item.index.error).length,
            errors: response.errors
        };
    }

    async aggregateByCategory() {
        const result = await this.client.search({
            index: this.index,
            body: {
                size: 0,
                aggs: {
                    categories: {
                        terms: {
                            field: 'category',
                            size: 10
                        },
                        aggs: {
                            avg_price: {
                                avg: {
                                    field: 'price'
                                }
                            }
                        }
                    }
                }
            }
        });

        return result.aggregations;
    }
}

module.exports = ProductService;
```

### Go Service Template

```go
package service

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "github.com/elastic/go-elasticsearch/v9"
)

type Product struct {
    ID       string  `json:"id"`
    Name     string  `json:"name"`
    Price    float64 `json:"price"`
    Category string  `json:"category"`
}

type ProductService struct {
    client *elasticsearch.Client
    index  string
}

func NewProductService() (*ProductService, error) {
    client, err := elasticsearch.NewDefaultClient()
    if err != nil {
        return nil, err
    }

    return &ProductService{
        client: client,
        index:  "products",
    }, nil
}

func (s *ProductService) CreateIndex(ctx context.Context) error {
    mapping := `{
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            "properties": {
                "name": { "type": "text" },
                "price": { "type": "float" },
                "category": { "type": "keyword" }
            }
        }
    }`

    res, err := s.client.Indices.Create(
        s.index,
        s.client.Indices.Create.WithBody(bytes.NewReader([]byte(mapping))),
        s.client.Indices.Create.WithContext(ctx),
    )
    if err != nil {
        return err
    }
    defer res.Body.Close()

    return nil
}

func (s *ProductService) Save(ctx context.Context, product *Product) error {
    data, err := json.Marshal(product)
    if err != nil {
        return err
    }

    res, err := s.client.Index(
        s.index,
        bytes.NewReader(data),
        s.client.Index.WithDocumentID(product.ID),
        s.client.Index.WithRefresh("true"),
        s.client.Index.WithContext(ctx),
    )
    if err != nil {
        return err
    }
    defer res.Body.Close()

    if res.IsError() {
        return fmt.Errorf("error indexing document: %s", res.String())
    }

    return nil
}

func (s *ProductService) FindByID(ctx context.Context, id string) (*Product, error) {
    res, err := s.client.Get(
        s.index,
        id,
        s.client.Get.WithContext(ctx),
    )
    if err != nil {
        return nil, err
    }
    defer res.Body.Close()

    if res.IsError() {
        return nil, fmt.Errorf("error getting document: %s", res.String())
    }

    var result map[string]interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        return nil, err
    }

    source := result["_source"].(map[string]interface{})
    product := &Product{
        ID:       source["id"].(string),
        Name:     source["name"].(string),
        Price:    source["price"].(float64),
        Category: source["category"].(string),
    }

    return product, nil
}

func (s *ProductService) Search(ctx context.Context, queryText string) ([]*Product, error) {
    query := map[string]interface{}{
        "query": map[string]interface{}{
            "multi_match": map[string]interface{}{
                "query":  queryText,
                "fields": []string{"name", "category"},
            },
        },
    }

    var buf bytes.Buffer
    if err := json.NewEncoder(&buf).Encode(query); err != nil {
        return nil, err
    }

    res, err := s.client.Search(
        s.client.Search.WithContext(ctx),
        s.client.Search.WithIndex(s.index),
        s.client.Search.WithBody(&buf),
    )
    if err != nil {
        return nil, err
    }
    defer res.Body.Close()

    var result map[string]interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        return nil, err
    }

    products := []*Product{}
    hits := result["hits"].(map[string]interface{})["hits"].([]interface{})
    for _, hit := range hits {
        source := hit.(map[string]interface{})["_source"].(map[string]interface{})
        product := &Product{
            ID:       source["id"].(string),
            Name:     source["name"].(string),
            Price:    source["price"].(float64),
            Category: source["category"].(string),
        }
        products = append(products, product)
    }

    return products, nil
}
```

---

## Summary

This comprehensive guide provides:

1. **Multi-language client setup** - Java, Python, JavaScript, Go, .NET, Ruby
2. **Complete REST API reference** - All CRUD operations with examples
3. **Advanced features** - Aggregations, bulk operations, templates, snapshots
4. **Production-ready templates** - Service layer implementations for each language
5. **Configuration examples** - Deployment configurations for various environments

Use this guide as a reference for:
- Quick client setup in any supported language
- Understanding REST API patterns
- Implementing production-ready Elasticsearch services
- Generating code for specific use cases
- Deploying Elasticsearch in various environments
