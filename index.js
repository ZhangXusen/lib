#!/usr/bin/env node
const { program } = require("commander");
const helpOptions = require("./core/help-options");
const download = require("download-git-repo");
const { spawn } = require("child_process");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
helpOptions();

//增加其他功能:创建项目模板
program
	.command("create <project> [...others]")
	.description("创建项目，如zxscli create my-project")
	.action(async function (project) {
		console.log("创建了一个项目:", project);

		try {
			//从github clone项目模板
			await download(
				"direct:https://github.com/coderwhy/vue3_template.git#main",
				project,
				{
					clone: true,
				}
			);
			//执行npm i
			await execCommand("npm.cmd", ["install"], { cwd: `./${project}` });
			//执行npm run dev
			await execCommand("npm.cmd", ["run", "dev"], { cwd: `./${project}` });
		} catch (err) {
			console.log("github连接失败");
		}
	});

//通过命令创建组件
program
	.command("addcpn <cpn>")
	.description("创建组件:zxscli addcpn name -d src/components")
	.action(addComponentAction(cpn));

//commander解析argv参数
program.parse(process.argv);

//执行cmd命令
function execCommand(...args) {
	return new Promise((resolve) => {
		//开启子进程，并执行命令
		const childProcess = spawn(...args);
		//获取子进程输出及错误信息
		childProcess.stdout.pipe(process.stdout);
		childProcess.stderr.pipe(process.stderr);
		//监听子进程执行结束,关闭
		childProcess.on("close", () => {
			resolve();
		});
	});
}
//创建组件
async function addComponentAction(name) {
	//先写好组件的模板，再根据内容给模板填充数据
	//				用户是否指定目录，没有则使用默认目录
	const destPath = program.opts.dest || "src/components";
	const res = await compileEjs("component.vue.ejs", { name: "zxs" });
	//将模板写入到对应的文件夹中
	await writeFile(`${destPath}/${name}.vue`, res);
}

//给模板填充数据
function compileEjs(tempName, data) {
	return new Promise((resolve, reject) => {
		//获取模板路径
		const tempPath = `./template/${tempName}`;
		const absPath = path.resolve(__dirname, tempPath);
		ejs.renderFile(absPath, data, (err, res) => {
			if (err) {
				console.log("编译失败", err);
				reject(err);
				return;
			}
			resolve(res);
		});
	});
}
//写入文件
function writeFile(path, data) {
	return fs.promises.writeFile(path, data);
}
