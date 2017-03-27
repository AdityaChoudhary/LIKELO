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

			$use($char(data).tear('\r\n').$).each(function (curr, data) {
				data = $char(data).tear(': ').$;

				$use(data[1]).type('nope').fail(function () {
					back[data[0]] = data[1];
				});
			});

			return back;
		},
		take: function (data) {
			var back = {
				code: data.code,
				head: {},
				sess: {}
			};

			$use(data.head).each(function (name, data) {
				name = $turn(name).lc().$;

				back.head[name] = data;

				$use(name).same('set-cookie').done(function () {
					data = $use(data).turn('(path|domain|expires|Max-Age)=(.*?);', '').$;

					$regx('([a-zA-Z0-9_-]*)=(.*?);').data(data).done(function (data) {
						$use(data).each(function (curr, data) {
							$use(data[2]).same('deleted').fail(function () {
								back.sess[data[1]] = data[2];
							}).done(function () {
								back.sess[data[1]] = null;
							});
						});
					});
				});
			});

			return back;
		},
		core: function (data) {
			var back = {
				host: data.host,
				port: data.port,
				path: data.path,
				send: '',
				headers: {}
			};

			$use(data.time).same(0).fail(function () {
				back.timeout = data.time;
			});

			$use(data.auth).same('').fail(function () {
				back.auth = data.auth;
			});

			$use(data.from).same('').fail(function () {
				back.localAddress = data.from;

				$use(data.from).find(':').fail(function () {
					back.family = '4';
				}).done(function () {
					back.family = '6';
				});
			});

			$when(data.type).same({
				'gets': function () {
					/* ---------------------------------------------------------------------------------------------- */

					back.method = 'GET';

					/* ---------------------------------------------------------------------------------------------- */

					var quer = $path($use(data.args).ride(data.data).$).form('enco').$;

					$use(quer).size().done(function () {
						back.path = back.path + '?' + quer;
					});

					/* ---------------------------------------------------------------------------------------------- */
				},
				'post': function () {
					/* ---------------------------------------------------------------------------------------------- */

					back.method = 'POST';

					/* ---------------------------------------------------------------------------------------------- */

					$use(data.quer).size().done(function () {
						back.path = back.path + '?' + data.quer;
					});

					/* ---------------------------------------------------------------------------------------------- */

					back.send = $path(data.data).form('enco').$;

					/* ---------------------------------------------------------------------------------------------- */

					back.headers = $use(back.headers).ride({
						'content-type': 'application/x-www-form-urlencoded'
					}).$;

					/* ---------------------------------------------------------------------------------------------- */
				}
			});

			$use(data.head).each(function (name, data) {
				$use(data).type('null').fail(function () {
					$when(name).same({
						'type': function () {
							back.headers['accept'] = data;
						},
						'orig': function () {
							back.headers['origin'] = data;
						},
						'sess': function () {
							back.headers['cookie'] = data;
						},
						'refs': function () {
							back.headers['referer'] = data;
						},
						'doer': function () {
							back.headers['user-agent'] = data;
						},
						'cach': function () {
							back.headers['cache-control'] = data;
						},
						'lang': function () {
							back.headers['accept-language'] = data;
						},
						'enco': function () {
							back.headers['accept-encoding'] = data;
						}
					}).fail(function () {
						back.headers[name] = data;
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

			var reqs = new XMLHttpRequest(),
				prep = $def(function (data) {
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

					alert(JSON.stringify(data.head));

					/* -------------------------------------------------------------------------------------------------- */

					alert(JSON.stringify(resp.sess));

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

			reqs.onreadystatechange = function () {
				switch (reqs.readyState) {
					case 4:
						prep({
							code: reqs.status,
							resp: reqs.responseText,
							head: func.head_deco(reqs.getAllResponseHeaders())
						});
						break;
				}
			};

			$when(vars.type).same({
				'gets|post': function (data) {
					$when(vars.type).same({
						'gets': function () {
							reqs.open('GET', self.$, true);
						},
						'post': function () {
							reqs.open('POST', self.$, true);
						}
					});

					$use(opts.headers).each(function (name, data) {
						reqs.setRequestHeader(name, data);
					});

					reqs.onerror = function (data) {
						nope(data);
					};

					$use(data).same('post').fail(function () {
						reqs.send(null);
					}).done(function () {
						reqs.send(opts.send);
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