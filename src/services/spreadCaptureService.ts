/**
 * Spread Capture Service - Screen capture and sharing functionality
 */

import { RefObject } from 'react';
import { View, Alert, Platform } from 'react-native';

// Web-safe imports with conditional loading
let captureRef: any = null;
let MediaLibrary: any = null;
let Sharing: any = null;
let FileSystem: any = null;

if (Platform.OS !== 'web') {
  try {
    captureRef = require('react-native-view-shot').captureRef;
    MediaLibrary = require('expo-media-library');
    Sharing = require('expo-sharing');
    FileSystem = require('expo-file-system');
  } catch (error) {
    console.warn('Mobile-specific libraries not available:', error);
  }
}
import { SpreadData, CaptureOptions, SpreadSaveOptions } from '@/assets/spreads';

export interface SpreadCaptureService {
  captureSpreadView: (viewRef: RefObject<View>, options?: CaptureOptions) => Promise<string>;
  saveToGallery: (imageUri: string, title: string) => Promise<boolean>;
  shareSpread: (imageUri: string, title: string, message?: string) => Promise<void>;
  generateSpreadTitle: (spreadType: string, date: string) => string;
  requestPermissions: () => Promise<boolean>;
  deleteImageFile: (imageUri: string) => Promise<boolean>;
  getImageInfo: (imageUri: string) => Promise<{ width: number; height: number; size: number }>;
}

/**
 * Default capture options
 */
const DEFAULT_CAPTURE_OPTIONS: CaptureOptions = {
  format: 'png',
  quality: 0.9,
  width: 800,
  height: 1200
};

/**
 * Request necessary permissions for saving and sharing
 */
