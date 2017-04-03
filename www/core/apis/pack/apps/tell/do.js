window.$tell = $gre({
	vars: {
		head: '',
		text: '',
		opts: '',
		defs: ''
	},
	func: {},
	$act: function (data) {
		return this.is(function (self) {
			var vars = self.vars,
				done = vars.done;

			$when(self.$).same({
				'show': function () {
					navigator.notification.alert(vars.text, done, vars.head, vars.opts);
				},
				'find': function () {
					navigator.notification.confirm(vars.text, done, vars.head, vars.opts);
				},
				'take': function () {
					navigator.notification.prompt(vars.text, done, vars.head, vars.opts, vars.defs);
				}
			});
		});
	}
});