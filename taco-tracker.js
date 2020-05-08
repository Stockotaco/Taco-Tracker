const taco = {
	track: function tacoEvent(event, data) {
		const i = 200; // represents the interval in milliseconds for checking if variables are defined
		const maxTries = (8 * 1000) / i; // Set max timeout for searching for variables

		// Track funenlytics events if the data argument is an object
		if (typeof data === 'object') {
			const dlEvent = function () {
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({
					event: `t-${event}`,
					data,
				});
				console.log(`t-${event} dataLayer event sent`);
			};
			dlEvent();
			try {
				window.funnelytics.events.trigger(event, data);
			} catch (error) {
				let tries = 0;
				const checker = window.setInterval(function () {
					tries++;
					if (tries === maxTries) {
						window.clearInterval(checker);
						return;
					}
					if (!window.funnelytics) {
						// console.log('searching for window.funnelytics');
						return;
					}
					if (!window.funnelytics.step) {
						// console.log('searching for window.funnelytics.step');
						return;
					}
					window.funnelytics.events.trigger(event, data);
					window.clearInterval(checker);
				}, i);
			}
		} else {
			console.log(
				`Funnelytics expected an object for the 'data' argument. Instead a(n) ${typeof data} was passed to the argument.`
			);
		}

		// Track Convertful events
		try {
			Convertful.trigger(event);
		} catch (error) {
			let tries = 0;
			// console.error(error);
			const checker = window.setInterval(function () {
				tries++;
				if (tries === maxTries) {
					window.clearInterval(checker);
					return;
				}
				if (!window.Convertful) {
					// console.log('searching for window.convertful');
					return;
				}
				Convertful.trigger(event);
				window.clearInterval(checker);
			}, i);
		}

		// Track Omniconvert event
		try {
			_mktz.push(['_Goal', event, data]);
		} catch (error) {
			let tries = 0;
			// console.error(error);
			const checker = window.setInterval(function () {
				tries++;
				if (tries === maxTries) {
					window.clearInterval(checker);
					return;
				}
				if (!window.mktz_$) {
					// console.log('searching for window.mktz_$');
					return;
				}
				_mktz.push(['_Goal', event, data]);
				window.clearInterval(checker);
			}, i);
		}
	},
};
