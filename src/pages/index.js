import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import logo from '@site/static/img/replicadb_replication.png';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();  
  return (
   
   <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
      <img src={logo} className={styles.heroImage} style={{ float: 'right' }} alt="ReplicaDB Logo"/>
        <h1 className="hero__subtitle">{siteConfig.tagline}</h1>
        <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to='docs/intro'>
              Documentation
            </Link>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={'https://github.com/osalvador/replicadb'}>
              Source code
            </Link>
            <span className="github-button">
              <iframe src="https://ghbtns.com/github-btn.html?user=osalvador&repo=replicadb&type=star&count=true&size=large"
                      frameBorder={0}
                      scrolling={0}
                      width={160}
                      height={30}
                      title="GitHub Stars"/>
            </span>

          </div>
        
        
      </div>      
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
