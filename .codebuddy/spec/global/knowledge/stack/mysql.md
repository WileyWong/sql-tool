# MySQL 9.5.0 Database Server

MySQL is a widely-used open-source relational database management system developed and maintained by Oracle Corporation. This release, version 9.5.0 (Innovation), represents the cutting-edge development branch of MySQL, incorporating the latest features and improvements to the database engine. MySQL serves as the foundation for countless web applications, enterprise systems, and data-driven platforms worldwide, providing robust SQL query processing, transaction management, replication, and data storage capabilities.

At its core, MySQL implements a multi-layered architecture consisting of client APIs for application connectivity, a SQL parsing and optimization layer, a pluggable storage engine interface, and various subsystems for authentication, replication, logging, and administration. The codebase provides extensive APIs for developers to extend MySQL's functionality through custom storage engines, user-defined functions (UDFs), authentication plugins, audit systems, and modern component-based services. The system supports ACID-compliant transactions, multi-version concurrency control (MVCC), advanced indexing strategies, and sophisticated query optimization to deliver high-performance data management at scale.

## Client C API - Connection Management

Connection initialization and establishment with SSL support

```c
#include <mysql.h>

MYSQL *conn;
MYSQL *mysql_ret;

// Initialize connection handle
conn = mysql_init(NULL);
if (conn == NULL) {
    fprintf(stderr, "mysql_init() failed\n");
    exit(1);
}

// Configure SSL if needed
mysql_ssl_set(conn,
    "/path/to/client-key.pem",   // key
    "/path/to/client-cert.pem",  // cert
    "/path/to/ca-cert.pem",      // ca
    NULL,                         // capath
    NULL);                        // cipher

// Connect to MySQL server
mysql_ret = mysql_real_connect(
    conn,
    "localhost",     // host
    "myuser",        // user
    "mypassword",    // password
    "mydb",          // database
    3306,            // port
    NULL,            // unix_socket
    0);              // client_flag

if (mysql_ret == NULL) {
    fprintf(stderr, "mysql_real_connect() failed: %s\n",
            mysql_error(conn));
    mysql_close(conn);
    exit(1);
}

// Check connection
if (mysql_ping(conn) != 0) {
    fprintf(stderr, "Connection lost: %s\n", mysql_error(conn));
}

// Close connection
mysql_close(conn);
```

## Client C API - Query Execution and Result Processing

Execute SQL queries and fetch results row by row

```c
#include <mysql.h>

int execute_query_and_process(MYSQL *conn) {
    MYSQL_RES *result;
    MYSQL_ROW row;
    MYSQL_FIELD *fields;
    unsigned int num_fields;
    int rc;

    // Execute query
    rc = mysql_query(conn,
        "SELECT id, name, email FROM users WHERE active = 1");

    if (rc != 0) {
        fprintf(stderr, "Query failed: %s\n", mysql_error(conn));
        return -1;
    }

    // Store full result set
    result = mysql_store_result(conn);
    if (result == NULL) {
        fprintf(stderr, "mysql_store_result() failed: %s\n",
                mysql_error(conn));
        return -1;
    }

    // Get field metadata
    num_fields = mysql_num_fields(result);
    fields = mysql_fetch_fields(result);

    // Print column headers
    for (unsigned int i = 0; i < num_fields; i++) {
        printf("%-20s ", fields[i].name);
    }
    printf("\n");

    // Fetch and print rows
    while ((row = mysql_fetch_row(result)) != NULL) {
        unsigned long *lengths = mysql_fetch_lengths(result);
        for (unsigned int i = 0; i < num_fields; i++) {
            printf("%-20.*s ", (int)lengths[i],
                   row[i] ? row[i] : "NULL");
        }
        printf("\n");
    }

    printf("\nTotal rows: %llu\n", mysql_num_rows(result));
    printf("Affected rows: %llu\n", mysql_affected_rows(conn));

    // Free result set
    mysql_free_result(result);
    return 0;
}
```

## Client C API - Prepared Statements with Parameter Binding

Use prepared statements for secure parameterized queries

