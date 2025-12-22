# go-redis Context Documentation

## Introduction

go-redis is the official Redis client library for Go, providing a type-safe, idiomatic interface for interacting with Redis servers. It supports all Redis data structures and commands, automatic connection pooling, pub/sub messaging, pipelines, transactions, cluster operations, and sentinel failover. The library is production-ready and widely used, offering both RESP2 and RESP3 protocol support with comprehensive error handling and context-aware operations.

The library follows Go best practices with context-based timeout management, efficient memory usage through customizable buffer sizes, and extensibility through hooks for instrumentation. It provides client modes for standalone Redis, Redis Cluster, Redis Sentinel failover, and Ring sharding, making it suitable for applications ranging from simple cache layers to complex distributed systems requiring high availability and horizontal scaling.

## Client Initialization

Basic client creation and connection testing

```go
package main

import (
    "context"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()

    // Create a new Redis client
    rdb := redis.NewClient(&redis.Options{
        Addr:         "localhost:6379",
        Password:     "",                    // no password
        DB:           0,                     // default DB
        DialTimeout:  10 * time.Second,
        ReadTimeout:  30 * time.Second,
        WriteTimeout: 30 * time.Second,
        PoolSize:     10,
        PoolTimeout:  30 * time.Second,
    })
    defer rdb.Close()

    // Test connection
    pong, err := rdb.Ping(ctx).Result()
    if err != nil {
        panic(fmt.Sprintf("Failed to connect: %v", err))
    }
    fmt.Println(pong) // Output: PONG
}
```

## URL-based Configuration

Parse Redis connection URL into client options

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()

    // Parse Redis URL
    url := "redis://user:password@localhost:6379/0?protocol=3&dial_timeout=5s"
    opts, err := redis.ParseURL(url)
    if err != nil {
        panic(err)
    }

    fmt.Printf("Address: %s\n", opts.Addr)
    fmt.Printf("DB: %d\n", opts.DB)
    fmt.Printf("Protocol: %d\n", opts.Protocol)

    // Create client with parsed options
    rdb := redis.NewClient(opts)
    defer rdb.Close()

    _, err = rdb.Ping(ctx).Result()
    if err != nil {
        panic(err)
    }
}
```

## String Operations

Set, get, and manipulate string values with expiration

```go
package main

import (
    "context"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // SET key value with expiration
    err := rdb.Set(ctx, "user:1000", "john_doe", 10*time.Minute).Err()
    if err != nil {
        panic(err)
    }

    // GET key value
    val, err := rdb.Get(ctx, "user:1000").Result()
    if err == redis.Nil {
        fmt.Println("Key does not exist")
    } else if err != nil {
        panic(err)
    } else {
        fmt.Printf("user:1000 = %s\n", val)
    }

    // Increment counter
    count, err := rdb.Incr(ctx, "page_views").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Page views: %d\n", count)

    // Set multiple keys at once
    err = rdb.MSet(ctx, "key1", "value1", "key2", "value2").Err()
    if err != nil {
        panic(err)
    }

    // Get multiple keys
    vals, err := rdb.MGet(ctx, "key1", "key2").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Multiple values: %v\n", vals)
}
```

## Hash Operations

Store and retrieve structured data using hashes

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

type User struct {
    Name  string `redis:"name"`
    Email string `redis:"email"`
    Age   int    `redis:"age"`
}

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Store struct as hash
    user := User{Name: "Alice", Email: "alice@example.com", Age: 30}
    err := rdb.HSet(ctx, "user:1001", user).Err()
    if err != nil {
        panic(err)
    }

    // Get single field
    name, err := rdb.HGet(ctx, "user:1001", "name").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Name: %s\n", name)

    // Get all fields
    allFields, err := rdb.HGetAll(ctx, "user:1001").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("User data: %v\n", allFields)

    // Increment numeric field
    newAge, err := rdb.HIncrBy(ctx, "user:1001", "age", 1).Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("New age: %d\n", newAge)

    // Check field existence
    exists, err := rdb.HExists(ctx, "user:1001", "email").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Email exists: %v\n", exists)
}
```

## List Operations

Work with Redis lists for queues and stacks

