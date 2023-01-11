import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/replicadb_logo.svg').default,
    description: (
      <>
        ReplicaDB was designed from the ground up to be easily installed and 
        used, and to get your data replications up and running quickly.
      </>
    ),
  },
  {
    title: 'Simple architecture',
    Svg: require('@site/static/img/undraw_feeling_proud.svg').default,
    description: (
      <>
        With a simple architecture, ReplicaDB is just a command line tool that
        can run on any server (including my laptop), without any remote agent on the databases. 
      </>
    ),
  },
  {
    title: 'Multi-platform',
    Svg: require('@site/static/img/undraw_cloud_hosting.svg').default,
    description: (
      <>
        Multi-platform solution based on Java, compatible with Linux, Windows and MacOS.
        You can run your data replications in the cloud or on-premises, even between them.
      </>
    ),
  },
  {
    title: 'Parallel execution',
    Svg: require('@site/static/img/undraw_progress_overview.svg').default,
    description: (
      <>
        Designed for large data volumes, ReplicaDB can use parallel data transfer
        for faster performance and optimal system utilization.
      </>
    ),
  },
  {
    title: 'In-memory Streaming',
    Svg: require('@site/static/img/undraw_cloud_docs.svg').default,
    description: (
      <>
        Replication is done through the use of streaming, 
        a continuous flow of data that uses only the system's memory to transfer the data.
      </>
    ),
  },
  {
    title: 'Low resource footprint',
    Svg: require('@site/static/img/undraw_electricity.svg').default,
    description: (
      <>
        Thanks to streaming data transfer and the use of threads for parallel 
        execution, the resource consumption of your system remains very low.
      </>
    ),
  },
  {
    title: 'SQL and NoSQL',
    Svg: require('@site/static/img/undraw_convert.svg').default,
    description: (
      <>
        ReplicaDB works with SQL (Oracle, Postgres, SQL Server, MySQL) and NoSQL (MongoDB, Kafka, CSV) 
        among others, and helps you transfer data between them.
      </>
    ),
  },
  {
    title: 'Complete, Atomic or Incremental replication',
    Svg: require('@site/static/img/undraw_absorbed_in.svg').default,
    description: (
      <>
        You can create your replications in three modes;
        Complete (full refresh), Atomic (full atomic refresh), Incremental (incremental and atomic, adding new values).
      </>
    ),
  },  
  {
    title: 'Select only the data you want to replicate',
    Svg: require('@site/static/img/undraw_filter.svg').default,
    description: (
      <>
        You can filter only the columns you want, use a <code>WHERE</code> clause or a free-form query (even aggregations)
        to select only the fields and rows you want to replicate.
      </>
    ),
  }, 
  {
    title: 'Open Source',
    Svg: require('@site/static/img/undraw_open_source.svg').default,
    description: (
      <>
        Open Source Apache License, it is free software, you can change its source, share and learn.
      </>
    ),
  },  
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">        
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function FeatureLast({Svg, title, description}) {
  return (
    <div className={clsx('col col--4 col--offset-4')}>
      <div className="text--center">        
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  const rows = FeatureList.slice(0,-1);
  const lastRow = FeatureList.slice(-1);

  return (
    <section className={styles.features}>
      <div className="container text--center">
        <h2>Main features</h2>
        <div className="row">
          {rows.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

        <div className="row">
          {lastRow.map((props, idx) => (
            <FeatureLast key={idx} {...props} />
          ))}
        </div>

      </div>
    </section>
  );
}