```c
#include <mysql.h>
#include <string.h>

int insert_user_prepared(MYSQL *conn, const char *name, int age,
                         const char *email) {
    MYSQL_STMT *stmt;
    MYSQL_BIND bind[3];
    int rc;
    unsigned long str_length, email_length;

    // Initialize statement
    stmt = mysql_stmt_init(conn);
    if (stmt == NULL) {
        fprintf(stderr, "mysql_stmt_init() failed\n");
        return -1;
    }

    // Prepare statement
    const char *query = "INSERT INTO users (name, age, email) "
                       "VALUES (?, ?, ?)";
    rc = mysql_stmt_prepare(stmt, query, strlen(query));
    if (rc != 0) {
        fprintf(stderr, "mysql_stmt_prepare() failed: %s\n",
                mysql_stmt_error(stmt));
        mysql_stmt_close(stmt);
        return -1;
    }

    // Initialize bind structures
    memset(bind, 0, sizeof(bind));

    // Bind name (string)
    str_length = strlen(name);
    bind[0].buffer_type = MYSQL_TYPE_STRING;
    bind[0].buffer = (char *)name;
    bind[0].buffer_length = str_length;
    bind[0].length = &str_length;
    bind[0].is_null = 0;

    // Bind age (integer)
    bind[1].buffer_type = MYSQL_TYPE_LONG;
    bind[1].buffer = (char *)&age;
    bind[1].is_null = 0;
    bind[1].length = 0;

    // Bind email (string)
    email_length = strlen(email);
    bind[2].buffer_type = MYSQL_TYPE_STRING;
    bind[2].buffer = (char *)email;
    bind[2].buffer_length = email_length;
    bind[2].length = &email_length;
    bind[2].is_null = 0;

    // Bind parameters
    rc = mysql_stmt_bind_param(stmt, bind);
    if (rc != 0) {
        fprintf(stderr, "mysql_stmt_bind_param() failed: %s\n",
                mysql_stmt_error(stmt));
        mysql_stmt_close(stmt);
        return -1;
    }

    // Execute statement
    rc = mysql_stmt_execute(stmt);
    if (rc != 0) {
        fprintf(stderr, "mysql_stmt_execute() failed: %s\n",
                mysql_stmt_error(stmt));
        mysql_stmt_close(stmt);
        return -1;
    }

    printf("Inserted row with ID: %llu\n",
           mysql_stmt_insert_id(stmt));

    // Close statement
    mysql_stmt_close(stmt);
    return 0;
}
```

## Client C API - Fetching Results from Prepared Statements

Retrieve and process result sets from prepared statements

```c
#include <mysql.h>
#include <string.h>

int select_users_prepared(MYSQL *conn, int min_age) {
    MYSQL_STMT *stmt;
    MYSQL_BIND bind_param[1], bind_result[3];
    MYSQL_RES *prepare_meta_result;
    int id, age;
    char name[100], email[150];
    unsigned long name_length, email_length;
    my_bool name_null, email_null;
    int rc;

    // Prepare statement
    stmt = mysql_stmt_init(conn);
    const char *query = "SELECT id, name, age, email FROM users "
                       "WHERE age >= ?";
    mysql_stmt_prepare(stmt, query, strlen(query));

    // Bind input parameter
    memset(bind_param, 0, sizeof(bind_param));
    bind_param[0].buffer_type = MYSQL_TYPE_LONG;
    bind_param[0].buffer = (char *)&min_age;
    mysql_stmt_bind_param(stmt, bind_param);

    // Execute
    mysql_stmt_execute(stmt);

    // Get result metadata
    prepare_meta_result = mysql_stmt_result_metadata(stmt);
    if (prepare_meta_result == NULL) {
        fprintf(stderr, "No result metadata\n");
        mysql_stmt_close(stmt);
        return -1;
    }

    // Bind result columns
    memset(bind_result, 0, sizeof(bind_result));

    bind_result[0].buffer_type = MYSQL_TYPE_LONG;
    bind_result[0].buffer = (char *)&id;

    bind_result[1].buffer_type = MYSQL_TYPE_STRING;
    bind_result[1].buffer = name;
    bind_result[1].buffer_length = sizeof(name);
    bind_result[1].length = &name_length;
    bind_result[1].is_null = &name_null;

    bind_result[2].buffer_type = MYSQL_TYPE_LONG;
    bind_result[2].buffer = (char *)&age;

    bind_result[3].buffer_type = MYSQL_TYPE_STRING;
    bind_result[3].buffer = email;
    bind_result[3].buffer_length = sizeof(email);
    bind_result[3].length = &email_length;
    bind_result[3].is_null = &email_null;

    mysql_stmt_bind_result(stmt, bind_result);

    // Fetch rows
    while ((rc = mysql_stmt_fetch(stmt)) == 0) {
        printf("ID: %d, Name: %s, Age: %d, Email: %s\n",
               id,
               name_null ? "NULL" : name,
               age,
               email_null ? "NULL" : email);
    }

    if (rc != MYSQL_NO_DATA) {
        fprintf(stderr, "mysql_stmt_fetch() failed: %s\n",
                mysql_stmt_error(stmt));
    }

    mysql_free_result(prepare_meta_result);
    mysql_stmt_close(stmt);
    return 0;
}
```

