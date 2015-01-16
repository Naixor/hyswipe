(function(window, navigator, document, $) {
	function getValue(str) {
		return parseInt(/\d+/.exec(str)[0]);
	}
	var getPx = function (value) {
		return (value+"px").toString();
	}
	var TouchEvent = (function(navigator, $) {
		var _touch = isNotPC(),
			Start = "touchstart",
			End = "touchend",
			Move = "touchmove",
			Cancel = "touchcancel",
			mainDiv,
			TouchHandler = {};

		function isNotPC() {
			var userAgentInfo = navigator.userAgent;
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var flag = false;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = true;
					break;
				}
			}
			return flag;
		};

		function fixTouch(e) {
			var touch = e.touches[0];
			var winPageX = window.pageXOffset,
				winPageY = window.pageYOffset,
				x = touch.clientX,
				y = touch.clientY;

			if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
				touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
				x = x - winPageX;
				y = y - winPageY;
			} else if (y < (touch.pageY - winPageY) || x < (touch.pageX - winPageX)) {
				x = touch.pageX - winPageX;
				y = touch.pageY - winPageY;
			}
			return $.extend(touch, {
				clientX: x,
				clientY: y,
				type: "",
				preventDefault: e.preventDefault
			});
		};

		function init() {
			var x1, x2, y1, y2;
			var $touch;
			var isMove = false;

			mainDiv.addEventListener(Start, function(e) {
				e = window.event || e;
				// e.preventDefault();
				$touch = fixTouch(e);

				x1 = $touch.clientX;
				y1 = $touch.clientY;

				TouchHandler["start"] && TouchHandler["start"].call(mainDiv, $touch);
			}, false);

			mainDiv.addEventListener(Move, function(e) {
				e = window.event || e;
				// e.preventDefault();

				$touch = fixTouch(e);
				x2 = $touch.clientX;
				y2 = $touch.clientY;

				isMove = true;

				$touch["type"] = "TouchMove";
				TouchHandler["move"] && TouchHandler["move"].call(mainDiv, $touch);
			}, false);

			mainDiv.addEventListener(End, function(e) {
				TouchHandler["end"] && TouchHandler["end"].call(mainDiv, $touch);

				if (TouchHandler["right"] || TouchHandler["left"] || TouchHandler["up"] || TouchHandler["down"] || TouchHandler["tap"]) {
					return;
				}

				if (Math.abs(x1 - x2) < 50 && Math.abs(y1 - y2) < 50) {
					isMove = false;
				}

				if (isMove) {
					if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
						//left or right
						if ((x1 - x2) < -100) { //right
							isMove = false;

							$touch["type"] = "TouchRight";

							TouchHandler["right"] && TouchHandler["right"].call(mainDiv, $touch);
						} else if ((x1 - x2) > 100) { //left
							isMove = false;

							$touch["type"] = "TouchLeft";
							TouchHandler["left"] && TouchHandler["left"].call(mainDiv, $touch);
						}
					} else {
						// up or down
						if (y1 - y2 > 100) { //up
							isMove = false;

							$touch["type"] = "TouchUp";
							TouchHandler["up"] && TouchHandler["up"].call(mainDiv, $touch);
						} else if (y1 - y2 < -100) { //down
							isMove = false;

							$touch["type"] = "TouchDown";
							TouchHandler["down"] && TouchHandler["down"].call(mainDiv, $touch);
						}
					}
				} else {
					$touch["type"] = "TouchTap";
					TouchHandler["tap"] && TouchHandler["tap"].call(mainDiv, $touch);
				}
			}, false);

			mainDiv.addEventListener(Cancel, function(e) {
				$touch["type"] = "TouchCancel";
				TouchHandler["cancel"] && TouchHandler["cancel"].call(mainDiv, $touch);
			});
		}
		return {
			bindElement: function(ele) {
				mainDiv = ele;
				init();
				return this;
			},
			registerHandler: function(type, func) {
				TouchHandler[type] = func;
				return this;
			},
			touchStart: function(func) {
				return this.registerHandler("start", func);
			},
			touchMove: function(func) {
				return this.registerHandler("move", func);
			},
			touchEnd: function(func) {
				return this.registerHandler("end", func);
			},
			touchRight: function(func) {
				return this.registerHandler("right", func);
			},
			touchLeft: function(func) {
				return this.registerHandler("left", func);
			},
			touchUp: function(func) {
				return this.registerHandler("up", func);
			},
			touchDown: function(func) {
				return this.registerHandler("down", func);
			},
			tap: function(func) {
				return this.registerHandler("tap", func);
			}
		}
	})(navigator, $);

	var TouchEvent = (function(navigator) {
		var Start = "touchstart",
			End = "touchend",
			Move = "touchmove",
			mainDiv,
			TouchHandler = {};

		function fixTouch(e) {
			var touch = e.touches[0];
			var winPageX = window.pageXOffset,
				winPageY = window.pageYOffset,
				x = touch.clientX,
				y = touch.clientY;

			if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
				touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
				x = x - winPageX;
				y = y - winPageY;
			} else if (y < (touch.pageY - winPageY) || x < (touch.pageX - winPageX)) {
				x = touch.pageX - winPageX;
				y = touch.pageY - winPageY;
			}
			return $.extend(touch, {
				clientX: x,
				clientY: y,
				type: "",
				preventDefault: e.preventDefault
			});
		};

		function init() {
			var x1, x2, y1, y2;
			var $touch;
			var isMove = false;

			mainDiv.addEventListener(Start, function(e) {
				e = window.event || e;
				e.preventDefault();
				$touch = fixTouch(e);

				x1 = $touch.clientX;
				y1 = $touch.clientY;

				TouchHandler["start"] && TouchHandler["start"].call(mainDiv, e);
			});

			mainDiv.addEventListener(Move, function(e) {
				e = window.event || e;
				// e.preventDefault();

				var touch = fixTouch(e);
				x2 = touch.clientX;
				y2 = touch.clientY;

				isMove = true;

				$touch["type"] = "TouchMove";
				TouchHandler["move"] && TouchHandler["move"].call(mainDiv, $touch);
			});

			mainDiv.addEventListener(End, function(e) {
				if (Math.abs(x1 - x2) < 50 && Math.abs(y1 - y2) < 50) {
					isMove = false;
				}

				if (isMove) {
					if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
						//left or right
						if ((x1 - x2) < -100) { //right
							isMove = false;

							$touch["type"] = "TouchRight";

							TouchHandler["right"] && TouchHandler["right"].call(mainDiv, $touch);
						} else if ((x1 - x2) > 100) { //left
							isMove = false;

							$touch["type"] = "TouchLeft";
							TouchHandler["left"] && TouchHandler["left"].call(mainDiv, $touch);
						}
					} else {
						// up or down
						if (y1 - y2 > 100) { //up
							isMove = false;

							$touch["type"] = "TouchUp";
							TouchHandler["up"] && TouchHandler["up"].call(mainDiv, $touch);
						} else if (y1 - y2 < -100) { //down
							isMove = false;

							$touch["type"] = "TouchDown";
							TouchHandler["down"] && TouchHandler["down"].call(mainDiv, $touch);
						}
					}
				} else {
					$touch["type"] = "TouchTap";
					TouchHandler["tap"] && TouchHandler["tap"].call(mainDiv, $touch);
				}
			});
		}
		return {
			bindElement: function(ele) {
				mainDiv = ele;
				init();
				return this;
			},
			registerHandler: function(type, func) {
				TouchHandler[type] = func;
				return this;
			},
			touchRight: function(func) {
				return this.registerHandler("right", func);
			},
			touchLeft: function(func) {
				return this.registerHandler("left", func);
			},
			touchUp: function(func) {
				return this.registerHandler("up", func);
			},
			touchDown: function(func) {
				return this.registerHandler("down", func);
			},
			tap: function(func) {
				return this.registerHandler("tap", func);
			}
		}
	})(navigator);
