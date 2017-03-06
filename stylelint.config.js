module.exports = {
	"extends": "stylelint-config-standard",
	"rules": {
		"indentation": 4,
		"number-leading-zero": null,
		"property-no-unknown": [ true, {
			"ignoreProperties": [
			"composes"
			]
		}],
		"unit-whitelist": ["em", "rem", "%", "s", "deg", 'vh', 'vw', 'px']
	}
}