## Storage Engine API - Custom Storage Engine Implementation

Create a custom storage engine by inheriting from handler class

```cpp
#include "sql/handler.h"
#include "my_base.h"

class ha_custom : public handler {
private:
    THR_LOCK_DATA lock_data;
    Custom_share *share;
    off_t current_position;

public:
    ha_custom(handlerton *hton, TABLE_SHARE *table_arg)
        : handler(hton, table_arg) {}

    // Storage engine identification
    const char *table_type() const override { return "CUSTOM"; }

    ulonglong table_flags() const override {
        return (HA_BINLOG_ROW_CAPABLE |
                HA_BINLOG_STMT_CAPABLE |
                HA_NO_TRANSACTIONS |
                HA_REC_NOT_IN_SEQ);
    }

    // Table operations
    int create(const char *name, TABLE *table_arg,
               HA_CREATE_INFO *create_info,
               dd::Table *table_def) override {
        // Create table file/storage
        File create_file = my_create(name, 0,
                                     O_RDWR | O_TRUNC,
                                     MYF(MY_WME));
        if (create_file < 0)
            return errno;
        my_close(create_file, MYF(0));
        return 0;
    }

    int open(const char *name, int mode, uint test_if_locked,
             const dd::Table *table_def) override {
        // Open table for access
        share = get_share(name, table);
        if (!share)
            return 1;
        thr_lock_data_init(&share->lock, &lock_data, NULL);
        current_position = 0;
        return 0;
    }

    int close(void) override {
        // Release resources
        return 0;
    }

    // Row operations
    int write_row(uchar *buf) override {
        // Insert new row
        ha_statistic_increment(&System_status_var::ha_write_count);
        // Write buf to storage
        return 0;
    }

    int update_row(const uchar *old_data, uchar *new_data) override {
        // Update existing row
        ha_statistic_increment(&System_status_var::ha_update_count);
        // Update storage
        return 0;
    }

    int delete_row(const uchar *buf) override {
        // Delete row
        ha_statistic_increment(&System_status_var::ha_delete_count);
        // Remove from storage
        return 0;
    }

    // Table scan
    int rnd_init(bool scan) override {
        current_position = 0;
        return 0;
    }

    int rnd_next(uchar *buf) override {
        // Fetch next row in sequential scan
        int rc = read_row_from_storage(buf, current_position);
        if (rc == 0)
            current_position++;
        return rc;
    }

    int rnd_pos(uchar *buf, uchar *pos) override {
        // Fetch row at specific position
        my_off_t position = *(my_off_t *)pos;
        return read_row_from_storage(buf, position);
    }

    void position(const uchar *record) override {
        // Store current row position
        *(my_off_t *)ref = current_position;
    }

    int info(uint flag) override {
        // Provide table statistics
        if (flag & HA_STATUS_VARIABLE) {
            stats.records = get_record_count();
            stats.deleted = 0;
        }
        if (flag & HA_STATUS_CONST) {
            stats.max_data_file_length = 1000000000;
        }
        return 0;
    }

private:
    int read_row_from_storage(uchar *buf, off_t position) {
        // Implement actual read logic
        return HA_ERR_END_OF_FILE;
    }

    uint get_record_count() {
        return 0;
    }
};

// Handler creation function
static handler *custom_create_handler(handlerton *hton,
                                      TABLE_SHARE *table,
                                      bool partitioned,
                                      MEM_ROOT *mem_root) {
    return new (mem_root) ha_custom(hton, table);
}

// Storage engine initialization
static int custom_init_func(void *p) {
    handlerton *custom_hton = (handlerton *)p;
    custom_hton->state = SHOW_OPTION_YES;
    custom_hton->create = custom_create_handler;
    custom_hton->flags = HTON_CAN_RECREATE;
    return 0;
}

// Plugin declaration
mysql_declare_plugin(custom) {
    MYSQL_STORAGE_ENGINE_PLUGIN,
    &custom_storage_engine,
    "CUSTOM",
    "Custom Storage Engine Example",
    PLUGIN_LICENSE_GPL,
    custom_init_func,
    nullptr,
    nullptr,
    0x0100,
    nullptr,
    nullptr,
    nullptr,
    0,
} mysql_declare_plugin_end;
```

