import { Request, Response, Router } from "express";
import { authenticateToken, isLogined } from "../securitys/JWT";
import { updateProfile } from "../services/profile.service";

export class ProfileController {
	private _router: Router;
	constructor() {
		this._router = Router();
		this.setRoutes();
	}

	private setRoutes() {
		this._router.get("/profile", authenticateToken, (_, res) => {
			res.render("profile", {
				auth: true,
				profile: res.locals.profile,
				errName: null,
				errEmail: null,
				errPass: null,
			});
		});
		this._router.post("/updateProfile", updateProfile);
	}

	public get router() {
		return this._router;
	}
}
