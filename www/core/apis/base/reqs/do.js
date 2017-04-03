window.$reqs = $gre({
	vars: {
		type: 'gets',
		kind: 'text',
		data: {},
		head: {},
		sess: {},
		time: 0,
		from: '',
		prox: '',
		auth: '',
		reds: false,
		save: false,
		ante: function () {
			return null;
		},
		nope: function () {
			return null;
		}
	},
	func: {
		pure: function (data) {
			var back = {};

			$use(data).each(function (name, data) {
				$use(data).type('null').fail(function () {
					back[name] = data;
				});
			});

			return back;
		},
		sess_enco: function (data) {
			var back = [];

			$use(data).each(function (name, data) {
				$use(back).prop(name + '=' + data);
			});

			back = $sets(back).join('; ').$;

			return back;
		},
		sess_deco: function (data) {
			var back = {};

			$use($char(data).tear('; ').$).each(function (curr, data) {
				data = $char(data).tear('=').$;

				$use(data[1]).type('nope').fail(function () {
					back[data[0]] = data[1];
				});
			});

			return back;
		},
		head_deco: function (data) {
			var back = {};

			$use($char(data).tear('\n').$).each(function (curr, data) {
				data = $char(data).tear(': ').$;

				$use(data[1]).type('nope').fail(function () {
					$when($turn(data[0]).lc().$).same({
						'set-cookie': function () {
							back[data[0]] = $use($def(back[data[0]], [])).prop(data[1]).$;
						}
					}).fail(function () {
						back[data[0]] = data[1];
					});
				});
			});

			return back;
		},
		take: function (data) {
			var head = data.head,
				sess = $def(head['set-cookie'], {}),
				back = {
					code: data.code,
					head: head,
					sess: {}
				};

			$use(sess).each(function (curr, data) {
				$regx('^(.*?)=(.*?);').data(data).done(function (data) {
					$use(data).move(0).done(function (sess) {
						var name = '',
							data = '';

						$use(sess).move(1).done(function (char) {
							name = char;
						});

						$use(sess).move(2).done(function (char) {
							data = char;
						});

						$use(data).same('deleted').fail(function () {
							back.sess[name] = data;
						}).done(function () {
							back.sess[name] = null;
						});
					});
				});
			});

			return back;
		},
		core: function (data) {
			var back = {
				type: 'GET',
				head: {},
				body: ''
			};

			$when(data.type).same({
				'gets': function () {
					/* ---------------------------------------------------------------------------------------------- */

					back.type = 'GET';

					/* ---------------------------------------------------------------------------------------------- */

					back.body = $path($use(data.args).ride(data.data).$).form('enco').$;

					/* ---------------------------------------------------------------------------------------------- */
				},
				'post': function () {
					/* ---------------------------------------------------------------------------------------------- */

					back.type = 'POST';

					/* ---------------------------------------------------------------------------------------------- */

					back.body = $path(data.data).form('enco').$;

					/* ---------------------------------------------------------------------------------------------- */

					back.head = $use(back.head).ride({
						'content-type': 'application/x-www-form-urlencoded'
					}).$;

					/* ---------------------------------------------------------------------------------------------- */
				}
			});

			$use(data.head).each(function (name, data) {
				$use(data).type('null').fail(function () {
					$when(name).same({
						'type': function () {
							back.head['accept'] = data;
						},
						'orig': function () {
							back.head['origin'] = data;
						},
						'sess': function () {
							back.head['cookie'] = data;
						},
						'refs': function () {
							back.head['referer'] = data;
						},
						'doer': function () {
							back.head['user-agent'] = data;
						},
						'cach': function () {
							back.head['cache-control'] = data;
						},
						'lang': function () {
							back.head['accept-language'] = data;
						},
						'enco': function () {
							back.head['accept-encoding'] = data;
						}
					}).fail(function () {
						back.head[name] = data;
					});
				});
			});

			return back;
		}
	},
	ride: function (data) {
		return this.is(function (self) {
			var vars = self.vars;

			$use(self.vars).each(function (name) {
				$use(data).move(name).done(function (data) {
					$use(vars[name]).type('pack').fail(function () {
						vars[name] = data;
					}).done(function () {
						vars[name] = $ride(vars[name], data);
					});
				});
			});
		});
	},
	$act: function () {
		return this.is(function (self) {
			var vars = self.vars,
				func = self.func,
				ante = vars.ante,
				nope = vars.nope,
				fail = vars.fail,
				done = vars.done,
				core = $use($path(self.$).core().$).ride({
					type: vars.type,
					kind: vars.kind,
					data: vars.data,
					auth: vars.auth,
					head: vars.head,
					sess: vars.sess,
					from: vars.from,
					time: vars.time
				}).$;

			/* ------------------------------------------------------------------------------------------------------ */

			core.head = func.pure(core.head); // TODO : MODIFY HEAD WHEN RIDE

			/* ------------------------------------------------------------------------------------------------------ */

			$use(core.head).move('sess').done(function (data) {
				core.sess = $use(func.sess_deco(data)).ride(core.sess).$;
			});

			/* ------------------------------------------------------------------------------------------------------ */

			core.sess = func.pure(core.sess);

			/* ------------------------------------------------------------------------------------------------------ */

			$use(core.sess).size().done(function () {
				core.head['sess'] = func.sess_enco(core.sess);
			});

			/* ------------------------------------------------------------------------------------------------------ */

			var opts = func.core(core);

			/* ------------------------------------------------------------------------------------------------------ */

			var prep = $def(function (data) {
				var resp = func.take(data),
					back = {
						ride: {},
						data: data.resp,
						meta: {
							path: self.$,
							code: resp.code,
							head: resp.head,
							sess: resp.sess
						}
					};

				/* -------------------------------------------------------------------------------------------------- */

				$use(vars.save).same(true).done(function () {
					/* ---------------------------------------------------------------------------------------------- */

					$use([
						'head',
						'sess',
						'time',
						'from',
						'prox',
						'auth',
						'reds',
						'save',
						'ante',
						'nope'
					]).each(function (curr, name) {
						back.ride[name] = vars[name];
					});

					/* ---------------------------------------------------------------------------------------------- */

					back.ride.head = core.head;

					/* ---------------------------------------------------------------------------------------------- */

					back.ride.head = func.pure($use(back.ride.head).ride({refs: self.$}).$);

					/* ---------------------------------------------------------------------------------------------- */

					back.ride.sess = func.pure($use(core.sess).ride(back.ride.sess).ride(back.meta.sess).$);

					/* ---------------------------------------------------------------------------------------------- */
				});

				/* -------------------------------------------------------------------------------------------------- */

				ante(back);

				/* ---------------------------------------------------------------------------------------------- */

				$when(resp.code).same({
					'200|304': function () {
						$when(core.kind).same({
							'json': function () {
								back.data = $json(back.data).data().$;
							}
						});

						done(back);
					},
					'302': function () {
						$use(vars.reds).same(true).fail(function () {
							fail(back);
						}).done(function () {
							$use(resp.head).move('location').fail(function () {
								fail(back);
							}).done(function (data) {
								self.$ = data;

								self.ride($use(back.ride).ride({
									type: 'gets',
									kind: 'text',
									data: {}
								}).$).$act();
							});
						});
					}
				}).fail(function () {
					fail(back);
				});

				/* ---------------------------------------------------------------------------------------------- */
			});

			$when(vars.type).same({
				'gets|post': function (data) {
					var path = self.$,
						pass = {
							method: opts.type,
							headers: opts.head
						};

					$when(vars.type).same({
						'gets': function () {
							$use(opts.body).same('').fail(function () {
								path = path + '?' + opts.body;
							});
						},
						'post': function () {
							pass.body = opts.body;
						}
					});

					window['reqs'](path, pass).then(function (resp) {
						prep({
							code: resp.status,
							resp: resp.responseText,
							head: func.head_deco(resp.getAllResponseHeaders())
						});
					}).catch(function (data) {
						fail(data);
					});
				}
			});
		});
	},
	seqs: function (data) {
		return this.is(function () {
			/* ------------------------------------------------------------------------------------------------------ */

			var next = $def(function (name) {
				var reqs = {};

				$use(data[name](next)).each(function (name, data) {
					$when(name).same({
						'path': function () {
							reqs = $reqs(data);
						}
					}).fail(function () {
						reqs = reqs[name](data);
					});
				});

				return reqs;
			});

			/* ------------------------------------------------------------------------------------------------------ */

			next(1);

			/* ------------------------------------------------------------------------------------------------------ */
		});
	}
});