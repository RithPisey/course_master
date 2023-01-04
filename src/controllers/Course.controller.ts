import { Request, Response, Router } from "express";
import { authenticateToken, isLogined } from "../securitys/JWT";
import { prisma } from "../database";
export class CourseMngController {
	private _router: Router;
	constructor() {
		this._router = Router();
		this.setRoutes();
	}

	private setRoutes() {
		this._router.get("/courseMng", authenticateToken, async (_, res) => {
			const courses = await prisma.course.findMany({
				include: { category: true },
			});

			res.render("courseMng", { auth: true, courses: courses });
		});

		this._router.get("/courseMng/:cr", authenticateToken, async (req, res) => {
			const { cr } = req.query;
			const params = req.params["cr"];
			const categories = await prisma.category.findMany();

			if (params === "edit") {
				if (cr) {
					const courses = await prisma.course.findUnique({
						where: { course_id: Number.parseInt(cr.toString()) },
					});

					res.render("courseEdit", {
						auth: true,
						categories: categories,
						catid: courses?.category_id,
						course: {
							crid: courses?.course_id,
							name: courses?.name,
							description: courses?.description,
							price: courses?.price,
							avgRate: courses?.avgRate,
							image: courses?.image,
						},
					});
				} else {
					res.redirect("/courseMng");
				}
			} else if (params == "create") {
				res.render("courseEdit", {
					auth: true,
					categories: categories,
					course: {},
				});
			} else {
				res.redirect("/courseMng");
			}
		});
	}

	public get router() {
		return this._router;
	}
}
