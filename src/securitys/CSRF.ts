import csrf from "csrf";
import crypto from "crypto";
import { Request, Response } from "express";

const CSRF = new csrf();

export function csrfToken() {
	return (req: Request, res: Response) => {
		if (process.env.CSRF_SECRET) {
			const csrftoken = crypto
				.pbkdf2Sync(process.env.CSRF_SECRET, "", 10000, 64, "sha256")
				.toString("hex");
			return res.render("login", {
				csrfToken: csrftoken,
				success: false,
			});
		}
	};
}

export function verifyCsrf(token: string): boolean {
	if (process.env.CSRF_SECRET) {
		const csrftoken = crypto
			.pbkdf2Sync(process.env.CSRF_SECRET, "", 10000, 64, "sha256")
			.toString("hex");
		if (token == csrftoken + " ") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}
