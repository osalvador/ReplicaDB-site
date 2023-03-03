---
sidebar_position: 1
description: How to install ReplicaDB locally, and start a replication process in no time.
---

# Installation

## System Requirements

ReplicaDB is written in Java and requires a Java Runtime Environment (JRE) Standard Edition (SE) or Java Development Kit (JDK) Standard Edition (SE) version 8.0 or above. The minimum operating system requirements are:

- Java SE Runtime Environment 8 or above
- Memory - 256 (MB) available

## Install

Just download [latest](https://github.com/osalvador/ReplicaDB/releases) release and unzip it. 

```bash
$ curl -o ReplicaDB-0.15.0.tar.gz -L "https://github.com/osalvador/ReplicaDB/releases/download/v0.15.0/ReplicaDB-0.15.0.tar.gz"
$ tar -xvzf ReplicaDB-0.15.0.tar.gz
$ ./bin/replicadb --help
```

### JDBC Drivers

ReplicaDB already comes with all the JDBC drivers for the [Compatible Databases](#compatible-databases). But you can use ReplicaDB with any JDBC-compliant database.

First, download the appropriate JDBC driver for the type of database you want to use, and install the `.jar` file in the `$REPLICADB_HOME/lib` directory. Each driver `.jar` file also has a specific driver class that defines the entry-point to the driver.

If your database is JDBC-compliant and not appear in the [Compatible Databases](#compatible-databases) list, you must set the driver class name in the configuration properties as [extra JDBC parameter](https://osalvador.github.io/ReplicaDB/docs/docs.html#32-connecting-to-a-database-server).

For example, to replicate a DB2 database table as both source and sink

```properties
######################## ReplicadB General Options ########################
mode=complete
jobs=1
############################# Soruce Options ##############################
source.connect=jdbc:db2://localhost:50000/testdb
source.user=${DB2USR}
source.password=${DB2PASS}
source.table=source_table
source.connect.parameter.driver=com.ibm.db2.jcc.DB2Driver
############################# Sink Options ################################
sink.connect=jdbc:db2://localhost:50000/testdb
sink.user=${DB2USR}
sink.password=${DB2PASS}
sink.table=sink_table
sink.connect.parameter.driver=com.ibm.db2.jcc.DB2Driver
```

## Docker

```bash
$ docker run \
    -v /tmp/replicadb.conf:/home/replicadb/conf/replicadb.conf \
    osalvador/replicadb
```

Visit the [project homepage on Docker Hub](https://hub.docker.com/r/osalvador/replicadb) for more information. 

## Podman 

Based on Red Hat UBI 8

```bash
$ podman run \
    -v /tmp/replicadb.conf:/home/replicadb/conf/replicadb.conf:Z \
    osalvador/replicadb:ubi8-latest
```
