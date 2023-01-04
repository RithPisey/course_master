import express from "express";
import session from "express-session";
import cookiesParser from "cookie-parser";
import { PublicController } from "./controllers/public.controller";
import path from "path";
import { LoginController } from "./controllers/Login.controller";
import { DashboardController } from "./controllers/Dashboard.controller";
import { authenticateToken } from "./securitys/JWT";
import { ProfileController } from "./controllers/profile.controller.";
import { CourseMngController } from "./controllers/Course.controller";

export class Application {
	private _app: express.Application;
	private homeController: PublicController;
	private loginController: LoginController;
	private dashboardController: DashboardController;
	private profileController: ProfileController;
	private courseMngController: CourseMngController;

	constructor() {
		this._app = express();
		this.config();
		this.homeController = new PublicController();
		this.loginController = new LoginController();
		this.dashboardController = new DashboardController();
		this.profileController = new ProfileController();
		this.courseMngController = new CourseMngController();
		this.routController();
	}

	private instatiate() {}

	private routController() {
		this._app.use(this.dashboardController.router);
		this._app.use(this.homeController.router);
		this._app.use(this.loginController.router);
		this._app.use(this.profileController.router);
		this._app.use(this.courseMngController.router);
	}

	private config() {
		this._app.use(express.static(path.join(__dirname + "/public")));
		// this._app.use(express.static("public/Doc"));
		this._app.set("views", path.join(__dirname + "/views"));
		this._app.set("view engine", "ejs");
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: false }));
		this._app.use(cookiesParser());
		this._app.use(
			session({
				secret: ["any long secret key"],
				resave: false,
				saveUninitialized: false,
				cookie: {
					maxAge: 1000 * 60 * 60 * 24 * 14,
					httpOnly: true,
					secure: false,
					sameSite: true,
				},
			})
		);
	}

	public get app(): express.Application {
		return this._app;
	}
}
