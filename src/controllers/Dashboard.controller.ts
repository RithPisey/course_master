import { Request, Response, Router } from "express";
import { authenticateToken, isLogined } from "../securitys/JWT";

export class DashboardController {
	private _router: Router;
	constructor() {
		this._router = Router();
		this.setRoutes();
	}

	private setRoutes() {
		this._router.get("/dashboard", authenticateToken, (_, res) => {
			res.render("dashboard", { auth: true, profile: res.locals.profile });
		});
		// this._router.get(
		// 	"/dashboard",
		// 	authenticateToken,
		// 	isLogined("courses", (_: Request, res: Response, auth: boolean): any => {
		// 		res.render("dashboard", { auth: auth });
		// 	})
		// );
	}

	public get router() {
		return this._router;
	}
}
