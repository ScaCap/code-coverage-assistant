import fs, { promises } from "fs";
import core from "@actions/core";
import github from "@actions/github";
import path from "path";
import { parse } from "./lcov";
import { diff, diffForMonorepo } from "./comment";
import { upsertComment } from "./github";

/**
 * Find all files inside a dir, recursively.
 * @function getLcovFiles
 * @param  {string} dir Dir path string.
 * @return {string[{<package_name>: <path_to_lcov_file>}]} Array with lcove file names with package names as key.
 */
const getLcovFiles = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? getLcovFiles(path.join(dir, file), filelist)
			: filelist
					.filter(file => {
						return file.path.includes("lcov.info");
					})
					.concat({
						name: dir.split("/")[1],
						path: path.join(dir, file),
					});
	});
	return filelist;
};

/**
 * Find all files inside a dir, recursively for base branch.
 * @function getLcovBaseFiles
 * @param  {string} dir Dir path string.
 * @return {string[{<package_name>: <path_to_lcov_file>}]} Array with lcove file names with package names as key.
 */
const getLcovBaseFiles = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? getLcovBaseFiles(path.join(dir, file), filelist)
			: filelist
					.filter(file => {
						return file.path.includes("lcov-base.info");
					})
					.concat({
						name: dir.split("/")[1],
						path: path.join(dir, file),
					});
	});
	return filelist;
};

async function main() {
	const { context = {} } = github || {};

	const token = core.getInput("github-token");
	const lcovFile = core.getInput("lcov-file") || "./coverage/lcov.info";
	const baseFile = core.getInput("lcov-base");
	// Add base path for monorepo
	const monorepoBasePath = core.getInput("monorepo-base-path");

	const raw = await promises.readFile(lcovFile, "utf-8").catch(err => null);
	if (!raw) {
		console.log(`No coverage report found at '${lcovFile}', exiting...`);
		return;
	}

	const baseRaw =
		baseFile && (await promises.readFile(baseFile, "utf-8").catch(err => null));
	if (baseFile && !baseRaw) {
		console.log(`No coverage report found at '${baseFile}', ignoring...`);
	}

	let lcovArray = monorepoBasePath ? getLcovFiles(monorepoBasePath) : [];
	let lcovBaseArray = monorepoBasePath
		? getLcovBaseFiles(monorepoBasePath)
		: [];

	const lcovArrayForMonorepo = [];
	const lcovBaseArrayForMonorepo = [];
	for (const file of lcovArray) {
		if (file.path.includes(".info")) {
			const raw = await promises.readFile(file.path, "utf8");
			const data = await parse(raw);
			lcovArrayForMonorepo.push({
				packageName: file.name,
				lcov: data,
			});
		}
	}

	for (const file of lcovBaseArray) {
		if (file.path.includes(".info")) {
			const raw = await promises.readFile(file.path, "utf8");
			const data = await parse(raw);
			lcovBaseArrayForMonorepo.push({
				packageName: file.name,
				lcov: data,
			});
		}
	}

	const options = {
		repository: context.payload.repository.full_name,
		commit: context.payload.pull_request.head.sha,
		prefix: `${process.env.GITHUB_WORKSPACE}/`,
		head: context.payload.pull_request.head.ref,
		base: context.payload.pull_request.base.ref,
	};

	const lcov = await parse(raw);
	const baselcov = baseRaw && (await parse(baseRaw));

	const client = github.getOctokit(token);

	await upsertComment({
		client,
		context,
		prNumber: context.payload.pull_request.number,
		body: !lcovArrayForMonorepo.length
			? diff(lcov, baselcov, options)
			: diffForMonorepo(
					lcovArrayForMonorepo,
					lcovBaseArrayForMonorepo,
					options,
			  ),
	});
}

main().catch(function(err) {
	console.log(err);
	core.setFailed(err.message);
});