## User-Defined Function (UDF) - String Processing Function

Implement a custom SQL function for string manipulation

```c
#include <mysql/udf_registration_types.h>
#include <string.h>
#include <ctype.h>

// Initialize function
bool reverse_string_init(UDF_INIT *initid, UDF_ARGS *args,
                        char *message) {
    if (args->arg_count != 1) {
        strcpy(message, "reverse_string() requires exactly 1 argument");
        return true;
    }

    if (args->arg_type[0] != STRING_RESULT) {
        strcpy(message, "reverse_string() requires a string argument");
        return true;
    }

    initid->max_length = args->lengths[0];
    initid->maybe_null = true;
    initid->const_item = false;

    return false;
}

// Execute function
char *reverse_string(UDF_INIT *initid, UDF_ARGS *args,
                    char *result, unsigned long *length,
                    unsigned char *is_null, unsigned char *error) {
    if (args->args[0] == NULL) {
        *is_null = 1;
        return NULL;
    }

    const char *input = args->args[0];
    unsigned long input_len = args->lengths[0];

    // Allocate result buffer if needed
    if (input_len > initid->max_length) {
        result = (char *)malloc(input_len + 1);
    }

    // Reverse the string
    for (unsigned long i = 0; i < input_len; i++) {
        result[i] = input[input_len - 1 - i];
    }
    result[input_len] = '\0';

    *length = input_len;
    *is_null = 0;
    return result;
}

// Cleanup function
void reverse_string_deinit(UDF_INIT *initid) {
    // Free any allocated resources
}

// Usage in SQL:
// CREATE FUNCTION reverse_string RETURNS STRING
//     SONAME 'udf_reverse.so';
// SELECT reverse_string('hello'); -- Returns: 'olleh'
```

## User-Defined Function (UDF) - Aggregate Function

Create a custom aggregate function for statistical calculations

