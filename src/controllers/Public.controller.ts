import { Router } from "express";
import { fetchCourse, fetchCourseLimit } from "../services/course.service";
import { authenticateToken, isLogined } from "../securitys/JWT";

export class PublicController {
	private _router: Router;
	constructor() {
		this._router = Router();
		this.setRoutes();
	}

	private setRoutes() {
		this._router
			.get("/", isLogined("index", fetchCourseLimit))
			.get("/courses", isLogined("courses", fetchCourse))
			.get("/about", isLogined("about"), (_, res) => {
				res.render("about");
			})
			.get("/contact", isLogined("contact"), (_, res) => {
				res.render("contact");
			})
			.get("/error", isLogined("error"), (_, res) => {
				res.render("error");
			});
	}

	public get router() {
		return this._router;
	}
}
