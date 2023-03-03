---
sidebar_position: 3
---

# My first replication

ReplicaDB allows you to easily replicate data between different databases, such as Oracle to PostgreSQL or PostgreSQL to Oracle.

## Oracle to PostgreSQL

In this example, we will show you how to set up a complete replication from an Oracle table to a PostgreSQL table. First, make sure that both the source and sink tables already exist in their respective databases.

To run the replication, you can use the command line tool and specify the necessary options, such as the connection details and table names. For example:

```shell
$ replicadb --mode=complete -j=1 \
--source-connect=jdbc:oracle:thin:@${ORAHOST}:${ORAPORT}:${ORASID} \
--source-user=${ORAUSER} \
--source-password=${ORAPASS} \
--source-table=dept \
--sink-connect=jdbc:postgresql://${PGHOST}/osalvador \
--sink-table=dept
2018-12-07 16:01:23,808 INFO  ReplicaTask:36: Starting TaskId-0
2018-12-07 16:01:24,650 INFO  SqlManager:197: TaskId-0: Executing SQL statement: SELECT /*+ NO_INDEX(dept)*/ * FROM dept where ora_hash(rowid,0) = ?
2018-12-07 16:01:24,650 INFO  SqlManager:204: TaskId-0: With args: 0,
2018-12-07 16:01:24,772 INFO  ReplicaDB:89: Total process time: 1302ms
```

Alternatively, you can use a configuration file and specify the options there. For example, create a file called `replicadb.conf` with the following content:

```yml
######################## ReplicadB General Options ########################
mode=complete
jobs=1
############################# Soruce Options ##############################
source.connect=jdbc:oracle:thin:@${ORAHOST}:${ORAPORT}:${ORASID}
source.user=${ORAUSER}
source.password=${ORAPASS}
source.table=dept
############################# Sink Options ################################
sink.connect=jdbc:postgresql://${PGHOST}/osalvador
sink.table=dept
```

And then run the replication with:


```bash
$ replicadb --options-file replicadb.conf
```

![ReplicaDB-Ora2PG.gif](https://raw.githubusercontent.com/osalvador/ReplicaDB/gh-pages/docs/media/ReplicaDB-Ora2PG.gif)

## PostgreSQL to Oracle

You can also replicate from PostgreSQL to Oracle by reversing the source and sink options in the configuration file or command line.

```bash
$ replicadb --mode=complete -j=1 \
--sink-connect=jdbc:oracle:thin:@${ORAHOST}:${ORAPORT}:${ORASID} \
--sink-user=${ORAUSER} \
--sink-password=${ORAPASS} \
--sink-table=dept \
--source-connect=jdbc:postgresql://${PGHOST}/osalvador \
--source-table=dept \
--source-columns=dept.*
2018-12-07 16:10:35,334 INFO  ReplicaTask:36: Starting TaskId-0
2018-12-07 16:10:35,440 INFO  SqlManager:131 TaskId-0: Executing SQL statement: SELECT  * FROM dept OFFSET ?
2018-12-07 16:10:35,441 INFO  SqlManager:204: TaskId-0: With args: 0,
2018-12-07 16:10:35,550 INFO  OracleManager:98 Inserting data with this command: INSERT INTO /*+APPEND_VALUES*/ ....
2018-12-07 16:10:35,552 INFO  ReplicaDB:89: Total process time: 1007ms
```