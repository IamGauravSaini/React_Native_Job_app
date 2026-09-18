import { Image, ImageProps } from 'expo-image';

export default function BrandLogo({ style }: { style?: ImageProps['style'] }) {
  return (
    <Image
      source={require('../assets/images/karya-logo.svg')}
      style={[{ width: 142, height: 40 }, style]}
      contentFit="contain"
      accessibilityLabel="Karya logo"
      accessible
    />
  );
}