```c
#include <mysql/udf_registration_types.h>
#include <string.h>
#include <math.h>

struct stddev_data {
    unsigned long long count;
    double sum;
    double sum_of_squares;
};

// Initialize aggregate function
bool stddev_pop_init(UDF_INIT *initid, UDF_ARGS *args,
                    char *message) {
    if (args->arg_count != 1) {
        strcpy(message, "stddev_pop() requires 1 argument");
        return true;
    }

    args->arg_type[0] = REAL_RESULT;

    struct stddev_data *data =
        (struct stddev_data *)malloc(sizeof(struct stddev_data));
    if (data == NULL) {
        strcpy(message, "Memory allocation failed");
        return true;
    }

    data->count = 0;
    data->sum = 0.0;
    data->sum_of_squares = 0.0;

    initid->ptr = (char *)data;
    initid->maybe_null = false;
    initid->decimals = 4;

    return false;
}

// Reset for new group
void stddev_pop_clear(UDF_INIT *initid, unsigned char *is_null,
                     unsigned char *error) {
    struct stddev_data *data = (struct stddev_data *)initid->ptr;
    data->count = 0;
    data->sum = 0.0;
    data->sum_of_squares = 0.0;
}

// Add each row value
void stddev_pop_add(UDF_INIT *initid, UDF_ARGS *args,
                   unsigned char *is_null, unsigned char *error) {
    if (args->args[0] != NULL) {
        struct stddev_data *data = (struct stddev_data *)initid->ptr;
        double value = *((double *)args->args[0]);

        data->count++;
        data->sum += value;
        data->sum_of_squares += (value * value);
    }
}

// Calculate final result
double stddev_pop(UDF_INIT *initid, UDF_ARGS *args,
                 unsigned char *is_null, unsigned char *error) {
    struct stddev_data *data = (struct stddev_data *)initid->ptr;

    if (data->count == 0) {
        *is_null = 1;
        return 0.0;
    }

    double mean = data->sum / data->count;
    double variance = (data->sum_of_squares / data->count) -
                     (mean * mean);

    return sqrt(variance);
}

// Cleanup
void stddev_pop_deinit(UDF_INIT *initid) {
    if (initid->ptr != NULL) {
        free(initid->ptr);
    }
}

// Usage in SQL:
// CREATE AGGREGATE FUNCTION stddev_pop RETURNS REAL
//     SONAME 'udf_stats.so';
// SELECT department, stddev_pop(salary) FROM employees
//     GROUP BY department;
```

## Component System - Service Implementation

Create a modern component providing custom services

```cpp
#include <mysql/components/component_implementation.h>
#include <mysql/components/service_implementation.h>
#include <mysql/components/services/mysql_string.h>

// Service interface definition
BEGIN_SERVICE_DEFINITION(text_processor)
    DECLARE_METHOD(int, process_text,
                  (const char *input, char **output));
    DECLARE_METHOD(int, get_text_length,
                  (const char *input, size_t *length));
END_SERVICE_DEFINITION(text_processor)

// Service implementation
class text_processor_impl {
public:
    static DEFINE_METHOD(int, process_text,
                        (const char *input, char **output)) {
        if (input == NULL || output == NULL)
            return 1;

        size_t len = strlen(input);
        *output = (char *)malloc(len + 1);
        if (*output == NULL)
            return 1;

        // Convert to uppercase
        for (size_t i = 0; i < len; i++) {
            (*output)[i] = toupper(input[i]);
        }
        (*output)[len] = '\0';

        return 0;
    }

    static DEFINE_METHOD(int, get_text_length,
                        (const char *input, size_t *length)) {
        if (input == NULL || length == NULL)
            return 1;

        *length = strlen(input);
        return 0;
    }
};

// Service implementation registration
BEGIN_SERVICE_IMPLEMENTATION(text_component, text_processor)
    text_processor_impl::process_text,
    text_processor_impl::get_text_length
END_SERVICE_IMPLEMENTATION();

// Component initialization
mysql_service_status_t text_component_init() {
    // Initialize component resources
    return 0;
}

// Component deinitialization
mysql_service_status_t text_component_deinit() {
    // Cleanup resources
    return 0;
}

// Declare component
BEGIN_COMPONENT_PROVIDES(text_component)
    PROVIDES_SERVICE(text_component, text_processor)
END_COMPONENT_PROVIDES();

BEGIN_COMPONENT_REQUIRES(text_component)
    REQUIRES_SERVICE(registry)
    REQUIRES_SERVICE(mysql_string_converter)
END_COMPONENT_REQUIRES();

BEGIN_COMPONENT_METADATA(text_component)
    METADATA("mysql.author", "Custom Component Developer")
    METADATA("mysql.license", "GPL")
    METADATA("mysql.version", "1.0")
END_COMPONENT_METADATA();

DECLARE_COMPONENT(text_component, "mysql:text_component")
    text_component_init,
    text_component_deinit
END_DECLARE_COMPONENT();

DECLARE_LIBRARY_COMPONENTS
    &COMPONENT_REF(text_component)
END_DECLARE_LIBRARY_COMPONENTS

// Installation:
// INSTALL COMPONENT 'file://component_text_component';
// Usage from another component or UDF
```

