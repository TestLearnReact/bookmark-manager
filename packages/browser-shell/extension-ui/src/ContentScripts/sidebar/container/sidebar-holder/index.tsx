import {
  msSendPushArgsStream,
  msSendSetTabAsIndexed,
  msSendTestStream,
} from '@workspace/extension-common';
import React, { useEffect } from 'react';
import { SidebarContainerDependencies } from '../../main';

import SidebarContainer from '../sidebar';

interface SidebarHolderContainerProps {
  dependencies: SidebarContainerDependencies;
}

const SidebarHolderContainer: React.FC<SidebarHolderContainerProps> = ({
  dependencies,
}) => {
  console.log('r.e.r.e.n.d.e.r SidebarHolderContainer');

  // useEffect(() => {
  //   msSendPushArgsStream.subscribe(
  //     async ([{ changes, lastPulledAt }, sender]) => {
  //       console.log('#### sync sidebar ####: ', changes, lastPulledAt);
  //       // await syncWatermelonDbFrontends({
  //       //   database: watermelonDb,
  //       //   pullBridgeFromBackground: { changes, lastPulledAt },
  //       // });
  //     },
  //   );
  //   msSendSetTabAsIndexed();
  // }, []);

  // msSendSetTabAsIndexed();

  return (
    <div className='_sidebarHolderContainer'>
      <SidebarContainer dependencies={dependencies} />
    </div>
  );
};

export default SidebarHolderContainer;
