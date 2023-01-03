---
sidebar_position: 1
---


## 1. Introduction

ReplicaDB is primarily a command line, portable and cross-platform tool for data replication between a source and a sink databases. Its main objective is performance, implementing all the specific DataBase engine techniques to achieve the best performance for each of them, either as a source or as a sink.

ReplicaDB follows the Convention over configuration design, so the user will introduce the minimum parameters necessary for the replication process, the rest will be default.

## 2. Basic Usage

With ReplicaDB, you can _replicate_ data between relational databases and non-relational databases. The input to the replication process is a database table or custom query. ReplicaDB will read the source table row-by-row and the output of this replication process is q table in the sink database containing a copy of the source table. The replication process is performed in parallel.

By default, ReplicaDB will truncate the sink table before populating it with data, unless `--sink-disable-truncate false` is indicated.

### 2.1 Replication Mode

ReplicaDB implements three replication modes: `complete`, `complete-atomic` and `incremental`.


#### Complete

The `complete` mode makes a complete replica of the source table, of all its data, from source to sink. In `complete` mode, only` INSERT` is done in the sink table without worrying about the primary keys. ReplicaDB will perform the following actions on a `complete` replication:

  - Truncate the sink table with the `TRUNCATE TABLE` statement.
  - Select and copy the data in parallel from the source table to the sink table.

So data is **not** available in the Sink Table during the replication process.