```go
package main

import (
    "context"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Push to list (queue)
    err := rdb.RPush(ctx, "tasks", "task1", "task2", "task3").Err()
    if err != nil {
        panic(err)
    }

    // Get list length
    length, err := rdb.LLen(ctx, "tasks").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Queue length: %d\n", length)

    // Pop from list
    task, err := rdb.LPop(ctx, "tasks").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Popped task: %s\n", task)

    // Blocking pop with timeout
    result, err := rdb.BLPop(ctx, 5*time.Second, "tasks").Result()
    if err == redis.Nil {
        fmt.Println("No items in queue")
    } else if err != nil {
        panic(err)
    } else {
        fmt.Printf("Queue: %s, Item: %s\n", result[0], result[1])
    }

    // Get range of items
    items, err := rdb.LRange(ctx, "tasks", 0, -1).Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Remaining tasks: %v\n", items)
}
```

## Set Operations

Manage unique collections with sets

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Add members to set
    err := rdb.SAdd(ctx, "tags", "golang", "redis", "database").Err()
    if err != nil {
        panic(err)
    }

    // Check membership
    isMember, err := rdb.SIsMember(ctx, "tags", "golang").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Is 'golang' a member: %v\n", isMember)

    // Get all members
    members, err := rdb.SMembers(ctx, "tags").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("All tags: %v\n", members)

    // Set operations
    rdb.SAdd(ctx, "tags2", "redis", "nosql", "cache")

    // Intersection
    intersection, err := rdb.SInter(ctx, "tags", "tags2").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Common tags: %v\n", intersection)

    // Union
    union, err := rdb.SUnion(ctx, "tags", "tags2").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("All unique tags: %v\n", union)
}
```

## Sorted Set Operations

Work with scored, ordered collections

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Add members with scores
    members := []redis.Z{
        {Score: 100, Member: "player1"},
        {Score: 85, Member: "player2"},
        {Score: 95, Member: "player3"},
    }
    err := rdb.ZAdd(ctx, "leaderboard", members...).Err()
    if err != nil {
        panic(err)
    }

    // Get top players (highest scores)
    topPlayers, err := rdb.ZRevRangeWithScores(ctx, "leaderboard", 0, 2).Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("Top 3 players:")
    for i, player := range topPlayers {
        fmt.Printf("%d. %s: %.0f\n", i+1, player.Member, player.Score)
    }

    // Get score for specific member
    score, err := rdb.ZScore(ctx, "leaderboard", "player2").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Player2 score: %.0f\n", score)

    // Increment score
    newScore, err := rdb.ZIncrBy(ctx, "leaderboard", 10, "player2").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Player2 new score: %.0f\n", newScore)

    // Get rank (0-based)
    rank, err := rdb.ZRevRank(ctx, "leaderboard", "player2").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Player2 rank: %d\n", rank+1)
}
```

## Pipeline Operations

Batch multiple commands for better performance

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Create pipeline
    pipe := rdb.Pipeline()

    // Queue commands
    incr := pipe.Incr(ctx, "counter")
    pipe.Set(ctx, "user:name", "Bob", 0)
    getCmd := pipe.Get(ctx, "user:name")
    pipe.Expire(ctx, "user:name", 1*time.Hour)

    // Execute all commands at once
    cmds, err := pipe.Exec(ctx)
    if err != nil {
        panic(err)
    }

    fmt.Printf("Executed %d commands\n", len(cmds))
    fmt.Printf("Counter value: %d\n", incr.Val())
    fmt.Printf("User name: %s\n", getCmd.Val())

    // Alternative: Pipelined function
    var set *redis.StatusCmd
    var get *redis.StringCmd

    cmds, err = rdb.Pipelined(ctx, func(pipe redis.Pipeliner) error {
        set = pipe.Set(ctx, "key1", "value1", 0)
        get = pipe.Get(ctx, "key1")
        return nil
    })

    if err != nil {
        panic(err)
    }

    fmt.Printf("Set result: %s\n", set.Val())
    fmt.Printf("Get result: %s\n", get.Val())
}
```

## Transactions with WATCH

Implement optimistic locking with transactions

```go
package main

import (
    "context"
    "fmt"
    "errors"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Initialize balance
    rdb.Set(ctx, "account:balance", "100", 0)

    // Transaction with WATCH for optimistic locking
    maxRetries := 3
    for i := 0; i < maxRetries; i++ {
        err := rdb.Watch(ctx, func(tx *redis.Tx) error {
            // Get current balance
            balance, err := tx.Get(ctx, "account:balance").Int()
            if err != nil && err != redis.Nil {
                return err
            }

            // Business logic
            withdrawal := 20
            if balance < withdrawal {
                return errors.New("insufficient funds")
            }

            // Execute transaction
            _, err = tx.TxPipelined(ctx, func(pipe redis.Pipeliner) error {
                pipe.Set(ctx, "account:balance", balance-withdrawal, 0)
                pipe.RPush(ctx, "account:history", fmt.Sprintf("withdrew %d", withdrawal))
                return nil
            })
            return err
        }, "account:balance")

        if err == nil {
            fmt.Println("Transaction successful")
            break
        } else if err == redis.TxFailedErr {
            fmt.Printf("Transaction failed, retry %d/%d\n", i+1, maxRetries)
            continue
        } else {
            panic(err)
        }
    }

    // Check final balance
    balance, _ := rdb.Get(ctx, "account:balance").Result()
    fmt.Printf("Final balance: %s\n", balance)
}
```

## Pub/Sub Messaging

Publish and subscribe to message channels

```go
package main