## Component System - Consuming Services

Use services from other components

```cpp
#include <mysql/components/component_implementation.h>
#include <mysql/components/services/registry.h>
#include <mysql/components/services/mysql_string.h>

// Service dependencies
REQUIRES_SERVICE_PLACEHOLDER(registry);
REQUIRES_SERVICE_PLACEHOLDER(mysql_string_factory);
REQUIRES_SERVICE_PLACEHOLDER(mysql_string_converter);

mysql_service_status_t consumer_init() {
    // Acquire service from registry
    SERVICE_TYPE(text_processor) *text_svc = nullptr;

    my_h_service h_text_svc = nullptr;
    if (mysql_service_registry->acquire(
            "text_processor", &h_text_svc)) {
        return 1; // Service not available
    }

    text_svc = reinterpret_cast<SERVICE_TYPE(text_processor) *>(
        h_text_svc);

    // Use the service
    const char *input = "hello world";
    char *output = nullptr;

    if (text_svc->process_text(input, &output) == 0) {
        printf("Processed: %s\n", output);
        free(output);
    }

    size_t length = 0;
    if (text_svc->get_text_length(input, &length) == 0) {
        printf("Length: %zu\n", length);
    }

    // Release service
    mysql_service_registry->release(h_text_svc);

    return 0;
}

mysql_service_status_t consumer_deinit() {
    return 0;
}

BEGIN_COMPONENT_PROVIDES(consumer_component)
END_COMPONENT_PROVIDES();

BEGIN_COMPONENT_REQUIRES(consumer_component)
    REQUIRES_SERVICE(registry)
    REQUIRES_SERVICE(mysql_string_factory)
    REQUIRES_SERVICE(mysql_string_converter)
END_COMPONENT_REQUIRES();

DECLARE_COMPONENT(consumer_component, "mysql:consumer_component")
    consumer_init,
    consumer_deinit
END_DECLARE_COMPONENT();

DECLARE_LIBRARY_COMPONENTS
    &COMPONENT_REF(consumer_component)
END_DECLARE_LIBRARY_COMPONENTS
```

## Authentication Plugin - Custom Authentication

Implement custom authentication mechanism

```cpp
#include <mysql/plugin_auth.h>
#include <string.h>

static int custom_auth_authenticate(
    MYSQL_PLUGIN_VIO *vio,
    MYSQL_SERVER_AUTH_INFO *info) {

    unsigned char *packet;
    int packet_len;

    // Read authentication packet from client
    packet_len = vio->read_packet(vio, &packet);
    if (packet_len < 0)
        return CR_ERROR;

    // Extract credentials
    const char *password = (const char *)packet;

    // Custom authentication logic
    // Example: Check against external service
    bool authenticated = verify_credentials_external(
        info->user_name,
        password,
        info->host_or_ip);

    if (authenticated) {
        // Set authenticated user
        strcpy(info->authenticated_as, info->user_name);
        return CR_OK;
    }

    return CR_ERROR;
}

static int custom_auth_generate_auth_string(
    char *outbuf,
    unsigned int *buflen,
    const char *inbuf,
    unsigned int inbuflen) {

    // Generate password hash for storage
    // Implement custom hashing algorithm
    return 0;
}

static int custom_auth_validate_auth_string(
    char *const outbuf,
    unsigned int *buflen,
    const char *inbuf,
    unsigned int inbuflen) {

    // Validate password hash format
    return 0;
}

static struct st_mysql_auth custom_auth_handler = {
    MYSQL_AUTHENTICATION_INTERFACE_VERSION,
    "custom_auth",                    // Client plugin name
    custom_auth_authenticate,
    custom_auth_generate_auth_string,
    custom_auth_validate_auth_string,
    nullptr,
    nullptr
};

mysql_declare_plugin(custom_auth) {
    MYSQL_AUTHENTICATION_PLUGIN,
    &custom_auth_handler,
    "custom_auth",
    "Custom Authentication Plugin",
    PLUGIN_LICENSE_GPL,
    nullptr,      // init
    nullptr,      // check uninstall
    nullptr,      // deinit
    0x0100,       // version
    nullptr,      // status vars
    nullptr,      // system vars
    nullptr,
    0
} mysql_declare_plugin_end;

// Installation:
// INSTALL PLUGIN custom_auth SONAME 'auth_custom.so';
// CREATE USER 'user'@'host' IDENTIFIED WITH custom_auth BY 'password';
```

