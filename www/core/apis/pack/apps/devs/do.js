// http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html

window.$devs = $gre({
	vars: {},
	func: {},
	init: function (data) {
		return this.is(function (self) {
			document.addEventListener('deviceready', data, false);
		});
	}
});