import (
    "context"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Subscribe to channels
    pubsub := rdb.Subscribe(ctx, "news", "updates")
    defer pubsub.Close()

    // Wait for subscription confirmation
    _, err := pubsub.Receive(ctx)
    if err != nil {
        panic(err)
    }

    // Start receiving messages in goroutine
    ch := pubsub.Channel()
    go func() {
        for msg := range ch {
            fmt.Printf("Channel: %s, Message: %s\n", msg.Channel, msg.Payload)
        }
    }()

    // Publish messages from another client
    publisher := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer publisher.Close()

    err = publisher.Publish(ctx, "news", "Breaking news!").Err()
    if err != nil {
        panic(err)
    }

    err = publisher.Publish(ctx, "updates", "System update available").Err()
    if err != nil {
        panic(err)
    }

    // Pattern subscription
    psubsub := rdb.PSubscribe(ctx, "event:*")
    defer psubsub.Close()

    err = publisher.Publish(ctx, "event:login", "User logged in").Err()
    if err != nil {
        panic(err)
    }

    time.Sleep(1 * time.Second)
}
```

## Lua Scripting

Execute server-side Lua scripts atomically

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Define Lua script for atomic increment
    incrBy := redis.NewScript(`
        local key = KEYS[1]
        local change = tonumber(ARGV[1])

        local value = redis.call("GET", key)
        if not value then
            value = 0
        end

        value = tonumber(value) + change
        redis.call("SET", key, value)

        return value
    `)

    // Run script
    result, err := incrBy.Run(ctx, rdb, []string{"counter"}, 5).Int()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Counter after increment: %d\n", result)

    // Script with multiple operations
    sumScript := redis.NewScript(`
        local key = KEYS[1]
        local sum = redis.call("GET", key)
        if not sum then
            sum = 0
        end

        for i, v in ipairs(ARGV) do
            sum = tonumber(sum) + tonumber(v)
        end

        redis.call("SET", key, sum)
        return sum
    `)

    sum, err := sumScript.Run(ctx, rdb, []string{"total"}, 10, 20, 30).Int()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Sum: %d\n", sum)
}
```

## Cluster Client

Connect to Redis Cluster for horizontal scaling

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()

    // Create cluster client
    rdb := redis.NewClusterClient(&redis.ClusterOptions{
        Addrs: []string{
            "localhost:7000",
            "localhost:7001",
            "localhost:7002",
        },
        PoolSize:     10,
        RouteByLatency: true,
    })
    defer rdb.Close()

    // Test cluster connection
    err := rdb.ForEachShard(ctx, func(ctx context.Context, shard *redis.Client) error {
        return shard.Ping(ctx).Err()
    })
    if err != nil {
        panic(err)
    }

    // Set and get work across cluster
    err = rdb.Set(ctx, "user:100", "Alice", 0).Err()
    if err != nil {
        panic(err)
    }

    val, err := rdb.Get(ctx, "user:100").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Value: %s\n", val)

    // Get cluster info
    slots, err := rdb.ClusterSlots(ctx).Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Cluster has %d slot ranges\n", len(slots))
}
```

## Sentinel Failover

High availability with Redis Sentinel

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()

    // Create failover client with Sentinel
    rdb := redis.NewFailoverClient(&redis.FailoverOptions{
        MasterName:    "mymaster",
        SentinelAddrs: []string{
            "localhost:26379",
            "localhost:26380",
            "localhost:26381",
        },
        Password:      "",
        DB:            0,
        PoolSize:      10,
        RouteRandomly: true,
    })
    defer rdb.Close()

    // Operations automatically failover to new master
    err := rdb.Set(ctx, "key", "value", 0).Err()
    if err != nil {
        panic(err)
    }

    val, err := rdb.Get(ctx, "key").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Value: %s\n", val)

    // Pool stats
    stats := rdb.PoolStats()
    fmt.Printf("Connections: %d, Hits: %d, Misses: %d\n",
        stats.TotalConns, stats.Hits, stats.Misses)
}
```