export const requestPermissions = async (): Promise<boolean> => {
  try {
    // Web doesn't need permissions for downloading
    if (Platform.OS === 'web') {
      return true;
    }

    if (!MediaLibrary) {
      console.warn('MediaLibrary not available on this platform');
      return false;
    }

    // Request media library permissions
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    
    if (mediaLibraryStatus.status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to save spread images.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to request permissions:', error);
    return false;
  }
};

/**
 * Capture spread view as image
 */
export const captureSpreadView = async (
  viewRef: RefObject<View>,
  options: CaptureOptions = DEFAULT_CAPTURE_OPTIONS
): Promise<string> => {
  try {
    if (!viewRef.current) {
      throw new Error('View reference is not available');
    }

    // Web fallback - return a placeholder image URI
    if (Platform.OS === 'web' || !captureRef) {
      console.log('📸 Web capture simulation (capture not available on web)');
      // Return a data URI for a simple placeholder
      // @ts-ignore - Web-only code with platform check
      if (typeof window !== 'undefined' && window.document) {
        const document = window.document;
        const canvas = document.createElement('canvas');
        canvas.width = options.width || 800;
        canvas.height = options.height || 1200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Simple gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, '#6366f1');
          gradient.addColorStop(1, '#8b5cf6');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add text
          ctx.fillStyle = 'white';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Tarot Spread', canvas.width / 2, canvas.height / 2);
          ctx.font = '16px Arial';
          ctx.fillText('(Web Preview)', canvas.width / 2, canvas.height / 2 + 40);
        }
        return canvas.toDataURL('image/png');
      }
      // Fallback if document is not available
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }

    const captureOptions = {
      format: options.format,
      quality: options.quality,
      result: 'tmpfile' as const,
      ...(options.width && options.height && {
        width: options.width,
        height: options.height
      })
    };

    console.log('📸 Capturing spread view...');
    const imageUri = await captureRef(viewRef, captureOptions);
    
    console.log('✅ Spread captured successfully:', imageUri);
    return imageUri;
  } catch (error) {
    console.error('❌ Failed to capture spread:', error);
    throw new Error(`Failed to capture spread: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Save captured image to device gallery
 */
export const saveToGallery = async (imageUri: string, title: string): Promise<boolean> => {
  try {
    console.log('💾 Saving to gallery:', title);

    // Web fallback - download the image
    if (Platform.OS === 'web') {
      try {
        // @ts-ignore - Web-only code with platform check
        if (typeof window !== 'undefined' && window.document) {
          const document = window.document;
          const link = document.createElement('a');
          link.href = imageUri;
          link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('✅ Downloaded successfully on web');
          return true;
        } else {
          console.log('✅ Web download simulated (document not available)');
          return true;
        }
      } catch (webError) {
        console.error('❌ Web download failed:', webError);
        Alert.alert(
          'Download Failed',
          'Unable to download the spread image. Please try right-clicking and saving.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }

    // Check permissions first
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      return false;
    }

    if (!MediaLibrary) {
      throw new Error('MediaLibrary not available');
    }

    // Create album for tarot spreads
    let album;
    try {
      album = await MediaLibrary.getAlbumAsync('Tarot Spreads');
      if (!album) {
        album = await MediaLibrary.createAlbumAsync('Tarot Spreads', null, false);
      }
    } catch {
      // If album creation fails, save to default location
      album = null;
    }

    // Create media asset
    const asset = await MediaLibrary.createAssetAsync(imageUri);
    
    // Add to album if created successfully
    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    console.log('✅ Saved to gallery successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to save to gallery:', error);
    
    Alert.alert(
      'Save Failed',
      'Unable to save the spread image to your gallery. Please check permissions.',
      [{ text: 'OK' }]
    );
    
    return false;
  }
};

/**
 * Share spread image
 */
export const shareSpread = async (
  imageUri: string, 
  title: string, 
  message?: string
): Promise<void> => {
  try {
    console.log('🔗 Sharing spread:', title);

    // Web fallback - use Web Share API if available
    if (Platform.OS === 'web') {
      // @ts-ignore - Web-only code with platform check
      if (typeof window !== 'undefined' && window.navigator && window.navigator.share && window.navigator.canShare) {
        try {
          // Convert data URI to blob for sharing
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const file = new File([blob], `${title}.png`, { type: 'image/png' });
          
          const shareData = {
            title: title,
            text: message || `My ${title} tarot reading`,
            files: [file]
          };

          // @ts-ignore - Web-only code with platform check
          const navigator = window.navigator;
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            console.log('✅ Shared successfully via Web Share API');
            return;
          }
        } catch (webShareError) {
          console.warn('Web Share API failed:', webShareError);
        }
      }
      
      // Fallback: copy image data URI to clipboard
      // @ts-ignore - Web-only code with platform check
      if (typeof window !== 'undefined' && window.navigator && window.navigator.clipboard) {
        try {
          // @ts-ignore - Web-only code with platform check
          const navigator = window.navigator;
          await navigator.clipboard.writeText(imageUri);
          Alert.alert(
            'Image Copied',
            'Image data has been copied to clipboard. You can paste it in other apps.',
            [{ text: 'OK' }]
          );
          return;
        } catch (clipboardError) {
          console.warn('Clipboard API failed:', clipboardError);
        }
      }
      
      // Final fallback: show sharing not available message
      Alert.alert(
        'Sharing Not Available',
        'Web sharing is not available in this browser. You can download the image instead.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!Sharing) {
      throw new Error('Sharing not available');
    }

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing Unavailable',
        'Sharing is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Prepare share options
    const shareOptions: any = {
      mimeType: 'image/png',
      dialogTitle: `Share ${title}`,
    };

    // Add message if provided
    if (message) {
      shareOptions.message = message;
    }

    // Share the image
    await Sharing.shareAsync(imageUri, shareOptions);
    
    console.log('✅ Shared successfully');
  } catch (error) {
    console.error('❌ Failed to share spread:', error);
    
    Alert.alert(
      'Share Failed',
      'Unable to share the spread image. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Generate descriptive title for spread
 */
export const generateSpreadTitle = (spreadType: string, date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const spreadNames: Record<string, string> = {
    'one_card': 'Daily Guidance',
    'three_card': 'Past Present Future',
    'five_card': 'Situation Analysis',
    'four_card_timeline': 'Timeline Reading',
    'cup_of_relationship': 'Relationship Reading',
    'celtic_cross': 'Celtic Cross'
  };

  const spreadName = spreadNames[spreadType] || 'Tarot Reading';
  return `${spreadName} - ${formattedDate}`;
};

/**
 * Delete temporary image file
 */
export const deleteImageFile = async (imageUri: string): Promise<boolean> => {
  try {
    if (imageUri.includes('ImageManipulator') || imageUri.includes('RNViewShot')) {
      await FileSystem.deleteAsync(imageUri, { idempotent: true });
      console.log('🗑️ Temporary image file deleted');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to delete image file:', error);
    return false;
  }
};

/**
 * Get image file information
 */
export const getImageInfo = async (imageUri: string): Promise<{ width: number; height: number; size: number }> => {
  try {
    const info = await FileSystem.getInfoAsync(imageUri);
    
    if (!info.exists) {
      throw new Error('Image file does not exist');
    }

    // For basic info, return estimated values
    // In a real implementation, you might want to use expo-image-manipulator
    // to get exact dimensions
    return {
      width: 800,
      height: 1200,
      size: info.size || 0
    };
  } catch (error) {
    console.error('Failed to get image info:', error);
    throw error;
  }
};

/**
 * Save spread with complete options
 */
export const saveSpreadWithOptions = async (
  viewRef: RefObject<View>,
  spreadData: SpreadData,
  options: SpreadSaveOptions
): Promise<string> => {
  try {
    // Generate title
    const title = options.title || generateSpreadTitle(
      spreadData.spreadId,
      spreadData.createdAt
    );

    // Capture the spread
    const imageUri = await captureSpreadView(viewRef, {
      format: 'png',
      quality: 0.9
    });

    // Save to gallery if requested
    if (options.saveToGallery) {
      const saved = await saveToGallery(imageUri, title);
      if (!saved) {
        throw new Error('Failed to save to gallery');
      }
    }

    // Share if requested
    if (options.shareAfterSave) {
      const message = `My ${spreadData.spreadName} tarot reading`;
      await shareSpread(imageUri, title, message);
    }

    return imageUri;
  } catch (error) {
    console.error('❌ Failed to save spread with options:', error);
    throw error;
  }
};

/**
 * Create spread capture service instance
 */
export const spreadCaptureService: SpreadCaptureService = {
  captureSpreadView,
  saveToGallery,
  shareSpread,
  generateSpreadTitle,
  requestPermissions,
  deleteImageFile,
  getImageInfo
};

export default spreadCaptureService;