## Audit Plugin - Query Logging

Track and log database activity for compliance

```cpp
#include <mysql/plugin_audit.h>
#include <fstream>

static std::ofstream audit_log;

static int audit_notify(MYSQL_THD thd,
                       mysql_event_class_t event_class,
                       const void *event) {

    if (event_class == MYSQL_AUDIT_GENERAL_CLASS) {
        const struct mysql_event_general *event_general =
            (const struct mysql_event_general *)event;

        if (event_general->event_subclass ==
            MYSQL_AUDIT_GENERAL_STATUS) {

            // Log query execution
            audit_log << "Time: " << time(nullptr) << ", "
                     << "User: " << event_general->general_user.str << ", "
                     << "Host: " << event_general->general_host.str << ", "
                     << "Query: " << event_general->general_query.str << ", "
                     << "Status: " << event_general->general_error_code
                     << std::endl;
        }
    }

    if (event_class == MYSQL_AUDIT_CONNECTION_CLASS) {
        const struct mysql_event_connection *event_conn =
            (const struct mysql_event_connection *)event;

        if (event_conn->event_subclass ==
            MYSQL_AUDIT_CONNECTION_CONNECT) {
            audit_log << "Connection from: "
                     << event_conn->user.str << "@"
                     << event_conn->host.str << std::endl;
        }
    }

    return 0;
}

static int audit_plugin_init(void *p) {
    audit_log.open("/var/log/mysql/custom_audit.log",
                   std::ios::app);
    return 0;
}

static int audit_plugin_deinit(void *p) {
    audit_log.close();
    return 0;
}

static struct st_mysql_audit audit_descriptor = {
    MYSQL_AUDIT_INTERFACE_VERSION,
    nullptr,
    audit_notify,
    {
        0,
        0,
        (unsigned long)MYSQL_AUDIT_GENERAL_ALL,
        (unsigned long)MYSQL_AUDIT_CONNECTION_ALL,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    }
};

mysql_declare_plugin(custom_audit) {
    MYSQL_AUDIT_PLUGIN,
    &audit_descriptor,
    "custom_audit",
    "Custom Audit Plugin",
    PLUGIN_LICENSE_GPL,
    audit_plugin_init,
    nullptr,
    audit_plugin_deinit,
    0x0100,
    nullptr,
    nullptr,
    nullptr,
    0
} mysql_declare_plugin_end;

// Installation:
// INSTALL PLUGIN custom_audit SONAME 'audit_custom.so';
```

## Stored Procedure Implementation - Internal API

Stored procedure execution structure from internal perspective

```sql
-- Example stored procedure that demonstrates internal structures
DELIMITER $$

CREATE PROCEDURE process_orders(IN customer_id INT, OUT total_amount DECIMAL(10,2))
BEGIN
    DECLARE order_count INT DEFAULT 0;
    DECLARE current_amount DECIMAL(10,2);
    DECLARE done INT DEFAULT FALSE;

    -- Cursor declaration
    DECLARE order_cursor CURSOR FOR
        SELECT amount FROM orders WHERE customer = customer_id;

    -- Handler for cursor end
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SET total_amount = 0.0;

    -- Open cursor
    OPEN order_cursor;

    read_loop: LOOP
        FETCH order_cursor INTO current_amount;

        IF done THEN
            LEAVE read_loop;
        END IF;

        SET total_amount = total_amount + current_amount;
        SET order_count = order_count + 1;

    END LOOP;

    CLOSE order_cursor;

    -- Insert audit record
    INSERT INTO audit_log (customer, order_count, total, processed_at)
        VALUES (customer_id, order_count, total_amount, NOW());

END$$

DELIMITER ;

-- Internal structure (from sp-imp-spec.txt):
-- Instruction array:
--   0: sp_instr_cpush (cursor push with SELECT query)
--   1: sp_instr_set (total_amount = 0.0)
--   2: sp_instr_set (order_count = 0)
--   3: sp_instr_copen (open cursor)
--   4: sp_instr_cfetch (fetch into current_amount)
--   5: sp_instr_jump_if_not (if done, jump to 10)
--   6: sp_instr_set (total_amount = total_amount + current_amount)
--   7: sp_instr_set (order_count = order_count + 1)
--   8: sp_instr_jump (jump back to 4)
--   9: sp_instr_cclose (close cursor)
--  10: sp_instr_stmt (INSERT INTO audit_log...)
--  11: sp_instr_cpop (pop cursor)
```

