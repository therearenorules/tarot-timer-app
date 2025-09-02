/**
 * Metadata Manager Component
 * Provides declarative metadata management for React components
 */

import React, { useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useMetadata, MetadataConfig } from '../../hooks/useMetadata';

interface MetadataManagerProps {
  children?: ReactNode;
  config: MetadataConfig;
  merge?: boolean;
  immediate?: boolean;
}

export const MetadataManager: React.FC<MetadataManagerProps> = ({
  children,
  config,
  merge = true,
  immediate = false
}) => {
  const { appliedMetadata } = useMetadata(config, { merge, immediate });

  // For debugging in development
  useEffect(() => {
    if (__DEV__ && Platform.OS === 'web') {
      console.log('MetadataManager applied:', appliedMetadata);
    }
  }, [appliedMetadata]);

  return <>{children}</>;
};

export default MetadataManager;