/*
 * VirticalSwitch1(String, {switchIndex: Number | undefined( 0 ), moveTime: Number | undefined( 1 ), shake: Number | undefined( 0.3 )})
 */ 
	var VerticalSwitch1 = function (ele, config){
		var back = ele,
			childrenDiv = back.getElementsByClassName("main"),
			_config = $.extend({
				switchIndex: 0,
				moveTime: 1,
				shake: 0.3
			}, config),
			nowSwitchIndex = _config.switchIndex;

			$.extend(back.style, {
				overflow: "visible",
				webkitTransform: "translate3d(0,"+(-1)*nowSwitchIndex*100+"%,0)",
				webkitTransition: "all "+_config.moveTime+"s cubic-bezier(.36,.84,.36,.84)"
			});

		var _switchIndex = function (index, callback) {
			var length = childrenDiv.length
			if (index >= length) {
				nowSwitchIndex = length-1;
				return;
			}else if(index < 0){
				nowSwitchIndex = 0;
				return;
			}
			nowSwitchIndex = index;				
			back.style.webkitTransform = "translate3d(0,"+(-1)*nowSwitchIndex*100+"%,0)";
			if (callback != undefined && callback instanceof Function) {
				callback(nowSwitchIndex);
			};
		}
		_switchIndex(nowSwitchIndex);
		return {
			switchIndex: function(index, callback) {
				_switchIndex(index, callback);
			},
			switchNext: function(callback){
				_switchIndex(nowSwitchIndex+1, callback);
			},
			switchPrev: function(callback){
				_switchIndex(nowSwitchIndex-1, callback);
			}
		}
	};

	var RotateSwitch = function (ele,config) {
		var back = ele,
			childrenDiv = back.getElementsByClassName("rotateMain"),
			_config = $.extend({
				intervalRotate: 45,
				switchIndex: 0,
				rotateRadius: getValue(GetCurrentStyle(document.querySelector(".container"), "height")),
				rotateTime: 1,
				shake: 0.3
			}, config),
			nowSwitchIndex = _config.switchIndex,
			lastSwitchIndex,
			backDiv = {
				width: getValue(GetCurrentStyle(back, "width")),
				height: getValue(GetCurrentStyle(back, "width")),
				cx: getValue(GetCurrentStyle(back, "width"))/2,
				cy: _config.rotateRadius
			};

		var deg = function (rotate) {
			return Math.PI*rotate / 180;
		}

		for (var i = 0, l = childrenDiv.length; i < l; i++) {
			var ir = _config.intervalRotate*i,
				H = window.screen.availHeight,
				R = _config.rotateRadius;
			$.extend(childrenDiv[i].style, {
				opacity: "0",
				top: getPx((R-H/2) * (1-Math.cos(deg(ir))) - R+backDiv.cx),
				left: getPx((R-H/2) * Math.sin(deg(ir))),
				height: getPx(H),
				webkitTransition: "opacity "+_config.rotateTime+"s cubic-bezier(.36,.84,.36,.84)",
				webkitTransform: "rotate("+ir+"deg)" 
			});
		};

		$.extend(back.style, {
			top: getPx(backDiv.cy - backDiv.height/2),
			left: "0px",
			width: getPx(backDiv.width),
			height: getPx(backDiv.height),
			overflow: "visible",
			webkitTransition: "-webkit-transform "+_config.rotateTime+"s cubic-bezier(.36,.84,.36,.84)"
		});


		return {
			nowIndex: function(){
				return nowSwitchIndex;
			},
			switchIndex: function (index, callback) {
				if (index >= childrenDiv.length) {
					nowSwitchIndex = childrenDiv.length - 1;
					// to do
					setTimeout(function(){
						$.extend(back.style, {
							webkitTransform: "rotate("+(-1)*(nowSwitchIndex+_config.shake)*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*500);
					setTimeout(function(){
						$.extend(back.style, {
							webkitTransform: "rotate("+(-1)*nowSwitchIndex*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*1000);
					return;
				}else if (index < 0) {
					nowSwitchIndex = 0;
					//to do
					setTimeout(function(){
						$.extend(back.style, {
							webkitTransform: "rotate("+(-1)*(nowSwitchIndex-_config.shake)*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*500);
					setTimeout(function(){
						$.extend(back.style, {
							webkitTransform: "rotate("+(-1)*nowSwitchIndex*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*1000);
					return;
				}
				nowSwitchIndex = index;
				if (lastSwitchIndex!=undefined) {
					childrenDiv[lastSwitchIndex].style.opacity = "0";
				};
				childrenDiv[nowSwitchIndex].style.opacity = "1";
				lastSwitchIndex = nowSwitchIndex;					
				back.style.webkitTransform = "rotate("+(-1)*nowSwitchIndex*_config.intervalRotate+"deg)"
			
				if (callback != undefined && callback instanceof Function) {
					setTimeout(function(){
						callback(nowSwitchIndex);
					}, _config.rotateTime*1000);
				};
			},
			switchNext: function(callback){
				this.switchIndex(nowSwitchIndex+1, callback);
			},
			switchPrev: function(callback){
				this.switchIndex(nowSwitchIndex-1, callback);
			}
		}
	};
/*
 * VirticalSwitch2(String, {dur: Number | undefined( 0.75s ), perspective: Number | undefined( 500 ), callback: Function | undefined})
 **/ 
	var VirticalSwitch2 = function(ele, opt) {
		var nowIndex = 0,
			root = $(ele),
			verChildren = root.children('.main'),
			maxIndex = verChildren.length - 1,
			touchStartY = 0,
			d = 0,
			containerHeight = getValue(getComputedStyle(document.body)["height"]);

		var _opt = {
			dur: opt.dur || 0.75,
			callback: opt.callback || function() {},
			perspective: opt.perspective || 500
		}

		root.css({
			position: 'absolute',
			width: '100%',
			height: '100%',
			top: '0',
			left: '0',
			overflowY: 'visible',
			perspective: _opt.perspective
		});

		verChildren.each(function(index, val) {
			var top = -100,
				zIndex = 100;
			if (nowIndex !== index) {
				top = 0;
				zIndex = -100;
			};
			$(this).css({
				position: "absolute",
				width: "100%",
				height: "100%",
				top: "100%",
				webkitTransform: "translate3d(0," + top + "%,0)",
				overflow: "hidden"
			});
		});

		TouchEvent.bindElement(document.querySelector(".vertical")).touchStart(function(event) {
			touchStartY = event.clientY;
		}).touchMove(function(event) {
			d = event.clientY - touchStartY;
			//d > 0 : down 
			//d < 0 : up
			if (d < 0) {
				if (nowIndex !== maxIndex) {
					verChildren.eq(nowIndex).css({
						opacity: 1 + d / containerHeight,
						transform: "translate3d(0,-100%," + (d / containerHeight) * _opt.perspective + "px)",
						transition: "none"
					});
					verChildren.eq(nowIndex + 1).css({
						transform: "translate3d(0," + d / containerHeight * 100 + "%,0)",
						transition: "none"
					});
				};
			} else if (d > 0 && nowIndex != maxIndex) {
				if (nowIndex !== 0) {
					verChildren.eq(nowIndex - 1).css({
						opacity: d / containerHeight,
						transform: "translate3d(0,-100%," + (d / containerHeight - 1) * _opt.perspective + "px)",
						transition: "none"
					});
					verChildren.eq(nowIndex).css({
						transform: "translate3d(0," + (d / containerHeight - 1) * 100 + "%,0)",
						transition: "none"
					});
				};
			}
			// console.log("D", -d);
		}).touchEnd(function(event) {
			if (d === 0) {
				return;
			};

			var direction = (d < 0) ? "up" : "down",
				time = _opt.dur * (1 - Math.abs(d) / containerHeight);

			if (Math.abs(d) > 100) {
				switch (direction) {
					case "up":
						{
							if (nowIndex === maxIndex) {
								return;
							};
							verChildren.eq(nowIndex).css({
								opacity: 0,
								transform: "translate3d(0,-100%,-" + _opt.perspective + "px)",
								transition: "all " + time + "s linear"
							});

							verChildren.eq(nowIndex + 1).css({
								transform: "translate3d(0,-100%,0)",
								transition: "all " + time + "s linear"
							});
							nowIndex++;
							break;
						}
					case "down":
						{
							if (nowIndex === 0) {
								return;
							};
							verChildren.eq(nowIndex - 1).css({
								opacity: 1,
								transform: "translate3d(0,-100%,0)",
								transition: "all " + time + "s linear"
							});

							verChildren.eq(nowIndex).css({
								transform: "translate3d(0,0,0)",
								transition: "all " + time + "s linear"
							});
							nowIndex--;
							break;
						}
				}
			} else {
				switch (direction) {
					case "up":
						{
							if (nowIndex === maxIndex) {
								return;
							};
							verChildren.eq(nowIndex).css({
								opacity: 1,
								transform: "translate3d(0,-100%,0)",
								transition: "all .35s linear"
							});

							verChildren.eq(nowIndex + 1).css({
								transform: "translate3d(0,0,0)",
								transition: "all .35s linear"
							});
							break;
						}
					case "down":
						{
							if (nowIndex === 0) {
								return;
							};
							verChildren.eq(nowIndex - 1).css({
								opacity: 0,
								transform: "translate3d(0,-100%,-" + _opt.perspective + "px)",
								transition: "all .35s linear"
							});

							verChildren.eq(nowIndex).css({
								transform: "translate3d(0,-100%,0)",
								transition: "all .35s linear"
							});
							break;
						}
				}
			}

			d = 0;
			setTimeout(function() {
				_opt.callback(nowIndex);
			}, time);
		});
	}
	window.Switch = (function(v, r){
		return {
			Vertical: function(type){
				return v[type];
			},
			Rotate: r
		}
	})([VirticalSwitch1, VirticalSwitch2], RotateSwitch);
})(
	window
    , window.navigator
	, document
	, (function(window) {
		var $ = function(_) {
			var Node = function(_) {
				var that = this,
					parentNode = document,
					type = $.type(_);
				this.qs = function(parent, _) {
					return parent.querySelector(_)
				}
				this.qsa = function(parent, _) {
					return parent.querySelectorAll(_)
				}

				if (/HTML\w+Element/.test(type)) {
					this.node = _
				} else if (type === "[object String]") {
					try {
						this.node = this.qs(parentNode, _)
					} catch (e) {
						throw e;
					}
				}

				if (this.node === null || this.node === undefined) {
					throw new Error("node " + _ + " is node exist!");
				};

				this._addClass = function(ele, classNames) {
					var initialClassName = ele.className;
					var classNameArr = classNames;
					var _classNames = [];
					if ($.type(classNames) === "[object String]") {
						classNameArr = classNames.split(" ")
					} else if ($.type(classNames) !== "[object Array]") {
						return new Error("Type Error")
					}
					for (var i = 0; i < classNameArr.length; i++) {
						if (initialClassName === "" || !new RegExp(classNameArr[i], "g").test(initialClassName)) {
							_classNames.push(classNameArr[i])
						}
					};
					ele.setAttribute("class", initialClassName + " " + _classNames.join(" "));
				}
				this._removeClass = function(ele, classNames) {
					var initialClassName = ele.className;
					var classNameArr = classNames;
					if ($.type(classNames) === "[object String]") {
						classNameArr = classNames.split(",")
					} else if ($.type(classNames) !== "[object Array]") {
						return new Error("Type Error")
					}
					for (var n = 0, l = classNameArr.length; n < l; n++) {
						ele.setAttribute("class", initialClassName.toString().replace(new RegExp(classNameArr[n], "g"), ""));
					}
				}
				this._getComputedStyle = function() {
					if (arguments.length) {
						return +(/\d+/.exec(window.getComputedStyle(this.node)[arguments[0]])[0])
					}
					return window.getComputedStyle(this.node)
				}
				return {
					parentNode: parentNode,
					node: that.node,
					addClass: function(classNames) {
						that._addClass(this.node, classNames);
						return this
					},
					removeClass: function(classNames) {
						that._removeClass(this.node, classNames);
						return this
					},
					html: function() {
						if (arguments.length === 0) {
							return this.node.innerHTML;
						} else if (arguments.length === 1) {
							if ($.type(arguments[0]) === "[object String]") {
								this.node.innerHTML = arguments[0];
								return this;
							} else {
								throw new Error("参数类型错误");
							}
						}
					},
					css: function() {
						if (arguments.length === 1) {
							var o = arguments[0];
							if ($.type(o) === "[object String]") {
								return that._getComputedStyle(o)
							}
							if ($.type(o) === "[object Object]") {
								$.extend(this.node.style, o);
							};
						} else if (arguments.length === 2) {
							var key = arguments[0],
								val = arguments[1];
							if (this.node.style.hasOwnProperty(key)) {
								this.node.style[key] = val;
							};
						};
						return this;
					},
					children: function(_) {
						return that.qsa(this.node, _)
					},
					on: function(type, handler) {
						this.node.addEventListener(type, handler, false);
					}
				}
			}
			return new Node(_)
		}
		$.os = (function(navigator) {
			return /Android|iPhone/.exec(navigator.userAgent) && /Android|iPhone/.exec(navigator.userAgent)[0];
		})(window.navigator)
		$.type = function(_) {
			return Object.prototype.toString.call(_)
		}
		$.each = function(o, f) {
			for (var i in o) {
				if (o.hasOwnProperty(i) && i !== "length") {
					f(i, o[i])
				}
			}
		}
		$.extend = function(oldOne, newOne, deep) {
			var isDeep = deep || false;
			var type = $.type(newOne);
			if (isDeep) {
				for (var d in newOne) {
					switch (type) {
						case "[object String]":
						case "[object Number]":
						case "[object Boolean]":
							{
								oldOne[d] = newOne[d];
								return;
							}
						case "[object Array]":
							{
								oldOne[d] = [];
								for (var i = 0, l = newOne[d].length; i < l; i++) {
									oldOne[d].push(newOne[d][i]);
								};
								break;
							}
						case "[object Object]":
							{
								oldOne[d] = {};
								this.extend(oldOne[d], newOne[d], isDeep);
							}
					}
				}
				return oldOne;
			}
			switch (type) {
				case "[object String]":
				case "[object Number]":
				case "[object Boolean]":
					{
						oldOne = newOne;
						return;
					}
				case "[object Array]":
					{
						for (var i = 0, l = newOne.length; i < l; i++) {
							oldOne[i] = newOne[i];
							if (oldOne.length - 1 < i) {
								oldOne.push(newOne[i]);
							}
						};
						break;
					}
				case "[object Object]":
					{
						for (var i in newOne) {
							oldOne[i] = newOne[i];
						}
					}
			}
			return oldOne;
		}
		$.ajax = function(type, url, obj, callback, async) {
			var xhr = new XMLHttpRequest(),
				_async = async,
				_obj = obj || null;

			if ($.type(type) !== "[object String]") {
				throw new Error("参数类型错误");
			}
			if (/POST|GET/.exec(type.toUpperCase()) === null) {
				throw new Error("未知的参数:" + type);
			}

			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						callback(xhr.responseText)
					} else {
						callback("field", xhr.status)
					}
				}
			}
			if ($.type(_async) !== "[object Boolean]") {
				_async = true;
			}
			xhr.open(type, url, _async || true);
			xhr.send(_obj);
		}
		return $;
	})(window)
)