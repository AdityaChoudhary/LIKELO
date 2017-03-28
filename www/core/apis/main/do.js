var _ = {
	JSON: {data: JSON.parse, char: JSON.stringify},
	find: function (name, data) {
		return name in data;
	},
	exec: function (exec, data) {
		return typeof exec === 'function' ? exec(data) : undefined;
	},
	size: function (data) {
		var back = 0;

		this.each(data, function () {
			back = back + 1;
		});

		return back;
	},
	each: function (data, exec) {
		for (var name in data) {
			if (data.hasOwnProperty(name)) {
				switch (exec(name, data[name])) {
					case false:
						return false;
						break;
				}
			}
		}
	},
	ride: function () {
		var self = this,
		    back = null,
		    args = arguments;

		switch (self.type(args[0])) {
			case 'sets':
				back = [];

				self.each(args, function (name, data) {
					self.each(data, function (name, curr) {
						back.push(curr);
					});
				});
				break;
			case 'data':
				back = {};

				self.each(args, function (name, data) {
					self.each(data, function (name, curr) {
						back[name] = curr;
					});
				});
				break;
		}

		return back;
	},
	type: function (data) {
		var back = 'char';

		switch (typeof data) {
			case 'string':
				back = 'char';
				break;
			case 'number':
				back = 'digi';
				break;
			case 'boolean':
				back = 'bool';
				break;
			case 'function':
				back = 'func';
				break;
			case 'undefined':
				back = 'nope';
				break;
			case 'object':
				back = data === null ? 'null' : (data instanceof Array ? 'sets' : 'data');
				break;
		}

		return back;
	}
};

window.$typ = function (data) {
	return _.type(data);
};

window.$arg = function (data) {
	return _.type(data) === 'sets' ? data : [data];
};

window.$del = function (name, data) {
	return delete name[data];
};

window.$def = function (data, defs) {
	return typeof data === 'undefined' ? defs : data;
};

window.$for = function (data, func, init) {
	for (var i = $def(init, 0); i < data; i++) {
		_.exec(func, (i + 1));
	}
};

window.$run = function (data, func) {
	var init;

	while (init = _.exec(data)) {
		_.exec(func, init);
	}
};

window.$use = function (data) {
	return _.ride($ore.main, $ore[_.type(data)], {
		$: data,
		_: true
	});
};

window.$ride = function () {
	return _.ride.apply(_, arguments);
};

window.$when = function (data) {
	return _.ride($ore.main, {
		$: data,
		bool: function (data) {
			return this.is(function (self) {
				var back = undefined,
				    done = false;

				_.each(data, function (part, func) {
					_.each(part.split('|'), function (keys, name) {
						switch (name) {
							case '0':
								switch (false == self.$) {
									case true:
										done = true;

										back = _.exec(func, self.$);
										break;
								}
								break;
							case '1':
								switch (true == self.$) {
									case true:
										done = true;

										back = _.exec(func, self.$);
										break;
								}
								break;
						}
					});

					return !done;
				});

				self.$ = back;

				self._ = done;
			});
		},
		same: function (data) {
			return this.is(function (self) {
				var back = undefined,
				    done = false;

				_.each(data, function (part, func) {
					_.each(part.split('|'), function (keys, name) {
						switch (name == self.$) {
							case true:
								done = true;

								back = _.exec(func, self.$);
								break;
						}
					});

					return !done;
				});

				self.$ = back;

				self._ = done;
			});
		},
		less: function (data) {
			return this.is(function (self) {
				var back = null,
				    done = false;

				_.each(data, function (name, func) {
					switch (name >= self.$) {
						case true:
							done = true;

							back = func;
							break;
					}

					return !done;
				});

				self._ = done;

				self.$ = _.exec(back, self.$);
			});
		},
		more: function (data) {
			return this.is(function (self) {
				var back = null,
				    done = false;

				_.each(data, function (name, func) {
					switch (name <= self.$) {
						case true:
							done = true;

							back = func;
							break;
					}

					return !done;
				});

				self._ = done;

				self.$ = _.exec(back, self.$);
			});
		}
	});
};

