module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/rooms",
        permanent: false,
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
};
