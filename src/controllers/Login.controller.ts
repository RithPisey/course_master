import { Request, Response, Router } from "express";
import { tokenAuthenticate } from "../securitys/JWT";
import { csrfToken } from "../securitys/CSRF";
import { registerUser } from "../services/register.service";

export class LoginController {
	private _router = Router();

	constructor() {
		this.setRoutes();
	}

	public setRoutes() {
		this.router.get("/login", csrfToken());
		this.router.post("/login", tokenAuthenticate({ success: "dashboard" }));
		this.router.get("/register", (req: Request, res: Response) => {
			return res.render("register", {
				errName: null,
				errPass: null,
				errConfirm: null,
				errEmail: null,
			});
		});
		this.router.post("/register", registerUser);
		this.router.get("/logout", (req: Request, res: Response) => {
			res.clearCookie("usertoken").redirect("/");
		});
	}

	public get router() {
		return this._router;
	}
}