window.$gre = function (data) {
	var back = _.ride({}, $ore.main, {
		vars: {},
		func: {},
		$act: true
	}, data);

	$use(back).move('vars').type('data').each(function (name) {
		$use(back).prop(name, function (data) {
			var self = this;

			self.vars[name] = data;

			return self;
		});
	});

	$use(back).move('$act').type('func').done(function () {
		$use(['fail', 'done']).each(function (curr, name) {
			back.vars[name] = function () {
				return this;
			};

			back[name] = function (func) {
				var self = this;

				self.vars[name] = func;

				return name === 'done' ? self.$act() : self;
			};
		});
	});

	return function (data) {
		return _.ride(back, {
			$: data,
			_: true,
			vars: _.ride(back.vars)
		});
	};
};

window.$ore = {
	main: {
		$: null,
		_: true,
		is: function (func, bool) {
			var self = this;

			switch ($def(bool, true) === self._) {
				case true:
					_.exec(func, self);
					break;
			}

			return self;
		},
		done: function (func) {
			return this.is(function (self) {
				_.exec(func, self.$);
			});
		},
		fail: function (func) {
			return this.is(function (self) {
				_.exec(func, self.$);
			}, false);
		},
		type: function (data) {
			return this.is(function (self) {
				var back = false;

				switch (data) {
					case 'unit':
						data = ['char', 'digi'];
						break;
					case 'pack':
						data = ['sets', 'data'];
						break;
				}

				_.each($arg(data), function (curr, type) {
					back = _.type(self.$) === type ? true : back;
				});

				self._ = back;
			});
		}
	},
	glob: {
		same: function (data) {
			return this.is(function (self) {
				self._ = self.$ === data;
			});
		},
		size: function () {
			return this.is(function (self) {
				self.$ = _.size(self.$);

				self._ = self.$ > 0;
			});
		}
	},
	data: {
		each: function (exec) {
			return this.is(function (self) {
				_.each(self.$, exec);
			});
		},
		ride: function (data) {
			return this.is(function (self) {
				self.$ = _.ride(self.$, data);
			});
		},
		find: function (data) {
			return this.is(function (self) {
				_.each($arg(data), function (curr, find) {
					self._ = _.find(find, self.$) ? self._ : false;
				});
			});
		},
		move: function (data) {
			return this.is(function (self) {
				_.find(data, self.$) ? self.$ = self.$[data] : self._ = false;
			});
		}
	}
};

$ore = _.ride($ore, {
	bool: {
		same: $ore.glob.same
	},
	null: {
		same: $ore.glob.same
	},
	func: {
		exec: function (data) {
			return this.is(function (self) {
				self.$ = _.exec(self.$, data);
			});
		}
	},
	char: {
		same: $ore.glob.same,
		size: $ore.glob.size,
		find: function (data) {
			return this.is(function (self) {
				self._ = new RegExp(data, 'gi').test(self.$);
			});
		},
		turn: function (name, data) {
			return this.is(function (self) {
				self.$ = self.$.replace(new RegExp(name, 'gi'), data);
			});
		}
	},
	digi: {
		same: $ore.glob.same,
		less: function (data, same) {
			return this.is(function (self) {
				self._ = same ? self.$ <= data : self.$ < data;
			});
		},
		more: function (data, same) {
			return this.is(function (self) {
				self._ = same ? self.$ >= data : self.$ > data;
			});
		},
		adds: function (data) {
			return this.is(function (self) {
				self.$ = self.$ + data;
			});
		},
		subs: function (data) {
			return this.is(function (self) {
				self.$ = self.$ - data;
			});
		},
		mult: function (data) {
			return this.is(function (self) {
				self.$ = self.$ * data;
			});
		},
		divs: function (data) {
			return this.is(function (self) {
				self.$ = self.$ / data;
			});
		}
	},
	sets: {
		size: $ore.glob.size,
		each: $ore.data.each,
		find: $ore.data.find,
		move: $ore.data.move,
		ride: $ore.data.ride,
		prop: function (name) {
			return this.is(function (self) {
				self.$.push(name);
			});
		},
		drop: function (name) {
			return this.is(function (self) {
				self.$.splice(name, 1);
			});
		}
	},
	data: {
		size: $ore.glob.size,
		each: $ore.data.each,
		find: $ore.data.find,
		move: $ore.data.move,
		ride: $ore.data.ride,
		prop: function (name, data) {
			return this.is(function (self) {
				self.$[name] = data;
			});
		},
		drop: function (name) {
			return this.is(function (self) {
				$del(self.$, name);
			});
		}
	}
});

window.$sign = $def(function () {
	console.log.apply(console, arguments);
});

