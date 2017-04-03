window.$brow = $gre({
	vars: {
		hide: false,
		pure: false,
		page: {},
		gets: []
	},
	func: {
		__js: function (data) {
			return (data + '').slice(13, -1);
		}
	},
	$act: function (data) {
		return this.is(function (self) {
			/* ------------------------------------------------------------------------------------------------------------------------------------ */

			var vars = self.vars,
				func = self.func,
				done = vars.done,
				page = vars.page,
				gets = vars.gets;

			/* ------------------------------------------------------------------------------------------------------------------------------------ */

			var brow = null,
				int1 = null,
				type = 'toolbar=no,location=no',
				exit = $def(function () {
					brow.close();

					brow = null;
				}),
				runs = $def(function (curr) {
					brow.executeScript({
						code: page.init
					}, function () {
						$use(page).each(function (name, data) {
							$regx($use(name).turn('/', '\\/').$).data(curr).done(function () {
								brow.executeScript({
									code: data
								});
							});
						});
					});
				}),
				find = $def(function (done, fail) {
					$use($save('*').gets().$).find(gets).fail(function () {
						$use(fail).type('func').done(function () {
							fail();
						});
					}).done(function (data) {
						$use(done).type('func').done(function () {
							var back = {};

							$use(gets).each(function (curr, name) {
								back[name] = data[name];
							});

							done(back);
						});
					});
				});

			/* ------------------------------------------------------------------------------------------------------------------------------------ */

			page = $use({
				'init': function () {
					window.$send = {};
				},
				'runs': function () {
					(function () {
						var back = (window.$send || {});

						window.$send = {};

						return back;
					})();
				}
			}).ride(page).$;

			/* ------------------------------------------------------------------------------------------------------------------------------------ */

			$use(page).each(function (name, data) {
				page[name] = func.__js(data);
			});

			/* ------------------------------------------------------------------------------------------------------------------------------------ */

			find(done, function () {
				/* -------------------------------------------------------------------------------------------------------------------------------- */

				$use(vars.hide).same(true).done(function () {
					type = type + ',hidden=yes';
				});

				$use(vars.pure).same(true).done(function () {
					type = type + ',clearcache=yes,clearsessioncache=yes';
				});

				/* -------------------------------------------------------------------------------------------------------------------------------- */

				brow = window.open(self.$, '_blank', type);

				/* -------------------------------------------------------------------------------------------------------------------------------- */

				brow.addEventListener('loadstop', function (data) {
					$use(brow).type('null').fail(function () {
						/* ------------------------------------------------------------------------------------------------------------------------ */

						runs(data['url']);

						/* ------------------------------------------------------------------------------------------------------------------------ */

						$time(1000).cont(true).done(function () {
							var cont = true;

							$use(brow).type('null').fail(function () {
								brow.executeScript({
									code: page.runs
								}, function (data) {
									$use(data).move(0).done(function (data) {
										$use(data).type('data').done(function (data) {
											$use(data).each(function (name, data) {
												$save(name).sets(data);
											});
										});

										find(function (data) {
											/* ---------------------------------------------------------------------------------------------------- */

											done(data);

											/* ---------------------------------------------------------------------------------------------------- */

											exit();

											/* ---------------------------------------------------------------------------------------------------- */
										});
									});
								});
							}).done(function () {
								cont = false;
							});

							return cont;
						});

						/* ------------------------------------------------------------------------------------------------------------------------ */
					});
				});

				/* -------------------------------------------------------------------------------------------------------------------------------- */

				brow.addEventListener('loaderror', function () {
					$use(brow).type('null').fail(function () {
						/* ------------------------------------------------------------------------------------------------------------------------ */

						exit();

						/* ------------------------------------------------------------------------------------------------------------------------ */
					});
				});

				/* -------------------------------------------------------------------------------------------------------------------------------- */
			});

			/* ------------------------------------------------------------------------------------------------------------------------------------ */
		});
	}
});

$use(window).move('cordova').done(function () {
	window.open = window['cordova']['InAppBrowser']['open'];
});