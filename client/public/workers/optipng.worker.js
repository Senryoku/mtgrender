(function () {
	// import optipng script.
	importScripts("optipng.js");

	// get stdout
	function print(text) {
		postMessage({ type: "stdout", data: text });
	}

	/* bind on message event handler */
	onmessage = function (event) {
		var message = event.data;
		if (message.type === "command") {
			var args = message.arguments;

			postMessage({
				type: "start",
				data: JSON.stringify(args),
			});

			print("Received command: " + JSON.stringify(args));
			optipng(message.file.data, args, print);
		}
	};
	postMessage({ type: "ready" });
})();
