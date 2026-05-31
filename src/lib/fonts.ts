import localFont from 'next/font/local';

export const arad = localFont({
  src: [
    {
      path: '../../public/arad/Arad-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/arad/Arad-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/arad/Arad-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/arad/Arad-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/arad/Arad-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/arad/Arad-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/arad/Arad-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/arad/Arad-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
});