window.$json = $gre({
	data: function () {
		return this.is(function (self) {
			self.$ = _.JSON.data(self.$);
		});
	},
	char: function (data) {
		return this.is(function (self) {
			self.$ = _.JSON.char(self.$, null, data);
		});
	}
});

window.$sets = $gre({
	join: function (data) {
		return this.is(function (self) {
			self.$ = self.$.join(data);
		});
	}
});

window.$char = $gre({
	part: function (from, size) {
		return this.is(function (self) {
			self.$ = self.$.substr((from - 1), size);
		});
	},
	tear: function (data) {
		return this.is(function (self) {
			self.$ = self.$.split(new RegExp(data, 'gi'));
		});
	},
	have: function (data) {
		return this.is(function (self) {
			self.$ = $use(self.$.split(new RegExp(data, 'gi'))).size().$ - 1;

			self._ = self.$ > 0;
		});
	}
});

window.$regx = $gre({
	vars: {
		uniq: false,
		pure: false
	},
	enco: function () {
		return this.is(function (self) {
			self.$ = self.$.replace(/[.?*+^$[\]\\(){}|-]/gi, '\\$&');
		});
	},
	data: function (data) {
		return this.is(function (self) {
			var vars = self.vars,
			    back = [],
			    regx = new RegExp(self.$, 'gi');

			$run(function () {
				return regx.exec(data);
			}, function (data) {
				$use(back).prop(data);
			});

			$use(back).size().fail(function () {
				self._ = false;
			}).done(function () {
				$use(vars.pure).same(true).done(function () {
					$use(back).each(function (curr) {
						$del(back[curr], 'index');
						$del(back[curr], 'input');
					});
				});

				$use(vars.uniq).same(true).fail(function () {
					self.$ = back;
				}).done(function () {
					self.$ = back[0];
				});
			});
		});
	}
});

window.$turn = $gre({
	char: function () {
		return this.is(function (self) {
			self.$ = '' + self.$;
		});
	},
	digi: function () {
		return this.is(function (self) {
			self.$ = parseFloat(self.$);
		});
	},
	uc: function () {
		return this.is(function (self) {
			self.$ = self.$.toUpperCase();
		});
	},
	lc: function () {
		return this.is(function (self) {
			self.$ = self.$.toLowerCase();
		});
	},
	uf: function () {
		return this.is(function (self) {
			self.$ = self.$.charAt(0).toUpperCase() + self.$.slice(1);
		});
	},
	lf: function () {
		return this.is(function (self) {
			self.$ = self.$.charAt(0).toLowerCase() + self.$.slice(1);
		});
	}
});

window.$time = $gre({
	vars: {
		cont: false
	},
	curr: function (data) {
		return this.is(function (self) {
			self.$ = parseInt(new Date().getTime() / data === true ? 1 : 1000);
		});
	},
	$act: function () {
		return this.is(function (self) {
			var vars = self.vars,
			    cont = vars.cont,
			    done = vars.done,
			    type = cont === true ? 'setInterval' : 'setTimeout',
			    ends = cont === true ? 'clearInterval' : 'clearTimeout';

			self.$ = window[type](function () {
				done() === false ? window[ends](self.$) : '';
			}, self.$);
		});
	}
});

window.$rand = $gre({
	digi: function (data) {
		return this.is(function (self) {
			self.$ = Math.floor(Math.random() * (data - self.$ + 1)) + self.$;
		});
	},
	sets: function () {
		return this.is(function (self) {
			self.$ = self.$[Math.floor(Math.random() * $use(self.$).size().$)];
		});
	},
	char: function (data) {
		return this.is(function (self) {
			var back = '',
			    area = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',
			    char = $def(self.$, area).split('');

			$for(data, function () {
				back = back + char[(Math.floor(Math.random() * $use(char).size().$))];
			});

			self.$ = back;
		});
	}
});

window.$html = $gre({
	deco: function (data) {
		return this.is(function (self) {
			self.$ = self.$.replace(/&amp;/gi, '&');
		});
	},
	enco: function (data) {
		return this.is(function (self) {
			self.$ = self.$.replace(/[\u00A0-\u9999<>&]/gi, function (data) {
				return '&#' + data.charCodeAt(0) + ';';
			});
		});
	}
});

window.$push = function (data) {
	alert(JSON.stringify(data));
};
