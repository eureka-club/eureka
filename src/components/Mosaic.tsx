import classNames from 'classnames';
import { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

import Cycle from './mosaic/Cycle';
import Post from './mosaic/Post';
import styles from './Mosaic.module.css';

const Mosaic: FunctionComponent = () => {
  return (
    <Masonry breakpointCols={4} className={classNames('d-flex', styles.masonry)} columnClassName={styles.masonryColumn}>
      <Cycle title="Pulp fiction night" startDate="Jul 17 2020" endDate="Oct 13 2020" image="4b205649.jpg" liked />
      <Post title="Magic night" author="DAV-19" image="de7q9kj.png" liked />
      <Post title="Sean Connory" author="KristofferNS" image="d2h6b51.jpg" />
      <Post title="Moonlight" author="TamplierPainter" image="b5e80tgi.jpg" bookmarked />
      <Post title="Amelie" author="Kuvshinov-Ilya" image="a726748395.jpg" />
      <Post title="The marauders" author="kanae" image="c6078e839.jpg" bookmarked liked />
      <Cycle title="Iron man" startDate="Jan 1 2020" endDate="Dec 31 2020" image="cwMTU0NTIzM.jpg" bookmarked />
      <Post title="Traveling with your octopus" author="BrianKesinger" image="b7vof0q.jpg" liked />
      <Post title="Mafia princess 2" author="raykit" image="d253bmh.jpg" />
      <Post title="The Moth and the flame" author="StressedJenny" image="s3a2bzti.jpg" />
      <Post title="Protect her" author="Mihaela-V" image="cb69652cc4.jpg" />
      <Cycle title="American beauty" startDate="May 1 2020" endDate="May 31 2020" image="mrcnbat19rilt0x.jpg" liked />
      <Post title="VR Dreams" author="Thorsten-Denk" image="eb7b4819e.jpg" bookmarked />
    </Masonry>
  );
};

export default Mosaic;
