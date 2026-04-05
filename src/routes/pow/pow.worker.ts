self.onmessage = async (e) => {
	const { nonce, difficulty } = e.data;

	const encoder = new TextEncoder();
	const prefixBytes = encoder.encode("bssync+" + nonce);

	const workBuffer = new Uint8Array(prefixBytes.length + 8);
	workBuffer.set(prefixBytes);

	const counterView = new DataView(workBuffer.buffer, prefixBytes.length, 8);
	let counter = 0n;

	const fullBytes = Math.floor(difficulty / 8);
	const remainingBits = difficulty % 8;
	const remainingThreshold = Math.pow(2, 8 - remainingBits);

	while (true) {
		counterView.setBigUint64(0, counter, false);

		const hashBuffer = await self.crypto.subtle.digest(
			"SHA-256",
			workBuffer,
		);
		const hashBytes = new Uint8Array(hashBuffer);

		let isMatch = true;
		for (let i = 0; i < fullBytes; i++) {
			if (hashBytes[i] !== 0) {
				isMatch = false;
				break;
			}
		}

		if (isMatch && remainingBits > 0) {
			if (hashBytes[fullBytes] >= remainingThreshold) isMatch = false;
		}

		if (isMatch) {
			const hashHex = Array.from(hashBytes)
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
			self.postMessage({
				type: "done",
				answer: counter.toString(),
				hash: hashHex,
			});
			break;
		}

		if (counter % 256n === 2n) {
			const hashHex = Array.from(hashBytes)
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
			self.postMessage({ type: "progress", hash: hashHex });
		}

		counter++;
	}
};