## Custom Commands

Execute arbitrary Redis commands

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Execute custom command using Do
    result, err := rdb.Do(ctx, "SET", "custom:key", "custom:value", "EX", "60").Result()
    if err != nil {
        panic(err)
    }
    fmt.Printf("SET result: %s\n", result)

    // Get value
    val, err := rdb.Do(ctx, "GET", "custom:key").Text()
    if err != nil {
        panic(err)
    }
    fmt.Printf("GET result: %s\n", val)

    // Module commands (e.g., RedisJSON)
    jsonVal := `{"name":"Alice","age":30}`
    err = rdb.Do(ctx, "JSON.SET", "user:json", "$", jsonVal).Err()
    if err != nil {
        // JSON module might not be loaded
        fmt.Printf("JSON command not available: %v\n", err)
    }

    // Get server info
    info, err := rdb.Do(ctx, "INFO", "server").Text()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Server info:\n%s\n", info[:100])
}
```

## Error Handling

Handle Redis-specific errors correctly

```go
package main

import (
    "context"
    "errors"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Handle redis.Nil (key not found)
    val, err := rdb.Get(ctx, "nonexistent").Result()
    if err == redis.Nil {
        fmt.Println("Key does not exist - this is not an error")
    } else if err != nil {
        panic(fmt.Sprintf("Unexpected error: %v", err))
    } else {
        fmt.Printf("Value: %s\n", val)
    }

    // Check for transaction failure
    err = rdb.Watch(ctx, func(tx *redis.Tx) error {
        _, err := tx.TxPipelined(ctx, func(pipe redis.Pipeliner) error {
            pipe.Set(ctx, "key", "value", 0)
            return nil
        })
        return err
    }, "watched:key")

    if err == redis.TxFailedErr {
        fmt.Println("Transaction failed due to watched key modification")
    } else if err != nil {
        panic(err)
    }

    // Type assertion for specific errors
    _, err = rdb.Get(ctx, "key").Int()
    if err != nil {
        var numErr *redis.StringIntConversionError
        if errors.As(err, &numErr) {
            fmt.Println("Value is not an integer")
        }
    }

    // Connection errors
    badClient := redis.NewClient(&redis.Options{Addr: "localhost:9999"})
    err = badClient.Ping(ctx).Err()
    if err != nil {
        fmt.Printf("Connection error: %v\n", err)
    }
}
```

## Scanning Keys

Efficiently iterate through large keyspaces

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    // Create test data
    for i := 0; i < 100; i++ {
        rdb.Set(ctx, fmt.Sprintf("user:%d", i), fmt.Sprintf("value%d", i), 0)
    }

    // Scan all keys matching pattern
    var cursor uint64
    var totalKeys int

    for {
        var keys []string
        var err error

        keys, cursor, err = rdb.Scan(ctx, cursor, "user:*", 10).Result()
        if err != nil {
            panic(err)
        }

        totalKeys += len(keys)
        fmt.Printf("Batch: %d keys\n", len(keys))

        if cursor == 0 {
            break
        }
    }

    fmt.Printf("Total keys found: %d\n", totalKeys)

    // Scan hash fields
    rdb.HSet(ctx, "user:info", "name", "Alice", "email", "alice@test.com", "age", "30")

    var hcursor uint64
    for {
        var fields []string
        var err error

        fields, hcursor, err = rdb.HScan(ctx, "user:info", hcursor, "*", 10).Result()
        if err != nil {
            panic(err)
        }

        // fields contains alternating field names and values
        for i := 0; i < len(fields); i += 2 {
            fmt.Printf("Field: %s = %s\n", fields[i], fields[i+1])
        }

        if hcursor == 0 {
            break
        }
    }
}
```

## Integration Summary

go-redis provides a comprehensive solution for Redis integration in Go applications with support for all deployment patterns. The library excels in high-throughput scenarios through pipelining, enables distributed coordination with transactions and Lua scripting, and supports real-time messaging via pub/sub. Connection pooling and automatic failover ensure reliability, while the context-aware API integrates seamlessly with Go's concurrency patterns and timeout management.

Common use cases include distributed caching with TTL management, session storage with automatic expiration, rate limiting using sorted sets and sliding windows, real-time leaderboards with sorted sets, job queues with blocking list operations, and pub/sub for event broadcasting. The library's flexibility allows it to serve as a simple cache layer for small applications or as the backbone of distributed systems requiring Redis Cluster's horizontal scaling and Sentinel's automatic failover capabilities.