## Replication - Binary Log Event Processing

Read and process binary log events for replication

```c
#include <mysql.h>

int process_binlog_events(MYSQL *conn) {
    MYSQL_RPL rpl = {};
    int rc;

    // Configure replication parameters
    rpl.file_name_length = 0;  // Start from current
    rpl.start_position = 4;     // Skip magic number
    rpl.server_id = 100;        // Replica server ID
    rpl.flags = 0;

    // Open binary log stream
    rc = mysql_binlog_open(conn, &rpl);
    if (rc != 0) {
        fprintf(stderr, "Failed to open binlog: %s\n",
                mysql_error(conn));
        return -1;
    }

    // Process events
    while (true) {
        MYSQL_RPL_EVENT event = {};

        rc = mysql_binlog_fetch(conn, &rpl, &event);
        if (rc != 0) {
            if (mysql_errno(conn) == 1236) {
                // End of log
                break;
            }
            fprintf(stderr, "Error fetching event: %s\n",
                    mysql_error(conn));
            break;
        }

        // Process event based on type
        printf("Event type: %d, Length: %lu, Position: %llu\n",
               event.type,
               event.size,
               event.next_position);

        switch (event.type) {
            case 2:  // QUERY_EVENT
                printf("Query event\n");
                break;
            case 16: // XID_EVENT
                printf("Transaction commit\n");
                break;
            case 19: // TABLE_MAP_EVENT
                printf("Table map event\n");
                break;
            case 30: // WRITE_ROWS_EVENT
                printf("Insert rows event\n");
                break;
            case 31: // UPDATE_ROWS_EVENT
                printf("Update rows event\n");
                break;
            case 32: // DELETE_ROWS_EVENT
                printf("Delete rows event\n");
                break;
        }

        // Free event data
        mysql_binlog_free_event(&event);
    }

    // Close binlog stream
    mysql_binlog_close(conn, &rpl);
    return 0;
}
```

## Summary

MySQL 9.5.0 provides a comprehensive ecosystem for database management with extensive customization capabilities through its plugin and component architecture. The primary use cases span application development using the robust C client API for direct database connectivity, implementing custom storage engines to integrate specialized data sources or optimize for specific workloads, extending SQL functionality through user-defined functions for domain-specific calculations, and implementing enterprise features like custom authentication mechanisms and audit logging for compliance requirements. The prepared statement API ensures secure parameterized queries with protection against SQL injection, while the storage engine interface enables developers to create entirely new data storage backends that integrate seamlessly with MySQL's SQL layer.

The modern component system represents MySQL's evolution toward a more modular architecture, allowing developers to create reusable services that can be dynamically loaded and shared across the system without server restarts. Integration patterns include using the client library for application connectivity with connection pooling, leveraging prepared statements for high-performance parameterized queries, implementing storage engine plugins for custom data backends, creating UDF libraries for specialized calculations, developing authentication plugins for enterprise SSO integration, building audit plugins for compliance logging, utilizing the component framework for service-oriented extensions, and processing binary log events for custom replication solutions. The codebase's layered architecture, comprehensive error handling, thread-safe design, and extensive documentation make it suitable for everything from simple web applications to large-scale enterprise deployments requiring custom extensions and integrations.
