const config = {
  baseUrl: process.env.baseUrl,
  baseApiUrl: process.env.baseApiUrl,
  baseAssetUrl: process.env.baseAssetUrl
};

export default () => {
  return {
    config,
    file: {
      size: 4, //MB
      pdf: '.pdf',
      image: '.jpg,.jpeg,.png'
    },
    empty: 'N/A'
  };
};
