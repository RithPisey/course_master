import { Request, Response } from "express";
import { prisma } from "../database";

export async function fetchCourse(req: Request, res: Response, auth?: boolean) {
	const courses = await prisma.course.findMany({ include: { category: true } });
	// console.log(courses);
	res.render("courses", { courses: courses, auth: auth });
}

export async function fetchCourseLimit(
	req: Request,
	res: Response,
	auth?: boolean
): Promise<any> {
	const courses = await prisma.course.findMany({
		include: { category: true },
		take: 4,
	});
	return res.render("index", { courses: courses, auth: auth });
}
