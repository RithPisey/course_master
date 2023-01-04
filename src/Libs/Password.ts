import crypto from "crypto";

interface pass {
	hash: string;
}

function genPassword(password: string): pass {
	let genHash = crypto
		.pbkdf2Sync(password, "", 10000, 64, "sha256")
		.toString("hex");
	return {
		hash: genHash,
	};
}
function validPassword(password: string, hash: string): boolean {
	let hashVerify = crypto
		.pbkdf2Sync(password, "", 10000, 64, "sha256")
		.toString("hex");
	return hash === hashVerify;
}
// admin hash: 2794d978af97bb5569f9117653262d4ff31a837e9ea508b56a441505cf58c0b6e05caa9a7322b967abb4c2a6bbfe866e7cfbd848d9958f5684a44d01ab75e6a8
export { genPassword, validPassword };
