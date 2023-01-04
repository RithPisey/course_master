import { Request, Response } from "express";
import { prisma } from "../database";
import validator from "validator";
import { genPassword } from "../libs/Password";
import crypto from "crypto";

export async function registerUser(req: Request, res: Response) {
	const { name, email, password } = req.body;

	if (!validator.isEmail(email))
		return res.render("register", {
			errEmail: "You're not input your email.",
			errName: null,
			errPass: null,
			errConfirm: null,
		});
	if (
		validator.contains(password[0], "12345") ||
		validator.contains(password[0], "qwerty")
	) {
		return res.render("register", {
			errPass: "Don't input weak password!",
			errConfirm: null,
			errEmail: null,
			errName: null,
		});
	}

	if (!validator.equals(password[0], password[1])) {
		return res.render("register", {
			errConfirm: "We cannot confirm your password!",
			errName: null,
			errPass: null,
			errEmail: null,
		});
	}
	if (!validator.isLength(name, { min: 5, max: 30 })) {
		return res.render("register", {
			errName: "Your minimum name length must be 5 or maximum 30",
			errPass: null,
			errConfirm: null,
			errEmail: null,
		});
	}

	if (!validator.isLength(password[0], { min: 8, max: 22 })) {
		return res.render("register", {
			errPass: "Your minimum password length must be 8 or maximum 22",
			errConfirm: null,
			errEmail: null,
			errName: null,
		});
	}

	const hashPass = genPassword(password[0]);

	const person = await prisma.person.create({
		data: {
			fullname: name,
			email: email,
			hash: hashPass.hash,
			role_id: 2,
		},
	});

	if (person) {
		if (process.env.CSRF_SECRET) {
			const csrftoken = crypto
				.pbkdf2Sync(process.env.CSRF_SECRET, "", 10000, 64, "sha256")
				.toString("hex");
			return res.render("login", {
				csrfToken: csrftoken,
				success: true,
			});
		}
	} else {
		res.render("error", {
			errMsg: "We cannot register your account. Please try again!",
		});
	}
}

// Admin | admin
// Heng Pisey | hengpisey
// Menghai | menghai12
