export const getButtonUrl = (type: 'pressed' | 'normal') =>
  `https://www.myinstants.com/media/images/transparent_button_small_${type}.png`;

export const cacheButtonUrls = () => {
  new Image().src = getButtonUrl('normal');
  new Image().src = getButtonUrl('pressed');
};
