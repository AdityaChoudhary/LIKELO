// http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-globalization/index.html

window.$glob = $gre({
	vars: {},
	func: {},
	data: function (data) {
		return this.is(function (self) {
			return self && data && navigator.globalization;
		});
	}
});