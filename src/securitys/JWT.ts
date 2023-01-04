import { NextFunction, Request, Response } from "express";
import { validPassword } from "../libs/Password";
import { generateAccessToken } from "./GenerateToken";
import { prisma } from "../database";
import { verifyCsrf } from "./CSRF";
import jwt from "jsonwebtoken";

interface opt {
	success?: string | null;
	failure?: string | null;
}

export function tokenAuthenticate(option: opt) {
	return loginToken(option.success, option.failure);
}
function loginToken(
	success: string | null = null,
	failure: string | null = null
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const email = req.body.email;
		const pass = req.body.password;
		const csrfToken = req.body.csrfToken;

		if (verifyCsrf(csrfToken)) {
			const person = await prisma.person.findUnique({
				where: { email: email },
				select: {
					hash: true,
					email: true,
					fullname: true,
					role: { select: { role: true } },
				},
			});

			const valid = validPassword(pass, person?.hash || "");
			if (valid && person) {
				const accessToken = generateAccessToken({
					fullname: person.fullname,
					email: person.email,
					password: pass,
					role: person.role,
				});
				if (success) {
					return res
						.cookie("usertoken", accessToken, {
							maxAge: 1000 * 60 * 60 * 24 * 2,
							httpOnly: true,
							secure: false, //https only
							sameSite: true, //same domain
						})
						.render(success, { profile: person, auth: true });
				}
			} else {
				return res.render("error", {
					errMsg: "Email or Password incorrect.",
					auth: false,
				});
			}
		} else {
			return res.render("error", {
				errMsg: "Not valid user.",
				auth: false,
			});
		}
	};
}

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.cookies.usertoken;

	if (token && process.env.ACCESS_TOKEN_SECRET) {
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			(err: any, user: any) => {
				if (err)
					return res.sendStatus(401).render("error", {
						errMsg: "Something wrong with your authentication!",
						auth: false,
					});
				res.locals.profile = user;
				return next();
			}
		);
	} else {
		return res.status(401).render("loginfirst", { auth: false });
	}
}

export function isLogined(
	rout: string,
	callback?: (req: Request, res: Response, auth: boolean) => Promise<any>
) {
	return (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies.usertoken;

		if (token && process.env.ACCESS_TOKEN_SECRET) {
			jwt.verify(
				token,
				process.env.ACCESS_TOKEN_SECRET,
				(err: any, user: any) => {
					if (callback) {
						if (err) {
							return callback(req, res, false);
						} else {
							return callback(req, res, true);
						}
					} else if (err) {
						return res.render(rout, {
							auth: false,
						});
					} else {
						return res.render(rout, {
							auth: true,
						});
					}
				}
			);
		} else {
			if (callback) {
				return callback(req, res, false);
			} else {
				return res.render(rout, {
					auth: false,
				});
			}
		}
	};
}
