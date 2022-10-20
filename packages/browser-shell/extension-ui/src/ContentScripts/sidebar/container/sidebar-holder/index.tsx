import {
  BookmarkModel,
  TableName,
  useDatabase,
} from '@workspace/extension-base';
import React from 'react';
import { SidebarContainerDependencies } from '../../main';

import SidebarContainer from '../sidebar';

interface SidebarHolderContainerProps {
  dependencies: SidebarContainerDependencies;
}

const SidebarHolderContainer: React.FC<SidebarHolderContainerProps> = ({
  dependencies,
}) => {
  console.log('r.e.r.e.n.d.e.r SidebarHolderContainer');

  // const database = useDatabase();

  return (
    <div className='_sidebarHolderContainer'>
      <SidebarContainer dependencies={dependencies} />
    </div>
  );
};

export default SidebarHolderContainer;
