import { Request, Response } from "express";
import { prisma } from "../database";
import validator from "validator";
import { genPassword } from "../libs/Password";
import crypto from "crypto";

export async function updateProfile(req: Request, res: Response) {
	const { name, email, password } = req.body;

	if (!validator.isEmail(email))
		return res.render("profile", {
			auth: true,
			profile: { email: email, fullname: name, password: password.trim() },
			errEmail: "You're not input your email.",
			errName: null,
			errPass: null,
		});
	if (
		validator.contains(password, "12345") ||
		validator.contains(password, "qwerty ")
	) {
		return res.render("profile", {
			auth: true,
			profile: { email: email, fullname: name, password: password.trim() },

			errPass: "Don't input weak password!",
			errEmail: null,
			errName: null,
		});
	}

	if (!validator.isLength(name, { min: 5, max: 30 })) {
		return res.render("profile", {
			auth: true,
			profile: { email: email, fullname: name, password: password.trim() },

			errName: "Your minimum name length must be 5 or maximum 30",
			errPass: null,
			errEmail: null,
		});
	}

	if (!validator.isLength(password, { min: 8, max: 22 })) {
		return res.render("profile", {
			auth: true,
			profile: { email: email, fullname: name, password: password.trim() },

			errPass: "Your minimum password length must be 8 or maximum 22",
			errEmail: null,
			errName: null,
		});
	}

	const hashPass = genPassword(password.trim());

	const person = await prisma.person.update({
		data: {
			fullname: name,
			hash: hashPass.hash,
			email: email,
		},
		where: {
			email: email,
		},
	});

	if (person) {
		if (process.env.CSRF_SECRET) {
			const csrftoken = crypto
				.pbkdf2Sync(process.env.CSRF_SECRET, "", 10000, 64, "sha256")
				.toString("hex");
			res.clearCookie("usertoken");
			return res.render("login", {
				csrfToken: csrftoken,
				success: true,
			});
		}
	} else {
		res.render("error", {
			errMsg: "We cannot update your account. Please try again!",
		});
	}
}
