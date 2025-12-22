### GET /api/elasticsearchConfiguration/elasticsearchOperations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchConfiguration

Creates an ElasticsearchOperations implementation.

```APIDOC
## GET /api/elasticsearchConfiguration/elasticsearchOperations

### Description
Creates an ElasticsearchOperations implementation.

### Method
GET

### Endpoint
/api/elasticsearchConfiguration/elasticsearchOperations

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "None"
}

### Response
#### Success Response (200)
- **elasticsearchOperations** (ElasticsearchOperations) - The ElasticsearchOperations implementation.

#### Response Example
{
  "example": "ElasticsearchOperations object"
}
```

--------------------------------

### GET /api/elasticsearchConfiguration/elasticsearchClient

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchConfiguration

Provides the ElasticsearchClient bean.

```APIDOC
## GET /api/elasticsearchConfiguration/elasticsearchClient

### Description
Provides the ElasticsearchClient bean.

### Method
GET

### Endpoint
/api/elasticsearchConfiguration/elasticsearchClient

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "None"
}

### Response
#### Success Response (200)
- **elasticsearchClient** (co.elastic.clients.elasticsearch.ElasticsearchClient) - The ElasticsearchClient.

#### Response Example
{
  "example": "ElasticsearchClient object"
}
```

--------------------------------

### GET Suggest from SearchHits

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/class-use/Suggest

Methods to retrieve Suggest data from search results in both reactive and non-reactive contexts

```APIDOC
## GET /_search

### Description
Retrieves suggestion results from Elasticsearch query hits

### Method
GET

### Endpoint
/_search

### Parameters
#### Query Parameters
- **query** (Query) - Required - The search query containing suggestion definitions
- **entityType** (Class<?>) - Optional - The entity type for mapping results
- **index** (IndexCoordinates) - Optional - Specific index to search against

### Response
#### Success Response (200)
- **suggest** (Suggest) - Contains suggestion results from the query

#### Response Example
{
  "suggest": {
    "my_suggestion": [
      {
        "text": "search term",
        "offset": 0,
        "length": 10,
        "options": [
          {
            "text": "corrected term",
            "score": 0.8
          }
        ]
      }
    ]
  }
}
```

--------------------------------

### onAfterConvert Method Implementation Example

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/event/ReactiveAfterConvertCallback

Illustrates how to implement the onAfterConvert method of ReactiveAfterConvertCallback. This example shows a basic implementation that simply returns the provided entity, but can be extended to modify the entity or the document before returning.

```java
Publisher<T> onAfterConvert(T entity, Document document, IndexCoordinates indexCoordinates) {
    // Here you can inspect or modify the 'entity' or 'document'
    // For example, to log details:
    // System.out.println("After conversion: " + entity.toString());
    
    // Return the entity (potentially modified) wrapped in a Publisher
    return Mono.just(entity);
}
```

--------------------------------

### POST /search/scroll

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint starts a search scroll operation.

```APIDOC
## POST /search/scroll

### Description
This endpoint starts a search scroll operation.

### Method
POST

### Endpoint
/search/scroll

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **scrollTimeInMillis** (long) - Required - The time in milliseconds to keep the search context open.
- **query** (Query) - Required - The Elasticsearch query to execute.
- **clazz** (Class<T>) - Required - The class of the search results.
- **index** (IndexCoordinates) - Optional - The index to search.

### Request Example
{
  "scrollTimeInMillis": 10000,
  "query": {
    "match_all": {}
  },
  "clazz": "MyEntity"
}

### Response
#### Success Response (200)
- **SearchScrollHits<T>** - Results of the scroll operation.
```

--------------------------------

### GET /api/elasticsearchConfiguration/transportOptions

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchConfiguration

Provides the transport options to be applied to each request.

```APIDOC
## GET /api/elasticsearchConfiguration/transportOptions

### Description
Provides the transport options to be applied to each request.

### Method
GET

### Endpoint
/api/elasticsearchConfiguration/transportOptions

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "None"
}

### Response
#### Success Response (200)
- **transportOptions** (co.elastic.clients.transport.TransportOptions) - The transport options.

#### Response Example
{
  "example": "TransportOptions object"
}
```

--------------------------------

### GET /script/builder

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/Script

Returns a new ScriptBuilder instance for constructing Script objects.

```APIDOC
## GET /script/builder

### Description
Returns a new ScriptBuilder instance that can be used to construct Script objects fluently.

### Method
GET

### Endpoint
/script/builder

### Response
#### Success Response (200)
- **builder** (ScriptBuilder) - A new ScriptBuilder instance

#### Response Example
```
{
  "builder": "Script.ScriptBuilder@hashcode"
}
```
```

--------------------------------

### GET /api/elasticsearchConfiguration/jsonpMapper

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchConfiguration

Provides the JsonpMapper bean for JSON processing.

```APIDOC
## GET /api/elasticsearchConfiguration/jsonpMapper

### Description
Provides the JsonpMapper bean for JSON processing.

### Method
GET

### Endpoint
/api/elasticsearchConfiguration/jsonpMapper

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "None"
}

### Response
#### Success Response (200)
- **jsonpMapper** (co.elastic.clients.json.JsonpMapper) - The JsonpMapper bean.

#### Response Example
{
  "example": "JsonpMapper object"
}
```

--------------------------------

### GET /

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves index information. This endpoint returns details about the specified index, such as settings and mappings.

```APIDOC
## GET /

### Description
Retrieves index information.

### Method
GET

### Endpoint
/

### Parameters
#### Path Parameters
- **index** (string) - Required - The name of the index to retrieve information for.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "index": "my_index"
  }
}

### Response
#### Success Response (200)
- **response** (object) - The response from the Elasticsearch server.
```

--------------------------------

### Get legacy index template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Gets an index template using the legacy Elasticsearch interface through ReactiveIndexOperations. Takes a GetTemplateRequest parameter and returns a Mono of TemplateData, or Mono.empty() if no template exists.

```java
public Mono<TemplateData> getTemplate(GetTemplateRequest getTemplateRequest)
```

--------------------------------

### GET /search/one

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint executes the query against Elasticsearch and returns the first returned object.

```APIDOC
## GET /search/one

### Description
This endpoint executes the query against Elasticsearch and returns the first returned object.

### Method
GET

### Endpoint
/search/one

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (Query) - Required - The Elasticsearch query to execute.
- **clazz** (Class<T>) - Required - The class of the result.
- **index** (IndexCoordinates) - Optional - The index to search.

### Request Example
{
  "query": {
    "match_all": {}
  },
  "clazz": "MyEntity"
}

### Response
#### Success Response (200)
- **SearchHit<T>** - The first search hit.
```

--------------------------------

### Java: onBeforeConvert Method Implementation Example

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/event/BeforeConvertCallback

Provides a Java example of implementing the onBeforeConvert method from the BeforeConvertCallback interface. This specific implementation demonstrates how to modify an entity before it's persisted, for instance, by adding or updating a field. The method receives the entity and index information and returns the potentially modified entity.

```java
T onBeforeConvert(T entity, IndexCoordinates index)
{
    // Custom logic to modify the entity before conversion
    // For example, setting a 'lastModifiedDate' field
    // if (entity instanceof Auditable) {
    //     ((Auditable<?, ?>) entity).setLastModifiedDate(new Date());
    // }
    return entity;
}
```

--------------------------------

### GET /_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves a legacy index template.

```APIDOC
## GET /_template/{name}

### Description
Gets an index template using the legacy Elasticsearch interface.

### Method
GET

### Endpoint
/_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Template name.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **template** (object) - Template data or null if not exists.

#### Response Example
{
  "template": {
    "index_patterns": ["test-*"]
  }
}
```

--------------------------------

### GET Template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves templates. This endpoint can be called with or without a specific request.

```APIDOC
## GET /_template

### Description
Retrieves templates. This endpoint can be called with or without a specific request.

### Method
GET

### Endpoint
/_template

### Parameters
#### Request Body
- **request** (GetTemplateRequest) - Optional - A request object specifying which templates to retrieve.

### Response
#### Success Response (200)
- **templates** (Array) - An array of template information.
```

--------------------------------

### Get data streams stats in Elasticsearch reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to get statistics for data streams in Elasticsearch reactively. The operation can be performed with a request object or a builder function, or without any parameters.

```Java
Mono<co.elastic.clients.elasticsearch.indices.DataStreamsStatsResponse> dataStreamsStats()
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.DataStreamsStatsResponse> dataStreamsStats(co.elastic.clients.elasticsearch.indices.DataStreamsStatsRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.DataStreamsStatsResponse> dataStreamsStats(Function<co.elastic.clients.elasticsearch.indices.DataStreamsStatsRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.DataStreamsStatsRequest>> fn)
```

--------------------------------

### GET /api/elasticsearchConfiguration/elasticsearchTransport

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchConfiguration

Provides the Elasticsearch transport used by the client.

```APIDOC
## GET /api/elasticsearchConfiguration/elasticsearchTransport

### Description
Provides the Elasticsearch transport used by the client.

### Method
GET

### Endpoint
/api/elasticsearchConfiguration/elasticsearchTransport

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "None"
}

### Response
#### Success Response (200)
- **transport** (co.elastic.clients.transport.ElasticsearchTransport) - The Elasticsearch transport.

#### Response Example
{
  "example": "ElasticsearchTransport object"
}
```

--------------------------------

### GET /exists

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Checks if an entity with the given ID exists.

```APIDOC
## GET /exists

### Description
Check if an entity with given ID exists.

### Method
GET

### Endpoint
/exists

### Parameters
#### Query Parameters
- **id** (String) - Required - The _id of the document to look for.
- **entityType** (Class<?>) - Required - The domain type used.

### Response
#### Success Response (200)
- **Boolean** (Mono) - Emits true if a matching document exists, false otherwise.

### Since
4.0
```

--------------------------------

### GET /api/elasticsearchConfiguration/clientConfiguration

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchConfiguration

This endpoint retrieves the `clientConfiguration` bean, which is the configuration for the Elasticsearch client. It must be implemented by deriving classes.

```APIDOC
## GET /api/elasticsearchConfiguration/clientConfiguration

### Description
This endpoint retrieves the `clientConfiguration` bean, which is the configuration for the Elasticsearch client. It must be implemented by deriving classes.

### Method
GET

### Endpoint
/api/elasticsearchConfiguration/clientConfiguration

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "None"
}

### Response
#### Success Response (200)
- **clientConfiguration** (ClientConfiguration) - The Elasticsearch client configuration.

#### Response Example
{
  "example": "ClientConfiguration object"
}
```

--------------------------------

### Mapping Management Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Methods for creating, putting, and getting index mappings reactively. Supports entity-bound or class-specific mappings.

```APIDOC
## createMapping()

### Description
Creates the index mapping for the entity this IndexOperations is bound to.

### Method
Mono<Document> createMapping()

### Parameters
None

### Return
Mapping object.

## createMapping(Class<?> clazz)

### Description
Creates the index mapping for the given class.

### Method
Mono<Document> createMapping(Class<?> clazz)

### Parameters
#### Request Body
- **clazz** (Class<?>) - Required - The class to create a mapping for.

### Return
A Mono with the mapping document.

## putMapping()

### Description
Writes the mapping to the index for the class this IndexOperations is bound to.

### Method
default Mono<Boolean> putMapping()

### Parameters
None

### Return
True if the mapping could be stored.

## putMapping(Mono<Document> mapping)

### Description
Writes a mapping to the index.

### Method
Mono<Boolean> putMapping(Mono<Document> mapping)

### Parameters
#### Request Body
- **mapping** (Mono<Document>) - Required - The Document with the mapping definitions.

### Return
True if the mapping could be stored.

## putMapping(Class<?> clazz)

### Description
Creates the index mapping for the given class and writes it to the index.

### Method
default Mono<Boolean> putMapping(Class<?> clazz)

### Parameters
#### Request Body
- **clazz** (Class<?>) - Required - The class to create a mapping for.

### Return
True if the mapping could be stored.

## getMapping()

### Description
Get mapping for the index targeted defined by this ReactiveIndexOperations.

### Method
Mono<Document> getMapping()

### Parameters
None

### Return
The mapping.
```

--------------------------------

### GET /api/elasticsearchConfiguration/elasticsearchRestClient

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchConfiguration

Retrieves the low-level Elasticsearch RestClient. Requires a ClientConfiguration.

```APIDOC
## GET /api/elasticsearchConfiguration/elasticsearchRestClient

### Description
Retrieves the low-level Elasticsearch RestClient. Requires a ClientConfiguration.

### Method
GET

### Endpoint
/api/elasticsearchConfiguration/elasticsearchRestClient

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "None"
}

### Response
#### Success Response (200)
- **restClient** (org.elasticsearch.client.RestClient) - The Elasticsearch RestClient.

#### Response Example
{
  "example": "RestClient object"
}
```

--------------------------------

### GET /_index_template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves one or more composable index templates.

```APIDOC
## GET /_index_template

### Description
Gets an index template for composable templates.

### Method
GET

### Endpoint
/_index_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Optional - Specific template name.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **templates** (array) - List of template responses.

#### Response Example
[
  {
    "name": "template1",
    "index_templates": [...]
  }
]
```

--------------------------------

### GET /search/stream

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint executes the given query against Elasticsearch and returns the result as a SearchHitsIterator.

```APIDOC
## GET /search/stream

### Description
This endpoint executes the given query against Elasticsearch and returns the result as a SearchHitsIterator.

### Method
GET

### Endpoint
/search/stream

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (Query) - Required - The Elasticsearch query to execute.
- **clazz** (Class<T>) - Required - The class of the search results.
- **index** (IndexCoordinates) - Optional - The index to search.

### Request Example
{
  "query": {
    "match_all": {}
  },
  "clazz": "MyEntity"
}

### Response
#### Success Response (200)
- **SearchHitsIterator<T>** - An iterator for accessing search hits.
```

--------------------------------

### GET Settings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves settings for specified indices. This endpoint can be called with or without a specific request.

```APIDOC
## GET /_settings

### Description
Retrieves settings for specified indices. This endpoint can be called with or without a specific request.

### Method
GET

### Endpoint
/_settings

### Parameters
#### Request Body
- **request** (GetIndicesSettingsRequest) - Optional - A request object specifying which indices to retrieve settings for.

### Response
#### Success Response (200)
- **settings** (Object) - A map of index names to their settings.
```

--------------------------------

### GET /<index>/_settings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves the settings for the specified index. Supports including default settings if specified.

```APIDOC
## GET /<index>/_settings

### Description
Get the index settings from Elasticsearch.

### Method
GET

### Endpoint
/<index>/_settings

### Parameters
#### Query Parameters
- **include_defaults** (boolean) - Optional - Whether to include default settings.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **settings** (object) - Index settings object.

#### Response Example
{
  "index_name": {
    "settings": {
      "number_of_shards": "1"
    }
  }
}
```

--------------------------------

### GET /multiGet

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Executes a multiGet operation against Elasticsearch to retrieve multiple documents by their IDs.

```APIDOC
## GET /multiGet

### Description
Execute a multiGet against Elasticsearch for the given IDs.

### Method
GET

### Endpoint
/multiGet

### Parameters
#### Query Parameters
- **query** (Query) - Required - The query defining the IDs of the objects to get.
- **clazz** (Class<T>) - Required - The type of the object to be returned.
- **index** (IndexCoordinates) - Required - The index(es) from which the objects are read.

### Response
#### Success Response (200)
- **MultiGetItem<T>** (Flux) - A flux with a list of `MultiGetItem`s that contain the entities.

### Since
4.0
```

--------------------------------

### Settings Class Overview

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/Settings

Provides an overview of the Settings class, its constructors, and methods for managing Elasticsearch index settings.

```APIDOC
## Class: Settings

`Settings` is a class that defines the settings for an Elasticsearch index. It extends `DefaultStringObjectMap<Settings>` and implements `Map<String, Object>` and `StringObjectMap<Settings>`.

### Constructors

*   **`Settings()`**
    *   Description: Default constructor.
*   **`Settings(Map<String, Object> map)`**
    *   Description: Constructs a `Settings` object from a map.

### Methods

*   **`static Settings parse(String json)`**
    *   Description: Creates a `Settings` object from the given JSON String.
    *   Parameters:
        *   `json` (String) - must not be null.
    *   Returns: Settings object.

*   **`void merge(Settings other)`**
    *   Description: Merges some other settings onto this one. Other settings have higher priority on the same keys.
    *   Parameters:
        *   `other` (Settings) - the other settings. Must not be null.
    *   Since: 4.4

*   **`Settings flatten()`**
    *   Description: Flattens the nested structure (e.g., JSON fields index/foo/bar/: value) into a flat structure (e.g., index.foo.bar: value).
    *   Returns: Settings with the flattened elements.

*   **`String toString()`**
    *   Description: Overrides the default `toString` method.

*   **`Object get(Object key)`**
    *   Description: Retrieves the value associated with the given key. Specified by `Map<String, Object>`.

### Inherited Methods

*   From `DefaultStringObjectMap<Settings>`: `clear`, `containsKey`, `containsValue`, `entrySet`, `equals`, `forEach`, `fromJson`, `getOrDefault`, `hashCode`, `isEmpty`, `keySet`, `path`, `put`, `putAll`, `remove`, `size`, `toJson`, `values`.
*   From `Object`: `clone`, `finalize`, `getClass`, `notify`, `notifyAll`, `wait`.
*   From `StringObjectMap<Settings>`: `append`, `getBoolean`, `getBooleanOrDefault`, `getInt`, `getIntOrDefault`, `getLong`, `getLongOrDefault`, `getString`, `getStringOrDefault`.
```

--------------------------------

### GET /{index}/_doc/{id}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Retrieves a document by its identifier from the specified index.

```APIDOC
## GET /{index}/_doc/{id}

### Description
Fetches a document with the given ID from the specified Elasticsearch index.

### Method
GET

### Endpoint
/{index}/_doc/{id}

### Parameters
#### Path Parameters
- **index** (string) - Required - Name of the Elasticsearch index.
- **id** (string) - Required - Identifier of the document.

### Response
#### Success Response (200)
- **_source** (object) - The retrieved document fields.

### Response Example
{
  "_index": "my-index",
  "_id": "123",
  "_source": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

--------------------------------

### ElasticsearchQueryMethod Constructor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Constructor for the ElasticsearchQueryMethod class, initializing the method with repository metadata, projection factory, and mapping context.

```APIDOC
## Constructor

### Description
Initializes a new instance of the ElasticsearchQueryMethod class with the specified method, repository metadata, projection factory, and mapping context.

### Method
Constructor

### Endpoint
N/A (Constructor)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
- **method** (Method) - Required - The method to be queried.
- **repositoryMetadata** (RepositoryMetadata) - Required - Metadata about the repository.
- **factory** (ProjectionFactory) - Required - Factory for creating projections.
- **mappingContext** (MappingContext) - Required - Context for mapping persistent entities and properties.

### Request Example
N/A

### Response
N/A
```

--------------------------------

### GET /reactive-elasticsearch/multiGet

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Retrieves multiple documents by their identifiers using a multi-get query.

```APIDOC
## GET /reactive-elasticsearch/multiGet

### Description
Execute a multiGet against Elasticsearch for the given ids.

### Method


### Endpoint
/reactive-elasticsearch/multiGet

### Parameters
#### Request Body
- **query** (Query) - Required - Query defining the ids to retrieve.
- **entityType** (String) - Required - Entity class name.
- **index** (String) - Required - Target index.

### Request Example
{
  "query": {"ids": {"values": ["1", "2", "3"]}},
  "entityType": "com.example.MyEntity",
  "index": "my-index"
}

### Response
#### Success Response (200)
- **items** (List<MultiGetItem<T>>) - List of retrieved items.

### Response Example
[
  {"id": "1", "field": "value1"},
  {"id": "2", "field": "value2"}
]
```

--------------------------------

### IndicesTemplate Create Index

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

This endpoint details the methods for creating an index using IndicesTemplate.

```APIDOC
## POST /index

### Description
This endpoint describes the methods to create a new index in Elasticsearch.

### Method
POST

### Endpoint
/index

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **settings** (Map<String,Object>) - Optional - Index settings.
- **mapping** (Document) - Optional - Index mapping.

### Request Example
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
  }
}

### Response
#### Success Response (200)
- **created** (boolean) - True if the index was created.

#### Response Example
{
  "created": true
}

```

--------------------------------

### GET /script/{id}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/Script

Retrieves the ID component value of a Script record.

```APIDOC
## GET /script/{id}

### Description
Returns the value of the `id` record component from a Script instance.

### Method
GET

### Endpoint
/script/{id}

### Parameters
#### Path Parameters
- **id** (String) - Required - The identifier of the script

### Response
#### Success Response (200)
- **id** (String) - The value of the id record component

#### Response Example
```
{
  "id": "script-1"
}
```
```

--------------------------------

### GET /api/elasticsearch/search

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/class-use/IndexCoordinates

Performs a search query on the specified index and returns the results.

```APIDOC
## GET /api/elasticsearch/search

### Description
Performs a search query on the specified index and returns the results.

### Method
GET

### Endpoint
/api/elasticsearch/search

### Parameters
#### Path Parameters
- **index** (IndexCoordinates) - Required - The index to search.
- **query** (Query) - Required - The search query.
- **clazz** (Class<T>) - Required - The class type of the documents to be returned.

### Response
#### Success Response (200)
- **hits** (SearchHits<T>) - The search results.

#### Response Example
{
  "hits": [
    {
      "id": "1",
      "name": "Sample Document",
      "content": "This is a sample document."
    }
  ]
}
```

--------------------------------

### Index Creation API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

APIs for creating indices with various configurations.

```APIDOC
## POST /indices

### Description
APIs for creating indices with optional settings and mappings.

### Method
POST

### Endpoint
/indices

#### Parameters

##### Request Body
- **settings** (Map<String,Object>) - Optional - The index settings.
- **mapping** (Document) - Optional - The index mapping.

### Request Example
```json
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mapping": {
    "properties": {
      "name": {"type": "text"}
    }
  }
}
```

### Response
#### Success Response (200)
- **boolean** - true if the index was created

#### Response Example
```json
{
  "acknowledged": true
}
```
```

--------------------------------

### Manage Component Templates in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchClusterClient

Methods for managing Elasticsearch component templates, including put, get, exists, and delete operations. Each method accepts a request object or a builder function.

```java
public Mono<co.elastic.clients.elasticsearch.cluster.PutComponentTemplateResponse> putComponentTemplate(co.elastic.clients.elasticsearch.cluster.PutComponentTemplateRequest putComponentTemplateRequest)
```

```java
public Mono<co.elastic.clients.elasticsearch.cluster.PutComponentTemplateResponse> putComponentTemplate(Function<co.elastic.clients.elasticsearch.cluster.PutComponentTemplateRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.cluster.PutComponentTemplateRequest>> fn)
```

```java
public Mono<co.elastic.clients.elasticsearch.cluster.GetComponentTemplateResponse> getComponentTemplate(co.elastic.clients.elasticsearch.cluster.GetComponentTemplateRequest getComponentTemplateRequest)
```

```java
public Mono<co.elastic.clients.elasticsearch.cluster.GetComponentTemplateResponse> getComponentTemplate(Function<co.elastic.clients.elasticsearch.cluster.GetComponentTemplateRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.cluster.GetComponentTemplateRequest>> fn)
```

```java
public Mono<co.elastic.clients.transport.endpoints.BooleanResponse> existsComponentTemplate(co.elastic.clients.elasticsearch.cluster.ExistsComponentTemplateRequest existsComponentTemplateRequest)
```

```java
public Mono<co.elastic.clients.transport.endpoints.BooleanResponse> existsComponentTemplate(Function<co.elastic.clients.elasticsearch.cluster.ExistsComponentTemplateRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.cluster.ExistsComponentTemplateRequest>> fn)
```

```java
public Mono<co.elastic.clients.elasticsearch.cluster.DeleteComponentTemplateResponse> deleteComponentTemplate(co.elastic.clients.elasticsearch.cluster.DeleteComponentTemplateRequest deleteComponentTemplateRequest)
```

```java
public Mono<co.elastic.clients.elasticsearch.cluster.DeleteComponentTemplateResponse> deleteComponentTemplate(Function<co.elastic.clients.elasticsearch.cluster.DeleteComponentTemplateRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.cluster.DeleteComponentTemplateRequest>> fn)
```

--------------------------------

### Script Record Constructor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/Script

Creates an instance of the Script record class with specified id, language, and source parameters.

```APIDOC
## Script Record Constructor

### Description
Creates an instance of the `Script` record class with the specified parameters.

### Method
Constructor

### Parameters
#### Path Parameters
- **id** (String) - Required - The identifier for the script
- **language** (String) - Required - The language of the script
- **source** (String) - Required - The source code of the script

### Request Example
```
new Script("script-1", "painless", "return 1;")
```

### Response
#### Success Response (200)
- **script** (Script) - The created Script record instance

#### Response Example
```
Script[id=script-1, language=painless, source=return 1;]
```
```

--------------------------------

### GET Index Template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves index templates. This endpoint can be called with or without a specific request.

```APIDOC
## GET /_index_template

### Description
Retrieves index templates. This endpoint can be called with or without a specific request.

### Method
GET

### Endpoint
/_index_template

### Parameters
#### Request Body
- **request** (GetIndexTemplateRequest) - Optional - A request object specifying which templates to retrieve.

### Response
#### Success Response (200)
- **templates** (Array) - An array of index template information.
```

--------------------------------

### GET /_alias

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves information about specified aliases or all aliases for indices.

```APIDOC
## GET /_alias

### Description
Gets information about aliases for indices.

### Method
GET

### Endpoint
/_alias/{aliasNames}

### Parameters
#### Path Parameters
- **aliasNames** (string array) - Optional - Specific alias names.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **aliases** (map) - Map from index names to sets of alias data.

#### Response Example
{
  "index1": {
    "aliases": {
      "alias1": {}
    }
  }
}
```

--------------------------------

### Initialize ReactiveElasticsearchIndicesClient with transport options

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Constructor for ReactiveElasticsearchIndicesClient that initializes the client with Elasticsearch transport and transport options. This is essential for setting up the connection to Elasticsearch.

```Java
ReactiveElasticsearchIndicesClient(co.elastic.clients.transport.ElasticsearchTransport transport, co.elastic.clients.transport.TransportOptions transportOptions)
```

--------------------------------

### GET /script/{id}/source

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/Script

Retrieves the source component value of a Script record.

```APIDOC
## GET /script/{id}/source

### Description
Returns the value of the `source` record component from a Script instance.

### Method
GET

### Endpoint
/script/{id}/source

### Parameters
#### Path Parameters
- **id** (String) - Required - The identifier of the script

### Response
#### Success Response (200)
- **source** (String) - The value of the source record component

#### Response Example
```
{
  "source": "return 1;"
}
```
```

--------------------------------

### GET Index Template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/class-use/GetIndexTemplateRequest

Retrieves an index template using GetIndexTemplateRequest. This endpoint can be accessed synchronously or reactively.

```APIDOC
## GET /index/_template

### Description
Retrieves an index template based on the provided request.

### Method
GET

### Endpoint
/index/_template

### Parameters
#### Path Parameters
- **None**

#### Query Parameters
- **None**

#### Request Body
- **GetIndexTemplateRequest** (object) - Required - The request object containing the template name or ID.

### Request Example
{
  "template": "my_template"
}

### Response
#### Success Response (200)
- **TemplateResponse** (object) - The retrieved index template.

#### Response Example
{
  "template": "my_template",
  "order": 0
}
```

--------------------------------

### Create ElasticsearchRepositoryBean instance

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/cdi/ElasticsearchRepositoryBean

Constructor for creating a new ElasticsearchRepositoryBean. Requires ElasticsearchOperations, qualifiers, repository type, BeanManager, and optional custom repository detector. All parameters except detector must not be null.

```java
public ElasticsearchRepositoryBean(jakarta.enterprise.inject.spi.Bean<ElasticsearchOperations> operations, Set<Annotation> qualifiers, Class<T> repositoryType, jakarta.enterprise.inject.spi.BeanManager beanManager, Optional<CustomRepositoryImplementationDetector> detector)
```

--------------------------------

### GET /reactive-elasticsearch/get

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Fetches a single entity by its identifier from the specified index.

```APIDOC
## GET /reactive-elasticsearch/get

### Description
Fetches a single entity by its identifier from the specified index.

### Method
GET

### Endpoint
/reactive-elasticsearch/get

### Parameters
#### Query Parameters
- **id** (String) - Required - Identifier of the document.
- **index** (String) - Required - Target index name.
- **entityType** (String) - Required - Fully qualified class name of the entity.

### Request Example
{
  "id": "1",
  "entityType": "com.example.MyEntity",
  "index": "my-index"
}

### Response
#### Success Response (200)
- **entity** (Object) - The retrieved entity.

### Response Example
{
  "id": "1",
  "field": "value"
}
```

--------------------------------

### Settings API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

APIs for managing index settings.

```APIDOC
## GET /indices/{indexName}/_settings
## POST /indices/{indexName}/_settings

### Description
APIs for retrieving and updating index settings.

### Method
GET, POST

### Endpoint
/indices/{indexName}/_settings

#### Parameters

##### Query Parameters
- **includeDefaults** (boolean) - Optional - Whether or not to include all the default settings.

##### Request Body (for POST)
- **settings** (Settings) - Required - The new settings document.

### Response
#### Success Response (200)
- **Settings** - The index settings.

#### Response Example
```json
{
  "index": {
    "creation_date": "1678886400000",
    "number_of_shards": "1",
    "number_of_replicas": "0",
    "uuid": "...",
    "version": {
      "created": "..."
    },
    "provided_name": "my-index"
  }
}
```
```

--------------------------------

### GET /indices/settings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Retrieves the current settings configuration for an Elasticsearch index. Returns a Mono that emits the settings document.

```APIDOC
## GET /indices/settings

### Description
Retrieves the settings configuration for an Elasticsearch index.

### Method
GET

### Endpoint
/indices/settings

### Parameters
#### Path Parameters
None

#### Query Parameters
- **clazz** (Class<?>) - Optional - Entity class to generate settings for

#### Request Body
None

### Request Example
{}

### Response
#### Success Response (200)
- **settings** (Settings) - The index settings configuration

#### Response Example
{
  "settings": {
    "number_of_shards": "1",
    "number_of_replicas": "0",
    "index.refresh_interval": "1s"
  }
}
```

--------------------------------

### GET /script/{id}/language

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/Script

Retrieves the language component value of a Script record.

```APIDOC
## GET /script/{id}/language

### Description
Returns the value of the `language` record component from a Script instance.

### Method
GET

### Endpoint
/script/{id}/language

### Parameters
#### Path Parameters
- **id** (String) - Required - The identifier of the script

### Response
#### Success Response (200)
- **language** (String) - The value of the language record component

#### Response Example
```
{
  "language": "painless"
}
```
```

--------------------------------

### PhraseSuggestion Constructor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/PhraseSuggestion

Creates a new PhraseSuggestion instance with the specified name, size, and entries. This constructor is used to initialize phrase suggestions in Elasticsearch operations.

```APIDOC
## POST /api/phrasesuggestion

### Description
Creates a new PhraseSuggestion instance with the specified parameters.

### Method
POST

### Endpoint
/api/phrasesuggestion

### Parameters
#### Request Body
- **name** (String) - Required - The name of the phrase suggestion
- **size** (int) - Required - The size of the suggestion results
- **entries** (List<PhraseSuggestion.Entry>) - Required - List of phrase suggestion entries

### Request Example
{
  "name": "mySuggestion",
  "size": 10,
  "entries": []
}

### Response
#### Success Response (200)
- **suggestion** (PhraseSuggestion) - The created phrase suggestion object

#### Response Example
{
  "name": "mySuggestion",
  "size": 10,
  "entries": []
}
```

--------------------------------

### suggest(Query query, Class<?> entityType)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Performs a suggest query to get suggestion data. This method does not specify an index.

```APIDOC
## suggest(Query query, Class<?> entityType)

### Description
Does a suggest query.

### Method
Mono<Suggest> suggest(Query query, Class<?> entityType)

### Endpoint
suggest

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **query** (Query) - Required - The Query containing the suggest definition, must not be null
- **entityType** (Class<?>) - Required - The type of the entities that might be returned for a completion suggestion, must not be null

### Request Example
suggest(query, entityType)

### Response
#### Success Response (Mono)
- **Suggest** - A Mono emitting suggest data

#### Response Example
Mono<Suggest>
```

--------------------------------

### GET /_disk/usage

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint retrieves disk usage information for the cluster. It allows for specifying a function to build the DiskUsageRequest.

```APIDOC
## GET /_disk/usage

### Description
Retrieves disk usage information for the cluster.

### Method
GET

### Endpoint
/_disk/usage

### Parameters
#### Query Parameters
- **index** (string) - Optional - Filters the disk usage by index.

### Request Example
{
  "index": "my_index"
}

### Response
#### Success Response (200)
- **Free Disk Space** (string) - Available disk space in bytes.
- **Total Disk Space** (string) - Total disk space in bytes.
```

--------------------------------

### createImperative - ElasticsearchClient

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchClients

Creates a new imperative ElasticsearchClient with different configuration options.

```APIDOC
## Static Method createImperative

### Description
Creates a new imperative ElasticsearchClient with various configuration options.

### Method
Static

### Parameters
#### Transport Parameter
- **transport** (ElasticsearchTransport) - Required - The Elasticsearch transport to use

#### RestClient Parameter
- **restClient** (RestClient) - Required - The low-level REST client to use

#### Configuration Parameter
- **clientConfiguration** (ClientConfiguration) - Required - The client configuration to use

#### Optional Parameters
- **transportOptions** (TransportOptions) - Optional - Transport options to customize the client
- **jsonpMapper** (JsonpMapper) - Optional - JSON processor mapper for serialization

### Return Type
- **ElasticsearchClient** - The created imperative Elasticsearch client
```

--------------------------------

### GET /_exists

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint checks if an index exists. It allows for specifying a function to build the ExistsRequest.

```APIDOC
## GET /_exists

### Description
Checks if an index exists.

### Method
GET

### Endpoint
/_exists

### Parameters
#### Query Parameters
- **index** (string) - Required - The name of the index to check.

### Request Example
{
  "index": "my_index"
}

### Response
#### Success Response (200)
- **exists** (boolean) - Indicates whether the index exists.
```

--------------------------------

### GET /health

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/cluster/ReactiveClusterOperations

Retrieves the cluster's health status using reactive operations.

```APIDOC
## GET /health

### Description
Retrieves the cluster's health status using reactive operations.

### Method
GET

### Endpoint
/health

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **ClusterHealth** (Mono<ClusterHealth>) - Emits the health information for the cluster.

#### Response Example
```json
{
  "status": "green",
  "numberOfNodes": 3,
  "numberOfDataNodes": 3,
  "activePrimaryShards": 10,
  "activeShards": 30,
  "relocatingShards": 0,
  "initializingShards": 0,
  "unassignedShards": 0,
  "delayedUnassignedShards": 0,
  "number_of_pending_tasks": 0,
  "number_of_in_flight_fetch": 0,
  "task_max_waiting_in_queue": "0ms",
  "active_shards_percent_as_number": 100.0
}
```
```

--------------------------------

### Settings and Alias Management Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Methods for handling index settings creation, retrieval, aliases, and deprecated template operations.

```APIDOC
## createSettings()

### Description
Creates the index settings for the entity this IndexOperations is bound to.

### Method
Mono<Settings> createSettings()

### Parameters
None

### Return
A settings document.

### Since
4.1

## createSettings(Class<?> clazz)

### Description
Creates the index settings from the annotations on the given class.

### Method
Mono<Settings> createSettings(Class<?> clazz)

### Parameters
#### Request Body
- **clazz** (Class<?>) - Required - The class to create the index settings from.

### Return
A settings document.

### Since
4.1

## getSettings()

### Description
Get the settings for the index.

### Method
default Mono<Settings> getSettings()

### Parameters
None

### Return
A Mono with a Document containing the index settings.

## getSettings(boolean includeDefaults)

### Description
Get the settings for the index.

### Method
Mono<Settings> getSettings(boolean includeDefaults)

### Parameters
#### Query Parameters
- **includeDefaults** (boolean) - Required - Whether or not to include all the default settings.

### Return
A Mono with a Document containing the index settings.

## alias(AliasActions aliasActions)

### Description
Executes the given AliasActions.

### Method
Mono<Boolean> alias(AliasActions aliasActions)

### Parameters
#### Request Body
- **aliasActions** (AliasActions) - Required - The actions to execute.

### Return
If the operation is acknowledged by Elasticsearch.

### Since
4.1

## getAliases(String... aliasNames)

### Description
Gets information about aliases.

### Method
Mono<Map<String,Set<AliasData>>> getAliases(String... aliasNames)

### Parameters
#### Query Parameters
- **aliasNames** (String[]) - Required - Alias names, must not be null.

### Return
A Mono of Map from index names to AliasData for that index.

### Since
4.1

## getAliasesForIndex(String... indexNames)

### Description
Gets information about aliases for specific indices.

### Method
Mono<Map<String,Set<AliasData>>> getAliasesForIndex(String... indexNames)

### Parameters
#### Query Parameters
- **indexNames** (String[]) - Required - Index names, must not be null.

### Return
A Mono of Map from index names to AliasData for that index.

### Since
4.1

## putTemplate(PutTemplateRequest putTemplateRequest)

### Description
Deprecated. Since 5.1, as the underlying Elasticsearch API is deprecated. Creates an index template using the legacy Elasticsearch interface.

### Method
@Deprecated Mono<Boolean> putTemplate(PutTemplateRequest putTemplateRequest)

### Parameters
#### Request Body
- **putTemplateRequest** (PutTemplateRequest) - Required - Template request parameters.

### Return
True if successful.

### Deprecated
Since 5.1
```

--------------------------------

### Create repository instance

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/cdi/ElasticsearchRepositoryBean

Protected method to create repository instances. Overrides the create method from CdiRepositoryBean. Takes CreationalContext and repository type as parameters.

```java
protected T create(jakarta.enterprise.context.spi.CreationalContext<T> creationalContext, Class<T> repositoryType)
```

--------------------------------

### GET /_exists/template/{template}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint checks if a template exists. It allows for specifying a function to build the ExistsTemplateRequest.

```APIDOC
## GET /_exists/template/{template}

### Description
Checks if a template exists.

### Method
GET

### Endpoint
/_exists/template/{template}

### Parameters
#### Path Parameters
- **template** (string) - Required - The name of the template to check.

### Request Example
{
  "template": "my_template"
}

### Response
#### Success Response (200)
- **exists** (boolean) - Indicates whether the template exists.
```

--------------------------------

### GET /get

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Finds the document with the given ID mapped onto the given entity type.

```APIDOC
## GET /get

### Description
Find the document with the given ID mapped onto the given entity type.

### Method
GET

### Endpoint
/get

### Parameters
#### Query Parameters
- **id** (String) - Required - The _id of the document to fetch.
- **entityType** (Class<T>) - Required - The domain type used for mapping the document.

### Response
#### Success Response (200)
- **T** (Mono) - The document mapped to the given entity type. Returns `Mono.empty()` if not found.

### Since
4.0
```

--------------------------------

### GET /search/page

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint searches the index for entities matching the given query and returns a SearchPage object containing the results.

```APIDOC
## GET /search/page

### Description
This endpoint searches the index for entities matching the given query and returns a SearchPage object containing the results.

### Method
GET

### Endpoint
/search/page

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (Query) - Required - The Elasticsearch query to execute.
- **entityType** (Class<T>) - Required - The type of entity to return.
- **resultType** (Class<T>) - Required - The type of the result.
- **index** (IndexCoordinates) - Optional - The index to search.

### Request Example
{
  "query": {
    "match_all": {}
  },
  "entityType": "MyEntity",
  "resultType": "MyResultType"
}

### Response
#### Success Response (200)
- **SearchPage<T>** - Contains the search page results.
```

--------------------------------

### GET /<index>/_alias

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves aliases specifically for given index names.

```APIDOC
## GET /<index>/_alias

### Description
Gets information about aliases for specific indices.

### Method
GET

### Endpoint
/<index>/_alias/*

### Parameters
#### Path Parameters
- **index** (string array) - Required - Index names.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **aliases** (map) - Map from index names to sets of alias data.

#### Response Example
{
  "index1": {
    "aliases": {
      "alias1": {}
    }
  }
}
```

--------------------------------

### GET Mapping

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves mappings for specified indices. This endpoint can be called with or without a specific request.

```APIDOC
## GET /_mapping

### Description
Retrieves mappings for specified indices. This endpoint can be called with or without a specific request.

### Method
GET

### Endpoint
/_mapping

### Parameters
#### Request Body
- **request** (GetMappingRequest) - Optional - A request object specifying which indices to retrieve mappings for.

### Response
#### Success Response (200)
- **mappings** (Object) - A map of index names to their mappings.
```

--------------------------------

### Constructor for ReactiveElasticsearchClusterClient in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchClusterClient

Initializes a new instance of ReactiveElasticsearchClusterClient with specified transport and optional transport options. Dependencies include ElasticsearchTransport and TransportOptions.

```java
public ReactiveElasticsearchClusterClient(co.elastic.clients.transport.ElasticsearchTransport transport, @Nullable co.elastic.clients.transport.TransportOptions transportOptions)
```

--------------------------------

### Elasticsearch Index Settings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/Setting

Configure settings for Elasticsearch index creation, including the number of shards and replicas, refresh interval, and index store type.

```APIDOC
## GET /indices/{indexName}/_settings

### Description
Retrieves the settings for a specific Elasticsearch index.

### Method
GET

### Endpoint
/indices/{indexName}/_settings

### Parameters
#### Path Parameters
- **indexName** (string) - Required - The name of the index to retrieve settings for.

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **settings** (object) - Contains the index settings.
  - **index** (object)
    - **number_of_shards** (short) - The number of shards configured for the index.
    - **number_of_replicas** (short) - The number of replicas configured for the index.
    - **refresh_interval** (string) - The refresh interval for the index.
    - **index.store.type** (string) - The index storage type.

#### Response Example
{
  "settings": {
    "index": {
      "number_of_shards": "1",
      "number_of_replicas": "1",
      "refresh_interval": "1s",
      "index.store.type": "fs"
    }
  }
}

## PUT /indices/{indexName}/_settings

### Description
Updates settings for an existing Elasticsearch index. This includes dynamic settings like refresh interval and shards/replicas if supported by the Elasticsearch version.

### Method
PUT

### Endpoint
/indices/{indexName}/_settings

### Parameters
#### Path Parameters
- **indexName** (string) - Required - The name of the index to update settings for.

#### Request Body
- **index** (object) - Settings to update.
  - **refresh_interval** (string) - Optional - Refresh interval for the index. Example: "30s".
  - **number_of_replicas** (short) - Optional - Number of replicas for the index. Example: 2.
  - **number_of_shards** (short) - Optional - Number of shards for the index (Note: changing shards on an existing index might not be supported or have specific requirements).

### Request Example
```json
{
  "index": {
    "refresh_interval": "30s",
    "number_of_replicas": 2
  }
}
```

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Indicates if the settings update was acknowledged.

#### Response Example
```json
{
  "acknowledged": true
}
```

## POST /_settings/config/settingPath

### Description
Applies settings from a resource path for index creation or updates. This is typically used to load complex configurations from a file.

### Method
POST

### Endpoint
/_settings/config/{settingPath}

### Parameters
#### Path Parameters
- **settingPath** (string) - Required - The resource path to the settings configuration file.

### Request Example
(No request body is typically sent with this endpoint, the path parameter specifies the resource.)

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Indicates if the settings were applied.

#### Response Example
```json
{
  "acknowledged": true
}
```
```

--------------------------------

### matchAllQuery()

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Creates a Query to find all documents. This method must be implemented by concrete classes.

```APIDOC
## matchAllQuery()

### Description
Creates a `Query` to find all documents. Must be implemented by the concrete implementations to provide an appropriate query using the respective client.

### Method
Query matchAllQuery()

### Endpoint
matchAllQuery

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
matchAllQuery()

### Response
#### Success Response
- **Query** - A query to find all documents

#### Response Example
Query
```

--------------------------------

### suggest(Query query, Class<?> entityType, IndexCoordinates index)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Performs a suggest query on a specific index to get suggestion data.

```APIDOC
## suggest(Query query, Class<?> entityType, IndexCoordinates index)

### Description
Does a suggest query.

### Method
Mono<Suggest> suggest(Query query, Class<?> entityType, IndexCoordinates index)

### Endpoint
suggest

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **query** (Query) - Required - The Query containing the suggest definition, must not be null
- **entityType** (Class<?>) - Required - The type of the entities that might be returned for a completion suggestion, must not be null
- **index** (IndexCoordinates) - Required - The index to run the query against, must not be null

### Request Example
suggest(query, entityType, index)

### Response
#### Success Response (Mono)
- **Suggest** - A Mono emitting suggest data

#### Response Example
Mono<Suggest>
```

--------------------------------

### GET getTemplate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves an index template by name from Elasticsearch. This endpoint allows you to fetch existing index templates to inspect their configuration.

```APIDOC
## GET getTemplate

### Description
Retrieves an index template by name from Elasticsearch

### Method
GET

### Endpoint
/_index_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Name of the index template to retrieve

#### Query Parameters
- **include_version** (boolean) - Optional - Whether to include version information

### Request Example
{
  "name": "my_template"
}

### Response
#### Success Response (200)
- **index_template** (object) - The template definition
- **version** (number) - Template version

#### Response Example
{
  "index_template": {
    "index_patterns": ["logs-*"],
    "template": {
      "settings": {
        "number_of_shards": 1
      }
    }
  },
  "version": 1
}
```

--------------------------------

### createReactive - ReactiveElasticsearchClient

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchClients

Creates a new reactive ElasticsearchClient with different configuration options.

```APIDOC
## Static Method createReactive

### Description
Creates a new reactive ElasticsearchClient with various configuration options.

### Method
Static

### Parameters
#### Transport Parameter
- **transport** (ElasticsearchTransport) - Required - The Elasticsearch transport to use

#### RestClient Parameter
- **restClient** (RestClient) - Required - The low-level REST client to use

#### Configuration Parameter
- **clientConfiguration** (ClientConfiguration) - Required - The client configuration to use

#### Optional Parameters
- **transportOptions** (TransportOptions) - Optional - Transport options to customize the client
- **jsonpMapper** (JsonpMapper) - Optional - JSON processor mapper for serialization

### Return Type
- **ReactiveElasticsearchClient** - The created reactive Elasticsearch client
```

--------------------------------

### GET /shard_stores

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Provides store information for shard copies of indices. This helps diagnose shard allocation issues and understand data distribution.

```APIDOC
## GET /shard_stores

### Description
Provides store information for shard copies of indices. This helps diagnose shard allocation issues and understand data distribution.

### Method
GET

### Endpoint
/shard_stores

### Parameters
#### Request Body
- **request** (ShardStoresRequest) - Optional - Request object to filter shard store information

### Response
#### Success Response (200)
- **ShardStoresResponse** (object) - Response containing shard store information

#### Response Example
{
  "indices": {
    "index_name": {
      "shards": {}
    }
  }
}
```

--------------------------------

### PUT /_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Creates a legacy index template using the Elasticsearch legacy interface.

```APIDOC
## PUT /_template/{name}

### Description
Creates an index template using the legacy Elasticsearch interface.

### Method
PUT

### Endpoint
/_template/{name}

### Parameters
#### Request Body
- **template** (object) - Required - Template configuration including patterns, settings, and mappings.

### Request Example
{
  "index_patterns": ["test-*"],
  "settings": {
    "number_of_shards": 1
  }
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - True if successful.

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### Get Elasticsearch Index Templates (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Fetches index template definitions from Elasticsearch. Overloads include a request object, a builder function, or a default call. Returns a Mono of GetIndexTemplateResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetIndexTemplateResponse> getIndexTemplate(co.elastic.clients.elasticsearch.indices.GetIndexTemplateRequest request);
public Mono<co.elastic.clients.elasticsearch.indices.GetIndexTemplateResponse> getIndexTemplate(Function<co.elastic.clients.elasticsearch.indices.GetIndexTemplateRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.GetIndexTemplateRequest>> fn);
public Mono<co.elastic.clients.elasticsearch.indices.GetIndexTemplateResponse> getIndexTemplate();
```

--------------------------------

### ReactiveRepositorySearchTemplateQuery Constructor and Methods - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ReactiveRepositorySearchTemplateQuery

This Java code snippet showcases the constructor and key methods of the ReactiveRepositorySearchTemplateQuery class. It includes methods for retrieving query parameters, checking query types (count, delete, exists), creating Elasticsearch queries, and executing them. Dependencies include ReactiveElasticsearchQueryMethod, ReactiveElasticsearchOperations, and ValueExpressionDelegate.

```java
public class ReactiveRepositorySearchTemplateQuery extends Object

public ReactiveRepositorySearchTemplateQuery(ReactiveElasticsearchQueryMethod queryMethod, ReactiveElasticsearchOperations elasticsearchOperations, ValueExpressionDelegate valueExpressionDelegate, String id)

protected BaseQuery createQuery(ElasticsearchParametersParameterAccessor parameterAccessor)

public Object execute(Object[] parameters)

public String getId()

public Map<String,Object> getParams()

public boolean isCountQuery()

protected boolean isDeleteQuery()

protected boolean isExistsQuery()

protected ReactiveElasticsearchOperations getElasticsearchOperations()

protected MappingContext<? extends ElasticsearchPersistentEntity<?>,ElasticsearchPersistentProperty> getMappingContext()

public QueryMethod getQueryMethod()
```

--------------------------------

### Get Cluster Version

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Attempts to retrieve the version of the Elasticsearch cluster. Returns the version as a String.

```java
String
getClusterVersion()

```

--------------------------------

### GET /segments

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Provides low-level information about the segments in the shards of an index. This is useful for understanding index structure and performance optimization.

```APIDOC
## GET /segments

### Description
Provides low-level information about the segments in the shards of an index. This is useful for understanding index structure and performance optimization.

### Method
GET

### Endpoint
/segments

### Parameters
#### Request Body
- **request** (SegmentsRequest) - Optional - Request object to filter segment information

### Response
#### Success Response (200)
- **SegmentsResponse** (object) - Response containing segment information

#### Response Example
{
  "indices": {
    "index_name": {
      "shards": {}
    }
  }
}
```

--------------------------------

### POST /suggest

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint performs a suggest query.

```APIDOC
## POST /suggest

### Description
This endpoint performs a suggest query.

### Method
POST

### Endpoint
/suggest

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (Query) - Required - The Elasticsearch query to execute.
- **entityType** (Class<T>) - Optional - The type of entity to return.
- **index** (IndexCoordinates) - Optional - The index to search.

### Request Example
{
  "query": {
    "match": {
      "text": "search term"
    }
  },
  "entityType": "MyEntity"
}

### Response
#### Success Response (200)
- **Suggest** - Results of the suggest query.
```

--------------------------------

### GET /_exists/template/{template}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint checks if an index template exists. It allows for specifying a function to build the ExistsIndexTemplateRequest.

```APIDOC
## GET /_exists/template/{template}

### Description
Checks if an index template exists.

### Method
GET

### Endpoint
/_exists/template/{template}

### Parameters
#### Path Parameters
- **template** (string) - Required - The name of the index template to check.

### Request Example
{
  "template": "my_template"
}

### Response
#### Success Response (200)
- **exists** (boolean) - Indicates whether the index template exists.
```

--------------------------------

### GET Data Stream

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves information about data streams. This endpoint can be called with or without a specific request.

```APIDOC
## GET /_data_stream

### Description
Retrieves information about data streams. This endpoint can be called with or without a specific request.

### Method
GET

### Endpoint
/_data_stream

### Parameters
#### Request Body
- **request** (GetDataStreamRequest) - Optional - A request object specifying which data streams to retrieve.

### Response
#### Success Response (200)
- **data_streams** (Array) - An array of data stream information.
```

--------------------------------

### Enable Elasticsearch Repositories Configuration

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/config/EnableElasticsearchRepositories

Java annotation for enabling Elasticsearch repositories in Spring Data applications. Scans specified packages for repository interfaces and configures their creation. Supports package scanning, filters, and custom implementation postfixes.

```java
@Target(TYPE) @Retention(RUNTIME) @Documented @Inherited @Import(org.springframework.data.elasticsearch.repository.config.ElasticsearchRepositoriesRegistrar.class) public @interface EnableElasticsearchRepositories
```

--------------------------------

### Remote Class Builder Method in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/reindex/Remote

This Java code snippet demonstrates the static `builder` method of the `Remote` class. This method is used to initiate the construction of a `Remote` object, which represents a remote Elasticsearch connection. It requires the scheme, host, and port as parameters to start the configuration process.

```java
public static Remote.RemoteBuilder builder(String scheme, String host, int port)
```

--------------------------------

### Create ClientConfiguration with localhost (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/ClientConfiguration

Demonstrates creating a ClientConfiguration instance for localhost using the static localhost() method. The configuration is designed for simple Elasticsearch connections. It's a convenient shortcut for common deployment scenarios.

```Java
ClientConfiguration configuration = ClientConfiguration.localhost();
```

--------------------------------

### GET /_exists/{alias}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint checks if an alias exists. It allows for specifying a function to build the ExistsAliasRequest.

```APIDOC
## GET /_exists/{alias}

### Description
Checks if an alias exists.

### Method
GET

### Endpoint
/_exists/{alias}

### Parameters
#### Path Parameters
- **alias** (string) - Required - The name of the alias to check.

### Request Example
{
  "alias": "my_alias"
}

### Response
#### Success Response (200)
- **exists** (boolean) - Indicates whether the alias exists.
```

--------------------------------

### FetchSourceFilter Constructor and Methods (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/FetchSourceFilter

Provides the constructor and key methods for FetchSourceFilter, including methods to set fetch source, includes, and excludes. It also includes static factory methods for creating FetchSourceFilter instances.

```java
public FetchSourceFilter(@Nullable Boolean fetchSource, @Nullable String[] includes, @Nullable String[] excludes)
public static SourceFilter of(@Nullable Boolean fetchSource, @Nullable String[] includes, @Nullable String[] excludes)
public static SourceFilter of(Function<FetchSourceFilterBuilder,FetchSourceFilterBuilder> builderFunction)
public Boolean fetchSource()
public String[] getIncludes()
public String[] getExcludes()
```

--------------------------------

### get in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Finds a document by ID and maps it to the given entity type. Returns Mono.empty() if not found.

```java
public <T> Mono<T> get(String id, Class<T> entityType) {}
public <T> Mono<T> get(String id, Class<T> entityType, IndexCoordinates index) {}
// Usage
Mono<MyEntity> entityMono = reactiveElasticsearchTemplate.get("id1", MyEntity.class, indexCoordinates);
entityMono.subscribe(entity -> log.info("Entity: {}", entity));
```

--------------------------------

### Cookie Preferences

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/config/ElasticsearchAuditingBeanDefinitionParser

This outlines Broadcom's cookie preferences and user control options.

```APIDOC
## Cookie Preferences

### Description
Broadcom uses cookies and similar technologies to analyze site usage, improve user experience, and help with advertising. Users can manage their cookie preferences.

### Method
Web Interface

### Endpoint
N/A (User Interface)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
Displays cookie preferences and settings.

#### Response Example
N/A

```

--------------------------------

### Execute More Like This query in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Protected abstract entry point that concrete implementations use to execute MoreLikeThisQuery. Inputs: MoreLikeThisQuery; entity class; IndexCoordinates. Output: SearchHits<T>. Limitation: not intended for direct public use.

```java
protected abstract <T> SearchHits<T> doSearch(MoreLikeThisQuery query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### Reactive Client Creation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchClients

Static methods for creating ReactiveElasticsearchClient instances using ClientConfiguration, RestClient, or ElasticsearchTransport. These methods support different overloads for customization with transport options and JSON mappers. Used to establish reactive connections to Elasticsearch clusters.

```APIDOC
## createReactive (Various Overloads)

### Description
Creates a new ReactiveElasticsearchClient for reactive operations with Elasticsearch. Supports multiple factory methods with varying parameters for flexibility in configuration.

### Method
public static ReactiveElasticsearchClient

### Endpoint
createReactive(ClientConfiguration clientConfiguration)
createReactive(ClientConfiguration clientConfiguration, @Nullable co.elastic.clients.transport.TransportOptions transportOptions)
createReactive(ClientConfiguration clientConfiguration, @Nullable co.elastic.clients.transport.TransportOptions transportOptions, co.elastic.clients.json.JsonpMapper jsonpMapper)
createReactive(org.elasticsearch.client.RestClient restClient)
createReactive(org.elasticsearch.client.RestClient restClient, @Nullable co.elastic.clients.transport.TransportOptions transportOptions, co.elastic.clients.json.JsonpMapper jsonpMapper)
createReactive(co.elastic.clients.transport.ElasticsearchTransport transport)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A

### Response
#### Success Response
- Returns: ReactiveElasticsearchClient - The created reactive client instance.

#### Response Example
N/A

### Error Handling
Parameters like clientConfiguration must not be null; otherwise, an exception may be thrown.
```

--------------------------------

### GET /indices/mapping

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Retrieves the current mapping definition for an Elasticsearch index. Returns a Mono that emits the mapping document.

```APIDOC
## GET /indices/mapping

### Description
Retrieves the mapping definition for an Elasticsearch index.

### Method
GET

### Endpoint
/indices/mapping

### Parameters
#### Path Parameters
None

#### Query Parameters
- **clazz** (Class<?>) - Optional - Entity class to generate mapping for

#### Request Body
None

### Request Example
{}

### Response
#### Success Response (200)
- **mapping** (Document) - The index mapping configuration

#### Response Example
{
  "mapping": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "name": {
        "type": "text"
      }
    }
  }
}
```

--------------------------------

### Get Settings of Elasticsearch Index (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Obtains the settings configuration of one or more Elasticsearch indices. Overloads accept a GetIndicesSettingsRequest, a builder function, or no arguments for defaults. Returns a Mono of GetIndicesSettingsResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetIndicesSettingsResponse> getSettings(co.elastic.clients.elasticsearch.indices.GetIndicesSettingsRequest request);
public Mono<co.elastic.clients.elasticsearch.indices.GetIndicesSettingsResponse> getSettings(Function<co.elastic.clients.elasticsearch.indices.GetIndicesSettingsRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.GetIndicesSettingsRequest>> fn);
public Mono<co.elastic.clients.elasticsearch.indices.GetIndicesSettingsResponse> getSettings();
```

--------------------------------

### POST putIndexTemplate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Creates or updates an index template in Elasticsearch. Index templates define settings, mappings, and aliases that are automatically applied when creating new indices.

```APIDOC
## POST putIndexTemplate

### Description
Creates or updates an index template in Elasticsearch

### Method
POST

### Endpoint
/_index_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Name of the index template

#### Query Parameters
- **create** (boolean) - Optional - Whether to fail if template already exists

#### Request Body
- **index_patterns** (array) - Required - Patterns that match index names
- **template** (object) - Required - Template settings, mappings, and aliases
- **priority** (number) - Optional - Template priority
- **version** (number) - Optional - Template version

### Request Example
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "timestamp": {
          "type": "date"
        }
      }
    }
  }
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### HighlightCommonParametersBuilder API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/highlight/HighlightCommonParameters

This section details the methods available on the HighlightCommonParametersBuilder class for configuring highlight settings.

```APIDOC
## HighlightCommonParametersBuilder Configuration

This builder class allows for the configuration of common highlighting parameters.

### Methods

- **`withBoundaryChars(String boundaryChars)`**: Sets the characters to use as boundaries for highlighting.
- **`withBoundaryMaxScan(int boundaryMaxScan)`**: Sets the maximum scan length for boundary detection.
- **`withBoundaryScanner(String boundaryScanner)`**: Sets the boundary scanner type.
- **`withBoundaryScannerLocale(String boundaryScannerLocale)`**: Sets the locale for the boundary scanner.
- **`withForceSource(boolean forceSource)`**: Deprecated. Use with caution as functionality is deprecated in Elasticsearch 8.8+.
- **`withFragmenter(String fragmenter)`**: Sets the fragmenter type for highlighting.
- **`withFragmentSize(int fragmentSize)`**: Sets the size of each highlight fragment.
- **`withNoMatchSize(int noMatchSize)`**: Sets the size of the matched text when no fragments are generated.
- **`withNumberOfFragments(int numberOfFragments)`**: Sets the number of fragments to generate for each highlight.
- **`withHighlightQuery(Query highlightQuery)`**: Sets a specific query to use for highlighting.
- **`withOrder(String order)`**: Sets the order of highlighted fragments.
- **`withPhraseLimit(int phraseLimit)`**: Sets the limit for phrases within highlights.
- **`withPreTags(String... preTags)`**: Sets the tags to be prepended to highlighted text.
- **`withPostTags(String... postTags)`**: Sets the tags to be appended to highlighted text.
- **`withRequireFieldMatch(boolean requireFieldMatch)`**: Specifies whether a field match is required for highlighting.
- **`withType(String type)`**: Sets the highlighting type.
- **`build()`**: Builds and returns the `HighlightCommonParameters` object.
```

--------------------------------

### GET /_alias

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves alias information. This endpoint returns details about the specified alias, including the indices it maps to.

```APIDOC
## GET /_alias

### Description
Retrieves alias information.

### Method
GET

### Endpoint
/_alias

### Parameters
#### Path Parameters
- **alias** (string) - Required - The name of the alias to retrieve information for.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "alias": "my_alias"
  }
}

### Response
#### Success Response (200)
- **response** (object) - The response from the Elasticsearch server.
```

--------------------------------

### getRestClient

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchClients

Creates a low-level RestClient from the given configuration.

```APIDOC
## Static Method getRestClient

### Description
Creates a low-level RestClient from the given client configuration.

### Method
Static

### Parameters
- **clientConfiguration** (ClientConfiguration) - Required - The configuration for the client

### Return Type
- **RestClient** - The created low-level REST client
```

--------------------------------

### GET Field Mapping

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves field mappings for specified indices and fields. This endpoint requires a request object or a builder function.

```APIDOC
## GET /_mapping/field

### Description
Retrieves field mappings for specified indices and fields. This endpoint requires a request object or a builder function.

### Method
GET

### Endpoint
/_mapping/field

### Parameters
#### Request Body
- **request** (GetFieldMappingRequest) - Required - A request object specifying indices and fields.

### Response
#### Success Response (200)
- **mappings** (Object) - A map of field names to their mappings.
```

--------------------------------

### POST Promote Data Stream

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Promotes a data stream. This endpoint requires a request object or a builder function.

```APIDOC
## POST /_data_stream/_promote

### Description
Promotes a data stream. This endpoint requires a request object or a builder function.

### Method
POST

### Endpoint
/_data_stream/_promote

### Parameters
#### Request Body
- **request** (PromoteDataStreamRequest) - Required - A request object specifying the data stream to promote.

### Response
#### Success Response (200)
- **acknowledged** (Boolean) - Indicates whether the operation was successful.
```

--------------------------------

### GET /recovery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Returns information about ongoing and completed shard recoveries for one or more indices. This helps monitor recovery progress and diagnose issues.

```APIDOC
## GET /recovery

### Description
Returns information about ongoing and completed shard recoveries for one or more indices. This helps monitor recovery progress and diagnose issues.

### Method
GET

### Endpoint
/recovery

### Parameters
#### Request Body
- **request** (RecoveryRequest) - Optional - Request object to filter recovery information

### Response
#### Success Response (200)
- **RecoveryResponse** (object) - Response containing recovery status information

#### Response Example
{
  "indices": {
    "index_name": {
      "shards": []
    }
  }
}
```

--------------------------------

### GET /cluster/health

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ClusterTemplate

Retrieves the health status of the Elasticsearch cluster. This endpoint allows applications to monitor the overall health and stability of the cluster.

```APIDOC
## GET /cluster/health

### Description
Retrieves the health status of the Elasticsearch cluster.

### Method
GET

### Endpoint
/cluster/health

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
{
  "example": "N/A"
}

### Response
#### Success Response (200)
- **health** (ClusterHealth) - Information about the cluster's health status.

#### Response Example
{
  "example": "{\"status\":\"green\",\"node_count\":\"3\",\"timed_out\":\"false\"}"
}
```

--------------------------------

### GET Alias

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves aliases for specified indices. This endpoint allows querying aliases using a request builder function.

```APIDOC
## GET /_alias

### Description
Retrieves aliases for specified indices. This endpoint allows querying aliases using a request builder function.

### Method
GET

### Endpoint
/_alias

### Parameters
#### Request Body
- **fn** (Function) - Required - A function that builds a GetAliasRequest object.

### Response
#### Success Response (200)
- **aliases** (Object) - A map of index names to their aliases.
```

--------------------------------

### GET /resolve_index

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Resolves the names of indices, aliases, and data streams into their constituent parts. This helps understand how names map to actual resources.

```APIDOC
## GET /resolve_index

### Description
Resolves the names of indices, aliases, and data streams into their constituent parts. This helps understand how names map to actual resources.

### Method
GET

### Endpoint
/resolve_index

### Parameters
#### Request Body
- **request** (ResolveIndexRequest) - Required - Request object containing names to resolve

### Response
#### Success Response (200)
- **ResolveIndexResponse** (object) - Response containing resolved index information

#### Response Example
{
  "indices": [],
  "aliases": [],
  "data_streams": []
}
```

--------------------------------

### Get Mappings of Elasticsearch Index (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves the mapping definitions for an Elasticsearch index. Supports a GetMappingRequest, a builder lambda, or a parameter‑less invocation. Returns a Mono of GetMappingResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetMappingResponse> getMapping(co.elastic.clients.elasticsearch.indices.GetMappingRequest getMappingRequest);
public Mono<co.elastic.clients.elasticsearch.indices.GetMappingResponse> getMapping(Function<co.elastic.clients.elasticsearch.indices.GetMappingRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.GetMappingRequest>> fn);
public Mono<co.elastic.clients.elasticsearch.indices.GetMappingResponse> getMapping();
```

--------------------------------

### GET /indices/information

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

Retrieves the IndexInformation for specified indices. This endpoint is useful for inspecting the configuration and status of Elasticsearch indices managed by Spring Data.

```APIDOC
## GET /indices/information

### Description
Gets the `IndexInformation` for the indices defined by the provided index coordinates. This endpoint allows you to inspect the configuration and status of specific Elasticsearch indices.

### Method
GET

### Endpoint
`/indices/information`

### Parameters
#### Query Parameters
- **index** (IndexCoordinates) - Required - Defines the index names to get the information for.

### Response
#### Success Response (200)
- **List<IndexInformation>** - A list of `IndexInformation` objects.

#### Response Example
```json
[
  {
    "indexName": "my-index",
    "numberOfShards": 1,
    "numberOfReplicas": 0
  }
]
```
```

--------------------------------

### POST putTemplate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Creates or updates an index template in Elasticsearch (legacy API). This endpoint is maintained for backward compatibility but putIndexTemplate is preferred for new applications.

```APIDOC
## POST putTemplate

### Description
Creates or updates an index template in Elasticsearch (legacy API)

### Method
POST

### Endpoint
/_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Name of the index template

#### Query Parameters
None

#### Request Body
- **index_patterns** (array) - Required - Patterns that match index names
- **settings** (object) - Optional - Index settings
- **mappings** (object) - Optional - Field mappings
- **aliases** (object) - Optional - Index aliases

### Request Example
{
  "index_patterns": ["logs-*"],
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "timestamp": {
        "type": "date"
      }
    }
  }
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### Get Elasticsearch Search Templates (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves stored search templates from Elasticsearch. The method takes a GetTemplateRequest object. Returns a Mono of GetTemplateResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetTemplateResponse> getTemplate(co.elastic.clients.elasticsearch.indices.GetTemplateRequest request);
```

--------------------------------

### SimpleElasticsearchEntityMetadata Constructor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/SimpleElasticsearchEntityMetadata

Initializes a new instance of the SimpleElasticsearchEntityMetadata class. This constructor requires the entity's Java Class and its corresponding ElasticsearchPersistentEntity.

```java
public SimpleElasticsearchEntityMetadata(Class<T> type, ElasticsearchPersistentEntity<?> entity)
```

--------------------------------

### GET /indices/exists

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Checks if an Elasticsearch index exists. Returns a Mono that emits the existence status of the index.

```APIDOC
## GET /indices/exists

### Description
Checks if an Elasticsearch index exists using reactive programming.

### Method
GET

### Endpoint
/indices/exists

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{}

### Response
#### Success Response (200)
- **exists** (Boolean) - True if index exists, false otherwise

#### Response Example
{
  "exists": true
}
```

--------------------------------

### Index Creation and Management Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Methods for creating indices with optional settings and mappings, checking existence, and deleting indices. These operations return Mono for reactive handling and signal completion or errors.

```APIDOC
## create()

### Description
Create an index.

### Method
Mono<Boolean> create()

### Parameters
None

### Return
A Mono signalling successful operation completion or an error if the index already exists.

## create(Map<String,Object> settings)

### Description
Create an index with the specified settings.

### Method
Mono<Boolean> create(Map<String,Object> settings)

### Parameters
#### Request Body
- **settings** (Map<String,Object>) - Required - Index settings

### Return
A Mono signalling successful operation completion or an error if the index already exists.

## create(Map<String,Object> settings, Document mapping)

### Description
Create an index for given settings and mapping.

### Method
Mono<Boolean> create(Map<String,Object> settings, Document mapping)

### Parameters
#### Request Body
- **settings** (Map<String,Object>) - Required - The index settings
- **mapping** (Document) - Required - The index mapping

### Return
A Mono signalling successful operation completion or an error if the index already exists.

### Since
4.2

## createWithMapping()

### Description
Create an index with the settings and mapping defined for the entity this IndexOperations is bound to.

### Method
Mono<Boolean> createWithMapping()

### Parameters
None

### Return
A Mono signalling successful operation completion or an error if the index already exists.

### Since
4.2

## delete()

### Description
Delete an index.

### Method
Mono<Boolean> delete()

### Parameters
None

### Return
A Mono signalling operation completion or an error. If the index does not exist, a value of false is emitted.

## exists()

### Description
Checks if an index exists.

### Method
Mono<Boolean> exists()

### Parameters
None

### Return
A Mono with the result of the existence check.

## refresh()

### Description
Refresh the index(es) this IndexOperations is bound to.

### Method
Mono<Void> refresh()

### Parameters
None

### Return
A Mono signalling operation completion.
```

--------------------------------

### Get Index Information in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves IndexInformation for specified indices. Requires IndexCoordinates as input and returns a list of IndexInformation objects.

```Java
public List<IndexInformation> getInformation(IndexCoordinates indexCoordinates)
```

--------------------------------

### Indices Simulate Template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Simulates the effects of a template.

```APIDOC
## POST /_simulate_template

### Description
Simulates the effects of a template.

### Method
POST

### Endpoint
/_simulate_template

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "(builder -> builder.build())"
}

### Response
#### Success Response (200)
- **template** (object) - Simulated template information.
```

--------------------------------

### Get index templates

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Retrieves index template(s) using ReactiveIndexOperations. Takes a GetIndexTemplateRequest parameter and returns a Flux of TemplateResponse objects.

```java
public Flux<TemplateResponse> getIndexTemplate(GetIndexTemplateRequest getIndexTemplateRequest)
```

--------------------------------

### GET /index/coordinates

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

Retrieves the current IndexCoordinates. This is useful when index names are dynamically determined or when working with operations not bound to a specific entity class.

```APIDOC
## GET /index/coordinates

### Description
Gets the current `IndexCoordinates`. These may change over time when the entity class has a SpEL constructed index name. When this IndexOperations is not bound to a class, the bound IndexCoordinates are returned.

### Method
GET

### Endpoint
`/index/coordinates`

### Parameters
This endpoint does not accept any parameters.

### Response
#### Success Response (200)
- **IndexCoordinates** - The current index coordinates.

#### Response Example
```json
{
  "indexName": "dynamic-index",
  "className": "com.example.MyEntity"
}
```
```

--------------------------------

### Get SQL Query Configuration Parameters

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/SqlQuery

Shows how to retrieve configuration parameters from an SqlQuery instance. Methods follow a getter pattern and return nullable values for optional parameters. The query string is the only required parameter and is always non-null.

```java
// Retrieve query configuration
String query = sqlQuery.getQuery();
Integer fetchSize = sqlQuery.getFetchSize();
Duration requestTimeout = sqlQuery.getRequestTimeout();
Boolean allowPartialResults = sqlQuery.getAllowPartialSearchResults();
List<Object> params = sqlQuery.getParams();
```

--------------------------------

### Get index information

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Retrieves IndexInformation for indices defined by IndexCoordinates through ReactiveIndexOperations. Returns a Flux of IndexInformation objects.

```java
public Flux<IndexInformation> getInformation(IndexCoordinates index)
```

--------------------------------

### RepositoryStringQuery Constructor in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/RepositoryStringQuery

Constructor for RepositoryStringQuery class that initializes the query method, Elasticsearch operations, query string, and value expression delegate.

```Java
public RepositoryStringQuery(ElasticsearchQueryMethod queryMethod, ElasticsearchOperations elasticsearchOperations, String queryString, ValueExpressionDelegate valueExpressionDelegate)
```

--------------------------------

### matchAllQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

The matchAllQuery method creates a Query object to retrieve all documents in Elasticsearch. It is part of the ReactiveSearchOperations interface and must be implemented by concrete classes to use the appropriate client.

```APIDOC
## matchAllQuery

### Description
Creates a `Query` to find all documents. Must be implemented by the concrete implementations to provide an appropriate query using the respective client.

### Method Signature
public Query matchAllQuery()

### Parameters
None

### Returns
Query - a query to find all documents

### Response Example
A Query object representing a match-all query.
```

--------------------------------

### Create IndexQuery Builder in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/IndexQuery

Demonstrates the use of the builder method to create an IndexQuery object in Java. This is the preferred way to instantiate IndexQuery objects, allowing for a fluent and readable configuration.

```java
public static IndexQueryBuilder builder() 
```

--------------------------------

### IndicesTemplate Document Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Methods for creating and managing index mappings using the Document structure in IndicesTemplate

```APIDOC
## IndicesTemplate Document Methods

### Description
Methods for creating and managing index mappings using Document structure

### Methods
- `Document createMapping()`
- `Document createMapping(Class<?> clazz)`
- `boolean create(Map<String,Object> settings, Document mapping)`
- `boolean putMapping(Document mapping)`
- `protected boolean doCreate(IndexCoordinates indexCoordinates, Map<String,Object> settings, Document mapping)`
```

--------------------------------

### Get Component Template in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves a component template. Requires a GetComponentTemplateRequest object as input and returns a list of TemplateResponse objects, which may be empty.

```Java
public List<TemplateResponse> getComponentTemplate(GetComponentTemplateRequest getComponentTemplateRequest)
```

--------------------------------

### Get Index Coordinates for Class in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves IndexCoordinates for a specific class. Requires a Class object as input and returns IndexCoordinates.

```Java
public IndexCoordinates getIndexCoordinatesFor(Class<?> clazz)
```

--------------------------------

### Imperative Client Creation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchClients

Static methods for creating ElasticsearchClient (imperative) instances using ClientConfiguration, RestClient, or ElasticsearchTransport. Overloads allow specifying transport options and JSON mappers. These are used for synchronous operations with Elasticsearch.

```APIDOC
## createImperative (Various Overloads)

### Description
Creates a new imperative ElasticsearchClient for synchronous interactions with Elasticsearch. Multiple overloads provide options for configuration, transport, and mapping customization.

### Method
public static co.elastic.clients.elasticsearch.ElasticsearchClient or AutoCloseableElasticsearchClient

### Endpoint
createImperative(ClientConfiguration clientConfiguration)
createImperative(ClientConfiguration clientConfiguration, co.elastic.clients.transport.TransportOptions transportOptions)
createImperative(org.elasticsearch.client.RestClient restClient)
createImperative(org.elasticsearch.client.RestClient restClient, @Nullable co.elastic.clients.transport.TransportOptions transportOptions, co.elastic.clients.json.JsonpMapper jsonpMapper)
createImperative(co.elastic.clients.transport.ElasticsearchTransport transport)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
N/A

### Response
#### Success Response
- Returns: ElasticsearchClient - The created imperative client instance.

#### Response Example
N/A

### Error Handling
Parameters like clientConfiguration must not be null; otherwise, an exception may be thrown.
```

--------------------------------

### GET recovery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves recovery information for indices in Elasticsearch. This endpoint provides detailed information about shard recovery processes, including primary and replica shard recoveries.

```APIDOC
## GET recovery

### Description
Retrieves recovery information for indices in Elasticsearch

### Method
GET

### Endpoint
/{index}/_recovery

### Parameters
#### Path Parameters
- **index** (string) - Optional - Name of the index (returns all if not specified)

#### Query Parameters
- **detailed** (boolean) - Optional - Whether to include detailed information
- **active_only** (boolean) - Optional - Whether to show only active recoveries

### Request Example
{
  "index": "my-index"
}

### Response
#### Success Response (200)
- **{index}** (object) - Recovery information for the index
- **shards** (array) - List of shard recovery information

#### Response Example
{
  "my-index": {
    "shards": [
      {
        "id": 0,
        "type": "PEER",
        "stage": "DONE",
        "primary": true,
        "start_time_in_millis": 1234567890000
      }
    ]
  }
}
```

--------------------------------

### Create SQL Query with Builder Pattern

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/SqlQuery

Demonstrates how to create an SqlQuery instance using the builder pattern. The builder requires a SQL query string and allows configuration of various query parameters. This approach follows the fluent API design pattern for building complex Elasticsearch SQL queries.

```java
SqlQuery sqlQuery = SqlQuery.builder("SELECT * FROM products")
    .fetchSize(100)
    .requestTimeout(Duration.ofSeconds(30))
    .build();
```

--------------------------------

### ReactiveIndicesTemplate Document Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Reactive methods for creating and managing index mappings using the Document structure

```APIDOC
## ReactiveIndicesTemplate Document Methods

### Description
Reactive methods for document mapping operations

### Methods
- `Mono<Document> createMapping()`
- `Mono<Document> createMapping(Class<?> clazz)`
- `Mono<Document> getMapping()`
- `Mono<Boolean> create(Map<String,Object> settings, Document mapping)`
- `Mono<Boolean> putMapping(Mono<Document> mapping)`
```

--------------------------------

### Get Elasticsearch Index Information (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves details about one or more Elasticsearch indices, such as settings and mappings. Overloads accept a GetIndexRequest, a builder function, or no arguments for a default request. Returns a Mono of GetIndexResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetIndexResponse> get(co.elastic.clients.elasticsearch.indices.GetIndexRequest request);
public Mono<co.elastic.clients.elasticsearch.indices.GetIndexResponse> get(Function<co.elastic.clients.elasticsearch.indices.GetIndexRequest,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.GetIndexRequest>> fn);
```

--------------------------------

### Get index information with coordinates

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Retrieves IndexInformation for specified index coordinates. Returns a Flux of IndexInformation objects. Available since Spring Data Elasticsearch 4.2.

```Java
Flux<IndexInformation> getInformation(IndexCoordinates index)
```

--------------------------------

### Get Aliases for Class in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves aliases for a specific class. Requires a Class object as input and returns a Set of Alias objects.

```Java
public Set<Alias> getAliasesFor(Class<?> clazz)
```

--------------------------------

### Get Field Mappings of Elasticsearch Index (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retr field mapping definitions for one or more indices. Accepts a GetFieldMappingRequest or a builder lambda. Returns a Mono of GetFieldMappingResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetFieldMappingResponse> getFieldMapping(co.elastic.clients.elasticsearch.indices.GetFieldMappingRequest request);
public Mono<co.elastic.clients.elasticsearch.indices.GetFieldMappingResponse> getFieldMapping(Function<co.elastic.clients.elasticsearch.indices.GetFieldMappingRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.GetFieldMappingRequest>> fn);
```

--------------------------------

### Indices Simulate Index Template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Simulates applying an index template to an index. It can be called directly or with a builder function.

```APIDOC
## POST /_simulate_index_template

### Description
Simulates applying an index template to an index.

### Method
POST

### Endpoint
/_simulate_index_template

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **index_template** (string) - Required - The name of the index template.

### Request Example
{
  "index_template": "my-template"
}

### Response
#### Success Response (200)
- **template** (object) - Simulated template information.
```

--------------------------------

### Get index information (default)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Retrieves IndexInformation for indices defined by getIndexCoordinates(). Returns a Flux of IndexInformation objects. Available since Spring Data Elasticsearch 4.2.

```Java
default Flux<IndexInformation> getInformation()
```

--------------------------------

### PUT /template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Creates or updates a legacy index template. This is used for backward compatibility with older Elasticsearch versions.

```APIDOC
## PUT /template

### Description
Creates or updates a legacy index template. This is used for backward compatibility with older Elasticsearch versions.

### Method
PUT

### Endpoint
/template

### Parameters
#### Request Body
- **request** (PutTemplateRequest) - Required - Request object containing legacy template configuration

### Response
#### Success Response (200)
- **PutTemplateResponse** (object) - Response containing legacy template creation/update result

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### Get Indices Stats - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This snippet showcases the `stats` method for retrieving statistics about indices. It accepts an IndicesStatsRequest object or a Function to customize one, and returns an IndicesStatsResponse.

```java
public Mono<co.elastic.clients.elasticsearch.indices.IndicesStatsResponse> stats(co.elastic.clients.elasticsearch.indices.IndicesStatsRequest request)
```

```java
public Mono<co.elastic.clients.elasticsearch.indices.IndicesStatsResponse> stats(Function<co.elastic.clients.elasticsearch.indices.IndicesStatsRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.IndicesStatsRequest>> fn)
```

```java
public Mono<co.elastic.clients.elasticsearch.indices.IndicesStatsResponse> stats()
```

--------------------------------

### format Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/convert/NumberRangePropertyValueConverter

Documentation for the format method, which formats a Number object as a string.

```APIDOC
## format

### Description
Formats a Number object as a string.

### Method
protected String

### Endpoint
N/A

### Parameters
#### Path Parameters
- N/A

#### Query Parameters
- N/A

#### Request Body
- `number` (Number) - Required - The Number object to format.

### Request Example
N/A

### Response
#### Success Response (200)
- Return Value (String) - The formatted string representation of the Number.

#### Response Example
N/A
```

--------------------------------

### ReactiveIndicesTemplate Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

This section details the available methods for managing Elasticsearch indices using ReactiveIndicesTemplate.

```APIDOC
## Mono<Boolean> alias(AliasActions aliasActions)

### Description
Executes the given `AliasActions`.

### Method
Mono<Boolean>

### Endpoint
N/A

### Parameters
#### Path Parameters
- **aliasActions** (AliasActions) - Required - The AliasActions to execute.

### Request Example
{
  "aliasActions": {
    "index_name": "my_index",
    "add": {
      "new_alias": "my_alias"
    }
  }
}

### Response
#### Success Response (200)
- **result** (Boolean) - Indicates if the alias operation was successful.
```

```APIDOC
## Mono<Boolean> create()

### Description
Create an index.

### Method
Mono<Boolean>

### Endpoint
N/A

### Parameters
#### Path Parameters
None

### Request Example
{
  "index_name": "my_index"
}

### Response
#### Success Response (200)
- **result** (Boolean) - Indicates if the index creation was successful.
```

```APIDOC
## Mono<Boolean> create(Map<String,Object> settings)

### Description
Create an index with the specified settings.

### Method
Mono<Boolean>

### Endpoint
N/A

### Parameters
#### Path Parameters
- **settings** (Map<String,Object>) - Required - The index settings.

### Request Example
{
  "index_name": "my_index",
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}

### Response
#### Success Response (200)
- **result** (Boolean) - Indicates if the index creation was successful.
```

```APIDOC
## Mono<Document> createMapping()

### Description
Creates the index mapping for the entity this IndexOperations is bound to.

### Method
Mono<Document>

### Endpoint
N/A

### Parameters
#### Path Parameters
None

### Request Example
{
  "clazz": "com.example.MyEntity"
}

### Response
#### Success Response (200)
- **mapping** (Document) - The index mapping.
```

```APIDOC
## Mono<Boolean> delete()

### Description
Delete an index.

### Method
Mono<Boolean>

### Endpoint
N/A

### Parameters
#### Path Parameters
None

### Request Example
{
  "index_name": "my_index"
}

### Response
#### Success Response (200)
- **result** (Boolean) - Indicates if the index deletion was successful.
```

```APIDOC
## Mono<Boolean> exists()

### Description
checks if an index exists

### Method
Mono<Boolean>

### Endpoint
N/A

### Parameters
#### Path Parameters
None

### Request Example
{
  "index_name": "my_index"
}

### Response
#### Success Response (200)
- **result** (Boolean) - Indicates if the index exists.
```

```APIDOC
## Mono<Map<String,Set<AliasData>>> getAliases(String... aliasNames)

### Description
gets information about aliases

### Method
Mono<Map<String,Set<AliasData>>>

### Endpoint
N/A

### Parameters
#### Path Parameters
- **aliasNames** (String[]) - Optional - The alias names to retrieve.

### Request Example
{
  "aliasNames": ["alias1", "alias2"]
}

### Response
#### Success Response (200)
- **aliases** (Map<String,Set<AliasData>>) - Alias information.
```

```APIDOC
## Flux<TemplateResponse> getIndexTemplate(GetIndexTemplateRequest getIndexTemplateRequest)

### Description
Get index template(s).

### Method
Flux<TemplateResponse>

### Endpoint
N/A

### Parameters
#### Path Parameters
- **getIndexTemplateRequest** (GetIndexTemplateRequest) - Required - Request object.

### Request Example
{
  "name": "my_template"
}

### Response
#### Success Response (200)
- **templates** (Flux<TemplateResponse>) - The index templates.
```

```APIDOC
## Mono<Document> getMapping()

### Description
Get mapping for the index targeted defined by this `ReactiveIndexOperations`

### Method
Mono<Document>

### Endpoint
N/A

### Parameters
#### Path Parameters
None

### Request Example
{ }

### Response
#### Success Response (200)
- **mapping** (Document) - The index mapping.
```

--------------------------------

### Get repository scope

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/cdi/ElasticsearchRepositoryBean

Returns the scope of the repository bean. Implements BeanAttributes interface and overrides parent class method. Returns annotation class representing the scope.

```java
public Class<? extends Annotation> getScope()
```

--------------------------------

### Get alias name in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasData

Retrieves the alias name from an AliasData instance. This is a simple getter method for the alias property.

```Java
public String getAlias()
```

--------------------------------

### SearchDocumentAdapter Constructor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Initializes a new SearchDocumentAdapter with the provided document details including score, sort values, fields, highlight fields, and metadata.

```APIDOC
## Constructor

### SearchDocumentAdapter
public SearchDocumentAdapter(Document delegate, float score, Object[] sortValues, Map<String,List<Object>> fields, Map<String,List<String>> highlightFields, Map<String,SearchDocumentResponse> innerHits, @Nullable NestedMetaData nestedMetaData, @Nullable Explanation explanation, @Nullable List<String> matchedQueries, @Nullable String routing)
```

--------------------------------

### Get Current Index Coordinates in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Retrieves the current IndexCoordinates, which may change over time for SpEL constructed index names. Returns IndexCoordinates.

```Java
public IndexCoordinates getIndexCoordinates()
```

--------------------------------

### Index Template API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

APIs for managing index templates.

```APIDOC
## POST /_template
## POST /_index_template
## POST /_component_template

### Description
APIs for creating and managing index templates, including legacy templates, composable index templates, and component templates.

### Method
POST

### Endpoint
/_template
/_index_template
/_component_template

#### Parameters

##### Request Body
- **putTemplateRequest** (PutTemplateRequest) - Required for legacy templates.
- **putIndexTemplateRequest** (PutIndexTemplateRequest) - Required for index templates.
- **putComponentTemplateRequest** (PutComponentTemplateRequest) - Required for component templates.

### Response
#### Success Response (200)
- **boolean** - true if successful

#### Response Example
```json
{
  "acknowledged": true
}
```
```

--------------------------------

### Get expand wildcards setting in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Retrieves the expand wildcards setting from the query. This method returns an EnumSet of WildcardStates, specifying how wildcards in index names should be expanded.

```Java
public EnumSet<IndicesOptions.WildcardStates> getExpandWildcards()
```

--------------------------------

### hasAnnotatedHighlight Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks if there is a `Highlight` annotation present on the method.

```APIDOC
## Method

### Description
Checks if there is a `Highlight` annotation present on the method.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if there is a `Highlight` annotation present.

#### Response Example
N/A
```

--------------------------------

### StringObjectMap Map Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/DefaultStringObjectMap

Standard Map interface methods implemented by StringObjectMap. These include checking size and emptiness, key/value containment, getting, putting, removing elements, and bulk operations.

```java
public int size()
public boolean isEmpty()
public boolean containsKey(Object key)
public boolean containsValue(Object value)
public Object get(Object key)
public Object getOrDefault(Object key, Object defaultValue)
public Object put(String key, Object value)
public Object remove(Object key)
public void putAll(Map<? extends String,?> m)
public void clear()
```

--------------------------------

### builder() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

A static method that returns a Builder to create AliasActionParameters.

```APIDOC
## builder()

### Description
A static method that returns a Builder to create AliasActionParameters.

### Method
Static Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- N/A

#### Response Example
N/A
```

--------------------------------

### POST Suggest Query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/class-use/Suggest

Methods to execute suggestion queries against Elasticsearch indices

```APIDOC
## POST /_search

### Description
Executes a suggestion query against Elasticsearch indices

### Method
POST

### Endpoint
/_search

### Parameters
#### Request Body
- **query** (Query) - Required - The query containing suggestion definitions
- **entityType** (Class<?>) - Optional - The entity type for mapping results
- **index** (IndexCoordinates) - Optional - Specific index to search against

### Request Example
{
  "query": {
    "suggest": {
      "my_suggestion": {
        "text": "search term",
        "term": {
          "field": "content"
        }
      }
    }
  }
}

### Response
#### Success Response (200)
- **suggest** (Suggest) - Contains suggestion results from the query

#### Response Example
{
  "suggest": {
    "my_suggestion": [
      {
        "text": "search term",
        "offset": 0,
        "length": 10,
        "options": [
          {
            "text": "corrected term",
            "score": 0.8
          }
        ]
      }
    ]
  }
}
```

--------------------------------

### Get scripted fields from query in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Retrieves the list of scripted fields set on the query. This method returns a list of ScriptedField objects, which represent fields computed by scripts.

```Java
public List<ScriptedField> getScriptedFields()
```

--------------------------------

### Get Elasticsearch Data Streams (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Obtains information about existing data streams in Elasticsearch. Supports a request object, a builder function, or a parameter‑less call for default behavior. Returns a Mono of GetDataStreamResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetDataStreamResponse> getDataStream(co.elastic.clients.elasticsearch.indices.GetDataStreamRequest request);
public Mono<co.elastic.clients.elasticsearch.indices.GetDataStreamResponse> getDataStream(Function<co.elastic.clients.elasticsearch.indices.GetDataStreamRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.GetDataStreamRequest>> fn);
public Mono<co.elastic.clients.elasticsearch.indices.GetDataStreamResponse> getDataStream();
```

--------------------------------

### Get Index Name in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/IndexQuery

Shows how to retrieve the index name associated with the IndexQuery object. This method provides access to the index name that the query will be executed against.

```java
@Nullable public String getIndexName() 
```

--------------------------------

### Get current index coordinates

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Retrieves the current IndexCoordinates which may change over time for SpEL-constructed index names. Returns IndexCoordinates object. Available since Spring Data Elasticsearch 4.1.

```Java
IndexCoordinates getIndexCoordinates()
```

--------------------------------

### PUT /_index_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Creates a composable index template.

```APIDOC
## PUT /_index_template/{name}

### Description
Creates an index template for composable templates.

### Method
PUT

### Endpoint
/_index_template/{name}

### Parameters
#### Request Body
- **index_template** (object) - Required - Template configuration.

### Request Example
{
  "index_patterns": ["test-*"],
  "template": {
    "settings": {
      "number_of_shards": 1
    }
  }
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - True if successful.

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### Retrieve script from Elasticsearch cluster

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/ScriptOperations

Gets the script with the given name from the Elasticsearch cluster. Returns the Script object or null if the script does not exist. Requires the script name as input.

```Java
@Nullable Script getScript(String name)
```

--------------------------------

### Get allow no indices setting in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Retrieves the allow no indices setting from the query. This method is specified by the Query interface and returns a nullable Boolean indicating whether the query allows no indices.

```Java
@Nullable public Boolean getAllowNoIndices()
```

--------------------------------

### IndexOptions Enum

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/IndexOptions

Documentation for the IndexOptions enum, defining indexing options for Elasticsearch.

```APIDOC
## IndexOptions Enum

### Description
Defines indexing options for Elasticsearch. This enum specifies what data is indexed for a field.

### Method
Enum

### Endpoint
N/A (Enum Definition)

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- N/A

#### Response Example
N/A

#### Enum Constant Details
* ### none
public static final IndexOptions none
    * Description: No information is indexed.
* ### docs
public static final IndexOptions docs
    * Description: Only the terms are stored.
* ### freqs
public static final IndexOptions freqs
    * Description: Term frequencies are stored.
* ### positions
public static final IndexOptions positions
    * Description: Positions of terms in documents are stored.
* ### offsets
public static final IndexOptions offsets
    * Description: Offsets of terms in documents are stored.

#### Method Details
* ### values
public static IndexOptions[] values()
    * Description: Returns an array containing the constants of this enum class, in the order they are declared.
    * Returns: an array containing the constants of this enum class, in the order they are declared.
* ### valueOf
public static IndexOptions valueOf(String name)
    * Description: Returns the enum constant of this class with the specified name. The string must match _exactly_ an identifier used to declare an enum constant in this class. (Extraneous whitespace characters are not permitted.) 
    * Parameters:
        `name` - the name of the enum constant to be returned.
    * Returns: the enum constant with the specified name
    * Throws:
        `IllegalArgumentException` - if this enum class has no constant with the specified name     `NullPointerException` - if the argument is null
```

--------------------------------

### ComponentTemplateRequestData.Builder

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/ComponentTemplateRequestData

Builder class for constructing ComponentTemplateRequestData instances with settings, mappings, alias actions, and auto-create configuration.

```APIDOC
## ComponentTemplateRequestData.Builder

### Description
Builder class for constructing ComponentTemplateRequestData instances with various configuration options.

### Methods
#### withSettings
`public ComponentTemplateRequestData.Builder withSettings(Map<String,Object> settings)`

#### withMapping
`public ComponentTemplateRequestData.Builder withMapping(Document mapping)`

#### withAliasActions
`public ComponentTemplateRequestData.Builder withAliasActions(AliasActions aliasActions)`

#### withAllowAutoCreate
`public ComponentTemplateRequestData.Builder withAllowAutoCreate(@Nullable Boolean allowAutoCreate)`

#### build
`public ComponentTemplateRequestData build()`
```

--------------------------------

### Get Routing Value in SearchDocument Interface (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Defines a public method getRouting that returns a String representing the routing value for the document. Used in Spring Data Elasticsearch; takes no parameters and returns the routing value. As part of an interface, it has no implementation.

```Java
public String getRouting();
```

--------------------------------

### POST promoteDataStream

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Promotes a data stream to an index. This operation allows you to convert a data stream into a regular index for backup or migration purposes.

```APIDOC
## POST promoteDataStream

### Description
Promotes a data stream to an index

### Method
POST

### Endpoint
/_data_stream/{name}/_promote

### Parameters
#### Path Parameters
- **name** (string) - Required - Name of the data stream to promote

#### Query Parameters
None

### Request Example
{
  "name": "logs-stream"
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged
- **shards_acknowledged** (boolean) - Whether shards were acknowledged

#### Response Example
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```

--------------------------------

### Get Index Name (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchEntityMetadata

The `getIndexName()` method retrieves the name of the Elasticsearch index associated with the entity. This method is part of the ElasticsearchEntityMetadata interface. No input parameters, returns a String representing the index name.

```Java
String getIndexName();
```

--------------------------------

### IndexOperations Document Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Core methods for index mapping operations using Document structure

```APIDOC
## IndexOperations Document Methods

### Description
Core methods for index mapping operations

### Methods
- `Document createMapping()`
- `Document createMapping(Class<?> clazz)`
- `boolean create(Map<String,Object> settings, Document mapping)`
- `boolean putMapping(Document mapping)`
- `protected <T> Document maybeCallbackAfterLoad(Document document, Class<T> type, IndexCoordinates indexCoordinates)`
```

--------------------------------

### Get request size from query in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Retrieves the request size from the query, indicating the number of documents to request from Elasticsearch. The size depends on whether a Pageable and/or maxResult size is set on the query.

```Java
public Integer getRequestSize()
```

--------------------------------

### Mapping API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

APIs for managing index mappings.

```APIDOC
## POST /indices/{indexName}/_mapping

### Description
APIs for creating and updating index mappings.

### Method
POST

### Endpoint
/indices/{indexName}/_mapping

#### Parameters

##### Request Body
- **mapping** (Document) - Required - The Document with the mapping definitions.
- **clazz** (Class<?>) - Optional - The class to create a mapping for.

### Response
#### Success Response (200)
- **boolean** - true if the mapping could be stored or created

#### Response Example
```json
{
  "acknowledged": true
}
```
```

--------------------------------

### Using SortBy Enum Constants - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/SortBy

Examples showing how to use SortBy enum constants for sorting suggest responses. Demonstrates accessing enum constants directly and using static methods for dynamic constant resolution. The SCORE constant sorts by relevance while FREQUENCY sorts by occurrence count.

```java
// Direct access to enum constants
SortBy scoreSort = SortBy.SCORE;
SortBy frequencySort = SortBy.FREQUENCY;

// Using the values() method to get all constants
SortBy[] allSortOptions = SortBy.values();
System.out.println("Available sort options:");
for (SortBy option : allSortOptions) {
    System.out.println("- " + option);
}

// Using valueOf() method for dynamic constant resolution
String sortType = "SCORE";
SortBy dynamicSort = SortBy.valueOf(sortType);

// Example usage in suggest response processing
public void processSuggestions(List<String> suggestions, SortBy sortBy) {
    switch (sortBy) {
        case SCORE:
            // Sort by relevance score
            suggestions.sort(Comparator.comparing(s -> getScoreForSuggestion(s)));
            break;
        case FREQUENCY:
            // Sort by frequency/count
            suggestions.sort(Comparator.comparing(s -> getFrequencyForSuggestion(s)));
            break;
    }
}

// Convert enum constant to string
String sortByString = SortBy.SCORE.toString(); // Returns "SCORE"
String sortByName = SortBy.SCORE.name(); // Returns "SCORE"
```

--------------------------------

### Get search routing in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasData

Retrieves the search routing value for the alias. Returns null if no search routing is specified. This controls which shards are searched when using the alias.

```Java
@Nullable public String getSearchRouting()
```

--------------------------------

### builderForTemplate() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

A static method that returns a Builder for creating AliasActionParameters specifically for index templates.

```APIDOC
## builderForTemplate()

### Description
A Builder to create AliasActionParameters to be used when creating index templates. Automatically sets the index name to an empty string as this is not used in templates.

### Method
Static Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- N/A

#### Response Example
N/A
```

--------------------------------

### Get index routing in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasData

Retrieves the index routing value for the alias. Returns null if no index routing is specified. This controls which shard a document is routed to for indexing operations.

```Java
@Nullable public String getIndexRouting()
```

--------------------------------

### Get document by id (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Fetches a single document from Elasticsearch using its id, the target entity class, and the index coordinates. Returns the deserialized entity or null if not found. Uses the DocumentOperations contract.

```Java
@Nullable public <T> T get(String id, Class<T clazz, IndexCoordinates index)
```

--------------------------------

### Java CompletionSuggestion Constructor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/CompletionSuggestion

This shows the constructor for the CompletionSuggestion class in Java, taking the suggestion name, size, and a list of entries as input. It is used to create instances of CompletionSuggestion objects for representing completion suggestions from Elasticsearch.

```java
public CompletionSuggestion(String name, int size, List<CompletionSuggestion.Entry<T>> entries)
```

--------------------------------

### Get filter query in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasData

Retrieves the filter query associated with the alias. Returns null if no filter query is set. This query is used to filter documents when the alias is used.

```Java
@Nullable public Query getFilterQuery()
```

--------------------------------

### getDefaultSettings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Returns the default settings for an index.

```APIDOC
## GET /settings

### Description
Returns the default settings for an index.

### Method
GET

### Endpoint
/settings

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
{
  "example": "N/A"
}

### Response
#### Success Response (200)
- **settings** (Settings) - The default settings for the index.

#### Response Example
{
  "settings": { }
}
```

--------------------------------

### ReactiveIndexOperations Document Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Reactive version of index mapping operations using Document structure

```APIDOC
## ReactiveIndexOperations Document Methods

### Description
Reactive methods for index mapping operations

### Methods
- `Mono<Document> createMapping()`
- `Mono<Document> createMapping(Class<?> clazz)`
- `Mono<Document> getMapping()`
- `Mono<Boolean> create(Map<String,Object> settings, Document mapping)`
- `protected <T> Mono<Document> maybeCallbackAfterLoad(Document document, Class<T> type, IndexCoordinates index)`
```

--------------------------------

### Get doc value fields in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Retrieves the list of doc value fields set on the query. This method returns a possibly empty list of DocValueField objects, which are used to specify fields for doc value retrieval.

```Java
public List<DocValueField> getDocValueFields()
```

--------------------------------

### UpdateQuery.Builder API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/UpdateQuery

Methods for constructing and configuring UpdateQuery instances in Spring Data Elasticsearch.

```APIDOC
## UpdateQuery.Builder API

### Description
Builder class for constructing UpdateQuery instances used in Spring Data Elasticsearch operations.

### Methods
- `static UpdateQuery.Builder builder(String id)` - Creates a builder with the given document ID
- `static UpdateQuery.Builder builder(Query query)` - Creates a builder with the given query
- `UpdateQuery.Builder withAbortOnVersionConflict(Boolean abortOnVersionConflict)` - Sets abort on version conflict flag
- `UpdateQuery.Builder withBatchSize(Integer batchSize)` - Sets batch size
- `UpdateQuery.Builder withDocAsUpsert(Boolean docAsUpsert)` - Sets doc-as-upsert flag
- `UpdateQuery.Builder withDocument(Document document)` - Sets document to update
- `UpdateQuery.Builder withFetchSource(Boolean fetchSource)` - Sets fetch source flag
- `UpdateQuery.Builder withFetchSourceExcludes(List<String> fetchSourceExcludes)` - Sets fetch source excludes
- `UpdateQuery.Builder withFetchSourceIncludes(List<String> fetchSourceIncludes)` - Sets fetch source includes
- `UpdateQuery.Builder withIfPrimaryTerm(Integer ifPrimaryTerm)` - Sets if primary term
- `UpdateQuery.Builder withIfSeqNo(Integer ifSeqNo)` - Sets if sequence number
- `UpdateQuery.Builder withIndex(String indexName)` - Sets index name
- `UpdateQuery.Builder withLang(String lang)` - Sets script language
- `UpdateQuery.Builder withMaxDocs(Integer maxDocs)` - Sets maximum documents
- `UpdateQuery.Builder withMaxRetries(Integer maxRetries)` - Sets maximum retries
- `UpdateQuery.Builder withParams(Map<String,Object> params)` - Sets parameters
- `UpdateQuery.Builder withPipeline(String pipeline)` - Sets pipeline
- `UpdateQuery.Builder withRefreshPolicy(RefreshPolicy refreshPolicy)` - Sets refresh policy
- `UpdateQuery.Builder withRequestsPerSecond(Float requestsPerSecond)` - Sets requests per second
- `UpdateQuery.Builder withRetryOnConflict(Integer retryOnConflict)` - Sets retry on conflict
- `UpdateQuery.Builder withRouting(String routing)` - Sets routing
- `UpdateQuery.Builder withScript(String script)` - Sets script
- `UpdateQuery.Builder withScriptedUpsert(Boolean scriptedUpsert)` - Sets scripted upsert flag
- `UpdateQuery.Builder withScriptName(String scriptName)` - Sets script name
- `UpdateQuery.Builder withScriptType(ScriptType scriptType)` - Sets script type
- `UpdateQuery.Builder withShouldStoreResult(Boolean shouldStoreResult)` - Sets should store result flag
- `UpdateQuery.Builder withSlices(Integer slices)` - Sets slices
- `UpdateQuery.Builder withTimeout(String timeout)` - Sets timeout
- `UpdateQuery.Builder withUpsert(Document upsert)` - Sets upsert document
- `UpdateQuery.Builder withWaitForActiveShards(String waitForActiveShards)` - Sets wait for active shards
```

--------------------------------

### Get entity by ID from Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Retrieves an object from Elasticsearch by its ID. The index is specified either through the entity's Document annotation or explicitly via IndexCoordinates. Returns the entity of the specified type or null if not found.

```java
@Nullable <T> T get(String id, Class<T> clazz)
```

```java
@Nullable <T> T get(String id, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### execute

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

The execute method runs a callback with the ReactiveElasticsearchClient, providing exception translation. It is a generic method that returns the callback result as a Publisher.

```APIDOC
## execute

### Description
Execute a callback with the `ReactiveElasticsearchClient` and provide exception translation.

### Method Signature
public <T> Publisher<T> execute(ReactiveElasticsearchTemplate.ClientCallback<Publisher<T>> callback)

### Type Parameters
- **T** - the type returned from the callback

### Parameters
- **callback** (ReactiveElasticsearchTemplate.ClientCallback<Publisher<T>>) - Required - the callback to execute, must not be null

### Returns
Publisher<T> - the callback result

### Response Example
A Publisher<T> emitting the result of the executed callback.
```

--------------------------------

### PUT /index_template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Creates or updates an index template. Index templates define settings, mappings, and aliases that can be applied automatically to new indices.

```APIDOC
## PUT /index_template

### Description
Creates or updates an index template. Index templates define settings, mappings, and aliases that can be applied automatically to new indices.

### Method
PUT

### Endpoint
/index_template

### Parameters
#### Request Body
- **request** (PutIndexTemplateRequest) - Required - Request object containing template configuration

### Response
#### Success Response (200)
- **PutIndexTemplateResponse** (object) - Response containing template creation/update result

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### POST /search/multi

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint executes the multi search query against Elasticsearch and returns the result as a List of SearchHits.

```APIDOC
## POST /search/multi

### Description
This endpoint executes the multi search query against Elasticsearch and returns the result as a List of SearchHits.

### Method
POST

### Endpoint
/search/multi

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **queries** (List<? extends Query>) - Required - A list of Elasticsearch queries to execute.
- **classes** (List<Class<?>>) - Required - A list of classes representing the types of results for each query.
- **index** (IndexCoordinates) - Optional - The index to search.

### Request Example
{
  "queries": [
    {"match_all": {}},
    {"term": {"field": "value"}}
  ],
  "classes": [MyEntity.class, AnotherEntity.class]
}

### Response
#### Success Response (200)
- **List<SearchHits<T>>** - A list containing the results of each search query.
```

--------------------------------

### CompletionField Annotation Details

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/CompletionField

Provides information about the CompletionField annotation, its purpose, and its configurable elements, based on Elasticsearch completion suggester documentation.

```APIDOC
## `@CompletionField` Annotation

This annotation is used to define a field for Elasticsearch completion suggesters.

### Purpose

Enables type-ahead or auto-completion functionality for search queries by indexing data in a way that facilitates fast prefix-based suggestions.

### Based on

* Elasticsearch Completion Suggester Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-completion.html

### Optional Element Summary

| Modifier and Type        | Optional Element           | Description                                                                      |
| ------------------------ | -------------------------- | -------------------------------------------------------------------------------- |
| `String`                 | `analyzer`                 | The analyzer to use for the indexed completion data.                             |
| `CompletionContext[]`    | `contexts`                 | Defines contexts for filtering suggestions.                                      |
| `int`                    | `maxInputLength`           | The maximum length of the input string to consider for suggestions.              |
| `boolean`                | `preservePositionIncrements` | Whether to preserve position increments when analyzing the input.              |
| `boolean`                | `preserveSeparators`       | Whether to preserve separators during analysis.                                  |
| `String`                 | `searchAnalyzer`           | The analyzer to use for searching within the completion data.                    |

### Element Details

*   **`searchAnalyzer`**
    *   Type: `String`
    *   Default: `"simple"`
    *   Description: The analyzer used when searching against the completion field.

*   **`analyzer`**
    *   Type: `String`
    *   Default: `"simple"`
    *   Description: The analyzer used when indexing data into the completion field.

*   **`preserveSeparators`**
    *   Type: `boolean`
    *   Default: `true`
    *   Description: Controls whether separator characters are preserved during analysis.

*   **`preservePositionIncrements`**
    *   Type: `boolean`
    *   Default: `true`
    *   Description: Determines if position increments are maintained during the analysis process.

*   **`maxInputLength`**
    *   Type: `int`
    *   Default: `50`
    *   Description: Sets the maximum length of the user's input that the suggester will process.

*   **`contexts`**
    *   Type: `CompletionContext[]`
    *   Default: `{}`
    *   Description: An array of `CompletionContext` objects used for providing contextual filtering for suggestions.
```

--------------------------------

### Suggest.Suggestion.Entry Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/Suggest.Suggestion

This abstract class represents an entry in a suggestion response. It includes details like text, offset, length, and a list of options. It is extended by specific suggestion types like CompletionSuggestion.Entry, PhraseSuggestion.Entry, and TermSuggestion.Entry.

```APIDOC
## Suggest.Suggestion.Entry

### Description
Represents an entry in a suggestion response, containing text, offset, length, and a list of options.

### Class Declaration
```java
public abstract static class Suggest.Suggestion.Entry<O extends Suggest.Suggestion.Entry.Option> extends Object
```

### Constructor
#### Entry
```java
Entry(String text, int offset, int length, List<O> options)
```
- **text** (String) - Required - The text of the suggestion entry.
- **offset** (int) - Required - The start offset of the text.
- **length** (int) - Required - The length of the text.
- **options** (List<O>) - Required - The list of options for the suggestion.

### Methods
#### getText
```java
public String getText()
```
Returns the text of the suggestion entry.

#### getOffset
```java
public int getOffset()
```
Returns the start offset of the text.

#### getLength
```java
public int getLength()
```
Returns the length of the text.

#### getOptions
```java
public List<O> getOptions()
```
Returns the list of options for the suggestion.

### Nested Classes
- `Suggest.Suggestion.Entry.Option` - Represents an option within a suggestion entry.

### Direct Known Subclasses
- `CompletionSuggestion.Entry`
- `PhraseSuggestion.Entry`
- `TermSuggestion.Entry`
```

--------------------------------

### Index Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/package-use

Defines the operations related to managing Elasticsearch indexes, including creation, deletion, mapping, and settings.

```APIDOC
## IndexOperations

### Description
The operations for the Elasticsearch Index APIs, enabling the management of index settings, mappings, and aliases.

### Method
N/A (Interface Definition)

### Endpoint
N/A (Interface Definition)

### Parameters
N/A (Interface Definition)

### Request Example
N/A (Interface Definition)

### Response
N/A (Interface Definition)
```

--------------------------------

### Create ScriptData Record (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/ScriptData

Demonstrates creating an instance of the ScriptData record class with specified parameters. This record stores script metadata for execution in Elasticsearch.

```Java
public record ScriptData(ScriptType type, String language, String script, String scriptName, Map<String,Object> params) extends Record {
  // Record definition
}
```

```Java
ScriptData scriptData = new ScriptData(ScriptType.INLINE, "javascript", "// script", "myScript", Map.of("param1", "value1"));
```

--------------------------------

### getAnnotatedHighlightQuery Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Retrieves a `HighlightQuery` built from the `Highlight` annotation.

```APIDOC
## Method

### Description
Retrieves a `HighlightQuery` built from the `Highlight` annotation.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
- **highlightConverter** (HighlightConverter) - Required - Converter for highlighting.

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (HighlightQuery) - A `HighlightQuery` built from the `Highlight` annotation.

#### Response Example
N/A
```

--------------------------------

### Create a match_all query to retrieve all documents in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Generates a Query object that matches all documents in the target index. No parameters are required. Returns a Query instance representing the match_all operation.

```Java
Query matchAllQuery();
```

--------------------------------

### idsQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/Queries

Constructs an IdsQuery from a list of IDs.

```APIDOC
## POST /queries/idsQuery

### Description
Creates an IdsQuery from a list of IDs.

### Method
POST

### Endpoint
/queries/idsQuery

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **ids** (List<String>) - Required - A list of IDs.

### Request Example
{
  "ids": ["id1", "id2", "id3"]
}

### Response
#### Success Response (200)
- `query` (co.elastic.clients.elasticsearch._types.query_dsl.IdsQuery) - The constructed IdsQuery object.

#### Response Example
{
  "query": {
    "ids": ["id1", "id2", "id3"]
  }
}
```

--------------------------------

### POST /api/searchForHits

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Performs a search and returns ReactiveSearchHits containing information about the search results.

```APIDOC
## POST /api/searchForHits

### Description
Perform a search and return the `ReactiveSearchHits` which contains information about the search results.

### Method
POST

### Endpoint
/api/searchForHits

### Parameters
#### Request Body
- **query** (Query) - Required - The query to match documents.
- **entityType** (Class<?>) - Required - The entity type for mapping the query.
- **resultType** (Class<T>) - Optional - The projection result type.

### Request Example
{
  "query": {},
  "entityType": "com.example.Entity",
  "resultType": "com.example.Result"
}

### Response
#### Success Response (200)
- **hits** (ReactiveSearchHits<T>) - A Mono emitting the `ReactiveSearchHits` that contains the search result information.

#### Response Example
{
  "hits": {
    "totalHits": 1,
    "searchHits": [
      {
        "id": "1",
        "content": {
          "field1": "value1",
          "field2": "value2"
        }
      }
    ]
  }
}
```

--------------------------------

### Execute a multi‑get request

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Retrieves multiple documents matching the provided Query and maps them to the specified class type. Returns a Flux of MultiGetItem objects containing the fetched entities. All parameters must be supplied.

```java
public <T> Flux<MultiGetItem<T>> multiGet(Query query, Class<T> clazz, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Create a BaseQueryBuilder with IDs set in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Constructs a BaseQueryBuilder instance having the provided IDs set as a parameter. No other builder properties are configured. Returns the configured BaseQueryBuilder.

```Java
BaseQueryBuilder queryBuilderWithIds(List<String> ids);
```

--------------------------------

### Create ClientConfiguration with host and port (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/ClientConfiguration

Shows how to create a ClientConfiguration instance using a specified host and port string.  This method provides flexibility in specifying the Elasticsearch endpoint. This approach allows for easy configuration of various Elasticsearch clusters.

```Java
ClientConfiguration configuration = ClientConfiguration.create("localhost:9200");
```

--------------------------------

### PUT /settings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Updates the settings of an existing index. This includes both static and dynamic settings that control index behavior.

```APIDOC
## PUT /settings

### Description
Updates the settings of an existing index. This includes both static and dynamic settings that control index behavior.

### Method
PUT

### Endpoint
/settings

### Parameters
#### Request Body
- **request** (PutIndicesSettingsRequest) - Optional - Request object containing settings updates

### Response
#### Success Response (200)
- **PutIndicesSettingsResponse** (object) - Response containing settings update result

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### SearchHitSupport API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitSupport

Provides utility methods for handling SearchHit objects within Spring Data Elasticsearch.

```APIDOC
## SearchHitSupport Class

### Description
Utility class with helper methods for working with `SearchHit`.

### Package
`org.springframework.data.elasticsearch.core`

### Since
4.0

## Method Summary

### `static <T> SearchPage<T> searchPageFor(SearchHits<T> searchHits, Pageable pageable)`

Creates a `SearchPage` from `SearchHits` and `Pageable` information.

- **searchHits** (`SearchHits<T>`): The search hits to convert.
- **pageable** (`Pageable`): The pagination information.

### `static Object unwrapSearchHits(Object result)`

Unwraps the data contained in a `SearchHit` for different types containing `SearchHit` objects if possible.

- **result** (`Object`): The object, list, or page containing `SearchHit` objects.

Returns:
- A corresponding object where the `SearchHits` are replaced by their content if possible, otherwise the original object.
```

--------------------------------

### POST /reactive-elasticsearch/reindex

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Copies documents from a source index to a destination index.

```APIDOC
## POST /reactive-elasticsearch/reindex

### Description
Copies documents from a source index to a destination index.

### Method
POST

### Endpoint
/reactive-elasticsearch/reindex

### Parameters
#### Request Body
- **reindexRequest** (ReindexRequest) - Required - Parameters for the reindex operation.

### Request Example
{
  "source": {"index": "source-index"},
  "dest": {"index": "dest-index"}
}

### Response
#### Success Response (200)
- **reindexResponse** (ReindexResponse) - Details of the reindex process.

### Response Example
{
  "took": "45ms",
  "total": 100,
  "created": 100,
  "updated": 0,
  "batches": 1,
  "failures": []
}
```

--------------------------------

### ElasticsearchEntityInformationCreatorImpl API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/support/ElasticsearchEntityInformationCreatorImpl

Provides methods for creating and retrieving Elasticsearch entity information.

```APIDOC
## Constructor: ElasticsearchEntityInformationCreatorImpl

### Description
Constructs an instance of ElasticsearchEntityInformationCreatorImpl.

### Method
`ElasticsearchEntityInformationCreatorImpl`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
* **mappingContext** (MappingContext<? extends ElasticsearchPersistentEntity<?>, ElasticsearchPersistentProperty>) - Required - The mapping context for Elasticsearch entities.

### Request Example
```json
{
  "mappingContext": { /* ... mapping context details ... */ }
}
```

### Response
#### Success Response (200)
* **ElasticsearchEntityInformationCreatorImpl** - An instance of the creator.

#### Response Example
```json
{
  "creatorInstance": "org.springframework.data.elasticsearch.repository.support.ElasticsearchEntityInformationCreatorImpl"
}
```

---

## GET /getEntityInformation

### Description
Retrieves the Elasticsearch entity information for a given domain class.

### Method
GET

### Endpoint
`/getEntityInformation`

### Parameters
#### Path Parameters
None

#### Query Parameters
* **domainClass** (Class<T>) - Required - The domain class for which to retrieve entity information.

#### Request Body
None

### Request Example
(Not applicable for GET requests without a request body)

### Response
#### Success Response (200)
* **ElasticsearchEntityInformation<T, ID>** - The entity information for the specified domain class.

#### Response Example
```json
{
  "entityType": "com.example.MyEntity",
  "idType": "java.lang.String",
  "indexName": "my_entity_index"
}
```
```

--------------------------------

### POST /reactive-elasticsearch/bulkUpdate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Executes bulk update operations for multiple update queries.

```APIDOC
## POST /reactive-elasticsearch/bulkUpdate

### Description
Bulk update all objects.

### Method
POST

### Endpoint
/reactive-elasticsearch/bulkUpdate

### Parameters
#### Request Body
- **queries** (List<UpdateQuery>) - Required - List of update queries to execute.
- **bulkOptions** (BulkOptions) - Optional - Options for the bulk request.
- **index** (String) - Required - Target index.

### Request Example
{
  "queries": [{"id": "1", "doc": {"field": "value1"}}, {"id": "2", "doc": {"field": "value2"}}],
  "bulkOptions": {"refresh": true},
  "index": "my-index"
}

### Response
#### Success Response (200)
- **void** - No content returned on successful bulk update.

### Response Example
null
```

--------------------------------

### POST /api/searchForPage

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Searches the index for entities matching the given query and returns them in a SearchPage.

```APIDOC
## POST /api/searchForPage

### Description
Search the index for entities matching the given `query` and return them in a `SearchPage`.

### Method
POST

### Endpoint
/api/searchForPage

### Parameters
#### Request Body
- **query** (Query) - Required - The query to match documents.
- **entityType** (Class<?>) - Required - The entity type for mapping the query.
- **resultType** (Class<T>) - Optional - The projection result type.
- **index** (IndexCoordinates) - Optional - The target index.

### Request Example
{
  "query": {},
  "entityType": "com.example.Entity",
  "resultType": "com.example.Result",
  "index": "example_index"
}

### Response
#### Success Response (200)
- **page** (SearchPage<T>) - A Mono emitting matching entities in a `SearchPage`.

#### Response Example
{
  "page": {
    "content": [
      {
        "id": "1",
        "content": {
          "field1": "value1",
          "field2": "value2"
        }
      }
    ],
    "totalElements": 1
  }
}
```

--------------------------------

### BulkFailureException Details

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/BulkFailureException

This section details the BulkFailureException class, its purpose, constructors, and methods, specifically focusing on handling failures during bulk operations in Elasticsearch.

```APIDOC
## Class: BulkFailureException

### Description
Represents an exception that occurs when a bulk operation in Elasticsearch encounters failures for one or more documents.

### Class Hierarchy
`java.lang.Object` > `java.lang.Throwable` > `java.lang.Exception` > `java.lang.RuntimeException` > `org.springframework.core.NestedRuntimeException` > `org.springframework.dao.DataAccessException` > `org.springframework.dao.NonTransientDataAccessException` > `org.springframework.dao.DataRetrievalFailureException` > `org.springframework.data.elasticsearch.BulkFailureException`

### Constructors

#### `BulkFailureException(String msg, Map<String,BulkFailureException.FailureDetails> failedDocuments)`
Constructor for `BulkFailureException`.

*   **msg** (String) - The detail message.
*   **failedDocuments** (Map<String, BulkFailureException.FailureDetails>) - A map containing details of the documents that failed during the bulk operation. The key is typically the document ID.

### Methods

#### `getFailedDocuments()`
Returns a map containing details about the documents that failed during the bulk operation.

*   **Returns**: `Map<String, BulkFailureException.FailureDetails>` - A map where keys are document identifiers and values are `FailureDetails` objects.

### Nested Classes

#### `static final record BulkFailureException.FailureDetails`
Details about a document saving failure.

*   **Error**: (String) - The error message associated with the failure.
*   **Status**: (Integer) - The HTTP status code returned for the failure.
```

--------------------------------

### Document.create()

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Creates a new mutable Document. This is the primary method for constructing a Document object.

```APIDOC
## POST /_elasticsearch/document/create

### Description
Creates a new mutable `Document`.

### Method
POST

### Endpoint
/_elasticsearch/document/create

### Parameters
#### None

### Request Example
{
}

### Response
#### Success Response (200)
- **document** (object) - The newly created Document.
```

--------------------------------

### Initialize Suggest Response with Typed Collections

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/class-use/Suggest.Suggestion.Entry

Constructor pattern for Suggest response objects accepting lists of typed suggestion objects. Includes flag for tracking score document presence.

```java
public Suggest(List<Suggest.Suggestion<? extends Suggest.Suggestion.Entry<? extends Suggest.Suggestion.Entry.Option>>> suggestions, boolean hasScoreDocs) {}
```

--------------------------------

### Alias API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

APIs for managing index aliases.

```APIDOC
## POST /indices/_alias
## GET /indices/{indexName}/_alias

### Description
APIs for executing alias actions and retrieving alias information.

### Method
POST, GET

### Endpoint
/indices/_alias
/indices/{indexName}/_alias

#### Parameters

##### Request Body (for POST)
- **aliasActions** (AliasActions) - Required - The actions to execute.

##### Query Parameters (for GET)
- **aliasNames** (String...) - Required - Alias names to retrieve information for.

### Response
#### Success Response (200)
- **boolean** - true if the operation is acknowledged by Elasticsearch (for POST).
- **Map<String,Set<AliasData>>** - A Map from index names to AliasData for that index (for GET).

#### Response Example (POST)
```json
{
  "acknowledged": true
}
```
#### Response Example (GET)
```json
{
  "my-index": [
    {
      "alias": "my-alias"
    }
  ]
}
```
```

--------------------------------

### getBuilderWithMatchAllQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/Queries

This method provides a builder with a MatchAll Query for use in Elasticsearch queries.

```APIDOC
## GET /queries/matchAll

### Description
Returns a BaseQueryBuilder with a MatchAll query.

### Method
GET

### Endpoint
/queries/matchAll

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": "None"
}

### Response
#### Success Response (200)
- `builder` (BaseQueryBuilder) - The BaseQueryBuilder object.

#### Response Example
{
  "builder": "example_builder"
}
```

--------------------------------

### Execute suggest query and retrieve suggestions in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Performs a suggest query based on the provided Query and entity type, optionally scoped to a specific index. Returns a Mono containing Suggest data. Parameters must not be null.

```Java
Mono<Suggest> suggest(Query query, Class<?> entityType);
```

```Java
Mono<Suggest> suggest(Query query, Class<?> entityType, IndexCoordinates index);
```

--------------------------------

### POST /submitReindex

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Submits a reindex task asynchronously.

```APIDOC
## POST /submitReindex

### Description
Submits a reindex task asynchronously.

### Method
POST

### Endpoint
/submitReindex

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **reindexRequest** (object) - Required - Reindex request parameters

### Request Example
{
  "reindexRequest": {
    "sourceIndex": "source_index",
    "destinationIndex": "destination_index"
  }
}

### Response
#### Success Response (200)
- **Mono<String>** - Description: A `Mono` emitting the task id.

#### Response Example
{
  "taskId": "task_id"
}
```

--------------------------------

### ReactiveElasticsearchTemplate.doFindForResponse

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/SearchDocumentResponse

This method performs a reactive search query and returns a SearchDocumentResponse.

```APIDOC
## POST /api/search

### Description
Performs a reactive search query and returns a SearchDocumentResponse.

### Method
POST

### Endpoint
/api/search

### Parameters
#### Query Parameters
- **query** (Query) - Required - The search query to execute.
- **clazz** (Class<?>) - Required - The class type to map the results to.
- **index** (IndexCoordinates) - Required - The index coordinates to search in.

### Request Example
{
  "query": {
    "match_all": {}
  },
  "clazz": "com.example.Entity",
  "index": "example_index"
}

### Response
#### Success Response (200)
- **SearchDocumentResponse** (Mono<SearchDocumentResponse>) - The search response containing the results.

#### Response Example
{
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "hits": [
      {
        "_source": {
          "id": "1",
          "name": "Example Entity"
        }
      }
    ]
  }
}
```

--------------------------------

### POST /indices/create

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Creates a new Elasticsearch index. Returns a Mono that emits true on successful creation or emits an error if the index already exists.

```APIDOC
## POST /indices/create

### Description
Creates a new Elasticsearch index using reactive programming patterns.

### Method
POST

### Endpoint
/indices/create

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **settings** (Map<String,Object>) - Optional - Index settings configuration
- **mapping** (Document) - Optional - Index mapping definition

### Request Example
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mapping": {
    "properties": {
      "field1": {
        "type": "text"
      }
    }
  }
}

### Response
#### Success Response (200)
- **result** (Boolean) - True if index was created successfully

#### Response Example
{
  "result": true
}
```

--------------------------------

### Execute single document search with SearchOne (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchOperations

Provides a method to execute a Query and return the first matching document as a SearchHit. Requires the query, target entity class, and optional index coordinates. Returns the first found object or null if none.

```Java
@Nullable default <T> SearchHit<T> searchOne(Query query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### POST /_reindex

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Copies documents from a source index to a destination index, optionally transforming them.

```APIDOC
## POST /_reindex

### Description
Creates a reindex task that copies documents from a source index to a destination index, optionally applying a script or query.

### Method
POST

### Endpoint
/_reindex

### Request Body
- **source** (object) - Required - Source index definition.
- **dest** (object) - Required - Destination index definition.
- **script** (object) - Optional - Script to transform documents.

### Request Example
{
  "source": { "index": "old-index" },
  "dest": { "index": "new-index" }
}

### Response
#### Success Response (200)
- **task** (string) - Identifier of the asynchronous reindex task.

### Response Example
{
  "task": "12345",
  "created": 1000,
  "updated": 0,
  "deleted": 0,
  "batches": 1,
  "version_conflicts": 0,
  "noops": 0,
  "retries": { "bulk": 0, "search": 0 },
  "throttled_millis": 0,
  "requests_per_second": -1,
  "throttled_until_millis": 0,
  "total": 1000,
  "updated": 0,
  "created": 1000,
  "deleted": 0,
  "batches": 1,
  "version_conflicts": 0,
  "failures": []
}
```

--------------------------------

### Elasticsearch Builder Configuration Methods in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQueryBuilder

These methods form a fluent builder pattern for Elasticsearch queries, allowing configuration of runtime fields, rescorer queries, point-in-time snapshots, reactive batch sizes, index options, doc value fields, and scripted fields. They require non-null inputs where specified and return the builder instance (SELF) for chaining. The build method constructs the final query object. Methods are versioned from 4.3 to 5.1, with dependencies on Spring Data Elasticsearch libraries.

```Java
`idsWithRouting` - list of id values, must not be null 

Since: 4.3
* ### withRuntimeFields
public SELF withRuntimeFields(List<RuntimeField> runtimeFields)
* ### withRescorerQueries
public SELF withRescorerQueries(List<RescorerQuery> rescorerQueries)
* ### withRescorerQuery
public SELF withRescorerQuery(RescorerQuery rescorerQuery)
* ### withPointInTime
public SELF withPointInTime(@Nullable Query.PointInTime pointInTime) 

Since: 5.0
* ### withReactiveBatchSize
public SELF withReactiveBatchSize(@Nullable Integer reactiveBatchSize) 

Since: 5.1
* ### withAllowNoIndices
public SELF withAllowNoIndices(@Nullable Boolean allowNoIndices)
* ### withExpandWildcards
public SELF withExpandWildcards(EnumSet<IndicesOptions.WildcardStates> expandWildcards)
* ### withDocValueFields
public SELF withDocValueFields(List<DocValueField> docValueFields) 

Since: 5.1
* ### withScriptedField
public SELF withScriptedField(ScriptedField scriptedField)
* ### build
public abstract Q build()
```

--------------------------------

### ScriptData Builder Pattern (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/ScriptData

Illustrates using the builder pattern to construct a ScriptData record instance.  This provides a more fluent and readable way to set the record's attributes.

```Java
ScriptData.Builder builder = ScriptData.builder();
builder.type(ScriptType.SEARCH)
       .language("javascript")
       .script("// Script to execute")
       .scriptName("MyCustomScript")
       .params(Map.of("key1", "value1"));
ScriptData scriptData = builder.build();
```

--------------------------------

### POST Migrate to Data Stream

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Migrates an index to a data stream. This endpoint requires a request object or a builder function.

```APIDOC
## POST /_data_stream/_migrate

### Description
Migrates an index to a data stream. This endpoint requires a request object or a builder function.

### Method
POST

### Endpoint
/_data_stream/_migrate

### Parameters
#### Request Body
- **request** (MigrateToDataStreamRequest) - Required - A request object specifying the index to migrate.

### Response
#### Success Response (200)
- **acknowledged** (Boolean) - Indicates whether the operation was successful.
```

--------------------------------

### PUT /api/elasticsearch/index-templates

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/class-use/PutIndexTemplateRequest

Documentation for using PutIndexTemplateRequest.Builder to configure index templates in Elasticsearch via Spring Data Elasticsearch. Demonstrates how to set alias actions, composed templates, index patterns, mappings, name, and settings.

```APIDOC
```java
PutIndexTemplateRequest.Builder builder = PutIndexTemplateRequest.builder()
  .withName(\"template_1\")
  .withIndexPatterns(\"log-*\")
  .withMapping(mapping)
  .withSettings(settings)
  .withAliasActions(aliasActions);
```

```

--------------------------------

### getHighlightFields Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the highlight fields for the search hit.

```APIDOC
## Method

### getHighlightFields
public Map<String,List<String>> getHighlightFields()

### Description
Returns the highlight fields for the search hit.

### Returns
- A map of highlight field names to their values.
```

--------------------------------

### search SqlQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

The search method executes an SQL query against Elasticsearch and returns results as an SqlResponse. It is part of the ReactiveSqlOperations interface.

```APIDOC
## search

### Description
Execute the sql `query` against elasticsearch and return result as `SqlResponse`

### Method Signature
public Mono<SqlResponse> search(SqlQuery query)

### Parameters
- **query** (SqlQuery) - Required - the query to execute

### Returns
Mono<SqlResponse> - `SqlResponse` containing the list of found objects

### Response Example
A Mono emitting an SqlResponse with the SQL query results.
```

--------------------------------

### Create Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to create an Elasticsearch index reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.CreateIndexResponse> create(co.elastic.clients.elasticsearch.indices.CreateIndexRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.CreateIndexResponse> create(Function<co.elastic.clients.elasticsearch.indices.CreateIndexRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.CreateIndexRequest>> fn)
```

--------------------------------

### ReactiveIndexOperations.putMapping(Mono<Document> mapping)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Writes a mapping to the index. This endpoint utilizes a Mono<Document> to define the desired mapping configuration.

```APIDOC
## PUT /index/_mapping

### Description
Writes a mapping to the index using a Mono<Document>.

### Method
PUT

### Endpoint
/index/_mapping

### Parameters
#### Path Parameters
- **index** (string) - Required - The name of the index to apply the mapping to.

#### Request Body
- **mapping** (Mono<Document>) - Required - A Mono containing the mapping definition as a Document.

### Request Example
{
  "mapping": "{\"properties\": { \"field1\": { \"type\": \"text\" }}}"
}

### Response
#### Success Response (200)
- **mapping** (object) - The applied mapping.
```

--------------------------------

### SearchFailureBuilder Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/ByQueryResponse.SearchFailure

This section details the methods available on the SearchFailureBuilder class for constructing SearchFailure objects.

```APIDOC
## `ByQueryResponse.SearchFailure.SearchFailureBuilder`

Builder for `ByQueryResponse.SearchFailure`

### Methods

#### `build()`

- **Method**: `build()`
- **Description**: Constructs a `ByQueryResponse.SearchFailure` object.
- **Returns**: `ByQueryResponse.SearchFailure`

#### `withIndex(String index)`

- **Method**: `withIndex(String index)`
- **Description**: Sets the index for the search failure.
- **Parameters**:
  - **index** (String) - Required - The index where the failure occurred.
- **Returns**: `ByQueryResponse.SearchFailureBuilder`

#### `withNodeId(String nodeId)`

- **Method**: `withNodeId(String nodeId)`
- **Description**: Sets the node ID where the failure occurred.
- **Parameters**:
  - **nodeId** (String) - Required - The ID of the node.
- **Returns**: `ByQueryResponse.SearchFailureBuilder`

#### `withReason(Throwable reason)`

- **Method**: `withReason(Throwable reason)`
- **Description**: Sets the cause of the search failure.
- **Parameters**:
  - **reason** (Throwable) - Required - The exception or error that caused the failure.
- **Returns**: `ByQueryResponse.SearchFailureBuilder`

#### `withShardId(Integer shardId)`

- **Method**: `withShardId(Integer shardId)`
- **Description**: Sets the shard ID where the failure occurred.
- **Parameters**:
  - **shardId** (Integer) - Required - The ID of the shard.
- **Returns**: `ByQueryResponse.SearchFailureBuilder`

#### `withStatus(Integer status)`

- **Method**: `withStatus(Integer status)`
- **Description**: Sets the HTTP status code associated with the failure.
- **Parameters**:
  - **status** (Integer) - Required - The status code.
- **Returns**: `ByQueryResponse.SearchFailureBuilder`
```

--------------------------------

### NoReachableHostException Constructors

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/NoReachableHostException

Details the constructors available for the NoReachableHostException class, used when no Elasticsearch hosts are reachable.

```APIDOC
## NoReachableHostException

### Description
`NoReachableHostException` is a `RuntimeException` that is thrown when none of the known Elasticsearch nodes are reachable, indicating that the cluster is down.

### Constructors

#### NoReachableHostException(Set<ElasticsearchHost> hosts)
- **Description**: Constructs a new `NoReachableHostException` with the specified set of unreachable hosts.
- **Parameters**:
  - **hosts** (`Set<ElasticsearchHost>`) - Required - The set of Elasticsearch hosts that are unreachable.

#### NoReachableHostException(Set<ElasticsearchHost> hosts, Throwable cause)
- **Description**: Constructs a new `NoReachableHostException` with the specified set of unreachable hosts and a root cause.
- **Parameters**:
  - **hosts** (`Set<ElasticsearchHost>`) - Required - The set of Elasticsearch hosts that are unreachable.
  - **cause** (`Throwable`) - Required - The underlying cause of the exception.

### Since
3.2

### Author
Christoph Strobl
```

--------------------------------

### POST /{index}/_bulk

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Performs bulk indexing, updating, or deleting of multiple documents in a single request.

```APIDOC
## POST /{index}/_bulk

### Description
Executes bulk operations (index, update, delete) for a list of documents against the specified Elasticsearch index.

### Method
POST

### Endpoint
/{index}/_bulk

### Parameters
#### Path Parameters
- **index** (string) - Required - Target Elasticsearch index.

#### Request Body
- **operations** (array) - Required - List of bulk actions following the Elasticsearch bulk API format.

### Request Example
{ "index" : { "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_id" : "2" } }

### Response
#### Success Response (200)
- **items** (array) - Result of each operation.

### Response Example
{
  "took": 30,
  "errors": false,
  "items": [
    { "index": { "_id": "1", "result": "created" } },
    { "delete": { "_id": "2", "result": "deleted" } }
  ]
}
```

--------------------------------

### getBuilderWithTermQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/Queries

This method provides a builder with a Term Query for use in Elasticsearch queries.

```APIDOC
## GET /queries/termQuery

### Description
Returns a BaseQueryBuilder with a Term Query, given a field and value.

### Method
GET

### Endpoint
/queries/termQuery?field={field}&value={value}

### Parameters
#### Path Parameters
None

#### Query Parameters
- **field** (String) - Required - The field name for the term query.
- **value** (String) - Required - The value for the term query.

#### Request Body
None

### Request Example
{
  "field": "example_field",
  "value": "example_value"
}

### Response
#### Success Response (200)
- `builder` (BaseQueryBuilder) - The BaseQueryBuilder object.

#### Response Example
{
  "builder": "example_builder"
}
```

--------------------------------

### Create copy of ElasticsearchTemplate instance (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Provides a protected method to create a copy of the current ElasticsearchTemplate. This is useful for customizing routing or other settings without altering the original instance. Returns a new AbstractElasticsearchTemplate object.

```Java
protected AbstractElasticsearchTemplate doCopy()
```

--------------------------------

### Define ExistsIndexTemplateRequest record and its methods in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/ExistsIndexTemplateRequest

Provides the constructor and accessor methods for the ExistsIndexTemplateRequest record used in Spring Data Elasticsearch. The record includes a single component `templateName`. No external dependencies beyond Java records. Returns the template name and standard Object methods.

```Java
public record ExistsIndexTemplateRequest(String templateName) {
    // Constructor (implicit)
    public ExistsIndexTemplateRequest(String templateName) {
        this.templateName = templateName;
    }
    
    public String templateName() {
        return this.templateName;
    }
    
    @Override
    public StringString() {
        return "ExistsIndexTemplateRequest[templateName=" + templateName + "]";
    }
    
    @Override
    public boolean equals(Object o) {
        return (this == o) || (o instanceof ExistsIndexTemplateRequest that &&
                java.util.Objects.equals(this.templateName, that.templateName));
    }
    
    @Override
    public int hashCode() {
        return java.util.Objects.hash(templateName);
    }
}
```

--------------------------------

### POST /api/search

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Searches the index for entities matching the given query and returns them wrapped in SearchHit objects.

```APIDOC
## POST /api/search

### Description
Search the index for entities matching the given `query`.

### Method
POST

### Endpoint
/api/search

### Parameters
#### Request Body
- **query** (Query) - Required - The query to match documents.
- **entityType** (Class<?>) - Required - The entity type for mapping the query.
- **returnType** (Class<T>) - Optional - The mapping target type.
- **index** (IndexCoordinates) - Optional - The target index.

### Request Example
{
  "query": {},
  "entityType": "com.example.Entity",
  "returnType": "com.example.Result",
  "index": "example_index"
}

### Response
#### Success Response (200)
- **hits** (Flux<SearchHit<T>>) - A Flux emitting matching entities one by one wrapped in a `SearchHit`.

#### Response Example
{
  "hits": [
    {
      "id": "1",
      "content": {
        "field1": "value1",
        "field2": "value2"
      }
    }
  ]
}
```

--------------------------------

### Search Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/package-use

Interface for executing search queries against Elasticsearch and retrieving search results.

```APIDOC
## SearchOperations

### Description
The operations for the Elasticsearch Document APIs, specifically focused on executing search queries and retrieving results.

### Method
N/A (Interface Definition)

### Endpoint
N/A (Interface Definition)

### Parameters
N/A (Interface Definition)

### Request Example
N/A (Interface Definition)

### Response
N/A (Interface Definition)
```

--------------------------------

### AbstractElasticsearchTemplate Class Definition

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

The abstract class AbstractElasticsearchTemplate implements the ElasticsearchOperations interface, providing a foundation for Elasticsearch data access. It is designed to be client-agnostic, allowing for different Elasticsearch client libraries to be used. It should not contain client-specific imports.

```java
public abstract class AbstractElasticsearchTemplate extends Object implements ElasticsearchOperations, ApplicationContextAware {
    // ... fields, constructors, and methods ...
}
```

--------------------------------

### POST /api/sql/search

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/sql/SqlOperations

Executes a SQL query against Elasticsearch and returns the results as a SqlResponse object.

```APIDOC
## POST /api/sql/search

### Description
Execute the sql `query` against elasticsearch and return result as `SqlResponse`.

### Method
POST

### Endpoint
/api/sql/search

### Parameters
#### Request Body
- **query** (SqlQuery) - Required - The SQL query to execute.

### Request Example
{
  "query": "SELECT * FROM index_name"
}

### Response
#### Success Response (200)
- **SqlResponse** (Object) - Contains the list of found objects.

#### Response Example
{
  "columns": [
    {
      "name": "field1",
      "type": "text"
    }
  ],
  "rows": [
    {
      "field1": "value1"
    }
  ]
}
```

--------------------------------

### createQuery Method in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/RepositoryStringQuery

Protected method to create a query using the provided parameter accessor. Returns a BaseQuery object.

```Java
protected BaseQuery createQuery(ElasticsearchParametersParameterAccessor parameterAccessor)
```

--------------------------------

### getRouting() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the routing value.

```APIDOC
## getRouting()

### Description
Retrieves the routing value.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **routing** (String) - The routing value.

#### Response Example
N/A
```

--------------------------------

### Constructors and Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/NativeQuery

NativeQuery provides constructors and methods to build and access Elasticsearch queries.

```APIDOC
## Constructors

### NativeQuery

#### Description
Constructs a NativeQuery using a NativeQueryBuilder.

#### Method
Constructor

#### Parameters
- **builder** (NativeQueryBuilder) - Required - The builder used to construct the query.

---

### NativeQuery

#### Description
Constructs a NativeQuery using an Elasticsearch query DSL object.

#### Method
Constructor

#### Parameters
- **query** (co.elastic.clients.elasticsearch._types.query_dsl.Query) - Optional - The Elasticsearch query DSL object.

---

## Methods

### builder

#### Description
Returns a new instance of NativeQueryBuilder.

#### Method
Static Method

#### Response
- **builder** (NativeQueryBuilder) - A new NativeQueryBuilder instance.

---

### getQuery

#### Description
Returns the Elasticsearch query DSL object.

#### Method
Instance Method

#### Response
- **query** (co.elastic.clients.elasticsearch._types.query_dsl.Query) - The Elasticsearch query DSL object, or null if not set.

---

### getFilter

#### Description
Returns the Elasticsearch filter DSL object.

#### Method
Instance Method

#### Response
- **filter** (co.elastic.clients.elasticsearch._types.query_dsl.Query) - The Elasticsearch filter DSL object, or null if not set.

---

### getAggregations

#### Description
Returns the aggregations configured for the query.

#### Method
Instance Method

#### Response
- **aggregations** (Map<String, co.elastic.clients.elasticsearch._types.aggregations.Aggregation>) - A map of aggregation names to aggregation objects.

---

### getSuggester

#### Description
Returns the suggester configured for the query.

#### Method
Instance Method

#### Response
- **suggester** (co.elastic.clients.elasticsearch.core.search.Suggester) - The suggester object, or null if not set.

---

### getFieldCollapse

#### Description
Returns the field collapse configuration.

#### Method
Instance Method

#### Response
- **fieldCollapse** (co.elastic.clients.elasticsearch.core.search.FieldCollapse) - The field collapse object, or null if not set.

---

### getSortOptions

#### Description
Returns the sort options configured for the query.

#### Method
Instance Method

#### Response
- **sortOptions** (List<co.elastic.clients.elasticsearch._types.SortOptions>) - A list of sort options.

---

### getSearchExtensions

#### Description
Returns additional search extensions as JSON data.

#### Method
Instance Method

#### Response
- **searchExtensions** (Map<String, co.elastic.clients.json.JsonData>) - A map of extension keys to JSON data.

---

### setSpringDataQuery

#### Description
Sets the Spring Data Query object.

#### Method
Instance Method

#### Parameters
- **springDataQuery** (Query) - Optional - The Spring Data Query object.

---

### getKnnSearches

#### Description
Returns the k-NN searches configured for the query.

#### Method
Instance Method

#### Response
- **knnSearches** (List<co.elastic.clients.elasticsearch._types.KnnSearch>) - A list of k-NN search objects, or null if not set.

*Since: 5.3.1*

---

### getSpringDataQuery

#### Description
Returns the Spring Data Query object.

#### Method
Instance Method

#### Response
- **springDataQuery** (Query) - The Spring Data Query object, or null if not set.

*Since: 5.1*
```

--------------------------------

### POST /update

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Performs a partial update of the document.

```APIDOC
## POST /update

### Description
Partial update of the document.

### Method
POST

### Endpoint
/update

### Parameters
#### Request Body
- **updateQuery** (UpdateQuery) - Required - Query defining the update.
- **index** (IndexCoordinates) - Required - The index where to update the records.

### Response
#### Success Response (200)
- **UpdateResponse** (Mono) - The update response.

### Since
4.1
```

--------------------------------

### POST /reactive-elasticsearch/submitReindex

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Submits a reindex task to be executed asynchronously.

```APIDOC
## POST /reactive-elasticsearch/submitReindex

### Description
Submits a reindex task. The task runs asynchronously.

### Method
POST

### Endpoint
/reactive-elasticsearch/submitReindex

### Parameters
#### Request Body
- **reindexRequest** (ReindexRequest) - Required - Parameters for the reindex task.

### Request Example
{
  "source": {"index": "source-index"},
  "dest": {"index": "dest-index"}
}

### Response
#### Success Response (200)
- **taskId** (String) - Identifier of the submitted reindex task.

### Response Example
"_tasks/1234567890"
```

--------------------------------

### Perform multi-search queries (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchOperations

Enables execution of multiple queries in a single request, returning a list of SearchHits for each query. Supports overloads with index coordinates and class mapping. Returns a List of SearchHits handling various parameter combinations.

```Java
<T> List<SearchHits<T>> multiSearch(List<? extends Query> queries, Class<T> clazz)
```

```Java
<T> List<SearchHits<T>> multiSearch(List<? extends Query> queries, Class<T> clazz, IndexCoordinates index)
```

```Java
List<SearchHits<?>> multiSearch(List<? extends Query> queries, List<Class<?>> classes)
```

```Java
List<SearchHits<?>> multiSearch(List<? extends Query> queries, List<Class<?>> classes, IndexCoordinates index)
```

```Java
List<SearchHits<?>> multiSearch(List<? extends Query> queries, List<Class<?>> classes, List<IndexCoordinates> indexes)
```

--------------------------------

### Elasticsearch Operations Interface

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/package-use

The `ElasticsearchOperations` interface defines the fundamental operations for interacting with Elasticsearch, providing a client-independent abstraction layer.

```APIDOC
## ElasticsearchOperations Interface

### Description
Defines the core set of Elasticsearch operations that can be executed, offering an abstraction over different Elasticsearch clients.

### Method
N/A (Interface Definition)

### Endpoint
N/A (Interface Definition)

### Parameters
N/A (Interface Definition)

### Request Example
N/A (Interface Definition)

### Response
N/A (Interface Definition)
```

--------------------------------

### POST Open Index

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Opens a closed index. This endpoint requires a request object or a builder function.

```APIDOC
## POST /_open

### Description
Opens a closed index. This endpoint requires a request object or a builder function.

### Method
POST

### Endpoint
/_open

### Parameters
#### Request Body
- **request** (OpenRequest) - Required - A request object specifying the index to open.

### Response
#### Success Response (200)
- **acknowledged** (Boolean) - Indicates whether the operation was successful.
```

--------------------------------

### Update Transport Options in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchClusterClient

Updates the transport options for the ReactiveElasticsearchClusterClient instance. Returns a new client instance with updated options.

```java
public ReactiveElasticsearchClusterClient withTransportOptions(@Nullable co.elastic.clients.transport.TransportOptions transportOptions)
```

--------------------------------

### POST /updateByQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Updates document(s) by query.

```APIDOC
## POST /updateByQuery

### Description
Update document(s) by query.

### Method
POST

### Endpoint
/updateByQuery

### Parameters
#### Request Body
- **updateQuery** (UpdateQuery) - Required - Query defining the update, must not be null.
- **index** (IndexCoordinates) - Required - The index where to update the records, must not be null.

### Response
#### Success Response (200)
- **ByQueryResponse** (Mono) - The response indicating the result of the update by query operation.

### Since
4.1
```

--------------------------------

### POST /{index}/_doc

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Indexes a single document into the specified index. The index can be derived from entity metadata or supplied explicitly.

```APIDOC
## POST /{index}/_doc

### Description
Indexes a single document into the given Elasticsearch index. The index can be extracted from entity metadata or specified explicitly.

### Method
POST

### Endpoint
/{index}/_doc

### Parameters
#### Path Parameters
- **index** (string) - Required - Name of the Elasticsearch index.

#### Request Body
- **entity** (object) - Required - Document to be indexed.

### Request Example
{
  "entity": {
    "field1": "value1",
    "field2": "value2"
  }
}

### Response
#### Success Response (200)
- **_id** (string) - Identifier of the created document.
- **result** (string) - Result status, e.g., "created".

### Response Example
{
  "_id": "123",
  "result": "created"
}
```

--------------------------------

### multiGet

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Executes a multiGet against Elasticsearch for the given ids. Returns a list of MultiGetItem objects.

```APIDOC
## POST /_mget

### Description
Execute a multiGet against elasticsearch for the given ids.

### Method
POST

### Endpoint
/_mget

### Parameters
#### Request Body
- **query** (Query) - Required - The query defining the ids of the objects to get
- **clazz** (Class<T>) - Required - The type of the object to be returned

### Response
#### Success Response (200)
- **MultiGetItem<T>[]** (List) - List of MultiGetItem objects
```

--------------------------------

### Bulk update multiple documents

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Performs a bulk update of a list of UpdateQuery objects with optional BulkOptions in the specified index. Returns a Mono completing when all updates are sent. Useful for high‑throughput scenarios.

```java
public Mono<Void> bulkUpdate(List<UpdateQuery> queries, BulkOptions bulkOptions, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### POST /{index}/_mget

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Retrieves multiple documents by their IDs in a single request.

```APIDOC
## POST /{index}/_mget

### Description
Fetches multiple documents from the specified index using a list of document IDs.

### Method
POST

### Endpoint
/{index}/_mget

### Parameters
#### Path Parameters
- **index** (string) - Required - Target Elasticsearch index.

#### Request Body
- **ids** (array) - Required - List of document IDs to retrieve.

### Request Example
{
  "ids": ["1", "2", "3"]
}

### Response
#### Success Response (200)
- **docs** (array) - Retrieved documents with their source fields.

### Response Example
{
  "docs": [
    { "_id": "1", "found": true, "_source": { "field": "value1" } },
    { "_id": "2", "found": true, "_source": { "field": "value2" } },
    { "_id": "3", "found": false }
  ]
}
```

--------------------------------

### POST /bulkUpdate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Bulk updates all objects. Performs updates and returns a `BulkFailureException` on errors.

```APIDOC
## POST /bulkUpdate

### Description
Bulk update all objects. Will do update. On errors returns with `BulkFailureException` with information about the failed operation.

### Method
POST

### Endpoint
/bulkUpdate

### Parameters
#### Request Body
- **queries** (List<UpdateQuery>) - Required - The queries to execute in bulk.
- **index** (IndexCoordinates) - Required - The target index.

### Response
#### Success Response (200)
- **Void** (Mono) - Indicates successful bulk update.

### Since
4.0
```

--------------------------------

### Define Suggest Response Classes with Generic Option Types

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/class-use/Suggest.Suggestion.Entry

Core Spring Data Elasticsearch classes using generic types based on Suggest.Suggestion.Entry.Option. These classes form the foundation for different suggestion types like completion, phrase, and term suggestions.

```java
public static class Suggest.Suggestion<E extends Suggest.Suggestion.Entry<? extends Suggest.Suggestion.Entry.Option>> {}

public static class Suggest.Suggestion.Entry<O extends Suggest.Suggestion.Entry.Option> {}
```

--------------------------------

### bulkUpdate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Bulk update all objects. Will do update.

```APIDOC
## POST /_bulk

### Description
Bulk update all objects. Will do update.

### Method
POST

### Endpoint
/_bulk

### Parameters
#### Request Body
- **queries** (List<UpdateQuery>) - Required - The queries to execute in bulk
- **clazz** (Class<?>) - Required - The entity class

### Response
#### Success Response (200)
Empty response on success
```

--------------------------------

### POST /{index}/_update_by_query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Executes a query that updates all documents matching the query criteria.

```APIDOC
## POST /{index}/_update_by_query

### Description
Runs a query to update multiple documents in the specified index basedn
### Method
POST

### Endpoint
/{index}/_update_by_query

### Parameters
#### Path Parameters
- **index** (string) - Required - Target Elasticsearch index.

#### Request Body
- **script** (object) - Required - Script describing the update operation.
- **query** (object) - Required - Query defining which documents to update.

### Request Example
{
  "script": { "source": "ctx._source.field1 = params.newValue", "lang": "painless", "params": { "newValue": "updated" } },
  "query": { "term": { "status": "active" } }
}

### Response
#### Success Response (200)
- **updated** (integer) - Number of documents updated.

### Response Example
{
  "took": 45,
  "updated": 10,
  "batches": 1,
  "version_conflicts": 0,
  "noops": 0,
  "retries": { "bulk": 0, "search": 0 },
  "throttled_millis": 0,
  "requests_per_second": -1,
  "throttled_until_millis": 0,
  "total": 10,
  "failures": []
}
```

--------------------------------

### DefaultStringObjectMap Constructors

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/DefaultStringObjectMap

Provides constructors for initializing DefaultStringObjectMap. The default constructor creates an empty map, while the parameterized constructor initializes the map from an existing Map object.

```java
public DefaultStringObjectMap()
public DefaultStringObjectMap(Map<String,?> map)
```

--------------------------------

### AbstractElasticsearchRepositoryQuery - Create Query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

Internal method used by Elasticsearch repositories to construct a Query object from provided parameters.

```APIDOC
## Internal API - Query Construction

### Description
This internal method is responsible for generating an Elasticsearch Query object based on the parameters passed during query execution.

### Method
Internal

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **parameters** (Object[]) - Required - An array of parameters used to build the query.

### Request Example
```json
// This is an internal method and does not have a direct external request example.
// It is called when executing repository methods like findByStatus("active").
```

### Response
#### Success Response (Internal)
- **query** (Query) - The constructed Elasticsearch Query object.

#### Response Example
```json
// This is an internal object and not directly exposed as a response.
// It is used internally by the Elasticsearch query execution engine.
```
```

--------------------------------

### setVersion Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Sets the version for the document.

```APIDOC
## Method

### setVersion
public void setVersion(long version)

### Description
Sets the version for the document.

### Parameters
- **version** (long) - Required - The version to set for the document.
```

--------------------------------

### Cookie Management API - Broadcom

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/convert/NumberRangePropertyValueConverter

This section details Broadcom's cookie management system, which allows control over different types of cookies used for site analytics, performance tracking, and targeted advertising. It illustrates various cookie categories and their implications.

```APIDOC
## Cookies

### Description
Broadcom and third-party partners use cookies for site usage analysis, experience improvement, and advertising. Users can manage cookie preferences through the Privacy Preference Center.

### Method
Configuration Options

### Endpoint
/ (Accessed via Broadcom website)

### Parameters
#### Path Parameters
- N/A

#### Query Parameters
- N/A

#### Request Body
- N/A

### Request Example
N/A

### Response
#### Success Response (200)
- UI elements for cookie management.

#### Response Example
Contains interactive elements allowing users to set cookie preferences (Allow All, Required Only, Cookies Settings).

#### Cookie Categories:
- **Strictly Necessary Cookies:** Essential for website functionality.
- **Performance Cookies:** Used for site performance analysis.
- **Targeting Cookies:** Used for targeted advertising.

```

--------------------------------

### GeoJsonMultiPoint Factory Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/geo/class-use/GeoJsonMultiPoint

Methods for creating GeoJsonMultiPoint instances from various point representations.

```APIDOC
## [STATIC] GeoJsonMultiPoint.of(List<Point> points)

### Description
Creates a new `GeoJsonMultiPoint` for the given `Point`s.

### Method
STATIC

### Parameters
#### Request Parameters
- **points** (List<Point>) - Required - List of Point objects to create the multi-point geometry

### Response
#### Success Response
- **GeoJsonMultiPoint** - A new GeoJsonMultiPoint instance containing the provided points

## [STATIC] GeoJsonMultiPoint.of(GeoPoint first, GeoPoint second, GeoPoint... others)

### Description
Creates a new `GeoJsonMultiPoint` for the given `GeoPoint`s.

### Method
STATIC

### Parameters
#### Request Parameters
- **first** (GeoPoint) - Required - First GeoPoint
- **second** (GeoPoint) - Required - Second GeoPoint
- **others** (GeoPoint...) - Optional - Additional GeoPoint objects

### Response
#### Success Response
- **GeoJsonMultiPoint** - A new GeoJsonMultiPoint instance containing the provided geo points

## [STATIC] GeoJsonMultiPoint.of(Point first, Point second, Point... others)

### Description
Creates a new `GeoJsonMultiPoint` for the given `Point`s.

### Method
STATIC

### Parameters
#### Request Parameters
- **first** (Point) - Required - First Point
- **second** (Point) - Required - Second Point
- **others** (Point...) - Optional - Additional Point objects

### Response
#### Success Response
- **GeoJsonMultiPoint** - A new GeoJsonMultiPoint instance containing the provided points

## [STATIC] GeoJsonMultiPoint.ofGeoPoints(List<GeoPoint> geoPoints)

### Description
Creates a new `GeoJsonMultiPoint` for the given `GeoPoint`s.

### Method
STATIC

### Parameters
#### Request Parameters
- **geoPoints** (List<GeoPoint>) - Required - List of GeoPoint objects to create the multi-point geometry

### Response
#### Success Response
- **GeoJsonMultiPoint** - A new GeoJsonMultiPoint instance containing the provided geo points
```

--------------------------------

### Enable Explain Parameter in Elasticsearch Queries

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Control the 'explain' parameter for Elasticsearch queries. When set to true, it provides detailed explanations for query results. `getExplain()` checks if this parameter is enabled.

```java
public void setExplain(boolean explain)
public boolean getExplain()
```

--------------------------------

### Define EnableReactiveElasticsearchRepositories annotation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/config/EnableReactiveElasticsearchRepositories

Java annotation for enabling reactive Elasticsearch repositories. Provides configuration for package scanning, filters, repository implementation postfix, and template references. Used in Spring Data Elasticsearch applications requiring reactive data access patterns.

```java
@Target(TYPE) @Retention(RUNTIME) @Documented @Inherited @Import(org.springframework.data.elasticsearch.repository.config.ReactiveElasticsearchRepositoriesRegistrar.class) public @interface EnableReactiveElasticsearchRepositories
```

--------------------------------

### POST /reactive-elasticsearch/update

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Performs a partial update of a document in the specified index.

```APIDOC
## POST /reactive-elasticsearch/update

### Description
Partial update of the document.

### Method
POST

### Endpoint
/reactive-elasticsearch/update

### Parameters
#### Request Body
- **updateQuery** (UpdateQuery) - Required - Query defining the update operation.
- **index** (String) - Required - Target index.

### Request Example
{
  "updateQuery": {"id": "1", "doc": {"field": "new value"}},
  "index": "my-index"
}

### Response
#### Success Response (200)
- **updateResponse** (UpdateResponse) - Details of the update.

### Response Example
{
  "result": "updated",
  "version": 2
}
```

--------------------------------

### Iterating Over Document Entries

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Provides a method to perform an action for each key-value pair in the document. This functional approach allows for concise iteration and processing of document contents.

```java
public void forEach(BiConsumer<? super String,? super Object> action)
```

--------------------------------

### Reactive Elasticsearch Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/package-use

Defines the reactive counterparts for Elasticsearch operations, designed for non-blocking, asynchronous execution.

```APIDOC
## ReactiveElasticsearchOperations

### Description
Interface that specifies a basic set of Elasticsearch operations executed in a reactive way, supporting asynchronous data streams.

### Method
N/A (Interface Definition)

### Endpoint
N/A (Interface Definition)

### Parameters
N/A (Interface Definition)

### Request Example
N/A (Interface Definition)

### Response
N/A (Interface Definition)
```

--------------------------------

### setSeqNo Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Sets the sequence number for the document.

```APIDOC
## Method

### setSeqNo
public void setSeqNo(long seqNo)

### Description
Sets the sequence number for the document.

### Parameters
- **seqNo** (long) - Required - The sequence number to set for the document.
```

--------------------------------

### parse Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/convert/NumberRangePropertyValueConverter

Documentation for the parse method, which parses a string value into a Number object.

```APIDOC
## parse

### Description
Parses a string value into a Number object.

### Method
protected Number

### Endpoint
N/A

### Parameters
#### Path Parameters
- N/A

#### Query Parameters
- N/A

#### Request Body
- `value` (String) - Required - The string value to parse.

### Request Example
N/A

### Response
#### Success Response (200)
- Return Value (Number) - The parsed Number object.

#### Response Example
N/A
```

--------------------------------

### Index Maintenance Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods for index maintenance including disk usage analysis and index flushing. Returns Mono responses for reactive handling. Supports both direct request objects and builder functions for configuration.

```java
// Disk Usage Analysis
public Mono<DiskUsageResponse> diskUsage(co.elastic.clients.elasticsearch.indices.DiskUsageRequest request)
public Mono<DiskUsageResponse> diskUsage(Function<DiskUsageRequest.Builder, ObjectBuilder<DiskUsageRequest>> fn)

// Flush Index
public Mono<FlushResponse> flush(co.elastic.clients.elasticsearch.indices.FlushRequest request)
public Mono<FlushResponse> flush(Function<FlushRequest.Builder, ObjectBuilder<FlushRequest>> fn)
```

--------------------------------

### Create AliasData instance in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasData

Static factory method to create an AliasData instance with specified alias, filter query, routing settings, and index flags. This method is used to configure Elasticsearch index aliases programmatically.

```Java
public static AliasData of(String alias, @Nullable Query filterQuery, @Nullable String indexRouting, @Nullable String searchRouting, @Nullable Boolean isWriteIndex, @Nullable Boolean isHidden)
```

--------------------------------

### getWriteIndex() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the write index status.

```APIDOC
## getWriteIndex()

### Description
Retrieves the write index status.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **writeIndex** (Boolean) - The write index status.

#### Response Example
N/A
```

--------------------------------

### Multi-search multiple queries in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Executes multiple queries in a single request and returns a list of SearchHits, one per query. Uses the entity class for mapping and index resolution. Inputs: List of Query; entity class. Output: List<SearchHits<T>> aligned with input queries. Limitation: results are ordered per input; partial failures may require error handling.

```java
public <T> List<SearchHits<T>> multiSearch(List<? extends Query> queries, Class<T> clazz)
```

--------------------------------

### getVersion Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the version associated with the document.

```APIDOC
## Method

### getVersion
public long getVersion()

### Description
Retrieves the version associated with the document.

### Returns
- The version as a long value.
```

--------------------------------

### HEAD /_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Checks if a legacy index template exists.

```APIDOC
## HEAD /_template/{name}

### Description
Checks if an index template exists using the legacy Elasticsearch interface.

### Method
HEAD

### Endpoint
/_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Template name.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **exists** (boolean) - True if the template exists.

#### Response Example
{
  "exists": true
}
```

--------------------------------

### Bulk Indexing Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Provides methods for performing bulk indexing operations on multiple documents. It supports indexing lists of IndexQuery objects, with options for specifying bulk options and target index coordinates. Returns a list of IndexedObjectInformation upon successful completion.

```java
List<IndexedObjectInformation>
bulkIndex(List<IndexQuery> queries, Class<?> clazz)

```

```java
List<IndexedObjectInformation>
bulkIndex(List<IndexQuery> queries, BulkOptions bulkOptions, Class<?> clazz)

```

```java
final List<IndexedObjectInformation>
bulkIndex(List<IndexQuery> queries, BulkOptions bulkOptions, IndexCoordinates index)

```

--------------------------------

### ReactiveElasticsearchRepository Java Interface

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/ReactiveElasticsearchRepository

Defines reactive repository operations for Elasticsearch, extending ReactiveSortingRepository and ReactiveCrudRepository. Supports saving and deleting entities with RefreshPolicy for immediate visibility. Introduced in version 3.2, methods added in 5.2; requires Project Reactor for Mono/Flux types.

```Java
@NoRepositoryBean
public interface ReactiveElasticsearchRepository<T,ID> extends ReactiveSortingRepository<T,ID>, ReactiveCrudRepository<T,ID> {

  <S extends T> Mono<S> save(S entity, @Nullable RefreshPolicy refreshPolicy);

  <S extends T> Flux<S> saveAll(Iterable<S> entities, @Nullable RefreshPolicy refreshPolicy);

  <S extends T> Flux<S> saveAll(Publisher<S> entityStream, @Nullable RefreshPolicy refreshPolicy);

  Mono<Void> deleteById(ID id, @Nullable RefreshPolicy refreshPolicy);

  Mono<Void> deleteById(Publisher<ID> id, @Nullable RefreshPolicy refreshPolicy);

  Mono<Void> delete(T entity, @Nullable RefreshPolicy refreshPolicy);

  Mono<Void> deleteAllById(Iterable<? extends ID> ids, @Nullable RefreshPolicy refreshPolicy);

  Mono<Void> deleteAll(Iterable<? extends T> entities, @Nullable RefreshPolicy refreshPolicy);

  Mono<Void> deleteAll(Publisher<? extends T> entityStream, @Nullable RefreshPolicy refreshPolicy);

  Mono<Void> deleteAll(@Nullable RefreshPolicy refreshPolicy);

}
```

--------------------------------

### Execute ReactiveChildTemplate.ClientCallback with Elasticsearch client (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/class-use/ReactiveChildTemplate

This snippet shows the Java method signature for executing a ReactiveChildTemplate.ClientCallback, returning a reactive Publisher of the result type. It depends on the Spring Data Elasticsearch ELK client library and the reactive streams Publisher. The callback receives a client instance and should handle Elasticsearch operations, with any exceptions translated by the framework.

```java
public <RESULT> Publisher<RESULT> execute(
    ReactiveChildTemplate.ClientCallback<CLIENT, Publisher<RESULT>> callback) {
    // implementation that invokes the callback with the Elasticsearch client
    // and translates any Elasticsearch exceptions
    // return the reactive Publisher produced by the callback
}

```

--------------------------------

### toBoundingBox

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/utils/geohash/Geohash

Computes the bounding box coordinates from a given geohash.

```APIDOC
## toBoundingBox

### Description
Computes the bounding box coordinates from a given geohash.

### Method
GET

### Endpoint
/toBoundingBox/{geohash}

### Parameters
#### Path Parameters
- **geohash** (String) - Required - Geohash of the defined cell.

### Request Example
{
  "geohash": "02j47"
}

### Response
#### Success Response (200)
- **rectangle** (GeoRect) - GeoRect rectangle defining the bounding box.

#### Response Example
{
  "rectangle": {
    "minLat": 10.0,
    "maxLat": 20.0,
    "minLon": 30.0,
    "maxLon": 40.0
  }
}
```

--------------------------------

### bulkOperation Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/IndexedObjectInformation

Performs bulk operations on Elasticsearch indices with bulk options and index coordinates.

```APIDOC
## bulkOperation Method

### Description
Performs bulk operations on Elasticsearch indices with bulk options and index coordinates.

### Method
POST

### Endpoint
bulkOperation(List<?> queries, BulkOptions bulkOptions, IndexCoordinates index)

### Parameters
#### Path Parameters
- **queries** (List<?>) - Required - List of objects to be processed in bulk operation
- **bulkOptions** (BulkOptions) - Required - Configuration options for bulk operation
- **index** (IndexCoordinates) - Required - Index coordinates specifying target index

#### Query Parameters
- **None**

#### Request Body
- **queries** (List<?>) - Required - Collection of objects for bulk processing
- **bulkOptions** (BulkOptions) - Required - Bulk operation configuration
- **index** (IndexCoordinates) - Required - Target index coordinates

### Request Example
{
  "queries": [
    {"id": "1", "name": "John"},
    {"id": "2", "name": "Jane"}
  ],
  "bulkOptions": {
    "refreshPolicy": "wait_for"
  },
  "index": "users-index"
}

### Response
#### Success Response (200)
- **indexedObjectInformation** (List<IndexedObjectInformation>) - List of indexed object information results

#### Response Example
{
  "indexedObjectInformation": [
    {
      "id": "1",
      "seqNo": 1,
      "primaryTerm": 1
    },
    {
      "id": "2",
      "seqNo": 2,
      "primaryTerm": 1
    }
  ]
}
```

--------------------------------

### ReactiveElasticsearchTemplate.aggregate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/AggregationContainer

Performs an aggregation query using the ReactiveElasticsearchTemplate. Returns a Flux of AggregationContainer objects.

```APIDOC
## GET /_search

### Description
Performs an aggregation specified by the given query using ReactiveElasticsearchTemplate.

### Method
GET

### Endpoint
/_search

### Parameters
#### Query Parameters
- **query** (Query) - Required - The query object specifying the aggregation
- **entityType** (Class<?>) - Required - The entity type to aggregate on
- **index** (IndexCoordinates) - Required - The index coordinates to search against

### Response
#### Success Response (200)
- **Flux<? extends AggregationContainer<?>>** - A reactive stream of aggregation results
```

--------------------------------

### Create ClientConfiguration with InetSocketAddress (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/ClientConfiguration

Illustrates creating a ClientConfiguration instance using an InetSocketAddress. This method provides more precise control over socket parameters. It is useful when you want to specify additional socket options.

```Java
ClientConfiguration configuration = ClientConfiguration
                .create(InetSocketAddress.createUnresolved("localhost", 9200));
```

--------------------------------

### ElasticsearchHost Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/ElasticsearchHost

The ElasticsearchHost class provides methods to manage and query information about Elasticsearch cluster nodes, including their state and endpoint details.

```APIDOC
## ElasticsearchHost Class

### Description
Value Object containing information about Elasticsearch cluster nodes.

### Fields
- **DEFAULT_PORT** (int) - Default HTTP port for Elasticsearch servers.

### Methods
#### online
`public static ElasticsearchHost online(InetSocketAddress host)`

Creates a new instance of ElasticsearchHost with ONLINE state.

Parameters:
- **host** (InetSocketAddress) - Required - Must not be null.

Returns:
- New instance of `ElasticsearchHost`.

#### offline
`public static ElasticsearchHost offline(InetSocketAddress host)`

Creates a new instance of ElasticsearchHost with OFFLINE state.

Parameters:
- **host** (InetSocketAddress) - Required - Must not be null.

Returns:
- New instance of `ElasticsearchHost`.

#### parse
`public static InetSocketAddress parse(String hostAndPort)`

Parses a hostAndPort string into an `InetSocketAddress`.

Parameters:
- **hostAndPort** (String) - Required - The string containing host and port in the format `host:port`.

Returns:
- The parsed `InetSocketAddress`.

#### isOnline
`public boolean isOnline()`

Checks if the last known state was ONLINE.

Returns:
- `true` if the last known state was ONLINE.

#### getEndpoint
`public InetSocketAddress getEndpoint()`

Gets the endpoint address.

Returns:
- The `InetSocketAddress` of the endpoint (never null).

#### getState
`public ElasticsearchHost.State getState()`

Gets the last known state.

Returns:
- The last known `ElasticsearchHost.State`.

#### getTimestamp
`public Instant getTimestamp()`

Gets the timestamp when the information was captured.

Returns:
- The `Instant` the information was captured.

#### toString
`public String toString()`

Overrides the default toString method.

Returns:
- String representation of the ElasticsearchHost object.
```

--------------------------------

### getRestClient

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchClients

Static method to create a low-level RestClient instance from a given ClientConfiguration. This is used for direct HTTP interactions with Elasticsearch without higher-level abstractions.

```APIDOC
## getRestClient

### Description
Creates a low-level RestClient for the given configuration, enabling direct REST API calls to Elasticsearch.

### Method
public static org.elasticsearch.client.RestClient

### Endpoint
getRestClient(ClientConfiguration clientConfiguration)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- clientConfiguration (ClientConfiguration) - Required - Configuration options for the RestClient.

### Request Example
N/A

### Response
#### Success Response
- Returns: org.elasticsearch.client.RestClient - The created low-level RestClient.

#### Response Example
N/A

### Error Handling
clientConfiguration must not be null.
```

--------------------------------

### Construct ReactiveSearchHitsImpl in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/SearchHits

Constructor for ReactiveSearchHitsImpl, which takes an existing SearchHits object as a delegate. This is used internally for creating reactive search hit wrappers.

```java
ReactiveSearchHitsImpl(SearchHits<T> delegate)
```

--------------------------------

### POST migrateToDataStream

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Migrates an existing index alias to a data stream. This operation allows you to transition from using index aliases to the more advanced data stream functionality.

```APIDOC
## POST migrateToDataStream

### Description
Migrates an existing index alias to a data stream

### Method
POST

### Endpoint
/_data_stream/_migrate

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **alias** (string) - Required - Name of the alias to migrate
- **data_stream** (string) - Required - Name for the new data stream

### Request Example
{
  "alias": "logs-app",
  "data_stream": "logs-stream"
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged
- **shards_acknowledged** (boolean) - Whether shards were acknowledged

#### Response Example
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```

--------------------------------

### getFieldNamingStrategy

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Returns the field naming strategy.

```APIDOC
## GET /fieldNamingStrategy

### Description
Returns the field naming strategy.

### Method
GET

### Endpoint
/fieldNamingStrategy

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
{
  "example": "N/A"
}

### Response
#### Success Response (200)
- **strategy** (FieldNamingStrategy) - The field naming strategy.

#### Response Example
{
  "strategy": null
}
```

--------------------------------

### AliasActionParameters Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Describes the AliasActionParameters value class used for managing Elasticsearch aliases.

```APIDOC
## AliasActionParameters Class

### Description
Value class capturing the arguments for an `AliasAction`.

### Method
Class

### Endpoint
N/A (Class Definition)

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- N/A

#### Response Example
N/A
```

--------------------------------

### append Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Associates a key with a value in the document and returns the document object for chaining.

```APIDOC
## Method

### append
public SearchDocument append(String key, Object value)

### Description
Associates the specified value with the specified key in the document and returns the document object for chaining.

### Parameters
- **key** (String) - Required - The key with which the specified value is to be associated.
- **value** (Object) - Required - The value to be associated with the specified key.

### Returns
- `this` document object.
```

--------------------------------

### EXISTS /_template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Checks if a template exists.  This endpoint verifies the presence of a template in Elasticsearch.

```APIDOC
## EXISTS /_template

### Description
Checks whether a template exists.

### Method
GET

### Endpoint
/_template

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the template to check.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "name": "my_template"
  }
}

### Response
#### Success Response (200)
- **response** (boolean) - True if the template exists, false otherwise.
```

--------------------------------

### Create SearchPage from SearchHits in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/SearchHits

A static utility method to create a SearchPage from SearchHits and Pageable information. This simplifies the creation of paginated search results.

```java
static <T> SearchPage<T> searchPageFor(SearchHits<T> searchHits, Pageable pageable)
```

--------------------------------

### Initialize Document from JSON String (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Initializes the Document object from a JSON string. This is a default method available on the Document interface. It takes a JSON string as input and returns the initialized Document.

```java
default Document fromJson(String json)
initializes this object from the given JSON String.
```

--------------------------------

### Criteria API - org.springframework.data.elasticsearch.core.query.Criteria

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Criteria

The Criteria class offers a fluent API to construct Elasticsearch query criteria. Each method returns a Criteria instance for chaining and adds specific query operations.

```APIDOC
## Criteria Class Methods\n\n### Description\nThe `Criteria` class provides a fluent builder for Elasticsearch query criteria. Methods can be chained to combine multiple conditions using logical operators (and, or, not) and to specify range, wildcard, geospatial, and other query types.\n\n---\n\n#### Method: `and()`\n\n**Signature**: `public Criteria and()`\n\n**Description**: Starts a new logical AND block.\n\n**Parameters**: None\n\n**Returns**: `Criteria` – a new Criteria instance for further chaining.\n\n---\n\n#### Method: `and(String fieldName)`\n\n**Signature**: `public Criteria and(String fieldName)`\n\n**Description**: Starts a new AND block scoped to the given field.\n\n**Parameters**:\n- **fieldName** (String) – Required – The name of the field to apply subsequent criteria.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `and(Criteria criteria)`\n\n**Signature**: `public Criteria and(Criteria criteria)`\n\n**Description**: Chains an existing `Criteria` instance with an AND operation.\n\n**Parameters**:\n- **criteria** (Criteria) – Required – The criteria to combine.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `and(Criteria... criterias)`\n\n**Signature**: `public Criteria and(Criteria... criterias)`\n\n**Description**: Chains multiple `Criteria` instances with AND.\n\n**Parameters**:\n- **criterias** (Criteria[]) – Required – Array of criteria to combine.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `between(Object lowerBound, Object upperBound)`\n\n**Signature**: `public Criteria between(Object lowerBound, Object upperBound)`\n\n**Description**: Adds a BETWEEN operation for range queries.\n\n**Parameters**:\n- **lowerBound** (Object) – Required – Lower bound value.\n- **upperBound** (Object) – Required – Upper bound value.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `boost(float boost)`\n\n**Signature**: `public Criteria boost(float boost)`\n\n**Description**: Sets the boost factor for the criteria.\n\n**Parameters**:\n- **boost** (float) – Required – Boost factor value.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `boundedBy(String topLeftGeohash, String bottomRightGeohash)`\n\n**Signature**: `public Criteria boundedBy(String topLeftGeohash, String bottomRightGeohash)`\n\n**Description**: Adds a bounding box filter using geohash strings.\n\n**Parameters**:\n- **topLeftGeohash** (String) – Required – Geohash of the top‑left corner.\n- **bottomRightGeohash** (String) – Required – Geohash of the bottom‑right corner.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `boundedBy(GeoBox boundingBox)`\n\n**Signature**: `public Criteria boundedBy(GeoBox boundingBox)`\n\n**Description**: Adds a filter for a GeoBox bounding box.\n\n**Parameters**:\n- **boundingBox** (GeoBox) – Required – The GeoBox defining the area.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `contains(String s)`\n\n**Signature**: `public Criteria contains(String s)`\n\n**Description**: Adds a CONTAINS operation (wildcard) to the query. Note: leading wildcards may be unsupported or slow.\n\n**Parameters**:\n- **s** (String) – Required – Substring to search for.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `exists()`\n\n**Signature**: `public Criteria exists()`\n\n**Description**: Adds an EXISTS operation to check if a field has a value.\n\n**Parameters**: None\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `fuzzy(String s)`\n\n**Signature**: `public Criteria fuzzy(String s)`\n\n**Description**: Adds a FUZZY operation for approximate matching.\n\n**Parameters**:\n- **s** (String) – Required – Term to match fuzzily.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `greaterThan(Object lowerBound)`\n\n**Signature**: `public Criteria greaterThan(Object lowerBound)`\n\n**Description**: Adds a GREATER THAN operation.\n\n**Parameters**:\n- **lowerBound** (Object) – Required – Lower bound value.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `lessThan(Object upperBound)`\n\n**Signature**: `public Criteria lessThan(Object upperBound)`\n\n**Description**: Adds a LESS THAN operation.\n\n**Parameters**:\n- **upperBound** (Object) – Required – Upper bound value.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `not()`\n\n**Signature**: `public Criteria not()`\n\n**Description**: Sets the negating flag to invert the next operation.\n\n**Parameters**: None\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `or()`\n\n**Signature**: `public Criteria or()`\n\n**Description**: Starts a new logical OR block.\n\n**Parameters**: None\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `regexp(String value)`\n\n**Signature**: `public Criteria regexp(String value)`\n\n**Description**: Adds a REGEXP operation for regular expression matching.\n\n**Parameters**:\n- **value** (String) – Required – Regular expression pattern.\n\n**Returns**: `Criteria`\n\n---\n\n#### Method: `startsWith(String s)`\n\n**Signature**: `public Criteria startsWith(String s)`\n\n**Description**: Adds a STARTS_WITH operation for prefix queries.\n\n**Parameters**:\n- **s** (String) – Required – Prefix string.\n\n**Returns**: `Criteria`\n\n---\n\n*For brevity, only a subset of methods is shown. All other `Criteria` methods follow the same documentation pattern, accepting appropriate arguments and returning a `Criteria` instance for fluent chaining.*
```

--------------------------------

### Indices Stats

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Retrieves statistics for indices.

```APIDOC
## GET /_stats

### Description
Retrieves statistics for indices.

### Method
GET

### Endpoint
/_stats

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **indices_stats** (object) - Index statistics.
```

--------------------------------

### UpdateResponse Constructor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/UpdateResponse

Creates an instance of UpdateResponse with a specified result status. This constructor is used internally to encapsulate the outcome of an update operation.

```APIDOC
## POST /UpdateResponse

### Description
Creates a new UpdateResponse object containing the result of an update operation.

### Method
Constructor

### Endpoint
N/A

### Parameters
#### Request Body
- **result** (UpdateResponse.Result) - Required - The result status of the update operation.

### Request Example
```
new UpdateResponse(UpdateResponse.Result.UPDATED)
```

### Response
#### Success Response (200)
- **result** (UpdateResponse.Result) - The status of the update operation.

#### Response Example
```
{
  "result": "UPDATED"
}
```
```

--------------------------------

### POST /reactive-elasticsearch/saveAll

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Indexes multiple entities into the specified Elasticsearch index in a reactive, non‑blocking manner.

```APIDOC
## POST /reactive-elasticsearch/saveAll

### Description
Indexes multiple entities into the given index. If the index is null or empty, the index name from entity metadata is used.

### Method
POST

### Endpoint
/reactive-elasticsearch/saveAll

### Parameters
#### Request Body
- **entitiesPublisher** (Mono<Collection<T>>) - Required - Reactive stream emitting a collection of entities to be indexed.
- **index** (IndexCoordinates) - Required - Target index coordinates.

### Request Example
{
  "entitiesPublisher": "...",
  "index": "my-index"
}

### Response
#### Success Response (200)
- **savedEntities** (Flux<T>) - Emits the saved entities.\n### Response Example
[
  {"id":"1","field":"value"},
  {"id":"2","field":"value"}
]
```

--------------------------------

### Perform reactive search and retrieve ReactiveSearchHits in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Executes a search query and returns a Mono emitting ReactiveSearchHits containing the result documents. Requires a non-null Query, entity type, and target IndexCoordinates. Overloads allow specifying a projection result type. Returns a Mono of ReactiveSearchHits.

```Java
default <T> Mono<ReactiveSearchHits<T>> searchForHits(Query query, Class<T> entityType, IndexCoordinates index);
```

```Java
<T> Mono<ReactiveSearchHits<T>> searchForHits(Query query, Class<?> entityType, Class<T> resultType, IndexCoordinates index);
```

--------------------------------

### ReactiveElasticsearchQueryExecution - Execute Query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

Executes a constructed Query object in a reactive manner for Elasticsearch.

```APIDOC
## POST /api/elasticsearch/reactive/execute

### Description
Executes a given Elasticsearch Query object reactively. This endpoint is part of the reactive query execution flow.

### Method
POST

### Endpoint
/api/elasticsearch/reactive/execute

### Parameters
#### Query Parameters
- **type** (Class) - Required - The return type of the query.
- **targetType** (Class) - Required - The target type for the query results.
- **indexCoordinates** (IndexCoordinates) - Required - The index coordinates to execute the query against.

#### Request Body
- **query** (Query) - Required - The Elasticsearch Query object to execute.

### Request Example
```json
{
  "query": {
    "match_all": {}
  }
}
```

### Response
#### Success Response (200)
- **result** (Object) - The result of the query execution.

#### Response Example
```json
{
  "result": [
    {
      "id": "doc1",
      "content": "example content"
    }
  ]
}
```
```

--------------------------------

### Bulk index/update documents in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Executes a bulk operation (index or update) for the given queries against the specified index. Uses IndexCoordinates to resolve target index and BulkOptions for configuration (e.g., refresh policy). The actual work is delegated to a protected doBulkOperation. Inputs: List of queries/entities; bulk options; index coordinates. Output: List of IndexedObjectInformation containing per-item results. Limitation: concrete implementation is abstracted.

```java
public abstract List<IndexedObjectInformation> doBulkOperation(List<?> queries, BulkOptions bulkOptions, IndexCoordinates index)
```

--------------------------------

### getFilterQuery() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the filter query.

```APIDOC
## getFilterQuery()

### Description
Retrieves the filter query.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **filterQuery** (Query) - The filter query.

#### Response Example
N/A
```

--------------------------------

### PUT Alias

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Creates or updates an alias for an index. This endpoint requires a request object or a builder function.

```APIDOC
## PUT /_alias

### Description
Creates or updates an alias for an index. This endpoint requires a request object or a builder function.

### Method
PUT

### Endpoint
/_alias

### Parameters
#### Request Body
- **request** (PutAliasRequest) - Required - A request object specifying the alias and index.

### Response
#### Success Response (200)
- **acknowledged** (Boolean) - Indicates whether the operation was successful.
```

--------------------------------

### DateFormatter Interface

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/convert/DateFormatter

Defines methods for converting between TemporalAccessors and Strings.

```APIDOC
## Interface: DateFormatter

### Description
Interface to convert from and to `TemporalAccessor`s.

Since: 4.2

Author: Peter-Josef Meisch

### Methods

#### format
* **Method Signature**: `String format(TemporalAccessor accessor)`
* **Description**: Formats a `TemporalAccessor` into a String.
* **Parameters**:
  * `accessor` (TemporalAccessor) - Required - The TemporalAccessor to format.
* **Returns**:
  * (String) - The formatted String.

#### parse
* **Method Signature**: `<T extends TemporalAccessor> T parse(String input, Class<T> type)`
* **Description**: Parses a String into a `TemporalAccessor`.
* **Type Parameters**:
  * `T` - The `TemporalAccessor` implementation.
* **Parameters**:
  * `input` (String) - Required - The String to parse.
  * `type` (Class<T>) - Required - The class of T.
* **Returns**:
  * (T) - The parsed `TemporalAccessor` instance.
```

--------------------------------

### NativeQuery Constructors and Builder in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/NativeQuery

Constructors initialize NativeQuery instances using a builder or an Elasticsearch Query object. The builder method allows fluent construction of queries. These are used to create query objects for Elasticsearch searches, requiring the Elasticsearch client dependencies.

```java
public NativeQuery(NativeQueryBuilder builder)
public NativeQuery(@Nullable co.elastic.clients.elasticsearch._types.query_dsl.Query query)
public static NativeQueryBuilder builder()
```

--------------------------------

### POST /api/count

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Counts the number of documents matching the given query in the specified index.

```APIDOC
## POST /api/count

### Description
Count the number of documents matching the given `Query`.

### Method
POST

### Endpoint
/api/count

### Parameters
#### Request Body
- **query** (Query) - Required - The query to match documents.
- **entityType** (Class<?>) - Required - The entity type for mapping the query.
- **index** (IndexCoordinates) - Required - The target index.

### Request Example
{
  "query": {},
  "entityType": "com.example.Entity",
  "index": "example_index"
}

### Response
#### Success Response (200)
- **count** (Long) - The number of matching documents.

#### Response Example
{
  "count": 42
}
```

--------------------------------

### PUT /_component_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/class-use/PutComponentTemplateRequest

This endpoint allows for the creation or updating of a component template in Elasticsearch. Component templates are reusable configurations that can be included in index templates.

```APIDOC
## PUT /_component_template/{name}

### Description
Creates or updates a component template.

### Method
PUT

### Endpoint
`/_component_template/{name}`

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the component template.

#### Request Body
- **template** (object) - Required - The component template configuration.
  - **mappings** (object) - Optional - Defines the mapping for the index.
  - **settings** (object) - Optional - Defines the settings for the index.

### Request Example
```json
{
  "template": {
    "mappings": {
      "properties": {
        "field1": {"type": "text"}
      }
    },
    "settings": {
      "index.number_of_shards": 1
    }
  }
}
```

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Indicates if the request was acknowledged by the cluster.

#### Response Example
```json
{
  "acknowledged": true
}
```
```

--------------------------------

### POST /api/elasticsearch/point-in-time

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/class-use/IndexCoordinates

Opens a point-in-time context for a given index. This allows for consistent reads over a period of time.

```APIDOC
## POST /api/elasticsearch/point-in-time

### Description
Opens a point-in-time context for a given index. This allows for consistent reads over a period of time.

### Method
POST

### Endpoint
/api/elasticsearch/point-in-time

### Parameters
#### Path Parameters
- **index** (IndexCoordinates) - Required - The index to open the point-in-time context for.
- **keepAlive** (Duration) - Required - The duration for which the point-in-time context should be kept alive.
- **ignoreUnavailable** (Boolean) - Optional - Whether to ignore unavailable indices.

### Response
#### Success Response (200)
- **scrollId** (String) - The ID of the point-in-time context.

#### Response Example
{
  "scrollId": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAD4WYm9laVYtZndUQlNsdDcwakFMNjU1QQ=="
}
```

--------------------------------

### @Highlight Annotation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/Highlight

Annotation for configuring highlight fields and parameters in Elasticsearch queries. Used to mark fields that should be highlighted in search results.

```APIDOC
## @Highlight Annotation

### Description
Annotation for configuring highlight fields and parameters in Elasticsearch queries. Used to mark fields that should be highlighted in search results.

### Required Elements
- **fields** (HighlightField[]) - Required - Array of fields to highlight

### Optional Elements
- **parameters** (HighlightParameters) - Optional - Additional highlight parameters

### Element Details
#### fields
HighlightField[] fields
Array of fields to be highlighted in search results

#### parameters
HighlightParameters parameters
Additional parameters for highlighting configuration
Default: @org.springframework.data.elasticsearch.annotations.HighlightParameters
```

--------------------------------

### Split Index - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This snippet demonstrates the `split` method for splitting an index in Spring Data Elasticsearch. It accepts a Function to customize the SplitRequest.Builder and returns a SplitResponse.

```java
public Mono<co.elastic.clients.elasticsearch.indices.SplitResponse> split(Function<co.elastic.clients.elasticsearch.indices.SplitRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.SplitRequest>> fn)
```

--------------------------------

### SearchHits Interface

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHits

The SearchHits interface encapsulates a list of SearchHit objects with additional information from the search. It provides methods to access search results, aggregations, suggestions, and execution metadata.

```APIDOC
## SearchHits Interface

### Description
Encapsulates a list of `SearchHit`s with additional information from the search.

### Methods
- `getAggregations()` - Returns the aggregations.
- `getMaxScore()` - Returns the maximum score.
- `getExecutionDuration()` - Returns the execution duration it took to complete the request.
- `getSearchHit(int index)` - Returns the `SearchHit` at the specified position.
- `getSearchHits()` - Returns the contained `SearchHit`s.
- `getTotalHits()` - Returns the number of total hits.
- `getTotalHitsRelation()` - Returns the relation for the total hits.
- `hasAggregations()` - Returns true if aggregations are available.
- `hasSearchHits()` - Returns whether the `SearchHits` has search hits.
- `getSuggest()` - Returns the suggest response.
- `hasSuggest()` - Returns whether the `SearchHits` has a suggest response.
- `iterator()` - Returns an iterator for `SearchHit`.
- `getPointInTimeId()` - Returns the new point in time id, if one was returned from Elasticsearch.
- `getSearchShardStatistics()` - Returns shard statistics for the search hit.
```

--------------------------------

### ElasticsearchParameter Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchParameter

Methods available in the ElasticsearchParameter class for handling Elasticsearch-specific parameters.

```APIDOC
## ElasticsearchParameter Methods

### Description
Methods for identifying parameter types in Elasticsearch queries including special parameters, scripted fields, and runtime fields.

### Method Details

#### isSpecialParameter

**Description**: Checks if the parameter is a special parameter.

**Signature**: `public boolean isSpecialParameter()`

**Returns**: `boolean` - true if the parameter is special, false otherwise

**Overrides**: `isSpecialParameter` in class `Parameter`

#### isScriptedFieldParameter

**Description**: Checks if the parameter is a scripted field parameter.

**Signature**: `public Boolean isScriptedFieldParameter()`

**Returns**: `Boolean` - true if the parameter is a scripted field, false otherwise

#### isRuntimeFieldParameter

**Description**: Checks if the parameter is a runtime field parameter.

**Signature**: `public Boolean isRuntimeFieldParameter()`

**Returns**: `Boolean` - true if the parameter is a runtime field, false otherwise

### Inherited Methods

#### From Parameter class
`getIndex, getName, getPlaceholder, getRequiredName, getType, isBindable, isDynamicProjectionParameter, isExplicitlyNamed, isNamedParameter, toString`

#### From Object class
`clone, equals, finalize, getClass, hashCode, notify, notifyAll, wait, wait, wait`
```

--------------------------------

### POST /reindex

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Copies documents from a source to a destination index. The source can be any existing index, alias, or data stream. The destination must differ from the source.

```APIDOC
## POST /reindex

### Description
Copies documents from a source to a destination index. The source can be any existing index, alias, or data stream. The destination must differ from the source.

### Method
POST

### Endpoint
/reindex

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **reindexRequest** (object) - Required - Reindex request parameters

### Request Example
{
  "reindexRequest": {
    "sourceIndex": "source_index",
    "destinationIndex": "destination_index"
  }
}

### Response
#### Success Response (200)
- **Mono<ReindexResponse>** - Description: A `Mono` emitting the reindex response

#### Response Example
{
  "reindexResponse": "response body"
}
```

--------------------------------

### POST /reactive-elasticsearch/updateByQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Updates documents that match the given query in the specified index.

```APIDOC
## POST /reactive-elasticsearch/updateByQuery

### Description
Update document(s) by query.

### Method
POST

### Endpoint
/reactive-elasticsearch/updateByQuery

### Parameters
#### Request Body
- **updateQuery** (UpdateQuery) - Required - Query defining the update.
- **index** (String) - Required - Target index.

### Request Example
{
  "updateQuery": {"query": {"term": {"status": "old"}}, "script": {"source": "ctx._source.status = 'new'"}},
  "index": "my-index"
}

### Response
#### Success Response (200)
- **byQueryResponse** (ByQueryResponse) - Result of the operation.

### Response Example
{
  "updated": 10,
  "took": "30ms"
}
```

--------------------------------

### Document Manipulation and Retrieval

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/StringObjectMap

This section details methods for appending key-value pairs to a document and retrieving values by key with various type-casting and default value options.

```APIDOC
## POST /document

### Description
Appends a key-value pair to the current document. This is a convenience method that internally uses `Map.put()`.

### Method
POST

### Endpoint
/document

### Parameters
#### Query Parameters
- **key** (String) - Required - The key to associate with the value.
- **value** (Object) - Required - The value to be associated with the key.

### Request Example
(No request body for this example, parameters are query parameters)

### Response
#### Success Response (200)
- **this** (Document) - The current document object, allowing for chaining.

#### Response Example
(Response will be the document object itself, no specific JSON example provided as it's an object reference)
```

```APIDOC
## GET /document/{key}

### Description
Retrieves the value associated with the specified key from the document. The method attempts to cast the value to the specified type.

### Method
GET

### Endpoint
/document/{key}

### Parameters
#### Path Parameters
- **key** (String) - Required - The key whose associated value is to be returned.

#### Query Parameters
- **type** (Class<T>) - Required - The expected return type.

### Request Example
(No request body for this example, parameters are path and query parameters)

### Response
#### Success Response (200)
- **T** (type) - The value associated with the key, cast to the specified type, or null if the key is not found.

#### Response Example
```json
{
  "example": "retrievedValue"
}
```

#### Error Response (400)
- **ClassCastException** - If the value of the given key is not assignable to the specified type `T`.
```

```APIDOC
## GET /document/boolean/{key}

### Description
Retrieves the value associated with the specified key as a Boolean. Returns null if the key is not found. Throws `ClassCastException` if the value is not a Boolean.

### Method
GET

### Endpoint
/document/boolean/{key}

### Parameters
#### Path Parameters
- **key** (String) - Required - The key whose associated value is to be returned.

### Request Example
(No request body for this example, parameter is a path parameter)

### Response
#### Success Response (200)
- **Boolean** - The Boolean value associated with the key, or null.

#### Response Example
```json
{
  "example": true
}
```

#### Error Response (400)
- **ClassCastException** - If the value of the given key is not a Boolean.
```

```APIDOC
## GET /document/boolean/{key}/default

### Description
Retrieves the value associated with the specified key as a boolean, returning a provided default value if the key is not found. Throws `ClassCastException` if the value is not a Boolean.

### Method
GET

### Endpoint
/document/boolean/{key}/default

### Parameters
#### Path Parameters
- **key** (String) - Required - The key whose associated value is to be returned.

#### Query Parameters
- **defaultValue** (boolean) - Required - The default boolean value to return if the key is not found.

### Request Example
(No request body for this example, parameters are path and query parameters)

### Response
#### Success Response (200)
- **boolean** - The boolean value associated with the key, or the defaultValue.

#### Response Example
```json
{
  "example": false
}
```

#### Error Response (400)
- **ClassCastException** - If the value of the given key is not a Boolean.
```

```APIDOC
## GET /document/boolean/{key}/defaultSupplier

### Description
Retrieves the value associated with the specified key as a Boolean, returning the value from a `BooleanSupplier` if the key is not found. Throws `ClassCastException` if the value is not a Boolean.

### Method
GET

### Endpoint
/document/boolean/{key}/defaultSupplier

### Parameters
#### Path Parameters
- **key** (String) - Required - The key whose associated value is to be returned.

#### Query Parameters
- **defaultValue** (BooleanSupplier) - Required - A supplier for the default boolean value.

### Request Example
(No request body for this example, parameters are path and query parameters)

### Response
#### Success Response (200)
- **Boolean** - The Boolean value associated with the key, or the value from the defaultValue supplier.

#### Response Example
```json
{
  "example": true
}
```

#### Error Response (400)
- **ClassCastException** - If the value of the given key is not a Boolean.
```

```APIDOC
## GET /document/int/{key}

### Description
Retrieves the value associated with the specified key as an Integer. Returns null if the key is not found. Throws `ClassCastException` if the value is not an Integer.

### Method
GET

### Endpoint
/document/int/{key}

### Parameters
#### Path Parameters
- **key** (String) - Required - The key whose associated value is to be returned.

### Request Example
(No request body for this example, parameter is a path parameter)

### Response
#### Success Response (200)
- **Integer** - The Integer value associated with the key, or null.

#### Response Example
```json
{
  "example": 42
}
```

#### Error Response (400)
- **ClassCastException** - If the value of the given key is not an Integer.
```

```APIDOC
## GET /document/int/{key}/default

### Description
Retrieves the value associated with the specified key as an int, returning a provided default value if the key is not found. Throws `ClassCastException` if the value is not an Integer.

### Method
GET

### Endpoint
/document/int/{key}/default

### Parameters
#### Path Parameters
- **key** (String) - Required - The key whose associated value is to be returned.

#### Query Parameters
- **defaultValue** (int) - Required - The default int value to return if the key is not found.

### Request Example
(No request body for this example, parameters are path and query parameters)

### Response
#### Success Response (200)
- **int** - The int value associated with the key, or the defaultValue.

#### Response Example
```json
{
  "example": 0
}
```

#### Error Response (400)
- **ClassCastException** - If the value of the given key is not an Integer.
```

```APIDOC
## GET /document/int/{key}/defaultSupplier

### Description
Retrieves the value associated with the specified key as an Integer, returning the value from an `IntSupplier` if the key is not found. Throws `ClassCastException` if the value is not an Integer.

### Method
GET

### Endpoint
/document/int/{key}/defaultSupplier

### Parameters
#### Path Parameters
- **key** (String) - Required - The key whose associated value is to be returned.

#### Query Parameters
- **defaultValue** (IntSupplier) - Required - A supplier for the default int value.

### Request Example
(No request body for this example, parameters are path and query parameters)

### Response
#### Success Response (200)
- **int** - The int value associated with the key, or the value from the defaultValue supplier.

#### Response Example
```json
{
  "example": 100
}
```

#### Error Response (400)
- **ClassCastException** - If the value of the given key is not an Integer.
```

--------------------------------

### UpdateResponse of

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/UpdateResponse

A static factory method that creates an UpdateResponse instance based on the given result status. Introduced in version 4.4 for simplified instantiation.

```APIDOC
## POST /UpdateResponse/of

### Description
Static factory method to create an UpdateResponse instance with the given result. Available since version 4.4.

### Method
Static Factory

### Endpoint
/of

### Parameters
#### Request Body
- **result** (UpdateResponse.Result) - Required - The result status to associate with the response.

### Request Example
```
UpdateResponse.of(UpdateResponse.Result.CREATED)
```

### Response
#### Success Response (200)
- **result** (UpdateResponse.Result) - The created response with the specified result.

#### Response Example
```
{
  "result": "CREATED"
}
```
```

--------------------------------

### Stream search results with SearchForStream (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchOperations

Executes a Query and provides a SearchHitsIterator for scrolling through large result sets. Requires proper resource handling via try-with-resources to close the iterator. Overload includes index coordinates for targeted searches.

```Java
<T> SearchHitsIterator<T> searchForStream(Query query, Class<T> clazz)
```

```Java
<T> SearchHitsIterator<T> searchForStream(Query query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### default searchForHits(Query query, Class<T> entityType, IndexCoordinates index)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Perform a search and return the ReactiveSearchHits which contains information about the search results and which will provide the documents by the ReactiveSearchHits.getSearchHits() method. This is a default method with overloads available.

```APIDOC
## default searchForHits(Query query, Class<T> entityType, IndexCoordinates index)

### Description
Perform a search and return the `ReactiveSearchHits` which contains information about the search results and which will provide the documents by the `ReactiveSearchHits.getSearchHits()` method.

### Method
Mono<ReactiveSearchHits<T>> searchForHits(Query query, Class<T> entityType, IndexCoordinates index)

### Endpoint
searchForHits

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **query** (Query) - Required - The search query, must not be null
- **entityType** (Class<T>) - Required - The result type class, must not be null
- **index** (IndexCoordinates) - Required - The target index, must not be null

### Request Example
searchForHits(query, entityType, index)

### Response
#### Success Response (Mono)
- **ReactiveSearchHits<T>** - A Mono emitting the ReactiveSearchHits that contains the search result information

#### Response Example
Mono<ReactiveSearchHits<Entity>>
```

--------------------------------

### ElasticsearchPersistentEntity Usage Overview

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/class-use/ElasticsearchPersistentEntity

This section provides a summary of how ElasticsearchPersistentEntity is used. It outlines methods that return or accept ElasticsearchPersistentEntity across various packages, including core, convert, index, mapping, routing, and repository query components.

```APIDOC
## ElasticsearchPersistentEntity Usage Overview

### Description
This section provides a summary of how ElasticsearchPersistentEntity is used. It outlines methods that return or accept ElasticsearchPersistentEntity across various packages, including core, convert, index, mapping, routing, and repository query components.

### Method
N/A

### Endpoint
N/A

### Parameters
N/A

### Request Body
N/A

### Response
#### Overview
- ElasticsearchPersistentEntity<?> methods and constructors are utilized across multiple packages within Spring Data Elasticsearch.
```

--------------------------------

### Define ReactiveAfterLoadCallback interface in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/event/ReactiveAfterLoadCallback

This functional interface can be implemented with a lambda or method reference to handle post‑load processing of Elasticsearch documents in a reactive manner. It extends EntityCallback<Document> and declares a single method that returns a Publisher<Document>, allowing asynchronous modifications. Implementations receive the original Document, its target type, and index coordinates.

```Java
@FunctionalInterface
public interface ReactiveAfterLoadCallback<T> extends EntityCallback<Document> {
    Publisher<Document> onAfterLoad(Document document, Class<T> type, IndexCoordinates indexCoordinates);
}
```

--------------------------------

### POST /_flush

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint flushes the contents of one or more indices. It allows for specifying a function to build the FlushRequest.

```APIDOC
## POST /_flush

### Description
Flushes the contents of one or more indices.

### Method
POST

### Endpoint
/_flush

### Parameters
#### Query Parameters
- **index** (string) - Optional - Filters the flush by index.

### Request Example
{
  "index": "my_index"
}

### Response
#### Success Response (200)
- **Acknowledged** (boolean) - Indicates whether the flush operation was acknowledged.
```

--------------------------------

### POST / ReactiveChildTemplate.execute

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/class-use/ReactiveChildTemplate

Execute a callback with the Elasticsearch client and provide exception translation. This method allows for reactive operations using the new Elasticsearch client library.

```APIDOC
## POST / ReactiveChildTemplate.execute

### Description
Execute a callback with the Elasticsearch client and provide exception translation. This method allows for reactive operations using the new Elasticsearch client library.

### Method
`POST`

### Endpoint
`ReactiveChildTemplate.execute`

### Parameters
#### Request Body
- **callback** (ReactiveChildTemplate.ClientCallback) - Required - The callback to execute with the client

### Request Example
```java
reactiveChildTemplate.execute(callback -> {
    // client operations
    return result;
});
```

### Response
#### Success Response (200)
- **result** (Publisher<RESULT>) - The result of the callback execution

#### Response Example
```java
Mono<String> result = reactiveChildTemplate.execute(callback -> {
    return Mono.just("success");
});
```
```

--------------------------------

### Reindex documents from source to destination

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Copies documents from a source index/alias/data stream to a different destination index using a ReindexRequest. Returns a Mono emitting the ReindexResponse. The source and destination must differ.

```java
public Mono<ReindexResponse> reindex(ReindexRequest reindexRequest) {
    // implementation omitted
}
```

--------------------------------

### DELETE /_template/{template}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint is used to delete a template.  It allows for specifying a function to build the DeleteTemplateRequest.

```APIDOC
## DELETE /_template/{template}

### Description
Deletes a template.

### Method
DELETE

### Endpoint
/_template/{template}

### Parameters
#### Path Parameters
- **template** (string) - Required - The name of the template to delete.

### Request Example
{
  "template": "my_template"
}

### Response
#### Success Response (200)
- **Acknowledged** (boolean) - Indicates whether the template deletion was acknowledged.
```

--------------------------------

### Elasticsearch Sorting Settings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/Setting

Configure index sorting options, including fields, order, missing values, and modes.

```APIDOC
## PUT /indices/{indexName}/_settings (for dynamic sort settings)

### Description
Updates dynamic sorting settings for an existing Elasticsearch index. This allows for runtime adjustments to sorting behavior.

### Method
PUT

### Endpoint
/indices/{indexName}/_settings

### Parameters
#### Path Parameters
- **indexName** (string) - Required - The name of the index to update sorting settings for.

#### Request Body
- **index** (object) - Sorting settings to update.
  - **sort.field** (string) - The field to sort by. Can be an array for multi-field sorting.
  - **sort.order** (Setting.SortOrder) - The order of sorting (e.g., 'asc', 'desc'). Can be an array.
  - **sort.mode** (Setting.SortMode) - The mode for sorting (e.g., 'min', 'max'). Can be an array.
  - **sort.missing** (Setting.SortMissing) - Defines the missing value for sort fields. Can be an array.

### Request Example
```json
{
  "index": {
    "sort.field": ["timestamp", "_score"],
    "sort.order": ["asc", "desc"],
    "sort.mode": ["min", "max"],
    "sort.missing": ["_last", "_first"]
  }
}
```

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Indicates if the sorting settings update was acknowledged.

#### Response Example
```json
{
  "acknowledged": true
}
```

## GET /indices/{indexName}/_settings (for retrieving sort settings)

### Description
Retrieves the current sorting settings configured for an Elasticsearch index.

### Method
GET

### Endpoint
/indices/{indexName}/_settings

### Parameters
#### Path Parameters
- **indexName** (string) - Required - The name of the index to retrieve sorting settings for.

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **settings** (object) - Contains the index settings.
  - **index** (object)
    - **sort.field** (string[]) - The fields configured for index sorting.
    - **sort.order** (Setting.SortOrder[]) - The order defined for each sort field.
    - **sort.mode** (Setting.SortMode[]) - The mode defined for each sort field.
    - **sort.missing** (Setting.SortMissing[]) - The missing value definitions for each sort field.

#### Response Example
{
  "settings": {
    "index": {
      "sort.field": ["timestamp", "_score"],
      "sort.order": ["asc", "desc"],
      "sort.mode": ["min", "max"],
      "sort.missing": ["_last", "_first"]
    }
  }
}
```

--------------------------------

### AbstractElasticsearchTemplate.ReadSearchDocumentResponseCallback.doWith

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/SearchDocumentResponse

This method processes a SearchDocumentResponse and returns SearchHits.

```APIDOC
## POST /api/process-response

### Description
Processes a SearchDocumentResponse and returns SearchHits.

### Method
POST

### Endpoint
/api/process-response

### Parameters
#### Request Body
- **response** (SearchDocumentResponse) - Required - The search response to process.

### Request Example
{
  "response": {
    "hits": {
      "total": {
        "value": 1,
        "relation": "eq"
      },
      "hits": [
        {
          "_source": {
            "id": "1",
            "name": "Example Entity"
          }
        }
      ]
    }
  }
}

### Response
#### Success Response (200)
- **SearchHits<T>** (SearchHits<T>) - The processed search hits.

#### Response Example
{
  "hits": [
    {
      "id": "1",
      "name": "Example Entity"
    }
  ],
  "totalHits": 1
}
```

--------------------------------

### bulkIndex Method - Class-based

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/IndexedObjectInformation

Performs bulk indexing of objects using class type information for Elasticsearch operations.

```APIDOC
## bulkIndex Method - Class-based

### Description
Performs bulk indexing of objects using class type information for Elasticsearch operations.

### Method
POST

### Endpoint
bulkIndex(List<IndexQuery> queries, Class<?> clazz)

### Parameters
#### Path Parameters
- **queries** (List<IndexQuery>) - Required - List of index queries to be processed in bulk
- **clazz** (Class<?>) - Required - Target class type for indexing

#### Query Parameters
- **None**

#### Request Body
- **queries** (List<IndexQuery>) - Required - Collection of index queries
- **clazz** (Class<?>) - Required - Target entity class

### Request Example
{
  "queries": [
    {
      "id": "1",
      "object": {"field": "value"}
    }
  ],
  "clazz": "UserEntity"
}

### Response
#### Success Response (200)
- **indexedObjectInformation** (List<IndexedObjectInformation>) - List of indexed object information results

#### Response Example
{
  "indexedObjectInformation": [
    {
      "id": "1",
      "seqNo": 1,
      "primaryTerm": 1
    }
  ]
}
```

--------------------------------

### Index Information Retrieval - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

Method for retrieving index information for indices defined by index coordinates. This operation provides metadata about existing indices including their settings, mappings, and other configuration details.

```java
default List<IndexInformation> getInformation()
Gets the `IndexInformation` for the indices defined by `getIndexCoordinates()`.

Returns:
    a list of `IndexInformation`

Since:
    4.2
```

--------------------------------

### Analyze Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to analyze an Elasticsearch index reactively. The operation can be performed with a request object or a builder function, or without any parameters.

```Java
Mono<co.elastic.clients.elasticsearch.indices.AnalyzeResponse> analyze()
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.AnalyzeResponse> analyze(co.elastic.clients.elasticsearch.indices.AnalyzeRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.AnalyzeResponse> analyze(Function<co.elastic.clients.elasticsearch.indices.AnalyzeRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.AnalyzeRequest>> fn)
```

--------------------------------

### Update documents by query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Executes an update operation on all documents matching the given UpdateQuery within the target index. Returns a Mono emitting a ByQueryResponse with details about the update outcome.

```java
public Mono<ByQueryResponse> updateByQuery(UpdateQuery updateQuery, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Create an ids query to retrieve documents by IDs in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Builds a Query that selects documents with the specified list of IDs. The ids list must not be null. Returns a Query object configured with the given IDs.

```Java
Query idsQuery(List<String> ids);
```

--------------------------------

### POST /api/elasticsearch/bulk-index

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/class-use/IndexCoordinates

Performs bulk indexing of multiple documents in the specified index.

```APIDOC
## POST /api/elasticsearch/bulk-index

### Description
Performs bulk indexing of multiple documents in the specified index.

### Method
POST

### Endpoint
/api/elasticsearch/bulk-index

### Parameters
#### Path Parameters
- **index** (IndexCoordinates) - Required - The index to bulk index documents into.
- **queries** (List<IndexQuery>) - Required - The list of documents to index.
- **bulkOptions** (BulkOptions) - Optional - Options for the bulk operation.

### Response
#### Success Response (200)
- **results** (List<IndexedObjectInformation>) - Information about the indexed documents.

#### Response Example
{
  "results": [
    {
      "id": "1",
      "version": 1,
      "seqNo": 0,
      "primaryTerm": 1
    }
  ]
}
```

--------------------------------

### Document Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/package-use

Provides the methods for performing CRUD (Create, Read, Update, Delete) operations on documents within Elasticsearch.

```APIDOC
## DocumentOperations

### Description
This interface provides the operations for the Elasticsearch Document APIs, allowing for the management of individual documents.

### Method
N/A (Interface Definition)

### Endpoint
N/A (Interface Definition)

### Parameters
N/A (Interface Definition)

### Request Example
N/A (Interface Definition)

### Response
N/A (Interface Definition)
```

--------------------------------

### Create Query Builder with IDs using Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Creates a `BaseQueryBuilder` pre-configured with a list of document IDs. This builder can then be further customized before executing the query.

```java
public BaseQueryBuilder queryBuilderWithIds(List<String> ids)
```

--------------------------------

### POST open

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Opens a closed index in Elasticsearch. This operation makes a previously closed index available for read and write operations again.

```APIDOC
## POST open

### Description
Opens a closed index in Elasticsearch

### Method
POST

### Endpoint
/{index}/_open

### Parameters
#### Path Parameters
- **index** (string) - Required - Name of the index to open

#### Query Parameters
- **timeout** (time) - Optional - Time to wait for the operation to complete

### Request Example
{
  "index": "my-closed-index"
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged
- **shards_acknowledged** (boolean) - Whether shards were acknowledged

#### Response Example
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```

--------------------------------

### ElasticsearchAuditingBeanDefinitionParser API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/config/ElasticsearchAuditingBeanDefinitionParser

This section details the ElasticsearchAuditingBeanDefinitionParser class, which is used to register an AuditingEntityCallback for transparently setting auditing information on an entity.

```APIDOC
## ElasticsearchAuditingBeanDefinitionParser

### Description
This class is a `BeanDefinitionParser` to register a `AuditingEntityCallback` to transparently set auditing information on an entity.

### Method
Java class

### Endpoint
N/A (Class Definition)

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
N/A

#### Response Example
N/A

```

--------------------------------

### Implement AutoCloseable Elasticsearch Client in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/AutoCloseableElasticsearchClient

Defines a Java class extending ElasticsearchClient and implementing AutoCloseable. Includes a constructor for injecting ElasticsearchTransport and a close method that releases underlying resources, throwing IOException if needed.

```java
public class AutoCloseableElasticsearchClient extends co.elastic.clients.elasticsearch.ElasticsearchClient implements AutoCloseable {
    private final co.elastic.clients.transport.ElasticsearchTransport transport;

    public AutoCloseableElasticsearchClient(co.elastic.clients.transport.ElasticsearchTransport transport) {
        super(transport);
        this.transport = transport;
    }

    @Override
    public void close() throws java.io.IOException {
        // Close underlying resources
        transport.close();
    }
}
```

--------------------------------

### Check Index Existence Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods for verifying existence of indices, aliases, templates, and index templates. Returns Mono<BooleanResponse> indicating presence status. Supports both direct request objects and builder functions.

```java
// Check Index Exists
public Mono<BooleanResponse> exists(co.elastic.clients.elasticsearch.indices.ExistsRequest request)
public Mono<BooleanResponse> exists(Function<ExistsRequest.Builder, ObjectBuilder<ExistsRequest>> fn)

// Check Alias Exists
public Mono<BooleanResponse> existsAlias(co.elastic.clients.elasticsearch.indices.ExistsAliasRequest request)
public Mono<BooleanResponse> existsAlias(Function<ExistsAliasRequest.Builder, ObjectBuilder<ExistsAliasRequest>> fn)

// Check Index Template Exists
public Mono<BooleanResponse> existsIndexTemplate(co.elastic.clients.elasticsearch.indices.ExistsIndexTemplateRequest request)
public Mono<BooleanResponse> existsIndexTemplate(Function<ExistsIndexTemplateRequest.Builder, ObjectBuilder<ExistsIndexTemplateRequest>> fn)

// Check Template Exists
public Mono<BooleanResponse> existsTemplate(co.elastic.clients.elasticsearch.indices.ExistsTemplateRequest request)
public Mono<BooleanResponse> existsTemplate(Function<ExistsTemplateRequest.Builder, ObjectBuilder<ExistsTemplateRequest>> fn)
```

--------------------------------

### POST putSettings

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Updates the settings for one or more indices in Elasticsearch. This operation allows you to modify index-level settings such as number of replicas, refresh intervals, and custom settings.

```APIDOC
## POST putSettings

### Description
Updates the settings for one or more indices in Elasticsearch

### Method
POST

### Endpoint
/{index}/_settings

### Parameters
#### Path Parameters
- **index** (string) - Required - Name of the index (supports wildcards)

#### Query Parameters
- **preserve_existing** (boolean) - Optional - Whether to preserve existing settings

#### Request Body
- **index** (object) - Required - Index settings object
- **number_of_replicas** (number) - Optional - Number of replica shards
- **refresh_interval** (string) - Optional - Refresh interval for the index

### Request Example
{
  "index": {
    "number_of_replicas": 2,
    "refresh_interval": "30s"
  }
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### queryBuilderWithIds(List<String> ids)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Creates a BaseQueryBuilder with the given ids set. No other properties are set.

```APIDOC
## queryBuilderWithIds(List<String> ids)

### Description
Creates a `BaseQueryBuilder` that has the given ids setto the parameter value. No other properties of the bulder are set.

### Method
BaseQueryBuilder queryBuilderWithIds(List<String> ids)

### Endpoint
queryBuilderWithIds

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **ids** (List<String>) - Required - The list of ids, must not be null

### Request Example
queryBuilderWithIds(ids)

### Response
#### Success Response
- **BaseQueryBuilder** - A query builder with the given ids set

#### Response Example
BaseQueryBuilder
```

--------------------------------

### Elasticsearch Persistent Entity - Configuration

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Access and determine configuration settings for Elasticsearch persistent entities, including server configuration usage, type hints, dynamic mapping, and ID storage.

```APIDOC
## GET /api/elasticsearch/entity/configuration

### Description
Retrieves configuration details for Elasticsearch persistent entities. This includes whether server configuration is used, whether type hints should be written, the dynamic mapping parameter, and whether the document ID should be stored in the source.

### Method
GET

### Endpoint
/api/elasticsearch/entity/configuration

### Parameters
#### Query Parameters
- **entityName** (string) - Required - The name of the persistent entity.

### Response
#### Success Response (200)
- **useServerConfiguration** (boolean) - True if server configuration should be used.
- **writeTypeHints** (boolean) - True if type hints should be written.
- **dynamic** (Dynamic) - The dynamic mapping parameter value.
- **storeIdInSource** (boolean) - True if the document ID should be stored in the source.

#### Response Example
{
  "useServerConfiguration": true,
  "writeTypeHints": false,
  "dynamic": "true",
  "storeIdInSource": false
}
```

--------------------------------

### UnsupportedBackendOperation Exception

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/UnsupportedBackendOperation

Documentation for the UnsupportedBackendOperation exception in Spring Data Elasticsearch. This exception is thrown when a backend implementation does not support a specific operation.

```APIDOC
## UnsupportedBackendOperation

### Description
Exception to be thrown by a backend implementation on operations that are not supported for that backend.

### Method
Exception

### Endpoint
N/A

### Parameters
#### Path Parameters
- N/A

#### Query Parameters
- N/A

#### Request Body
- N/A

### Request Example
N/A

### Response
#### Success Response (200)
- N/A

#### Response Example
N/A
```

--------------------------------

### Index a single entity with ReactiveElasticsearchTemplate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Indexes the given entity into the specified index using a reactive Mono. The method returns a Tuple2 containing the original entity and indexing metadata. It is protected and used internally by higher‑level operations.

```java
protected <T> Mono<Tuple2<T,AbstractReactiveElasticsearchTemplate.IndexResponseMetaData>> doIndex(T entity, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Index Deletion API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

API for deleting an existing index.

```APIDOC
## DELETE /indices/{indexName}

### Description
Deletes the index this `IndexOperations` is bound to.

### Method
DELETE

### Endpoint
/indices/{indexName}

### Response
#### Success Response (200)
- **boolean** - true if the index was deleted

#### Response Example
```json
{
  "acknowledged": true
}
```
```

--------------------------------

### Standard Map Operations for Document

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Implements standard Java Map interface methods for document interaction. These include checking size, emptiness, key/value containment, retrieval, insertion, removal, bulk operations, clearing, and accessing key sets, values, and entries.

```java
public int size()
public boolean isEmpty()
public boolean containsKey(Object key)
public boolean containsValue(Object value)
public Object get(Object key)
public Object put(String key, Object value)
public Object remove(Object key)
public void putAll(Map<? extends String,?> m)
public void clear()
public Set<String> keySet()
public Collection<Object> values()
public Set<Map.Entry<String,Object>> entrySet()
public boolean remove(Object key, Object value)
```

--------------------------------

### bulkIndex

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Bulk index all objects. Will do save or update. Returns information about the indexed objects.

```APIDOC
## POST /_bulk

### Description
Bulk index all objects. Will do save or update.

### Method
POST

### Endpoint
/_bulk

### Parameters
#### Request Body
- **queries** (List<IndexQuery>) - Required - The queries to execute in bulk
- **bulkOptions** (BulkOptions) - Optional - Options to be added to the bulk request
- **index** (IndexCoordinates) - Required - The target index

### Response
#### Success Response (200)
- **IndexedObjectInformation[]** (List) - Information about the indexed objects
```

--------------------------------

### Execute criteria search query (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchOperations

Runs a single Query and maps results to SearchHits of the specified entity type. Overloads allow specifying index coordinates or using MoreLikeThisQuery. Returns SearchHits containing matching documents.

```Java
<T> SearchHits<T> search(Query query, Class<T> clazz)
```

```Java
<T> SearchHits<T> search(Query query, Class<T> clazz, IndexCoordinates index)
```

```Java
<T> SearchHits<T> search(MoreLikeThisQuery query, Class<T> clazz)
```

```Java
<T> SearchHits<T> search(MoreLikeThisQuery query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### idsQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

The idsQuery method generates a Query to find documents by a list of IDs. It is defined in the ReactiveSearchOperations interface and requires the IDs list to be non-null.

```APIDOC
## idsQuery

### Description
Creates a `Query` to find get all documents with given ids. Must be implemented by the concrete implementations to provide an appropriate query using the respective client.

### Method Signature
public Query idsQuery(List<String> ids)

### Parameters
- **ids** (List<String>) - Required - the list of ids must not be null

### Returns
Query - query returning the documents with the given ids

### Response Example
A Query object configured to retrieve documents matching the provided IDs.
```

--------------------------------

### Submit a reindex task asynchronously

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Submits a reindex operation as a background task and returns a Mono emitting the generated task ID. Useful for long‑running reindex processes. The request parameters are provided via a ReindexRequest.

```java
public Mono<String> submitReindex(ReindexRequest reindexRequest) {
    // implementation omitted
}
```

--------------------------------

### bulkIndex Method - Coordinates-based

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/IndexedObjectInformation

Performs bulk indexing of objects using index coordinates for Elasticsearch operations.

```APIDOC
## bulkIndex Method - Coordinates-based

### Description
Performs bulk indexing of objects using index coordinates for Elasticsearch operations.

### Method
POST

### Endpoint
bulkIndex(List<IndexQuery> queries, IndexCoordinates index)

### Parameters
#### Path Parameters
- **queries** (List<IndexQuery>) - Required - List of index queries to be processed in bulk
- **index** (IndexCoordinates) - Required - Index coordinates specifying target index

#### Query Parameters
- **None**

#### Request Body
- **queries** (List<IndexQuery>) - Required - Collection of index queries
- **index** (IndexCoordinates) - Required - Target index coordinates

### Request Example
{
  "queries": [
    {
      "id": "1",
      "object": {"field": "value"}
    }
  ],
  "index": "my-index"
}

### Response
#### Success Response (200)
- **indexedObjectInformation** (List<IndexedObjectInformation>) - List of indexed object information results

#### Response Example
{
  "indexedObjectInformation": [
    {
      "id": "1",
      "seqNo": 1,
      "primaryTerm": 1
    }
  ]
}
```

--------------------------------

### Bulk Update Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Enables bulk updating of multiple documents using UpdateQuery objects. This method applies updates to documents based on the provided queries and class type. No return value is specified for this operation.

```java
void
bulkUpdate(List<UpdateQuery> queries, Class<?> clazz)

```

--------------------------------

### Index Template Operations - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

Methods for managing index templates in Elasticsearch. Index templates define settings, mappings, and aliases for indices matching certain patterns. Methods support both simple string parameters and request object patterns for flexibility.

```java
boolean existsIndexTemplate(String templateName)
check if an index template exists.

Parameters:
    `templateName` - the template name

Returns:
    true if the index template exists

Since:
    5.1
```

```java
boolean existsIndexTemplate(ExistsIndexTemplateRequest existsTemplateRequest)
check if an index template exists.

Parameters:
    `existsTemplateRequest` - the request parameters

Returns:
    true if the index template exists

Since:
    5.1
```

```java
List<TemplateResponse> getIndexTemplate(String templateName)
Gets an index template.

Parameters:
    `templateName` - template name

Since:
    5.1
```

```java
List<TemplateResponse> getIndexTemplate(GetIndexTemplateRequest getIndexTemplateRequest)
Gets an index template.

Parameters:
    `getIndexTemplateRequest` - the request parameters

Since:
    5.1
```

```java
boolean deleteIndexTemplate(String templateName)
Deletes an index template.

Parameters:
    `templateName` - template name

Returns:
    true if successful

Since:
    5.1
```

```java
boolean deleteIndexTemplate(DeleteIndexTemplateRequest deleteIndexTemplateRequest)
Deletes an index template.

Parameters:
    `deleteIndexTemplateRequest` - template request parameters

Returns:
    true if successful

Since:
    5.1
```

--------------------------------

### PUT /convert/query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint updates a query using the Elasticsearch converter.

```APIDOC
## PUT /convert/query

### Description
This endpoint updates a query using the Elasticsearch converter.

### Method
PUT

### Endpoint
/convert/query

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (Query) - Required - The Elasticsearch query to update.
- **domainClass** (Class<?>) - Required - The domain class associated with the query.

### Request Example
{
  "query": {
    "match_all": {}
  },
  "domainClass": MyEntity.class
}

### Response
#### Success Response (200)
- None (void)
```

--------------------------------

### Open a point-in-time (PIT) context in Elasticsearch using Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Creates a point-in-time identifier for a given index with a specified keep-alive duration. Overload allows ignoring unavailable indices. Returns a Mono emitting the PIT identifier string.

```Java
default Mono<String> openPointInTime(IndexCoordinates index, Duration keepAlive);
```

```Java
Mono<String> openPointInTime(IndexCoordinates index, Duration keepAlive, Boolean ignoreUnavailable);
```

--------------------------------

### Create Match All Query using Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Generates a `Query` object that matches all documents within an index. This is a fundamental query used for retrieving all data.

```java
public Query matchAllQuery()
```

--------------------------------

### getAliases() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the array of aliases.

```APIDOC
## getAliases()

### Description
Retrieves the array of aliases.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **aliases** (String[]) - The array of aliases.

#### Response Example
N/A
```

--------------------------------

### DELETE /template/{template}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint is used to delete an index template. It allows for specifying a function to build the DeleteIndexTemplateRequest.

```APIDOC
## DELETE /template/{template}

### Description
Deletes an index template.

### Method
DELETE

### Endpoint
/template/{template}

### Parameters
#### Path Parameters
- **template** (string) - Required - The name of the index template to delete.

### Request Example
{
  "template": "my_template"
}

### Response
#### Success Response (200)
- **Acknowledged** (boolean) - Indicates whether the index template deletion was acknowledged.
```

--------------------------------

### Put Component Template in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Writes a component index template that can be used in a composable index template. Requires a PutComponentTemplateRequest object as input and returns a boolean indicating success.

```Java
public boolean putComponentTemplate(PutComponentTemplateRequest putComponentTemplateRequest)
```

--------------------------------

### getHidden() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the hidden status.

```APIDOC
## getHidden()

### Description
Retrieves the hidden status.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **hidden** (Boolean) - The hidden status.

#### Response Example
N/A
```

--------------------------------

### hasVersion Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Checks if the document is associated with a version.

```APIDOC
## Method

### hasVersion
public boolean hasVersion()

### Description
Returns true if the document is associated with a version.

### Returns
- true if the document has a version, false otherwise.
```

--------------------------------

### Add and Retrieve Runtime Fields in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Define and manage runtime fields for Elasticsearch queries. These fields are computed on the fly during search. `getRuntimeFields()` returns the list of configured runtime fields.

```java
public void addRuntimeField(RuntimeField runtimeField)
public List<RuntimeField> getRuntimeFields()
```

--------------------------------

### Build IndexQuery in Java with Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/IndexQueryBuilder

The IndexQueryBuilder class provides methods to construct IndexQuery objects for Elasticsearch operations. It supports setting various parameters such as ID, object, version, source, routing, and operation type.

```Java
IndexQueryBuilder builder = new IndexQueryBuilder();
IndexQuery query = builder.withId("id123")
                         .withObject(new Object())
                         .withVersion(1L)
                         .withSource("source")
                         .withRouting("routing")
                         .withOpType(IndexQuery.OpType.INDEX)
                         .build();
```

--------------------------------

### Suggest.Suggestion Class Definition (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/Suggest

Defines the abstract static class Suggest.Suggestion, which represents a suggestion in Elasticsearch. It includes constructors and methods for retrieving suggestion details like name, size, and entries. This class serves as a base for specific suggestion types.

```java
public abstract static class Suggest.Suggestion<E extends Suggest.Suggestion.Entry<? extends Suggest.Suggestion.Entry.Option>> extends Object

  // Nested Class Summary
  static class Suggest.Suggestion.Entry<O extends Suggest.Suggestion.Entry.Option>

  // Constructor Summary
  Suggestion(String name, int size, List<E> entries)

  // Method Summary
  List<E> getEntries()
  String getName()
  int getSize()

  // Constructor Details
  public Suggestion(String name, int size, List<E> entries)

  // Method Details
  public String getName()
  public int getSize()
  public List<E> getEntries()
```

--------------------------------

### Define EnableReactiveElasticsearchAuditing annotation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/config/EnableReactiveElasticsearchAuditing

Java annotation for enabling auditing in Elasticsearch using reactive infrastructure. Provides configuration options for auditor awareness, date/time providers, and entity modification behavior. Requires Spring Data Elasticsearch 4.1 or later.

```java
@Inherited @Documented @Target(TYPE) @Retention(RUNTIME) @Import(org.springframework.data.elasticsearch.config.ReactiveElasticsearchAuditingRegistrar.class) public @interface EnableReactiveElasticsearchAuditing {
    String auditorAwareRef() default "";
    String dateTimeProviderRef() default "";
    boolean modifyOnCreate() default true;
    boolean setDates() default true;
}
```

--------------------------------

### Indices Update Aliases

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Updates index aliases.

```APIDOC
## POST /_update_aliases

### Description
Updates index aliases.

### Method
POST

### Endpoint
/_update_aliases

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **actions** (array) - Required - An array of actions to perform.

### Request Example
{
  "actions": [
    {
      "add": {
        "alias": "my_alias",
        "index": "my-index"
      }
    }
  ]
}

### Response
#### Success Response (200)
- **updated_aliases** (object) - Updated aliases information.
```

--------------------------------

### Create data stream in Elasticsearch reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to create a data stream in Elasticsearch reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.CreateDataStreamResponse> createDataStream(co.elastic.clients.elasticsearch.indices.CreateDataStreamRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.CreateDataStreamResponse> createDataStream(Function<co.elastic.clients.elasticsearch.indices.CreateDataStreamRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.CreateDataStreamRequest>> fn)
```

--------------------------------

### Execute criteria query and return SearchHits in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Executes a generic Query (criteria-based or other) and returns typed search hits. Used for standard search operations. Input: Query; entity class. Output: SearchHits<T>. Limitation: concrete execution is delegated to protected abstract methods.

```java
public <T> SearchHits<T> search(Query query, Class<T> clazz)
```

--------------------------------

### POST putAlias

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Creates or updates an index alias in Elasticsearch. Aliases provide a way to reference one or more indices with a single name, useful for implementing zero-downtime reindexing strategies.

```APIDOC
## POST putAlias

### Description
Creates or updates an index alias in Elasticsearch

### Method
POST

### Endpoint
/{index}/_alias/{alias}

### Parameters
#### Path Parameters
- **index** (string) - Required - Name of the index
- **alias** (string) - Required - Name of the alias

#### Query Parameters
None

#### Request Body
- **filter** (object) - Optional - Query to filter documents
- **index_routing** (string) - Optional - Routing value for indexing
- **search_routing** (string) - Optional - Routing value for search

### Request Example
{
  "filter": {
    "term": {
      "status": "active"
    }
  }
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### More Like This query search in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Executes a MoreLikeThisQuery to find documents similar to a reference document or text. Accepts an optional IndexCoordinates to override the index derived from the class. Inputs: MoreLikeThisQuery; entity class; optional IndexCoordinates. Output: SearchHits<T> containing similar documents. Limitation: similarity depends on analyzed text fields and MLT parameters.

```java
public <T> SearchHits<T> search(MoreLikeThisQuery query, Class<T> clazz)
```

```java
public <T> SearchHits<T> search(MoreLikeThisQuery query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### Implement Specific Suggestion Option Subclasses

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/class-use/Suggest.Suggestion.Entry

Concrete implementations of suggestion option subclasses for different Elasticsearch suggestion types. Each handles specific data structures for completion, phrase, and term suggestions.

```java
public static class CompletionSuggestion.Entry.Option<T> {}

public static class PhraseSuggestion.Entry.Option {}

public static class TermSuggestion.Entry.Option {}
```

--------------------------------

### queryBuilderWithIds

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

The queryBuilderWithIds method creates a BaseQueryBuilder with specified IDs. It sets only the IDs parameter and is implemented via the ReactiveSearchOperations interface.

```APIDOC
## queryBuilderWithIds

### Description
Creates a `BaseQueryBuilder` that has the given ids setto the parameter value. No other properties of the bulder are set.

### Method Signature
public BaseQueryBuilder queryBuilderWithIds(List<String> ids)

### Parameters
- **ids** (List<String>) - Required - the list of ids must not be null

### Returns
BaseQueryBuilder - query returning the documents with the given ids

### Response Example
A BaseQueryBuilder instance initialized with the specified IDs.
```

--------------------------------

### Index Existence Check API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

API to check if an index exists.

```APIDOC
## GET /indices/{indexName}/exists

### Description
Checks if the index this IndexOperations is bound to exists.

### Method
GET

### Endpoint
/indices/{indexName}/exists

### Response
#### Success Response (200)
- **boolean** - true if the index exists

#### Response Example
```json
{
  "exists": true
}
```
```

--------------------------------

### Build Delete Query in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/DeleteQuery

Builds the DeleteQuery object based on the configured parameters. This is the final step in constructing a delete query.

```java
public DeleteQuery build()
```

--------------------------------

### @EnableElasticsearchAuditing Annotation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/config/EnableElasticsearchAuditing

Annotation to enable auditing in Elasticsearch via annotation configuration. Provides options to customize auditor awareness, date handling, and modification tracking.

```APIDOC
## @EnableElasticsearchAuditing

### Description
Annotation to enable auditing in Elasticsearch via annotation configuration.

### Optional Elements
- **auditorAwareRef** (String) - Optional - Configures the `AuditorAware` bean to be used to lookup the current principal. Default: ""
- **dateTimeProviderRef** (String) - Optional - Configures a `DateTimeProvider` bean name for customizing date/time used for setting creation/modification dates. Default: ""
- **modifyOnCreate** (boolean) - Optional - Configures whether the entity shall be marked as modified on creation. Default: true
- **setDates** (boolean) - Optional - Configures whether the creation and modification dates are set. Default: true

### Author
Peter-Josef Meisch

### Since
4.0
```

--------------------------------

### Convert Java collection to Elasticsearch query string

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/support/value/ElasticsearchCollectionValueToStringConverter

Java implementation of the ElasticsearchCollectionValueToStringConverter. Includes constructor, type-conversion method, and required interface methods.

```java
public class ElasticsearchCollectionValueToStringConverter extends Object implements GenericConverter {\n  public ElasticsearchCollectionValueToStringConverter(ConversionService conversionService) { }\n  public Set<GenericConverter.ConvertiblePair> getConvertibleTypes() { return null; }\n  @Nullable public Object convert(@Nullable Object source, TypeDescriptor sourceType, TypeDescriptor targetType) { return null; }\n}
```

--------------------------------

### EXISTS /

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Checks if an index exists. This endpoint is used to verify if an index with the specified name exists in the Elasticsearch cluster.

```APIDOC
## EXISTS /

### Description
Checks whether an index exists.

### Method
GET

### Endpoint
/

### Parameters
#### Path Parameters
- **index** (string) - Required - The name of the index to check.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "index": "my_index"
  }
}

### Response
#### Success Response (200)
- **response** (boolean) - True if the index exists, false otherwise.
```

--------------------------------

### POST /reload_search_analyzers

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Reloads search analyzers for one or more indices. This is useful when you've updated analyzer configurations and want to apply changes immediately.

```APIDOC
## POST /reload_search_analyzers

### Description
Reloads search analyzers for one or more indices. This is useful when you've updated analyzer configurations and want to apply changes immediately.

### Method
POST

### Endpoint
/reload_search_analyzers

### Parameters
#### Request Body
- **request** (ReloadSearchAnalyzersRequest) - Required - Request object specifying indices to reload analyzers for

### Response
#### Success Response (200)
- **ReloadSearchAnalyzersResponse** (object) - Response containing reload operation result

#### Response Example
{
  "reload_details": []
}
```

--------------------------------

### Legacy Template Operations - Java (Deprecated)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

Deprecated methods for managing legacy Elasticsearch templates. These methods use the legacy Elasticsearch interface which has been deprecated since Elasticsearch 5.1. Legacy template operations should be replaced with modern index template operations. All methods in this category are deprecated and return TemplateData or boolean results.

```java
@Deprecated @Nullable default TemplateData getTemplate(String templateName)
Deprecated.
since 5.1, as the underlying Elasticsearch API is deprecated.
gets an index template using the legacy Elasticsearch interface.

Parameters:
    `templateName` - the template name

Returns:
    TemplateData, null if no template with the given name exists.

Since:
    4.1
```

```java
@Deprecated @Nullable TemplateData getTemplate(GetTemplateRequest getTemplateRequest)
Deprecated.
since 5.1, as the underlying Elasticsearch API is deprecated.
gets an index template using the legacy Elasticsearch interface.

Parameters:
    `getTemplateRequest` - the request parameters

Returns:
    TemplateData, null if no template with the given name exists.

Since:
    4.1
```

```java
@Deprecated default boolean existsTemplate(String templateName)
Deprecated.
since 5.1, as the underlying Elasticsearch API is deprecated.
check if an index template exists using the legacy Elasticsearch interface.

Parameters:
    `templateName` - the template name

Returns:
    true if the index exists

Since:
    4.1
```

```java
@Deprecated boolean existsTemplate(ExistsTemplateRequest existsTemplateRequest)
Deprecated.
since 5.1, as the underlying Elasticsearch API is deprecated.
check if an index template exists using the legacy Elasticsearch interface.

Parameters:
    `existsTemplateRequest` - the request parameters

Returns:
    true if the index exists

Since:
    4.1
```

```java
@Deprecated default boolean deleteTemplate(String templateName)
Deprecated.
since 5.1, as the underlying Elasticsearch API is deprecated.
Deletes an index template using the legacy Elasticsearch interface (@see https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-templates-v1.html).

Parameters:
    `templateName` - the template name

Returns:
    true if successful

Since:
    4.1
```

```java
@Deprecated boolean deleteTemplate(DeleteTemplateRequest deleteTemplateRequest)
Deprecated.
since 5.1, as the underlying Elasticsearch API is deprecated.
Deletes an index template using the legacy Elasticsearch interface (@see https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-templates-v1.html).

Parameters:
    `deleteTemplateRequest` - template request parameters

Returns:
    true if successful

Since:
    4.1
```

--------------------------------

### POST /search/hits

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

This endpoint retrieves search results using a provided query and entity type, returning a ReactiveSearchHits object containing information about the search results. The ReactiveSearchHits object provides access to the actual documents through its getSearchHits() method.

```APIDOC
## POST /search/hits

### Description
This endpoint retrieves search results using a provided query and entity type, returning a ReactiveSearchHits object containing information about the search results. The ReactiveSearchHits object provides access to the actual documents through its getSearchHits() method.

### Method
POST

### Endpoint
/search/hits

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (Query) - Required - The Elasticsearch query to execute.
- **entityType** (Class<T>) - Required - The type of entity to return.
- **index** (IndexCoordinates) - Optional - The index to search.

### Request Example
{
  "query": {
    "match_all": {}
  },
  "entityType": "MyEntity"
}

### Response
#### Success Response (200)
- **ReactiveSearchHits<T>** - Contains information about the search results and the documents.
```

--------------------------------

### getSeqNo Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the sequence number associated with the document.

```APIDOC
## Method

### getSeqNo
public long getSeqNo()

### Description
Retrieves the sequence number associated with the document.

### Returns
- The sequence number as a long value.
```

--------------------------------

### getIndex Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the index associated with the document.

```APIDOC
## Method

### getIndex
public String getIndex()

### Description
Returns the index if this document was retrieved from an index or was just stored.

### Returns
- The index name as a String.
```

--------------------------------

### Retrieve a document by ID

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Fetches a single document identified by its ID from the specified index and maps it to the given entity type. Returns a Mono emitting the entity or completing empty if not found. All parameters are required.

```java
public <T> Mono<T> get(String id, Class<T> entityType, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### hasAnnotatedQuery Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks if the method is annotated with the `Query` annotation.

```APIDOC
## Method

### Description
Checks if the method is annotated with the `Query` annotation.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if the method is annotated with the `Query` annotation.

#### Response Example
N/A
```

--------------------------------

### GeoPoint Constructor and Getters

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/geo/GeoPoint

The GeoPoint class provides a constructor to initialize latitude and longitude, and getter methods to retrieve them. It is used for geo-location in Elasticsearch criteria.

```java
public class GeoPoint extends Object {
    public GeoPoint(double latitude, double longitude) {
        // Constructor implementation
    }

    public double getLat() {
        // Returns latitude
    }

    public double getLon() {
        // Returns longitude
    }
}
```

--------------------------------

### Execute SQL Query against Elasticsearch using Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Executes a given SQL query against Elasticsearch and returns the result as a `SqlResponse`. This allows leveraging SQL for data retrieval.

```java
public SqlResponse search(SqlQuery query)
```

--------------------------------

### idsQuery(List<String> ids)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Creates a Query to find all documents with the given ids. This method must be implemented by concrete classes.

```APIDOC
## idsQuery(List<String> ids)

### Description
Creates a `Query` to find get all documents with given ids. Must be implemented by the concrete implementations to provide an appropriate query using the respective client.

### Method
Query idsQuery(List<String> ids)

### Endpoint
idsQuery

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **ids** (List<String>) - Required - The list of ids, must not be null

### Request Example
idsQuery(ids)

### Response
#### Success Response
- **Query** - A query returning the documents with the given ids

#### Response Example
Query
```

--------------------------------

### Indices Split

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Splits an index into multiple sub-indices.

```APIDOC
## POST /_split

### Description
Splits an index into multiple sub-indices.

### Method
POST

### Endpoint
/_split

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **index** (string) - Required - Name of the index to split.

### Request Example
{
  "index": "my-index"
}

### Response
#### Success Response (200)
- **split_index** (string) - Name of the new split index.
```

--------------------------------

### Indices Shard Stores

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint retrieves shard stores for specified indices. It allows for customization using a function to build the request.

```APIDOC
## POST /_shard_stores

### Description
Retrieves shard stores for specified indices.

### Method
POST

### Endpoint
/_shard_stores

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "example": "(builder -> builder.build())"
}

### Response
#### Success Response (200)
- **shard_stores** (object) - Shard store information.
```

--------------------------------

### getAnnotatedSearchTemplateQuery Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Retrieves the `SearchTemplateQuery` annotation from the method.

```APIDOC
## Method

### Description
Retrieves the `SearchTemplateQuery` annotation from the method.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (SearchTemplateQuery) - The `SearchTemplateQuery` annotation.

#### Response Example
N/A
```

--------------------------------

### Save multiple entities with ReactiveElasticsearchTemplate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Saves a collection of entities to the provided index using reactive streams. The method accepts a Mono publishing the collection and returns a Flux of saved entities. It validates that both the entities publisher and index are non‑null.

```java
public <T> Flux<T> saveAll(Mono<? extends Collection<? extends T>> entitiesPublisher, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Create Mutable Document (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Creates a new, mutable Document object. This is a static factory method provided by the Document interface. It does not require any arguments and returns an instance of Document.

```java
static Document create()
Create a new mutable `Document`.
```

--------------------------------

### EXISTS /_index_template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Checks if an index template exists.  This endpoint is used to determine if a template is configured in Elasticsearch.

```APIDOC
## EXISTS /_index_template

### Description
Checks whether an index template exists.

### Method
GET

### Endpoint
/_index_template

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the index template to check.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "name": "my_template"
  }
}

### Response
#### Success Response (200)
- **response** (boolean) - True if the index template exists, false otherwise.
```

--------------------------------

### getIndexRouting() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the index routing value.

```APIDOC
## getIndexRouting()

### Description
Retrieves the index routing value.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **indexRouting** (String) - The index routing value.

#### Response Example
N/A
```

--------------------------------

### setId Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Sets the identifier for the document.

```APIDOC
## Method

### setId
public void setId(String id)

### Description
Sets the identifier for the document.

### Parameters
- **id** (String) - Required - The identifier to set for the document.
```

--------------------------------

### Clone Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to clone an Elasticsearch index reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.CloneIndexResponse> clone(co.elastic.clients.elasticsearch.indices.CloneIndexRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.CloneIndexResponse> clone(Function<co.elastic.clients.elasticsearch.indices.CloneIndexRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.CloneIndexRequest>> fn)
```

--------------------------------

### Partially update a document

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Performs a partial update of a document identified by an UpdateQuery in the specified index. Returns a Mono emitting an UpdateResponse that contains the result of the operation.

```java
public Mono<UpdateResponse> update(UpdateQuery updateQuery, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Execute Elasticsearch Client Callback with Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Provides a mechanism to execute a callback function with the native Elasticsearch client. This allows for low-level operations and utilizes Spring's exception translation.

```java
public <T> T execute(ElasticsearchTemplate.ClientCallback<T> callback)
```

--------------------------------

### IndicesTemplate field declarations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Protected fields used by IndicesTemplate for managing Elasticsearch index operations. Includes bound class information, index coordinates, and Elasticsearch converter.

```java
protected final Class<?> boundClass
protected final IndexCoordinates boundIndex
protected final ElasticsearchConverter elasticsearchConverter
```

--------------------------------

### Object Equality and Hashing

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Overrides the default equals and hashCode methods inherited from Object. These implementations are crucial for correctly comparing Document objects and using them in hash-based collections, adhering to the Map interface contract.

```java
public boolean equals(Object o)
public int hashCode()
```

--------------------------------

### FORCEMERGE /

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Forces a merge of index segments. This endpoint optimizes index storage by merging smaller segments into larger ones.

```APIDOC
## FORCEMERGE /

### Description
Forces a merge of index segments.

### Method
POST

### Endpoint
/

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": null
}

### Response
#### Success Response (200)
- **response** (object) - The response from the Elasticsearch server.
```

--------------------------------

### bulkUpdate in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Updates multiple documents in bulk. Throws BulkFailureException on error.

```java
public Mono<Void> bulkUpdate(List<UpdateQuery> queries, IndexCoordinates index) {}
public Mono<Void> bulkUpdate(List<UpdateQuery> queries, BulkOptions bulkOptions, IndexCoordinates index) {}
// Usage
List<UpdateQuery> queries = List.of(UpdateQuery.builder("id1").withDoc("field", "value").build());
reactiveElasticsearchTemplate.bulkUpdate(queries, indexCoordinates).subscribe();
```

--------------------------------

### Configure Search After for Elasticsearch Pagination

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Implement deep pagination in Elasticsearch using the 'search after' feature. This requires providing sort values obtained from previous search hits. `getSearchAfter()` retrieves these values.

```java
public void setSearchAfter(@Nullable List<Object> searchAfter)
public List<Object> getSearchAfter()
```

--------------------------------

### searchForHits(Query query, Class<?> entityType, Class<T> resultType, IndexCoordinates index)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Perform a search and return the ReactiveSearchHits which contains information about the search results and which will provide the documents by the ReactiveSearchHits.getSearchHits() method. This includes a projection result type.

```APIDOC
## searchForHits(Query query, Class<?> entityType, Class<T> resultType, IndexCoordinates index)

### Description
Perform a search and return the `ReactiveSearchHits` which contains information about the search results and which will provide the documents by the `ReactiveSearchHits.getSearchHits()` method.

### Method
Mono<ReactiveSearchHits<T>> searchForHits(Query query, Class<?> entityType, Class<T> resultType, IndexCoordinates index)

### Endpoint
searchForHits

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **query** (Query) - Required - The search query, must not be null
- **entityType** (Class<?>) - Required - The entity type class, must not be null
- **resultType** (Class<T>) - Required - The projection result type
- **index** (IndexCoordinates) - Required - The target index, must not be null

### Request Example
searchForHits(query, entityType, resultType, index)

### Response
#### Success Response (Mono)
- **ReactiveSearchHits<T>** - A Mono emitting the ReactiveSearchHits that contains the search result information

#### Response Example
Mono<ReactiveSearchHits<Projection>>
```

--------------------------------

### Create ReactiveSearchHits from SearchHits in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/SearchHits

A static utility method to create ReactiveSearchHits from existing SearchHits. This is useful for integrating synchronous search results into reactive streams.

```java
static <T> ReactiveSearchHits<T> searchHitsFor(SearchHits<T> searchHits)
```

--------------------------------

### hasAnnotatedSearchTemplateQuery Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks if the method is annotated with the `SearchTemplateQuery` annotation.

```APIDOC
## Method

### Description
Checks if the method is annotated with the `SearchTemplateQuery` annotation.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if the method is annotated with the `SearchTemplateQuery` annotation.

#### Response Example
N/A
```

--------------------------------

### getIndices() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the array of indices associated with the alias action.

```APIDOC
## getIndices()

### Description
Retrieves the array of indices associated with the alias action.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **indices** (String[]) - The array of indices.

#### Response Example
N/A
```

--------------------------------

### POST /{index}/_update/{id}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Performs a partial update of a document identified by its ID.

```APIDOC
## POST /{index}/_update/{id}

### Description
Applies a partial update to the document with the given ID in the specified index.

### Method
POST

### Endpoint
/{index}/_update/{id}

### Parameters
#### Path Parameters
- **index** (string) - Required - Target Elasticsearch index.
- **id** (string) - Required - Identifier of the document to update.

#### Request Body
- **doc** (object) - Required - Fields to be updated.

### Request Example
{
  "doc": {
    "field1": "newValue"
  }
}

### Response
#### Success Response (200)
- **result** (string) - Result status, e.g., "updated".

### Response Example
{
  "_index": "my-index",
  "_id": "123",
  "result": "updated"
}
```

--------------------------------

### Unfreeze Index - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This snippet shows the usage of the `unfreeze` method to unfreeze an index in Spring Data Elasticsearch. It accepts an UnfreezeRequest object or a Function to customize one and returns an UnfreezeResponse.

```java
public Mono<co.elastic.clients.elasticsearch.indices.UnfreezeResponse> unfreeze(co.elastic.clients.elasticsearch.indices.UnfreezeRequest request)
```

```java
public Mono<co.elastic.clients.elasticsearch.indices.UnfreezeResponse> unfreeze(Function<co.elastic.clients.elasticsearch.indices.UnfreezeRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.UnfreezeRequest>> fn)
```

--------------------------------

### DELETE /_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Deletes a legacy index template.

```APIDOC
## DELETE /_template/{name}

### Description
Deletes an index template using the legacy Elasticsearch interface.

### Method
DELETE

### Endpoint
/_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Template name.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **acknowledged** (boolean) - True if successful.

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### IndicesTemplate Check Index Exists

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

This endpoint details the method to check if an index exists.

```APIDOC
## GET /index/exists

### Description
This endpoint describes the method to check if an index exists in Elasticsearch.

### Method
GET

### Endpoint
/index/exists

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **exists** (boolean) - True if the index exists.

#### Response Example
{
  "exists": true
}

```

--------------------------------

### POST putMapping

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Updates the mapping for an index in Elasticsearch. This operation allows you to add new fields or update existing field mappings for an index.

```APIDOC
## POST putMapping

### Description
Updates the mapping for an index in Elasticsearch

### Method
POST

### Endpoint
/{index}/_mapping

### Parameters
#### Path Parameters
- **index** (string) - Required - Name of the index

#### Query Parameters
- **timeout** (time) - Optional - Time to wait for completion

#### Request Body
- **properties** (object) - Required - Field mappings
- **dynamic** (string) - Optional - Dynamic mapping setting

### Request Example
{
  "properties": {
    "user_id": {
      "type": "keyword"
    },
    "email": {
      "type": "keyword"
    }
  }
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Whether the operation was acknowledged

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### IndicesTemplate Delete Index

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

This endpoint details the method for deleting an existing index using IndicesTemplate.

```APIDOC
## DELETE /index

### Description
This endpoint describes the method to delete an existing index in Elasticsearch.

### Method
DELETE

### Endpoint
/index

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **deleted** (boolean) - True if the index was deleted.

#### Response Example
{
  "deleted": true
}

```

--------------------------------

### Component Template Operations - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

Methods for managing component index templates in Elasticsearch. Component templates are reusable template components that can be composed into index templates. These methods handle existence checks, retrieval, and deletion operations.

```java
boolean existsComponentTemplate(ExistsComponentTemplateRequest existsComponentTemplateRequest)
Checks whether a component index template exists.

Parameters:
    `existsComponentTemplateRequest` - the parameters for the request

Returns:
    true if the componentTemplate exists.

Since:
    5.1
```

```java
List<TemplateResponse> getComponentTemplate(GetComponentTemplateRequest getComponentTemplateRequest)
Get a component template.

Parameters:
    `getComponentTemplateRequest` - parameters for the request, may contain wildcard names

Returns:
    the found `TemplateResponse`s, may be empty

Since:
    5.1
```

```java
boolean deleteComponentTemplate(DeleteComponentTemplateRequest deleteComponentTemplateRequest)
Deletes the given component index template

Parameters:
    `deleteComponentTemplateRequest` - request parameters

Returns:
    true if successful.

Since:
    5.1
```

--------------------------------

### FLUSH /

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Flushes the index. This endpoint forces Elasticsearch to write all pending changes to disk.

```APIDOC
## FLUSH /

### Description
Flushes the index, ensuring all pending changes are written to disk.

### Method
POST

### Endpoint
/

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": null
}

### Response
#### Success Response (200)
- **response** (object) - The response from the Elasticsearch server.
```

--------------------------------

### Indices Unfreeze

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Unfreezes a frozen index.

```APIDOC
## POST /_unfreeze

### Description
Unfreezes a frozen index.

### Method
POST

### Endpoint
/_unfreeze

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **index** (string) - Required - Name of the index to unfreeze.

### Request Example
{
  "index": "my-index"
}

### Response
#### Success Response (200)
- **unfrozen_index** (string) - Name of the unfreezen index.
```

--------------------------------

### POST /_aliases

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Executes alias actions on Elasticsearch indices, such as adding or removing aliases.

```APIDOC
## POST /_aliases

### Description
Executes the given alias actions on indices.

### Method
POST

### Endpoint
/_aliases

### Parameters
#### Request Body
- **actions** (array of objects) - Required - List of alias actions to execute.

### Request Example
{
  "actions": [
    {
      "add": {
        "index": "test_index",
        "alias": "test_alias"
      }
    }
  ]
}

### Response
#### Success Response (200)
- **acknowledged** (boolean) - True if the operation is acknowledged.

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### Stream search results with scroll context in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Executes a query and returns results as a SearchHitsIterator that wraps an Elasticsearch scroll context. The iterator must be closed; prefer try-with-resources. Supports specifying target index via IndexCoordinates. Inputs: Query; entity class; optional IndexCoordinates. Output: SearchHitsIterator<T>. Limitation: requires proper resource management (close/try-with-resources).

```java
public <T> SearchHitsIterator<T> searchForStream(Query query, Class<T> clazz)
```

```java
public <T> SearchHitsIterator<T> searchForStream(Query query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### DELETE /reactive-elasticsearch/delete

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Deletes documents that match the provided query in the given index.

```APIDOC
## DELETE /reactive-elasticsearch/delete

### Description
Deletes documents that match the provided query in the given index.

### Method
DELETE

### Endpoint
/reactive-elasticsearch/delete

### Parameters
#### Request Body
- **query** (DeleteQuery) - Required - Query defining which documents to delete.
- **entityType** (String) - Required - Entity class name.
- **index** (String) - Required - Target index.

### Request Example
{
  "query": {"match": {"field": "value"}},
  "entityType": "com.example.MyEntity",
  "index": "my-index"
}

### Response
#### Success Response (200)
- **byQueryResponse** (ByQueryResponse) - Information about the deletion result.

### Response Example
{
  "deleted": 5,
  "took": "15ms"
}
```

--------------------------------

### Perform reactive aggregation and emit aggregations in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Runs an aggregation query and streams matching AggregationContainer results via a Flux. Requires a non-null Query and entity type, with an optional IndexCoordinates to target a specific index. Returns a Flux of AggregationContainer objects.

```Java
Flux<? extends AggregationContainer<?>> aggregate(Query query, Class<?> entityType);
```

```Java
Flux<? extends AggregationContainer<?>> aggregate(Query query, Class<?> entityType, IndexCoordinates index);
```

--------------------------------

### getSearchRouting() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the search routing value.

```APIDOC
## getSearchRouting()

### Description
Retrieves the search routing value.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **searchRouting** (String) - The search routing value.

#### Response Example
N/A
```

--------------------------------

### ReactiveMappingBuilder Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/ReactiveMappingBuilder

ReactiveMappingBuilder is a subclass of MappingBuilder that provides reactive methods for building Elasticsearch property mappings. It is designed to prevent blocking calls in reactive applications.

```APIDOC
## ReactiveMappingBuilder

### Description
ReactiveMappingBuilder is a subclass of `MappingBuilder` with specialized methods to inhibit blocking calls in reactive applications. It provides reactive alternatives for building Elasticsearch property mappings.

### Since
4.3

### Author
Peter-Josef Meisch

### Constructor
#### ReactiveMappingBuilder(ElasticsearchConverter elasticsearchConverter)
- **elasticsearchConverter** (ElasticsearchConverter) - Required - The converter used for Elasticsearch operations

### Methods
#### buildPropertyMapping
```java
public String buildPropertyMapping(Class<?> clazz) throws MappingException
```
Builds the Elasticsearch mapping for the given class.

- **Parameters**:
  - **clazz** (Class<?>) - Required - The class for which to build the mapping
- **Returns**: JSON string representation of the mapping
- **Throws**: MappingException on errors while building the mapping

#### buildReactivePropertyMapping
```java
public Mono<String> buildReactivePropertyMapping(Class<?> clazz) throws MappingException
```
Reactive version of building the Elasticsearch mapping for the given class.

- **Parameters**:
  - **clazz** (Class<?>) - Required - The class for which to build the mapping
- **Returns**: Mono<String> emitting the JSON string representation of the mapping
- **Throws**: MappingException on errors while building the mapping
```

--------------------------------

### Java - TotalHitsRelation Values Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/TotalHitsRelation

This snippet showcases the static values method, which returns an array of all TotalHitsRelation constants defined in the enum. Useful for iterating through all possible values.

```java
static TotalHitsRelation[] values()
```

--------------------------------

### Static Utility Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/ScriptType

Standard enum utility methods for converting between string names and enum instances, and retrieving all enum values. These methods provide basic enum functionality for script type lookup and iteration.

```java
public static ScriptType[] values()
{
    return an array containing the constants of this enum class, in the order they are declared
}

public static ScriptType valueOf(String name)
{
    Returns the enum constant of this class with the specified name
}
```

--------------------------------

### Obtain IndexOperations by entity class (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Returns an IndexOperations object bound to the given entity class. It enables index creation, mapping, and settings manipulation for the class annotated with @Document. The method is part of the ElasticsearchOperations interface.

```Java
public IndexOperations indexOps(Class<?> clazz)
```

--------------------------------

### Configure Point in Time for Elasticsearch Queries

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Utilize the Point in Time (PIT) API for consistent snapshots of an index. This is useful for time-sensitive operations. `getPointInTime()` retrieves the configured PIT ID.

```java
public void setPointInTime(@Nullable Query.PointInTime pointInTime)
public Query.PointInTime getPointInTime()
```

--------------------------------

### Manage Query Updates via Converter (Internal)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Internal methods for managing query updates, potentially related to data conversion processes. These are not intended for public API use.

```java
public boolean queryIsUpdatedByConverter()
public void setQueryIsUpdatedByConverter(boolean queryIsUpdatedByConverter)
```

--------------------------------

### GeoJson Interface Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/geo/GeoJson

Methods available in the GeoJson interface for handling GeoJSON format data.

```APIDOC
## GeoJson Interface

### Description
Interface definition for structures defined in GeoJSON format. Provides methods to get coordinates, type, parse JSON strings, and convert objects to JSON.

### Methods
#### getType
String getType()
String value representing the type of the `GeoJson` object.

**Returns:**
- `String` - will never be null.

#### getCoordinates
T getCoordinates()
The value of the coordinates member is always an `Iterable`. The structure for the elements within is determined by `getType()` of geometry.

**Returns:**
- `T` - will never be null.

#### of
static GeoJson<?> of(String json)
Parses a JSON string into a `GeoJson` object.

**Parameters:**
- `json` (String) - the JSON string to parse

**Returns:**
- `GeoJson<?>` - the parsed `GeoJson` object

**Throws:**
- `ConversionException` - on parse errors

#### toJson
default String toJson()
Converts the `GeoJson` object to a JSON string.

**Returns:**
- `String` - a JSON representation of this object
```

--------------------------------

### POST /rollover

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Rollover an alias to a new index when the existing index meets specified conditions. This is commonly used with rollover indices for time-based data.

```APIDOC
## POST /rollover

### Description
Rollover an alias to a new index when the existing index meets specified conditions. This is commonly used with rollover indices for time-based data.

### Method
POST

### Endpoint
/rollover

### Parameters
#### Request Body
- **request** (RolloverRequest) - Required - Request object containing rollover conditions and new index settings

### Response
#### Success Response (200)
- **RolloverResponse** (object) - Response containing rollover operation result

#### Response Example
{
  "old_index": "index-000001",
  "new_index": "index-000002",
  "rolled_over": true
}
```

--------------------------------

### getFields Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the fields associated with the search result.

```APIDOC
## Method

### getFields
public Map<String,List<Object>> getFields()

### Description
Returns the fields for the search result.

### Returns
- A map of field names to their values, not null.
```

--------------------------------

### StringObjectMap KeySet, Values, and EntrySet

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/DefaultStringObjectMap

Methods to retrieve collections of keys, values, and map entries from a StringObjectMap. These are standard operations provided by the Map interface.

```java
public Set<String> keySet()
public Collection<Object> values()
public Set<Map.Entry<String,Object>> entrySet()
```

--------------------------------

### GeoPoint Utility Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/geo/GeoPoint

Utility methods for converting between GeoPoint and Point objects. These methods facilitate interoperability with other geographic data types.

```java
public static GeoPoint fromPoint(Point point) {
    // Builds a GeoPoint from a Point
}

public static Point toPoint(GeoPoint point) {
    // Converts GeoPoint to Point
}
```

--------------------------------

### ElasticsearchConverter Access

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Provides access to the ElasticsearchConverter instance used by this template. The converter is responsible for object mapping between Java objects and Elasticsearch documents.

```java
ElasticsearchConverter
getElasticsearchConverter()

```

--------------------------------

### MappingElasticsearchConverter.read(Class<R> type, Document source)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Reads a Document and converts it into an object of type R. This allow for conversion of a Document to a specified class.

```APIDOC
## POST /_elasticsearch/read

### Description
Reads a `Document` and converts it to an object of type R.

### Method
POST

### Endpoint
/_elasticsearch/read

### Parameters
#### Path Parameters
- **type** (string) - Required - The class type to convert the Document to.

#### Request Body
- **source** (Document) - Required - The Document to be read.

### Request Example
{
  "source": {
    "field1": "value1",
    "field2": 123
  }
}

### Response
#### Success Response (200)
- **object** (object) - The converted object.
```

--------------------------------

### POST /refresh

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Refreshes one or more indices, making all operations performed since the last refresh available for search. This operation is synchronous.

```APIDOC
## POST /refresh

### Description
Refreshes one or more indices, making all operations performed since the last refresh available for search. This operation is synchronous.

### Method
POST

### Endpoint
/refresh

### Parameters
#### Request Body
- **request** (RefreshRequest) - Optional - Request object to specify indices to refresh

### Response
#### Success Response (200)
- **RefreshResponse** (object) - Response containing refresh operation result

#### Response Example
{
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

--------------------------------

### Open Point-In-Time (PIT) in Elasticsearch using Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Opens a point in time (PIT) in Elasticsearch for a specified index or set of indexes. Allows for consistent retrieval of data over a period. Requires an index, a keep-alive duration, and a flag to ignore unavailable indexes.

```java
public String openPointInTime(IndexCoordinates index, Duration keepAlive, Boolean ignoreUnavailable)
```

--------------------------------

### HEAD /_index_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Checks if a composable index template exists.

```APIDOC
## HEAD /_index_template/{name}

### Description
Checks if an index template exists for composable templates.

### Method
HEAD

### Endpoint
/_index_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Template name.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **exists** (boolean) - True if the template exists.

#### Response Example
{
  "exists": true
}
```

--------------------------------

### EXISTS /_alias

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Checks if an alias exists. This endpoint verifies whether an alias exists in the Elasticsearch cluster.

```APIDOC
## EXISTS /_alias

### Description
Checks whether an alias exists.

### Method
GET

### Endpoint
/_alias

### Parameters
#### Path Parameters
- **alias** (string) - Required - The name of the alias to check.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "alias": "my_alias"
  }
}

### Response
#### Success Response (200)
- **response** (boolean) - True if the alias exists, false otherwise.
```

--------------------------------

### SearchShardStatistics API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchShardStatistics

This API provides access to shard statistics for Elasticsearch search operations. It includes methods to retrieve the number of failed, successful, total, and skipped shards, as well as any failures.

```APIDOC
## SearchShardStatistics

### Description
The `SearchShardStatistics` class provides statistics about shard operations during Elasticsearch search queries. It includes details such as the number of failed, successful, and total shards, as well as a list of failures.

### Methods

#### of
```java
public static SearchShardStatistics of(Number failed, Number successful, Number total, @Nullable Number skipped, List<SearchShardStatistics.Failure> failures)
```
Creates a new instance of `SearchShardStatistics` with the specified parameters.

#### getFailed
```java
public Number getFailed()
```
Returns the number of failed shards.

#### getSuccessful
```java
public Number getSuccessful()
```
Returns the number of successful shards.

#### getTotal
```java
public Number getTotal()
```
Returns the total number of shards.

#### getSkipped
```java
@Nullable public Number getSkipped()
```
Returns the number of skipped shards, or null if not applicable.

#### isFailed
```java
public boolean isFailed()
```
Returns `true` if any shards failed; otherwise, `false`.

#### getFailures
```java
public List<SearchShardStatistics.Failure> getFailures()
```
Returns a list of failures for the shards.

### Nested Classes
- `SearchShardStatistics.Failure`: Represents a failure in a shard operation.
```

--------------------------------

### SearchHit Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHit

The SearchHit class encapsulates found data with additional information from Elasticsearch searches. It provides methods to access document data, scores, highlights, and other search metadata.

```APIDOC
## SearchHit<T> Class

### Description
Encapsulates the found data with additional information from Elasticsearch searches. Contains document data, scores, highlights, and other search metadata.

### Type Parameters
- `T` - the result data class

### Constructor
```java
public SearchHit(@Nullable String index, @Nullable String id, @Nullable String routing, float score, @Nullable Object[] sortValues, @Nullable Map<String,List<String>> highlightFields, @Nullable Map<String,SearchHits<?>> innerHits, @Nullable NestedMetaData nestedMetaData, @Nullable Explanation explanation, @Nullable List<String> matchedQueries, T content)
```

### Methods
#### getIndex()
- **Returns**: The index name where the hit's document was found

#### getId()
- **Returns**: The document ID

#### getScore()
- **Returns**: The score for the hit

#### getContent()
- **Returns**: The object data from the search

#### getSortValues()
- **Returns**: The sort values if the query had a sort criterion

#### getHighlightFields()
- **Returns**: Map from field names to highlight values (never null)

#### getHighlightField(String field)
- **Parameters**:
  - `field` - must not be null
- **Returns**: List of highlight values for the field (possibly empty, never null)

#### getInnerHits(String name)
- **Parameters**:
  - `name` - the inner hits name
- **Returns**: SearchHits for the inner hits with given name (null if not available)

#### getInnerHits()
- **Returns**: Map from inner_hits names to inner hits (never null)

#### getNestedMetaData()
- **Returns**: Nested metadata information if this is a nested inner hit

#### getRouting()
- **Returns**: The routing for this SearchHit (may be null)

#### getExplanation()
- **Returns**: The explanation for this SearchHit

#### getMatchedQueries()
- **Returns**: The matched queries for this SearchHit
```

--------------------------------

### Point in Time Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Manages Elasticsearch Point In Time (PIT) resources. Includes methods to close an existing PIT by its ID. Returns a boolean indicating success or failure.

```java
Boolean
closePointInTime(String pit)

```

--------------------------------

### methodReturnType Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Returns the declared return type for this method.

```APIDOC
## Method

### Description
Returns the declared return type for this method.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (Class<?>) - The declared return type for this method.

#### Response Example
N/A
```

--------------------------------

### Validate Index Query - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This snippet shows how to validate a query against an index using the `validateQuery` method in Spring Data Elasticsearch. The method accepts a ValidateQueryRequest object or a Function to customize one, returning a ValidateQueryResponse.

```java
public Mono<co.elastic.clients.elasticsearch.indices.ValidateQueryResponse> validateQuery(co.elastic.clients.elasticsearch.indices.ValidateQueryRequest request)
```

```java
public Mono<co.elastic.clients.elasticsearch.indices.ValidateQueryResponse> validateQuery(Function<co.elastic.clients.elasticsearch.indices.ValidateQueryRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.ValidateQueryRequest>> fn)
```

```java
public Mono<co.elastic.clients.elasticsearch.indices.ValidateQueryResponse> validateQuery()
```

--------------------------------

### openPointInTime(IndexCoordinates index, Duration keepAlive, Boolean ignoreUnavailable)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Opens a point in time (pit) in Elasticsearch with keep-alive duration and option to ignore unavailable indices.

```APIDOC
## openPointInTime(IndexCoordinates index, Duration keepAlive, Boolean ignoreUnavailable)

### Description
Opens a point in time (pit) in Elasticsearch.

### Method
Mono<String> openPointInTime(IndexCoordinates index, Duration keepAlive, Boolean ignoreUnavailable)

### Endpoint
openPointInTime

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **index** (IndexCoordinates) - Required - The index name(s) to use
- **keepAlive** (Duration) - Required - The duration the pit should be kept alive
- **ignoreUnavailable** (Boolean) - Required - If true, the call will fail if any of the indices is missing or closed

### Request Example
openPointInTime(index, keepAlive, ignoreUnavailable)

### Response
#### Success Response (Mono)
- **String** - A Mono emitting the pit identifier

#### Response Example
Mono<String>
```

--------------------------------

### Delete documents matching a query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Deletes documents that match the provided DeleteQuery from the given index and entity type. Returns a Mono emitting a ByQueryResponse with the number of removed documents. All parameters must be non‑null.

```java
public Mono<ByQueryResponse> delete(DeleteQuery query, Class<?> entityType, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Reindex documents (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Executes a reindex operation based on the provided ReindexRequest, allowing data migration between indices. Returns a ReindexResponse with details on the moved documents.

```Java
public ReindexResponse reindex(ReindexRequest reindexRequest)
```

--------------------------------

### multiGet in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Executes a multiGet operation to retrieve multiple documents by ID. Returns a Flux of MultiGetItem objects.

```java
public <T> Flux<MultiGetItem<T>> multiGet(Query query, Class<T> clazz, IndexCoordinates index) {}
// Usage
Flux<MultiGetItem<MyEntity>> results = reactiveElasticsearchTemplate.multiGet(Query.multiGetQuery("id1", "id2"), MyEntity.class, indexCoordinates);
results.subscribe(item -> log.info("Item: {}", item));
```

--------------------------------

### ChildTemplate ClientCallback Interface (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ChildTemplate

Defines a callback interface for operating directly on the Elasticsearch client within a ChildTemplate. It's designed to be used with lambda expressions or method references. The doWithClient method takes the client as input and returns a result, potentially throwing an IOException.

```java
@FunctionalInterface public static interface ChildTemplate.ClientCallback<CLIENT,RESULT>
Callback interface to be used with `ChildTemplate.execute(ClientCallback)` for operating directly on the client.
  * ## Method Summary
All MethodsInstance MethodsAbstract Methods
Modifier and Type
Method
Description
`RESULT`
`doWithClient(CLIENT client)`
```

--------------------------------

### GeoJsonMultiPoint Conversion Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/geo/class-use/GeoJsonMultiPoint

Converter methods for transforming GeoJsonMultiPoint objects to and from Map representations.

```APIDOC
## GeoConverters.MapToGeoJsonMultiPointConverter.convert(Map<String,Object> source)

### Description
Converts a Map representation to a GeoJsonMultiPoint object.

### Method
GET

### Parameters
#### Request Parameters
- **source** (Map<String,Object>) - Required - Map containing the source data for conversion

### Response
#### Success Response
- **GeoJsonMultiPoint** - Converted GeoJsonMultiPoint object

## GeoConverters.GeoJsonMultiPointToMapConverter.convert(GeoJsonMultiPoint geoJsonMultiPoint)

### Description
Converts a GeoJsonMultiPoint object to its Map representation.

### Method
GET

### Parameters
#### Request Parameters
- **geoJsonMultiPoint** (GeoJsonMultiPoint) - Required - The GeoJsonMultiPoint object to convert

### Response
#### Success Response
- **Map<String,Object>** - Map representation of the GeoJsonMultiPoint
```

--------------------------------

### Create Document from Map (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Creates a Document from a given Map. This method can handle key-value pairs and nested documents. It takes a Map as input and returns a Document object.

```java
static Document from(Map<String,?> map)
Create a `Document` from a `Map` containing key-value pairs and sub-documents.
```

--------------------------------

### Search Hit Metadata Retrieval

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Methods to obtain specific metadata associated with a SearchHit, such as the explanation of the score calculation and a list of queries that matched the hit. These are valuable for understanding search relevance and query execution.

```java
@Nullable public Explanation getExplanation()
@Nullable public List<String> getMatchedQueries()
```

--------------------------------

### Java: BeforeConvertCallback Interface Definition

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/event/BeforeConvertCallback

Defines the BeforeConvertCallback functional interface in Java. This interface is invoked before an entity is converted for persistence. It extends EntityCallback and is annotated with @FunctionalInterface, allowing for lambda expressions or method references. The onBeforeConvert method takes the entity and IndexCoordinates as input and returns the entity to be persisted.

```java
@FunctionalInterface
public interface BeforeConvertCallback<T> extends EntityCallback<T>
{
    T onBeforeConvert(T entity, IndexCoordinates index);
}
```

--------------------------------

### Primary Term Management in Document Interface

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Methods to check for, retrieve, and set the primary term associated with a document. These operations are crucial for handling versioning and concurrency in Elasticsearch. The default implementations for getPrimaryTerm and setPrimaryTerm throw UnsupportedOperationException, recommending prior checks using hasPrimaryTerm.

```java
public boolean hasPrimaryTerm()
public long getPrimaryTerm()
public void setPrimaryTerm(long primaryTerm)
```

--------------------------------

### Execute multi-get operation (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Performs a multi-get request for a collection of ids defined by a Query object Returns a list of MultiGetItem objects containing the retrieved entities. Supports specifying the entity class and index coordinates.

```Java
public <T> List<MultiGetItem<T>> multiGet(Query query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### RestStatusException Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/RestStatusException

Exception class for REST status exceptions independent from the used client/backend.

```APIDOC
## RestStatusException

### Description
Exception class for REST status exceptions independent from the used client/backend.

### Constructors
- **RestStatusException(int status, String msg)**
- **RestStatusException(int status, String msg, Throwable cause)**

### Methods
- **int getStatus()**
- **String toString()**
```

--------------------------------

### ReactiveAfterConvertCallback Interface Definition

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/event/ReactiveAfterConvertCallback

Defines the ReactiveAfterConvertCallback interface, a functional interface used in reactive scenarios. It extends EntityCallback<T> and provides a single method, onAfterConvert, to intercept and potentially modify domain objects after they are materialized from a Document.

```java
@FunctionalInterface
public interface ReactiveAfterConvertCallback<T> extends EntityCallback<T>
{
    Publisher<T> onAfterConvert(T entity, Document document, IndexCoordinates indexCoordinates);
}
```

--------------------------------

### Execute Multi Search Query with Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Executes multiple search queries against Elasticsearch using provided entity classes for mapping and a list of target indexes. Returns a list of SearchHits for each query.

```java
public List<SearchHits<?>> multiSearch(List<? extends Query> queries, List<Class<?>> classes, List<IndexCoordinates> indexes)
```

--------------------------------

### Count Documents

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Returns the number of documents that match a given query. Accepts a Query object and the target class for counting. Returns the total count as a long.

```java
long
count(Query query, Class<?> clazz)

```

--------------------------------

### Bulk update documents (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Executes a bulk update request for multiple UpdateQuery objects with optional BulkOptions. This method streams updates to Elasticsearch in a single request for efficiency.

```Java
public void bulkUpdate(List<UpdateQuery> queries, BulkOptions bulkOptions, IndexCoordinates index)
```

--------------------------------

### IndicesTemplate class declaration

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Declaration of the IndicesTemplate class which extends ChildTemplate and implements IndexOperations. This class provides Elasticsearch index management functionality. Requires Spring Data Elasticsearch 4.4 or higher.

```java
public class IndicesTemplate extends ChildTemplate<co.elastic.clients.transport.ElasticsearchTransport,co.elastic.clients.elasticsearch.indices.ElasticsearchIndicesClient> implements IndexOperations
```

--------------------------------

### Java NestedMetaData of Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/NestedMetaData

Creates a NestedMetaData object. It takes a field name, offset, and another NestedMetaData instance as input.  The returned object contains this information.

```java
public static NestedMetaData of(String field, int offset, @Nullable NestedMetaData nested)
```

--------------------------------

### Partial document update (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Performs a partial update of a document using an UpdateQuery against the specified index. Returns an UpdateResponse with the outcome of the update operation.

```Java
public UpdateResponse update(UpdateQuery updateQuery, IndexCoordinates index)
```

--------------------------------

### DateFormat Constants

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/DateFormat

Enumeration of DateFormat constants supported by Spring Data Elasticsearch for consistent date/time handling across applications.

```APIDOC
## DateFormat Constants

### Description
These are predefined date format constants available in Spring Data Elasticsearch for parsing and formatting dates.

### Constants
- `basic_date`: Basic ISO date format yyyyMMdd
- `basic_date_time`: Basic ISO date time format yyyyMMdd'T'HHmmss.SSSZ
- `basic_date_time_no_millis`: Basic ISO date time without milliseconds
- `date`: ISO date format yyyy-MM-dd
- `date_time`: ISO date time format yyyy-MM-dd'T'HH:mm:ss.SSSXXX
- `epoch_millis`: Unix timestamp in milliseconds
- `epoch_second`: Unix timestamp in seconds

### Usage
Use these constants when configuring date formats in Elasticsearch mappings or when parsing/forming date values in your application.
```

--------------------------------

### Retrieve Elasticsearch Index Aliases (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Fetches alias information for specified Elasticsearch indices. Overloads allow providing a GetAliasRequest, a builder function, or invoking with default parameters. Returns a Mono of GetAliasResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.GetAliasResponse> getAlias(co.elastic.clients.elasticsearch.indices.GetAliasRequest request);
public Mono<co.elastic.clients.elasticsearch.indices.GetAliasResponse> getAlias(Function<co.elastic.clients.elasticsearch.indices.GetAliasRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.GetAliasRequest>> fn);
public Mono<co.elastic.clients.elasticsearch.indices.GetAliasResponse> getAlias();
```

--------------------------------

### getEntityInformation Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Retrieves the `ElasticsearchEntityMetadata` for the query method's return type.

```APIDOC
## Method

### Description
Retrieves the `ElasticsearchEntityMetadata` for the query method's return type.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (ElasticsearchEntityMetadata) - The `ElasticsearchEntityMetadata` for the query method's return type.

#### Response Example
N/A
```

--------------------------------

### Add block to Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to add a block to an Elasticsearch index reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.AddBlockResponse> addBlock(co.elastic.clients.elasticsearch.indices.AddBlockRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.AddBlockResponse> addBlock(Function<co.elastic.clients.elasticsearch.indices.AddBlockRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.AddBlockRequest>> fn)
```

--------------------------------

### GeoShapeField Annotation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/GeoShapeField

Documentation for the GeoShapeField annotation used to define geospatial shape field mappings in Elasticsearch. Includes orientation, validation settings and coordinate handling parameters.

```APIDOC
## @GeoShapeField

### Description
The `@GeoShapeField` annotation is used to configure geospatial shape fields in Spring Data Elasticsearch. It allows customization of how shape data is processed and validated during indexing.

### Target
FIELD

### Retention
RUNTIME

### Parameters
#### orientation
- **Type**: GeoShapeField.Orientation
- **Required**: No
- **Default**: ccw
- **Description**: Defines the orientation of the shape (clockwise or counter-clockwise)

#### ignoreMalformed
- **Type**: boolean
- **Required**: No
- **Default**: false
- **Description**: If true, malformed shape data is ignored during indexing

#### ignoreZValue
- **Type**: boolean
- **Required**: No
- **Default**: true
- **Description**: If true, Z-coordinate values are ignored in shape data

#### coerce
- **Type**: boolean
- **Required**: No
- **Default**: false
- **Description**: If true, shape coordinates are coerced to valid values

### Usage Example
```java
@GeoShapeField(
    orientation = GeoShapeField.Orientation.ccw,
    ignoreMalformed = false,
    ignoreZValue = true,
    coerce = false
)
private Shape geometry;
```
```

--------------------------------

### hasSeqNo Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Checks if the document is associated with a sequence number.

```APIDOC
## Method

### hasSeqNo
public boolean hasSeqNo()

### Description
Returns true if the document is associated with a sequence number.

### Returns
- true if the document has a sequence number, false otherwise.
```

--------------------------------

### Aggregation Class Definition - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/Aggregation

Defines the Aggregation class structure including constructor and getter methods for name and aggregate properties. The class extends Object and provides access to Elasticsearch aggregate data with associated naming.

```java
public class Aggregation extends Object
{
  // Class to combine an Elasticsearch `Aggregate` with its name
  // Necessary as the Elasticsearch Aggregate does not know its name
  
  private final String name;
  private final co.elastic.clients.elasticsearch._types.aggregations.Aggregate aggregate;
  
  public Aggregation(String name, co.elastic.clients.elasticsearch._types.aggregations.Aggregate aggregate) {
    this.name = name;
    this.aggregate = aggregate;
  }
  
  public String getName() {
    return name;
  }
  
  public co.elastic.clients.elasticsearch._types.aggregations.Aggregate getAggregate() {
    return aggregate;
  }
}
```

--------------------------------

### DELETE /indices/{index}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint is used to delete an index. It allows for specifying a function to build the DeleteIndexRequest.

```APIDOC
## DELETE /indices/{index}

### Description
Deletes an index.

### Method
DELETE

### Endpoint
/indices/{index}

### Parameters
#### Path Parameters
- **index** (string) - Required - The name of the index to delete.

### Request Example
{
  "index": "my_index"
}

### Response
#### Success Response (200)
- **Acknowledged** (boolean) - Indicates whether the index deletion was acknowledged.
```

--------------------------------

### Java ExistsComponentTemplateRequest Record Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/ExistsComponentTemplateRequest

Defines the ExistsComponentTemplateRequest record class in Java, which is part of Spring Data Elasticsearch. It facilitates checking for the existence of Elasticsearch templates. The class contains a constructor and getter methods for a template name.

```java
public record ExistsComponentTemplateRequest(String templateName) extends Record {
}
```

```java
public ExistsComponentTemplateRequest(String templateName) {
    // Implementation details (if any)
}
```

```java
final boolean equals(Object o) {
    // Implementation details (if any)
}
```

```java
final int hashCode() {
    // Implementation details (if any)
}
```

```java
String templateName() {
    // Implementation details (if any)
}
```

```java
final String toString() {
    // Implementation details (if any)
}
```

--------------------------------

### POST refresh

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Performs a refresh operation on one or more indices in Elasticsearch. This operation makes all operations performed since the last refresh available for search.

```APIDOC
## POST refresh

### Description
Performs a refresh operation on one or more indices in Elasticsearch

### Method
POST

### Endpoint
/{index}/_refresh

### Parameters
#### Path Parameters
- **index** (string) - Optional - Name of the index (refreshes all if not specified)

#### Query Parameters
None

### Request Example
{
  "index": "my-index"
}

### Response
#### Success Response (200)
- **_shards** (object) - Shard refresh information
- **total** (number) - Total number of shards
- **successful** (number) - Number of successful shards
- **failed** (number) - Number of failed shards

#### Response Example
{
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  }
}
```

--------------------------------

### ElasticsearchStringValueToStringConverter

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/support/value/ElasticsearchStringValueToStringConverter

A converter for handling string values in Elasticsearch queries, ensuring proper escaping of quotations.

```APIDOC
## ElasticsearchStringValueToStringConverter

### Description
A converter for handling string values in Elasticsearch queries, ensuring proper escaping of quotations. This converter should only be used in specific situations where string values in queries need to be escaped.

### Constructor
public ElasticsearchStringValueToStringConverter()

### Methods
#### getConvertibleTypes
public Set<GenericConverter.ConvertiblePair> getConvertibleTypes()

#### convert
@Nullable public Object convert(@Nullable Object source, TypeDescriptor sourceType, TypeDescriptor targetType)
```

--------------------------------

### getAnnotatedQuery Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Retrieves the query String defined in the `Query` annotation. Must not be null when `hasAnnotatedQuery()` returns true.

```APIDOC
## Method

### Description
Retrieves the query String defined in the `Query` annotation. Must not be null when `hasAnnotatedQuery()` returns true.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (String) - The query String defined in the `Query` annotation.

#### Response Example
N/A
```

--------------------------------

### getSortValues Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the sort values for the search hit.

```APIDOC
## Method

### getSortValues
public Object[] getSortValues()

### Description
Returns the sort values for the search hit.

### Returns
- An array of sort values.
```

--------------------------------

### Define abstract range property value converter in Java for Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/convert/AbstractRangePropertyValueConverter

This abstract class establishes constants for range operators and implements the PropertyValueConverter interface methods for reading and writing Elasticsearch range values. It requires subclasses to provide formatting and parsing logic for specific range types. The constructor accepts property metadata and the generic type of the range.

```Java
public abstract class AbstractRangePropertyValueConverter<T> extends AbstractPropertyValueConverter {
    protected static final String GT_FIELD = "gt";
    protected static final String GTE_FIELD = "gte";
    protected static final String LT_FIELD = "lt";
    protected static final String LTE_FIELD = "lte";

    public AbstractRangePropertyValueConverter(PersistentProperty<?> property, Class<?> genericType) {
        // constructor implementation
    }

    public Class<?> getGenericType() {
        // method implementation
        return null;
    }

    public Object read(Object value) {
        // conversion implementation
        return null;
    }

    public Object write(Object value) {
        // conversion implementation
        return null;
    }

    protected abstract String format(T value);

    protected abstract T parse(String value);
}
```

--------------------------------

### Check existence of a document by ID

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Determines whether a document with the given ID exists in the specified index. Returns a Mono emitting true if the document is found, false otherwise. The method is protected and used by higher‑level existence checks.

```java
protected Mono<Boolean> doExists(String id, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Document Retrieval

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Retrieves a single document from Elasticsearch by its ID. The document is deserialized into the specified class type. Requires the document's ID and the target class.

```java
<T> T
get(String id, Class<T> clazz)

```

--------------------------------

### Check Cluster Health in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchClusterClient

Checks the health of the Elasticsearch cluster. Accepts a HealthRequest object or a builder function. Returns a Mono with HealthResponse.

```java
public Mono<co.elastic.clients.elasticsearch.cluster.HealthResponse> health(co.elastic.clients.elasticsearch.cluster.HealthRequest healthRequest)
```

```java
public Mono<co.elastic.clients.elasticsearch.cluster.HealthResponse> health(Function<co.elastic.clients.elasticsearch.cluster.HealthRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.cluster.HealthRequest>> fn)
```

--------------------------------

### Set Index Name in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/IndexQuery

Demonstrates the method used to set the index name for the IndexQuery object. This is a crucial step in configuring the query to target the correct index.

```java
public void setIndexName(String indexName)
```

--------------------------------

### Reindex Request Builder - Source Query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/class-use/Query

Configures the source query for a reindex operation. This allows you to reindex only a subset of documents based on a specific query.

```APIDOC
## POST /api/elasticsearch/reindex

### Description
Initiates a reindex operation in Elasticsearch, optionally specifying a source query to filter documents for reindexing.

### Method
POST

### Endpoint
/api/elasticsearch/reindex

### Parameters
#### Request Body
- **sourceQuery** (Query) - Optional - The query used to select which documents to reindex from the source index.
- **destinationIndex** (string) - Required - The name of the destination index.
- **sourceIndex** (string) - Required - The name of the source index.

### Request Example
```json
{
  "sourceQuery": {
    "bool": {
      "filter": [
        {
          "term": {
            "status": "active"
          }
        }
      ]
    }
  },
  "destinationIndex": "new_index",
  "sourceIndex": "old_index"
}
```

### Response
#### Success Response (200)
- **reindexJobId** (string) - The ID of the reindex job.

#### Response Example
```json
{
  "reindexJobId": "job_12345"
}
```
```

--------------------------------

### Predefined DateFormat Constants (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/DateFormat

These static final fields define predefined DateFormat instances for common date and time patterns in Elasticsearch, including strict parsing variants and options excluding milliseconds. They are used for mapping date fields in Elasticsearch indices. All introduced in version 5.3; no external dependencies beyond standard Java DateFormat. Inputs are date strings matching the patterns; outputs are parsed Date objects. Limitations: Patterns are fixed; custom formats require manual creation.

```Java
public static final DateFormat time;
public static final DateFormat strict_time;
public static final DateFormat time_no_millis;
public static final DateFormat strict_time_no_millis;
public static final DateFormat t_time;
public static final DateFormat strict_t_time;
public static final DateFormat t_time_no_millis;
public static final DateFormat strict_t_time_no_millis;
public static final DateFormat week_date;
public static final DateFormat strict_week_date;
public static final DateFormat week_date_time;
public static final DateFormat strict_week_date_time;
public static final DateFormat week_date_time_no_millis;
public static final DateFormat strict_week_date_time_no_millis;
public static final DateFormat weekyear;
public static final DateFormat strict_weekyear;
public static final DateFormat weekyear_week;
public static final DateFormat strict_weekyear_week;
public static final DateFormat weekyear_week_day;
public static final DateFormat strict_weekyear_week_day;
public static final DateFormat year;
public static final DateFormat strict_year;
public static final DateFormat year_month;
public static final DateFormat strict_year_month;
public static final DateFormat year_month_day;
public static final DateFormat strict_year_month_day;
```

--------------------------------

### default openPointInTime(IndexCoordinates index, Duration keepAlive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Opens a point in time (pit) in Elasticsearch with a specified keep-alive duration. This is a default method.

```APIDOC
## default openPointInTime(IndexCoordinates index, Duration keepAlive)

### Description
Opens a point in time (pit) in Elasticsearch.

### Method
Mono<String> openPointInTime(IndexCoordinates index, Duration keepAlive)

### Endpoint
openPointInTime

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **index** (IndexCoordinates) - Required - The index name(s) to use
- **keepAlive** (Duration) - Required - The duration the pit should be kept alive

### Request Example
openPointInTime(index, keepAlive)

### Response
#### Success Response (Mono)
- **String** - A Mono emitting the pit identifier

#### Response Example
Mono<String>
```

--------------------------------

### Partial document update in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Partially updates an existing document using the provided entity. Supports overloads to let the entity define its index or to explicitly specify IndexCoordinates. Uses generics to preserve entity type T. Inputs: entity instance; optional index coordinates. Output: UpdateResponse indicating update result. Limitation: entity must exist; index must not be null when explicitly provided.

```java
public <T> UpdateResponse update(T entity)
```

```java
public <T> UpdateResponse update(T entity, IndexCoordinates index)
```

--------------------------------

### Force-merge Elasticsearch Indices (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Performs a force-merge (segment merge) on Elasticsearch indices to reduce the number of segments. Three overloads allow supplying a request object, a builder function, or using default settings. Returns a Mono of ForcemergeResponse.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.ForcemergeResponse> forcemerge(co.elastic.clients.elasticsearch.indices.ForcemergeRequest request);
public Mono<co.elastic.clients.elasticsearch.indices.ForcemergeResponse> forcemerge(Function<co.elastic.clients.elasticsearch.indices.ForcemergeRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.ForcemergeRequest>> fn);
public Mono<co.elastic.clients.elasticsearch.indices.ForcemergeResponse> forcemerge();
```

--------------------------------

### getScore Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the search score associated with the document.

```APIDOC
## Method

### getScore
public float getScore()

### Description
Returns the search score associated with the document.

### Returns
- The search score as a float value.
```

--------------------------------

### Set Timeout for Elasticsearch Queries

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Configure the query timeout for Elasticsearch requests. The `getTimeout()` method retrieves the currently set timeout.

```java
public void setTimeout(@Nullable Duration timeout)
public Duration getTimeout()
```

--------------------------------

### hasId Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Checks if the document is associated with an identifier.

```APIDOC
## Method

### hasId
public boolean hasId()

### Description
Returns true if the document is associated with an identifier.

### Returns
- true if the document has an identifier, false otherwise.
```

--------------------------------

### Java: SearchHitsIterator - getAggregations Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitsIterator

Retrieves the aggregations container from the SearchHitsIterator. This method is part of the SearchHitsIterator interface and returns aggregations associated with the search results.

```java
@Nullable
AggregationsContainer<?> getAggregations();
```

--------------------------------

### Flush Elasticsearch Indices (Java Reactive)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Executes a flush operation on one or more Elasticsearch indices to ensure that all indexed documents are written to disk. The method returns a Mono containing the FlushResponse. No additional parameters are required.

```Java
public Mono<co.elastic.clients.elasticsearch.indices.FlushResponse> flush();
```

--------------------------------

### GeoPoint Equality and Hashing

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/geo/GeoPoint

Overrides for Object's equals and hashCode methods to compare GeoPoint instances based on their latitude and longitude values.

```java
public boolean equals(Object o) {
    // Compares GeoPoint instances
}

public int hashCode() {
    // Generates hash code for GeoPoint
}
```

--------------------------------

### Dynamic Enum API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/Dynamic

Enum values that define how Elasticsearch should handle new fields in document mappings.

```APIDOC
## Dynamic Enum

### Description
Values for the `dynamic` mapping parameter that control how Elasticsearch handles new fields in document mappings.

### Enum Constants
- **TRUE**: New fields are added to the mapping.
- **RUNTIME**: New fields are added as runtime fields (loaded from _source at query time).
- **FALSE**: New fields are ignored (not indexed but appear in _source).
- **STRICT**: Rejects documents with new fields (exception thrown).
- **INHERIT**: Inherits dynamic setting from parent object/mapping type.

### Methods
- **values()**: Returns all enum constants in declaration order.
- **valueOf(String name)**: Returns enum constant by exact name match.
- **getMappedName()**: Gets the mapped name (implementation not shown).
```

--------------------------------

### Build UpdateQuery from entity in Spring Data Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Converts an entity object into an UpdateQuery suitable for partial updates. Typically used internally by update methods to construct the request. Input: entity instance. Output: UpdateQuery. Limitation: protected method; implementation-specific.

```java
protected <T> UpdateQuery buildUpdateQueryByEntity(T entity)
```

--------------------------------

### Add and Manage Rescorer Queries in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Incorporate 'RescorerQuery' to refine search results after the initial query. This allows for secondary scoring or filtering. `getRescorerQueries()` retrieves the list of added rescorer queries.

```java
public void addRescorerQuery(RescorerQuery rescorerQuery)
public void setRescorerQueries(List<RescorerQuery> rescorerQueryList)
public List<RescorerQuery> getRescorerQueries()
```

--------------------------------

### Execute Multi Search Query with Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/SearchHits

Executes a multi-search query against Elasticsearch, returning a list of SearchHits. This method supports multiple classes and indexes.

```java
List<SearchHits<?>> multiSearch(List<? extends Query> queries, List<Class<?>> classes, List<IndexCoordinates> indexes)
```

--------------------------------

### Geohash Encoding and Decoding API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/utils/geohash/Geohash

Endpoints for encoding and decoding geohash values between different formats.

```APIDOC
## POST /api/geohash/encode

### Description
Encode longitude and latitude values to a geohash string.

### Method
POST

### Endpoint
/api/geohash/encode

### Parameters
#### Request Body
- **lon** (double) - Required - Longitude value to encode
- **lat** (double) - Required - Latitude value to encode
- **level** (int) - Optional - Precision level for encoding (default: maximum precision)

### Request Example
{
  "lon": -73.935242,
  "lat": 40.730610,
  "level": 8
}

### Response
#### Success Response (200)
- **geohash** (string) - Encoded geohash string

#### Response Example
{
  "geohash": "dr5ruj4477kd"
}
```

```APIDOC
## GET /api/geohash/decode

### Description
Decode a geohash string to latitude and longitude coordinates.

### Method
GET

### Endpoint
/api/geohash/decode

### Parameters
#### Query Parameters
- **geohash** (string) - Required - Geohash string to decode

### Response
#### Success Response (200)
- **lat** (double) - Decoded latitude value
- **lon** (double) - Decoded longitude value

#### Response Example
{
  "lat": 40.730610,
  "lon": -73.935242
}
```

```APIDOC
## GET /api/geohash/neighbors

### Description
Get all neighboring geohashes for a given geohash.

### Method
GET

### Endpoint
/api/geohash/neighbors

### Parameters
#### Query Parameters
- **geohash** (string) - Required - Base geohash string
- **level** (int) - Optional - Precision level for neighbors (default: same as input geohash)

### Response
#### Success Response (200)
- **neighbors** (array) - Array of neighboring geohash strings

#### Response Example
{
  "neighbors": ["dr5ruj4477kf", "dr5ruj4477k9", "dr5ruj4477k3", "dr5ruj4477k6", "dr5ruj4477k4", "dr5ruj4477k1", "dr5ruj4477k7", "dr5ruj4477k5"]
}
```

```APIDOC
## GET /api/geohash/boundingbox

### Description
Get the bounding box coordinates for a given geohash.

### Method
GET

### Endpoint
/api/geohash/boundingbox

### Parameters
#### Query Parameters
- **geohash** (string) - Required - Geohash string to analyze

### Response
#### Success Response (200)
- **min_lon** (double) - Minimum longitude of bounding box
- **min_lat** (double) - Minimum latitude of bounding box
- **max_lon** (double) - Maximum longitude of bounding box
- **max_lat** (double) - Maximum latitude of bounding box

#### Response Example
{
  "min_lon": -73.935302,
  "min_lat": 40.730560,
  "max_lon": -73.935182,
  "max_lat": 40.730660
}
```

--------------------------------

### Create IDs Query using Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Generates a `Query` object to retrieve documents based on a provided list of IDs. This is an efficient way to fetch specific documents.

```java
public Query idsQuery(List<String> ids)
```

--------------------------------

### isSearchHitMethod Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks whether the return type of the underlying method is a `SearchHits` or a collection of `SearchHit`.

```APIDOC
## Method

### Description
Checks whether the return type of the underlying method is a `SearchHits` or a collection of `SearchHit`.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if the method has a `SearchHit` related return type.

#### Response Example
N/A
```

--------------------------------

### Configure Delete Query Versioning in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/DeleteQuery

Configures whether the document version is returned as part of a hit. This can be useful for optimistic locking or tracking document revisions.

```java
public DeleteQuery.Builder withVersion(@Nullable Boolean version)
```

--------------------------------

### Index a document (internal doIndex) (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Internal protected method that indexes a document represented by an IndexQuery into the specified IndexCoordinates. Returns the document id as a String. Used by higher-level indexing APIs.

```Java
public String doIndex(IndexQuery query, IndexCoordinates indexCoordinates)
```

--------------------------------

### getId Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Retrieves the identifier associated with the document.

```APIDOC
## Method

### getId
public String getId()

### Description
Retrieves the identifier associated with the document.

### Returns
- The identifier as a String.
```

--------------------------------

### Indices Shrink

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint shrinks an index, moving shards to a new index.  It can be called directly or with a builder function.

```APIDOC
## POST /_shrink

### Description
Shrinks an index, moving shards to a new index.

### Method
POST

### Endpoint
/_shrink

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **index** (string) - Required - Name of the index to shrink.

### Request Example
{
  "index": "my-index"
}

### Response
#### Success Response (200)
- **shrunk_index** (string) - Name of the new index created during shrinking.
```

--------------------------------

### aggregate(Query query, Class<?> entityType)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Perform an aggregation specified by the given query. This method does not specify an index, and aggregations are emitted one by one via Flux.

```APIDOC
## aggregate(Query query, Class<?> entityType)

### Description
Perform an aggregation specified by the given `query`.

### Method
Flux<? extends AggregationContainer<?>> aggregate(Query query, Class<?> entityType)

### Endpoint
aggregate

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **query** (Query) - Required - The query specifying the aggregation, must not be null
- **entityType** (Class<?>) - Required - The entity type class, must not be null

### Request Example
aggregate(query, entityType)

### Response
#### Success Response (Flux)
- **AggregationContainer<? extends AggregationContainer<?>>** - A Flux emitting matching aggregations one by one

#### Response Example
Flux<AggregationContainer<?>>
```

--------------------------------

### Indices Validate Query

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Validates a query without executing it.

```APIDOC
## POST /_validate/query

### Description
Validates a query without executing it.

### Method
POST

### Endpoint
/_validate/query

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **query** (object) - Required - The query to validate.

### Request Example
{
  "query": {
    "match": {
      "field": "value"
    }
  }
}

### Response
#### Success Response (200)
- **valid** (boolean) - Whether the query is valid.
```

--------------------------------

### Java: SearchHitsIterator - getExecutionDuration Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitsIterator

Retrieves the duration it took to complete the search request. This method is part of the SearchHitsIterator interface and returns the execution time as a Duration object.

```java
Duration getExecutionDuration();
```

--------------------------------

### GeoPoint String Representation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/geo/GeoPoint

Override for Object's toString method to provide a string representation of the GeoPoint instance.

```java
public String toString() {
    // Returns string representation of GeoPoint
}
```

--------------------------------

### Java: SearchHitsIterator Interface Definition

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitsIterator

Defines the SearchHitsIterator interface, which encapsulates SearchHit results and can be wrapped in a Java 8 Stream. It extends CloseableIterator and provides access to aggregations, execution duration, max score, total hits, and total hits relation.

```java
public interface SearchHitsIterator<T> extends CloseableIterator<SearchHit<T>> {
    // Method declarations for aggregations, execution duration, max score, total hits, etc.
    AggregationsContainer<?> getAggregations();
    Duration getExecutionDuration();
    float getMaxScore();
    long getTotalHits();
    TotalHitsRelation getTotalHitsRelation();
    default boolean hasAggregations();
}
```

--------------------------------

### Delete a document by ID with optional routing

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchTemplate

Deletes a document identified by its ID, optionally using a routing value, from the given index. Returns a Mono emitting the ID of the deleted document. The method is protected and used by higher‑level delete operations.

```java
protected Mono<String> doDeleteById(String id, @Nullable String routing, IndexCoordinates index) {
    // implementation omitted
}
```

--------------------------------

### Check if legacy template exists

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Checks if an index template exists using the legacy Elasticsearch interface through ReactiveIndexOperations. Takes an ExistsTemplateRequest parameter and returns a Mono with a boolean value indicating existence.

```java
public Mono<Boolean> existsTemplate(ExistsTemplateRequest existsTemplateRequest)
```

--------------------------------

### Index Refresh API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexOperations

Refreshes the index(es) this IndexOperations is bound to, making pending changes visible.

```APIDOC
## POST /indices/{indexName}/_refresh

### Description
Refresh the index(es) this IndexOperations is bound to.

### Method
POST

### Endpoint
/indices/{indexName}/_refresh

### Response
#### Success Response (200)
- **void** - Operation successful.

#### Response Example
```json
{
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```
```

--------------------------------

### NumberRangePropertyValueConverter Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/convert/NumberRangePropertyValueConverter

Documentation for the NumberRangePropertyValueConverter class, extending AbstractRangePropertyValueConverter. This converter is used for handling number ranges in Elasticsearch.

```APIDOC
## NumberRangePropertyValueConverter

### Description
Documentation for the NumberRangePropertyValueConverter class, extending AbstractRangePropertyValueConverter. This converter is used for handling number ranges in Elasticsearch.

### Method
Class

### Endpoint
N/A

### Parameters
#### Path Parameters
- N/A

#### Query Parameters
- N/A

#### Request Body
- N/A

### Request Example
N/A

### Response
#### Success Response (200)
- N/A

#### Response Example
N/A
```

--------------------------------

### ClusterHealth Class Methods

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/cluster/ClusterHealth

The ClusterHealth class provides getter methods to access various health metrics of an Elasticsearch cluster.

```APIDOC
## ClusterHealth Class

### Description
Provides information about the Elasticsearch cluster health including node counts, shard statuses, and task information.

### Methods
- **getClusterName()** - Returns the cluster name
- **getStatus()** - Returns the cluster status
- **getNumberOfNodes()** - Returns the number of nodes in the cluster
- **getNumberOfDataNodes()** - Returns the number of data nodes in the cluster
- **getActiveShards()** - Returns the number of active shards
- **getRelocatingShards()** - Returns the number of relocating shards
- **getActivePrimaryShards()** - Returns the number of active primary shards
- **getInitializingShards()** - Returns the number of initializing shards
- **getUnassignedShards()** - Returns the number of unassigned shards
- **getActiveShardsPercent()** - Returns the percentage of active shards
- **getNumberOfPendingTasks()** - Returns the number of pending tasks
- **isTimedOut()** - Returns whether the request timed out
- **getNumberOfInFlightFetch()** - Returns the number of in-flight fetches
- **getDelayedUnassignedShards()** - Returns the number of delayed unassigned shards
- **getTaskMaxWaitingTimeMillis()** - Returns the maximum waiting time for tasks in milliseconds
- **toString()** - Returns a string representation of the cluster health
- **builder()** - Returns a builder for creating ClusterHealth instances
```

--------------------------------

### DELETE /_data_stream/{data_stream}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint is used to delete a data stream.  It allows for specifying a function to build the DeleteDataStreamRequest.

```APIDOC
## DELETE /_data_stream/{data_stream}

### Description
Deletes a data stream.

### Method
DELETE

### Endpoint
/_data_stream/{data_stream}

### Parameters
#### Path Parameters
- **data_stream** (string) - Required - The name of the data stream to delete.

### Request Example
{
  "data_stream": "my_data_stream"
}

### Response
#### Success Response (200)
- **Acknowledged** (boolean) - Indicates whether the data stream deletion was acknowledged.
```

--------------------------------

### getIndexCoordinates

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Returns the index coordinates.

```APIDOC
## GET /indexCoordinates

### Description
Returns the index coordinates.

### Method
GET

### Endpoint
/indexCoordinates

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
{
  "example": "N/A"
}

### Response
#### Success Response (200)
- **coordinates** (IndexCoordinates) - The index coordinates.

#### Response Example
{
  "coordinates": null
}
```

--------------------------------

### DELETE /_alias/{alias}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This endpoint is used to delete an alias. It allows for specifying a function to build the DeleteAliasRequest.

```APIDOC
## DELETE /_alias/{alias}

### Description
Deletes an alias.

### Method
DELETE

### Endpoint
/_alias/{alias}

### Parameters
#### Path Parameters
- **alias** (string) - Required - The name of the alias to delete.

### Request Example
{
  "alias": "my_alias"
}

### Response
#### Success Response (200)
- **Acknowledged** (boolean) - Indicates whether the alias deletion was acknowledged.
```

--------------------------------

### isNotSearchHitMethod Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks whether the return type of the underlying method is neither a `SearchHits` nor a collection of `SearchHit`.

```APIDOC
## Method

### Description
Checks whether the return type of the underlying method is neither a `SearchHits` nor a collection of `SearchHit`.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if the method has not a `SearchHit` related return type.

#### Response Example
N/A
```

--------------------------------

### Update documents by query (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Executes an update-by-query operation, applying the UpdateQuery to all documents that match the query within the given index. Returns a ByQueryResponse detailing the result.

```Java
public ByQueryResponse updateByQuery(UpdateQuery updateQuery, IndexCoordinates index)
```

--------------------------------

### Remote Class Getters in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/reindex/Remote

This Java code snippet showcases various getter methods for the `Remote` class. These methods allow retrieval of specific connection details for a remote Elasticsearch instance, including the host, username, password, socket timeout, connect timeout, scheme, port, and path prefix. Some getters are marked as nullable, indicating that the corresponding properties might not always be set.

```java
public String getHost()
@Nullable public String getUsername()
@Nullable public String getPassword()
@Nullable public Duration getSocketTimeout()
@Nullable public Duration getConnectTimeout()
public String getScheme()
public int getPort()
@Nullable public String getPathPrefix()
```

--------------------------------

### Retrieve Suggestion Data from Response Objects

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/class-use/Suggest.Suggestion.Entry

Methods for accessing suggestion data from Suggest response objects using generic type parameters. Returns either single suggestions by name or lists of all suggestions.

```java
public Suggest.Suggestion<? extends Suggest.Suggestion.Entry<? extends Suggest.Suggestion.Entry.Option>> getSuggestion(String name) {}

public List<Suggest.Suggestion<? extends Suggest.Suggestion.Entry<? extends Suggest.Suggestion.Entry.Option>>> getSuggestions() {}
```

--------------------------------

### Java: GetIndexTemplateRequest Record Definition

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/GetIndexTemplateRequest

Defines the GetIndexTemplateRequest record class, used for requesting an index template. This record class extends Record and contains a templateName field. It also provides methods for equality, hashing, and string representation.

```java
public record GetIndexTemplateRequest(String templateName) extends Record {
}
```

--------------------------------

### Delete legacy index template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Deletes an index template using the legacy Elasticsearch interface through ReactiveIndexOperations. Takes a DeleteTemplateRequest parameter and returns a Mono with a boolean value indicating successful deletion.

```java
public Mono<Boolean> deleteTemplate(DeleteTemplateRequest deleteTemplateRequest)
```

--------------------------------

### PUT /mapping

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Updates the mapping of an existing index. This allows you to modify field mappings, add new fields, or change field properties.

```APIDOC
## PUT /mapping

### Description
Updates the mapping of an existing index. This allows you to modify field mappings, add new fields, or change field properties.

### Method
PUT

### Endpoint
/mapping

### Parameters
#### Request Body
- **putMappingRequest** (PutMappingRequest) - Required - Request object containing mapping updates

### Response
#### Success Response (200)
- **PutMappingResponse** (object) - Response containing mapping update result

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### Replace placeholders in Elasticsearch query strings using QueryStringPlaceholderReplacer (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/support/QueryStringPlaceholderReplacer

This Java class replaces placeholder tokens like ?0, ?1, ?2 in an Elasticsearch query string. It depends on Spring's ConversionService and a ParameterAccessor to resolve parameter values. The replacePlaceholders method returns the query string with all placeholders.

```Java
public final class QueryStringPlaceholderReplacer {
    private final ConversionService conversionService;

    public QueryStringPlaceholderReplacer(ConversionService conversionService) {
        this.conversionService = conversionService;
    }

    public String replacePlaceholders(String input, ParameterAccessor accessor) {
        // implementation omitted
        return null;
    }
}
```

--------------------------------

### exists

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Checks if an entity with given id exists. Returns true if a matching document exists.

```APIDOC
## GET /{index}/_doc/{id}

### Description
Check if an entity with given id exists.

### Method
HEAD

### Endpoint
/{index}/_doc/{id}

### Parameters
#### Path Parameters
- **id** (String) - Required - The _id of the document to look for
- **clazz** (Class<?>) - Required - The domain type used

### Response
#### Success Response (200)
- **boolean** - true if document exists, false otherwise
```

--------------------------------

### Set Document Version (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Sets the version for the Document. This default method allows explicit control over the document's version number. It takes a long value representing the version.

```java
default void setVersion(long version)
Set the version for this `Document`.
```

--------------------------------

### DateFormat Enum Utility Methods (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/DateFormat

These methods provide access to the enum constants: values() returns all constants as an array; valueOf(String) retrieves a constant by name (throws exceptions for invalid or null input); getPattern() returns the string pattern for the format. Standard enum behavior with getPattern() added since version 4.2. No additional dependencies. Inputs for valueOf are string names; outputs are DateFormat instances or arrays thereof. Limitations: Exact name matching required; no fuzzy search.

```Java
public static DateFormat[] values() {}

public static DateFormat valueOf(String name) {}

public String getPattern() {}
```

--------------------------------

### toLatLon

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/utils/geohash/Geohash

Converts a geohash to a string in the format "lat,lon".

```APIDOC
## toLatLon

### Description
Converts a geohash to a string in the format "lat,lon".

### Method
GET

### Endpoint
/toLatLon/{geohash}

### Parameters
#### Path Parameters
- **geohash** (String) - Required - The geohash to convert.

### Request Example
{
  "geohash": "02j47"
}

### Response
#### Success Response (200)
- **latLon** (String) - The latitude,longitude pair in a String.

#### Response Example
{
  "latLon": "20.0,10.0"
}
```

--------------------------------

### Implement equals Method in IndexedObjectInformation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexedObjectInformation

The equals method in IndexedObjectInformation compares this record with another object for equality. Objects are equal if they are of the same class and all components are equal. This method is specified by the Record class.

```Java
public final boolean equals(Object o) {
  if (this == o) return true;
  if (o == null || getClass() != o.getClass()) return false;
  IndexedObjectInformation that = (IndexedObjectInformation) o;
  return Objects.equals(id, that.id) && Objects.equals(index, that.index) && Objects.equals(seqNo, that.seqNo) && Objects.equals(primaryTerm, that.primaryTerm) && Objects.equals(version, that.version);
}
```

--------------------------------

### StringObjectMap Iteration and String Representation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/DefaultStringObjectMap

Methods for iterating over the map's entries using a BiConsumer and obtaining a string representation of the map. The toString method is overridden from the Object class.

```java
public void forEach(BiConsumer<? super String,? super Object> action)
public String toString()
```

--------------------------------

### Count documents matching a query in Elasticsearch - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Counts documents matching the provided Query for the given class. Uses the class for property mapping and to derive the index name when not explicitly overridden. Inputs: Query; entity class. Output: long count of matching documents.

```java
public long count(Query query, Class<?> clazz)
```

--------------------------------

### DELETE /delete

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Deletes the given entity extracting index from entity metadata.

```APIDOC
## DELETE /delete

### Description
Delete the given entity extracting index from entity metadata.

### Method
DELETE

### Endpoint
/delete

### Parameters
#### Request Body
- **entity** (Object) - Required - The entity to delete.

### Response
#### Success Response (200)
- **String** (Mono) - The ID of the removed document.

### Since
4.0
```

--------------------------------

### Obtain IndexOperations by index coordinates (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Provides an IndexOperations instance linked to a specific index identified by IndexCoordinates. This allows direct management of an existing index without referencing an entity class. Returns an IndexOperations implementation.

```Java
public IndexOperations indexOps(IndexCoordinates index)
```

--------------------------------

### hasCountQueryAnnotation Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks if the method is annotated with `CountQuery` or with `Query`(count = true).

```APIDOC
## Method

### Description
Checks if the method is annotated with `CountQuery` or with `Query`(count = true).

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if the method is annotated with `CountQuery` or with `Query`(count = true).

#### Response Example
N/A
```

--------------------------------

### ReactiveSearchOperations.aggregate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/AggregationContainer

Performs an aggregation query using ReactiveSearchOperations interface. Available in two variants - with and without index coordinates.

```APIDOC
## GET /_search

### Description
Performs an aggregation specified by the given query using ReactiveSearchOperations.

### Method
GET

### Endpoint
/_search

### Parameters
#### Query Parameters
- **query** (Query) - Required - The query object specifying the aggregation
- **entityType** (Class<?>) - Required - The entity type to aggregate on

### Response
#### Success Response (200)
- **Flux<? extends AggregationContainer<?>>** - A reactive stream of aggregation results
```

```APIDOC
## GET /{index}/_search

### Description
Performs an aggregation specified by the given query against a specific index using ReactiveSearchOperations.

### Method
GET

### Endpoint
/{index}/_search

### Parameters
#### Path Parameters
- **index** (String) - Required - The index name to search against

#### Query Parameters
- **query** (Query) - Required - The query object specifying the aggregation
- **entityType** (Class<?>) - Required - The entity type to aggregate on

### Response
#### Success Response (200)
- **Flux<? extends AggregationContainer<?>>** - A reactive stream of aggregation results
```

--------------------------------

### PUT /indices/mapping

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Updates the mapping definition for an Elasticsearch index. Returns a Mono that emits true if the mapping was successfully stored.

```APIDOC
## PUT /indices/mapping

### Description
Updates or creates the mapping definition for an Elasticsearch index.

### Method
PUT

### Endpoint
/indices/mapping

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **mapping** (Document) - Required - The mapping document to store

### Request Example
{
  "mapping": {
    "properties": {
      "newField": {
        "type": "text",
        "analyzer": "standard"
      }
    }
  }
}

### Response
#### Success Response (200)
- **result** (Boolean) - True if mapping was successfully stored

#### Response Example
{
  "result": true
}
```

--------------------------------

### org.springframework.data.elasticsearch.core.convert.getMappingContext

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/class-use/ElasticsearchPersistentEntity

Retrieves the mapping context used for converting Elasticsearch mappings. It's crucial for handling property mappings.

```APIDOC
## GET /api/getMappingContext

### Description
Retrieves the mapping context used for converting Elasticsearch mappings.

### Method
GET

### Endpoint
/api/getMappingContext

### Parameters
#### Path Parameters
None

### Request Body
None

### Response
#### Success Response (200)
- **mappingContext** (MappingContext<? extends ElasticsearchPersistentEntity<?>,ElasticsearchPersistentProperty>) - The mapping context.
```

--------------------------------

### Bulk Operations API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

API endpoints for performing bulk operations on Elasticsearch documents including bulk updates with failure handling.

```APIDOC
## bulkUpdate

### Description
Bulk update all objects using a list of UpdateQuery objects.

### Method
void

### Endpoint
bulkUpdate(List<UpdateQuery> queries, BulkOptions bulkOptions, IndexCoordinates index)

### Parameters
#### Path Parameters
- **queries** (List<UpdateQuery>) - Required - the queries to execute in bulk
- **bulkOptions** (BulkOptions) - Required - options to be added to the bulk request
- **index** (IndexCoordinates) - Required - the index coordinates

### Response
#### Error Response
- **BulkFailureException** - Thrown with information about the failed operation

### Since
4.1
```

--------------------------------

### Implement toString Method in IndexedObjectInformation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexedObjectInformation

The toString method in IndexedObjectInformation returns a string representation of the record, including class name and component values. This method is specified by the Record class.

```Java
public final String toString() {
  return "IndexedObjectInformation[id=" + id + ", index=" + index + ", seqNo=" + seqNo + ", primaryTerm=" + primaryTerm + ", version=" + version + "]";
}
```

--------------------------------

### Override toString Method in SearchDocument Interface (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Overrides the toString method from java.lang.Object to provide a string representation of the document. Declared in the SearchDocument interface; takes no parameters and returns a String. No implementation is provided in the interface.

```Java
public String toString();
```

--------------------------------

### updateByQuery in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Updates documents matching a given query.

```java
public Mono<ByQueryResponse> updateByQuery(UpdateQuery updateQuery, IndexCoordinates index) {}
// Usage
UpdateQuery updateQuery = UpdateQuery.builder("id1").withDoc("field", "value").build();
reactiveElasticsearchTemplate.updateByQuery(updateQuery, indexCoordinates).subscribe();
```

--------------------------------

### Java - TotalHitsRelation ValueOf Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/TotalHitsRelation

This snippet demonstrates the static valueOf method for retrieving a TotalHitsRelation constant by name. It's part of the Spring Data Elasticsearch library and provides a way to access enum constants.

```java
static TotalHitsRelation valueOf(String name)
```

--------------------------------

### AbstractPropertyValueConverter

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/convert/AbstractPropertyValueConverter

Base class for property value converters in Spring Data Elasticsearch. Provides common functionality for converting property values between different representations.

```APIDOC
## AbstractPropertyValueConverter

### Description
Base abstract class for property value converters in Spring Data Elasticsearch. Implements the PropertyValueConverter interface and provides common functionality for subclasses.

### Constructor
public AbstractPropertyValueConverter(PersistentProperty<?> property)

### Methods
#### getProperty
protected PersistentProperty<?> getProperty()
Returns the persistent property associated with this converter.

#### Inherited Methods
From Object class: clone, equals, finalize, getClass, hashCode, notify, notifyAll, toString, wait
From PropertyValueConverter interface: read, write
```

--------------------------------

### Document to JSON Conversion

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Method to serialize the current Document object into a JSON string representation. Auxiliary values such as ID and version are excluded from the JSON output. This is useful for logging or externalizing document data.

```java
public String toJson()
```

--------------------------------

### Set Document ID (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Sets the identifier for the Document. This is a default method on the Document interface. It takes a String representing the ID as input.

```java
default void setId(String id)
Set the identifier for this `Document`.
```

--------------------------------

### isSearchPageMethod Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks if the return type is `SearchPage`.

```APIDOC
## Method

### Description
Checks if the return type is `SearchPage`.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if the return type is `SearchPage`.

#### Response Example
N/A
```

--------------------------------

### isNotSearchPageMethod Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/ElasticsearchQueryMethod

Checks if the return type is not `SearchPage`.

```APIDOC
## Method

### Description
Checks if the return type is not `SearchPage`.

### Method
GET

### Endpoint
N/A (Method)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **return** (boolean) - True if the return type is not `SearchPage`.

#### Response Example
N/A
```

--------------------------------

### Getter Methods for Query Components in NativeQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/NativeQuery

These methods retrieve query elements such as the main query, filter, aggregations, suggester, field collapse, sort options, search extensions, and KNN searches. They return null or empty collections if not set, allowing access to configured query parts for Elasticsearch operations. Introduced in versions 5.1 and 5.3.1 for specific features.

```java
@Nullable public co.elastic.clients.elasticsearch._types.query_dsl.Query getQuery()
@Nullable public co.elastic.clients.elasticsearch._types.query_dsl.Query getFilter()
public Map<String,co.elastic.clients.elasticsearch._types.aggregations.Aggregation> getAggregations()
@Nullable public co.elastic.clients.elasticsearch.core.search.Suggester getSuggester()
@Nullable public co.elastic.clients.elasticsearch.core.search.FieldCollapse getFieldCollapse()
public List<co.elastic.clients.elasticsearch._types.SortOptions> getSortOptions()
public Map<String,co.elastic.clients.json.JsonData> getSearchExtensions()
@Nullable public List<co.elastic.clients.elasticsearch._types.KnnSearch> getKnnSearches()
```

--------------------------------

### Access cluster operations (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Retrieves a ClusterOperations instance that uses the same client configuration as the current ElasticsearchTemplate. It enables cluster-level actions such as health checks and node info retrieval.

```Java
public ClusterOperations cluster()
```

--------------------------------

### StringObjectMap Path Retrieval

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/DefaultStringObjectMap

Retrieves an object from the map using a dot-separated path string. Returns null if no object exists at the specified path. The path parameter must not be null.

```java
@Nullable public Object path(String path)
```

--------------------------------

### Retrieve Script from Elasticsearch using Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Retrieves a script by its name from the Elasticsearch cluster. Returns the `Script` object if found, or null if no script with the given name exists. Part of `ScriptOperations`.

```java
@Nullable public Script getScript(String name)
```

--------------------------------

### Define IndexedObjectInformation Record in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexedObjectInformation

The IndexedObjectInformation record class captures details about a newly indexed document in Elasticsearch. It includes components for ID, index, sequence number, primary term, and version. All components are nullable.

```Java
public record IndexedObjectInformation(@Nullable String id, @Nullable String index, @Nullable Long seqNo, @Nullable Long primaryTerm, @Nullable Long version) extends Record
```

--------------------------------

### Java ElasticsearchErrorCause Class

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/ElasticsearchErrorCause

This snippet demonstrates the ElasticsearchErrorCause class in Java. It extends Object and provides methods for retrieving error details like type, reason, stack trace, and related causes.

```java
public class ElasticsearchErrorCause extends Object
Object describing an Elasticsearch error

public ElasticsearchErrorCause(@Nullable String type, String reason, @Nullable String stackTrace, @Nullable ElasticsearchErrorCause causedBy, List<ElasticsearchErrorCause> rootCause, List<ElasticsearchErrorCause> suppressed)

@Nullable public String getType()
public String getReason()
@Nullable public String getStackTrace()
@Nullable public ElasticsearchErrorCause getCausedBy()
public List<ElasticsearchErrorCause> getRootCause()
public List<ElasticsearchErrorCause> getSuppressed()
```

--------------------------------

### Bulk index objects in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Performs bulk indexing operations in Elasticsearch. Will save or update objects. Available with different parameter combinations including BulkOptions for request customization. Throws BulkFailureException with operation details on failure.

```java
default List<IndexedObjectInformation> bulkIndex(List<IndexQuery> queries, Class<?> clazz)
```

```java
default List<IndexedObjectInformation> bulkIndex(List<IndexQuery> queries, IndexCoordinates index)
```

```java
List<IndexedObjectInformation> bulkIndex(List<IndexQuery> queries, BulkOptions bulkOptions, Class<?> clazz)
```

```java
List<IndexedObjectInformation> bulkIndex(List<IndexQuery> queries, BulkOptions bulkOptions, IndexCoordinates index)
```

--------------------------------

### Execute Multi Search Query with Single Index using Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/SearchHits

Executes a multi-search query against Elasticsearch for a single index, returning a list of SearchHits. This overload is useful when all queries target the same index.

```java
List<SearchHits<?>> multiSearch(List<? extends Query> queries, List<Class<?>> classes, IndexCoordinates index)
```

--------------------------------

### getRefreshInterval

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Returns the refresh interval.

```APIDOC
## GET /refreshInterval

### Description
Returns the refresh interval.

### Method
GET

### Endpoint
/refreshInterval

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
{
  "example": "N/A"
}

### Response
#### Success Response (200)
- **interval** (String) - The refresh interval.

#### Response Example
{
  "interval": "1s"
}
```

--------------------------------

### DELETE /_data_stream

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Deletes a data stream. This endpoint allows for the deletion of a data stream, which is a combined logical index and template.

```APIDOC
## DELETE /_data_stream

### Description
Deletes a data stream, effectively removing the associated index patterns and configured settings.

### Method
DELETE

### Endpoint
/_data_stream

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": null
}

### Response
#### Success Response (200)
- **response** (object) - The response from the Elasticsearch server.
```

--------------------------------

### Transform Document with Function (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Applies a given function to the Document. This default method allows for functional transformations on the document object. It takes a Function as input and returns the result of the transformation.

```java
default <R> R transform(Function<? super Document,? extends R> transformer)
This method allows the application of a function to `this` `Document`.
```

--------------------------------

### DELETE /{index}/_doc/{id}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Deletes a document by its identifier from the specified index.

```APIDOC
## DELETE /{index}/_doc/{id}

### Description
Deletes the document identified by the given ID from the specified Elasticsearch index.

### Method
DELETE

### Endpoint
/{index}/_doc/{id}

### Parameters
#### Path Parameters
- **index** (string) - Required - Name of the Elasticsearch index.
- **id** (string) - Required - Identifier of the document to delete.

### Response
#### Success Response (200)
- **result** (string) - Result status, e.g., "deleted".

### Response Example
{
  "result": "deleted"
}
```

--------------------------------

### ReactiveIndexOperations.deleteIndexTemplate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/class-use/DeleteIndexTemplateRequest

Reactive method for deleting an index template in Spring Data Elasticsearch. Returns a Mono<Boolean> for asynchronous handling.

```APIDOC
## ReactiveIndexOperations.deleteIndexTemplate(DeleteIndexTemplateRequest deleteIndexTemplateRequest)

### Description
Deletes an index template reactively using the provided request. Part of the org.springframework.data.elasticsearch.core package, suitable for non-blocking applications.

### Method
Java Method (Reactive)

### Endpoint
N/A (Internal Java operation)

### Parameters
#### Request Body
- **deleteIndexTemplateRequest** (DeleteIndexTemplateRequest) - Required - The request object with template details.

### Request Example
ReactiveIndexOperations reactiveIndexOperations = // obtain instance
DeleteIndexTemplateRequest request = new DeleteIndexTemplateRequest("my-template");
Mono<Boolean> result = reactiveIndexOperations.deleteIndexTemplate(request);

### Response
#### Success Response
- **Mono<Boolean>** - Emits true if the delete was acknowledged.

#### Response Example
Mono.just(true)
```

--------------------------------

### Close a point-in-time (PIT) context in Elasticsearch using Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Closes a previously opened point-in-time identified by its PIT string. Returns a Mono emitting true on successful closure.

```Java
Mono<Boolean> closePointInTime(String pit);
```

--------------------------------

### getFilterQueryClass() Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActionParameters

Retrieves the class of the filter query.

```APIDOC
## getFilterQueryClass()

### Description
Retrieves the class of the filter query.

### Method
Instance Method

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (N/A)
- **filterQueryClass** (Class<?>) - The class of the filter query.

#### Response Example
N/A
```

--------------------------------

### DELETE /_index_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Deletes a composable index template.

```APIDOC
## DELETE /_index_template/{name}

### Description
Deletes an index template for composable templates.

### Method
DELETE

### Endpoint
/_index_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - Template name.

### Request Example
No request body required.

### Response
#### Success Response (200)
- **acknowledged** (boolean) - True if successful.

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### Parse JSON to Document (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Parses a JSON string into a Document object. This static method is provided by the Document interface for direct JSON parsing. It accepts a JSON string and returns a Document.

```java
static Document parse(String json)
Parse JSON to `Document`.
```

--------------------------------

### Set Reactive Batch Size for Elasticsearch Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Configure the batch size for reactive search operations in Elasticsearch. This controls the number of documents fetched in each batch when no limit or pagination is set.

```java
public void setReactiveBatchSize(Integer reactiveBatchSize)
public Integer getReactiveBatchSize()
```

--------------------------------

### POST /indices/refresh

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Refreshes one or more Elasticsearch indices to make all operations available for search. Returns a Mono that completes when the refresh operation finishes.

```APIDOC
## POST /indices/refresh

### Description
Refreshes Elasticsearch indices to make all operations available for search.

### Method
POST

### Endpoint
/indices/refresh

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{}

### Response
#### Success Response (200)
- **status** (String) - Operation completion status

#### Response Example
{
  "status": "completed"
}
```

--------------------------------

### REINDEX Operations API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

API for reindexing documents from a source to a destination index, supporting both synchronous and asynchronous operations.

```APIDOC
## reindex

### Description
Copies documents from a source to a destination. The source can be any existing index, alias, or data stream. The destination must differ from the source.

### Method
ReindexResponse

### Endpoint
reindex(ReindexRequest reindexRequest)

### Parameters
#### Path Parameters
- **reindexRequest** (ReindexRequest) - Required - reindex request parameters

### Response
#### Success Response (200)
- **ReindexResponse** (Object) - The reindex response

### Since
4.4

## submitReindex

### Description
Submits a reindex task asynchronously.

### Method
String

### Endpoint
submitReindex(ReindexRequest reindexRequest)

### Parameters
#### Path Parameters
- **reindexRequest** (ReindexRequest) - Required - reindex request parameters

### Response
#### Success Response (200)
- **taskId** (String) - The task ID for the submitted reindex operation

### Since
4.4
```

--------------------------------

### ElasticsearchConverter.mapObject(Object source)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/Document

Maps an object to a Document. This endpoint is used to convert a Java object into an Elasticsearch Document representation.

```APIDOC
## POST /_elasticsearch/mapObject

### Description
Maps an object to a `Document`.

### Method
POST

### Endpoint
/_elasticsearch/mapObject

### Parameters
#### Request Body
- **source** (object) - Required -  The Java object to be mapped.

### Request Example
{
  "source": {
    "field1": "value1",
    "field2": 123
  }
}

### Response
#### Success Response (200)
- **document** (object) - The resulting `Document`.
```

--------------------------------

### Define AggregationsContainer Interface in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AggregationsContainer

This Java interface defines a container for aggregations used in the Spring Data Elasticsearch API. It requires concrete implementations from code directly communicating with Elasticsearch. The interface has one method returning the aggregations object of type T, with no inputs and the concrete aggregations as output. It has no dependencies but relies on Elasticsearch client implementations; limitations include reliance on external client for actual aggregation data.

```java
/**
 * Aggregations container used in the Spring Data Elasticsearch API.
 * The concrete implementations must be provided by the code handling the direct communication with Elasticsearch.
 * 
 * @since 4.3
 * @author Peter-Josef Meisch
 */
public interface AggregationsContainer<T> {
    /**
     * Returns the concrete aggregations implementation.
     * 
     * @return the concrete aggregations implementation
     */
    T aggregations();
}
```

--------------------------------

### Update Index Aliases - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

This snippet demonstrates the `updateAliases` method for updating index aliases in Spring Data Elasticsearch. It accepts an UpdateAliasesRequest object or a Function to customize one and returns an UpdateAliasesResponse.

```java
public Mono<co.elastic.clients.elasticsearch.indices.UpdateAliasesResponse> updateAliases(co.elastic.clients.elasticsearch.indices.UpdateAliasesRequest request)
```

```java
public Mono<co.elastic.clients.elasticsearch.indices.UpdateAliasesResponse> updateAliases(Function<co.elastic.clients.elasticsearch.indices.UpdateAliasesRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.UpdateAliasesRequest>> fn)
```

```java
public Mono<co.elastic.clients.elasticsearch.indices.UpdateAliasesResponse> updateAliases()
```

--------------------------------

### closePointInTime(String pit)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Closes a point in time using the provided pit identifier.

```APIDOC
## closePointInTime(String pit)

### Description
Closes a point in time

### Method
Mono<Boolean> closePointInTime(String pit)

### Endpoint
closePointInTime

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **pit** (String) - Required - The pit identifier as returned by openPointInTime

### Request Example
closePointInTime(pit)

### Response
#### Success Response (Mono)
- **Boolean** - A Mono emitting true on success

#### Response Example
Mono<Boolean>
```

--------------------------------

### aggregate(Query query, Class<?> entityType, IndexCoordinates index)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveSearchOperations

Perform an aggregation specified by the given query on a specific index. Aggregations are emitted one by one via Flux.

```APIDOC
## aggregate(Query query, Class<?> entityType, IndexCoordinates index)

### Description
Perform an aggregation specified by the given `query`.

### Method
Flux<? extends AggregationContainer<?>> aggregate(Query query, Class<?> entityType, IndexCoordinates index)

### Endpoint
aggregate

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **query** (Query) - Required - The query specifying the aggregation, must not be null
- **entityType** (Class<?>) - Required - The entity type class, must not be null
- **index** (IndexCoordinates) - Required - The target index, must not be null

### Request Example
aggregate(query, entityType, index)

### Response
#### Success Response (Flux)
- **AggregationContainer<? extends AggregationContainer<?>>** - A Flux emitting matching aggregations one by one

#### Response Example
Flux<AggregationContainer<?>>
```

--------------------------------

### Check Component Template Existence in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Checks whether a component index template exists. Requires an ExistsComponentTemplateRequest object as input and returns a boolean indicating existence.

```Java
public boolean existsComponentTemplate(ExistsComponentTemplateRequest existsComponentTemplateRequest)
```

--------------------------------

### SearchDocument.getInnerHits

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/class-use/SearchDocumentResponse

This method retrieves the inner hits from a SearchDocument.

```APIDOC
## GET /api/inner-hits

### Description
Retrieves the inner hits from a SearchDocument.

### Method
GET

### Endpoint
/api/inner-hits

### Parameters
#### Path Parameters
- **documentId** (String) - Required - The ID of the document to retrieve inner hits from.

### Response
#### Success Response (200)
- **innerHits** (Map<String,SearchDocumentResponse>) - The map of inner hits.

#### Response Example
{
  "innerHits": {
    "nested_field": {
      "hits": {
        "total": {
          "value": 1,
          "relation": "eq"
        },
        "hits": [
          {
            "_source": {
              "id": "1",
              "name": "Nested Entity"
            }
          }
        ]
      }
    }
  }
}
```

--------------------------------

### toPoint

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/utils/geohash/Geohash

Returns a `Point` instance from a geohash string. Throws IllegalArgumentException if the geohash is invalid.

```APIDOC
## toPoint

### Description
Returns a `Point` instance from a geohash string. Throws IllegalArgumentException if the geohash is invalid.

### Method
GET

### Endpoint
/toPoint/{geohash}

### Parameters
#### Path Parameters
- **geohash** (String) - Required - The geohash string to convert.

### Request Example
{
  "geohash": "02j47"
}

### Response
#### Success Response (200)
- **point** (Point) - The Point instance corresponding to the geohash.

#### Response Example
{
  "point": {
    "x": 10.0,
    "y": 20.0
  }
}

#### Error Response (400)
- **error** (String) - Error message if geohash is invalid

#### Error Example (400)
{
  "error": "Invalid geohash format"
}
```

--------------------------------

### Delete Elasticsearch Index Operations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods for deleting indices, aliases, data streams, and templates. Each operation supports both direct request objects and builder functions for flexible request construction. Returns Mono<DeleteResponse> for reactive handling.

```java
// Delete Index
public Mono<DeleteIndexResponse> delete(co.elastic.clients.elasticsearch.indices.DeleteIndexRequest request)
public Mono<DeleteIndexResponse> delete(Function<DeleteIndexRequest.Builder, ObjectBuilder<DeleteIndexRequest>> fn)

// Delete Alias
public Mono<DeleteAliasResponse> deleteAlias(co.elastic.clients.elasticsearch.indices.DeleteAliasRequest request)
public Mono<DeleteAliasResponse> deleteAlias(Function<DeleteAliasRequest.Builder, ObjectBuilder<DeleteAliasRequest>> fn)

// Delete Data Stream
public Mono<DeleteDataStreamResponse> deleteDataStream(co.elastic.clients.elasticsearch.indices.DeleteDataStreamRequest request)
public Mono<DeleteDataStreamResponse> deleteDataStream(Function<DeleteDataStreamRequest.Builder, ObjectBuilder<DeleteDataStreamRequest>> fn)

// Delete Index Template
public Mono<DeleteIndexTemplateResponse> deleteIndexTemplate(co.elastic.clients.elasticsearch.indices.DeleteIndexTemplateRequest request)
public Mono<DeleteIndexTemplateResponse> deleteIndexTemplate(Function<DeleteIndexTemplateRequest.Builder, ObjectBuilder<DeleteIndexTemplateRequest>> fn)

// Delete Template
public Mono<DeleteTemplateResponse> deleteTemplate(co.elastic.clients.elasticsearch.indices.DeleteTemplateRequest request)
public Mono<DeleteTemplateResponse> deleteTemplate(Function<DeleteTemplateRequest.Builder, ObjectBuilder<DeleteTemplateRequest>> fn)
```

--------------------------------

### getNeighbors

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/utils/geohash/Geohash

Calculate all neighbors of a given geohash cell.

```APIDOC
## getNeighbors

### Description
Calculate all neighbors of a given geohash cell.

### Method
GET

### Endpoint
/getNeighbors/{geohash}

### Parameters
#### Path Parameters
- **geohash** (String) - Required - Geohash of the defined cell.

### Request Example
{
  "geohash": "02j47"
}

### Response
#### Success Response (200)
- **neighbors** (Collection) - geohashes of all neighbor cells.

#### Response Example
{
  "neighbors": ["02j48", "02j46", "02j57", "02j37"]
}
```

--------------------------------

### Store script in Elasticsearch cluster

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/ScriptOperations

Stores a given script in the Elasticsearch cluster. Returns true if the operation was successful. Requires a Script object as input.

```Java
boolean putScript(Script script)
```

--------------------------------

### Document Deletion

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Methods for deleting documents from Elasticsearch. Supports deletion by entity object, by ID with optional index coordinates, or by ID and entity type. Returns the ID of the deleted document.

```java
String
delete(Object entity)

```

```java
String
delete(Object entity, IndexCoordinates index)

```

```java
String
delete(String id, Class<?> entityType)

```

```java
String
delete(String id, IndexCoordinates index)

```

--------------------------------

### isExistsQuery Method in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/RepositoryStringQuery

Protected method to check if the current query is an exists query. Returns true if it is an exists query.

```Java
protected boolean isExistsQuery()
```

--------------------------------

### Delete documents by query (Java, class and index)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Deletes all documents matching the DeleteQuery for a specified entity class and target index. Allows precise control over the index used for deletion. Returns a ByQueryResponse containing operation details.

```Java
public ByQueryResponse delete(DeleteQuery query, Class<?> clazz, IndexCoordinates index)
```

--------------------------------

### delete

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Deletes the one object with provided id. Returns documentId of the document deleted.

```APIDOC
## DELETE /{index}/_doc/{id}

### Description
Delete the one object with provided id.

### Method
DELETE

### Endpoint
/{index}/_doc/{id}

### Parameters
#### Path Parameters
- **id** (String) - Required - The document to delete
- **index** (IndexCoordinates) - Required - The index from which to delete

### Response
#### Success Response (200)
- **String** - documentId of the document deleted
```

--------------------------------

### Java NestedMetaData getOffset Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/NestedMetaData

Retrieves the offset associated with the nested meta data. This method returns the offset as an integer. No input parameters are required.

```java
public int getOffset()
```

--------------------------------

### Elasticsearch Persistent Entity - Index Metadata

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Retrieve index-related metadata for the Elasticsearch persistent entity.

```APIDOC
## GET /api/elasticsearch/entity/index-metadata

### Description
Retrieves index-related metadata for the Elasticsearch persistent entity, including index coordinates, aliases, shard count, replica count, refresh interval, index store type, and settings path.

### Method
GET

### Endpoint
/api/elasticsearch/entity/index-metadata

### Parameters
#### Query Parameters
- **entityName** (string) - Required - The name of the persistent entity to retrieve metadata for.

### Response
#### Success Response (200)
- **indexCoordinates** (IndexCoordinates) - The coordinates of the index.
- **aliases** (Set<Alias>) - A set of aliases associated with the index.
- **shards** (short) - The number of shards for the index.
- **replicas** (short) - The number of replicas for the index.
- **refreshInterval** (String) - The refresh interval for the index.
- **indexStoreType** (String) - The type of index store.
- **settingPath** (String) - The path to the index settings file.

#### Response Example
{
  "indexCoordinates": {
    "name": "my-index",
    "order": 0
  },
  "aliases": [
    {
      "name": "my-alias"
    }
  ],
  "shards": 1,
  "replicas": 0,
  "refreshInterval": "1s",
  "indexStoreType": "fs",
  "settingPath": "/path/to/settings.json"
}
```

--------------------------------

### Check for Bulk Operation Failures in Elasticsearch using Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Processes a `BulkResponse` from Elasticsearch to extract and return information about any failed indexed operations. Returns a list of `IndexedObjectInformation` for failed items.

```java
protected List<IndexedObjectInformation> checkForBulkOperationFailure(co.elastic.clients.elasticsearch.core.BulkResponse bulkResponse)
```

--------------------------------

### DELETE /_index_template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Deletes an index template.  This endpoint is used to remove a template from Elasticsearch's configuration, preventing it from being applied to new indices.

```APIDOC
## DELETE /_index_template

### Description
Deletes an index template, ensuring new indices that would have used this template no longer do so.

### Method
DELETE

### Endpoint
/_index_template

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the index template to delete.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "name": "my_template"
  }
}

### Response
#### Success Response (200)
- **response** (object) - The response from the Elasticsearch server.
```

--------------------------------

### DELETE /_template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Deletes a template.  This endpoint removes a template from Elasticsearch, impacting indices created using that template.

```APIDOC
## DELETE /_template

### Description
Deletes a template, effectively removing it from Elasticsearch and preventing it from being used for new indices.

### Method
DELETE

### Endpoint
/_template

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the template to delete.

#### Query Parameters
None

#### Request Body
None

### Request Example
{
  "request": {
    "name": "my_template"
  }
}

### Response
#### Success Response (200)
- **response** (object) - The response from the Elasticsearch server.
```

--------------------------------

### isCountQuery Method in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/RepositoryStringQuery

Method to check if the current query is a count query. Returns true if it is a count query.

```Java
public boolean isCountQuery()
```

--------------------------------

### Delete documents by query (Java, class only)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Deletes all documents that match the provided DeleteQuery for a given entity class. The entity class must be annotated with @Document. Returns a ByQueryResponse with details about the operation.

```Java
public ByQueryResponse delete(DeleteQuery query, Class<?> clazz)
```

--------------------------------

### ElasticsearchCollectionValueToStringConverter

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/support/value/ElasticsearchCollectionValueToStringConverter

This class converts a collection into a string representation suitable for the value part of an Elasticsearch query. It handles specific formatting for String collections, ensuring proper escaping and quoting for query compatibility.

```APIDOC
## ElasticsearchCollectionValueToStringConverter

### Description
Converts a collection into a string for the value part of an Elasticsearch query. If the value is a `String`, it's wrapped in square brackets with each element quoted and escaped.

### Method
`convert(Object source, TypeDescriptor sourceType, TypeDescriptor targetType)`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None (This is a converter class, not an API endpoint)

### Request Example
This converter is used internally by Spring Data Elasticsearch and does not have a direct request example in terms of an HTTP request.

### Response
#### Success Response (200)
Returns an `Object` representing the converted string value.

#### Response Example
For a collection of strings like `["hello \"Stranger\"", "Another string"]`, the output would be a string formatted for an Elasticsearch query, e.g., `"[\"hello \\\"Stranger\\\"\", \"Another string\"]"`

```json
{
  "bool":{
    "must":{
      "terms":{
        "name": ["hello \"Stranger\"", "Another string"]
      }
    }
  }
}
```
```

--------------------------------

### Close Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to close an Elasticsearch index reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.CloseIndexResponse> close(co.elastic.clients.elasticsearch.indices.CloseIndexRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.CloseIndexResponse> close(Function<co.elastic.clients.elasticsearch.indices.CloseIndexRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.CloseIndexRequest>> fn)
```

--------------------------------

### getAliases

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Retrieves the aliases associated with the current entity.

```APIDOC
## GET /aliases

### Description
Retrieves the aliases associated with the current entity.

### Method
GET

### Endpoint
/aliases

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
{
  "example": "N/A"
}

### Response
#### Success Response (200)
- **aliases** (Set<Alias>) - The aliases associated with the entity.

#### Response Example
{
  "aliases": [ ]
}
```

--------------------------------

### Multi-get entities from Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Executes a multiGet operation against Elasticsearch for multiple IDs. Available since version 4.1. Takes a Query defining the object IDs and the entity class type, returning a list of MultiGetItem objects.

```java
<T> List<MultiGetItem<T>> multiGet(Query query, Class<T> clazz)
```

```java
<T> List<MultiGetItem<T>> multiGet(Query query, Class<T> clazz, IndexCoordinates index)
```

--------------------------------

### Check if index template exists

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Checks if an index template exists using ReactiveIndexOperations. Takes an ExistsIndexTemplateRequest parameter and returns a Mono with a boolean value indicating existence.

```java
public Mono<Boolean> existsIndexTemplate(ExistsIndexTemplateRequest existsIndexTemplateRequest)
```

--------------------------------

### Implement hashCode Method in IndexedObjectInformation

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/IndexedObjectInformation

The hashCode method in IndexedObjectInformation returns a hash code derived from all record components. This method is specified by the Record class.

```Java
public final int hashCode() {
  return Objects.hash(id, index, seqNo, primaryTerm, version);
}
```

--------------------------------

### Enum Constant Declarations

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/ScriptType

Individual enum constant declarations for INLINE and STORED script types. These constants define the two available script execution modes in Spring Data Elasticsearch update operations.

```java
public static final ScriptType INLINE;
public static final ScriptType STORED;
```

--------------------------------

### DELETE /indices

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Deletes an existing Elasticsearch index. Returns a Mono that emits true on successful deletion or false if the index does not exist.

```APIDOC
## DELETE /indices

### Description
Deletes an existing Elasticsearch index reactively.

### Method
DELETE

### Endpoint
/indices

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
{}

### Response
#### Success Response (200)
- **result** (Boolean) - True if index was deleted, false if index does not exist

#### Response Example
{
  "result": true
}
```

--------------------------------

### Define Alias Actions in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasActions

The AliasActions class in Spring Data Elasticsearch is used to define a series of actions for managing aliases. It allows adding multiple AliasAction elements and retrieving them. This class is crucial for operations involving index aliases within Elasticsearch.

```java
package org.springframework.data.elasticsearch.core.index;

import org.springframework.lang.Nullable;

import java.util.List;

/**
 * Class to define to actions to execute in alias management functions.
 *
 * @since 4.1
 * @author Peter-Josef Meisch
 */
public class AliasActions extends Object {

    /**
     * Creates an {@link AliasActions} object with the passed in action elements.
     *
     * @param actions {@link AliasAction} elements
     */
    public AliasActions(@Nullable AliasAction... actions) {
        // constructor implementation
    }

    /**
     * Adds {@link AliasAction} elements to this {@link AliasActions}
     *
     * @param actions elements to add
     * @return this object
     */
    public AliasActions add(@Nullable AliasAction... actions) {
        // method implementation
        return this;
    }

    /**
     * @return {@link List<AliasAction>}
     */
    public List<AliasAction> getActions() {
        // method implementation
        return null;
    }
}
```

--------------------------------

### exists in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Checks if a document with the given ID exists.

```java
public Mono<Boolean> exists(String id, Class<?> entityType) {}
public Mono<Boolean> exists(String id, IndexCoordinates index) {}
// Usage
Mono<Boolean> existsMono = reactiveElasticsearchTemplate.exists("id1", MyEntity.class, indexCoordinates);
existsMono.subscribe(exists -> log.info("Exists: {}", exists));
```

--------------------------------

### DynamicTemplates Annotation Declaration in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/DynamicTemplates

This annotation applies Elasticsearch dynamic templates to entity classes or fields, allowing flexible mapping without static configurations. It depends on Spring Data Elasticsearch and is omitted if @Mapping is present. Inputs include class-level application; outputs configure dynamic field mappings. Limitation: Only applicable when not using @Mapping.

```Java
@Inherited
@Retention(RUNTIME)
@Target(TYPE)
public @interface DynamicTemplates {

    String mappingPath() default "";
}
```

--------------------------------

### Java: SearchHitsIterator - getTotalHits Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitsIterator

Retrieves the total number of hits matching the search query. This method is part of the SearchHitsIterator interface and returns the total count as a long.

```java
long getTotalHits();
```

--------------------------------

### UPDATE Operations API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Methods for updating individual documents or groups of documents in Elasticsearch using partial updates or queries.

```APIDOC
## update (by Entity)

### Description
Partially update a document represented by the given entity.

### Method
<T> UpdateResponse

### Endpoint
update(T entity)

### Parameters
#### Type Parameters
- **T** (Generic) - the entity type

#### Path Parameters
- **entity** (T) - Required - the entity to update partially (must not be null)

### Response
#### Success Response (200)
- **UpdateResponse** (Object) - The update response

### Since
5.0

## update (by Entity with IndexCoordinates)

### Description
Partially update a document represented by the given entity in the specified index.

### Method
<T> UpdateResponse

### Endpoint
update(T entity, IndexCoordinates index)

### Parameters
#### Type Parameters
- **T** (Generic) - the entity type

#### Path Parameters
- **entity** (T) - Required - the entity to update partially (must not be null)
- **index** (IndexCoordinates) - Required - the index to use for the update (must not be null)

### Response
#### Success Response (200)
- **UpdateResponse** (Object) - The update response

### Since
5.1

## update (by UpdateQuery)

### Description
Perform a partial update of a document using an UpdateQuery.

### Method
UpdateResponse

### Endpoint
update(UpdateQuery updateQuery, IndexCoordinates index)

### Parameters
#### Path Parameters
- **updateQuery** (UpdateQuery) - Required - query defining the update
- **index** (IndexCoordinates) - Required - the index where to update the records

### Response
#### Success Response (200)
- **UpdateResponse** (Object) - The update response

## updateByQuery

### Description
Update multiple documents that match the provided query.

### Method
ByQueryResponse

### Endpoint
updateByQuery(UpdateQuery updateQuery, IndexCoordinates index)

### Parameters
#### Path Parameters
- **updateQuery** (UpdateQuery) - Required - query defining the update (must not be null)
- **index** (IndexCoordinates) - Required - the index where to update the records (must not be null)

### Response
#### Success Response (200)
- **ByQueryResponse** (Object) - The update response

### Since
4.2
```

--------------------------------

### Delete Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to delete an Elasticsearch index reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.DeleteIndexResponse> delete(co.elastic.clients.elasticsearch.indices.DeleteIndexRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.DeleteIndexResponse> delete(Function<co.elastic.clients.elasticsearch.indices.DeleteIndexRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.DeleteIndexRequest>> fn)
```

--------------------------------

### StringObjectMap JSON Serialization and Deserialization

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/DefaultStringObjectMap

Methods for converting a StringObjectMap to a JSON string and initializing a StringObjectMap from a JSON string. The toJson method excludes auxiliary values like ID and version.

```java
public String toJson()
public T fromJson(String json)
```

--------------------------------

### RefreshPolicy Access

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Provides access to the RefreshPolicy configuration used by the Elasticsearch template. The RefreshPolicy controls when changes made to the index become visible for search.

```java
RefreshPolicy
getRefreshPolicy()

```

--------------------------------

### Script Deletion

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Deletes a stored script from Elasticsearch by its name. Returns a boolean indicating whether the script was successfully deleted.

```java
boolean
deleteScript(String name)

```

--------------------------------

### Delete a document by id (internal doDelete) (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Protected method to delete a document identified by id (and optional routing) from the given index. Returns the id of the deleted document as a String.

```Java
protected String doDelete(String id, @Nullable String routing, IndexCoordinates index)
```

--------------------------------

### PUT /api/elasticsearch/update

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/class-use/IndexCoordinates

Updates a document in the specified index based on the provided update query.

```APIDOC
## PUT /api/elasticsearch/update

### Description
Updates a document in the specified index based on the provided update query.

### Method
PUT

### Endpoint
/api/elasticsearch/update

### Parameters
#### Path Parameters
- **index** (IndexCoordinates) - Required - The index containing the document to update.
- **updateQuery** (UpdateQuery) - Required - The update query specifying the changes to apply.

### Response
#### Success Response (200)
- **result** (UpdateResponse) - The result of the update operation.

#### Response Example
{
  "result": "UPDATED",
  "id": "1"
}
```

--------------------------------

### Java: SearchHitsIterator - hasAggregations Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitsIterator

Checks if aggregations are available with the search results. This default method is part of the SearchHitsIterator interface and returns a boolean.

```java
default boolean hasAggregations();
```

--------------------------------

### Entity Routing Resolution

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Retrieves the routing value for a given entity. This is often used in Elasticsearch for sharding and retrieval optimization, especially with join-type relations.

```java
String
getEntityRouting(Object entity)

```

--------------------------------

### Generic Data Retrieval and Type Casting

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

A generic method to retrieve a value by key and cast it to the expected type. This method simplifies data access by avoiding manual casting on the caller's side. It throws ClassCastException if the value type is not assignable to the specified type.

```java
@Nullable public <T> T get(Object key, Class<T> type)
```

--------------------------------

### Document Existence Check

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Checks if a document exists in Elasticsearch based on its ID. Supports checking with or without specifying index coordinates. Returns a boolean indicating whether the document exists.

```java
boolean
exists(String id, Class<?> clazz)

```

```java
boolean
exists(String id, IndexCoordinates index)

```

--------------------------------

### Configure Scroll Time for Elasticsearch Queries

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Set the scroll time for Elasticsearch delete queries. This is required when using scroll/bulk delete operations. The method `getScrollTime()` retrieves this setting.

```java
public void setScrollTime(@Nullable Duration scrollTime)
public Duration getScrollTime()
```

--------------------------------

### UpdateResponse getResult

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/UpdateResponse

Retrieves the result status of the update operation. This method allows clients to determine whether the update was successful or encountered issues.

```APIDOC
## GET /UpdateResponse/result

### Description
Returns the result status of the update operation that was performed.

### Method
GET

### Endpoint
/result

### Parameters
None

### Request Example
```
updateResponse.getResult()
```

### Response
#### Success Response (200)
- **result** (UpdateResponse.Result) - The status indicating the outcome of the update operation.

#### Response Example
```
{
  "result": "NOT_FOUND"
}
```
```

--------------------------------

### Store Script in Elasticsearch using Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Stores a given script in the Elasticsearch cluster. This operation is part of the `ScriptOperations` interface and is useful for managing stored scripts for complex queries.

```java
public boolean putScript(Script script)
```

--------------------------------

### Check document existence (internal doExists) (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Protected method that checks whether a document with the given id exists in the specified index. Returns true if the document is present, false otherwise.

```Java
protected boolean doExists(String id, IndexCoordinates index)
```

--------------------------------

### updateIndexedObject Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/class-use/IndexedObjectInformation

Updates an entity after it is stored in Elasticsearch with additional data like id, version, and sequence number.

```APIDOC
## updateIndexedObject Method

### Description
Updates an entity after it is stored in Elasticsearch with additional data like id, version, and sequence number.

### Method
POST

### Endpoint
updateIndexedObject(T entity, IndexedObjectInformation indexedObjectInformation, ElasticsearchConverter elasticsearchConverter, RoutingResolver routingResolver)

### Parameters
#### Path Parameters
- **entity** (T) - Required - The entity object to be updated
- **indexedObjectInformation** (IndexedObjectInformation) - Required - Information about the indexed object including id, version, seqno
- **elasticsearchConverter** (ElasticsearchConverter) - Required - Converter for Elasticsearch operations
- **routingResolver** (RoutingResolver) - Required - Resolver for routing information

#### Query Parameters
- **None**

#### Request Body
- **entity** (T) - Required - Entity object to update
- **indexedObjectInformation** (IndexedObjectInformation) - Required - Indexed object metadata
- **elasticsearchConverter** (ElasticsearchConverter) - Required - Elasticsearch converter instance
- **routingResolver** (RoutingResolver) - Required - Routing resolver instance

### Request Example
{
  "entity": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "indexedObjectInformation": {
    "id": "1",
    "seqNo": 5,
    "primaryTerm": 2,
    "version": 1
  },
  "elasticsearchConverter": "converter_instance",
  "routingResolver": "resolver_instance"
}

### Response
#### Success Response (200)
- **updatedEntity** (T) - The updated entity with indexed information

#### Response Example
{
  "updatedEntity": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "seqNo": 5,
    "primaryTerm": 2,
    "version": 1
  }
}
```

--------------------------------

### Configure Request Cache for Elasticsearch Queries

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Enable or disable the request cache for Elasticsearch queries. Caching can improve performance for frequently executed queries. `getRequestCache()` returns the current cache setting.

```java
public void setRequestCache(@Nullable Boolean value)
public Boolean getRequestCache()
```

--------------------------------

### Set doc value fields in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Sets the list of doc value fields on the query. This method takes a list of DocValueField objects and updates the query's doc value fields accordingly.

```Java
public void setDocValueFields(List<DocValueField> docValueFields)
```

--------------------------------

### Index Coordinates Determination

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/AbstractElasticsearchTemplate

Determines the IndexCoordinates for a given Java class. This helps in mapping classes to their corresponding Elasticsearch indices.

```java
IndexCoordinates
getIndexCoordinatesFor(Class<?> clazz)

```

--------------------------------

### Complete SortBy Enum Definition - Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/suggest/response/SortBy

Complete definition of the SortBy enum class from Spring Data Elasticsearch. This enum provides SCORE and FREQUENCY constants for sorting suggest responses. The enum extends java.lang.Enum and implements standard enum methods for constant access and value conversion. Introduced in version 4.3 by Peter-Josef Meisch.

```java
package org.springframework.data.elasticsearch.core.suggest.response;

/**
 * Enum representing sorting options for suggest responses.
 * 
 * @since 4.3
 * @author Peter-Josef Meisch
 */
public enum SortBy {
    /**
     * Sort by score (relevance).
     */
    SCORE,
    
    /**
     * Sort by frequency.
     */
    FREQUENCY;

    /**
     * Returns an array containing the constants of this enum class,
     * in the order they are declared.
     *
     * @return an array containing the constants of this enum class,
     *         in the order they are declared
     */
    public static SortBy[] values() {
        return new SortBy[] { SCORE, FREQUENCY };
    }

    /**
     * Returns the enum constant of this enum type with the specified name.
     * The string must match exactly an identifier used to declare an enum
     * constant in this type.
     *
     * @param name the name of the enum constant to be returned
     * @return the enum constant with the specified name
     * @throws IllegalArgumentException if this enum class has no constant
     *         with the specified name
     * @throws NullPointerException if the argument is null
     */
    public static SortBy valueOf(String name) {
        return valueOf(SortBy.class, name);
    }
}
```

--------------------------------

### Check if index template exists (Elasticsearch)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Checks if an index template exists using the legacy Elasticsearch interface. Returns a Mono of true if the template exists. Deprecated since Elasticsearch API v5.1.

```Java
@Deprecated
Mono<Boolean> existsTemplate(ExistsTemplateRequest existsTemplateRequest)
```

--------------------------------

### DateFormat Enum

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/DateFormat

Enum providing date format patterns compatible with Elasticsearch. These patterns are adapted for Java DateTimeFormatter.

```APIDOC
## DateFormat Enum

### Description
Enum providing date format patterns that are compatible with Elasticsearch. The patterns are adapted so that Java `DateTimeFormatter` produces the same values as the Elasticsearch formatter.

### Enum Constants
- `basic_date`
- `basic_date_time`
- `basic_date_time_no_millis`
- `basic_ordinal_date`
- `basic_ordinal_date_time`
- `basic_ordinal_date_time_no_millis`
- `basic_t_time`
- `basic_t_time_no_millis`
- `basic_time`
- `basic_time_no_millis`
- `basic_week_date`
- `basic_week_date_time`
- `basic_week_date_time_no_millis`
- `date`
- `date_hour`
- `date_hour_minute`
- `date_hour_minute_second`
- `date_hour_minute_second_fraction`
- `date_hour_minute_second_millis`
- `date_optional_time`
- `date_time`
- `date_time_no_millis`
- `epoch_millis`
- `epoch_second`
- `hour`
- `hour_minute`
- `hour_minute_second`
- `hour_minute_second_fraction`
- `hour_minute_second_millis`
- `ordinal_date`
- `ordinal_date_time`
- `ordinal_date_time_no_millis`
- `strict_basic_week_date`
- `strict_basic_week_date_time`
- `strict_basic_week_date_time_no_millis`
- `strict_date`
- `strict_date_hour`
- `strict_date_hour_minute`
- `strict_date_hour_minute_second`
- `strict_date_hour_minute_second_fraction`
- `strict_date_hour_minute_second_millis`
- `strict_date_optional_time`
- `strict_date_optional_time_nanos`
- `strict_date_time`
- `strict_date_time_no_millis`
- `strict_hour`
- `strict_hour_minute`
- `strict_hour_minute_second`
- `strict_hour_minute_second_fraction`
- `strict_hour_minute_second_millis`
- `strict_ordinal_date`
- `strict_ordinal_date_time`
- `strict_ordinal_date_time_no_millis`
- `strict_strict_weekyear_week_day`
- `strict_t_time`
- `strict_t_time_no_millis`
- `strict_time`
- `strict_time_no_millis`
- `strict_week_date`
- `strict_week_date_time`
- `strict_week_date_time_no_millis`
- `strict_weekyear`
- `strict_weekyear_week`
- `strict_year`
- `strict_year_month`
- `strict_year_month_day`
- `t_time`
- `t_time_no_millis`
- `time`
- `time_no_millis`
- `week_date`
- `week_date_time`
- `week_date_time_no_millis`
- `weekyear`
- `weekyear_week`
- `weekyear_week_day`
- `year`
- `year_month`
- `year_month_day`

### Methods
- `String getPattern()`
- `static DateFormat valueOf(String name)`
- `static DateFormat[] values()`
```

--------------------------------

### isDeleteQuery Method in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/RepositoryStringQuery

Protected method to check if the current query is a delete query. Returns true if it is a delete query.

```Java
protected boolean isDeleteQuery()
```

--------------------------------

### Configure Delete Query Timeout in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/DeleteQuery

Sets the maximum time each deletion request will wait for active shards. If a query exceeds this limit, Elasticsearch will stop it. The default timeout is '1m'.

```java
public DeleteQuery.Builder withTimeout(@Nullable Duration timeout)
```

--------------------------------

### getJoinFieldProperty

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Returns the JoinField property of the ElasticsearchPersistentEntity.

```APIDOC
## GET /joinFieldProperty

### Description
Returns the JoinField property of the ElasticsearchPersistentEntity.

### Method
GET

### Endpoint
/joinFieldProperty

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
{
  "example": "N/A"
}

### Response
#### Success Response (200)
- **property** (ElasticsearchPersistentProperty) - The JoinField property.

#### Response Example
{
  "property": null
}
```

--------------------------------

### Java: SearchHitsIterator - getTotalHitsRelation Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitsIterator

Retrieves the relation of the total hits to the actual number of hits returned. This method is part of the SearchHitsIterator interface and returns a TotalHitsRelation enum.

```java
TotalHitsRelation getTotalHitsRelation();
```

--------------------------------

### Set Document Primary Term (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Sets the primary term for the Document. This is a default method used for managing Elasticsearch document versions. It takes a long value for the primary term.

```java
default void setPrimaryTerm(long primaryTerm)
Set the primary_term for this `Document`.
```

--------------------------------

### Delete index template

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveIndicesTemplate

Deletes an index template using ReactiveIndexOperations. Takes a DeleteIndexTemplateRequest parameter and returns a Mono with a boolean value indicating if the request was acknowledged.

```java
public Mono<Boolean> deleteIndexTemplate(DeleteIndexTemplateRequest deleteIndexTemplateRequest)
```

--------------------------------

### Clear cache of Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to clear the cache of an Elasticsearch index reactively. The operation can be performed with a request object or a builder function, or without any parameters.

```Java
Mono<co.elastic.clients.elasticsearch.indices.ClearCacheResponse> clearCache()
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.ClearCacheResponse> clearCache(co.elastic.clients.elasticsearch.indices.ClearCacheRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.ClearCacheResponse> clearCache(Function<co.elastic.clients.elasticsearch.indices.ClearCacheRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.ClearCacheRequest>> fn)
```

--------------------------------

### Bulk update objects in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Performs bulk update operations in Elasticsearch. Requires a list of UpdateQuery objects and either an entity class or IndexCoordinates. Throws BulkFailureException with operation details on failure.

```java
default void bulkUpdate(List<UpdateQuery> queries, IndexCoordinates index)
```

```java
void bulkUpdate(List<UpdateQuery> queries, Class<?> clazz)
```

--------------------------------

### Spring Data Query Setter and Getter in NativeQuery

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/NativeQuery

The setSpringDataQuery method sets a Spring Data Query object, introduced in version 5.1. The getSpringDataQuery method retrieves it, enabling integration between Spring Data abstractions and native Elasticsearch queries. These methods bridge compatibility between query types.

```java
public void setSpringDataQuery(@Nullable Query springDataQuery)
@Nullable public Query getSpringDataQuery()
```

--------------------------------

### Elasticsearch Persistent Entity - Routing

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Resolve the routing value for a given bean within the Elasticsearch persistent entity context.

```APIDOC
## GET /api/elasticsearch/entity/routing

### Description
Resolves the routing value for a given bean associated with an Elasticsearch persistent entity.

### Method
GET

### Endpoint
/api/elasticsearch/entity/routing

### Parameters
#### Query Parameters
- **entityName** (string) - Required - The name of the persistent entity.
- **bean** (object) - Required - The bean object for which to resolve the routing.

### Response
#### Success Response (200)
- **routing** (String) - The resolved routing value, which may be null.

#### Response Example
{
  "routing": "user-123"
}
```

--------------------------------

### Java NestedMetaData getChild Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/NestedMetaData

Retrieves the child NestedMetaData object, if any. The method returns the child object or null if no child exists. No input parameters are required.

```java
@Nullable public NestedMetaData getChild()
```

--------------------------------

### Define included properties with @SourceFilters in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/SourceFilters

The @SourceFilters annotation with 'includes' parameter specifies properties to be included in the Elasticsearch response. Supports literal property names or parameterized values.

```java
@SourceFilters(includes = {"property1", "property2"})
```

```java
@SourceFilters(includes = "?0")
```

--------------------------------

### Close Point-In-Time (PIT) in Elasticsearch using Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Closes an existing point in time (PIT) in Elasticsearch, releasing resources associated with it. Requires the PIT identifier obtained from `openPointInTime`.

```java
public Boolean closePointInTime(String pit)
```

--------------------------------

### getIndexName Method - ElasticsearchEntityMetadata

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/SimpleElasticsearchEntityMetadata

Retrieves the name of the Elasticsearch index associated with the entity. This method is part of the ElasticsearchEntityMetadata interface.

```java
public String getIndexName()

Specified by:
    getIndexName in interface ElasticsearchEntityMetadata<T>
```

--------------------------------

### getJavaType Method - EntityMetadata

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/repository/query/SimpleElasticsearchEntityMetadata

Retrieves the Java Class representing the entity type. This method is part of the EntityMetadata interface.

```java
public Class<T> getJavaType()

Specified by:
    getJavaType in interface EntityMetadata<T>
```

--------------------------------

### Set Document Index Name (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Sets the index name for the Document. This default method allows associating a document with a specific Elasticsearch index. It takes the index name as a String.

```java
default void setIndex(String index)
Sets the index name for this document
```

--------------------------------

### Save entities to Elasticsearch index

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Saves given entities to an Elasticsearch index. The index is retrieved from the entities' Document annotation. Takes a variable number of entities and returns them as an Iterable after saving.

```java
<T> Iterable<T> save(T... entities)
```

--------------------------------

### Define ScriptType Enum with Constants

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/ScriptType

Defines the ScriptType enum with INLINE and STORED constants for script execution types. The enum extends Java's Enum class and provides standard enum methods for value conversion and iteration.

```java
public enum ScriptType extends Enum<ScriptType>
{
    INLINE,
    STORED;
    
    public static ScriptType[] values()
    {
        return (ScriptType[]) $VALUES.clone();
    }
    
    public static ScriptType valueOf(String name)
    {
        return (ScriptType) Enum.valueOf(ScriptType.class, name);
    }
}
```

--------------------------------

### Accessing Inner and Nested Search Results

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/SearchDocumentAdapter

Provides methods to retrieve inner hits and nested metadata from a search document. Inner hits allow returning nested documents or specific parts of them that matched a query. Nested metadata is available when the hit represents a nested inner hit.

```java
public Map<String,SearchDocumentResponse> getInnerHits()
@Nullable public NestedMetaData getNestedMetaData()
```

--------------------------------

### Delete Component Template in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/IndicesTemplate

Deletes a component index template. Requires a DeleteComponentTemplateRequest object as input and returns a boolean indicating success.

```Java
public boolean deleteComponentTemplate(DeleteComponentTemplateRequest deleteComponentTemplateRequest)
```

--------------------------------

### Define CompletionContext.ContextMappingType enum in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/CompletionContext

The CompletionContext.ContextMappingType enum defines two mapping types (CATEGORY and GEO) for completion contexts in Spring Data Elasticsearch. It provides methods to retrieve enum values and convert strings to enum constants.

```java
public static enum CompletionContext.ContextMappingType extends Enum<CompletionContext.ContextMappingType> {
    CATEGORY, GEO;

    public static CompletionContext.ContextMappingType[] values() {
        return new CompletionContext.ContextMappingType[]{CATEGORY, GEO};
    }

    public static CompletionContext.ContextMappingType valueOf(String name) {
        return CompletionContext.ContextMappingType.valueOf(name);
    }

    public String getMappedName() {
        return this.name();
    }
}
```

--------------------------------

### IndexOperations.deleteIndexTemplate

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/class-use/DeleteIndexTemplateRequest

Synchronous method in Spring Data Elasticsearch to delete an index template. It uses DeleteIndexTemplateRequest to specify the template details and returns a boolean indicating success.

```APIDOC
## IndexOperations.deleteIndexTemplate(DeleteIndexTemplateRequest deleteIndexTemplateRequest)

### Description
Deletes an index template synchronously using the provided request object. Part of the org.springframework.data.elasticsearch.core package.

### Method
Java Method (Synchronous)

### Endpoint
N/A (Internal Java operation)

### Parameters
#### Request Body
- **deleteIndexTemplateRequest** (DeleteIndexTemplateRequest) - Required - The request object containing template name and other details.

### Request Example
IndexOperations indexOperations = // obtain instance
DeleteIndexTemplateRequest request = new DeleteIndexTemplateRequest("my-template");
boolean result = indexOperations.deleteIndexTemplate(request);

### Response
#### Success Response
- Returns **true** if the template was deleted successfully.

#### Response Example
true
```

--------------------------------

### Java: SearchHitsIterator - getMaxScore Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/SearchHitsIterator

Retrieves the maximum score among the search hits. This method is part of the SearchHitsIterator interface and returns the highest score as a float.

```java
float getMaxScore();
```

--------------------------------

### Define Rectangle Geometry Class in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/utils/geohash/Rectangle

Provides the Java definition of the Rectangle class that implements the Geometry interface. Includes constructors for 2‑D and 3‑D bounding boxes and accessor methods for coordinates and altitude. Useful for creating and manipulating geographic rectangles within Spring Data Elasticsearch.

```java
public class Rectangle extends Object implements Geometry {
    public static final Rectangle EMPTY;
    public Rectangle(double minX, double maxX, double maxY, double minY);
    public Rectangle(double minX, double maxX, double maxY, double minY, double minZ, double maxZ);
    public double getMinY();
    public double getMinX();
    public double getMinZ();
    public double getMaxY();
    public double getMaxX();
    public double getMaxZ();
    public double getMinLat();
    public double getMinLon();
    public double getMinAlt();
    public double getMaxLat();
    public double getMaxLon();
    public double getMaxAlt();
    public ShapeType type();
    public String toString();
    public boolean equals(Object o);
    public int hashCode();
    public <T, E extends Exception> T visit(GeometryVisitor<T, E> visitor) throws E;
    public boolean isEmpty();
    public boolean hasZ();
}
```

--------------------------------

### Delete Script from Elasticsearch using Spring Data

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ElasticsearchTemplate

Deletes a script by its name from the Elasticsearch cluster. Returns `true` if the request was acknowledged by the cluster, indicating successful deletion.

```java
public boolean deleteScript(String name)
```

--------------------------------

### ScrollState Class Definition

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/util/ScrollState

Defines the ScrollState class which extends Object and holds scrollId for scroll requests. This class is used in Spring Data Elasticsearch since version 3.2. It includes constructors for initializing with or without a scroll ID and methods for managing scroll IDs.

```java
public class ScrollState extends Object {
    public ScrollState() {}
    public ScrollState(String scrollId) {}
    
    @Nullable
    public String getScrollId() {}
    
    public List<String> getScrollIds() {}
    
    public void updateScrollId(@Nullable String scrollId) {}
}
```

--------------------------------

### Java NestedMetaData getField Method

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/NestedMetaData

Retrieves the field name associated with the nested meta data.  The method returns the field name as a String. No input parameters are required.

```java
public String getField()
```

--------------------------------

### Set Document Sequence Number (Java)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/document/Document

Sets the sequence number for the Document. This default method is part of Elasticsearch's internal versioning mechanism. It accepts a long value for the sequence number.

```java
default void setSeqNo(long seqNo)
Set the seq_no for this `Document`.
```

--------------------------------

### Delete index template by request (Elasticsearch)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Deletes an index template using a DeleteTemplateRequest with the legacy Elasticsearch interface. Returns a Mono of true if deletion was successful. Deprecated since Elasticsearch API v5.1.

```Java
@Deprecated
Mono<Boolean> deleteTemplate(DeleteTemplateRequest deleteTemplateRequest)
```

--------------------------------

### Define ScoreDoc record in Java for Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/support/ScoreDoc

This snippet shows the Java definition of the ScoreDoc record, including its components, accessor methods, and standard overrides such as toString, hashCode, and equals. It is used to represent search result metadata within Spring Data Elasticsearch.

```java
public record ScoreDoc(double score,
                       @Nullable Integer doc,
                       @Nullable Integer shardIndex) {

    // Accessor for score component (generated automatically, shown for clarity)
    public double score() {
        return this.score;
    }

    // Accessor for doc component
    @Nullable
    public Integer doc() {
        return this.doc;
    }

    // Accessor for shardIndex component
    @Nullable
    public Integer shardIndex() {
        return this.shardIndex;
    }

    @Override
    public String toString() {
        return "ScoreDoc[score=" + score + ", doc=" + doc + ", shardIndex=" + shardIndex + "]";
    }

    @Override
    public int hashCode() {
        return Objects.hash(score, doc, shardIndex);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ScoreDoc scoreDoc = (ScoreDoc) o;
        return Double.compare(scoreDoc.score, score) == 0 &&
               Objects.equals(doc, scoreDoc.doc) &&
               Objects.equals(shardIndex, scoreDoc.shardIndex);
    }
}
```

--------------------------------

### DELETE /_index_template/{name}

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/class-use/DeleteIndexTemplateRequest

This endpoint deletes an existing index template in Elasticsearch. It is accessed through Spring Data Elasticsearch via DeleteIndexTemplateRequest in synchronous or reactive modes. Useful for removing template configurations that match index patterns.

```APIDOC
## DELETE /_index_template/{name}

### Description
Deletes an index template by name using the Elasticsearch client library in Spring Data Elasticsearch. This operation removes the template and any associated settings, mappings, or aliases.

### Method
DELETE

### Endpoint
/_index_template/{name}

### Parameters
#### Path Parameters
- **name** (string) - Required - The name of the index template to delete.

#### Query Parameters
- None

#### Request Body
- None

### Request Example
No request body required.

### Response
#### Success Response (200)
- **acknowledged** (boolean) - Indicates if the delete operation was successful.

#### Response Example
{
  "acknowledged": true
}
```

--------------------------------

### org.springframework.data.elasticsearch.core.getPersistentEntityFor

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/class-use/ElasticsearchPersistentEntity

Retrieves a persistent entity for a given type. This method is used in the core module to manage entity mappings.

```APIDOC
## GET /api/getPersistentEntityFor

### Description
Retrieves a persistent entity for a given type.

### Method
GET

### Endpoint
/api/getPersistentEntityFor

### Parameters
#### Path Parameters
- **type** (Class<?>) - Required - The class type to retrieve the persistent entity for.

### Request Example
{
  "type": "com.example.MyEntity"
}

### Response
#### Success Response (200)
- **entity** (ElasticsearchPersistentEntity<?>) - The retrieved persistent entity.
```

--------------------------------

### delete in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveDocumentOperations

Deletes a document by ID or entity. Also supports deleting by query.

```java
public Mono<String> delete(Object entity) {}
public Mono<String> delete(Object entity, IndexCoordinates index) {}
public Mono<String> delete(String id, IndexCoordinates index) {}
public Mono<String> delete(String id, Class<?> entityType) {}
public Mono<ByQueryResponse> delete(DeleteQuery query, Class<?> entityType) {}
public Mono<ByQueryResponse> delete(DeleteQuery query, Class<?> entityType, IndexCoordinates index) {}
// Usage
reactiveElasticsearchTemplate.delete("id1", indexCoordinates).subscribe();
DeleteQuery deleteQuery = new DeleteQuery();
reactiveElasticsearchTemplate.delete(deleteQuery, MyEntity.class, indexCoordinates).subscribe();
```

--------------------------------

### Elasticsearch Persistent Entity - Property Access

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/mapping/ElasticsearchPersistentEntity

Access specific Elasticsearch persistent properties by field name or retrieve version, sequence number, primary term, join field, and index name properties.

```APIDOC
## GET /api/elasticsearch/entity/property

### Description
Retrieves specific Elasticsearch persistent properties. This endpoint allows fetching a property by its field name, or accessing dedicated properties like version, sequence number, primary term, join field, and indexed index name.

### Method
GET

### Endpoint
/api/elasticsearch/entity/property

### Parameters
#### Query Parameters
- **entityName** (string) - Required - The name of the persistent entity.
- **fieldName** (string) - Optional - The name of the field to retrieve the property for. If not provided, specific properties like version or join field can be requested.
- **propertyName** (string) - Optional - Specifies which dedicated property to retrieve (e.g., 'version', 'seqNoPrimaryTerm', 'joinField', 'indexedIndexName'). Use this when `fieldName` is not provided.

### Response
#### Success Response (200)
- **propertyName** (ElasticsearchPersistentProperty) - The requested persistent property.

#### Response Example
{
  "fieldName": "myField",
  "type": "text",
  "order": 1
}
```

--------------------------------

### Check if alias is write index in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasData

Determines if the alias is designated as a write index. Returns null if the write index status is not specified. A write index receives write operations when an alias points to multiple indices.

```Java
@Nullable public Boolean isWriteIndex()
```

--------------------------------

### Index object in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Indexes an object in Elasticsearch, performing either save or update operation. Requires an IndexQuery defining the object and IndexCoordinates specifying the storage index. Returns the document ID of the indexed object.

```java
String index(IndexQuery query, IndexCoordinates index)
```

--------------------------------

### Delete index template by name (Elasticsearch)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/ReactiveIndexOperations

Deletes an index template by name using the legacy Elasticsearch interface. Returns a Mono of true if deletion was successful. Deprecated since Elasticsearch API v5.1.

```Java
@Deprecated
default Mono<Boolean> deleteTemplate(String templateName)
```

--------------------------------

### Delete alias from Elasticsearch index reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to delete an alias from an Elasticsearch index reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.DeleteAliasResponse> deleteAlias(co.elastic.clients.elasticsearch.indices.DeleteAliasRequest request)
```

```Java
Mono<co.elastic.clients.elasticsearch.indices.DeleteAliasResponse> deleteAlias(Function<co.elastic.clients.elasticsearch.indices.DeleteAliasRequest.Builder,co.elastic.clients.util.ObjectBuilder<co.elastic.clients.elasticsearch.indices.DeleteAliasRequest>> fn)
```

--------------------------------

### DELETE Operations API

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Various delete operations for removing documents from Elasticsearch by ID, entity, or query criteria.

```APIDOC
## delete (by ID with IndexCoordinates)

### Description
Delete a single document by its ID from the specified index.

### Method
String

### Endpoint
delete(String id, IndexCoordinates index)

### Parameters
#### Path Parameters
- **id** (String) - Required - the document ID to delete
- **index** (IndexCoordinates) - Required - the index from which to delete

### Response
#### Success Response (200)
- **documentId** (String) - The ID of the deleted document

## delete (by ID with EntityType)

### Description
Delete a single document by its ID using the entity type to determine the index.

### Method
String

### Endpoint
delete(String id, Class<?> entityType)

### Parameters
#### Path Parameters
- **id** (String) - Required - the document ID to delete
- **entityType** (Class<?>) - Required - The entity class (must not be null)

### Response
#### Success Response (200)
- **documentId** (String) - The ID of the deleted document

## delete (by Entity)

### Description
Delete a document represented by the given entity object.

### Method
String

### Endpoint
delete(Object entity)

### Parameters
#### Path Parameters
- **entity** (Object) - Required - the entity to delete

### Response
#### Success Response (200)
- **documentId** (String) - The ID of the deleted document

## delete (by Entity with IndexCoordinates)

### Description
Delete a document represented by the given entity object from the specified index.

### Method
String

### Endpoint
delete(Object entity, IndexCoordinates index)

### Parameters
#### Path Parameters
- **entity** (Object) - Required - the entity to delete
- **index** (IndexCoordinates) - Required - the index from which to delete

### Response
#### Success Response (200)
- **documentId** (String) - The ID of the deleted document

## delete (by Query with Class)

### Description
Delete all records matching the provided DeleteQuery.

### Method
ByQueryResponse

### Endpoint
delete(DeleteQuery query, Class<?> clazz)

### Parameters
#### Path Parameters
- **query** (DeleteQuery) - Required - query defining the objects to delete
- **clazz** (Class<?>) - Required - The entity class must be annotated with `Document`

### Response
#### Success Response (200)
- **ByQueryResponse** (Object) - Response with detailed information about the deletion

### Since
5.3

## delete (by Query with Class and IndexCoordinates)

### Description
Delete all records matching the provided DeleteQuery from the specified index.

### Method
ByQueryResponse

### Endpoint
delete(DeleteQuery query, Class<?> clazz, IndexCoordinates index)

### Parameters
#### Path Parameters
- **query** (DeleteQuery) - Required - query defining the objects to delete
- **clazz** (Class<?>) - Required - The entity class must be annotated with `Document`
- **index** (IndexCoordinates) - Required - the index from which to delete

### Response
#### Success Response (200)
- **ByQueryResponse** (Object) - Response with detailed information about the deletion

### Since
5.3
```

--------------------------------

### Delete script from Elasticsearch cluster

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/script/ScriptOperations

Deletes the script with the given name from the Elasticsearch cluster. Returns true if the request was acknowledged by the cluster. Requires the script name as input.

```Java
boolean deleteScript(String name)
```

--------------------------------

### Delete data stream in Elasticsearch reactively

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/client/elc/ReactiveElasticsearchIndicesClient

Methods to delete a data stream in Elasticsearch reactively. The operation can be performed with a request object or a builder function.

```Java
Mono<co.elastic.clients.elasticsearch.indices.DeleteDataStreamResponse> deleteDataStream(co.elastic.clients.elasticsearch.indices.DeleteDataStreamRequest request)
```

--------------------------------

### Define excluded properties with @SourceFilters in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/SourceFilters

The @SourceFilters annotation with 'excludes' parameter specifies properties to be excluded from the Elasticsearch response. Supports literal property names or parameterized values.

```java
@SourceFilters(excludes = {"property1", "property2"})
```

```java
@SourceFilters(excludes = "?0")
```

--------------------------------

### Check entity existence in Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/DocumentOperations

Checks if an entity with a given ID exists in Elasticsearch. Can specify the domain type or target index explicitly. Returns true if a matching document exists, false otherwise.

```java
boolean exists(String id, Class<?> clazz)
```

```java
boolean exists(String id, IndexCoordinates index)
```

--------------------------------

### Define InnerField annotation declaration Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/InnerField

Java annotation declaration for @InnerField with runtime retention and annotation type target. This annotation is used to configure field-level properties for Elasticsearch document mapping, supporting various field types and configuration options for indexing, storage, and search behavior.

```java
@Retention(RUNTIME) @Target(ANNOTATION_TYPE) public @interface InnerField
```

--------------------------------

### Define Field Alias in Elasticsearch Mapping (@MappingAlias)

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/annotations/MappingAlias

The @MappingAlias annotation is used to define a field alias within an Elasticsearch index mapping. It requires the 'name' of the alias and the 'path' to the field it represents. This annotation is part of Spring Data Elasticsearch version 5.3 and later.

```java
@Retention(RUNTIME)
@Target(FIELD)
@Documented
@Inherited
public @interface MappingAlias {
    String name();
    String path();
}
```

--------------------------------

### Add scripted field to query in Spring Data Elasticsearch

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/query/BaseQuery

Adds a scripted field to the query. This method takes a ScriptedField object and includes it in the query's scripted fields collection.

```Java
public void addScriptedField(ScriptedField scriptedField)
```

--------------------------------

### Check if alias is hidden in Java

Source: https://docs.spring.io/spring-data/elasticsearch/docs/current/api/org/springframework/data/elasticsearch/core/index/AliasData

Determines if the alias is hidden. Returns null if the hidden status is not specified. Hidden aliases are not returned by default when listing available aliases.

```Java
@Nullable public Boolean isHidden()
```