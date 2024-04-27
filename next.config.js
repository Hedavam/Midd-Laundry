const Cookies = require("js-cookie");

module.exports = {
  async redirects() {
    // Check if there's a favorite room stored in the cookie
    const favoriteRoom = Cookies.get("favoriteRoom");

    // If there's a favorite room, redirect to that room's page
    if (favoriteRoom) {
      return [
        {
          source: "/",
          destination: `/${favoriteRoom}`,
          permanent: false,
        },
      ];
    }

    // If there's no favorite room, redirect to the rooms page
    return [
      {
        source: "/",
        destination: "/rooms",
        permanent: false,
      },
    ];
  },
};