![ReplicaDB Mode Complete](https://raw.githubusercontent.com/osalvador/ReplicaDB/gh-pages/docs/media/ReplicaDB-Mode_Complete.png){:class="img-responsive"}

#### Complete Atomic

The `complete-atomic` mode performs a complete replication (`DELETE` and `INSERT`) in a single transaction, allowing the sink table to never be empty. ReplicaDB will perform the following actions on a `complete-atomic` replication:

- Automatically create the staging table in the sink database.
- Begin a new transaction, called `"T0"`, and delete the sink table with the `DELETE FROM` statement. This operation is executed in a new thread, so ReplicaDB does not wait for the operation to finish. 
- Select and copy the data in parallel from the source table to the sink staging table.
- Wait until the `DELETE` statement of transaction `"T0"` is completed.
- Using transaction `"T0"` the data is moved (using `INSERT INTO ... SELECT` statement) from the sink staging table to the sink table.
- Commit transaction `"T0"`.
- Drop the sink staging table.


So data is available in the Sink Table during the replication process.

![ReplicaDB Mode Complete Atomic](https://raw.githubusercontent.com/osalvador/ReplicaDB/gh-pages/docs/media/ReplicaDB-Mode_Complete-Atomic.png){:class="img-responsive"}

#### Incremental

The `incremental` mode performs an incremental replication of the data from the source table to the sink table. The `incremental` mode aims to replicate only the new data added in the source table to the sink table. This technique drastically reduces the amount of data that must be moved between both databases and becomes essential with large tables with billions of rows.

To do this, it is necessary to have a strategy for filtering the new data at the source. Usually, a date type column or a unique incremental ID is used. Therefore it will be necessary to use the `source.where` parameter to retrieve only the newly added rows in the source table since the last time the replica was executed.

Currently, you must store the last value of the column used to determine changes in the source table. In future versions, ReplicaDB will do this automatically.

In the `incremental` mode, the` INSERT or UPDATE` or `UPSERT` technique is used in the sink table. ReplicaDB needs to create a staging table in the sink database, where data is copied in parallel. The last step of the replication is to merge the staging table with the sink table. ReplicaDB will perform the following actions in an `incremental` replication:

- Automatically create the staging table in the sink database.
- Truncate the staging table.
- Select and copy the data in parallel from the source table to the sink staging table.
- Gets the primary keys of the sink table
- Execute the `UPSERT` sentence between the sink staging table and the sink table. This statement will depend on the Database Vendor, it can be for example `INSERT ... ON CONFLICT ... DO UPDATE` in PostgreSQL or` MERGE INTO ... `in Oracle.
- Drop the sink staging table.


So data is available in the Sink Table during the replication process.


![ReplicaDB Mode Incremental](https://raw.githubusercontent.com/osalvador/ReplicaDB/gh-pages/docs/media/ReplicaDB-Mode_Incremental.png){:class="img-responsive"}


### 2.2 Controlling Parallelism

ReplicaDB replicates data in parallel from most database sources. You can specify the number of job tasks (parallel processes) to use to perform the replication by using the `-j` or `--jobs` argument. Each of these arguments takes an integer value which corresponds to the degree of parallelism to employ. By default, four tasks are used. Some databases may see improved performance by increasing this value to 8 or 16. Do not increase the degree of parallelism beyond what your database can reasonably support. Connecting 100 concurrent clients to your database may increase the load on the database server to a point where performance suffers as a result.

## 3. Command Line Arguments 

ReplicaDB ships with a help tool. To display a list of all available options, type the following command:

```bash
$ replicadb --help
usage: replicadb [OPTIONS]
...
```

**Table 1. Common arguments**


| Argument                                                | Description                                                                                              | Default            |
|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------|--------------------|
| `--fetch-size <fetch-size>`                             | Number of entries to read from database at once.                                                         | `100`              |
| `-h`,`--help`                                           | Print this help screen                                                                                   |                    |
| `-j`,`--jobs <n>`                                       | Use n jobs to replicate in parallel.                                                                     | `4`                |
| `--mode <mode>`                                         | Specifies the replication mode. The allowed values are `complete`, `complete-atomic` or `incremental`    | `complete`         |
| `--options-file <file-path>`                            | Options file path location                                                                               |
| `--quoted-identifiers`                                  | Should all database identifiers be quoted.                                                               | `false`            |
| `--sink-columns <col,col,col...>`                       | Sink database table columns to be populated                                                              | `--source-columns` |
| `--sink-connect <jdbc-uri>`                             | Sink database JDBC connect string                                                                        | required           |
| `--sink-disable-escape`                                 | Escape srings before populating to the table of the sink database.                                       | `false`            |
| `--sink-disable-truncate`                               | Disable the truncation of the sink database table before populate.                                       | `false`            |
| `--sink-password <password>`                            | Sink database authentication password                                                                    |                    |
| `--sink-staging-schema <schema-name>`                   | Scheme name on the sink database, with right permissions for creating staging tables.                    | `PUBLIC`           |
| `--sink-staging-table <table-name>`                     | Qualified name of the sink staging table. The table must exist in the sink database.                     |                    |
| `--sink-staging-table-alias <staging-table-name-alias>` | Alias name for the sink staging table.                                                                   |                    |
| `--sink-table <table-name>`                             | Sink database table to populate                                                                          | `--source-table`   |
| `--sink-user <username>`                                | Sink database authentication username                                                                    |                    |
| `--source-columns <col,col,col...>`                     | Source database table columns to be extracted                                                            | `*`                |
| `--source-connect <jdbc-uri>`                           | Source database JDBC connect string                                                                      | required           |
| `--source-password <password>`                          | Source databse authentication password                                                                   |                    |
| `--source-query <statement>`                            | SQL statement to be executed in the source database                                                      |                    |
| `--source-table <table-name>`                           | Source database table to read                                                                            |                    |
| `--source-user <username>`                              | Source database authentication username                                                                  |                    |
| `--source-where <where clause>`                         | Source database WHERE clause to use during extraction                                                    |                    |
| `-v`,`--verbose`                                        | Print more information while working                                                                     |                    |
| `--version`                                             | Show implementation version and exit                                                                     |                    |



### 3.1 Using Options Files to Pass Arguments

When using ReplicaDB, the command line options that do not change from invocation to invocation can be put in an options file for convenience. An options file is a Java properties text file where each line identifies an option. Option files allow specifying a single option on multiple lines by using the back-slash character at the end of intermediate lines. Also supported are comments within option files that begin with the hash character. Comments must be specified on a new line and may not be mixed with option text. All comments and empty lines are ignored when option files are expanded. 

Option files can be specified anywhere on the command line. Command line arguments override those in the options file. To specify an options file, simply create an options file in a convenient location and pass it to the command line via `--options-file` argument.

For example, the following ReplicaDB invocation for replicate a full table into PostgreSQL can be specified alternatively as shown below:

```bash
$ replicadb --source-connect jdbc:postgresql://localhost/osalvador \
--source-table TEST \
--sink-connect jdbc:postgresql://remotehost/testdb \
--sink-user=testusr \
--sink-table TEST \
--mode complete
```

```bash
$ replicadb --options-file /users/osalvador/work/import.txt -j 4
```

where the options file `/users/osalvador/work/import.txt` contains the following:

```properties
source.connect=jdbc:postgresql://localhost/osalvador
source.table=TEST

sink.connect=jdbc:postgresql://remotehost/testdb
sink.user=testusr
sink.table=TEST

mode=complete
```


**Using environment variables in options file**

If you are familiar with Ant or Maven, you have most certainly already encountered the variables (like `${token}`) that are automatically expanded when the configuration file is loaded. ReplicaDB supports this feature as well,  here is an example: 

```properties
source.connect=jdbc:postgresql://${PGHOST}$/${PGDATABASE}
source.user=${PGUSER}
source.password=${PGPASSWORD}
source.table=TEST
```


Variables are interpolated from system properties. ReplicaDB will search for a system property with the given name and replace the variable by its value. This is a very easy means for accessing the values of system properties in the options configuration file.

Note that if a variable cannot be resolved, e.g. because the name is invalid or an unknown prefix is used, it won't be replaced, but is returned as-is including the dollar sign and the curly braces.


### 3.2 Connecting to a Database Server

ReplicaDB is designed to replicate tables between databases. To do so, you must specify a _connect string_ that describes how to connect to the database. The _connect string_ is similar to a URL and is communicated to ReplicaDB with the `--source-connect` or `--sink-connect` arguments. This describes the server and database to connect to; it may also specify the port. For example:

```bash
$ replicadb --source-connect jdbc:mysql://database.example.com/employees
```

This string will connect to a MySQL database named `employees` on the host `database.example.com`.

You might need to authenticate against the database before you can access it. You can use the `--source-username` or `--sink-username` to supply a username to the database.

ReplicaDB provides a couple of different ways to supply a password, secure and non-secure, to the database which is detailed below.

**Specifying extra JDBC parameters**

When connecting to a database using JDBC, you can optionally specify extra JDBC parameters **only** via the options file. The contents of these properties are parsed as standard Java properties and passed into the driver while creating a connection.

You can specify these parameters for both the source and sink databases. ReplicaDB will retrieve all the parameters that start with `source.connect.parameter.` or` sink.connect.parameter.` followed by the name of the specific parameter of the database engine.

Examples:

```properties
# Source JDBC connection parameters
# source.connect.parameter.[prameter_name]=parameter_value
# Example for Oracle
source.connect.parameter.oracle.net.tns_admin=${TNS_ADMIN}
source.connect.parameter.oracle.net.networkCompression=on
source.connect.parameter.defaultRowPrefetch=5000
```

```properties
# Sink JDBC connection parameters
# sink.connect.parameter.[prameter_name]=parameter_value
# Example for PostgreSQL
sink.connect.parameter.ApplicationName=ReplicaDB
sink.connect.parameter.reWriteBatchedInserts=true
```

**Secure way of supplying a password to the database**

To supply a password securely, the options file must be used using the `--options-file` argument. For example:

```bash
$ replicadb --source-connect jdbc:mysql://database.example.com/employees \
--source-username boss --options-file ./conf/empoloyee.conf
```

where the options file `./conf/empoloyee.conf` contains the following:

```properties
source.password=myEmployeePassword
```

**Unsecure way of supplying password to the database**

```bash
$ replicadb --source-connect jdbc:mysql://database.example.com/employees \
--source-username boss --source-password myEmployeePassword
```
