const production = !process.env.ROLLUP_WATCH;

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  plugins: [],
  purge: {
    content: ["./src/**/*.svelte"],
    enabled: production,
  },
	theme: {
		extend: {
		  backgroundImage: {
			'img-lg': "url('/images/bg-login.png')",
		  },
		},
	},
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
};